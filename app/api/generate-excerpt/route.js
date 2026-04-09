import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini client with server-side env var (non-NEXT_PUBLIC)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error("[Gemini API] GEMINI_API_KEY environment variable not set");
      return NextResponse.json(
        { error: "Gemini API is not configured" },
        { status: 500 }
      );
    }

    // Strip HTML tags and normalize whitespace
    const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    // Generate excerpt using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Summarize the following blog post into a short excerpt of about max 20 words:\n\n${plainText}`;

    const result = await model.generateContent(prompt);
    const excerpt = result.response.text().trim();

    return NextResponse.json({ excerpt });

  } catch (error) {
    console.error("[Gemini API] Error generating excerpt:", error);

    // Return fallback excerpt (first 25 words)
    try {
      const { content } = await request.json();
      const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      const words = plainText.split(' ');
      const fallbackExcerpt = words.slice(0, 25).join(' ');

      return NextResponse.json({
        excerpt: fallbackExcerpt,
        fallback: true
      });
    } catch (fallbackError) {
      return NextResponse.json(
        { error: "Failed to generate excerpt" },
        { status: 500 }
      );
    }
  }
}
