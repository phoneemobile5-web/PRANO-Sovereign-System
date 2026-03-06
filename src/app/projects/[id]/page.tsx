
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Info,
  ChevronDown
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
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ProjectEditor() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { projects, updateProject, deleteProject, isLoaded, addSession } = useWorkbenchStore();
  const [project, setProject] = useState<AIProject | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [showKeys, setShowKeys] = useState(false);

  useEffect(() => {
    if (isLoaded) {
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
        title: "تم الحفظ بنجاح ✅",
        description: "تم تحديث "وصفة" المشروع.",
      });
    }
  };

  const handleDelete = () => {
    if (confirm('هل أنت متأكد من حذف هذا المشروع نهائياً؟')) {
      deleteProject(id as string);
      router.push('/');
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
        title: "فشل التحسين",
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
      addSession(project.id, testInput, result.response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في التشغيل ⚠️",
        description: "تأكد من صحة مفتاح Gemini API في قسم الإعدادات أدناه.",
      });
    } finally {
      setIsRunning(false);
    }
  };

  if (!isLoaded || !project) return null;

  return (
    <div className="min-h-screen bg-background p-4 pb-32 space-y-6 max-w-md mx-auto" dir="rtl">
      <Toaster />
      
      <header className="flex items-center justify-between bg-card p-5 rounded-3xl border-2 border-primary/20 shadow-xl">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="h-12 w-12 bg-secondary rounded-2xl">
          <ArrowRight className="w-8 h-8" />
        </Button>
        <div className="flex-1 px-4">
          <input 
            value={project.name}
            onChange={(e) => setProject({ ...project, name: e.target.value })}
            className="bg-transparent font-black text-right w-full border-none focus:ring-0 text-xl truncate"
          />
        </div>
        <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive h-12 w-12 bg-destructive/10 rounded-2xl">
          <Trash2 className="w-6 h-6" />
        </Button>
      </header>

      <section className="bg-card p-5 rounded-[40px] border-4 border-primary/10 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b-2 border-primary/10 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <Label className="text-[11px] font-black uppercase text-primary tracking-widest">١. تعليمات النظام (وصفة الذكاء)</Label>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            className="h-8 px-4 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border-none"
            onClick={handleRefinePrompt}
            disabled={isRefining}
          >
            {isRefining ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            <span className="text-[10px] font-black mr-1">تحسين ذكي</span>
          </Button>
        </div>

        <Textarea 
          value={project.prompt}
          onChange={(e) => setProject({ ...project, prompt: e.target.value })}
          className="min-h-[200px] text-base font-medium leading-relaxed rounded-2xl border-2 p-4 shadow-inner bg-background/50 focus:border-primary/40 transition-all"
          placeholder="اكتب هنا كيف تريد للذكاء أن يتصرف..."
        />

        <Button onClick={handleSave} className="w-full h-16 font-black text-xl gap-3 rounded-2xl shadow-lg active:scale-95 transition-transform">
          <Save className="w-6 h-6" /> حفظ التعديلات
        </Button>
      </section>

      <Collapsible open={showKeys} onOpenChange={setShowKeys} className="bg-card p-5 rounded-[32px] border-2 border-accent/20 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-xl">
              <Key className="w-6 h-6 text-accent" />
            </div>
            <div>
              <Label className="text-[11px] font-black uppercase text-accent leading-none">إعدادات الاتصال</Label>
              <p className="text-[9px] text-muted-foreground font-bold mt-1">مفتاح Gemini API والنموذج</p>
            </div>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 px-4 font-black rounded-xl border-2">
              تعديل <ChevronDown className={`w-4 h-4 mr-1 transition-transform ${showKeys ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="pt-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase mr-1">مفتاح جيميناي النشط</label>
            <Input 
              type="password"
              placeholder="الصق مفتاح API الخاص بك هنا..."
              value={project.apiKeys?.[0] || ''}
              onChange={(e) => setProject({ ...project, apiKeys: [e.target.value] })}
              className="h-12 font-mono text-sm border-2 rounded-xl bg-background"
            />
          </div>
          <Alert className="bg-accent/5 border-accent/10 py-2">
            <Info className="w-4 h-4 text-accent" />
            <AlertDescription className="text-[10px] font-bold text-accent mr-1 leading-relaxed">
              تأكد من أن المفتاح هو Gemini API Key من Google AI Studio.
            </AlertDescription>
          </Alert>
        </CollapsibleContent>
      </Collapsible>

      <section className="bg-muted/40 p-6 rounded-[48px] border-4 border-dashed border-primary/20 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            <Label className="text-[11px] font-black uppercase text-muted-foreground tracking-widest">٢. اختبار النظام (السؤال)</Label>
          </div>
        </div>

        <Textarea 
          placeholder="اكتب سؤالاً لاختبار ذكاء مشروعك..."
          className="min-h-[100px] bg-background border-2 border-primary/10 rounded-2xl text-lg p-4 shadow-sm"
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
        />
        
        <Button 
          className="w-full h-18 text-xl font-black rounded-3xl gap-4 shadow-2xl active:scale-95 transition-all bg-primary hover:bg-primary/90" 
          onClick={handleRunTest}
          disabled={isRunning || !testInput}
        >
          {isRunning ? <RefreshCw className="w-7 h-7 animate-spin" /> : <Play className="w-7 h-7 fill-current" />}
          {isRunning ? 'جاري التوليد...' : 'تشغيل التجربة'}
        </Button>

        {testOutput && (
          <div className="p-6 bg-card rounded-[32px] border-2 border-primary/20 text-base font-medium whitespace-pre-wrap leading-relaxed animate-in zoom-in-95 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-primary/20"></div>
            <div className="text-[10px] font-black text-primary mb-3 border-b border-primary/10 pb-2 uppercase tracking-widest">رد الذكاء الاصطناعي:</div>
            {testOutput}
          </div>
        )}
      </section>
    </div>
  );
}
