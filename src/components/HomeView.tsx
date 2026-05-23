import React from 'react';
import { motion } from 'motion/react';
import { Code2, Bug, Languages, Shield, TerminalSquare, Sparkles } from 'lucide-react';
import { ViewMode } from '@/App.tsx';
import ChatInterface from '@/components/ChatInterface.tsx';
import { ChatMessage } from '@/lib/export.ts';

interface HomeViewProps {
  setCurrentView: (v: ViewMode) => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isSpeaking: boolean;
}

export default function HomeView({ setCurrentView, messages, setMessages, isSpeaking }: HomeViewProps) {
  return (
    <div className="flex flex-col h-full w-full bg-[#0B0F19]">
      {/* Dashboard Section (Top) */}
      <div className="p-6 shrink-0 border-b border-white/5 bg-[#131722] overflow-y-auto custom-scrollbar max-h-[50%]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          <DashboardCard 
            index={0}
            icon={<Bug className="w-6 h-6 text-red-400" />}
            title="Debug Code"
            description="Find and fix issues in your code automatically."
            onClick={() => setCurrentView('debug')}
          />
          <DashboardCard 
            index={1}
            icon={<Languages className="w-6 h-6 text-purple-400" />}
            title="Translate"
            description="Convert code between different programming languages."
            onClick={() => setCurrentView('translate')}
          />
          <DashboardCard 
            index={2}
            icon={<Shield className="w-6 h-6 text-green-400" />}
            title="Security Scan"
            description="Scan your code for vulnerabilities and best practices."
            onClick={() => setCurrentView('scan')}
          />
          <DashboardCard 
            index={3}
            icon={<TerminalSquare className="w-6 h-6 text-blue-400" />}
            title="Write Code"
            description="Generate new code from natural language descriptions."
            onClick={() => setCurrentView('chat')}
          />
        </div>
      </div>

      {/* Chat Section (Bottom) */}
      <div className="flex-1 relative flex flex-col min-h-0">
        <ChatInterface messages={messages} setMessages={setMessages} isSpeaking={isSpeaking} compact={true} onMessageSent={() => setCurrentView('chat')} />
      </div>
    </div>
  );
}

function DashboardCard({ icon, title, description, index, onClick }: any) {
  return (
    <motion.button 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex flex-col items-start p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all text-left group"
    >
      <div className="mb-4 p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-zinc-200 mb-2">{title}</h3>
      <p className="text-sm text-zinc-500">{description}</p>
    </motion.button>
  );
}
