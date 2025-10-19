'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { PlanetHeader } from '@/components/PlanetHeader';
import { SpendingChart } from '@/components/SpendingChart';
import { CreditScoreGauge } from '@/components/CreditScoreGauge';
import { GoalProgressBars } from '@/components/GoalProgressBars';
import { InsuranceOverview } from '@/components/InsuranceOverview';
import { getUserData, getUserMetrics } from '@/lib/userData';

// Import fallback data
import insuranceData from '@/data/insurance.json';

const planetInfo = {
  budget: {
    name: 'Budgeting & Goals',
    color: '#ffd700',
    icon: '💰',
    tagline: 'Master Your Spending & Achieve Your Dreams',
  },
  credit: {
    name: 'Credit & Loans',
    color: '#6a4c93',
    icon: '💳',
    tagline: 'Navigate Your Credit Universe',
  },
  insurance: {
    name: 'Insurance',
    color: '#f4a460',
    icon: '🛡️',
    tagline: 'Protect Your Financial Future',
  },
};

export default function PlanetPage() {
  const params = useParams();
  const router = useRouter();
  const planetId = params.id as string;
  const [userData, setUserData] = useState(getUserData());
  const [metrics, setMetrics] = useState(getUserMetrics(userData));

  useEffect(() => {
    const data = getUserData();
    setUserData(data);
    setMetrics(getUserMetrics(data));
  }, []);

  // Redirect if invalid planet
  if (!planetInfo[planetId as keyof typeof planetInfo]) {
    router.push('/constellation');
    return null;
  }

  const planet = planetInfo[planetId as keyof typeof planetInfo];

  // Safety check for user data
  if (!userData || !userData.expenses || !userData.debts || !userData.goals) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Transform user data for spending chart
  const spendingData = {
    categories: Object.entries(userData.expenses).map(([name, amount]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      amount,
    })),
  };

  // Transform user data for credit
  const totalCredit = 5000; // Assuming $5,000 total credit limit
  const usedCredit = userData.debts.creditCards;
  const creditData = {
    score: userData.creditScore,
    utilization: Math.min(100, (usedCredit / totalCredit) * 100),
    accounts: Object.values(userData.debts).filter(v => v > 0).length,
    usedCredit: usedCredit,
    totalCredit: totalCredit,
  };

  // Transform user data for goals
  const goalsData = {
    goals: userData.goals.map(goal => ({
      ...goal,
      progress: Math.round((goal.current / goal.target) * 100),
    })),
  };

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
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Spending Overview</h2>
                <SpendingChart data={spendingData} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Financial Goals</h2>
                <GoalProgressBars data={goalsData} />
              </div>
            </div>
          )}

          {planetId === 'credit' && (
            <div className="space-y-8">
              <CreditScoreGauge data={creditData} />
            </div>
          )}

          {planetId === 'insurance' && (
            <div className="space-y-8">
              <InsuranceOverview data={insuranceData} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
