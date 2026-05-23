import { useState } from 'react';
import { Shield, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { generateContent } from '@/lib/gemini.ts';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';

export default function ScanView() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = async () => {
    if (!code.trim()) {
      toast.error('Please enter code to scan');
      return;
    }
    setIsLoading(true);
    try {
      const prompt = `Perform a comprehensive security and quality scan on the following code. Identify vulnerabilities, bad practices, performance bottlenecks, and suggest improvements.\n\nCode:\n${code}`;
      const response = await generateContent(prompt);
      setResult(response);
    } catch (error) {
      toast.error('Failed to scan code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-[#0B0F19]">
      {/* Left Panel: Input */}
      <div className="w-1/2 border-r border-white/5 flex flex-col p-6 gap-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-semibold text-zinc-100">Security & Quality Scan</h2>
        </div>
        
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-sm text-zinc-400">Source Code</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-[#131722] border border-white/10 rounded-xl p-4 text-zinc-200 font-mono text-sm resize-none focus:outline-none focus:border-emerald-500/50 transition-colors custom-scrollbar"
            placeholder="Paste your code here for a security and quality audit..."
          />
        </div>

        <button
          onClick={handleScan}
          disabled={isLoading}
          className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
          {isLoading ? 'Scanning...' : 'Run Scan'}
        </button>
      </div>

      {/* Right Panel: Output */}
      <div className="w-1/2 flex flex-col bg-[#0B0F19]">
        <div className="p-6 border-b border-white/5 flex items-center gap-2">
          <h2 className="text-lg font-semibold text-zinc-100">Scan Report</h2>
          {result && !isLoading && <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto" />}
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
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-4">
              <AlertTriangle className="w-12 h-12 text-zinc-700" />
              <p>Run a scan to detect vulnerabilities and code smells.</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
