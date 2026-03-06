
'use client';

import { useState } from 'react';
import { useWorkbenchStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Plus, Import, FolderOpen, Zap, History, Terminal, CheckCircle2, ChevronLeft, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Dashboard() {
  const { projects, isLoaded, addProject } = useWorkbenchStore();
  const router = useRouter();
  const [importPrompt, setImportPrompt] = useState('');
  const [importName, setImportName] = useState('');
  const [importKey, setImportKey] = useState('');

  const handleCreateProject = () => {
    const newProject = addProject({
      name: 'مشروع جديد',
      description: '',
      prompt: 'أنت مساعد ذكي ومفيد.',
      model: 'gemini-2.0-flash',
      temperature: 0.7,
      topP: 0.95,
      maxTokens: 1024,
      inputSchema: '',
      outputSchema: '',
      apiKeys: []
    });
    router.push(`/projects/${newProject.id}`);
  };

  const handleQuickImport = () => {
    if (!importPrompt) return;
    const newProject = addProject({
      name: importName || 'مشروع مستورد',
      description: 'مستورد من AI Studio',
      prompt: importPrompt,
      model: 'gemini-2.0-flash',
      temperature: 0.7,
      topP: 0.95,
      maxTokens: 1024,
      inputSchema: '',
      outputSchema: '',
      apiKeys: importKey ? [importKey] : []
    });
    setImportPrompt('');
    setImportName('');
    setImportKey('');
    router.push(`/projects/${newProject.id}`);
  };

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-bold text-primary tracking-widest uppercase">جاري التحميل...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 max-w-md mx-auto pb-24" dir="rtl">
      <header className="bg-card p-6 rounded-2xl border border-primary/20 shadow-lg space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary rounded-xl shadow-inner">
            <Zap className="text-primary-foreground w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground">مختبر الذكاء</h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest italic">نظام إدارة مشاريعك الضخمة</p>
          </div>
        </div>

        <Alert className="bg-primary/5 border-primary/20 py-2">
          <Info className="w-4 h-4 text-primary" />
          <AlertDescription className="text-[11px] font-bold text-primary mr-1">
            أنت الآن في لوحة التحكم. ابدأ باستيراد مشاريعك من جوجل.
          </AlertDescription>
        </Alert>
        
        <div className="grid gap-3 pt-2">
          <Button onClick={handleCreateProject} className="h-16 text-xl font-bold rounded-2xl w-full shadow-md">
            <Plus className="ml-2 w-6 h-6" /> إنشاء مشروع جديد
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-16 text-xl font-bold rounded-2xl w-full border-2 border-primary/20">
                <Import className="ml-2 w-6 h-6" /> استيراد من AI Studio
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95%] max-w-xs rounded-2xl p-5 bg-card border-2">
              <DialogHeader>
                <DialogTitle className="text-right text-xl font-black">نقل مشروع من جوجل</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4 text-right overflow-y-auto max-h-[60vh]">
                <div className="space-y-1">
                  <span className="text-xs font-black text-muted-foreground">١. اختر اسماً للمشروع</span>
                  <Input 
                    placeholder="مثال: مشروعي الضخم الأول" 
                    value={importName}
                    onChange={(e) => setImportName(e.target.value)}
                    className="h-12 rounded-xl border-2"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-black text-muted-foreground">٢. الصق مفتاح Gemini (API Key)</span>
                  <Input 
                    placeholder="تحده في Get API Key بـ AI Studio" 
                    value={importKey}
                    onChange={(e) => setImportKey(e.target.value)}
                    className="h-12 rounded-xl font-mono text-xs border-2"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-black text-muted-foreground">٣. الصق تعليمات النظام (System Prompt)</span>
                  <Textarea 
                    placeholder="انسخ التعليمات من AI Studio وضعها هنا" 
                    className="min-h-[120px] rounded-xl text-base border-2 p-3"
                    value={importPrompt}
                    onChange={(e) => setImportPrompt(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleQuickImport} className="w-full h-14 font-black text-lg rounded-2xl">تفعيل المشروع الآن</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-sm font-black uppercase text-muted-foreground flex items-center gap-2 px-2">
          <FolderOpen className="w-4 h-4 text-primary" /> مشاريعك المحفوظة ({projects.length})
        </h2>
        
        <div className="grid gap-4">
          {projects.length > 0 ? (
            projects.map(project => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="active:scale-95 transition-transform bg-card border-primary/10 rounded-2xl overflow-hidden shadow-md border-r-8 border-r-primary">
                  <CardContent className="p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-black truncate text-lg">{project.name}</span>
                        {project.apiKeys?.[0] && (
                          <CheckCircle2 className="w-4 h-4 text-accent fill-accent/20" />
                        )}
                      </div>
                      <ChevronLeft className="w-4 h-4 text-muted-foreground opacity-30" />
                    </div>
                    
                    <div className="bg-secondary/20 p-2 rounded-xl border border-secondary/10">
                      <p className="text-[10px] font-medium text-muted-foreground line-clamp-1 italic">
                        الموجه: "{project.prompt}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] bg-primary/10 px-2 py-0.5 rounded-lg font-black text-primary uppercase">
                        {project.model}
                      </span>
                      {project.apiKeys?.[0] ? (
                        <span className="text-[9px] font-black text-accent bg-accent/5 px-2 py-0.5 rounded-lg border border-accent/20">المفتاح جاهز ✅</span>
                      ) : (
                        <span className="text-[9px] font-black text-destructive bg-destructive/5 px-2 py-0.5 rounded-lg border border-destructive/20">يحتاج مفتاح ❌</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="py-10 text-center border-2 border-dashed rounded-3xl opacity-40">
              <Plus className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs font-bold">لا توجد مشاريع حتى الآن</p>
            </div>
          )}
        </div>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-md border-t flex items-center justify-around px-6 shadow-2xl z-50 rounded-t-3xl">
        <Link href="/" className="flex flex-col items-center gap-1 text-primary">
          <Zap className="w-6 h-6 fill-current" />
          <span className="text-[9px] font-black">الرئيسية</span>
        </Link>
        <Link href="/playground" className="flex flex-col items-center gap-1 text-muted-foreground/60">
          <Terminal className="w-6 h-6" />
          <span className="text-[9px] font-bold">المختبر</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center gap-1 text-muted-foreground/60">
          <History className="w-6 h-6" />
          <span className="text-[9px] font-bold">السجل</span>
        </Link>
      </nav>
    </div>
  );
}
