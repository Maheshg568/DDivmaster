import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Mic, MicOff, Volume2, VolumeX, Code2, Settings, MessageSquare, Bug, Languages, Shield, Key, Puzzle, TerminalSquare, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { toast } from 'sonner';
import { sendMessage } from '@/lib/gemini.ts';
import { speechService } from '@/lib/speech.ts';
import { ChatMessage } from '@/lib/export.ts';
import { cn } from '@/lib/utils.ts';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isSpeaking: boolean;
  compact?: boolean;
  onMessageSent?: () => void;
}

export default function ChatInterface({ messages, setMessages, isSpeaking, compact = false, onMessageSent }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [mode, setMode] = useState<'chat'|'write'|'debug'|'translate'|'explain'>('chat');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    if (onMessageSent) {
      onMessageSent();
    }

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      let promptPrefix = '';
      if (mode === 'write') promptPrefix = 'Please write code for the following request: ';
      if (mode === 'debug') promptPrefix = 'Please debug the following code/issue: ';
      if (mode === 'translate') promptPrefix = 'Please translate the following code: ';
      if (mode === 'explain') promptPrefix = 'Please explain the following code: ';

      const finalMessage = promptPrefix ? `${promptPrefix}\n\n${userMsg.content}` : userMsg.content;

      const responseText = await sendMessage(history, finalMessage);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, aiMsg]);

      if (isSpeaking) {
        speechService.speak(responseText);
      }
    } catch (error) {
      toast.error('Failed to get response. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      speechService.startListening(
        (text, isFinal) => {
          if (isFinal) {
            setInput(prev => prev + (prev ? ' ' : '') + text);
            setIsListening(false);
          }
        },
        (err) => {
          console.error(err);
          setIsListening(false);
          toast.error('Microphone access denied or error occurred.');
        },
        () => {
          setIsListening(false);
        }
      );
      setIsListening(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative bg-[#0B0F19] h-full min-h-0">
      {/* Main Content Area */}
      <ScrollArea className="flex-1 h-full">
        {messages.length === 0 ? (
          compact ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center h-full px-4 py-8"
            >
              <motion.div 
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-14 h-10 rounded-xl bg-gradient-to-br from-[#4facfe] to-[#00f2fe] flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(0,242,254,0.4)] mb-6"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm"></div>
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-fuchsia-500 text-center">
                Welcome to Div Master
              </h1>
              <p className="text-zinc-400 text-center text-base max-w-[400px]">
                Your AI-powered coding companion. Select a tool or start chatting.
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full px-4 py-12">
              {/* Robot Avatar */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-8 flex flex-col items-center gap-1.5"
              >
                <motion.div 
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-14 h-10 rounded-xl bg-gradient-to-br from-[#4facfe] to-[#00f2fe] flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(0,242,254,0.4)]"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm"></div>
                </motion.div>
                <motion.div 
                  animate={{ 
                    y: [0, -5, 0],
                    scaleX: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2
                  }}
                  className="w-12 h-8 rounded-lg bg-gradient-to-br from-[#f093fb] to-[#f5576c] shadow-[0_0_15px_rgba(245,87,108,0.3)]"
                ></motion.div>
              </motion.div>

              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-fuchsia-500 text-center"
              >
                Welcome to Div Master
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-zinc-400 text-center mb-12 text-lg max-w-xl leading-relaxed"
              >
                Your AI-powered coding companion. Select a tool or start chatting.
              </motion.p>
            </div>
          )
        ) : (
          <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex w-full",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl p-4",
                    message.role === 'user'
                      ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/10"
                      : "bg-[#131722] border border-white/5 text-zinc-200"
                  )}
                >
                  {message.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <div className="prose prose-invert max-w-none prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-white/10 prose-pre:m-0 prose-pre:p-0">
                      <ReactMarkdown
                        components={{
                          code({ node, inline, className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={vscDarkPlus as any}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-md !m-0 !bg-transparent"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className="bg-white/10 px-1.5 py-0.5 rounded-md text-sm" {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#131722] border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  <span className="text-zinc-400">Div Master is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Bottom Input Area */}
      <div className="p-4 border-t border-white/5 bg-[#0B0F19]">
        <div className="max-w-4xl mx-auto">
          {/* Mode Pills */}
          {!compact && (
            <div className="flex flex-wrap gap-2 mb-3">
              <ModePill active={mode === 'chat'} icon={<MessageSquare className="w-4 h-4"/>} label="Chat" onClick={() => setMode('chat')} />
              <ModePill active={mode === 'write'} icon={<TerminalSquare className="w-4 h-4"/>} label="Write" onClick={() => setMode('write')} />
              <ModePill active={mode === 'debug'} icon={<Bug className="w-4 h-4"/>} label="Debug" onClick={() => setMode('debug')} />
              <ModePill active={mode === 'translate'} icon={<Languages className="w-4 h-4"/>} label="Translate" onClick={() => setMode('translate')} />
              <ModePill active={mode === 'explain'} icon={<Sparkles className="w-4 h-4"/>} label="Explain" onClick={() => setMode('explain')} />
            </div>
          )}

          {/* Input Box */}
          <div className="flex items-end gap-3">
            <div className="flex-1 bg-[#131722] border border-white/10 rounded-xl flex items-center px-4 py-3 focus-within:border-white/20 transition-colors">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-white resize-none max-h-32 placeholder:text-zinc-600"
                placeholder={compact ? "Ask a question..." : "Ask me to write, debug, translate, or explain code..."}
                rows={1}
              />
              <button onClick={toggleListening} className={cn("ml-2 transition-colors", isListening ? "text-red-500" : "text-zinc-500 hover:text-zinc-300")}>
                <Mic className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 shrink-0 rounded-xl bg-[#2b4c7e] flex items-center justify-center text-white hover:bg-[#3b5c8e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Footer Links */}
          {!compact && (
            <div className="mt-3 text-xs text-zinc-500 flex flex-wrap items-center gap-2">
              <span>Try:</span>
              <button onClick={() => {setMode('write'); setInput('Write factorial function');}} className="underline decoration-zinc-700 underline-offset-2 hover:text-zinc-300 transition-colors">"Write factorial function"</button>
              <span>•</span>
              <button onClick={() => {setMode('debug'); setInput('Debug my code');}} className="underline decoration-zinc-700 underline-offset-2 hover:text-zinc-300 transition-colors">"Debug my code"</button>
              <span>•</span>
              <button onClick={() => {setMode('translate'); setInput('Convert to Python');}} className="underline decoration-zinc-700 underline-offset-2 hover:text-zinc-300 transition-colors">"Convert to Python"</button>
              <span>•</span>
              <button onClick={() => {setMode('explain'); setInput('Explain this code');}} className="underline decoration-zinc-700 underline-offset-2 hover:text-zinc-300 transition-colors">"Explain this code"</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ModePill({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-colors border",
        active
          ? "bg-cyan-500 text-black border-cyan-500"
          : "bg-transparent border-white/10 text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
      )}
    >
      {icon} {label}
    </button>
  );
}
