'use client';

import { useState } from 'react';
import { useWorkbenchStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Send, RefreshCw, Cpu, ArrowRight, Zap, History, Terminal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { testAIProjectResponses } from '@/ai/flows/test-ai-project-responses';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function PlaygroundPage() {
  const { projects, addSession, isLoaded } = useWorkbenchStore();
  const { toast } = useToast();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = async () => {
    if (!selectedProjectId || !input) return;
    const project = projects.find(p => p.id === selectedProjectId);
    if (!project) return;

    setIsLoading(true);
    try {
      const result = await testAIProjectResponses({ 
        prompt: `${project.prompt}\n\nUser: ${input}` 
      });
      setOutput(result.response);
      addSession(project.id, input, result.response);
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'فشل في توليد الاستجابة.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-background p-4 pb-20 space-y-6 max-w-md mx-auto" dir="rtl">
      <Toaster />
      
      <header className="flex items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold">المختبر التفاعلي</h1>
        </div>
      </header>

      <div className="space-y-4">
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase text-muted-foreground mr-1">اختر المشروع لتجربته</span>
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="w-full h-12 rounded-xl bg-card">
              <SelectValue placeholder="اختر مشروعاً من قائمتك" />
            </SelectTrigger>
            <SelectContent>
              {projects.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Textarea 
            placeholder="اكتب استفسارك هنا..."
            className="min-h-[150px] p-4 text-base bg-card rounded-2xl shadow-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button 
            className="w-full h-14 text-lg font-bold rounded-2xl gap-2 shadow-lg" 
            disabled={isLoading || !input || !selectedProjectId}
            onClick={handleRun}
          >
            {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            توليد الاستجابة
          </Button>
        </div>

        {output && (
          <div className="bg-card border-primary/20 border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-[10px] font-black uppercase text-primary tracking-widest">رد الذكاء الاصطناعي</span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                <Cpu className="w-3 h-3 text-primary" />
                <span className="text-[10px] text-primary font-bold">
                  {projects.find(p => p.id === selectedProjectId)?.model}
                </span>
              </div>
            </div>
            <div className="text-sm font-mono leading-relaxed whitespace-pre-wrap">
              {output}
            </div>
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t flex items-center justify-around px-4 shadow-2xl z-50">
        <Link href="/" className="flex flex-col items-center gap-1 text-muted-foreground">
          <Zap className="w-6 h-6" />
          <span className="text-[10px] font-bold">الرئيسية</span>
        </Link>
        <Link href="/playground" className="flex flex-col items-center gap-1 text-primary">
          <Terminal className="w-6 h-6 fill-current" />
          <span className="text-[10px] font-bold">المختبر</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center gap-1 text-muted-foreground">
          <History className="w-6 h-6" />
          <span className="text-[10px] font-bold">السجل</span>
        </Link>
      </nav>
    </div>
  );
}
