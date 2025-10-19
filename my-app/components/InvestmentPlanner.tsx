'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, TrendingUp, Clock, Target, Loader2 } from 'lucide-react';
import { InvestmentVisualizations } from './InvestmentVisualizations';

interface InvestmentPlannerProps {
  data: {
    monthlyInvestable: number;
    yearlyInvestable: number;
    monthlyIncome: number;
    totalExpenses: number;
    minDebtPayment: number;
    age: number;
    riskTolerance: string;
  };
}

export function InvestmentPlanner({ data }: InvestmentPlannerProps) {
  // Safety checks
  if (!data || typeof data.monthlyInvestable === 'undefined') {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl p-6">
        <p className="text-gray-400">Loading investment data...</p>
      </div>
    );
  }

  const [shortTermOpen, setShortTermOpen] = useState(false);
  const [longTermOpen, setLongTermOpen] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<'short' | 'long' | null>(null);
  const [shortTermPlan, setShortTermPlan] = useState<string | null>(null);
  const [longTermPlan, setLongTermPlan] = useState<string | null>(null);
  const [activeVisualization, setActiveVisualization] = useState<'short' | 'long' | null>(null);

  const generatePlan = async (timeHorizon: 'short' | 'long') => {
    setLoadingPlan(timeHorizon);

    try {
      const response = await fetch('/api/investment-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          timeHorizon,
        }),
      });

      const result = await response.json();

      if (timeHorizon === 'short') {
        setShortTermPlan(result.plan);
        setActiveVisualization('short');
      } else {
        setLongTermPlan(result.plan);
        setActiveVisualization('long');
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      const errorMessage = 'Unable to generate plan. Please try again.';
      if (timeHorizon === 'short') {
        setShortTermPlan(errorMessage);
      } else {
        setLongTermPlan(errorMessage);
      }
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Available Investment Amount */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-2xl p-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-yellow-500/20 rounded-full">
            <TrendingUp className="w-8 h-8 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Available for Investment</h3>
            <p className="text-gray-400 text-sm">After expenses and debt payments</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-gray-900/50 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Monthly</p>
            <p className="text-3xl font-bold text-yellow-400">
              ${data.monthlyInvestable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Yearly</p>
            <p className="text-3xl font-bold text-yellow-400">
              ${data.yearlyInvestable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        {data.monthlyInvestable <= 0 && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">
              💡 Your expenses exceed your income. Focus on budgeting and debt reduction before investing.
            </p>
          </div>
        )}
      </motion.div>

      {/* Investment Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Short-Term Investment Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl overflow-hidden"
        >
          {/* Collapsible Header */}
          <button
            onClick={() => setShortTermOpen(!shortTermOpen)}
            className="w-full p-6 flex items-center justify-between hover:bg-cyan-500/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/20 rounded-full">
                <Clock className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white">Short-Term Investing</h3>
                <p className="text-gray-400 text-sm">0-5 years</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: shortTermOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-6 h-6 text-cyan-400" />
            </motion.div>
          </button>

          {/* Collapsible Content */}
          <AnimatePresence>
            {shortTermOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 space-y-4">
                  <div className="bg-gray-900/50 rounded-xl p-4 space-y-3">
                    <h4 className="text-cyan-400 font-semibold">Best for:</h4>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>• Emergency fund building</li>
                      <li>• Saving for a down payment</li>
                      <li>• Upcoming large purchases (car, vacation)</li>
                      <li>• Lower risk tolerance</li>
                    </ul>
                  </div>

                  <div className="bg-gray-900/50 rounded-xl p-4 space-y-3">
                    <h4 className="text-cyan-400 font-semibold">Common Options:</h4>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>• High-Yield Savings Accounts (4-5% APY)</li>
                      <li>• Certificates of Deposit (CDs)</li>
                      <li>• Treasury Bills & Bonds</li>
                      <li>• Money Market Accounts</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => generatePlan('short')}
                    disabled={loadingPlan === 'short' || data.monthlyInvestable <= 0}
                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700
                             disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                             text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    {loadingPlan === 'short' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Plan...
                      </>
                    ) : (
                      'Generate Short-Term Plan'
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Long-Term Investment Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/30 rounded-2xl overflow-hidden"
        >
          {/* Collapsible Header */}
          <button
            onClick={() => setLongTermOpen(!longTermOpen)}
            className="w-full p-6 flex items-center justify-between hover:bg-purple-500/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-full">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white">Long-Term Investing</h3>
                <p className="text-gray-400 text-sm">5+ years</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: longTermOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-6 h-6 text-purple-400" />
            </motion.div>
          </button>

          {/* Collapsible Content */}
          <AnimatePresence>
            {longTermOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 space-y-4">
                  <div className="bg-gray-900/50 rounded-xl p-4 space-y-3">
                    <h4 className="text-purple-400 font-semibold">Best for:</h4>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>• Retirement planning</li>
                      <li>• Building long-term wealth</li>
                      <li>• College savings funds</li>
                      <li>• Higher return potential</li>
                    </ul>
                  </div>

                  <div className="bg-gray-900/50 rounded-xl p-4 space-y-3">
                    <h4 className="text-purple-400 font-semibold">Common Options:</h4>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>• Roth IRA & Traditional IRA</li>
                      <li>• 401(k) / Employer Match Programs</li>
                      <li>• Index Funds (S&P 500, Total Market)</li>
                      <li>• Individual Stocks & ETFs</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => generatePlan('long')}
                    disabled={loadingPlan === 'long' || data.monthlyInvestable <= 0}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700
                             disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                             text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    {loadingPlan === 'long' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Plan...
                      </>
                    ) : (
                      'Generate Long-Term Plan'
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Investment Visualizations */}
      {activeVisualization && data.monthlyInvestable > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <InvestmentVisualizations
            monthlyInvestment={data.monthlyInvestable}
            timeHorizon={activeVisualization}
          />
        </motion.div>
      )}

      {/* AI Generated Plans Display */}
      {(shortTermPlan || longTermPlan) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {shortTermPlan && (
            <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">Your Short-Term Investment Plan</h3>
              </div>
              <div className="prose prose-invert max-w-none">
                <div className="text-gray-300 whitespace-pre-wrap">{shortTermPlan}</div>
              </div>
            </div>
          )}

          {longTermPlan && (
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Your Long-Term Investment Plan</h3>
              </div>
              <div className="prose prose-invert max-w-none">
                <div className="text-gray-300 whitespace-pre-wrap">{longTermPlan}</div>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-400 text-sm">
              ⚠️ <strong>Disclaimer:</strong> This is for educational purposes only. Please consult with a licensed financial advisor before making investment decisions.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
