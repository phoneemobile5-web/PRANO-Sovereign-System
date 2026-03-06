'use client';

import { useState } from 'react';
import { useWorkbenchStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Plus, Import, Sparkles, ArrowRight, FolderOpen, Zap } from 'lucide-react';
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
      apiKeys: []
    });
    setImportPrompt('');
    setImportName('');
    router.push(`/projects/${newProject.id}`);
  };

  if (!isLoaded) return <div className="p-8 text-center">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-background p-4 space-y-6" dir="rtl">
      <header className="flex flex-col gap-4 bg-card p-4 rounded-xl border border-primary/20">
        <div className="flex items-center gap-2">
          <Zap className="text-primary w-6 h-6 fill-current" />
          <h1 className="text-xl font-bold">مختبر AI</h1>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <Button onClick={handleCreateProject} className="h-14 text-lg font-bold gap-2">
            <Plus className="w-5 h-5" /> مشروع جديد
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-12 gap-2">
                <Import className="w-4 h-4" /> استيراد من AI Studio
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95%] max-w-md rounded-xl">
              <DialogHeader>
                <DialogTitle>استيراد سريع</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input 
                  placeholder="اسم المشروع" 
                  value={importName}
                  onChange={(e) => setImportName(e.target.value)}
                  className="h-12"
                />
                <Textarea 
                  placeholder="الصق System Prompt هنا..." 
                  className="min-h-[150px] text-sm"
                  value={importPrompt}
                  onChange={(e) => setImportPrompt(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button onClick={handleQuickImport} className="w-full h-12">إنشاء الآن</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-2 flex items-center gap-2">
          <FolderOpen className="w-4 h-4" /> مشاريعي ({projects.length})
        </h2>
        <div className="grid gap-2">
          {projects.map(project => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="hover:border-primary active:scale-[0.98] transition-all bg-card/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold truncate text-lg">{project.name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase">{project.model}</span>
                  </div>
                  <ArrowRight className="text-primary w-5 h-5" />
                </CardContent>
              </Card>
            </Link>
          ))}
          {projects.length === 0 && (
            <div className="text-center p-12 border-2 border-dashed rounded-xl opacity-50">
              <p>لا توجد مشاريع حالياً</p>
            </div>
          )}
        </div>
      </section>

      <footer className="pt-8 text-center">
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground h-12">
          <Link href="/history">سجل التفاعلات</Link>
        </Button>
      </footer>
    </div>
  );
}
