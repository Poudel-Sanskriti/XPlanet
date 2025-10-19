'use client';

import { motion } from 'framer-motion';
import { Target, TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
  icon: string;
}

interface GoalsData {
  goals: Goal[];
  totalSaved: number;
  totalTarget: number;
  monthlyContribution: number;
}

interface GoalProgressBarsProps {
  data: GoalsData;
}

export function GoalProgressBars({ data }: GoalProgressBarsProps) {
  // Safety checks
  if (!data || !data.goals || data.goals.length === 0 || typeof data.totalSaved === 'undefined' || typeof data.totalTarget === 'undefined') {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl p-6">
        <p className="text-gray-400">No financial goals set yet. Add goals in your profile to track progress!</p>
      </div>
    );
  }

  const totalSaved = data.totalSaved || 0;
  const totalTarget = data.totalTarget || 1;
  const overallProgress = (totalSaved / totalTarget) * 100;

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const targetDate = new Date(deadline);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-teal-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-teal-400" />
            <span className="text-sm text-gray-400">Total Saved</span>
          </div>
          <div className="text-3xl font-bold text-teal-400">${totalSaved.toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-1">of ${totalTarget.toLocaleString()}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-teal-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-gray-400">Active Goals</span>
          </div>
          <div className="text-3xl font-bold text-white">{data.goals.length}</div>
          <div className="text-sm text-gray-500 mt-1">In progress</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-teal-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-400">Monthly Savings</span>
          </div>
          <div className="text-3xl font-bold text-green-400">${data.monthlyContribution}</div>
          <div className="text-sm text-gray-500 mt-1">Average per month</div>
        </motion.div>
      </div>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 border border-teal-500/30 rounded-2xl p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Overall Progress</h3>
          <span className="text-2xl font-bold text-teal-400">{overallProgress.toFixed(1)}%</span>
        </div>
        <div className="relative h-6 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
          />
        </div>
      </motion.div>

      {/* Individual Goals */}
      <div className="space-y-6">
        {data.goals.map((goal, index) => {
          const progress = (goal.current / goal.target) * 100;
          const daysRemaining = getDaysRemaining(goal.deadline);
          const isComplete = progress >= 100;
          const isUrgent = daysRemaining < 30 && !isComplete;

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`bg-gradient-to-br from-gray-800 to-gray-900 border rounded-2xl p-6 ${
                isComplete
                  ? 'border-green-500/50'
                  : isUrgent
                  ? 'border-red-500/50'
                  : 'border-cyan-500/30'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{goal.icon}</div>
                  <div>
                    <h4 className="text-xl font-bold text-white">{goal.name}</h4>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {daysRemaining > 0 ? `${daysRemaining} days left` : 'Deadline passed'}
                      </span>
                      {isUrgent && <span className="text-red-400">⚠️ Urgent!</span>}
                      {isComplete && <span className="text-green-400">✅ Complete!</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold" style={{ color: goal.color }}>
                    ${goal.current.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">of ${goal.target.toLocaleString()}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="font-semibold" style={{ color: goal.color }}>
                    {progress.toFixed(1)}%
                  </span>
                </div>
                <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(to right, ${goal.color}, ${goal.color}dd)`,
                    }}
                  />
                </div>
              </div>

              {/* Remaining */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  ${(goal.target - goal.current).toLocaleString()} to go
                </span>
                {!isComplete && daysRemaining > 0 && (
                  <span className="text-sm text-gray-400">
                    ~${Math.ceil((goal.target - goal.current) / (daysRemaining / 30))}/month needed
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add New Goal Card */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="w-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-dashed border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-500/60 transition-all group"
      >
        <div className="flex flex-col items-center gap-3 text-gray-400 group-hover:text-cyan-400 transition-colors">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center text-3xl">
            +
          </div>
          <span className="text-lg font-semibold">Add New Goal</span>
          <span className="text-sm">Set a new financial target</span>
        </div>
      </motion.button>
    </div>
  );
}
