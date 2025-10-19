'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/lib/store';
import { getUserData } from '@/lib/userData';
import { Message } from './Message';
import { Send, Sparkles, Paperclip, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTED_QUESTIONS = [
  "How do I start budgeting?",
  "What's a good credit score?",
  "How can I save money?",
  "📎 Upload a financial document to translate",
];

const MAX_CHARS = 500;

export function ChatInterface() {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { messages, isLoading, addMessage, setLoading } = useChatStore();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const isText = file.type.includes('text') || file.name.endsWith('.txt');

    if (!isText) {
      alert('Please upload a text file (.txt). For PDFs, please copy and paste the text.');
      return;
    }

    setUploadedFile(file);

    // Read file content
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFileContent(text);
    };
    reader.onerror = () => {
      alert('Failed to read file. Please try again.');
      setUploadedFile(null);
    };
    reader.readAsText(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFileContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendMessage = async (text: string) => {
    if ((!text.trim() && !uploadedFile) || isLoading) return;

    // Hide suggestions after first message
    setShowSuggestions(false);

    // Determine if this is a document translation request
    const isDocumentRequest = uploadedFile || fileContent;

    // Add user message
    if (isDocumentRequest) {
      addMessage({
        role: 'user',
        content: text.trim() || 'Please explain this document in plain English.',
        metadata: {
          hasDocument: true,
          fileName: uploadedFile?.name,
        },
      });
    } else {
      addMessage({
        role: 'user',
        content: text.trim(),
      });
    }

    setInput('');
    setLoading(true);

    try {
      if (isDocumentRequest) {
        // Handle document translation
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentText: fileContent,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to translate document');
        }

        const data = await response.json();

        // Add assistant message with translation
        addMessage({
          role: 'assistant',
          content: data.explanation || 'I apologize, Navigator. I could not analyze the document.',
          metadata: {
            isDocumentResponse: true,
          },
        });

        // Clear file after processing
        removeFile();
      } else {
        // Handle regular chat
        const userData = getUserData();

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
      }
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
    if (question.includes('Upload a financial document')) {
      fileInputRef.current?.click();
    } else {
      setInput(question);
      sendMessage(question);
    }
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
          {/* File Upload Preview */}
          {uploadedFile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-sm text-white font-medium">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-400">
                    {(uploadedFile.size / 1024).toFixed(2)} KB • Ready to analyze
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-1 hover:bg-red-500/20 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-red-400" />
              </button>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="relative">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,text/plain"
              onChange={handleFileUpload}
              className="hidden"
            />

            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={uploadedFile ? "Add a question about the document (optional)..." : "Ask Captain Gemini anything..."}
              rows={1}
              className="w-full px-4 py-3 pl-12 pr-24 rounded-2xl bg-gray-800 border border-cyan-500/30
                       text-white placeholder-gray-500 resize-none focus:outline-none
                       focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20
                       transition-all"
              style={{
                minHeight: '48px',
                maxHeight: '120px',
              }}
            />

            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-3 top-3 p-2 rounded-full hover:bg-cyan-500/20
                       text-cyan-400 transition-all"
              title="Attach document"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Character Count */}
            {!uploadedFile && (
              <div className="absolute right-16 top-3 text-xs text-gray-500">
                <span className={isOverLimit ? 'text-red-500' : ''}>
                  {charCount}/{MAX_CHARS}
                </span>
              </div>
            )}

            {/* Send Button */}
            <button
              type="submit"
              disabled={((!input.trim() && !uploadedFile) || isLoading || (isOverLimit && !uploadedFile))}
              className="absolute right-3 top-3 p-2 rounded-full bg-gradient-to-br
                       from-cyan-500 to-blue-600 text-white disabled:opacity-50
                       disabled:cursor-not-allowed hover:scale-110 transition-transform"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-2 text-center">
            {uploadedFile
              ? "📎 Document attached • Click send to analyze"
              : "Press Enter to send, Shift+Enter for new line • 📎 Click to attach documents"}
          </p>
        </div>
      </div>
    </div>
  );
}
