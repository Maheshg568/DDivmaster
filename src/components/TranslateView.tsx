import { useState } from 'react';
import { Languages, Loader2, ArrowRight } from 'lucide-react';
import { generateContent } from '@/lib/gemini.ts';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';

const LANGUAGES = ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin'];

export default function TranslateView() {
  const [sourceCode, setSourceCode] = useState('');
  const [sourceLang, setSourceLang] = useState('Python');
  const [targetLang, setTargetLang] = useState('JavaScript');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!sourceCode.trim()) {
      toast.error('Please enter code to translate');
      return;
    }
    setIsLoading(true);
    try {
      const prompt = `Translate the following ${sourceLang} code to ${targetLang}. Provide only the translated code and a brief explanation if necessary.\n\nCode:\n${sourceCode}`;
      const response = await generateContent(prompt);
      setResult(response);
    } catch (error) {
      toast.error('Failed to translate code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0F19]">
      {/* Toolbar */}
      <div className="flex items-center gap-4 p-6 border-b border-white/5">
        <Languages className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-semibold text-zinc-100 mr-4">Translate Code</h2>
        
        <select 
          value={sourceLang} 
          onChange={(e) => setSourceLang(e.target.value)}
          className="bg-[#131722] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-zinc-200 outline-none focus:border-purple-500/50"
        >
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        <ArrowRight className="w-4 h-4 text-zinc-500" />

        <select 
          value={targetLang} 
          onChange={(e) => setTargetLang(e.target.value)}
          className="bg-[#131722] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-zinc-200 outline-none focus:border-purple-500/50"
        >
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        <button
          onClick={handleTranslate}
          disabled={isLoading}
          className="ml-auto px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
          {isLoading ? 'Translating...' : 'Translate'}
        </button>
      </div>

      {/* Split Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Source */}
        <div className="w-1/2 border-r border-white/5 flex flex-col p-6">
          <label className="text-sm text-zinc-400 mb-2">Source Code ({sourceLang})</label>
          <textarea
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            className="flex-1 bg-[#131722] border border-white/10 rounded-xl p-4 text-zinc-200 font-mono text-sm resize-none focus:outline-none focus:border-purple-500/50 transition-colors custom-scrollbar"
            placeholder={`Paste your ${sourceLang} code here...`}
          />
        </div>

        {/* Target */}
        <div className="w-1/2 flex flex-col p-6 bg-[#0B0F19]">
          <label className="text-sm text-zinc-400 mb-2">Translated Code ({targetLang})</label>
          <ScrollArea className="flex-1 bg-[#131722] border border-white/10 rounded-xl p-4">
            {result ? (
              <div className="prose prose-invert max-w-none prose-pre:bg-transparent prose-pre:border-none prose-pre:m-0 prose-pre:p-0">
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
                  {result}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500">
                Translation will appear here.
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
