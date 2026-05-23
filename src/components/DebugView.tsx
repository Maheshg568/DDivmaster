import { useState } from 'react';
import { Bug, Loader2 } from 'lucide-react';
import { generateContent } from '@/lib/gemini.ts';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';

export default function DebugView() {
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDebug = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to debug');
      return;
    }
    setIsLoading(true);
    try {
      const prompt = `Please debug the following code.\n\nCode:\n${code}\n\nError Message/Symptom:\n${errorMsg}\n\nProvide a corrected version of the code and explain what the issue was.`;
      const response = await generateContent(prompt);
      setResult(response);
    } catch (error) {
      toast.error('Failed to debug code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-[#0B0F19]">
      {/* Left Panel: Inputs */}
      <div className="w-1/2 border-r border-white/5 flex flex-col p-6 gap-4">
        <div className="flex items-center gap-2 mb-2">
          <Bug className="w-5 h-5 text-red-400" />
          <h2 className="text-lg font-semibold text-zinc-100">Debug Code</h2>
        </div>
        
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-sm text-zinc-400">Source Code</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-[#131722] border border-white/10 rounded-xl p-4 text-zinc-200 font-mono text-sm resize-none focus:outline-none focus:border-blue-500/50 transition-colors custom-scrollbar"
            placeholder="Paste your buggy code here..."
          />
        </div>

        <div className="h-32 flex flex-col gap-2">
          <label className="text-sm text-zinc-400">Error Message (Optional)</label>
          <textarea
            value={errorMsg}
            onChange={(e) => setErrorMsg(e.target.value)}
            className="flex-1 bg-[#131722] border border-white/10 rounded-xl p-4 text-zinc-200 font-mono text-sm resize-none focus:outline-none focus:border-blue-500/50 transition-colors custom-scrollbar"
            placeholder="Paste the error message or describe the issue..."
          />
        </div>

        <button
          onClick={handleDebug}
          disabled={isLoading}
          className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-red-500/80 to-orange-500/80 hover:from-red-500 hover:to-orange-500 text-white font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bug className="w-5 h-5" />}
          {isLoading ? 'Analyzing...' : 'Debug Now'}
        </button>
      </div>

      {/* Right Panel: Output */}
      <div className="w-1/2 flex flex-col bg-[#0B0F19]">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-semibold text-zinc-100">Analysis & Solution</h2>
        </div>
        <ScrollArea className="flex-1 p-6">
          {result ? (
            <div className="prose prose-invert max-w-none prose-pre:bg-[#131722] prose-pre:border prose-pre:border-white/10">
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
              Run the debugger to see the analysis here.
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
