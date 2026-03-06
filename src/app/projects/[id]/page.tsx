
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
    <div className="min-h-screen bg-background p-4 pb-28 space-y-6 max-w-md mx-auto" dir="rtl">
      <Toaster />
      
      <header className="flex items-center justify-between bg-card p-4 rounded-2xl border border-primary/20 shadow-md">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="h-12 w-12 hover:bg-primary/10">
          <ArrowRight className="w-8 h-8" />
        </Button>
        <input 
          value={project.name}
          onChange={(e) => setProject({ ...project, name: e.target.value })}
          className="bg-transparent font-black text-center flex-1 border-none focus:ring-0 focus:outline-none text-xl truncate px-2"
        />
        <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive h-12 w-12 hover:bg-destructive/10">
          <Trash2 className="w-7 h-7" />
        </Button>
      </header>

      <Collapsible open={showKeys} onOpenChange={setShowKeys} className="bg-card p-5 rounded-2xl border-2 border-accent/20 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Key className="w-6 h-6 text-accent" />
            <Label className="text-xs font-black uppercase text-accent tracking-tighter">مفتاح Gemini API</Label>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-black rounded-lg border-accent/30 text-accent">
              {showKeys ? 'إغفاء' : 'تعديل المفتاح'}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        {project.apiKeys?.[0] && !showKeys && (
          <div className="flex items-center gap-2 text-accent bg-accent/5 p-2 rounded-lg border border-accent/10">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[10px] font-bold">المفتاح نشط ومحمي</span>
          </div>
        )}

        <CollapsibleContent className="space-y-4 pt-2">
          <Alert className="bg-accent/10 border-accent/20 p-3 rounded-xl">
            <Info className="h-4 w-4 text-accent" />
            <AlertDescription className="text-xs text-accent font-bold leading-relaxed text-right">
              الصق مفتاح API الذي حصلت عليه من Google AI Studio هنا. سيتم استخدامه لتشغيل تجاربك.
            </AlertDescription>
          </Alert>
          <div className="space-y-2">
            <Input 
              type="password"
              placeholder="AIzaSy..."
              value={project.apiKeys?.[0] || ''}
              onChange={(e) => setProject({ ...project, apiKeys: [e.target.value] })}
              className="h-14 bg-background font-mono text-base border-2 border-accent/20 rounded-xl"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="bg-card p-5 rounded-3xl border-2 shadow-lg space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1.5 h-full bg-primary/30"></div>
        <div className="flex items-center justify-between">
          <Label className="text-xs font-black uppercase text-muted-foreground tracking-widest">تعليمات النظام (Prompt)</Label>
          <Button 
            variant="secondary" 
            size="sm" 
            className="text-primary h-10 px-4 bg-primary/10 rounded-full border-2 border-primary/20"
            onClick={handleRefinePrompt}
            disabled={isRefining}
          >
            {isRefining ? <RefreshCw className="w-5 h-5 animate-spin ml-2" /> : <Sparkles className="w-5 h-5 ml-2" />}
            <span className="text-xs font-black">{isRefining ? 'جاري...' : 'تحسين ذكي'}</span>
          </Button>
        </div>
        <Textarea 
          value={project.prompt}
          onChange={(e) => setProject({ ...project, prompt: e.target.value })}
          placeholder="أدخل تعليمات النظام الضخمة هنا..."
          className="min-h-[250px] text-lg leading-relaxed bg-background/50 rounded-2xl border-dashed border-2 p-4"
        />
        <Button onClick={handleSave} className="w-full h-16 font-black text-xl gap-4 shadow-xl rounded-2xl active:scale-95 transition-transform">
          <Save className="w-7 h-7" /> حفظ كل التغييرات
        </Button>
      </div>

      <div className="bg-muted/30 p-5 rounded-3xl border-2 border-dashed border-primary/20 space-y-5">
        <div className="flex items-center gap-3">
          <Play className="w-6 h-6 text-primary" />
          <Label className="text-sm font-black text-muted-foreground uppercase tracking-tighter">منطقة التجربة السريعة</Label>
        </div>
        <Textarea 
          placeholder="ماذا تريد أن تسأل هذا الموجه؟"
          className="min-h-[120px] bg-background border-2 border-primary/5 rounded-2xl shadow-inner text-lg p-4"
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
        />
        <Button 
          variant="default" 
          className="w-full h-16 font-black text-xl rounded-2xl gap-3 shadow-lg border-b-4 border-primary/80 active:border-b-0 active:translate-y-1 transition-all" 
          onClick={handleRunTest}
          disabled={isRunning || !testInput}
        >
          {isRunning ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6 fill-current" />}
          {isRunning ? 'جاري التحليل...' : 'تشغيل الموجه'}
        </Button>

        {testOutput && (
          <div className="p-5 bg-card rounded-2xl border-2 border-primary/20 text-lg whitespace-pre-wrap font-medium leading-relaxed shadow-sm animate-in zoom-in-95">
            <div className="text-[10px] font-black text-primary mb-3 border-b border-primary/10 pb-2 tracking-widest uppercase">النتيجة النهائية:</div>
            {testOutput}
          </div>
        )}
      </div>
    </div>
  );
}
