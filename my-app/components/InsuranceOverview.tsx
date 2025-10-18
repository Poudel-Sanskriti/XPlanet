'use client';

import { motion } from 'framer-motion';
import { Shield, TrendingUp, AlertCircle } from 'lucide-react';

interface Policy {
  id: string;
  name: string;
  provider: string;
  premium: number;
  coverage: number;
  status: string;
  icon: string;
}

interface Recommendation {
  title: string;
  description: string;
  potential: number;
  icon: string;
}

interface SavingsTip {
  icon: string;
  title: string;
  description: string;
}

interface InsuranceData {
  policies: Policy[];
  totalMonthlyPremium: number;
  totalCoverage: number;
  recommendations: Recommendation[];
  savingsTips: SavingsTip[];
}

interface InsuranceOverviewProps {
  data: InsuranceData;
}

export function InsuranceOverview({ data }: InsuranceOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-gray-400">Active Policies</span>
          </div>
          <div className="text-3xl font-bold text-white">{data.policies.length}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-400">Monthly Premium</span>
          </div>
          <div className="text-3xl font-bold text-white">${data.totalMonthlyPremium}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-gray-400">Total Coverage</span>
          </div>
          <div className="text-3xl font-bold text-white">${data.totalCoverage.toLocaleString()}</div>
        </motion.div>
      </div>

      {/* Active Policies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-500/30 rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Your Insurance Policies</h3>
        <div className="space-y-4">
          {data.policies.map((policy, index) => (
            <motion.div
              key={policy.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{policy.icon}</div>
                <div>
                  <h4 className="text-white font-semibold">{policy.name}</h4>
                  <p className="text-sm text-gray-400">{policy.provider}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-orange-400">${policy.premium}/mo</div>
                <div className="text-sm text-gray-500">${policy.coverage.toLocaleString()} coverage</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Coverage Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="p-4 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-xl border border-cyan-500/30"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{rec.icon}</div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-1">{rec.title}</h4>
                  <p className="text-sm text-gray-400 mb-2">{rec.description}</p>
                  <div className="text-cyan-400 font-semibold">
                    +${rec.potential.toLocaleString()} coverage
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Savings Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500/30 rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Ways to Save on Insurance</h3>
        <div className="space-y-4">
          {data.savingsTips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + index * 0.1 }}
              className="flex gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700"
            >
              <div className="text-3xl">{tip.icon}</div>
              <div>
                <h4 className="text-white font-semibold mb-1">{tip.title}</h4>
                <p className="text-sm text-gray-400">{tip.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
