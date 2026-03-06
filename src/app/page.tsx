'use client';

import { useState } from 'react';
import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { useWorkbenchStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Plus, Zap, Star, Clock, ArrowUpRight, Share2, MoreVertical, Trash2, Import } from 'lucide-react';
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
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarNav projects={projects} onAddProject={handleCreateProject} />
      
      <main className="flex-1 overflow-y-auto p-8 space-y-8">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight font-headline">نظرة عامة على المختبر</h1>
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
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>استيراد سريع للمشروع</DialogTitle>
                  <DialogDescription>
                    انسخ "System Prompt" من Google AI Studio والصقه هنا لإنشاء مشروع جديد فوراً.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">اسم المشروع</label>
                    <Input 
                      placeholder="مثال: مصحح الأكواد" 
                      value={importName}
                      onChange={(e) => setImportName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">System Prompt</label>
                    <Textarea 
                      placeholder="الصق تعليمات AI Studio هنا..." 
                      className="min-h-[150px] font-code text-xs"
                      value={importPrompt}
                      onChange={(e) => setImportPrompt(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleQuickImport} disabled={!importPrompt}>إنشاء واستيراد</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button onClick={handleCreateProject} className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" />
              إنشاء مشروع
            </Button>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-full lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              المشاريع النشطة
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map(project => (
                <Card key={project.id} className="group hover:border-primary/50 transition-colors bg-card/40 backdrop-blur-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-md font-medium truncate pr-4">{project.name}</CardTitle>
                    <Badge variant="secondary" className="text-[10px] uppercase">{project.model}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground line-clamp-2 h-8">
                      {project.description || 'لا يوجد وصف للمشروع.'}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t bg-muted/20 mt-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/projects/${project.id}`} className="flex items-center gap-1 text-xs">
                        تعديل <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </Button>
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
                            className="text-destructive focus:text-destructive"
                            onClick={() => deleteProject(project.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            حذف المشروع
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 text-accent" />
              المميزة
            </h2>
            <div className="space-y-3">
              {bookmarkedSessions.length > 0 ? (
                bookmarkedSessions.map(session => (
                  <Card key={session.id} className="bg-card/30 border-dashed hover:border-accent/50 transition-all cursor-pointer">
                    <CardHeader className="p-3 pb-0">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {new Date(session.timestamp).toLocaleDateString()}
                        </span>
                        <Star 
                          className="w-3.5 h-3.5 fill-accent text-accent" 
                          onClick={(e) => { e.stopPropagation(); toggleBookmark(session.id); }}
                        />
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
                <div className="bg-muted/10 border-2 border-dashed rounded-xl p-8 text-center">
                  <Star className="w-8 h-8 text-muted/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">التجارب الناجحة التي تميزها ستظهر هنا.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-4 pt-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            النشاط الأخير
          </h2>
          <Card className="bg-card/40">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentSessions.length > 0 ? (
                  recentSessions.map(session => (
                    <div key={session.id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                      <div className="flex flex-col gap-0.5 max-w-[70%]">
                        <span className="text-sm font-medium truncate">{session.input}</span>
                        <span className="text-xs text-muted-foreground truncate opacity-70">
                          {projects.find(p => p.id === session.projectId)?.name || 'مشروع محذوف'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/history">عرض</Link>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-muted-foreground">
                    <p className="text-sm">لا توجد تفاعلات أخيرة. ابدأ من المختبر!</p>
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
