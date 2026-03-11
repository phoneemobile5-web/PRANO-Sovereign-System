'use client';

import { useState } from 'react';
import { useWorkbenchStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Send, RefreshCw, Cpu, Zap, History, Terminal, AlertCircle, HelpCircle, ShieldAlert, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { testAIProjectResponses } from '@/ai/flows/test-ai-project-responses';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

/**
 * @fileOverview المختبر السينابتي - عمارة Gemma Core 2030 المحدثة.
 * تصميم زجاجي فيروزي لاختبار كفاءة الوقود الإدراكي واستقرار الـ MCP قبل النشر.
 */

export default function PlaygroundPage() {
  const { projects, isLoaded } = useWorkbenchStore();
  const { toast } = useToast();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const hasKey = selectedProject?.apiKeys?.[0]?.startsWith('AIza');
  const hasPrompt = !!selectedProject?.prompt;

  const handleRun = async () => {
    if (!selectedProjectId || !input) return;
    if (!selectedProject) return;

    if (!hasKey || !hasPrompt) {
      toast({
        variant: 'destructive',
        title: 'فقدان نفخة الروح ⚠️',
        description: !hasKey ? 'مفتاح التشغيل مفقود أو غير صحيح.' : 'تعليمات النواة مفقودة.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await testAIProjectResponses({ 
        prompt: `${selectedProject.prompt}\n\nالسؤال: ${input}`,
        apiKey: selectedProject.apiKeys?.[0],
        model: selectedProject.model
      });
      setOutput(result.response);
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'فشل الإخراج الإدراكي',
        description: 'تحقق من اتصالك بالشبكة السينابتية العالمية ومرونة الأدوات.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#001a1a] p-4 md:p-8 space-y-8 max-w-4xl mx-auto font-kufi relative overflow-hidden" dir="rtl">
      <Toaster />
      
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00ffff]/10 blur-[120px] rounded-full"></div>
      </div>

      <header className="flex items-center justify-between glass-turquoise p-8 rounded-[3rem] border border-white/10 shadow-3xl relative z-10">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-14 w-14 glass-turquoise rounded-2xl hover:bg-white/10 border-white/5">
              <ChevronRight className="w-8 h-8 text-[#00ffff]" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black gold-gradient-text uppercase leading-none font-diwani">المختبر السينابتي</h1>
            <p className="text-[10px] text-[#00ffff]/40 font-black uppercase tracking-[0.3em] mt-2 font-diwani">Synaptic Lab • Global Readiness • MCP Sync</p>
          </div>
        </div>
        <div className="p-4 bg-[#00ffff]/10 rounded-2xl hidden md:block">
           <Terminal className="w-8 h-8 text-[#00ffff]" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        <aside className="md:col-span-1 space-y-8">
          <div className="glass-turquoise p-8 rounded-[3rem] border border-white/10 space-y-6">
            <label className="text-[11px] font-black uppercase text-[#d4af37] tracking-[0.2em] font-diwani">اختيار النواة النشطة</label>
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="w-full h-16 rounded-[1.5rem] glass-turquoise border-white/10 text-lg font-bold shadow-lg focus:ring-[#00ffff]">
                <SelectValue placeholder='حدد "عقل" المهمة...' />
              </SelectTrigger>
              <SelectContent className="rounded-[1.5rem] glass-turquoise border-white/10">
                {projects.map(p => (
                  <SelectItem key={p.id} value={p.id} className="font-bold text-base py-4 hover:bg-[#00ffff]/10">{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedProject && (
              <div className={`p-6 rounded-[2rem] border transition-all ${(!hasKey || !hasPrompt) ? 'bg-destructive/10 border-destructive/20 animate-pulse' : 'bg-[#00ffff]/5 border-[#00ffff]/20'}`}>
                <div className="flex items-center justify-between mb-4">
                   <p className="text-[10px] font-black text-[#00ffff] uppercase flex items-center gap-2 font-diwani">
                    <HelpCircle className="w-4 h-4" /> حالة الربط السينابتي
                  </p>
                </div>
                {!hasPrompt && <p className="text-[10px] text-destructive font-bold font-diwani leading-relaxed">⚠️ الملاح، النواة تفتقر لتعليمات النظام.</p>}
                {!hasKey && <p className="text-[10px] text-destructive font-bold font-diwani leading-relaxed">⚠️ وقود التشغيل مفقود.</p>}
                {hasKey && hasPrompt && <p className="text-[10px] text-[#00ffff] font-bold font-diwani leading-relaxed">✅ النواة جاهزة للاستدلال الإدراكي الكامل بمرونة MCP.</p>}
              </div>
            )}
          </div>
        </aside>

        <main className="md:col-span-2 space-y-8">
          <div className="glass-turquoise p-10 rounded-[4rem] border border-white/10 space-y-8 shadow-3xl">
            <Textarea 
              placeholder="أدخل تساؤلك المعماري لتمكين 500 مليون عربي برؤية MCP..."
              className="min-h-[200px] p-8 text-xl glass-turquoise border-white/10 rounded-[2.5rem] shadow-inner focus:border-[#00ffff]/40 transition-all text-right leading-relaxed font-diwani italic"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button 
              className="w-full h-24 text-2xl font-black rounded-[2.5rem] gap-5 shadow-2xl active:scale-95 transition-all bg-gradient-to-r from-[#d4af37] to-[#ffdf00] text-[#002d2d] border-none group" 
              disabled={isLoading || !input || !selectedProjectId}
              onClick={handleRun}
            >
              {isLoading ? <RefreshCw className="w-10 h-10 animate-spin" /> : <Zap className="w-10 h-10 group-hover:scale-110 transition-transform fill-current" />}
              تفعيل الاستدلال
            </Button>
          </div>

          {output && (
            <div className="glass-turquoise border-white/20 rounded-[4rem] p-12 shadow-3xl space-y-8 animate-in fade-in zoom-in-95 relative overflow-hidden">
               <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-[#00ffff]/40 to-transparent"></div>
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <span className="text-[12px] font-black uppercase text-[#00ffff] tracking-widest flex items-center gap-3 font-diwani">
                  <Cpu className="w-6 h-6" /> مخرجات Gemma Core 2030 (MCP Active)
                </span>
                <span className="text-[10px] text-white/30 font-black uppercase tracking-widest font-diwani">{selectedProject?.model}</span>
              </div>
              <div className="text-xl font-medium leading-relaxed whitespace-pre-wrap text-white/90 font-diwani italic pr-4 border-r-2 border-[#d4af37]/30">
                {output}
              </div>
            </div>
          )}
        </main>
      </div>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 h-24 glass-turquoise border border-white/10 flex items-center justify-around px-16 shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-50 rounded-full w-[90%] max-w-2xl">
        <Link href="/" className="flex flex-col items-center gap-2 text-white/30 hover:text-[#d4af37] transition-all">
          <Zap className="w-8 h-8" />
          <span className="text-[10px] font-black uppercase tracking-widest font-diwani">النواة</span>
        </Link>
        <div className="flex flex-col items-center gap-2 text-[#d4af37] scale-110 transition-all">
          <Terminal className="w-8 h-8 fill-current" />
          <span className="text-[10px] font-black uppercase tracking-widest font-diwani">المختبر</span>
        </div>
        <Link href="/history" className="flex flex-col items-center gap-2 text-white/30 hover:text-[#d4af37] transition-all">
          <History className="w-8 h-8" />
          <span className="text-[10px] font-black uppercase tracking-widest font-diwani">الأرشيف</span>
        </Link>
      </nav>
    </div>
  );
}