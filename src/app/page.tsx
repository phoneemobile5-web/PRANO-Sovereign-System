'use client';

import { useState } from 'react';
import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { useWorkbenchStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Plus, Zap, Star, Clock, ArrowUpRight, Share2, MoreVertical, Trash2, Import, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
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

export default function Dashboard() {
  const { projects, sessions, isLoaded, addProject, deleteProject, toggleBookmark } = useWorkbenchStore();
  const router = useRouter();
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importPrompt, setImportPrompt] = useState('');
  const [importName, setImportName] = useState('');

  const handleCreateProject = () => {
    const newProject = addProject({
      name: 'مشروع جديد بدون عنوان',
      description: 'إعدادات جديدة للذكاء الاصطناعي',
      prompt: 'أنت مساعد ذكي ومفيد.',
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
      name: importName || 'مستورد من AI Studio',
      description: 'تم استيراد هذا المشروع من Google AI Studio',
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

  const bookmarkedSessions = sessions.filter(s => s.isBookmarked).slice(0, 4);
  const recentSessions = sessions.slice(0, 5);

  return (
    <div className="flex h-screen overflow-hidden bg-background" dir="rtl">
      <SidebarNav projects={projects} onAddProject={handleCreateProject} />
      
      <main className="flex-1 overflow-y-auto p-8 space-y-8">
        <header className="flex items-center justify-between">
          <div className="space-y-1 text-right">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              نظرة عامة على المختبر
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </h1>
            <p className="text-muted-foreground">قم بإدارة إعدادات وتجارب الذكاء الاصطناعي الخاصة بك من Google AI Studio.</p>
          </div>
          <div className="flex gap-3">
            <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5">
                  <Import className="w-4 h-4" />
                  استيراد من AI Studio
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]" dir="rtl">
                <DialogHeader className="text-right">
                  <DialogTitle>استيراد سريع للمشروع</DialogTitle>
                  <DialogDescription>
                    انسخ "System Prompt" من Google AI Studio والصقه هنا لإنشاء مشروع جديد فوراً.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 text-right">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">اسم المشروع</label>
                    <Input 
                      placeholder="مثال: مصحح الأكواد أو محلل البيانات" 
                      value={importName}
                      onChange={(e) => setImportName(e.target.value)}
                      className="text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">System Prompt</label>
                    <Textarea 
                      placeholder="الصق تعليمات AI Studio هنا..." 
                      className="min-h-[150px] font-code text-xs text-right"
                      value={importPrompt}
                      onChange={(e) => setImportPrompt(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter className="flex-row-reverse gap-2">
                  <Button onClick={handleQuickImport} disabled={!importPrompt} className="w-full">إنشاء واستيراد المشروع</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button onClick={handleCreateProject} className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" />
              مشروع جديد
            </Button>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-full lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-right">
              <Zap className="w-5 h-5 text-primary" />
              المشاريع النشطة
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {projects.length > 0 ? (
                projects.map(project => (
                  <Card key={project.id} className="group hover:border-primary/50 transition-colors bg-card/40 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <Badge variant="secondary" className="text-[10px] uppercase">{project.model}</Badge>
                      <CardTitle className="text-md font-medium truncate text-right">{project.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-right">
                      <p className="text-xs text-muted-foreground line-clamp-2 h-8">
                        {project.description || 'لا يوجد وصف مضاف لهذا المشروع.'}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t bg-muted/20 mt-2">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Share2 className="w-3.5 h-3.5" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-3.5 h-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive flex flex-row-reverse gap-2"
                              onClick={() => deleteProject(project.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                              حذف المشروع
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/projects/${project.id}`} className="flex items-center gap-1 text-xs">
                          <ArrowUpRight className="w-3 h-3" /> تعديل الإعدادات
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-12 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-4 bg-muted/5">
                  <Zap className="w-12 h-12 text-muted/20" />
                  <p className="text-muted-foreground text-sm font-medium">لم تقم بإنشاء أي مشاريع بعد.</p>
                  <Button variant="outline" size="sm" onClick={handleCreateProject}>ابدأ بمشروعك الأول</Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-right">
              <Star className="w-5 h-5 text-accent" />
              التفاعلات المميزة
            </h2>
            <div className="space-y-3">
              {bookmarkedSessions.length > 0 ? (
                bookmarkedSessions.map(session => (
                  <Card key={session.id} className="bg-card/30 border-dashed hover:border-accent/50 transition-all cursor-pointer text-right">
                    <CardHeader className="p-3 pb-0">
                      <div className="flex justify-between items-start">
                        <Star 
                          className="w-3.5 h-3.5 fill-accent text-accent" 
                          onClick={(e) => { e.stopPropagation(); toggleBookmark(session.id); }}
                        />
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {new Date(session.timestamp).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 pt-1">
                      <p className="text-sm font-medium line-clamp-1">{session.input}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1 italic">
                        "{session.output}"
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="bg-muted/10 border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center">
                  <Star className="w-8 h-8 text-muted/30 mb-2" />
                  <p className="text-sm text-muted-foreground">التجارب التي تضع لها "نجمة" ستظهر هنا للرجوع إليها لاحقاً.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-4 pt-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-right">
            <Clock className="w-5 h-5 text-muted-foreground" />
            النشاط الأخير
          </h2>
          <Card className="bg-card/40">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentSessions.length > 0 ? (
                  recentSessions.map(session => (
                    <div key={session.id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors flex-row-reverse">
                      <div className="flex flex-col gap-0.5 text-right max-w-[70%]">
                        <span className="text-sm font-medium truncate">{session.input}</span>
                        <span className="text-xs text-muted-foreground truncate opacity-70">
                          {projects.find(p => p.id === session.projectId)?.name || 'مشروع مجهول'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/history">تفاصيل</Link>
                        </Button>
                        <span className="text-xs text-muted-foreground font-mono">
                          {new Date(session.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-muted-foreground">
                    <p className="text-sm">لا توجد تفاعلات مسجلة حالياً. جرب المختبر الآن!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
