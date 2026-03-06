'use client';

import { useState } from 'react';
import { useWorkbenchStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Plus, Import, FolderOpen, Zap, Key, History } from 'lucide-react';
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
    <div className="min-h-screen bg-background p-4 space-y-6 max-w-md mx-auto" dir="rtl">
      {/* رأس الصفحة - بسيط وعالي التباين للهواتف القديمة */}
      <header className="bg-card p-6 rounded-2xl border border-primary/20 shadow-lg space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Zap className="text-primary-foreground w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-black text-foreground">مختبر الذكاء</h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">نسخة الهواتف الخفيفة v1.0</p>
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
            <DialogContent className="w-[90%] max-w-xs rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-right">استيراد مشروع</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <Input 
                  placeholder="اسم المشروع" 
                  value={importName}
                  onChange={(e) => setImportName(e.target.value)}
                  className="h-12 rounded-lg"
                />
                <Input 
                  placeholder="المفتاح الرقمي (اختياري)" 
                  value={importKey}
                  onChange={(e) => setImportKey(e.target.value)}
                  className="h-12 rounded-lg font-mono text-xs"
                />
                <Textarea 
                  placeholder="System Prompt" 
                  className="min-h-[100px] rounded-lg"
                  value={importPrompt}
                  onChange={(e) => setImportPrompt(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button onClick={handleQuickImport} className="w-full h-12 font-bold">حفظ الآن</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* قائمة المشاريع - أهداف لمس كبيرة */}
      <section className="space-y-4">
        <h2 className="text-xs font-black uppercase text-muted-foreground px-2 flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-primary" /> مشاريعك ({projects.length})
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
                  {project.apiKeys && project.apiKeys.length > 0 && <Key className="w-4 h-4 text-accent" />}
                </CardContent>
              </Card>
            </Link>
          ))}
          
          {projects.length === 0 && (
            <div className="text-center p-8 border-2 border-dashed rounded-2xl opacity-50">
              <p className="text-sm font-bold text-muted-foreground">ابدأ الآن بإضافة أول مشروع</p>
            </div>
          )}
        </div>
      </section>

      {/* تذييل الصفحة - روابط سريعة */}
      <footer className="pt-6 flex flex-col items-center gap-4">
        <Button variant="ghost" asChild className="text-muted-foreground font-bold h-12">
          <Link href="/history">
            <History className="ml-2 w-4 h-4" /> سجل التفاعلات
          </Link>
        </Button>
        <p className="text-[10px] text-muted-foreground/40 font-mono">Mobile Optimized Build</p>
      </footer>
    </div>
  );
}
