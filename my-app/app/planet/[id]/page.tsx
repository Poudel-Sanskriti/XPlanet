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
import { InvestmentPlanner } from '@/components/InvestmentPlanner';
import { getUserData, getUserMetrics } from '@/lib/userData';
import { usePlaidTransactions } from '@/hooks/usePlaidTransactions';
import { TransactionList } from '@/components/TransactionList';
import { PlaidLink } from '@/components/PlaidLink';

// Import fallback data
import insuranceData from '@/data/insurance.json';

const planetInfo = {
  budget: {
    name: 'Budgeting & Goals',
    color: '#ef4444',
    icon: '💰',
    tagline: 'Master Your Spending & Achieve Your Dreams',
  },
  investment: {
    name: 'Investment',
    color: '#fbbf24',
    icon: '📈',
    tagline: 'Grow Your Wealth with Smart Investing',
  },
  credit: {
    name: 'Credit & Loans',
    color: '#6a4c93',
    icon: '💳',
    tagline: 'Navigate Your Credit Universe',
  },
};

export default function PlanetPage() {
  const params = useParams();
  const router = useRouter();
  const planetId = params.id as string;
  const [userData, setUserData] = useState(getUserData());
  const [metrics, setMetrics] = useState(getUserMetrics(userData));

  // Fetch Plaid transactions
  const { transactions, spendingByCategory, loading: plaidLoading, refresh } = usePlaidTransactions();

  useEffect(() => {
    const data = getUserData();
    setUserData(data);
    setMetrics(getUserMetrics(data));
  }, []);

  // Redirect if invalid planet
  useEffect(() => {
    if (!planetInfo[planetId as keyof typeof planetInfo]) {
      router.push('/');
    }
  }, [planetId, router]);

  // Don't render if invalid planet
  if (!planetInfo[planetId as keyof typeof planetInfo]) {
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

  // Calculate all base values first (to avoid reference errors)
  const monthlyIncome = userData.income / 12;
  const totalSpent = Object.values(userData.expenses).reduce((sum, val) => sum + val, 0);
  const totalBudget = userData.income || totalSpent * 1.2; // Use income as budget, or 120% of expenses
  const minDebtPayment = (userData.debts.studentLoans * 0.01 + userData.debts.creditCards * 0.02) / 12; // Rough estimate
  const monthlyInvestable = Math.max(0, monthlyIncome - totalSpent - minDebtPayment);

  // Transform user data for spending chart
  const categoryColors: { [key: string]: string } = {
    rent: '#ef4444',
    utilities: '#f59e0b',
    food: '#10b981',
    transportation: '#3b82f6',
    entertainment: '#8b5cf6',
    other: '#6b7280',
  };

  const spendingData = {
    totalBudget,
    totalSpent,
    categories: Object.entries(userData.expenses).map(([name, amount]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      amount,
      budget: (totalBudget / Object.keys(userData.expenses).length), // Distribute budget evenly
      color: categoryColors[name] || '#6b7280',
    })),
    monthlyTrend: [
      { month: 'Jan', spent: totalSpent * 0.9, budget: totalBudget },
      { month: 'Feb', spent: totalSpent * 0.95, budget: totalBudget },
      { month: 'Mar', spent: totalSpent, budget: totalBudget },
    ],
  };

  // Transform user data for credit
  const totalCredit = 5000; // Assuming $5,000 total credit limit
  const usedCredit = userData.debts.creditCards || 0;
  const creditData = {
    score: userData.creditScore || 720,
    scoreHistory: [
      { month: 'Jan', score: (userData.creditScore || 720) - 20 },
      { month: 'Feb', score: (userData.creditScore || 720) - 15 },
      { month: 'Mar', score: (userData.creditScore || 720) - 10 },
      { month: 'Apr', score: (userData.creditScore || 720) - 5 },
      { month: 'May', score: userData.creditScore || 720 },
    ],
    utilization: Math.min(100, (usedCredit / totalCredit) * 100),
    accounts: Object.values(userData.debts).filter(v => v > 0).length,
    usedCredit: usedCredit,
    totalCredit: totalCredit,
    paymentHistory: 98, // 98% on-time payments
    averageAge: '3.5 years',
    tips: [
      {
        icon: '💳',
        title: 'Lower Credit Utilization',
        description: `Keep your credit card balance below 30% of your limit. Currently at ${Math.round((usedCredit / totalCredit) * 100)}%.`
      },
      {
        icon: '📅',
        title: 'Pay Bills On Time',
        description: 'Set up automatic payments to ensure you never miss a due date.'
      },
      {
        icon: '📊',
        title: 'Monitor Your Credit',
        description: 'Check your credit report regularly for errors or fraudulent activity.'
      },
      {
        icon: '⏰',
        title: 'Keep Old Accounts Open',
        description: 'The age of your credit history matters. Keep older accounts active.'
      }
    ]
  };

  // Transform user data for goals
  const totalSaved = userData.goals?.reduce((sum, goal) => sum + goal.current, 0) || 0;
  const totalTarget = userData.goals?.reduce((sum, goal) => sum + goal.target, 0) || 1;
  const goalsLength = userData.goals?.length || 1;
  const monthlyContribution = Math.max(0, monthlyInvestable) / goalsLength;

  const goalsData = {
    goals: (userData.goals || []).map((goal, index) => ({
      ...goal,
      id: `goal-${index}`,
      progress: Math.round((goal.current / goal.target) * 100),
      deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      color: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'][index % 4],
      icon: ['🎯', '✈️', '🏠', '🎓'][index % 4],
    })),
    totalSaved,
    totalTarget,
    monthlyContribution: Math.max(0, monthlyContribution),
  };

  // Investment data
  const yearlyInvestable = monthlyInvestable * 12;

  const investmentData = {
    monthlyInvestable,
    yearlyInvestable,
    monthlyIncome,
    totalExpenses: totalSpent,
    minDebtPayment,
    age: userData.age || 25,
    riskTolerance: (userData.age || 25) < 30 ? 'moderate-aggressive' : (userData.age || 25) < 50 ? 'moderate' : 'conservative',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 backdrop-blur-md border border-cyan-500/30 text-cyan-300 rounded-full hover:bg-gray-800 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
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
              {/* Plaid Connection Section */}
              {!userData.plaidConnected && (
                <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    📊 Connect Your Bank for Real-Time Tracking
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Automatically sync your transactions and get accurate spending insights without manual entry.
                  </p>
                  <PlaidLink onSuccess={refresh} />
                </div>
              )}

              {/* Show Plaid Transactions if connected */}
              {userData.plaidConnected && transactions.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-white">Recent Transactions</h2>
                    <button
                      onClick={refresh}
                      disabled={plaidLoading}
                      className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg border border-cyan-500/50 transition-all disabled:opacity-50"
                    >
                      {plaidLoading ? '🔄 Syncing...' : '🔄 Refresh'}
                    </button>
                  </div>
                  <TransactionList transactions={transactions} />
                </div>
              )}

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

          {planetId === 'investment' && (
            <div className="space-y-8">
              <InvestmentPlanner data={investmentData} />
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
