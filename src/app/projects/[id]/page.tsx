
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
  ShieldCheck
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
        description: "تم تحديث إعدادات المشروع ومفاتيح الوصول.",
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
        description: "تأكد من اتصالك بالإنترنت وصحة المفتاح.",
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
      const combinedPrompt = `${project.prompt}\n\nUser input: ${testInput}`;
      const result = await testAIProjectResponses({ prompt: combinedPrompt });
      setTestOutput(result.response);
      addSession(project.id, testInput, result.response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "فشل الاختبار",
        description: "حدث خطأ أثناء توليد الاستجابة.",
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

      {/* قسم إدارة المفاتيح - مخصص للمستخدم */}
      <Collapsible open={showKeys} onOpenChange={setShowKeys} className="bg-card p-4 rounded-2xl border border-accent/20 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-accent" />
            <Label className="text-[10px] font-black uppercase text-accent tracking-widest">إدارة مفاتيح التشغيل</Label>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold">
              {showKeys ? 'إخفاء' : 'عرض الإعدادات'}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-muted-foreground mr-1">Gemini API Key (من Google AI Studio)</span>
            <Input 
              type="password"
              placeholder="الصق مفتاح API هنا..."
              value={project.apiKeys?.[0] || ''}
              onChange={(e) => handleKeyChange(e.target.value)}
              className="h-12 bg-background font-mono text-xs border-2 focus:border-accent"
            />
          </div>
          <div className="flex items-center gap-2 p-2 bg-accent/5 rounded-lg border border-accent/10">
            <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
            <p className="text-[9px] text-accent font-bold leading-tight">يتم تخزين هذا المفتاح بأمان في مشروعك الخاص فقط.</p>
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
            className="text-primary h-8 px-2 bg-primary/5 hover:bg-primary/10 rounded-full"
            onClick={handleRefinePrompt}
            disabled={isRefining}
          >
            {isRefining ? <RefreshCw className="w-4 h-4 animate-spin ml-1" /> : <Sparkles className="w-4 h-4 ml-1" />}
            <span className="text-[10px] font-bold">{isRefining ? 'جاري التحسين...' : 'تحسين ذكي'}</span>
          </Button>
        </div>
        <Textarea 
          value={project.prompt}
          onChange={(e) => setProject({ ...project, prompt: e.target.value })}
          placeholder="أدخل تعليمات النظام هنا (مثلاً: أنت مساعد متخصص في...)"
          className="min-h-[220px] text-sm leading-relaxed bg-background/50 rounded-xl border-dashed border-2 focus:border-solid transition-all"
        />
        <Button onClick={handleSave} className="w-full h-14 font-black text-lg gap-3 shadow-lg rounded-2xl active:scale-95">
          <Save className="w-6 h-6" /> حفظ المشروع
        </Button>
      </div>

      <div className="bg-muted/40 p-5 rounded-2xl border border-dashed border-primary/20 space-y-4 shadow-inner">
        <div className="flex items-center gap-2 mb-1">
          <Play className="w-4 h-4 text-primary" />
          <Label className="text-xs font-black text-muted-foreground uppercase">تجربة فورية (Sandbox)</Label>
        </div>
        <Textarea 
          placeholder="اكتب سؤالاً أو طلباً لتجربة الموجه..."
          className="min-h-[120px] bg-background border-none shadow-sm text-sm"
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
        />
        <Button 
          variant="secondary" 
          className="w-full h-14 font-black text-base rounded-xl gap-2 border-2 border-primary/10 hover:bg-primary/5" 
          onClick={handleRunTest}
          disabled={isRunning || !testInput}
        >
          {isRunning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
          {isRunning ? 'جاري التحليل...' : 'تشغيل الاختبار'}
        </Button>

        {testOutput && (
          <div className="p-4 bg-background rounded-2xl border-2 border-primary/10 text-sm whitespace-pre-wrap font-mono leading-relaxed shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-[9px] font-black text-primary mb-2 border-b pb-1">النتيجة المولدة:</div>
            {testOutput}
          </div>
        )}
      </div>

      <div className="bg-card p-4 rounded-2xl border flex items-center justify-between shadow-sm border-r-4 border-r-accent/30">
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase text-muted-foreground tracking-tighter">النموذج المستخدم</span>
          <span className="text-sm font-bold text-accent">{project.model}</span>
        </div>
        <Button variant="outline" size="sm" className="h-9 gap-2 rounded-xl text-xs font-bold border-2">
          <Settings2 className="w-4 h-4" /> خيارات الموديل
        </Button>
      </div>
    </div>
  );
}
