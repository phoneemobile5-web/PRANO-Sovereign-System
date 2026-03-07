
'use client';

import { useState } from 'react';
import { useWorkbenchStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Send, RefreshCw, Cpu, Zap, History, Terminal, AlertCircle, HelpCircle, ShieldAlert } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { testAIProjectResponses } from '@/ai/flows/test-ai-project-responses';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PlaygroundPage() {
  const { projects, addMessage, isLoaded } = useWorkbenchStore();
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
      addMessage({ role: 'user', text: input });
      addMessage({ role: 'model', text: result.response });
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'فشل الإخراج الإدراكي',
        description: 'تحقق من اتصالك بالشبكة السينابتية العالمية.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-background p-3 pb-24 space-y-5 max-w-md mx-auto font-body" dir="rtl">
      <Toaster />
      
      <header className="flex items-center gap-3 bg-card p-5 rounded-3xl border-2 border-primary/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Terminal className="w-16 h-16 text-primary" />
        </div>
        <div className="p-3 bg-primary/10 rounded-2xl">
           <Terminal className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-black gold-gradient-text uppercase">المختبر السينابتي</h1>
          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Gemma Core Playground</p>
        </div>
      </header>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-primary mr-1 tracking-[0.2em]">اختيار النواة النشطة</label>
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="w-full h-16 rounded-2xl bg-card border-2 border-primary/10 text-lg font-bold shadow-lg focus:ring-primary">
              <SelectValue placeholder="حدد "عقل" المهمة..." />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-2">
              {projects.map(p => (
                <SelectItem key={p.id} value={p.id} className="font-bold text-base py-4 border-b last:border-0">{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedProject && (
          <div className={`p-4 rounded-2xl border-2 transition-all ${(!hasKey || !hasPrompt) ? 'bg-destructive/5 border-destructive/20 animate-pulse' : 'bg-primary/5 border-primary/10'}`}>
            <div className="flex items-center justify-between mb-2">
               <p className="text-[10px] font-black text-primary uppercase flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> حالة الربط السينابتي
              </p>
              {(!hasKey || !hasPrompt) && (
                <span className="text-[8px] bg-destructive text-white px-2 py-0.5 rounded-full font-black uppercase">عطل في الچينيوم</span>
              )}
            </div>
            {!hasPrompt && <p className="text-[10px] text-destructive font-bold">⚠️ يا ملاح الأرض، النواة تفتقر للتعليمات (System Prompt).</p>}
            {!hasKey && <p className="text-[10px] text-destructive font-bold">⚠️ وقود التشغيل (API Key) غير صالح أو مفقود.</p>}
            {hasKey && hasPrompt && <p className="text-[10px] text-primary font-bold">✅ النواة جاهزة للاستدلال الإدراكي الكامل.</p>}
          </div>
        )}

        <div className="space-y-4">
          <Textarea 
            placeholder="أدخل تساؤلك المعماري هنا..."
            className="min-h-[160px] p-6 text-xl bg-card rounded-[2rem] border-2 shadow-inner focus:border-primary/50 transition-all text-right leading-relaxed"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button 
            className="w-full h-20 text-2xl font-black rounded-[2rem] gap-4 shadow-2xl active:scale-95 transition-transform bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-30" 
            disabled={isLoading || !input || !selectedProjectId}
            onClick={handleRun}
          >
            {isLoading ? <RefreshCw className="w-8 h-8 animate-spin" /> : <Zap className="w-8 h-8 fill-current" />}
            تفعيل الاستدلال
          </Button>
        </div>

        {output && (
          <div className="bg-card border-primary/20 border-2 rounded-[2.5rem] p-8 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 relative overflow-hidden">
             <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
            <div className="flex items-center justify-between border-b border-primary/10 pb-4">
              <span className="text-[11px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                <Cpu className="w-4 h-4" /> مخرجات Gemma 2030
              </span>
              <span className="text-[10px] text-muted-foreground font-black uppercase">{selectedProject?.model}</span>
            </div>
            <div className="text-lg font-medium leading-relaxed whitespace-pre-wrap text-foreground/90">
              {output}
            </div>
          </div>
        )}
      </div>

      <nav className="fixed bottom-4 left-4 right-4 h-20 bg-card/90 backdrop-blur-2xl border-2 border-primary/20 flex items-center justify-around px-8 shadow-2xl z-50 rounded-[2.5rem]">
        <Link href="/" className="flex flex-col items-center gap-1 text-muted-foreground/40 hover:text-primary transition-all">
          <Zap className="w-7 h-7" />
          <span className="text-[9px] font-black uppercase">النواة</span>
        </Link>
        <div className="flex flex-col items-center gap-1 text-primary scale-110">
          <Terminal className="w-7 h-7 fill-current" />
          <span className="text-[9px] font-black uppercase">المختبر</span>
        </div>
        <Link href="/history" className="flex flex-col items-center gap-1 text-muted-foreground/40 hover:text-primary transition-all">
          <History className="w-7 h-7" />
          <span className="text-[9px] font-black uppercase">الأرشيف</span>
        </Link>
      </nav>
    </div>
  );
}
