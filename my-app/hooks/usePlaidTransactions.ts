'use client';

import { useState, useEffect } from 'react';
import { getUserData } from '@/lib/userData';

interface Transaction {
  id: string;
  date: string;
  name: string;
  merchant: string;
  amount: number;
  category: string;
  plaidCategory: string[];
  pending: boolean;
  accountId: string;
}

interface PlaidData {
  transactions: Transaction[];
  spendingByCategory: { [key: string]: number };
  total: number;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function usePlaidTransactions(): PlaidData {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [spendingByCategory, setSpendingByCategory] = useState<{ [key: string]: number }>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = getUserData();

      // Check if user has connected Plaid
      if (!userData?.plaidAccessToken) {
        setLoading(false);
        return;
      }

      // Check cache first
      const cached = localStorage.getItem('plaidTransactions');
      const cacheTime = localStorage.getItem('plaidCacheTime');

      if (cached && cacheTime) {
        const age = Date.now() - parseInt(cacheTime);
        // Use cache if less than 24 hours old (86400000 ms)
        if (age < 24 * 60 * 60 * 1000) {
          const data = JSON.parse(cached);
          setTransactions(data.transactions || []);
          setSpendingByCategory(data.spendingByCategory || {});
          setTotal(data.total || 0);
          setLoading(false);
          return;
        }
      }

      // Fetch fresh data from Plaid
      const response = await fetch('/api/plaid/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: userData.plaidAccessToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();

      // Cache the data
      localStorage.setItem('plaidTransactions', JSON.stringify(data));
      localStorage.setItem('plaidCacheTime', Date.now().toString());

      setTransactions(data.transactions || []);
      setSpendingByCategory(data.spendingByCategory || {});
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    spendingByCategory,
    total,
    loading,
    error,
    refresh: () => {
      localStorage.removeItem('plaidCacheTime');
      fetchTransactions();
    },
  };
}
