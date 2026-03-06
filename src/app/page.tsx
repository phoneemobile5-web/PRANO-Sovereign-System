
'use client';

import { useState } from 'react';
import { useWorkbenchStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Plus, Zap, Star, Import, Sparkles, FolderOpen, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { SidebarNav } from '@/components/dashboard/SidebarNav';

export default function Dashboard() {
  const { projects, sessions, isLoaded, addProject } = useWorkbenchStore();
  const router = useRouter();
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importPrompt, setImportPrompt] = useState('');
  const [importName, setImportName] = useState('');

  const handleCreateProject = () => {
    const newProject = addProject({
      name: 'مشروع جديد',
      description: 'إعدادات جديدة',
      prompt: 'أنت مساعد ذكي.',
      model: 'gemini-1.5-flash',
      temperature: 0.7,
      topP: 0.95,
      maxTokens: 1024,
      inputSchema: '',
      outputSchema: '',
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
    });
    setIsImportOpen(false);
    setImportPrompt('');
    setImportName('');
    router.push(`/projects/${newProject.id}`);
  };

  if (!isLoaded) return null;

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background" dir="rtl">
      <SidebarNav projects={projects} onAddProject={handleCreateProject} />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        <header className="flex flex-col gap-4">
          <div className="text-right">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              مختبر AI
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-12 text-xs md:text-sm gap-2">
                  <Import className="w-4 h-4" />
                  استيراد
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95%] rounded-xl" dir="rtl">
                <DialogHeader className="text-right">
                  <DialogTitle>استيراد سريع</DialogTitle>
                  <DialogDescription>الصق System Prompt هنا.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <Input 
                    placeholder="اسم المشروع" 
                    value={importName}
                    onChange={(e) => setImportName(e.target.value)}
                  />
                  <Textarea 
                    placeholder="الصق التعليمات هنا..." 
                    className="min-h-[120px] text-xs"
                    value={importPrompt}
                    onChange={(e) => setImportPrompt(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleQuickImport} className="w-full h-12">إنشاء المشروع</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button onClick={handleCreateProject} className="h-12 text-xs md:text-sm gap-2">
              <Plus className="w-4 h-4" />
              مشروع جديد
            </Button>
          </div>
        </header>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-right">المشاريع النشطة</h2>
          <div className="grid gap-4">
            {projects.map(project => (
              <Card key={project.id} className="bg-card/40 border-primary/10">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="text-[10px]">{project.model}</Badge>
                    <CardTitle className="text-sm font-bold truncate max-w-[150px]">{project.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardFooter className="p-4 pt-2 flex justify-end">
                  <Button variant="ghost" size="sm" asChild className="h-10 text-primary">
                    <Link href={`/projects/${project.id}`} className="gap-1">
                      <ArrowUpRight className="w-4 h-4" /> فتح
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
