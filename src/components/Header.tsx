import { Code2, MessageSquare, Bug, Languages, Shield, Volume2, VolumeX, Key, Puzzle, Settings } from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import { ViewMode } from '@/App.tsx';
import { speechService } from '@/lib/speech.ts';

interface HeaderProps {
  currentView: ViewMode;
  setCurrentView: (v: ViewMode) => void;
  isSpeaking: boolean;
  setIsSpeaking: (v: boolean) => void;
}

export default function Header({ currentView, setCurrentView, isSpeaking, setIsSpeaking }: HeaderProps) {
  const toggleSpeaking = () => {
    if (isSpeaking) {
      speechService.stopSpeaking();
    }
    setIsSpeaking(!isSpeaking);
  };

  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-[#0B0F19]">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <Code2 className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-fuchsia-500">Div Master</span>
          <span className="text-[11px] text-zinc-400 leading-tight">AI Code Assistant</span>
        </div>
      </div>

      {/* Center Nav */}
      <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
        <button onClick={() => setCurrentView('home')} className={cn("px-4 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors", currentView === 'home' ? "bg-white/10 text-white" : "text-zinc-400 hover:text-zinc-200")}>
          <Code2 className="w-4 h-4" /> Home
        </button>
        <button onClick={() => setCurrentView('chat')} className={cn("px-4 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors", currentView === 'chat' ? "bg-white/10 text-white" : "text-zinc-400 hover:text-zinc-200")}>
          <MessageSquare className="w-4 h-4" /> Chat
        </button>
        <button onClick={() => setCurrentView('debug')} className={cn("px-4 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors", currentView === 'debug' ? "bg-white/10 text-white" : "text-zinc-400 hover:text-zinc-200")}>
          <Bug className="w-4 h-4" /> Debug
        </button>
        <button onClick={() => setCurrentView('translate')} className={cn("px-4 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors", currentView === 'translate' ? "bg-white/10 text-white" : "text-zinc-400 hover:text-zinc-200")}>
          <Languages className="w-4 h-4" /> Translate
        </button>
        <button onClick={() => setCurrentView('scan')} className={cn("px-4 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors", currentView === 'scan' ? "bg-white/10 text-white" : "text-zinc-400 hover:text-zinc-200")}>
          <Shield className="w-4 h-4" /> Scan
        </button>
      </div>

      {/* Right Nav */}
      <div className="flex items-center gap-3">
        <button onClick={toggleSpeaking} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1D27] border border-white/5 text-sm text-zinc-300 hover:bg-white/10 transition-colors">
          <div className={cn("w-2 h-2 rounded-full", isSpeaking ? "bg-green-500" : "bg-zinc-600")}></div>
          {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />} Voice
        </button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-zinc-200 transition-colors">
          <Key className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-zinc-200 transition-colors">
          <Puzzle className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-zinc-200 transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
