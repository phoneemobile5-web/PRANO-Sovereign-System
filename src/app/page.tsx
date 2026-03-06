
'use client';

import { useState } from 'react';
import { useWorkbenchStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Plus, Import, FolderOpen, Zap, Key, History, Terminal, Info, AlertCircle } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
      prompt: 'أنت مساعد ذكي.',
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
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-bold text-primary tracking-widest uppercase">جاري التحميل...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 max-w-md mx-auto pb-24" dir="rtl">
      <header className="bg-card p-6 rounded-2xl border border-primary/20 shadow-lg space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg shadow-inner">
            <Zap className="text-primary-foreground w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-black text-foreground">مختبر الذكاء</h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">نسخة الهواتف الخفيفة v1.3</p>
          </div>
        </div>
        
        <div className="grid gap-3">
          <Button onClick={handleCreateProject} className="h-14 text-lg font-bold rounded-xl w-full shadow-md active:translate-y-0.5 transition-transform">
            <Plus className="ml-2 w-5 h-5" /> إنشاء مشروع
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-14 text-lg font-bold rounded-xl w-full border-2 border-primary/20">
                <Import className="ml-2 w-5 h-5" /> استيراد سريع
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95%] max-w-xs rounded-2xl p-4 overflow-y-auto max-h-[90vh] bg-card">
              <DialogHeader>
                <DialogTitle className="text-right text-lg font-black">استيراد من AI Studio</DialogTitle>
              </DialogHeader>
              
              <Alert className="bg-accent/10 border-accent/20 my-2">
                <AlertCircle className="h-4 w-4 text-accent" />
                <AlertTitle className="text-right text-xs font-bold text-accent">تنبيه هام</AlertTitle>
                <AlertDescription className="text-right text-[10px] leading-relaxed">
                  استخدم مفتاح **Gemini API Key** الذي تجده في Google AI Studio تحت خيار "Get API key". لا تخلط بينه وبين مفاتيح Firebase.
                </AlertDescription>
              </Alert>

              <div className="space-y-4 py-2 text-right">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-muted-foreground">اسم المشروع</span>
                  <Input 
                    placeholder="مثال: مشروعي الأول" 
                    value={importName}
                    onChange={(e) => setImportName(e.target.value)}
                    className="h-12 rounded-lg border-2"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-muted-foreground">مفتاح جيميناي (Gemini API Key)</span>
                  <Input 
                    placeholder="الصق المفتاح الطويل هنا" 
                    value={importKey}
                    onChange={(e) => setImportKey(e.target.value)}
                    className="h-12 rounded-lg font-mono text-xs border-2"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-muted-foreground">تعليمات النظام (Prompt)</span>
                  <Textarea 
                    placeholder="أدخل التعليمات هنا..." 
                    className="min-h-[120px] rounded-lg text-sm border-2"
                    value={importPrompt}
                    onChange={(e) => setImportPrompt(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button onClick={handleQuickImport} className="w-full h-12 font-bold text-lg rounded-xl">بدء الاستيراد</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xs font-black uppercase text-muted-foreground flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-primary" /> مشاريعك النشطة ({projects.length})
          </h2>
        </div>
        
        <div className="grid gap-3">
          {projects.map(project => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="active:scale-95 transition-transform bg-card border-primary/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border-r-4 border-r-primary">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold truncate text-base leading-tight">{project.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] bg-secondary px-1.5 py-0.5 rounded font-black text-secondary-foreground uppercase">{project.model}</span>
                      {project.apiKeys && project.apiKeys.length > 0 && (
                        <div className="flex items-center gap-1 text-accent">
                          <Key className="w-3 h-3" />
                          <span className="text-[9px] font-bold">مفتاح نشط</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Plus className="w-5 h-5 text-muted-foreground opacity-20" />
                </CardContent>
              </Card>
            </Link>
          ))}
          
          {projects.length === 0 && (
            <div className="text-center p-10 border-2 border-dashed rounded-3xl opacity-40 bg-card/50">
              <p className="text-sm font-bold text-muted-foreground italic leading-relaxed">
                لا توجد مشاريع حالياً.<br/>ابدأ بإنشاء مشروعك الأول.
              </p>
            </div>
          )}
        </div>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card/95 backdrop-blur-md border-t flex items-center justify-around px-6 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] z-50 rounded-t-3xl">
        <Link href="/" className="flex flex-col items-center gap-1 text-primary scale-110">
          <Zap className="w-6 h-6 fill-current" />
          <span className="text-[10px] font-black">الرئيسية</span>
        </Link>
        <Link href="/playground" className="flex flex-col items-center gap-1 text-muted-foreground/60 hover:text-primary transition-colors">
          <Terminal className="w-6 h-6" />
          <span className="text-[10px] font-bold">المختبر</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center gap-1 text-muted-foreground/60 hover:text-primary transition-colors">
          <History className="w-6 h-6" />
          <span className="text-[10px] font-bold">السجل</span>
        </Link>
      </nav>
    </div>
  );
}
