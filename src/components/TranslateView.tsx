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
    <div className="min-h-full bg-[#0b0f19] text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-6 md:py-8">
        <div className="mb-6 md:mb-7">
          <div className="flex items-center gap-3 mb-4">
            <Languages className="w-5 h-5 text-zinc-300" />
            <h2 className="text-xl font-semibold text-white">Translate Code</h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full sm:w-[240px] h-11 bg-[#121826] border border-[rgba(255,255,255,0.08)] rounded-xl px-3 text-sm text-zinc-200 outline-none focus:border-purple-500/50"
            >
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>

            <ArrowRight className="w-4 h-4 text-zinc-500 hidden sm:block" />

            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full sm:w-[240px] h-11 bg-[#121826] border border-[rgba(255,255,255,0.08)] rounded-xl px-3 text-sm text-zinc-200 outline-none focus:border-purple-500/50"
            >
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>

            <button
              onClick={handleTranslate}
              disabled={isLoading}
              className="w-full sm:w-auto sm:ml-auto h-11 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
              {isLoading ? 'Translating...' : 'Translate'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col min-w-0">
            <label className="text-sm text-[#94a3b8] mb-2">Source Code ({sourceLang})</label>
            <textarea
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              className="h-[420px] w-full overflow-y-auto overflow-x-auto bg-[#121826] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 text-zinc-200 font-mono text-sm resize-none focus:outline-none focus:border-purple-500/50 transition-colors custom-scrollbar"
              placeholder={`Paste your ${sourceLang} code here...`}
            />
          </div>

          <div className="flex flex-col min-w-0">
            <label className="text-sm text-[#94a3b8] mb-2">Translated Code ({targetLang})</label>
            <ScrollArea className="h-[420px] w-full overflow-y-auto overflow-x-auto bg-[#121826] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 custom-scrollbar">
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
                <div className="h-full min-h-[388px] flex items-center justify-center text-[#94a3b8] text-center">
                  Translation will appear here.
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
