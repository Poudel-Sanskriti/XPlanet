'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Transaction {
  id: string;
  date: string;
  name: string;
  merchant: string;
  amount: number;
  category: string;
  pending: boolean;
}

interface TransactionListProps {
  transactions: Transaction[];
}

const categoryColors: { [key: string]: string } = {
  food: 'bg-orange-500',
  rent: 'bg-purple-500',
  transportation: 'bg-blue-500',
  entertainment: 'bg-pink-500',
  utilities: 'bg-yellow-500',
  shopping: 'bg-green-500',
  healthcare: 'bg-red-500',
  other: 'bg-gray-500',
};

const categoryEmojis: { [key: string]: string } = {
  food: '🍔',
  rent: '🏠',
  transportation: '🚗',
  entertainment: '🎬',
  utilities: '💡',
  shopping: '🛍️',
  healthcare: '🏥',
  other: '📌',
};

export function TransactionList({ transactions }: TransactionListProps) {
  const [filter, setFilter] = useState<string>('all');

  const filteredTransactions =
    filter === 'all'
      ? transactions
      : transactions.filter((t) => t.category === filter);

  const categories = Array.from(new Set(transactions.map((t) => t.category)));

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-cyan-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === category
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {categoryEmojis[category]} {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No transactions found
          </div>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-lg bg-gray-800/50 border border-gray-700
                         hover:border-cyan-500/50 transition-colors ${
                           transaction.pending ? 'opacity-60' : ''
                         }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${categoryColors[transaction.category]} flex items-center justify-center text-xl`}>
                    {categoryEmojis[transaction.category]}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{transaction.merchant}</h4>
                    <p className="text-sm text-gray-400">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                      {transaction.pending && (
                        <span className="ml-2 text-yellow-400">• Pending</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-400">
                    -${transaction.amount.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {transaction.category}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Total Transactions:</span>
          <span className="font-bold text-white">{filteredTransactions.length}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-300">Total Spent:</span>
          <span className="font-bold text-red-400">
            ${filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
