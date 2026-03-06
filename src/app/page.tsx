
'use client';

import { useState } from 'react';
import { useWorkbenchStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Plus, Import, Sparkles, ArrowLeft, FolderOpen, Zap, Key } from 'lucide-react';
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
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold tracking-widest text-primary">جاري تحميل المختبر...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 max-w-md mx-auto" dir="rtl">
      {/* Header Optimized for Old Phones */}
      <header className="flex flex-col gap-4 bg-card p-5 rounded-2xl border border-primary/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg shadow-lg">
            <Zap className="text-primary-foreground w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-foreground">مختبر الذكاء</h1>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Workbench v1.0</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          <Button onClick={handleCreateProject} className="h-16 text-lg font-bold gap-3 rounded-xl shadow-md active:scale-95 transition-transform">
            <Plus className="w-6 h-6" /> مشروع جديد
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-14 gap-3 rounded-xl border-2 active:scale-95 transition-transform">
                <Import className="w-5 h-5" /> استيراد من AI Studio
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95%] max-w-sm rounded-3xl p-6">
              <DialogHeader>
                <DialogTitle className="text-right text-xl font-bold">استيراد سريع للمشاريع</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mr-1">اسم المشروع</label>
                  <Input 
                    placeholder="مثال: مشروع المساعد الشخصي" 
                    value={importName}
                    onChange={(e) => setImportName(e.target.value)}
                    className="h-12 rounded-xl bg-muted/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mr-1">المفتاح (اختياري)</label>
                  <Input 
                    placeholder="الصق المفتاح هنا..." 
                    value={importKey}
                    onChange={(e) => setImportKey(e.target.value)}
                    className="h-12 rounded-xl bg-muted/50 font-code text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mr-1">System Prompt</label>
                  <Textarea 
                    placeholder="الصق تعليمات الذكاء الاصطناعي هنا..." 
                    className="min-h-[120px] text-sm rounded-xl bg-muted/50 p-4 leading-relaxed"
                    value={importPrompt}
                    onChange={(e) => setImportPrompt(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleQuickImport} className="w-full h-14 text-lg font-bold rounded-xl">إنشاء وحفظ الآن</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Projects List with Large Touch Targets */}
      <section className="space-y-4">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground px-2 flex items-center justify-between">
          <span className="flex items-center gap-2"><FolderOpen className="w-4 h-4 text-primary" /> مشاريعي ({projects.length})</span>
        </h2>
        
        <div className="grid gap-3">
          {projects.map(project => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="hover:border-primary active:scale-95 transition-all bg-card/40 border-primary/10 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex flex-col min-w-0">
                    <span className="font-black truncate text-lg text-foreground mb-1">{project.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">{project.model}</span>
                      {project.apiKeys && project.apiKeys.length > 0 && (
                        <Key className="w-3 h-3 text-accent" />
                      )}
                    </div>
                  </div>
                  <div className="bg-primary/5 p-2 rounded-full">
                    <ArrowLeft className="text-primary w-5 h-5 rotate-180" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          
          {projects.length === 0 && (
            <div className="text-center p-12 border-2 border-dashed border-muted rounded-3xl opacity-40">
              <Sparkles className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
              <p className="font-bold text-sm">المختبر جاهز لاستقبال مشاريعك</p>
            </div>
          )}
        </div>
      </section>

      {/* Mobile-Friendly Footer Navigation */}
      <footer className="pt-8 flex flex-col items-center gap-4">
        <div className="h-px w-20 bg-muted/30"></div>
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground h-12 font-bold hover:bg-transparent">
          <Link href="/history">سجل التفاعلات والأرشيف</Link>
        </Button>
        <p className="text-[10px] text-muted-foreground/50 font-mono">Mobile Optimized Build</p>
      </footer>
    </div>
  );
}
