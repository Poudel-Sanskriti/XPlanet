// User data management with localStorage

export interface UserProfile {
  name: string;
  age: number;
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
  creditScore: number;
  goals: {
    name: string;
    target: number;
    current: number;
  }[];
  hasCompletedOnboarding: boolean;
  // Plaid integration fields - support multiple banks
  plaidAccounts?: Array<{
    accessToken: string;
    itemId: string;
    institutionName: string;
    institutionId: string;
  }>;
  // Legacy single bank support (for backward compatibility)
  plaidAccessToken?: string;
  plaidItemId?: string;
  plaidConnected?: boolean;
  plaidInstitution?: string;
}

// Default mock data (for demo purposes)
export const DEFAULT_USER_DATA: UserProfile = {
  name: 'Navigator',
  age: 23,
  income: 60000,
  expenses: {
    rent: 1200,
    utilities: 150,
    food: 400,
    transportation: 200,
    entertainment: 150,
    other: 100,
  },
  debts: {
    studentLoans: 45000,
    creditCards: 2500,
    auto: 12000,
    other: 0,
  },
  creditScore: 720,
  goals: [
    { name: 'Emergency Fund', target: 10000, current: 3500 },
    { name: 'Vacation', target: 3000, current: 800 },
    { name: 'New Car Down Payment', target: 5000, current: 1200 },
  ],
  hasCompletedOnboarding: false,
};

const STORAGE_KEY = 'xplanet_user_data';

// Get user data from localStorage or return default
export function getUserData(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_USER_DATA;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_USER_DATA;

  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_USER_DATA;
  }
}

// Save user data to localStorage
export function saveUserData(data: Partial<UserProfile>): void {
  if (typeof window === 'undefined') return;

  const current = getUserData();
  const updated = { ...current, ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// Update specific fields
export function updateUserProfile(updates: Partial<UserProfile>): void {
  saveUserData(updates);
}

// Update user data (alias for saveUserData)
export function updateUserData(data: Partial<UserProfile>): void {
  saveUserData(data);
}

// Calculate derived metrics
export function getUserMetrics(userData: UserProfile) {
  const totalExpenses =
    userData.expenses.rent +
    userData.expenses.utilities +
    userData.expenses.food +
    userData.expenses.transportation +
    userData.expenses.entertainment +
    userData.expenses.other;

  const totalDebts =
    userData.debts.studentLoans +
    userData.debts.creditCards +
    userData.debts.auto +
    userData.debts.other;

  const monthlyIncome = userData.income / 12;
  const savingsRate = ((monthlyIncome - totalExpenses) / monthlyIncome) * 100;
  const debtToIncome = (totalDebts / userData.income) * 100;

  return {
    totalExpenses,
    totalDebts,
    monthlyIncome,
    savingsRate: Math.max(0, savingsRate),
    debtToIncome,
    monthlySavings: Math.max(0, monthlyIncome - totalExpenses),
  };
}

// Reset to default data
export function resetUserData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// Check if user has completed onboarding
export function hasCompletedOnboarding(): boolean {
  const data = getUserData();
  return data.hasCompletedOnboarding;
}

// Mark onboarding as complete
export function completeOnboarding(): void {
  saveUserData({ hasCompletedOnboarding: true });
}
