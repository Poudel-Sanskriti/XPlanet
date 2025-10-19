'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to chat page
    router.push('/chat');
  };

  // Generate stars once and keep them static (don't regenerate on re-render)
  const stars = useMemo(() => {
    return [...Array(150)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() < 0.7 ? 1 : Math.random() < 0.9 ? 2 : 3,
      delay: Math.random() * 3,
      opacity: Math.random() * 0.5 + 0.5,
    }));
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: '#000729' }}>
      {/* Starfield background - static positions */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              opacity: star.opacity,
              boxShadow: '0 0 3px rgba(255, 255, 255, 0.8), 0 0 6px rgba(255, 255, 255, 0.4)',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-16">
        {/* Logo */}
        <h1 className="text-6xl font-bold text-white tracking-wider">
          X<span className="text-star-blue">Planet</span>
        </h1>

        {/* Earth container with orbiting spaceship */}
        <div className="relative w-[500px] h-[500px] flex items-center justify-center">
          {/* Earth - bigger */}
          <div className="relative w-80 h-80 rounded-full bg-gradient-to-br from-blue-400 via-green-400 to-blue-600 shadow-2xl">
            {/* Earth glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-300/20 to-green-300/20 blur-xl animate-pulse" />

            {/* Continents (simple representation) */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div className="absolute top-12 left-16 w-20 h-16 bg-green-600/60 rounded-full" />
              <div className="absolute top-28 right-20 w-24 h-20 bg-green-700/60 rounded-full" />
              <div className="absolute bottom-16 left-24 w-18 h-14 bg-green-600/60 rounded-full" />
            </div>

            {/* Clouds */}
            <div className="absolute inset-0 rounded-full">
              <div className="absolute top-20 right-16 w-16 h-8 bg-white/30 rounded-full blur-sm" />
              <div className="absolute bottom-28 left-20 w-20 h-10 bg-white/30 rounded-full blur-sm" />
            </div>
          </div>

          {/* Orbiting Gemini spaceship - farther away with tangential orientation */}
          <div className="absolute inset-0" style={{ animation: 'orbit 20s linear infinite' }}>
            <div className="relative w-full h-full">
              {/* Spaceship - positioned farther from planet */}
              <div
                className="absolute -top-12 left-1/2 -translate-x-1/2"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(66, 133, 244, 0.8))',
                  transform: 'translateX(-50%) rotate(90deg)', // Rotate 90deg to make nose point tangentially
                }}
              >
                {/* Spaceship body */}
                <div className="relative">
                  {/* Main body - Gemini blue gradient */}
                  <div className="w-6 h-10 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 rounded-t-full relative">
                    {/* Window */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-200 rounded-full border border-blue-300" />
                  </div>

                  {/* Wings */}
                  <div className="absolute bottom-2 -left-3 w-3 h-6 bg-gradient-to-r from-purple-400 to-blue-400 transform -skew-y-12" />
                  <div className="absolute bottom-2 -right-3 w-3 h-6 bg-gradient-to-l from-purple-400 to-blue-400 transform skew-y-12" />

                  {/* Flame/exhaust */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3 h-4 bg-gradient-to-b from-orange-400 via-yellow-400 to-transparent rounded-b-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Orbit path (subtle) - larger circle */}
          <div className="absolute inset-[-60px] border-2 border-dashed border-white/10 rounded-full" />
        </div>

        {/* Search box */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl px-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask Captain Gemini anything about finances..."
              className="w-full px-8 py-6 text-lg text-white bg-white/10 backdrop-blur-md border-2 border-star-blue/30 rounded-full focus:outline-none focus:border-star-blue focus:ring-4 focus:ring-star-blue/20 placeholder-white/50 transition-all shadow-lg"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg font-medium"
            >
              Launch 🚀
            </button>
          </div>
        </form>

        {/* Tagline */}
        <p className="text-white/70 text-center text-lg max-w-md">
          Navigate your financial galaxy with AI-powered guidance
        </p>

        {/* Quick Links */}
        <div className="flex gap-4 mt-4">
          <Link
            href="/constellation"
            className="px-6 py-3 bg-purple-600/20 backdrop-blur-md border border-purple-400/30 text-purple-200 rounded-full hover:bg-purple-600/30 hover:border-purple-400/50 transition-all shadow-lg font-medium"
          >
            🌌 View Galaxy Map
          </Link>
          <Link
            href="/chat"
            className="px-6 py-3 bg-cyan-600/20 backdrop-blur-md border border-cyan-400/30 text-cyan-200 rounded-full hover:bg-cyan-600/30 hover:border-cyan-400/50 transition-all shadow-lg font-medium"
          >
            💬 Chat with Captain
          </Link>
        </div>
      </div>

      {/* Custom CSS for orbit animation with rotation */}
      <style jsx>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
