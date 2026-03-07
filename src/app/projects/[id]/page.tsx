
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
  ChevronDown,
  Link as LinkIcon,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ClipboardPaste
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [showKeys, setShowKeys] = useState(true);

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
        title: "تم حفظ المهمة بنجاح ✅",
        description: "بياناتك آمنة في مركز قيادة الأرض.",
      });
    }
  };

  const handleConfirmDelete = () => {
    if (id) {
      deleteProject(id as string);
      router.push('/');
      toast({
        title: "تم مسح المهمة",
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
        title: "فشل التشغيل ⚠️",
        description: "تحقق من مفتاح Gemini ومن اتصال الإنترنت. تأكد أنك في الوضع المجاني.",
      });
    } finally {
      setIsRunning(false);
    }
  };

  if (!isLoaded || !project) return (
    <div className="min-h-screen flex items-center justify-center bg-[#001a1a]">
      <RefreshCw className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  const isKeyCorrect = project.apiKeys?.[0]?.startsWith('AIza');

  return (
    <div className="min-h-screen bg-background p-4 pb-32 space-y-6 max-w-md mx-auto font-body" dir="rtl">
      <Toaster />
      
      <header className="flex items-center justify-between bg-card p-5 rounded-[2.5rem] border-2 border-primary/20 shadow-xl">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="h-14 w-14 bg-secondary rounded-2xl hover:bg-secondary/80 shrink-0">
          <ArrowRight className="w-8 h-8" />
        </Button>
        <div className="flex-1 px-4 text-right overflow-hidden">
          <input 
            value={project.name}
            onChange={(e) => setProject({ ...project, name: e.target.value })}
            className="bg-transparent font-black text-right w-full border-none focus:ring-0 text-2xl gold-gradient-text truncate"
          />
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive h-14 w-14 bg-destructive/10 rounded-2xl hover:bg-destructive/20 shrink-0">
              <Trash2 className="w-7 h-7" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-[90%] rounded-[2.5rem] border-4 bg-card" dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-right text-2xl font-black">حذف المهمة؟</AlertDialogTitle>
              <AlertDialogDescription className="text-right text-lg leading-relaxed font-medium">
                هل أنت متأكد؟ سيتم إيقاف هذه المهمة الأرضية نهائياً.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row-reverse gap-3 pt-4">
              <AlertDialogAction 
                className="bg-destructive text-destructive-foreground rounded-2xl flex-1 h-14 font-black text-xl shadow-lg"
                onClick={handleConfirmDelete}
              >
                نعم، احذف
              </AlertDialogAction>
              <AlertDialogCancel className="rounded-2xl flex-1 mt-0 h-14 font-bold border-2">إلغاء</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>

      <Alert className="bg-primary/5 border-primary/20 rounded-[1.5rem] flex items-center gap-4 py-4 shadow-sm border-r-[8px]">
        <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
        <AlertDescription className="text-[11px] font-black text-primary mr-2 flex-1 flex flex-col gap-1">
          <span className="uppercase tracking-widest text-right">وضع التشغيل الآمن (الطبقة المجانية)</span>
          <span className="text-[9px] opacity-70">أنت تملك التحكم الكامل. انسخ "عقل" المشروع من جوجل وضعه هنا.</span>
        </AlertDescription>
      </Alert>

      <Collapsible open={showKeys} onOpenChange={setShowKeys} className="bg-card p-6 rounded-[2.5rem] border-2 border-primary/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 p-6 opacity-5 pointer-events-none">
           <Key className="w-24 h-24 text-primary" />
        </div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4 text-right">
            <div className="p-3 bg-primary/10 rounded-2xl shadow-inner shrink-0">
              <Key className="w-7 h-7 text-primary" />
            </div>
            <div>
              <Label className="text-[12px] font-black uppercase text-primary leading-none tracking-widest">مفاتيح التشغيل (الوقود)</Label>
              <p className="text-[10px] text-muted-foreground font-bold mt-2">استخدم مفتاح API Key فقط ليعمل النظام بنجاح</p>
            </div>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 px-4 font-black rounded-xl border-2 shrink-0">
              {showKeys ? 'إخفاء' : 'عرض'} <ChevronDown className={`w-4 h-4 mr-1 transition-transform ${showKeys ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="pt-6 space-y-5 relative z-10 text-right">
          {!isKeyCorrect && project.apiKeys?.[0] && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
              <AlertTitle className="text-xs font-black">تحذير من المفتاح!</AlertTitle>
              <AlertDescription className="text-[10px] leading-relaxed">
                هذا ليس مفتاح تشغيل. يرجى إحضار <strong>Gemini API Key</strong> من Google AI Studio (يبدأ بـ AIza).
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label className="text-[10px] font-black text-primary uppercase mr-1">المفتاح النشط (API Key)</Label>
            <Input 
              type="password"
              placeholder="الصق مفتاح التشغيل هنا..."
              value={project.apiKeys?.[0] || ''}
              onChange={(e) => setProject({ ...project, apiKeys: [e.target.value] })}
              className={`h-14 font-mono text-sm border-2 rounded-2xl bg-background/50 text-right focus:border-primary ${!isKeyCorrect && project.apiKeys?.[0] ? 'border-destructive' : ''}`}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black text-primary uppercase mr-1">رابط المشروع للمرجعية</Label>
            <Input 
              placeholder="https://ai.studio/apps/..."
              value={project.externalAppId || ''}
              onChange={(e) => setProject({ ...project, externalAppId: e.target.value })}
              className="h-14 border-2 rounded-2xl bg-background/50 text-right text-xs font-mono focus:border-primary"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <section className="bg-card p-6 rounded-[3rem] border-4 border-primary/10 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b-2 border-primary/10 pb-4">
          <div className="flex items-center gap-3 text-right">
            <div className="p-3 bg-primary/10 rounded-2xl shrink-0">
              <ClipboardPaste className="w-6 h-6 text-primary" />
            </div>
            <div>
              <Label className="text-[12px] font-black uppercase text-primary tracking-[0.2em]">وصفة المهمة (العقل)</Label>
              <p className="text-[9px] text-muted-foreground font-bold uppercase mt-1">System Instructions</p>
            </div>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            className="h-10 px-5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border-none shadow-sm shrink-0"
            onClick={handleRefinePrompt}
            disabled={isRefining}
          >
            {isRefining ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span className="text-[11px] font-black mr-2">تحسين ذكي</span>
          </Button>
        </div>

        <Textarea 
          value={project.prompt}
          onChange={(e) => setProject({ ...project, prompt: e.target.value })}
          className="min-h-[220px] text-lg font-medium leading-relaxed rounded-2xl border-2 p-5 shadow-inner bg-background/30 focus:border-primary/50 transition-all text-right"
          placeholder="انسخ 'عقل' المشروع من جوجل (System Instructions) وضعه هنا لكي تعمل المهمة..."
        />

        <Button onClick={handleSave} className="w-full h-20 font-black text-2xl gap-4 rounded-[1.5rem] shadow-2xl active:scale-95 transition-transform bg-primary text-primary-foreground hover:bg-primary/90">
          <Save className="w-8 h-8" /> حفظ بيانات المهمة 💾
        </Button>
      </section>

      <section className="bg-muted/30 p-8 rounded-[4rem] border-4 border-dashed border-primary/20 space-y-6 relative overflow-hidden">
        <div className="absolute -bottom-10 -left-10 p-10 opacity-5 pointer-events-none">
           <Cpu className="w-40 h-40 text-primary" />
        </div>
        <div className="flex items-center gap-3 relative z-10 text-right">
          <Cpu className="w-6 h-6 text-primary animate-pulse shrink-0" />
          <Label className="text-[12px] font-black uppercase text-muted-foreground tracking-widest">اختبار ذكاء المهمة</Label>
        </div>

        <Textarea 
          placeholder="اطرح سؤالاً يخدم كوكب الأرض لنرى كيف سيفكر النظام..."
          className="min-h-[120px] bg-background/80 border-2 border-primary/10 rounded-2xl text-xl p-5 shadow-lg focus:border-primary text-right"
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
        />
        
        <Button 
          className="w-full h-20 text-2xl font-black rounded-[2rem] gap-5 shadow-2xl active:scale-95 transition-all bg-primary hover:bg-primary/90 relative z-10" 
          onClick={handleRunTest}
          disabled={isRunning || !testInput || !isKeyCorrect}
        >
          {isRunning ? <RefreshCw className="w-8 h-8 animate-spin" /> : <Play className="w-8 h-8 fill-current" />}
          {isRunning ? 'جاري التحليل...' : 'تشغيل الاختبار'}
        </Button>

        {testOutput && (
          <div className="p-8 bg-card rounded-[2.5rem] border-2 border-primary/20 text-lg font-medium whitespace-pre-wrap leading-relaxed animate-in zoom-in-95 shadow-2xl relative overflow-hidden z-10 text-right">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
            <div className="flex items-center justify-between mb-4 border-b border-primary/10 pb-3">
              <span className="text-[11px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> رد الذكاء الاصطناعي:
              </span>
              <span className="text-[10px] bg-primary/10 px-3 py-1 rounded-full font-black text-primary">Gemini 2.0</span>
            </div>
            <div className="text-foreground/90">{testOutput}</div>
          </div>
        )}
      </section>
    </div>
  );
}
