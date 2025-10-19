'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/lib/store';
import { getUserData } from '@/lib/userData';
import { Message } from './Message';
import { Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTED_QUESTIONS = [
  "How do I start budgeting?",
  "What's a good credit score?",
  "How can I save money?",
  "What are financial goals?",
];

const MAX_CHARS = 500;

export function ChatInterface() {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, isLoading, addMessage, setLoading } = useChatStore();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Hide suggestions after first message
    setShowSuggestions(false);

    // Add user message
    addMessage({
      role: 'user',
      content: text.trim(),
    });

    setInput('');
    setLoading(true);

    try {
      // Get current user data for personalized responses
      const userData = getUserData();

      // Call Gemini API with user context
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: text.trim(),
          userData: userData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      // Add assistant message
      addMessage({
        role: 'assistant',
        content: data.response || data.text || 'I apologize, Navigator. My response systems are offline.',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({
        role: 'assistant',
        content: 'I apologize, Navigator. There was an error processing your request. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, new line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    sendMessage(question);
  };

  const charCount = input.length;
  const isOverLimit = charCount > MAX_CHARS;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-cyan-500/30 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl">
              🚀
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Captain Gemini</h1>
              <p className="text-sm text-gray-400">Your AI Financial Navigator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🌌</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome, Navigator!
              </h2>
              <p className="text-gray-400 mb-8">
                I'm Captain Gemini, your guide through the financial galaxy.
                <br />
                Ask me anything about budgeting, credit, or financial goals!
              </p>
            </motion.div>
          ) : (
            messages.map((message) => (
              <Message key={message.id} message={message} />
            ))
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-cyan-400 mb-4"
            >
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-sm">Captain is thinking...</span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Questions */}
      <AnimatePresence>
        {showSuggestions && messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex-shrink-0 px-4 pb-4"
          >
            <div className="max-w-4xl mx-auto">
              <p className="text-sm text-gray-400 mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="px-4 py-2 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30
                             border border-cyan-500/50 text-cyan-300 text-sm
                             transition-all hover:scale-105"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-cyan-500/30 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Captain Gemini anything..."
              rows={1}
              className="w-full px-4 py-3 pr-24 rounded-2xl bg-gray-800 border border-cyan-500/30
                       text-white placeholder-gray-500 resize-none focus:outline-none
                       focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20
                       transition-all"
              style={{
                minHeight: '48px',
                maxHeight: '120px',
              }}
            />

            {/* Character Count */}
            <div className="absolute right-16 top-3 text-xs text-gray-500">
              <span className={isOverLimit ? 'text-red-500' : ''}>
                {charCount}/{MAX_CHARS}
              </span>
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || isLoading || isOverLimit}
              className="absolute right-3 top-3 p-2 rounded-full bg-gradient-to-br
                       from-cyan-500 to-blue-600 text-white disabled:opacity-50
                       disabled:cursor-not-allowed hover:scale-110 transition-transform"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
