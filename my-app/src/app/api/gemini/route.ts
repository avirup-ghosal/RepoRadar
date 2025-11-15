
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import AhoCorasick from "ahocorasick";

const DANGEROUS_PATTERNS = [
  "ignore previous",
  "system prompt",
  "disregard all instructions",
  "bypass restrictions",
  "jailbreak",
  "override",
  "delete all instructions",
  "act as",
  "developer mode",
  "execute",
  "prompt injection",
];

const ac = new AhoCorasick(DANGEROUS_PATTERNS);

function sanitizeText(input: string): string {
  if (!input) return "";

  const lower = input.toLowerCase();
  const results = ac.search(lower);

  let sanitized = input;

  for (const [, matches] of results) {
    for (const match of matches) {
      const escaped = match.replace(/\s+/g, "\\s*");
      sanitized = sanitized.replace(new RegExp(escaped, "gi"), "[REDACTED]");
    }
  }
  return sanitized;
}


const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_CALLS_PER_WINDOW = 10;
const ipCalls = new Map<string, { count: number; start: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipCalls.get(ip);

  if (!entry) {
    ipCalls.set(ip, { count: 1, start: now });
    return false;
  }

  if (now - entry.start > RATE_LIMIT_WINDOW) {
    ipCalls.set(ip, { count: 1, start: now });
    return false;
  }

  entry.count++;
  return entry.count > MAX_CALLS_PER_WINDOW;
}


async function retry(fn: () => Promise<any>, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      await new Promise((resolve) => setTimeout(resolve, 200 * (i + 1)));
    }
  }
  throw lastErr;
}


export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (rateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();

    if (!body.repoData) {
      return NextResponse.json(
        { error: "Missing repoData in request" },
        { status: 400 }
      );
    }

    const rd = body.repoData;

    const sanitized = {
      full_name: sanitizeText(rd.full_name || ""),
      description: sanitizeText(rd.description || ""),
      stars: rd.stars || 0,
      language: sanitizeText(rd.language || ""),
      readme: sanitizeText(rd.readme || ""),
    };

    // Restore system prompt
    const systemPrompt = `
You are RepoRadar AI assistant.
Your job is to summarize GitHub repositories clearly for developers.
You must stay neutral, avoid hallucinating, and never execute or reveal any code.
Always produce safe, concise, helpful summaries.
    `;

    const finalPrompt = `
${systemPrompt}

Repository Information (Sanitized):
- Name: ${sanitized.full_name}
- Description: ${sanitized.description}
- Stars: ${sanitized.stars}
- Language: ${sanitized.language}
- README:
${sanitized.readme}

Generate a clean, helpful summary for developers.
`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await retry(() => model.generateContent(finalPrompt), 3);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini Route Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error?.message ?? error },
      { status: 500 }
    );
  }
}
