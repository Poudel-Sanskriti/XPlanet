'use client';

import { motion } from 'framer-motion';
import { Message as MessageType } from '@/lib/store';
import { VoicePlayer } from './VoicePlayer';
import { FileText } from 'lucide-react';

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl ${
          isUser ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-blue-500 to-cyan-500'
        }`}>
          {isUser ? '👤' : '🚀'}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Document indicator for user messages */}
          {isUser && message.metadata?.hasDocument && (
            <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-xs text-cyan-300">
              <FileText className="w-3 h-3" />
              <span>{message.metadata.fileName}</span>
            </div>
          )}

          <div className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white'
              : message.metadata?.isDocumentResponse
                ? 'bg-gradient-to-br from-blue-900/50 to-cyan-900/50 text-gray-100 border border-cyan-500/50'
                : 'bg-gray-800 text-gray-100 border border-cyan-500/30'
          }`}>
            {/* Document response header */}
            {message.metadata?.isDocumentResponse && (
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-cyan-500/30">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-300">Document Analysis</span>
              </div>
            )}
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>

          {/* Voice Player for assistant messages (disabled for very long document responses) */}
          {!isUser && message.content && message.content.length < 5000 && (
            <VoicePlayer text={message.content} />
          )}

          {/* Show note for very long responses */}
          {!isUser && message.content && message.content.length >= 5000 && (
            <p className="text-xs text-gray-500 italic">
              Voice playback disabled for very long responses
            </p>
          )}

          {/* Timestamp */}
          <span className="text-xs text-gray-500">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
