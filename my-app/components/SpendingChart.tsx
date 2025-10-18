'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface SpendingData {
  totalBudget: number;
  totalSpent: number;
  categories: Array<{
    name: string;
    amount: number;
    budget: number;
    color: string;
  }>;
  monthlyTrend: Array<{
    month: string;
    spent: number;
    budget: number;
  }>;
}

interface SpendingChartProps {
  data: SpendingData;
}

export function SpendingChart({ data }: SpendingChartProps) {
  const remainingBudget = data.totalBudget - data.totalSpent;
  const percentSpent = ((data.totalSpent / data.totalBudget) * 100).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-500/30 rounded-2xl p-6"
        >
          <div className="text-sm text-gray-400 mb-2">Total Budget</div>
          <div className="text-3xl font-bold text-yellow-400">${data.totalBudget.toLocaleString()}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-red-500/30 rounded-2xl p-6"
        >
          <div className="text-sm text-gray-400 mb-2">Total Spent</div>
          <div className="text-3xl font-bold text-red-400">${data.totalSpent.toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-1">{percentSpent}% of budget</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500/30 rounded-2xl p-6"
        >
          <div className="text-sm text-gray-400 mb-2">Remaining</div>
          <div className="text-3xl font-bold text-green-400">${remainingBudget.toLocaleString()}</div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.categories}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart - Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">Monthly Spending Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Bar dataKey="spent" fill="#ef4444" name="Spent" />
              <Bar dataKey="budget" fill="#10b981" name="Budget" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Category Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Category Breakdown</h3>
        <div className="space-y-4">
          {data.categories.map((category, index) => {
            const percentUsed = (category.amount / category.budget) * 100;
            const isOverBudget = percentUsed > 100;

            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-white font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${isOverBudget ? 'text-red-400' : 'text-gray-300'}`}>
                      ${category.amount}
                    </span>
                    <span className="text-gray-500"> / ${category.budget}</span>
                  </div>
                </div>
                <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentUsed, 100)}%` }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
                    className={`h-full rounded-full ${
                      isOverBudget ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    }`}
                  />
                </div>
                <div className="text-sm text-gray-500">
                  {percentUsed.toFixed(1)}% used
                  {isOverBudget && <span className="text-red-400 ml-2">⚠️ Over budget!</span>}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
