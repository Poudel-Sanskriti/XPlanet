'use client';

import { useState, useEffect } from 'react';
import { User, Settings } from 'lucide-react';
import { getUserData } from '@/lib/userData';
import { useRouter } from 'next/navigation';

export function UserProfileBadge() {
  const [userData, setUserData] = useState(getUserData());
  const router = useRouter();

  useEffect(() => {
    setUserData(getUserData());
  }, []);

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="flex items-center gap-3 px-4 py-2 bg-gray-800/90 backdrop-blur-md border border-cyan-500/30 rounded-full">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="text-left">
          <div className="text-sm font-semibold text-white">{userData.name}</div>
          <div className="text-xs text-gray-400">Credit: {userData.creditScore}</div>
        </div>
        <button
          onClick={() => router.push('/profile')}
          className="ml-2 p-2 hover:bg-white/10 rounded-full transition-colors"
          title="Edit Profile"
        >
          <Settings className="w-4 h-4 text-cyan-400" />
        </button>
      </div>
    </div>
  );
}
