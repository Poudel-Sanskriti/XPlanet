'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { saveUserData, completeOnboarding, type UserProfile } from '@/lib/userData';
import { ArrowRight, ArrowLeft, Rocket } from 'lucide-react';

type Step = 'welcome' | 'basic' | 'expenses' | 'debts' | 'goals' | 'complete';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('welcome');
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    age: 23,
    income: 60000,
    expenses: {
      rent: 0,
      food: 0,
      transportation: 0,
      entertainment: 0,
      utilities: 0,
      other: 0,
    },
    debts: {
      studentLoans: 0,
      creditCards: 0,
      auto: 0,
      other: 0,
    },
    creditScore: 700,
    goals: [],
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: string, field: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as any),
        [field]: value,
      },
    }));
  };

  const handleComplete = () => {
    saveUserData(formData);
    completeOnboarding();
    router.push('/');
  };

  const steps: Step[] = ['welcome', 'basic', 'expenses', 'debts', 'goals', 'complete'];
  const currentStepIndex = steps.indexOf(step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000833] to-[#06135C] flex items-center justify-center p-4">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {/* Welcome Step */}
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Rocket className="w-24 h-24 mx-auto text-cyan-400" />
              </motion.div>
              <h1 className="text-5xl font-bold text-white">
                Welcome to <span className="text-cyan-400">XPlanet</span>
              </h1>
              <p className="text-xl text-gray-300">
                Your journey through the financial galaxy begins here.
                <br />
                Let's chart your course, Navigator.
              </p>
              <button
                onClick={() => setStep('basic')}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full
                         font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all
                         flex items-center gap-2 mx-auto"
              >
                Begin Your Journey
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* Basic Info Step */}
          {step === 'basic' && (
            <motion.div
              key="basic"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-cyan-500/30"
            >
              <h2 className="text-3xl font-bold text-white mb-6">Tell us about yourself</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    What's your name, Navigator?
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-white/10 border border-cyan-500/30 rounded-xl
                             text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400
                             focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    How old are you?
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => updateField('age', parseInt(e.target.value))}
                    min="18"
                    max="100"
                    className="w-full px-4 py-3 bg-white/10 border border-cyan-500/30 rounded-xl
                             text-white focus:outline-none focus:border-cyan-400
                             focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Annual Income (before taxes)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-400">$</span>
                    <input
                      type="number"
                      value={formData.income}
                      onChange={(e) => updateField('income', parseInt(e.target.value))}
                      min="0"
                      step="1000"
                      className="w-full pl-8 pr-4 py-3 bg-white/10 border border-cyan-500/30 rounded-xl
                               text-white focus:outline-none focus:border-cyan-400
                               focus:ring-2 focus:ring-cyan-400/20"
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Monthly: ${Math.round((formData.income || 0) / 12).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Credit Score (300-850)
                  </label>
                  <input
                    type="number"
                    value={formData.creditScore}
                    onChange={(e) => updateField('creditScore', parseInt(e.target.value))}
                    min="300"
                    max="850"
                    className="w-full px-4 py-3 bg-white/10 border border-cyan-500/30 rounded-xl
                             text-white focus:outline-none focus:border-cyan-400
                             focus:ring-2 focus:ring-cyan-400/20"
                  />
                  <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        (formData.creditScore || 0) >= 740
                          ? 'bg-green-500'
                          : (formData.creditScore || 0) >= 670
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${((formData.creditScore || 0) - 300) / 5.5}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep('welcome')}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all
                           flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={() => setStep('expenses')}
                  disabled={!formData.name || !formData.age || !formData.income}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl
                           font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Expenses Step */}
          {step === 'expenses' && (
            <motion.div
              key="expenses"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-cyan-500/30"
            >
              <h2 className="text-3xl font-bold text-white mb-2">Monthly Expenses</h2>
              <p className="text-gray-400 mb-6">Help us understand where your money goes</p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'rent', label: 'Rent/Mortgage', icon: '🏠' },
                  { key: 'food', label: 'Food & Groceries', icon: '🍔' },
                  { key: 'transportation', label: 'Transportation', icon: '🚗' },
                  { key: 'entertainment', label: 'Entertainment', icon: '🎮' },
                  { key: 'utilities', label: 'Utilities', icon: '💡' },
                  { key: 'other', label: 'Other', icon: '💳' },
                ].map(({ key, label, icon }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {icon} {label}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-gray-400">$</span>
                      <input
                        type="number"
                        value={(formData.expenses as any)?.[key] || 0}
                        onChange={(e) =>
                          updateNestedField('expenses', key, parseInt(e.target.value) || 0)
                        }
                        min="0"
                        step="10"
                        className="w-full pl-8 pr-4 py-3 bg-white/10 border border-cyan-500/30 rounded-xl
                                 text-white focus:outline-none focus:border-cyan-400
                                 focus:ring-2 focus:ring-cyan-400/20"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                <div className="flex justify-between text-white">
                  <span>Total Monthly Expenses:</span>
                  <span className="font-bold">
                    $
                    {Object.values(formData.expenses || {})
                      .reduce((sum, val) => sum + (val || 0), 0)
                      .toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-300 mt-2">
                  <span>Monthly Income:</span>
                  <span>${Math.round((formData.income || 0) / 12).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-cyan-400 mt-2 font-bold">
                  <span>Monthly Savings:</span>
                  <span>
                    $
                    {Math.max(
                      0,
                      Math.round((formData.income || 0) / 12) -
                        Object.values(formData.expenses || {}).reduce(
                          (sum, val) => sum + (val || 0),
                          0
                        )
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep('basic')}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all
                           flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={() => setStep('debts')}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl
                           font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all
                           flex items-center justify-center gap-2"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Debts Step */}
          {step === 'debts' && (
            <motion.div
              key="debts"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-cyan-500/30"
            >
              <h2 className="text-3xl font-bold text-white mb-2">Current Debts</h2>
              <p className="text-gray-400 mb-6">
                Don't worry - we'll help you navigate through them
              </p>

              <div className="space-y-4">
                {[
                  { key: 'studentLoans', label: 'Student Loans', icon: '🎓' },
                  { key: 'creditCards', label: 'Credit Cards', icon: '💳' },
                  { key: 'auto', label: 'Auto Loan', icon: '🚗' },
                  { key: 'other', label: 'Other Debts', icon: '📝' },
                ].map(({ key, label, icon }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {icon} {label}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-gray-400">$</span>
                      <input
                        type="number"
                        value={(formData.debts as any)?.[key] || 0}
                        onChange={(e) =>
                          updateNestedField('debts', key, parseInt(e.target.value) || 0)
                        }
                        min="0"
                        step="100"
                        className="w-full pl-8 pr-4 py-3 bg-white/10 border border-cyan-500/30 rounded-xl
                                 text-white focus:outline-none focus:border-cyan-400
                                 focus:ring-2 focus:ring-cyan-400/20"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                <div className="flex justify-between text-white">
                  <span>Total Debt:</span>
                  <span className="font-bold">
                    $
                    {Object.values(formData.debts || {})
                      .reduce((sum, val) => sum + (val || 0), 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep('expenses')}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all
                           flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={() => setStep('goals')}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl
                           font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all
                           flex items-center justify-center gap-2"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Goals Step */}
          {step === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-cyan-500/30"
            >
              <h2 className="text-3xl font-bold text-white mb-2">Financial Goals</h2>
              <p className="text-gray-400 mb-6">What are you working towards?</p>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                  <p className="text-white">
                    ✨ You can add custom goals later! For now, we'll set up some common ones for
                    you.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-white/5 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💰</span>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">Emergency Fund</h4>
                        <p className="text-sm text-gray-400">Target: $10,000</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✈️</span>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">Dream Vacation</h4>
                        <p className="text-sm text-gray-400">Target: $3,000</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏡</span>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">House Down Payment</h4>
                        <p className="text-sm text-gray-400">Target: $50,000</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep('debts')}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all
                           flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={() => {
                    // Set default goals
                    updateField('goals', [
                      { name: 'Emergency Fund', target: 10000, current: 0 },
                      { name: 'Dream Vacation', target: 3000, current: 0 },
                      { name: 'House Down Payment', target: 50000, current: 0 },
                    ]);
                    setStep('complete');
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl
                           font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all
                           flex items-center justify-center gap-2"
                >
                  Complete Setup
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Complete Step */}
          {step === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full
                               flex items-center justify-center">
                  <Rocket className="w-16 h-16 text-white" />
                </div>
              </motion.div>

              <div>
                <h1 className="text-5xl font-bold text-white mb-4">
                  Welcome aboard, {formData.name}!
                </h1>
                <p className="text-xl text-gray-300">
                  Your financial galaxy awaits.
                  <br />
                  Let's navigate to success together.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                <div className="p-4 bg-white/5 rounded-xl border border-cyan-500/30">
                  <div className="text-2xl font-bold text-cyan-400">
                    ${Math.round((formData.income || 0) / 12).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Monthly Income</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-orange-500/30">
                  <div className="text-2xl font-bold text-orange-400">{formData.creditScore}</div>
                  <div className="text-sm text-gray-400">Credit Score</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-green-500/30">
                  <div className="text-2xl font-bold text-green-400">{formData.goals?.length || 0}</div>
                  <div className="text-sm text-gray-400">Active Goals</div>
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full
                         font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all
                         flex items-center gap-2 mx-auto"
              >
                Launch Into My Galaxy
                <Rocket className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
