'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, User } from 'lucide-react';
import { getUserData, saveUserData, resetUserData } from '@/lib/userData';

export default function ProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState(getUserData());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData(getUserData());
  }, []);

  const handleSave = () => {
    saveUserData(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This will take you back to onboarding.')) {
      resetUserData();
      router.push('/onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000833] to-[#06135C] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-cyan-500/30 text-cyan-300 rounded-xl hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl hover:bg-red-500/30 transition-all"
            >
              Reset All Data
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              <Save className="w-4 h-4" />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-cyan-500/30">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Your Profile</h1>
              <p className="text-gray-400">Update your financial information</p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-cyan-500/30 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-white/10 border border-cyan-500/30 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Annual Income
                </label>
                <input
                  type="number"
                  value={formData.income}
                  onChange={(e) => setFormData({ ...formData, income: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-white/10 border border-cyan-500/30 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Credit Score
                </label>
                <input
                  type="number"
                  value={formData.creditScore}
                  onChange={(e) =>
                    setFormData({ ...formData, creditScore: parseInt(e.target.value) })
                  }
                  min="300"
                  max="850"
                  className="w-full px-4 py-3 bg-white/10 border border-cyan-500/30 rounded-xl text-white"
                />
              </div>
            </div>
          </div>

          {/* Expenses */}
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Monthly Expenses</h2>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(formData.expenses).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                    {key}
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expenses: { ...formData.expenses, [key]: parseInt(e.target.value) || 0 },
                      })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-cyan-500/30 rounded-xl text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Debts */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Current Debts</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.debts).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        debts: { ...formData.debts, [key]: parseInt(e.target.value) || 0 },
                      })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-cyan-500/30 rounded-xl text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
