const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'; // Sarah - Professional female voice
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

export interface VoiceGenerationResult {
  audio: ArrayBuffer;
  success: boolean;
  error?: string;
}

/**
 * Generate speech from text using ElevenLabs TTS
 */
export async function generateSpeech(text: string): Promise<VoiceGenerationResult> {
  try {
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key not configured');
    }

    // Call ElevenLabs text-to-speech API
    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2_5', // Latest fast model with high quality
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API Error:', errorText);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    // Get audio buffer
    const audioBuffer = await response.arrayBuffer();

    return {
      audio: audioBuffer,
      success: true,
    };
  } catch (error) {
    console.error('Voice generation error:', error);
    return {
      audio: new ArrayBuffer(0),
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get available voices (requires voices_read permission)
 */
export async function getVoices() {
  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch voices');
    }

    const data = await response.json();
    return data.voices || [];
  } catch (error) {
    console.error('Get voices error:', error);
    return [];
  }
}

/**
 * Get remaining character quota
 */
export async function getQuota() {
  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/user/subscription`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch quota');
    }

    const data = await response.json();
    return {
      characterCount: data.character_count || 0,
      characterLimit: data.character_limit || 10000,
      remaining: (data.character_limit || 10000) - (data.character_count || 0),
    };
  } catch (error) {
    console.error('Get quota error:', error);
    return null;
  }
}
