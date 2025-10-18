'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Howl } from 'howler';

interface VoicePlayerProps {
  text: string;
  autoPlay?: boolean;
}

export function VoicePlayer({ text, autoPlay = false }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState<Howl | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Generate audio when component mounts or text changes
  useEffect(() => {
    if (text && autoPlay) {
      handlePlay();
    }
    // Cleanup sound on unmount
    return () => {
      if (sound) {
        sound.unload();
      }
    };
  }, [text]);

  const generateAudio = async (): Promise<string> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      return url;
    } catch (error) {
      console.error('Error generating audio:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = async () => {
    try {
      // If we already have audio, just play it
      if (sound && audioUrl) {
        if (isPlaying) {
          sound.pause();
          setIsPlaying(false);
        } else {
          sound.play();
          setIsPlaying(true);
        }
        return;
      }

      // Generate new audio
      const url = await generateAudio();

      // Create and play sound
      const newSound = new Howl({
        src: [url],
        format: ['mp3'],
        onplay: () => setIsPlaying(true),
        onend: () => setIsPlaying(false),
        onstop: () => setIsPlaying(false),
        onpause: () => setIsPlaying(false),
        onerror: (id, error) => {
          console.error('Howler error:', error);
          setIsPlaying(false);
        },
      });

      setSound(newSound);
      newSound.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  return (
    <button
      onClick={handlePlay}
      disabled={isLoading}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30
                 border border-cyan-500/50 text-cyan-300 text-sm transition-all
                 disabled:opacity-50 disabled:cursor-not-allowed"
      title={isPlaying ? 'Stop speaking' : 'Play voice'}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating...</span>
        </>
      ) : isPlaying ? (
        <>
          <VolumeX className="w-4 h-4" />
          <span>Stop</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4" />
          <span>Play Voice</span>
        </>
      )}
    </button>
  );
}
