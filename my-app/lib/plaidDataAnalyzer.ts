/**
 * Analyzes Plaid transaction and account data to auto-populate user financial profile
 */

interface Transaction {
  amount: number;
  category: string;
  date: string;
  name: string;
}

interface Account {
  type: string;
  subtype: string;
  balance: {
    current: number;
    available?: number;
    limit?: number;
  };
}

/**
 * Detects monthly income from recurring deposits
 */
export function detectIncome(transactions: Transaction[]): number {
  // Look for large recurring deposits (likely salary/paycheck)
  const deposits = transactions
    .filter((t) => t.amount < 0) // Negative amounts are deposits in Plaid
    .map((t) => Math.abs(t.amount));

  if (deposits.length === 0) return 60000; // Default fallback

  // Find recurring amounts (amounts that appear multiple times)
  const amountFrequency: { [key: number]: number } = {};
  deposits.forEach((amount) => {
    const rounded = Math.round(amount / 100) * 100; // Round to nearest 100
    amountFrequency[rounded] = (amountFrequency[rounded] || 0) + 1;
  });

  // Find most common deposit amount (likely salary)
  let maxFrequency = 0;
  let mostCommonAmount = 0;
  Object.entries(amountFrequency).forEach(([amount, frequency]) => {
    if (frequency > maxFrequency && parseFloat(amount) > 500) {
      // Ignore small amounts
      maxFrequency = frequency;
      mostCommonAmount = parseFloat(amount);
    }
  });

  // If we found a recurring deposit, assume it's monthly and annualize
  if (mostCommonAmount > 0) {
    // Check how many times it appears in last 90 days
    const monthlyIncome = mostCommonAmount;
    return Math.round(monthlyIncome * 12); // Annual income
  }

  // Fallback: average all large deposits and annualize
  const largeDeposits = deposits.filter((d) => d > 500);
  if (largeDeposits.length > 0) {
    const avgDeposit = largeDeposits.reduce((sum, d) => sum + d, 0) / largeDeposits.length;
    return Math.round(avgDeposit * 12);
  }

  return 60000; // Default fallback
}

/**
 * Calculates average monthly expenses by category from transactions
 */
export function calculateMonthlyExpenses(transactions: Transaction[]): {
  rent: number;
  utilities: number;
  food: number;
  transportation: number;
  entertainment: number;
  other: number;
} {
  const now = new Date();
  const daysOfData = 90; // Analyze last 90 days
  const monthsOfData = daysOfData / 30;

  // Filter to expenses only (positive amounts) and last 90 days
  const expenses = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    const daysDiff = (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24);
    return t.amount > 0 && daysDiff <= daysOfData;
  });

  // Sum by category
  const categoryTotals: { [key: string]: number } = {
    rent: 0,
    utilities: 0,
    food: 0,
    transportation: 0,
    entertainment: 0,
    other: 0,
  };

  expenses.forEach((transaction) => {
    const category = transaction.category || 'other';
    if (categoryTotals[category] !== undefined) {
      categoryTotals[category] += transaction.amount;
    } else {
      categoryTotals.other += transaction.amount;
    }
  });

  // Convert to monthly averages
  return {
    rent: Math.round(categoryTotals.rent / monthsOfData),
    utilities: Math.round(categoryTotals.utilities / monthsOfData),
    food: Math.round(categoryTotals.food / monthsOfData),
    transportation: Math.round(categoryTotals.transportation / monthsOfData),
    entertainment: Math.round(categoryTotals.entertainment / monthsOfData),
    other: Math.round(categoryTotals.other / monthsOfData),
  };
}

/**
 * Extracts debt information from Plaid liabilities and accounts
 */
export function extractDebts(accounts: Account[]): {
  studentLoans: number;
  creditCards: number;
  auto: number;
  other: number;
} {
  const debts = {
    studentLoans: 0,
    creditCards: 0,
    auto: 0,
    other: 0,
  };

  accounts.forEach((account) => {
    const balance = Math.abs(account.balance.current || 0);

    if (account.type === 'credit' || account.subtype === 'credit card') {
      debts.creditCards += balance;
    } else if (account.subtype === 'student') {
      debts.studentLoans += balance;
    } else if (account.subtype === 'auto') {
      debts.auto += balance;
    } else if (account.type === 'loan') {
      debts.other += balance;
    }
  });

  return debts;
}

/**
 * Main function to analyze all Plaid data and return user profile
 */
export function analyzePlaidData(
  transactions: Transaction[],
  accounts: Account[]
): {
  income: number;
  expenses: {
    rent: number;
    utilities: number;
    food: number;
    transportation: number;
    entertainment: number;
    other: number;
  };
  debts: {
    studentLoans: number;
    creditCards: number;
    auto: number;
    other: number;
  };
} {
  return {
    income: detectIncome(transactions),
    expenses: calculateMonthlyExpenses(transactions),
    debts: extractDebts(accounts),
  };
}
