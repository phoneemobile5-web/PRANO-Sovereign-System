'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkbenchStore, AIProject } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  Play, 
  RefreshCw,
  Sparkles,
  ArrowRight,
  Trash2,
  Key,
  Cpu,
  ChevronDown,
  ClipboardPaste,
  CheckCircle2
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { refinePromptsWithAI } from '@/ai/flows/refine-prompts-with-ai';
import { testAIProjectResponses } from '@/ai/flows/test-ai-project-responses';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/**
 * @fileOverview محرر المهام السيادي - النواة العليا v3.1.
 * تم تحديثه لفك تغليف params بوقار Next.js 15 وتجنب خطأ التعداد.
 */

export default function ProjectEditor({ params }: { params: Promise<{ id: string }> }) {
  // فك تغليف المعاملات بوقار سيادي عبر React.use() لضمان التوافق مع Next.js 15
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const router = useRouter();
  const { toast } = useToast();
  const { projects, updateProject, deleteProject, isLoaded, addMessage } = useWorkbenchStore();
  const [project, setProject] = useState<AIProject | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [showKeys, setShowKeys] = useState(true);

  useEffect(() => {
    if (isLoaded && id) {
      const found = projects.find(p => p.id === id);
      if (found) {
        setProject({ ...found });
      } else {
        router.push('/');
      }
    }
  }, [id, projects, isLoaded, router]);

  const handleSave = () => {
    if (project) {
      updateProject(project.id, project);
      toast({
        title: "تم حفظ المهمة بنجاح ✅",
        description: "بياناتك آمنة في مركز قيادة الجوزاء بسلام v3.1.",
      });
    }
  };

  const handleConfirmDelete = () => {
    if (id) {
      deleteProject(id);
      router.push('/');
      toast({
        title: "تم مسح المهمة السيادية",
      });
    }
  };

  const handleRefinePrompt = async () => {
    if (!project?.prompt) return;
    setIsRefining(true);
    try {
      const result = await refinePromptsWithAI({ prompt: project.prompt });
      setProject({ ...project, prompt: result.refinedPrompt });
      toast({
        title: "تم التحسين الذكي ✨",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "فشل التحسين السينابتي",
      });
    } finally {
      setIsRefining(false);
    }
  };

  const handleRunTest = async () => {
    if (!project || !testInput) return;
    setIsRunning(true);
    setTestOutput('');
    try {
      const result = await testAIProjectResponses({ 
        prompt: `${project.prompt}\n\nالسؤال: ${testInput}`,
        apiKey: project.apiKeys?.[0], 
        model: project.model
      });
      setTestOutput(result.response);
      addMessage({ role: 'user', text: testInput });
      addMessage({ role: 'model', text: result.response });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "فشل التشغيل الإدراكي ⚠️",
        description: "تحقق من مفتاح Gemini ومن اتصالك بالشبكة السيادية للجوزاء.",
      });
    } finally {
      setIsRunning(false);
    }
  };

  if (!isLoaded || !project) return (
    <div className="min-h-screen flex items-center justify-center bg-[#001a1a]">
      <RefreshCw className="w-10 h-10 animate-spin text-[#d4af37]" />
    </div>
  );

  const isKeyCorrect = project.apiKeys?.[0]?.startsWith('AIza');

  return (
    <div className="min-h-screen bg-[#001a1a] p-4 pb-32 space-y-6 max-w-md mx-auto font-kufi relative" dir="rtl">
      <Toaster />
      
      <header className="flex items-center justify-between glass-turquoise p-5 rounded-[2.5rem] border border-white/10 shadow-3xl">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="h-14 w-14 glass-turquoise rounded-2xl hover:bg-white/10 shrink-0">
          <ArrowRight className="w-8 h-8 text-[#00ffff]" />
        </Button>
        <div className="flex-1 px-4 text-right overflow-hidden">
          <input 
            value={project.name}
            onChange={(e) => setProject({ ...project, name: e.target.value })}
            className="bg-transparent font-black text-right w-full border-none focus:ring-0 text-xl gold-gradient-text truncate font-diwani"
          />
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive h-14 w-14 glass-turquoise rounded-2xl hover:bg-destructive/20 shrink-0">
              <Trash2 className="w-7 h-7" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-[3rem] glass-turquoise border-white/10 shadow-3xl font-kufi" dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-right text-2xl font-black gold-gradient-text font-diwani">حذف المهمة؟</AlertDialogTitle>
              <AlertDialogDescription className="text-right text-lg text-white/60 font-medium font-diwani italic">
                هل أنت متأكد؟ سيتم إيقاف هذه المهمة الأرضية نهائياً وفك ارتباطها السينابتي بالجوزاء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row-reverse gap-3 pt-4">
              <AlertDialogAction 
                className="bg-destructive text-white rounded-2xl flex-1 h-14 font-black text-xl shadow-lg border-none"
                onClick={handleConfirmDelete}
              >
                نعم، احذف
              </AlertDialogAction>
              <AlertDialogCancel className="rounded-2xl flex-1 mt-0 h-14 font-bold border-white/10 glass-turquoise text-white">إلغاء</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>

      <Collapsible open={showKeys} onOpenChange={setShowKeys} className="glass-turquoise p-6 rounded-[2.5rem] border border-white/10 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 p-6 opacity-5 pointer-events-none">
           <Key className="w-24 h-24 text-[#d4af37]" />
        </div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4 text-right">
            <div className="p-3 bg-[#d4af37]/10 rounded-2xl shadow-inner shrink-0">
              <Key className="w-7 h-7 text-[#d4af37]" />
            </div>
            <div>
              <Label className="text-[12px] font-black uppercase text-[#d4af37] leading-none tracking-widest font-diwani">مفتاح التشغيل (API Key)</Label>
              <p className="text-[10px] text-white/30 font-bold mt-2 font-diwani">ضع مفتاح Gemini ليعمل النظام بوقار الجوزاء</p>
            </div>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 px-4 font-black rounded-xl border-white/10 glass-turquoise text-white/60 shrink-0">
              {showKeys ? 'إخفاء' : 'عرض'} <ChevronDown className={`w-4 h-4 mr-1 transition-transform ${showKeys ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="pt-6 space-y-5 relative z-10 text-right">
          <div className="space-y-2">
            <Label className="text-[10px] font-black text-[#d4af37] uppercase mr-1 font-diwani">المفتاح النشط</Label>
            <Input 
              type="password"
              placeholder="AIza..."
              value={project.apiKeys?.[0] || ''}
              onChange={(e) => setProject({ ...project, apiKeys: [e.target.value] })}
              className={`h-14 font-mono text-sm border-2 rounded-2xl bg-black/40 text-right focus:border-[#d4af37]/40 ${!isKeyCorrect && project.apiKeys?.[0] ? 'border-destructive' : 'border-white/10'}`}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <section className="glass-turquoise p-6 rounded-[3rem] border border-white/10 shadow-3xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3 text-right">
            <div className="p-3 bg-[#00ffff]/10 rounded-2xl shrink-0">
              <ClipboardPaste className="w-6 h-6 text-[#00ffff]" />
            </div>
            <div>
              <Label className="text-[12px] font-black uppercase text-[#00ffff] tracking-[0.2em] font-diwani">تعليمات الجوزاء (System)</Label>
              <p className="text-[9px] text-white/30 font-bold uppercase mt-1 font-diwani">الچينيوم الوراثي للمهمة</p>
            </div>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            className="h-10 px-5 rounded-full bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] border-none shadow-sm shrink-0"
            onClick={handleRefinePrompt}
            disabled={isRefining}
          >
            {isRefining ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span className="text-[11px] font-black mr-2 font-diwani">تحسين</span>
          </Button>
        </div>

        <Textarea 
          value={project.prompt}
          onChange={(e) => setProject({ ...project, prompt: e.target.value })}
          className="min-h-[220px] text-lg font-medium leading-relaxed rounded-2xl border-2 border-white/10 p-5 bg-black/40 focus:border-[#00ffff]/40 transition-all text-right font-diwani italic"
          placeholder="أدخل تعليمات المهمة بوقار سيادي..."
        />

        <Button onClick={handleSave} className="w-full h-20 font-black text-2xl gap-4 rounded-[1.5rem] shadow-2xl bg-gradient-to-r from-[#d4af37] to-[#ffdf00] text-[#002d2d] border-none font-diwani">
          <Save className="w-8 h-8" /> حفظ المهمة 💾
        </Button>
      </section>

      <section className="bg-white/5 p-8 rounded-[4rem] border-2 border-dashed border-[#00ffff]/20 space-y-6 relative overflow-hidden">
        <div className="flex items-center gap-3 text-right">
          <Cpu className="w-6 h-6 text-[#d4af37] animate-pulse shrink-0" />
          <Label className="text-[12px] font-black uppercase text-white/40 tracking-widest font-diwani">اختبار ذكاء النواة</Label>
        </div>

        <Textarea 
          placeholder="أدخل تساؤلاً للملاح..."
          className="min-h-[120px] bg-black/40 border-2 border-white/10 rounded-2xl text-xl p-5 shadow-lg focus:border-[#00ffff]/40 text-right font-diwani italic"
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
        />
        
        <Button 
          className="w-full h-20 text-2xl font-black rounded-[2rem] gap-5 shadow-2xl bg-gradient-to-r from-[#00ffff] to-[#00cccc] text-[#002d2d] border-none font-diwani" 
          onClick={handleRunTest}
          disabled={isRunning || !testInput || !isKeyCorrect}
        >
          {isRunning ? <RefreshCw className="w-8 h-8 animate-spin" /> : <Play className="w-8 h-8 fill-current" />}
          {isRunning ? 'جاري التحليل...' : 'تشغيل الاختبار'}
        </Button>

        {testOutput && (
          <div className="p-8 glass-turquoise rounded-[2.5rem] border border-[#d4af37]/20 text-lg font-medium whitespace-pre-wrap leading-relaxed animate-in zoom-in-95 shadow-3xl text-right font-diwani italic text-white/80">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
              <span className="text-[11px] font-black text-[#d4af37] uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> رد الجوزاء:
              </span>
            </div>
            {testOutput}
          </div>
        )}
      </section>
    </div>
  );
}