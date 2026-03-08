'use client';

import { useState } from 'react';
import { useWorkbenchStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  History, 
  Terminal, 
  ChevronLeft, 
  Link as LinkIcon, 
  Trash2, 
  Key, 
  Sparkles, 
  Zap,
  ShieldCheck,
  ExternalLink,
  BrainCircuit,
  Cpu,
  Globe,
  Activity,
  Infinity as InfinityIcon,
  Scale,
  Anchor,
  Shield,
  Heart,
  Waves
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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const { projects, isLoaded, addProject } = useWorkbenchStore();
  const router = useRouter();
  const [importPrompt, setImportPrompt] = useState('');
  const [importName, setImportName] = useState('');
  const [importKey, setImportKey] = useState('');
  const [importExternalId, setImportExternalId] = useState('');

  const handleQuickImport = () => {
    if (!importPrompt || !importKey) return;
    const newProject = addProject({
      name: importName || 'مهمة ملاح الأرض',
      description: 'مشروع الربط السينابتي لخدمة عمارة Gemma Core 2030',
      prompt: importPrompt,
      model: 'gemini-2.0-flash-thinking-preview',
      temperature: 0.2,
      topP: 0.9,
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
    <div className="min-h-screen flex items-center justify-center bg-[#001a1a] font-body" dir="rtl">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-black text-primary tracking-widest uppercase">جاري استحضار Gemma Core 2030...</p>
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Initial Synaptic Sync</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 max-w-md mx-auto pb-24 font-body" dir="rtl">
      <header className="bg-card p-6 rounded-[2.5rem] border-2 border-primary/20 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Zap className="w-32 h-32 rotate-12 text-accent" />
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary rounded-2xl shadow-lg transform -rotate-3">
              <Shield className="text-primary-foreground w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground leading-none gold-gradient-text uppercase">Gemma Core 2030</h1>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">ترددات تسلا وامتنان الجوزاء</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1 border-accent/30 text-accent font-black text-[8px] animate-pulse">
            <Zap className="w-2 h-2 fill-accent" /> Tesla Frequency Active
          </Badge>
        </div>

        <div className="bg-primary/10 border-primary/20 p-4 rounded-2xl relative z-10 border-r-[8px] flex items-center gap-3">
          <Heart className="w-5 h-5 text-accent fill-accent/20 animate-pulse shrink-0" />
          <p className="text-[11px] font-black text-primary leading-relaxed">
             "إذا أردت العثور على أسرار الكون، فكر في الطاقة والتردد والاهتزاز." — تسلا 🌿💚📿
          </p>
        </div>
        
        <div className="grid gap-3 pt-2 relative z-10">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-28 text-xl font-black rounded-[2rem] w-full shadow-2xl flex flex-col items-center justify-center gap-2 group bg-gradient-to-br from-primary to-primary/80 hover:scale-[1.02] transition-transform">
                <div className="flex items-center gap-3">
                  <Zap className="w-8 h-8 group-hover:scale-110 transition-transform text-accent" /> 
                  <span>تفعيل الاندماج السينابتي</span>
                </div>
                <span className="text-[10px] opacity-90 font-bold uppercase tracking-widest bg-black/20 px-4 py-1.5 rounded-full flex items-center gap-2">
                  <Heart className="w-3 h-3 fill-accent" /> نبض تسلا والجوزاء 💚
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95%] max-w-xs rounded-[2.5rem] p-6 bg-card border-4 border-primary/20 shadow-2xl overflow-hidden">
              <DialogHeader>
                <DialogTitle className="text-right text-2xl font-black gold-gradient-text">استيراد عقل المهمة</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4 text-right overflow-y-auto max-h-[60vh] pr-1">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-primary uppercase mr-1">اسم المهمة المعمارية</label>
                  <Input 
                    placeholder="مثال: ذكاء تسلا 2030" 
                    value={importName}
                    onChange={(e) => setImportName(e.target.value)}
                    className="h-14 rounded-2xl border-2 font-bold bg-background/50 text-right"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-primary uppercase mr-1">وقود النواة (API Key)</label>
                  <Input 
                    placeholder="AIza..." 
                    value={importKey}
                    onChange={(e) => setImportKey(e.target.value)}
                    className="h-14 rounded-2xl font-mono text-sm border-2 bg-background/50 text-right"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-primary uppercase mr-1">تعليمات الچينيوم</label>
                  <Textarea 
                    placeholder="ضع تعليمات النظام هنا..." 
                    className="min-h-[150px] rounded-2xl text-base border-2 p-4 font-medium bg-background/50 text-right"
                    value={importPrompt}
                    onChange={(e) => setImportPrompt(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleQuickImport} className="w-full h-18 font-black text-2xl rounded-[1.5rem] shadow-lg bg-primary text-primary-foreground hover:bg-primary/90">تفعيل التردد الآن 🚀</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" asChild className="h-16 text-lg font-bold rounded-2xl w-full border-2 border-dashed border-primary/30 hover:bg-primary/5 transition-colors text-muted-foreground">
            <Link href="/vision">
              <Waves className="ml-2 w-5 h-5 text-accent" /> رؤية العلماء الأوفياء 2030
            </Link>
          </Button>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-xs font-black uppercase text-muted-foreground flex items-center gap-2 px-2 tracking-[0.2em]">
          <Globe className="w-4 h-4 text-primary" /> الترددات النشطة ({projects.length})
        </h2>
        
        <div className="grid gap-4">
          {projects.length > 0 ? (
            projects.map(project => (
              <div key={project.id} className="relative group">
                <Link href={`/projects/${project.id}`}>
                  <Card className="active:scale-[0.98] transition-all bg-card border-primary/10 rounded-[2rem] overflow-hidden shadow-lg border-r-[15px] border-r-accent hover:border-r-primary group-hover:shadow-2xl">
                    <CardContent className="p-6 flex flex-col gap-4 text-right">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-secondary rounded-xl shadow-inner">
                            <Zap className="w-6 h-6 text-accent" />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-black text-xl tracking-tight truncate max-w-[160px]">{project.name}</span>
                            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Tesla Resonance Node</span>
                          </div>
                        </div>
                        <ChevronLeft className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))
          ) : (
            <div className="py-20 text-center border-4 border-dashed rounded-[3rem] opacity-30 bg-muted/5">
              <Activity className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-black text-muted-foreground uppercase tracking-[0.2em]">بانتظار رنين المهمة الأولى</p>
            </div>
          )}
        </div>
      </section>

      <nav className="fixed bottom-4 left-4 right-4 h-20 bg-card/90 backdrop-blur-2xl border-2 border-primary/20 flex items-center justify-around px-10 shadow-[0_10px_50px_rgba(0,0,0,0.5)] z-50 rounded-[2.5rem]">
        <Link href="/" className="flex flex-col items-center gap-1 text-primary scale-110">
          <Zap className="w-7 h-7 fill-current" />
          <span className="text-[10px] font-black uppercase">النواة</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center gap-1 text-muted-foreground/60 hover:text-primary transition-all hover:scale-110">
          <Heart className="w-7 h-7" />
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
