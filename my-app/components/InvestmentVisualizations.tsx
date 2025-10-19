'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface InvestmentVisualizationsProps {
  monthlyInvestment: number;
  timeHorizon: 'short' | 'long';
}

export function InvestmentVisualizations({ monthlyInvestment, timeHorizon }: InvestmentVisualizationsProps) {
  // Safety checks
  if (!monthlyInvestment || monthlyInvestment <= 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl p-6">
        <p className="text-gray-400">Increase your investable surplus to see projections and visualizations.</p>
      </div>
    );
  }

  const years = timeHorizon === 'short' ? 5 : 10;

  // Allocation based on time horizon
  const shortTermAllocation = [
    { name: 'High-Yield Savings', value: 40, color: '#10b981' },
    { name: 'Treasury Bonds', value: 30, color: '#3b82f6' },
    { name: 'CDs', value: 20, color: '#8b5cf6' },
    { name: 'Money Market', value: 10, color: '#f59e0b' },
  ];

  const longTermAllocation = [
    { name: 'Index Funds', value: 50, color: '#10b981' },
    { name: 'Retirement Accounts', value: 25, color: '#3b82f6' },
    { name: 'Individual Stocks', value: 15, color: '#8b5cf6' },
    { name: 'Bonds', value: 10, color: '#f59e0b' },
  ];

  const allocation = timeHorizon === 'short' ? shortTermAllocation : longTermAllocation;

  // Calculate projected growth
  const calculateGrowth = (monthlyAmount: number, annualRate: number, years: number) => {
    const monthlyRate = annualRate / 12;
    const months = years * 12;
    const data = [];

    let totalInvested = 0;
    let portfolioValue = 0;

    for (let year = 0; year <= years; year++) {
      const currentMonths = year * 12;

      if (year === 0) {
        data.push({
          year: 0,
          invested: 0,
          conservative: 0,
          moderate: 0,
          aggressive: 0,
        });
      } else {
        totalInvested = monthlyAmount * currentMonths;

        // Conservative
        const conservativeRate = timeHorizon === 'short' ? 0.035 / 12 : 0.065 / 12;
        const conservativeValue = monthlyAmount * (((Math.pow(1 + conservativeRate, currentMonths) - 1) / conservativeRate) * (1 + conservativeRate));

        // Moderate
        const moderateRate = timeHorizon === 'short' ? 0.045 / 12 : 0.085 / 12;
        const moderateValue = monthlyAmount * (((Math.pow(1 + moderateRate, currentMonths) - 1) / moderateRate) * (1 + moderateRate));

        // Aggressive
        const aggressiveRate = timeHorizon === 'short' ? 0.055 / 12 : 0.11 / 12;
        const aggressiveValue = monthlyAmount * (((Math.pow(1 + aggressiveRate, currentMonths) - 1) / aggressiveRate) * (1 + aggressiveRate));

        data.push({
          year,
          invested: totalInvested,
          conservative: Math.round(conservativeValue),
          moderate: Math.round(moderateValue),
          aggressive: Math.round(aggressiveValue),
        });
      }
    }

    return data;
  };

  const growthData = calculateGrowth(monthlyInvestment, 0.08, years);
  const finalYear = growthData[growthData.length - 1];

  return (
    <div className="space-y-8">
      {/* Recommended Allocation Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Recommended Allocation</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={allocation}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {allocation.map((entry, index) => (
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

          <div className="space-y-4">
            {allocation.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-white font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">{item.value}%</div>
                  <div className="text-gray-400 text-sm">
                    ${((monthlyInvestment * item.value) / 100).toFixed(2)}/mo
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Projected Growth Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/30 rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">
          Projected Portfolio Growth ({years} Years)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="year"
              stroke="#9ca3af"
              label={{ value: 'Years', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
            />
            <YAxis
              stroke="#9ca3af"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              label={{ value: 'Portfolio Value', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value: any) => `$${value.toLocaleString()}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="invested"
              stroke="#6b7280"
              strokeWidth={2}
              name="Total Invested"
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="conservative"
              stroke="#10b981"
              strokeWidth={3}
              name={`Conservative (${timeHorizon === 'short' ? '3.5%' : '6.5%'})`}
            />
            <Line
              type="monotone"
              dataKey="moderate"
              stroke="#3b82f6"
              strokeWidth={3}
              name={`Moderate (${timeHorizon === 'short' ? '4.5%' : '8.5%'})`}
            />
            <Line
              type="monotone"
              dataKey="aggressive"
              stroke="#8b5cf6"
              strokeWidth={3}
              name={`Aggressive (${timeHorizon === 'short' ? '5.5%' : '11%'})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Scenario Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">
          Return Scenarios After {years} Years
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Scenario</th>
                <th className="text-right py-3 px-4 text-gray-400 font-semibold">Annual Return</th>
                <th className="text-right py-3 px-4 text-gray-400 font-semibold">Total Invested</th>
                <th className="text-right py-3 px-4 text-gray-400 font-semibold">Final Value</th>
                <th className="text-right py-3 px-4 text-gray-400 font-semibold">Total Gain</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700/50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-white font-medium">Conservative</span>
                  </div>
                </td>
                <td className="text-right py-4 px-4 text-gray-300">
                  {timeHorizon === 'short' ? '3.5%' : '6.5%'}
                </td>
                <td className="text-right py-4 px-4 text-gray-300">
                  ${finalYear.invested.toLocaleString()}
                </td>
                <td className="text-right py-4 px-4 text-green-400 font-bold">
                  ${finalYear.conservative.toLocaleString()}
                </td>
                <td className="text-right py-4 px-4 text-green-400">
                  +${(finalYear.conservative - finalYear.invested).toLocaleString()}
                </td>
              </tr>
              <tr className="border-b border-gray-700/50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-white font-medium">Moderate</span>
                  </div>
                </td>
                <td className="text-right py-4 px-4 text-gray-300">
                  {timeHorizon === 'short' ? '4.5%' : '8.5%'}
                </td>
                <td className="text-right py-4 px-4 text-gray-300">
                  ${finalYear.invested.toLocaleString()}
                </td>
                <td className="text-right py-4 px-4 text-blue-400 font-bold">
                  ${finalYear.moderate.toLocaleString()}
                </td>
                <td className="text-right py-4 px-4 text-blue-400">
                  +${(finalYear.moderate - finalYear.invested).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-white font-medium">Aggressive</span>
                  </div>
                </td>
                <td className="text-right py-4 px-4 text-gray-300">
                  {timeHorizon === 'short' ? '5.5%' : '11%'}
                </td>
                <td className="text-right py-4 px-4 text-gray-300">
                  ${finalYear.invested.toLocaleString()}
                </td>
                <td className="text-right py-4 px-4 text-purple-400 font-bold">
                  ${finalYear.aggressive.toLocaleString()}
                </td>
                <td className="text-right py-4 px-4 text-purple-400">
                  +${(finalYear.aggressive - finalYear.invested).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <p className="text-blue-400 text-sm">
            💡 <strong>Note:</strong> These projections assume consistent monthly contributions of ${monthlyInvestment.toFixed(2)}.
            Actual returns will vary based on market conditions and investment choices.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
