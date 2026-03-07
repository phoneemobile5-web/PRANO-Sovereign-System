'use client';

import { useState } from 'react';
import { useWorkbenchStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Plus, Import, FolderOpen, Zap, History, Terminal, CheckCircle2, ChevronLeft, Info, Settings2, Link as LinkIcon, Trash2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Dashboard() {
  const { projects, isLoaded, addProject, deleteProject } = useWorkbenchStore();
  const router = useRouter();
  const [importPrompt, setImportPrompt] = useState('');
  const [importName, setImportName] = useState('');
  const [importKey, setImportKey] = useState('');
  const [importExternalId, setImportExternalId] = useState('');

  const handleCreateProject = () => {
    const newProject = addProject({
      name: 'مسودة مشروع جديد',
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
      name: importName || 'مشروع مستورد من جوجل',
      description: 'تم النقل من AI Studio',
      prompt: importPrompt,
      model: 'gemini-2.0-flash',
      temperature: 0.7,
      topP: 0.95,
      maxTokens: 1024,
      inputSchema: '',
      outputSchema: '',
      apiKeys: importKey ? [importKey] : [],
      externalAppId: importExternalId
    });
    setImportPrompt('');
    setImportName('');
    setImportKey('');
    setImportExternalId('');
    router.push(`/projects/${newProject.id}`);
  };

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-black text-primary tracking-widest uppercase">جاري تشغيل مركز القيادة...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 max-w-md mx-auto pb-24" dir="rtl">
      <header className="bg-card p-6 rounded-3xl border-2 border-primary/20 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Settings2 className="w-32 h-32 rotate-12" />
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-4 bg-primary rounded-2xl shadow-lg">
            <Zap className="text-primary-foreground w-8 h-8 fill-current" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground leading-none">مختبر الذكاء</h1>
            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mt-1">إدارة مشاريعك من Google AI Studio</p>
          </div>
        </div>

        <Alert className="bg-accent/10 border-accent/20 py-3 rounded-2xl relative z-10">
          <Info className="w-5 h-5 text-accent" />
          <AlertDescription className="text-xs font-black text-accent mr-2">
            الصق رابط مشروعك من جوجل ومفتاح Gemini لتبدأ العمل فوراً.
          </AlertDescription>
        </Alert>
        
        <div className="grid gap-3 pt-2 relative z-10">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-20 text-xl font-black rounded-2xl w-full shadow-2xl flex flex-col items-center justify-center gap-1 group">
                <div className="flex items-center gap-2">
                  <Import className="w-6 h-6 group-hover:scale-110 transition-transform" /> 
                  <span>استيراد من AI Studio</span>
                </div>
                <span className="text-[10px] opacity-70 font-bold">ربط الوصفة برابط جوجل</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95%] max-w-xs rounded-3xl p-6 bg-card border-4 border-primary/20 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-right text-2xl font-black">ربط مشروعك من جوجل</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-5 py-4 text-right overflow-y-auto max-h-[60vh]">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-primary uppercase">١. اسم المشروع</label>
                  <Input 
                    placeholder="مثال: مشروعي الضخم" 
                    value={importName}
                    onChange={(e) => setImportName(e.target.value)}
                    className="h-12 rounded-xl border-2 font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-primary uppercase">٢. رابط المشروع (App URL)</label>
                  <Input 
                    placeholder="https://ai.studio/apps/..." 
                    value={importExternalId}
                    onChange={(e) => setImportExternalId(e.target.value)}
                    className="h-12 rounded-xl border-2 font-mono text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-primary uppercase">٣. مفتاح Gemini (API Key)</label>
                  <Input 
                    placeholder="المفتاح من Get API Key" 
                    value={importKey}
                    onChange={(e) => setImportKey(e.target.value)}
                    className="h-12 rounded-xl font-mono text-sm border-2"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-primary uppercase">٤. تعليمات النظام (وصفة الذكاء)</label>
                  <Textarea 
                    placeholder="الصق الـ System Instructions هنا..." 
                    className="min-h-[120px] rounded-xl text-base border-2 p-4 font-medium"
                    value={importPrompt}
                    onChange={(e) => setImportPrompt(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleQuickImport} className="w-full h-16 font-black text-xl rounded-2xl shadow-lg">ربط وتفعيل الآن 🚀</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={handleCreateProject} className="h-16 text-lg font-bold rounded-2xl w-full border-2 border-dashed border-primary/30">
            <Plus className="ml-2 w-5 h-5" /> إنشاء مسودة يدوية
          </Button>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-xs font-black uppercase text-muted-foreground flex items-center gap-2 px-2 tracking-[0.2em]">
          <FolderOpen className="w-4 h-4 text-primary" /> مكتبة المشاريع المربوطة ({projects.length})
        </h2>
        
        <div className="grid gap-4">
          {projects.length > 0 ? (
            projects.map(project => (
              <div key={project.id} className="relative group">
                <Link href={`/projects/${project.id}`}>
                  <Card className="active:scale-95 transition-all bg-card border-primary/10 rounded-3xl overflow-hidden shadow-lg border-r-[12px] border-r-primary">
                    <CardContent className="p-6 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-secondary rounded-lg">
                            <Terminal className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-black text-xl tracking-tight truncate max-w-[150px]">{project.name}</span>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                      </div>
                      
                      {project.externalAppId && (
                        <div className="flex items-center gap-2 text-[10px] text-accent font-black bg-accent/5 p-2 rounded-lg border border-accent/10">
                          <LinkIcon className="w-3 h-3" />
                          <span className="truncate">مرتبط بـ: {project.externalAppId.split('/').pop()}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-primary/20 px-3 py-1 rounded-full font-black text-primary uppercase">
                            {project.model}
                          </span>
                          {project.apiKeys?.[0] ? (
                            <span className="text-[10px] font-black text-accent bg-accent/10 px-3 py-1 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> جاهز ✅
                            </span>
                          ) : (
                            <span className="text-[10px] font-black text-destructive bg-destructive/10 px-3 py-1 rounded-full">بدون مفتاح ⚠️</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 text-destructive/40 hover:text-destructive hover:bg-destructive/10 rounded-full z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[90%] rounded-3xl" dir="rtl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-right">حذف المشروع؟</AlertDialogTitle>
                      <AlertDialogDescription className="text-right">
                        سيتم حذف "{project.name}" نهائياً. لا يمكن التراجع عن هذا الإجراء.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row-reverse gap-2">
                      <AlertDialogAction 
                        className="bg-destructive text-destructive-foreground rounded-xl flex-1"
                        onClick={() => deleteProject(project.id)}
                      >
                        نعم، احذف
                      </AlertDialogAction>
                      <AlertDialogCancel className="rounded-xl flex-1 mt-0">تراجع</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))
          ) : (
            <div className="py-16 text-center border-4 border-dashed rounded-[40px] opacity-40 bg-muted/5">
              <Import className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">اربط أول مشروع لك الآن</p>
            </div>
          )}
        </div>
      </section>

      <nav className="fixed bottom-4 left-4 right-4 h-16 bg-card/90 backdrop-blur-xl border-2 border-primary/20 flex items-center justify-around px-8 shadow-2xl z-50 rounded-full">
        <Link href="/" className="flex flex-col items-center gap-1 text-primary animate-pulse">
          <Zap className="w-6 h-6 fill-current" />
          <span className="text-[9px] font-black">الرئيسية</span>
        </Link>
        <Link href="/playground" className="flex flex-col items-center gap-1 text-muted-foreground/60 hover:text-primary transition-colors">
          <Terminal className="w-6 h-6" />
          <span className="text-[9px] font-bold">المختبر</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center gap-1 text-muted-foreground/60 hover:text-primary transition-colors">
          <History className="w-6 h-6" />
          <span className="text-[9px] font-bold">السجل</span>
        </Link>
      </nav>
    </div>
  );
}
