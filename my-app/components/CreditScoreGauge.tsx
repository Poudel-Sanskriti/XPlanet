'use client';

import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, CreditCard, Calendar, Percent } from 'lucide-react';

interface CreditData {
  score: number;
  scoreHistory: Array<{
    month: string;
    score: number;
  }>;
  utilization: number;
  totalCredit: number;
  usedCredit: number;
  accounts: number;
  paymentHistory: number;
  averageAge: string;
  tips: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

interface CreditScoreGaugeProps {
  data: CreditData;
}

export function CreditScoreGauge({ data }: CreditScoreGaugeProps) {
  // Safety checks
  if (!data || typeof data.score === 'undefined') {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl p-6">
        <p className="text-gray-400">Loading credit data...</p>
      </div>
    );
  }
  // Determine score category
  const getScoreCategory = (score: number) => {
    if (score >= 800) return { text: 'Excellent', color: '#10b981' };
    if (score >= 740) return { text: 'Very Good', color: '#3b82f6' };
    if (score >= 670) return { text: 'Good', color: '#8b5cf6' };
    if (score >= 580) return { text: 'Fair', color: '#f59e0b' };
    return { text: 'Poor', color: '#ef4444' };
  };

  const scoreCategory = getScoreCategory(data.score);

  // Prepare gauge data
  const gaugeData = [
    {
      name: 'Score',
      value: (data.score / 850) * 100,
      fill: scoreCategory.color,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Score Gauge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/30 rounded-2xl p-8"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Your Credit Score</h2>
          <p className="text-gray-400">Out of 850</p>
        </div>

        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="100%"
              data={gaugeData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                background
                dataKey="value"
                cornerRadius={10}
              />
            </RadialBarChart>
          </ResponsiveContainer>

          <div className="text-center -mt-32 mb-24">
            <div className="text-6xl font-bold" style={{ color: scoreCategory.color }}>
              {data.score}
            </div>
            <div className="text-xl mt-2" style={{ color: scoreCategory.color }}>
              {scoreCategory.text}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Percent className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-gray-400">Utilization</span>
          </div>
          <div className="text-3xl font-bold text-white">{data.utilization}%</div>
          <div className="text-sm text-gray-500 mt-1">
            ${data.usedCredit.toLocaleString()} / ${data.totalCredit.toLocaleString()}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-400">Accounts</span>
          </div>
          <div className="text-3xl font-bold text-white">{data.accounts}</div>
          <div className="text-sm text-gray-500 mt-1">Active credit lines</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-400">Payment History</span>
          </div>
          <div className="text-3xl font-bold text-white">{data.paymentHistory}%</div>
          <div className="text-sm text-gray-500 mt-1">On-time payments</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-gray-400">Average Age</span>
          </div>
          <div className="text-2xl font-bold text-white">{data.averageAge}</div>
          <div className="text-sm text-gray-500 mt-1">Account history</div>
        </motion.div>
      </div>

      {/* Score History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Score History</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.scoreHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis domain={[600, 750]} stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Tips to Improve Your Score</h3>
        <div className="space-y-4">
          {data.tips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="flex gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-colors"
            >
              <div className="text-3xl">{tip.icon}</div>
              <div>
                <h4 className="text-white font-semibold mb-1">{tip.title}</h4>
                <p className="text-gray-400 text-sm">{tip.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
