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
  Settings2,
  Trash2,
  Key,
  ShieldCheck,
  Info
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
      const combinedPrompt = `${project.prompt}\n\nالمستخدم: ${testInput}`;
      const result = await testAIProjectResponses({ 
        prompt: combinedPrompt,
        apiKey: project.apiKeys?.[0], // نمرر مفتاح المستخدم الخاص
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

  const handleKeyChange = (val: string) => {
    if (project) {
      setProject({ ...project, apiKeys: [val] });
    }
  };

  if (!isLoaded || !project) return null;

  return (
    <div className="min-h-screen bg-background p-4 pb-28 space-y-6 max-w-md mx-auto" dir="rtl">
      <Toaster />
      
      <header className="flex items-center justify-between bg-card p-4 rounded-2xl border border-primary/20 shadow-md">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="hover:bg-primary/10">
          <ArrowRight className="w-6 h-6" />
        </Button>
        <input 
          value={project.name}
          onChange={(e) => setProject({ ...project, name: e.target.value })}
          className="bg-transparent font-black text-center flex-1 border-none focus:ring-0 focus:outline-none text-lg truncate px-2"
        />
        <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive hover:bg-destructive/10">
          <Trash2 className="w-5 h-5" />
        </Button>
      </header>

      <Collapsible open={showKeys} onOpenChange={setShowKeys} className="bg-card p-4 rounded-2xl border border-accent/20 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-accent" />
            <Label className="text-[10px] font-black uppercase text-accent tracking-widest">إدارة مفتاح Gemini</Label>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold">
              {showKeys ? 'إخفاء' : 'عرض الإعدادات'}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="space-y-4 pt-2">
          <Alert className="bg-accent/5 border-accent/20 p-2">
            <Info className="h-3 w-3 text-accent" />
            <AlertDescription className="text-[9px] text-accent leading-tight">
              استخدم مفتاح **API Key** من Google AI Studio لتشغيل هذا المشروع.
            </AlertDescription>
          </Alert>
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-muted-foreground mr-1">الصق المفتاح هنا</span>
            <Input 
              type="password"
              placeholder="AIzaSy..."
              value={project.apiKeys?.[0] || ''}
              onChange={(e) => handleKeyChange(e.target.value)}
              className="h-12 bg-background font-mono text-xs border-2"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="bg-card p-4 rounded-2xl border space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1 h-full bg-primary/20"></div>
        <div className="flex items-center justify-between">
          <Label className="text-xs font-black uppercase text-muted-foreground">التعليمات الأساسية (Prompt)</Label>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary h-8 px-2 bg-primary/5 rounded-full"
            onClick={handleRefinePrompt}
            disabled={isRefining}
          >
            {isRefining ? <RefreshCw className="w-4 h-4 animate-spin ml-1" /> : <Sparkles className="w-4 h-4 ml-1" />}
            <span className="text-[10px] font-bold">{isRefining ? 'جاري...' : 'تحسين'}</span>
          </Button>
        </div>
        <Textarea 
          value={project.prompt}
          onChange={(e) => setProject({ ...project, prompt: e.target.value })}
          placeholder="أدخل تعليمات النظام هنا..."
          className="min-h-[200px] text-sm leading-relaxed bg-background/50 rounded-xl border-dashed border-2"
        />
        <Button onClick={handleSave} className="w-full h-14 font-black text-lg gap-3 shadow-lg rounded-2xl">
          <Save className="w-6 h-6" /> حفظ المشروع
        </Button>
      </div>

      <div className="bg-muted/40 p-4 rounded-2xl border border-dashed border-primary/20 space-y-4">
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4 text-primary" />
          <Label className="text-xs font-black text-muted-foreground uppercase">تجربة سريعة</Label>
        </div>
        <Textarea 
          placeholder="اكتب سؤالاً..."
          className="min-h-[100px] bg-background border-none shadow-sm text-sm"
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
        />
        <Button 
          variant="secondary" 
          className="w-full h-14 font-black text-base rounded-xl gap-2 border-2" 
          onClick={handleRunTest}
          disabled={isRunning || !testInput}
        >
          {isRunning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
          {isRunning ? 'جاري التحليل...' : 'تشغيل التجربة'}
        </Button>

        {testOutput && (
          <div className="p-4 bg-background rounded-2xl border-2 border-primary/10 text-sm whitespace-pre-wrap font-mono leading-relaxed">
            <div className="text-[9px] font-black text-primary mb-2 border-b pb-1">النتيجة:</div>
            {testOutput}
          </div>
        )}
      </div>
    </div>
  );
}
