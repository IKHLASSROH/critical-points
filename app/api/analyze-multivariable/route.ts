import { NextResponse } from "next/server";
import { analyzeFunction } from "@/lib/math-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { function: funcStr } = body;

    if (!funcStr || typeof funcStr !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid function string" },
        { status: 400 }
      );
    }

    // Sanitize input - remove potentially dangerous patterns
    const sanitized = funcStr
      .replace(/[;`$]/g, "")
      .trim()
      .slice(0, 500); // Limit length

    if (!sanitized) {
      return NextResponse.json(
        { error: "Function string is empty after sanitization" },
        { status: 400 }
      );
    }

    const result = analyzeFunction(sanitized);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze function. Please check your input." },
      { status: 500 }
    );
  }
}
