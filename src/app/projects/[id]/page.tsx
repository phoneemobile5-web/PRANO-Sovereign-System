
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
        description: "تم تحديث إعدادات العقل.",
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

      <div className="bg-card p-4 rounded-3xl border-2 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] font-black uppercase text-primary tracking-widest">الموجه (تعليمات النظام)</Label>
          <Button 
            variant="secondary" 
            size="sm" 
            className="h-8 px-3 rounded-xl"
            onClick={handleRefinePrompt}
            disabled={isRefining}
          >
            {isRefining ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            <span className="text-[10px] font-black mr-1">تحسين</span>
          </Button>
        </div>

        <Textarea 
          value={project.prompt}
          onChange={(e) => setProject({ ...project, prompt: e.target.value })}
          className="min-h-[180px] text-base leading-relaxed rounded-xl border-2 p-3 shadow-inner"
        />

        <Button onClick={handleSave} className="w-full h-14 font-black text-lg gap-2 rounded-2xl">
          <Save className="w-5 h-5" /> حفظ التعليمات
        </Button>
      </div>

      <Collapsible open={showKeys} onOpenChange={setShowKeys} className="bg-card p-4 rounded-3xl border-2 border-accent/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-accent" />
            <Label className="text-[10px] font-black uppercase text-accent">مفتاح Gemini API</Label>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 text-[9px] font-black rounded-lg">
              تعديل
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="pt-3">
          <Input 
            type="password"
            placeholder="الصق المفتاح هنا..."
            value={project.apiKeys?.[0] || ''}
            onChange={(e) => setProject({ ...project, apiKeys: [e.target.value] })}
            className="h-10 font-mono text-sm border-2 rounded-xl"
          />
        </CollapsibleContent>
      </Collapsible>

      <div className="bg-muted/30 p-4 rounded-3xl border-2 border-dashed border-primary/20 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">تجربة العقل (السؤال)</Label>
          <Cpu className="w-4 h-4 text-primary opacity-50" />
        </div>

        <Textarea 
          placeholder="اكتب سؤالك هنا..."
          className="min-h-[80px] bg-background border-2 rounded-xl text-base p-3"
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
        />
        
        <Button 
          className="w-full h-14 font-black text-lg rounded-2xl gap-3 shadow-xl" 
          onClick={handleRunTest}
          disabled={isRunning || !testInput}
        >
          {isRunning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
          {isRunning ? 'جاري التحليل...' : 'اسأل الذكاء'}
        </Button>

        {testOutput && (
          <div className="p-4 bg-card rounded-2xl border-2 border-primary/20 text-base whitespace-pre-wrap leading-relaxed animate-in zoom-in-95">
            <div className="text-[9px] font-black text-primary mb-2 border-b border-primary/10 pb-1">رد الذكاء:</div>
            {testOutput}
          </div>
        )}
      </div>
    </div>
  );
}
