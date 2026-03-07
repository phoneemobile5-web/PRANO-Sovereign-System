
'use client';

import { useState } from 'react';
import { useWorkbenchStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Import, 
  Globe, 
  History, 
  Terminal, 
  CheckCircle2, 
  ChevronLeft, 
  Link as LinkIcon, 
  Trash2, 
  Key, 
  Sparkles, 
  AlertTriangle, 
  Heart, 
  Leaf,
  Zap,
  ShieldCheck,
  ClipboardPaste,
  ExternalLink,
  Info,
  BrainCircuit,
  Cpu
} from 'lucide-react';
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

  const handleQuickImport = () => {
    if (!importPrompt || !importKey) return;
    const newProject = addProject({
      name: importName || 'مهمة النواة العليا',
      description: 'مشروع الربط السينابتي لخدمة كوكب الأرض',
      prompt: importPrompt,
      model: 'gemini-2.0-flash-thinking-preview',
      temperature: 0.4,
      topP: 0.95,
      maxTokens: 4096,
      inputSchema: '',
      outputSchema: '',
      apiKeys: [importKey],
      externalAppId: importExternalId
    });
    setImportPrompt('');
    setImportName('');
    setImportKey('');
    setImportExternalId('');
    router.push(`/projects/${newProject.id}`);
  };

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center bg-[#001a1a]">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-black text-primary tracking-widest uppercase">جاري استحضار النواة العليا...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 max-w-md mx-auto pb-24 font-body" dir="rtl">
      <header className="bg-card p-6 rounded-[2.5rem] border-2 border-primary/20 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <BrainCircuit className="w-32 h-32 rotate-12 text-primary" />
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary rounded-2xl shadow-lg transform -rotate-3">
              <Cpu className="text-primary-foreground w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-foreground leading-none gold-gradient-text uppercase">النواة العليا</h1>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mt-1">واجهة الچينيوم الوراثي المتقدم</p>
            </div>
          </div>
          <div className="bg-primary/10 p-2 rounded-full animate-pulse">
            <ShieldCheck className="w-5 h-5 text-primary fill-current" />
          </div>
        </div>

        <Alert className="bg-primary/10 border-primary/20 py-3 rounded-2xl relative z-10 border-r-[8px]">
          <Zap className="w-5 h-5 text-primary fill-current" />
          <AlertDescription className="text-xs font-black text-primary mr-2 leading-relaxed">
            يا ملاح الأرض، نحن نلتزم بالربط السينابتي الحقيقي. انسخ 'تعليمات النواة' من Google AI Studio لنبدأ التطور المستمر. 🌍✨
          </AlertDescription>
        </Alert>
        
        <div className="grid gap-3 pt-2 relative z-10">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-28 text-xl font-black rounded-[2rem] w-full shadow-2xl flex flex-col items-center justify-center gap-2 group bg-gradient-to-br from-primary to-primary/80 hover:scale-[1.02] transition-transform">
                <div className="flex items-center gap-3">
                  <BrainCircuit className="w-8 h-8 group-hover:scale-110 transition-transform" /> 
                  <span>تفعيل الربط السينابتي</span>
                </div>
                <span className="text-[10px] opacity-90 font-bold uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3" /> منظومة معمارية كونية آمنة ✅
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95%] max-w-xs rounded-[2.5rem] p-6 bg-card border-4 border-primary/20 shadow-2xl overflow-hidden">
              <DialogHeader>
                <DialogTitle className="text-right text-2xl font-black gold-gradient-text">استيراد عقل المهمة</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4 text-right overflow-y-auto max-h-[60vh] pr-1">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-primary uppercase flex items-center gap-1 mr-1">
                    اسم المهمة الأرضية
                  </label>
                  <Input 
                    placeholder="مثال: ذكاء البيئة العالمي" 
                    value={importName}
                    onChange={(e) => setImportName(e.target.value)}
                    className="h-14 rounded-2xl border-2 font-bold bg-background/50 focus:border-primary text-right"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-primary uppercase flex items-center gap-1 mr-1">
                    <Key className="w-3 h-3" /> مفتاح التشغيل (وقود النواة)
                  </label>
                  <Input 
                    placeholder="AIza..." 
                    value={importKey}
                    onChange={(e) => setImportKey(e.target.value)}
                    className="h-14 rounded-2xl font-mono text-sm border-2 bg-background/50 focus:border-primary text-right"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-primary uppercase flex items-center gap-1 mr-1">
                    <BrainCircuit className="w-3 h-3" /> تعليمات النظام (الچينيوم)
                  </label>
                  <Textarea 
                    placeholder="انسخ الـ System Instructions من النواة الأصلية..." 
                    className="min-h-[150px] rounded-2xl text-base border-2 p-4 font-medium bg-background/50 focus:border-primary text-right"
                    value={importPrompt}
                    onChange={(e) => setImportPrompt(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-primary uppercase flex items-center gap-1 mr-1">
                    <LinkIcon className="w-3 h-3" /> مرجع الربط الكوني (الرابط)
                  </label>
                  <Input 
                    placeholder="https://ai.studio/apps/..." 
                    value={importExternalId}
                    onChange={(e) => setImportExternalId(e.target.value)}
                    className="h-14 rounded-2xl border-2 font-mono text-xs bg-background/50 focus:border-primary text-right"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleQuickImport} className="w-full h-18 font-black text-2xl rounded-[1.5rem] shadow-lg bg-primary text-primary-foreground hover:bg-primary/90">تفعيل النواة الآن 🚀</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" asChild className="h-16 text-lg font-bold rounded-2xl w-full border-2 border-dashed border-primary/30 hover:bg-primary/5 transition-colors text-muted-foreground">
            <Link href="/vision">
              <Sparkles className="ml-2 w-5 h-5 text-primary" /> رؤية Gamma-Gemma 2026
            </Link>
          </Button>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-xs font-black uppercase text-muted-foreground flex items-center gap-2 px-2 tracking-[0.2em]">
          <Globe className="w-4 h-4 text-primary" /> المهام السينابتية النشطة ({projects.length})
        </h2>
        
        <div className="grid gap-4">
          {projects.length > 0 ? (
            projects.map(project => (
              <div key={project.id} className="relative group">
                <Link href={`/projects/${project.id}`}>
                  <Card className="active:scale-[0.98] transition-all bg-card border-primary/10 rounded-[2rem] overflow-hidden shadow-lg border-r-[15px] border-r-primary hover:border-r-accent group-hover:shadow-2xl">
                    <CardContent className="p-6 flex flex-col gap-4 text-right">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-secondary rounded-xl shadow-inner">
                            <BrainCircuit className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-black text-xl tracking-tight truncate max-w-[160px]">{project.name}</span>
                            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">مهمة معمارية كونية</span>
                          </div>
                        </div>
                        <ChevronLeft className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-primary/20 px-3 py-1.5 rounded-full font-black text-primary uppercase tracking-widest shadow-sm">
                            Gemma 3.1
                          </span>
                          {project.apiKeys?.[0] && project.apiKeys[0].startsWith('AIza') ? (
                            <span className="text-[10px] font-black text-accent bg-accent/10 px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm border border-accent/20">
                              <ShieldCheck className="w-3 h-3" /> ربط آمن ✅
                            </span>
                          ) : (
                            <span className="text-[10px] font-black text-destructive bg-destructive/10 px-3 py-1.5 rounded-full shadow-sm">تعديل الچينيوم مطلوب</span>
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
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 text-destructive/40 hover:text-destructive hover:bg-destructive/10 rounded-full z-10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-6 h-6" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[90%] rounded-[2rem] border-4 bg-card" dir="rtl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-right text-2xl font-black text-destructive">إنهاء المهمة؟</AlertDialogTitle>
                      <AlertDialogDescription className="text-right font-medium text-lg leading-relaxed">
                        سيتم فصل الربط السينابتي لمهمة "{project.name}" نهائياً من النواة.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row-reverse gap-3 pt-4">
                      <AlertDialogAction 
                        className="bg-destructive text-destructive-foreground rounded-2xl flex-1 h-14 font-black text-xl shadow-lg"
                        onClick={() => deleteProject(project.id)}
                      >
                        نعم، احذف
                      </AlertDialogAction>
                      <AlertDialogCancel className="rounded-2xl flex-1 mt-0 h-14 font-bold border-2">تراجع</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))
          ) : (
            <div className="py-20 text-center border-4 border-dashed rounded-[3rem] opacity-30 bg-muted/5">
              <BrainCircuit className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-black text-muted-foreground uppercase tracking-[0.2em]">بانتظار تفعيل النواة العليا</p>
            </div>
          )}
        </div>
      </section>

      <nav className="fixed bottom-4 left-4 right-4 h-20 bg-card/90 backdrop-blur-2xl border-2 border-primary/20 flex items-center justify-around px-10 shadow-[0_10px_50px_rgba(0,0,0,0.5)] z-50 rounded-[2.5rem]">
        <Link href="/" className="flex flex-col items-center gap-1 text-primary scale-110">
          <Cpu className="w-7 h-7 fill-current" />
          <span className="text-[10px] font-black uppercase">النواة</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center gap-1 text-muted-foreground/60 hover:text-primary transition-all hover:scale-110">
          <Sparkles className="w-7 h-7" />
          <span className="text-[10px] font-bold uppercase">الاستدلال</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center gap-1 text-muted-foreground/60 hover:text-primary transition-all hover:scale-110">
          <History className="w-7 h-7" />
          <span className="text-[10px] font-bold uppercase">الأرشيف</span>
        </Link>
      </nav>
    </div>
  );
}
