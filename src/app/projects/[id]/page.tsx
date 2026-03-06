'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWorkbenchStore, AIProject } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  Play, 
  ChevronRight, 
  RefreshCw,
  Sparkles,
  ArrowRight,
  Settings2,
  Trash2
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { refinePromptsWithAI } from '@/ai/flows/refine-prompts-with-ai';
import { testAIProjectResponses } from '@/ai/flows/test-ai-project-responses';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

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
        description: "تم تحديث إعدادات المشروع.",
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
        title: "تم تحسين الموجه",
        description: "قام الذكاء الاصطناعي بتطوير تعليماتك.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "فشل التحسين",
        description: "حدث خطأ أثناء معالجة الطلب.",
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

  if (!isLoaded || !project) return null;

  return (
    <div className="min-h-screen bg-background p-4 pb-20 space-y-6 max-w-md mx-auto" dir="rtl">
      <Toaster />
      
      {/* رأس الصفحة */}
      <header className="flex items-center justify-between bg-card p-4 rounded-xl border border-primary/20 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
          <ArrowRight className="w-5 h-5" />
        </Button>
        <input 
          value={project.name}
          onChange={(e) => setProject({ ...project, name: e.target.value })}
          className="bg-transparent font-bold text-center flex-1 border-none focus:ring-0 focus:outline-none"
        />
        <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive">
          <Trash2 className="w-5 h-5" />
        </Button>
      </header>

      {/* منطقة الموجه الأساسي */}
      <div className="bg-card p-4 rounded-2xl border space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-black uppercase text-muted-foreground">التعليمات (System Prompt)</Label>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary h-8 px-2"
            onClick={handleRefinePrompt}
            disabled={isRefining}
          >
            {isRefining ? <RefreshCw className="w-4 h-4 animate-spin ml-1" /> : <Sparkles className="w-4 h-4 ml-1" />}
            {isRefining ? 'جاري التحسين...' : 'تحسين بالذكاء'}
          </Button>
        </div>
        <Textarea 
          value={project.prompt}
          onChange={(e) => setProject({ ...project, prompt: e.target.value })}
          placeholder="اكتب تعليمات النظام هنا..."
          className="min-h-[200px] text-sm leading-relaxed bg-background rounded-xl border-dashed"
        />
        <Button onClick={handleSave} className="w-full h-12 font-bold text-lg gap-2">
          <Save className="w-5 h-5" /> حفظ التعديلات
        </Button>
      </div>

      {/* منطقة التجربة السريعة */}
      <div className="bg-muted/30 p-4 rounded-2xl border space-y-4 shadow-inner">
        <Label className="text-sm font-black text-muted-foreground">تجربة سريعة (Playground)</Label>
        <Textarea 
          placeholder="اكتب سؤالاً لتجربة الموجه..."
          className="min-h-[100px] bg-background"
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
        />
        <Button 
          variant="secondary" 
          className="w-full h-12 font-bold" 
          onClick={handleRunTest}
          disabled={isRunning || !testInput}
        >
          {isRunning ? <RefreshCw className="w-4 h-4 animate-spin ml-2" /> : <Play className="w-4 h-4 ml-2" />}
          {isRunning ? 'جاري المعالجة...' : 'تشغيل الاختبار'}
        </Button>

        {testOutput && (
          <div className="p-4 bg-background rounded-xl border border-primary/20 text-sm whitespace-pre-wrap font-mono leading-relaxed">
            {testOutput}
          </div>
        )}
      </div>

      {/* شريط الإعدادات الخفي */}
      <div className="bg-card p-4 rounded-2xl border flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-muted-foreground">النموذج الحالي</span>
          <span className="text-sm font-bold">{project.model}</span>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="w-4 h-4" /> إعدادات دقيقة
        </Button>
      </div>
    </div>
  );
}
