
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
  Info,
  CheckCircle2,
  Cpu
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
        title: "تم الحفظ بنجاح",
        description: "تم تحديث إعدادات المشروع ومفتاح التشغيل.",
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
        title: "تم تحسين الموجه",
        description: "قام الذكاء الاصطناعي بتطوير تعليماتك للأفضل.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "فشل التحسين",
        description: "تأكد من اتصالك بالإنترنت.",
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
        prompt: `${project.prompt}\n\nUser: ${testInput}`,
        apiKey: project.apiKeys?.[0],
        model: project.model
      });
      setTestOutput(result.response);
      addSession(project.id, testInput, result.response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "فشل الاختبار",
        description: "تأكد من صحة مفتاح Gemini الخاص بك.",
      });
    } finally {
      setIsRunning(false);
    }
  };

  if (!isLoaded || !project) return null;

  return (
    <div className="min-h-screen bg-background p-4 pb-32 space-y-6 max-w-md mx-auto" dir="rtl">
      <Toaster />
      
      <header className="flex items-center justify-between bg-card p-5 rounded-3xl border border-primary/20 shadow-lg">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="h-12 w-12 hover:bg-primary/10">
          <ArrowRight className="w-10 h-10" />
        </Button>
        <div className="flex-1 px-4 min-w-0">
          <input 
            value={project.name}
            onChange={(e) => setProject({ ...project, name: e.target.value })}
            className="bg-transparent font-black text-center w-full border-none focus:ring-0 focus:outline-none text-2xl truncate"
          />
        </div>
        <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive h-12 w-12 hover:bg-destructive/10">
          <Trash2 className="w-8 h-8" />
        </Button>
      </header>

      <div className="bg-card p-6 rounded-[32px] border-2 shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2 h-full bg-primary/40"></div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <Label className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">الموجه (التعليمات)</Label>
            <span className="text-[10px] font-bold text-muted-foreground mt-1">هذا هو "عقل" المشروع</span>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            className="text-primary h-12 px-5 bg-primary/10 rounded-2xl border-2 border-primary/20"
            onClick={handleRefinePrompt}
            disabled={isRefining}
          >
            {isRefining ? <RefreshCw className="w-6 h-6 animate-spin ml-2" /> : <Sparkles className="w-6 h-6 ml-2" />}
            <span className="text-sm font-black">{isRefining ? 'جاري...' : 'تحسين ذكي'}</span>
          </Button>
        </div>

        <Textarea 
          value={project.prompt}
          onChange={(e) => setProject({ ...project, prompt: e.target.value })}
          placeholder="أدخل تعليمات النظام (ما هي وظيفة هذا الذكاء؟)..."
          className="min-h-[280px] text-xl leading-relaxed bg-background/50 rounded-2xl border-dashed border-2 p-5 shadow-inner"
        />

        <div className="flex gap-2">
           <Button onClick={handleSave} className="flex-1 h-16 font-black text-xl gap-4 shadow-xl rounded-2xl active:scale-95 transition-transform">
            <Save className="w-7 h-7" /> حفظ التغييرات
          </Button>
        </div>
      </div>

      <Collapsible open={showKeys} onOpenChange={setShowKeys} className="bg-card p-6 rounded-[32px] border-2 border-accent/20 shadow-lg space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Key className="w-7 h-7 text-accent" />
            </div>
            <div>
              <Label className="text-xs font-black uppercase text-accent tracking-tighter block">مفتاح Gemini API</Label>
              {project.apiKeys?.[0] && !showKeys && (
                <div className="flex items-center gap-1.5 text-accent mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase">المفتاح نشط ✅</span>
                </div>
              )}
            </div>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 px-5 text-sm font-black rounded-xl border-accent/40 text-accent">
              {showKeys ? 'إغفاء' : 'تعديل'}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="space-y-4 pt-2">
          <Alert className="bg-accent/10 border-accent/30 p-4 rounded-2xl">
            <Info className="h-5 w-5 text-accent" />
            <AlertDescription className="text-sm text-accent font-bold leading-relaxed text-right pr-2">
              انسخ مفتاحك من Google AI Studio والصقه هنا لتفعيل المشروع.
            </AlertDescription>
          </Alert>
          <div className="space-y-2">
            <Input 
              type="password"
              placeholder="الصق المفتاح هنا..."
              value={project.apiKeys?.[0] || ''}
              onChange={(e) => setProject({ ...project, apiKeys: [e.target.value] })}
              className="h-16 bg-background font-mono text-xl border-2 border-accent/20 rounded-2xl px-4 shadow-inner"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="bg-muted/30 p-6 rounded-[40px] border-2 border-dashed border-primary/20 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Play className="w-7 h-7 text-primary" />
            </div>
            <Label className="text-lg font-black text-muted-foreground uppercase tracking-tighter">تجربة ذكاء المشروع</Label>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
            <Cpu className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase">{project.model}</span>
          </div>
        </div>

        <Textarea 
          placeholder="اكتب سؤالاً لهذا المشروع..."
          className="min-h-[140px] bg-background border-2 border-primary/5 rounded-2xl shadow-inner text-xl p-5"
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
        />
        
        <Button 
          variant="default" 
          className="w-full h-18 font-black text-2xl rounded-2xl gap-4 shadow-2xl border-b-4 border-primary/80 active:border-b-0 active:translate-y-1 transition-all" 
          onClick={handleRunTest}
          disabled={isRunning || !testInput}
        >
          {isRunning ? <RefreshCw className="w-8 h-8 animate-spin" /> : <Play className="w-8 h-8 fill-current" />}
          {isRunning ? 'جاري التحليل...' : 'تشغيل الموجه'}
        </Button>

        {testOutput && (
          <div className="p-6 bg-card rounded-3xl border-2 border-primary/20 text-xl whitespace-pre-wrap font-medium leading-relaxed shadow-lg animate-in zoom-in-95">
            <div className="text-[10px] font-black text-primary mb-4 border-b border-primary/10 pb-3 tracking-[0.2em] uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> رد الذكاء الاصطناعي:
            </div>
            {testOutput}
          </div>
        )}
      </div>
    </div>
  );
}
