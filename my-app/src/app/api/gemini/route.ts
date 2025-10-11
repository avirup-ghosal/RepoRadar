import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
//     const models = await genAI.listModels();
// console.log(models);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(body.prompt);
    const response = await result.response;
    const text = await response.text(); 

    console.log("Gemini response:", text);

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
