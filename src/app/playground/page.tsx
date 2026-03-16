'use client';

import { useState } from 'react';
import { useWorkbenchStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Send, RefreshCw, Cpu, Zap, History, Terminal, HelpCircle, ChevronRight, Activity, Globe, Database, Star } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { testAIProjectResponses } from '@/ai/flows/test-ai-project-responses';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

/**
 * @fileOverview المختبر السينابتي المطور - النواة العليا v3.1.
 * بيئة تجريبية لاختبار كفاءة الوقود الإدراكي والنزاهة الفكرية بمرونة MCP.
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
        description: 'تحقق من اتصالك بالشبكة السينابتية العالمية ومرونة الأدوات عبر MCP.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#001a1a] p-4 md:p-8 space-y-8 max-w-4xl mx-auto font-kufi relative overflow-hidden" dir="rtl">
      <Toaster />
      
      {/* سديم خلفية */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#00ffff]/10 blur-[120px] rounded-full"></div>
      </div>

      <header className="flex items-center justify-between glass-turquoise p-8 rounded-[3rem] border border-white/10 shadow-3xl relative z-10">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-14 w-14 glass-turquoise rounded-2xl hover:bg-white/10 border-white/5">
              <ChevronRight className="w-8 h-8 text-[#00ffff]" />
            </Button>
          </Link>
          <div className="text-right">
            <h1 className="text-3xl font-black gold-gradient-text uppercase leading-none font-diwani">المختبر السينابتي</h1>
            <p className="text-[10px] text-[#00ffff]/40 font-black uppercase tracking-[0.3em] mt-2 font-diwani">Synaptic Lab • MCP • v3.1 Sovereign Peace</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <Terminal className="w-8 h-8 text-[#00ffff]" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        <aside className="md:col-span-1 space-y-8">
          <div className="glass-turquoise p-8 rounded-[3rem] border border-white/10 space-y-6">
            <label className="text-[11px] font-black uppercase text-[#d4af37] tracking-[0.2em] font-diwani block text-right">اختيار النواة النشطة</label>
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="w-full h-16 rounded-[1.5rem] glass-turquoise border-white/10 text-lg font-bold shadow-lg focus:ring-[#00ffff] text-right">
                <SelectValue placeholder="حدد عقل المهمة..." />
              </SelectTrigger>
              <SelectContent className="rounded-[1.5rem] glass-turquoise border-white/10">
                {projects.map(p => (
                  <SelectItem key={p.id} value={p.id} className="font-bold text-base py-4 text-right">{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/30 font-black uppercase">الاستقرار السيادي</span>
                  <Activity className="w-4 h-4 text-[#00ffff]" />
               </div>
               <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00ffff] w-[95%] shadow-[0_0_10px_rgba(0,255,255,0.5)]"></div>
               </div>
            </div>
          </div>
        </aside>

        <main className="md:col-span-2 space-y-8">
          <div className="glass-turquoise p-10 rounded-[4rem] border border-white/10 space-y-8 shadow-3xl">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-[#d4af37] fill-[#d4af37]/20" />
                  <span className="text-xs font-black text-[#00ffff]/60 uppercase tracking-widest font-diwani">مدخلات الملاح الوفي:</span>
               </div>
               <Textarea 
                 placeholder="أدخل تساؤلك المعماري لتمكين 500 مليون عربي برؤية MCP..."
                 className="min-h-[200px] p-8 text-xl glass-turquoise border-white/10 rounded-[2.5rem] shadow-inner focus:border-[#00ffff]/40 transition-all text-right leading-relaxed font-diwani italic"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
               />
            </div>
            
            <Button 
              className="w-full h-24 text-2xl font-black rounded-[2.5rem] gap-5 shadow-2xl transition-all bg-gradient-to-r from-[#d4af37] to-[#ffdf00] text-[#002d2d] border-none group" 
              disabled={isLoading || !input || !selectedProjectId}
              onClick={handleRun}
            >
              {isLoading ? <RefreshCw className="w-10 h-10 animate-spin" /> : <Zap className="w-10 h-10 group-hover:scale-110 transition-transform fill-current" />}
              تفعيل الاستدلال السيادي
            </Button>
            
            {output && (
              <div className="p-10 glass-turquoise rounded-[3rem] border border-[#00ffff]/20 animate-in fade-in zoom-in-95 duration-500 shadow-3xl">
                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                  <Star className="w-5 h-5 text-[#d4af37] fill-[#d4af37]/20" />
                  <span className="text-xs font-black text-[#00ffff]/60 uppercase tracking-widest font-diwani">الإخراج الإدراكي الموحد:</span>
                </div>
                <div className="text-xl leading-relaxed text-white/80 font-diwani italic text-right whitespace-pre-wrap">
                  {output}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
