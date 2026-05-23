import { useState } from 'react';
import { Shield, Loader2, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { generateContent } from '@/lib/gemini.ts';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';

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
    <div className="min-h-full bg-[#0B0F19] text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-6 md:py-8">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="mt-4 mb-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-semibold text-zinc-100">Security & Quality Scan</h2>
          </div>
          <p className="mt-2 text-sm text-[#94a3b8]">
            Scan your code for vulnerabilities, unsafe patterns, and quality issues.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-[#121826] border border-white/10 p-5 shadow-sm">
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-[#94a3b8]">Source Code</label>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="mt-2 w-full h-[420px] resize-none overflow-y-auto overflow-x-auto custom-scrollbar rounded-2xl bg-[#0f1422] border border-white/10 p-4 text-sm text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="Paste your code here for a security and quality audit..."
                />
              </div>

              <button
                onClick={handleScan}
                disabled={isLoading}
                className="mt-1 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                {isLoading ? 'Scanning...' : 'Run Scan'}
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-[#121826] border border-white/10 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-zinc-100">Scan Report</h2>
              {result && !isLoading && <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto" />}
            </div>
            <div className="h-[520px] overflow-y-auto overflow-x-auto custom-scrollbar rounded-2xl bg-[#0f1422] border border-white/10 p-5">
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
                <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-4 text-center">
                  <AlertTriangle className="w-12 h-12 text-zinc-700" />
                  <p>Run a scan to detect vulnerabilities and code smells.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
