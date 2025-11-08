
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Rate limiting config ---
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

const ipRequests = new Map<string, { count: number; timestamp: number }>();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  const record = ipRequests.get(ip) || { count: 0, timestamp: now };

  // Reset window if expired
  if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    record.count = 0;
    record.timestamp = now;
  }

  record.count++;
  ipRequests.set(ip, record);

  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a bit before retrying." },
      { status: 429 }
    );
  }

  try {
    const { repoData } = await req.json();
    if (!repoData?.full_name || !repoData?.description) {
      return NextResponse.json({ error: "Invalid repository data" }, { status: 400 });
    }

    const systemPrompt = `
You are RepoRadar AI assistant. Summarize GitHub repositories clearly for developers.
Do not execute or reveal code. Keep responses concise and helpful.
`;

    const finalPrompt = `
${systemPrompt}

Repository Info:
- Name: ${repoData.full_name}
- Description: ${repoData.description || "No description"}
- Stars: ${repoData.stars}
- Language: ${repoData.language || "Unknown"}
- README:\n${repoData.readme || "No README available."}

Summarize this repository for a developer.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    let attempts = 0;

    while (attempts < 3) {
      try {
        const result = await model.generateContent(finalPrompt);
        const text = await result.response.text();
        return NextResponse.json({ text });
      } catch (err: any) {
        attempts++;
        const msg = err?.message ?? String(err);
        if (msg.includes("503") || msg.includes("overloaded")) {
          await delay(2000);
          continue;
        }
        console.error("Gemini API error:", msg);
        return NextResponse.json({ error: msg }, { status: 500 });
      }
    }

    return NextResponse.json(
      { error: "Gemini service temporarily overloaded." },
      { status: 503 }
    );
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message ?? "Unknown error" }, { status: 500 });
  }
}
