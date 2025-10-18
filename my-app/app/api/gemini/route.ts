import { NextRequest, NextResponse } from 'next/server';
import { askGemini } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required and must be a string' },
        { status: 400 }
      );
    }

    // Rate limiting check (simple - can be improved)
    // TODO: Implement proper rate limiting with Redis or similar

    // Call Gemini API
    const result = await askGemini(question);

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({
    message: 'Captain Gemini API is ready! Send a POST request with a question.',
    example: {
      method: 'POST',
      body: { question: 'How do I save money?' },
    },
  });
}
