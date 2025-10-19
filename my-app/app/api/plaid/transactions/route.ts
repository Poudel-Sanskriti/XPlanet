import { NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid';

// Category mapping for XPlanet categories
const categoryMapping: { [key: string]: string } = {
  'Food and Drink': 'food',
  'Restaurants': 'food',
  'Groceries': 'food',
  'Travel': 'transportation',
  'Transportation': 'transportation',
  'Gas': 'transportation',
  'Public Transportation': 'transportation',
  'Recreation': 'entertainment',
  'Entertainment': 'entertainment',
  'Shops': 'shopping',
  'Shopping': 'shopping',
  'Service': 'utilities',
  'Utilities': 'utilities',
  'Healthcare': 'healthcare',
  'Medical': 'healthcare',
  'Rent': 'rent',
  'Payment': 'utilities',
};

function mapCategory(plaidCategories: string[] | null): string {
  if (!plaidCategories || plaidCategories.length === 0) {
    return 'other';
  }

  for (const category of plaidCategories) {
    const mapped = categoryMapping[category];
    if (mapped) return mapped;
  }

  return 'other';
}

export async function POST(request: Request) {
  try {
    const { access_token, start_date, end_date } = await request.json();

    if (!access_token) {
      return NextResponse.json(
        { error: 'access_token is required' },
        { status: 400 }
      );
    }

    // Default to last 90 days if no dates provided
    const endDate = end_date || new Date().toISOString().split('T')[0];
    const startDate = start_date || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const response = await plaidClient.transactionsGet({
      access_token,
      start_date: startDate,
      end_date: endDate,
    });

    // Map transactions to XPlanet format
    const transactions = response.data.transactions.map((transaction) => ({
      id: transaction.transaction_id,
      date: transaction.date,
      name: transaction.name,
      merchant: transaction.merchant_name || transaction.name,
      amount: transaction.amount,
      category: mapCategory(transaction.category),
      plaidCategory: transaction.category,
      pending: transaction.pending,
      accountId: transaction.account_id,
    }));

    // Calculate spending by category
    const spendingByCategory: { [key: string]: number } = {};
    transactions.forEach((transaction) => {
      if (transaction.amount > 0) { // Only count expenses (positive amounts in Plaid)
        const category = transaction.category;
        spendingByCategory[category] = (spendingByCategory[category] || 0) + transaction.amount;
      }
    });

    return NextResponse.json({
      transactions,
      spendingByCategory,
      total: response.data.total_transactions,
      accounts: response.data.accounts,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
