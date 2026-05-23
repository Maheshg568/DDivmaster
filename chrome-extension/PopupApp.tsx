import React, { useState, useEffect } from 'react';
import { Sparkles, Settings } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface.tsx';
import { ChatMessage } from '@/lib/export.ts';
import { Toaster } from '@/components/ui/sonner.tsx';

export default function PopupApp() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Load messages from chrome.storage if available
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['chatHistory'], (result) => {
        if (result.chatHistory) {
          setMessages(result.chatHistory as ChatMessage[]);
        }
      });
    }
  }, []);

  // Save messages to chrome.storage when updated
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage && messages.length > 0) {
      chrome.storage.local.set({ chatHistory: messages });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full bg-[#0B0F19] text-zinc-50 font-sans selection:bg-cyan-500/30">
      {/* Header */}
      <div className="p-3 border-b border-white/5 bg-[#131722] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4facfe] to-[#00f2fe] flex items-center justify-center shadow-[0_0_10px_rgba(0,242,254,0.3)]">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-fuchsia-500">
            Div Master
          </h1>
        </div>
        <button 
          onClick={() => setMessages([])} 
          className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors px-2 py-1 rounded-md hover:bg-white/5"
        >
          Clear
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 relative flex flex-col min-h-0">
        <ChatInterface 
          messages={messages} 
          setMessages={setMessages} 
          isSpeaking={isSpeaking} 
          compact={true} 
        />
      </div>
      <Toaster theme="dark" />
    </div>
  );
}
