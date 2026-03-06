'use client';

import { useState } from 'react';
import { useWorkbenchStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Plus, Import, FolderOpen, Zap, Key, History, Terminal } from 'lucide-react';
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
      model: 'gemini-1.5-flash',
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
      model: 'gemini-1.5-flash',
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
        <p className="text-xs font-bold text-primary">تحميل البيانات...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 max-w-md mx-auto pb-20" dir="rtl">
      {/* رأس الصفحة - بسيط وعالي التباين للهواتف القديمة */}
      <header className="bg-card p-6 rounded-2xl border border-primary/20 shadow-lg space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Zap className="text-primary-foreground w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-black text-foreground">مختبر الذكاء</h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">نسخة الهواتف الخفيفة v1.1</p>
          </div>
        </div>
        
        <div className="grid gap-3">
          <Button onClick={handleCreateProject} className="h-14 text-lg font-bold rounded-xl w-full">
            <Plus className="ml-2 w-5 h-5" /> مشروع جديد
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-14 text-lg font-bold rounded-xl w-full border-2">
                <Import className="ml-2 w-5 h-5" /> استيراد سريع
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95%] max-w-xs rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-right">استيراد من AI Studio</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2 text-right">
                <div className="space-y-1">
                  <span className="text-xs font-bold">اسم المشروع</span>
                  <Input 
                    placeholder="مثال: مشروع المساعدة" 
                    value={importName}
                    onChange={(e) => setImportName(e.target.value)}
                    className="h-12 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold">المفتاح الرقمي</span>
                  <Input 
                    placeholder="الصق المفتاح هنا" 
                    value={importKey}
                    onChange={(e) => setImportKey(e.target.value)}
                    className="h-12 rounded-lg font-mono text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold">System Prompt</span>
                  <Textarea 
                    placeholder="أدخل التعليمات البرمجية هنا..." 
                    className="min-h-[120px] rounded-lg text-sm"
                    value={importPrompt}
                    onChange={(e) => setImportPrompt(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleQuickImport} className="w-full h-12 font-bold text-lg">بدء العمل الآن</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* قائمة المشاريع */}
      <section className="space-y-4">
        <h2 className="text-xs font-black uppercase text-muted-foreground px-2 flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-primary" /> مشاريعك المتاحة ({projects.length})
        </h2>
        
        <div className="grid gap-3">
          {projects.map(project => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="active:scale-95 transition-transform bg-card border-primary/10 rounded-xl overflow-hidden shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold truncate text-base">{project.name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase">{project.model}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.apiKeys && project.apiKeys.length > 0 && <Key className="w-4 h-4 text-accent" />}
                    <Plus className="w-4 h-4 text-muted-foreground opacity-30" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          
          {projects.length === 0 && (
            <div className="text-center p-8 border-2 border-dashed rounded-2xl opacity-50 bg-card/50">
              <p className="text-sm font-bold text-muted-foreground">لا توجد مشاريع حالياً. أضف مشروعك الأول لبدء التجربة.</p>
            </div>
          )}
        </div>
      </section>

      {/* شريط سفلي سريع للهواتف */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t flex items-center justify-around px-4 shadow-2xl z-50">
        <Link href="/" className="flex flex-col items-center gap-1 text-primary">
          <Zap className="w-6 h-6 fill-current" />
          <span className="text-[10px] font-bold">الرئيسية</span>
        </Link>
        <Link href="/playground" className="flex flex-col items-center gap-1 text-muted-foreground">
          <Terminal className="w-6 h-6" />
          <span className="text-[10px] font-bold">المختبر</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center gap-1 text-muted-foreground">
          <History className="w-6 h-6" />
          <span className="text-[10px] font-bold">السجل</span>
        </Link>
      </nav>
    </div>
  );
}
