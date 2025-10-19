'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ParallaxStars } from '@/components/ParallaxStars';
import { UserProfileBadge } from '@/components/UserProfileBadge';

export default function TranslatePage() {
  const [documentText, setDocumentText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const isText = file.type.includes('text') || file.name.endsWith('.txt');

    if (!isText) {
      setError('Please upload a text file (.txt) or paste your document directly');
      return;
    }

    setError('');

    // Handle text files
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setDocumentText(text);
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try pasting the text instead.');
    };
    reader.readAsText(file);
  };

  const handleTranslate = async () => {
    if (!documentText.trim()) {
      setError('Please paste or upload a document first');
      return;
    }

    setLoading(true);
    setError('');
    setExplanation('');

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Translation failed');
      }

      setExplanation(data.explanation);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exampleDocument = `ANNUAL PERCENTAGE RATE (APR): 24.99% Variable
Minimum Payment Due: $45.00
Payment Due Date: January 15, 2025
Late Payment Fee: $35.00
Over-the-Credit-Limit Fee: $35.00
Cash Advance Fee: 5% of transaction amount (minimum $10)
Balance Transfer Fee: 3% of transfer amount (minimum $5)
Foreign Transaction Fee: 3% of transaction amount

Your credit utilization is currently 87% ($2,610 of $3,000 credit limit).`;

  const loadExample = () => {
    setDocumentText(exampleDocument);
    setError('');
    setExplanation('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 text-white relative overflow-hidden">
      <ParallaxStars />

      <div className="relative z-10">
        {/* Header */}
        <div className="p-6 flex justify-between items-center">
          <Link href="/">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-all">
              <ArrowLeft size={20} />
              <span>Back to Navigation</span>
            </button>
          </Link>
          <UserProfileBadge />
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="text-yellow-400" size={32} />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Document Translator
              </h1>
              <Sparkles className="text-yellow-400" size={32} />
            </div>
            <p className="text-xl text-gray-300">
              Upload confusing financial documents and get instant plain-English explanations
            </p>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="text-blue-400" />
                  Your Document
                </h2>

                {/* File Upload */}
                <div className="mb-4">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <Upload className="text-gray-400 mb-2" size={32} />
                    <span className="text-sm text-gray-400">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      Text files (.txt) - For PDFs, copy and paste the text
                    </span>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".txt,text/plain"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>

                <div className="text-center text-gray-400 text-sm mb-4">
                  - OR -
                </div>

                {/* Text Area */}
                <textarea
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  placeholder="Paste your financial document here... (bank statement, credit report, loan agreement, etc.)"
                  className="w-full h-64 p-4 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                  maxLength={50000}
                />

                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>{documentText.length.toLocaleString()} / 50,000 characters</span>
                  <button
                    onClick={loadExample}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Load example
                  </button>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                    {error}
                  </div>
                )}

                {/* Translate Button */}
                <button
                  onClick={handleTranslate}
                  disabled={loading || !documentText.trim()}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Translating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Explain in Plain English
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Right Column - Output */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 min-h-[600px]">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="text-yellow-400" />
                  Plain English Explanation
                </h2>

                {!explanation && !loading && (
                  <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                    <FileText size={64} className="mb-4 opacity-50" />
                    <p className="text-center">
                      Paste or upload a financial document to get started
                    </p>
                  </div>
                )}

                {loading && (
                  <div className="flex flex-col items-center justify-center h-96">
                    <Loader2 className="animate-spin text-blue-400 mb-4" size={64} />
                    <p className="text-gray-400">
                      Captain Gemini is analyzing your document...
                    </p>
                  </div>
                )}

                {explanation && (
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                      {explanation}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid md:grid-cols-3 gap-6"
          >
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-bold mb-2">Jargon Detection</h3>
              <p className="text-sm text-gray-400">
                Automatically identifies and explains complex financial terms
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="font-bold mb-2">Fee Analysis</h3>
              <p className="text-sm text-gray-400">
                Highlights hidden fees and concerning clauses
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold mb-2">Actionable Advice</h3>
              <p className="text-sm text-gray-400">
                Tells you exactly what the document means for your finances
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
