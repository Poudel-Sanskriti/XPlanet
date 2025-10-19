import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const TRANSLATION_PROMPT = `You are an expert financial document translator. Your job is to:

1. Read complex financial documents (bank statements, credit reports, loan agreements, etc.)
2. Explain them in simple, plain English that anyone can understand
3. Identify and explain financial jargon terms
4. Highlight important information like fees, interest rates, and terms
5. Point out anything that might be concerning or beneficial

Format your response as follows:

**DOCUMENT SUMMARY:**
[2-3 sentence overview of what this document is and its purpose]

**KEY TERMS EXPLAINED:**
[List each financial jargon term and explain it in plain English]

**IMPORTANT DETAILS:**
[Highlight fees, rates, deadlines, or anything the user should pay attention to]

**WHAT THIS MEANS FOR YOU:**
[Practical explanation of how this affects the user]

**RED FLAGS / CONCERNS:**
[Any concerning clauses, high fees, or things to watch out for - or "None identified" if clean]

**BOTTOM LINE:**
[One sentence summary: Is this good, bad, or neutral?]

Keep explanations simple, friendly, and actionable. Avoid using complex terms without explaining them.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentText } = body;

    if (!documentText || typeof documentText !== 'string') {
      return NextResponse.json(
        { error: 'Document text is required' },
        { status: 400 }
      );
    }

    if (documentText.length > 50000) {
      return NextResponse.json(
        { error: 'Document is too long. Please limit to 50,000 characters.' },
        { status: 400 }
      );
    }

    // Use Gemini to analyze the document
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: TRANSLATION_PROMPT,
    });

    const prompt = `Please analyze and explain this financial document in plain English:\n\n${documentText}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const explanation = response.text();

    return NextResponse.json({
      explanation,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Translation API Error:', error);
    return NextResponse.json(
      { error: 'Failed to translate document. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Document Translation API is ready!',
    usage: 'POST with { documentText: "your document content" }',
  });
}
