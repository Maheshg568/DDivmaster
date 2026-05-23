/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Sidebar from '@/components/Sidebar.tsx';
import Header from '@/components/Header.tsx';
import ChatInterface from '@/components/ChatInterface.tsx';
import HomeView from '@/components/HomeView.tsx';
import DebugView from '@/components/DebugView.tsx';
import TranslateView from '@/components/TranslateView.tsx';
import ScanView from '@/components/ScanView.tsx';
import { Toaster } from '@/components/ui/sonner.tsx';
import { ChatMessage } from '@/lib/export.ts';

export type ViewMode = 'home' | 'chat' | 'debug' | 'translate' | 'scan';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleNewConversation = () => {
    setMessages([]);
    setCurrentView('home');
  };

  return (
    <div className="flex h-screen bg-[#0B0F19] text-zinc-50 overflow-hidden font-sans selection:bg-cyan-500/30">
      <Sidebar onNewConversation={handleNewConversation} messages={messages} setMessages={setMessages} />
      <div className="flex-1 flex flex-col relative h-full overflow-hidden">
        <Header currentView={currentView} setCurrentView={setCurrentView} isSpeaking={isSpeaking} setIsSpeaking={setIsSpeaking} />
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar">
          {currentView === 'home' && <HomeView setCurrentView={setCurrentView} messages={messages} setMessages={setMessages} isSpeaking={isSpeaking} />}
          {currentView === 'chat' && <ChatInterface messages={messages} setMessages={setMessages} isSpeaking={isSpeaking} />}
          {currentView === 'debug' && <DebugView />}
          {currentView === 'translate' && <TranslateView />}
          {currentView === 'scan' && <ScanView />}
        </div>
      </div>
      <Toaster theme="dark" />
    </div>
  );
}
