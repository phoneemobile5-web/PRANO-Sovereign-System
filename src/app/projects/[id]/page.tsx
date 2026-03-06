
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
  Cpu,
  HelpCircle
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
        description: "تم تحديث إعدادات العقل (الموجه).",
      });
    }
  };

  const handleDelete = () => {
    if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
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
        description: "تم تطوير التعليمات لتكون أكثر دقة.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "فشل التحسين",
        description: "تأكد من الاتصال بالإنترنت.",
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
        title: "خطأ في التشغيل ❌",
        description: "تأكد من صحة مفتاح Gemini API.",
      });
    } finally {
      setIsRunning(false);
    }
  };

  if (!isLoaded || !project) return null;

  return (
    <div className="min-h-screen bg-background p-3 pb-32 space-y-6 max-w-md mx-auto" dir="rtl">
      <Toaster />
      
      <header className="flex items-center justify-between bg-card p-4 rounded-2xl border border-primary/20 shadow-md">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="h-10 w-10">
          <ArrowRight className="w-8 h-8" />
        </Button>
        <div className="flex-1 px-2">
          <input 
            value={project.name}
            onChange={(e) => setProject({ ...project, name: e.target.value })}
            className="bg-transparent font-black text-center w-full border-none focus:ring-0 text-xl truncate"
          />
        </div>
        <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive">
          <Trash2 className="w-6 h-6" />
        </Button>
      </header>

      {/* القسم الأول: عقل الذكاء (الموجه) */}
      <div className="bg-card p-5 rounded-[24px] border-2 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-[10px] font-black uppercase text-primary tracking-widest">١. تعليمات النظام (الموجه)</Label>
            <p className="text-[10px] text-muted-foreground font-bold">هنا تحدد "من هو" هذا الذكاء</p>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            className="h-10 px-3 bg-primary/10 rounded-xl border border-primary/20"
            onClick={handleRefinePrompt}
            disabled={isRefining}
          >
            {isRefining ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span className="text-xs font-black mr-1">{isRefining ? 'جاري...' : 'تحسين'}</span>
          </Button>
        </div>

        <Textarea 
          value={project.prompt}
          onChange={(e) => setProject({ ...project, prompt: e.target.value })}
          placeholder="مثال: أنت مساعد ذكي متخصص في تلخيص الكتب العربية..."
          className="min-h-[200px] text-lg leading-relaxed rounded-xl border-2 p-4 shadow-inner"
        />

        <Button onClick={handleSave} className="w-full h-14 font-black text-lg gap-2 shadow-lg rounded-xl">
          <Save className="w-6 h-6" /> حفظ التعليمات
        </Button>
      </div>

      {/* القسم الثاني: المفتاح */}
      <Collapsible open={showKeys} onOpenChange={setShowKeys} className="bg-card p-4 rounded-[24px] border-2 border-accent/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Key className="w-6 h-6 text-accent" />
            <Label className="text-xs font-black uppercase text-accent tracking-tighter">مفتاح Gemini API</Label>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-[10px] font-black rounded-lg">
              {showKeys ? 'إخفاء' : 'تعديل'}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="space-y-3 pt-3">
          <Input 
            type="password"
            placeholder="الصق المفتاح من AI Studio..."
            value={project.apiKeys?.[0] || ''}
            onChange={(e) => setProject({ ...project, apiKeys: [e.target.value] })}
            className="h-12 bg-background font-mono text-lg border-2 rounded-xl px-4"
          />
        </CollapsibleContent>
      </Collapsible>

      {/* القسم الثالث: التجربة والسؤال */}
      <div className="bg-muted/30 p-5 rounded-[24px] border-2 border-dashed border-primary/20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">٢. تجربة العقل (السؤال)</Label>
            <p className="text-[10px] text-muted-foreground font-bold italic leading-none">اسأل هذا الذكاء لترى كيف سيتصرف</p>
          </div>
          <Cpu className="w-5 h-5 text-primary opacity-50" />
        </div>

        <Textarea 
          placeholder="اكتب سؤالك هنا ليجيب عليه الذكاء بناءً على التعليمات أعلاه..."
          className="min-h-[100px] bg-background border-2 border-primary/5 rounded-xl text-lg p-4"
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
        />
        
        <Button 
          className="w-full h-14 font-black text-xl rounded-xl gap-3 shadow-xl active:translate-y-1 transition-all" 
          onClick={handleRunTest}
          disabled={isRunning || !testInput}
        >
          {isRunning ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6 fill-current" />}
          {isRunning ? 'جاري التحليل...' : 'اسأل الذكاء'}
        </Button>

        {testOutput && (
          <div className="p-4 bg-card rounded-2xl border-2 border-primary/20 text-lg whitespace-pre-wrap font-medium leading-relaxed animate-in zoom-in-95">
            <div className="text-[10px] font-black text-primary mb-2 border-b border-primary/10 pb-2 flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> رد الذكاء الاصطناعي:
            </div>
            {testOutput}
          </div>
        )}
      </div>
    </div>
  );
}
