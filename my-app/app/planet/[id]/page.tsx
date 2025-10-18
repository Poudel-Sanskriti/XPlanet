'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { PlanetHeader } from '@/components/PlanetHeader';
import { SpendingChart } from '@/components/SpendingChart';
import { CreditScoreGauge } from '@/components/CreditScoreGauge';
import { GoalProgressBars } from '@/components/GoalProgressBars';

// Import data
import spendingData from '@/data/spending.json';
import creditData from '@/data/credit.json';
import goalsData from '@/data/goals.json';

const planetInfo = {
  budget: {
    name: 'Budget Galaxy',
    color: '#ffd700',
    icon: '💰',
    tagline: 'Master Your Spending Orbit',
  },
  credit: {
    name: 'Credit Nebula',
    color: '#6a4c93',
    icon: '💳',
    tagline: 'Navigate Your Credit Universe',
  },
  goals: {
    name: 'Goals Constellation',
    color: '#1dd3b0',
    icon: '🎯',
    tagline: 'Chart Your Financial Destiny',
  },
};

export default function PlanetPage() {
  const params = useParams();
  const router = useRouter();
  const planetId = params.id as string;

  // Redirect if invalid planet
  if (!planetInfo[planetId as keyof typeof planetInfo]) {
    router.push('/constellation');
    return null;
  }

  const planet = planetInfo[planetId as keyof typeof planetInfo];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => router.push('/constellation')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 backdrop-blur-md border border-cyan-500/30 text-cyan-300 rounded-full hover:bg-gray-800 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Galaxy
        </button>
      </div>

      {/* Planet Header */}
      <PlanetHeader
        name={planet.name}
        icon={planet.icon}
        tagline={planet.tagline}
        color={planet.color}
      />

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {planetId === 'budget' && (
            <div className="space-y-8">
              <SpendingChart data={spendingData} />
            </div>
          )}

          {planetId === 'credit' && (
            <div className="space-y-8">
              <CreditScoreGauge data={creditData} />
            </div>
          )}

          {planetId === 'goals' && (
            <div className="space-y-8">
              <GoalProgressBars data={goalsData} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
