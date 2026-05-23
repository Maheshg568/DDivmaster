import React, { useRef } from 'react';
import { MessageSquare, Plus, Trash2, Download, Upload, FileText, FileDown, FileJson } from 'lucide-react';
import { ChatMessage, exportChatToJSON, exportChatToPDF, exportChatToTXT } from '@/lib/export.ts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.tsx';
import { toast } from 'sonner';

interface SidebarProps {
  onNewConversation: () => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function Sidebar({ onNewConversation, messages, setMessages }: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportChat = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedMessages = JSON.parse(event.target?.result as string);
        if (Array.isArray(importedMessages) && importedMessages.every(m => m.id && m.role && m.content && m.timestamp)) {
          setMessages(importedMessages);
          toast.success('Chat imported successfully');
        } else {
          toast.error('Invalid chat file format');
        }
      } catch (error) {
        toast.error('Failed to parse chat file');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-[280px] bg-[#13131a] border-r border-white/5 flex flex-col h-full shrink-0 hidden md:flex">
      {/* Header */}
      <div className="p-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <MessageSquare className="w-4 h-4 text-white" fill="currentColor" />
        </div>
        <span className="font-bold text-white tracking-wide text-lg">Conversations</span>
      </div>

      {/* New Chat Btn */}
      <div className="px-4 pb-4">
        <button
          onClick={onNewConversation}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-5 h-5" /> New Conversation
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-2">
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1.5 cursor-pointer group hover:bg-white/10 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
              <MessageSquare className="w-4 h-4 text-zinc-400" />
              New Conversation
            </div>
            <button onClick={(e) => { e.stopPropagation(); onNewConversation(); }} className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-4 h-4 text-zinc-500 hover:text-red-400" />
            </button>
          </div>
          <div className="text-xs text-zinc-500 pl-6">
            {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {messages.length} messages
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 flex gap-3 border-t border-white/5 bg-[#13131a]">
        {/* Export Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<button className="flex-1 py-2.5 rounded-xl border border-white/10 flex items-center justify-center gap-2 text-sm font-medium text-zinc-300 hover:bg-white/5 transition-colors" />}>
            <Download className="w-4 h-4" /> Export
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-[#1a1a24] border-white/10 text-zinc-50">
            <DropdownMenuItem onClick={() => exportChatToPDF(messages)} className="hover:bg-white/10 cursor-pointer"><FileText className="w-4 h-4 mr-2" /> PDF</DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportChatToTXT(messages)} className="hover:bg-white/10 cursor-pointer"><FileDown className="w-4 h-4 mr-2" /> TXT</DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportChatToJSON(messages)} className="hover:bg-white/10 cursor-pointer"><FileJson className="w-4 h-4 mr-2" /> JSON</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          type="file"
          accept=".json"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImportChat}
        />
        <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-2.5 rounded-xl border border-white/10 flex items-center justify-center gap-2 text-sm font-medium text-zinc-300 hover:bg-white/5 transition-colors">
          <Upload className="w-4 h-4" /> Import
        </button>
      </div>
    </div>
  );
}
