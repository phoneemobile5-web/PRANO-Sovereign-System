
'use client';

import { useState } from 'react';
import { useWorkbenchStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Send, RefreshCw, Cpu, Zap, History, Terminal, AlertCircle, HelpCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { testAIProjectResponses } from '@/ai/flows/test-ai-project-responses';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/navigation';
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PlaygroundPage() {
  const { projects, addSession, isLoaded } = useWorkbenchStore();
  const { toast } = useToast();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const handleRun = async () => {
    if (!selectedProjectId || !input) return;
    if (!selectedProject) return;

    setIsLoading(true);
    try {
      const result = await testAIProjectResponses({ 
        prompt: `${selectedProject.prompt}\n\nالسؤال: ${input}`,
        apiKey: selectedProject.apiKeys?.[0],
        model: selectedProject.model
      });
      setOutput(result.response);
      addSession(selectedProject.id, input, result.response);
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'خطأ في التوليد',
        description: 'تأكد من صحة مفتاح Gemini API ومن اتصالك بالإنترنت.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-background p-3 pb-24 space-y-5 max-w-md mx-auto" dir="rtl">
      <Toaster />
      
      <header className="flex items-center gap-3 bg-card p-4 rounded-2xl border border-primary/20 shadow-md">
        <Terminal className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-black">المختبر التفاعلي</h1>
      </header>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground mr-1 tracking-widest">اختر "عقل" المشروع</label>
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="w-full h-14 rounded-xl bg-card border-2 border-primary/10 text-base font-bold">
              <SelectValue placeholder="اختر شخصية الذكاء..." />
            </SelectTrigger>
            <SelectContent>
              {projects.map(p => (
                <SelectItem key={p.id} value={p.id} className="font-bold text-base py-3">{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedProject && (
          <div className="bg-primary/5 p-3 rounded-xl border border-primary/10">
            <p className="text-[10px] font-black text-primary uppercase mb-1 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" /> تعليمات هذا العقل حالياً:
            </p>
            <p className="text-[11px] text-muted-foreground italic line-clamp-2">"{selectedProject.prompt}"</p>
          </div>
        )}

        <div className="space-y-3">
          <Textarea 
            placeholder="اكتب سؤالك هنا ليجيب عليه الذكاء بناءً على تخصصه..."
            className="min-h-[140px] p-4 text-lg bg-card rounded-2xl border-2 shadow-inner focus:border-primary/30 transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button 
            className="w-full h-16 text-xl font-black rounded-2xl gap-3 shadow-xl active:scale-95 transition-transform" 
            disabled={isLoading || !input || !selectedProjectId}
            onClick={handleRun}
          >
            {isLoading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
            تشغيل الذكاء
          </Button>
        </div>

        {output && (
          <div className="bg-card border-primary/20 border-2 rounded-2xl p-5 shadow-lg space-y-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between border-b border-primary/10 pb-2">
              <span className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current" /> رد جيميناي
              </span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase">{selectedProject?.model}</span>
            </div>
            <div className="text-base font-medium leading-relaxed whitespace-pre-wrap">
              {output}
            </div>
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card/95 backdrop-blur-md border-t flex items-center justify-around px-6 shadow-2xl z-50 rounded-t-[32px]">
        <Link href="/" className="flex flex-col items-center gap-1 text-muted-foreground/60">
          <Zap className="w-6 h-6" />
          <span className="text-[10px] font-bold">الرئيسية</span>
        </Link>
        <div className="flex flex-col items-center gap-1 text-primary scale-110">
          <Terminal className="w-6 h-6 fill-current" />
          <span className="text-[10px] font-black">المختبر</span>
        </div>
        <Link href="/history" className="flex flex-col items-center gap-1 text-muted-foreground/60">
          <History className="w-6 h-6" />
          <span className="text-[10px] font-bold">السجل</span>
        </Link>
      </nav>
    </div>
  );
}
