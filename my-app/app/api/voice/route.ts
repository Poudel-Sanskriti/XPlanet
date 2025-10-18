import { NextRequest, NextResponse } from 'next/server';
import { generateSpeech } from '@/lib/elevenlabs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    // Limit text length to avoid excessive API usage
    if (text.length > 500) {
      return NextResponse.json(
        { error: 'Text too long (max 500 characters)' },
        { status: 400 }
      );
    }

    // Generate speech
    const result = await generateSpeech(text);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate speech' },
        { status: 500 }
      );
    }

    // Return audio as MP3
    return new NextResponse(result.audio, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': result.audio.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('Voice API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({
    message: 'Captain Gemini Voice API is ready! Send a POST request with text.',
    example: {
      method: 'POST',
      body: { text: 'Welcome, Navigator!' },
    },
  });
}
