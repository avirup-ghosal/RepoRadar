import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// simple delay utility for retry
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // retry up to 3 times if the model is overloaded (503)
    let attempts = 0;
    let lastError: any;

    while (attempts < 3) {
      try {
        const result = await model.generateContent(body.prompt);
        const response = await result.response;
        const text = await response.text();

        console.log("Gemini response:", text);
        return NextResponse.json({ text });
      } catch (err: any) {
        attempts++;
        const msg = err?.message || "";

        // handle transient model overloads
        if (msg.includes("503") || msg.includes("overloaded")) {
          console.warn(`Gemini model overloaded (attempt ${attempts}/3). Retrying...`);
          lastError = err;
          await delay(2000); // wait 2 seconds before retry
          continue;
        }

        // handle invalid API key or 4xx errors
        if (msg.includes("API key not valid") || msg.includes("401")) {
          return NextResponse.json(
            { error: "Invalid Gemini API key or unauthorized access." },
            { status: 401 }
          );
        }

        // handle any other type of error immediately
        lastError = err;
        break;
      }
    }

    // if all retries fail
    return NextResponse.json(
      { error: "Gemini model is overloaded. Please try again later." },
      { status: 503 }
    );

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
