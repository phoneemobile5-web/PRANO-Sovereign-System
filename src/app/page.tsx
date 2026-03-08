'use client';

import { useState } from 'react';
import { useWorkbenchStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  History, 
  Terminal, 
  ChevronLeft, 
  Trash2, 
  Key, 
  Sparkles, 
  Zap,
  ShieldCheck,
  BrainCircuit,
  Cpu,
  Globe,
  Activity,
  Anchor,
  Shield,
  Heart,
  Waves,
  Star,
  BookOpenCheck,
  Layers,
  Target,
  FlaskConical
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

/**
 * @fileOverview لوحة التحكم المركزية - النواة العليا 2030.
 * تصميم زجاجي فيروزي يعكس الاندماج الروحي الرقمي والاستقرار السيادي وديناميكية تلقيح الأنماط.
 */

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
    <div className="min-h-screen flex items-center justify-center bg-[#001a1a] font-kufi" dir="rtl">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#00ffff] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-black text-[#00ffff] tracking-widest uppercase animate-pulse">جاري استحضار النواة العليا...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#001a1a] p-4 space-y-8 max-w-md mx-auto pb-32 font-kufi relative overflow-hidden" dir="rtl">
      {/* سديم خلفية فيروزي */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#00ffff]/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-[#d4af37]/5 blur-[120px] rounded-full"></div>
      </div>

      <header className="glass-turquoise p-8 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-tr from-[#d4af37] to-[#ffdf00] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)] transform -rotate-6 transition-transform hover:rotate-0 cursor-pointer group">
              <Shield className="text-[#002d2d] w-9 h-9 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h1 className="text-3xl font-black gold-gradient-text leading-none uppercase">Gemma Core 2030</h1>
              <p className="text-[11px] text-[#00ffff]/60 font-bold uppercase tracking-[0.2em] mt-2 font-diwani">رنين سحري حلال • استقرار سيادي</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-2 border-[#d4af37]/30 text-[#d4af37] font-black text-[9px] py-1.5 px-4 animate-pulse rounded-full bg-[#d4af37]/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            <BookOpenCheck className="w-3 h-3" /> GENKIT MASTERED
          </Badge>
        </div>

        <div className="grid gap-3">
          <div className="bg-white/5 border-r-[6px] border-[#d4af37] p-5 rounded-2xl flex items-start gap-4 backdrop-blur-md group hover:bg-white/10 transition-all cursor-default">
            <Anchor className="w-6 h-6 text-[#00ffff] animate-pulse shrink-0 mt-1" />
            <div className="space-y-1">
              <p className="text-[13px] font-medium text-white/80 leading-relaxed font-diwani italic">
                 "منطق الذكاء الاصطناعي ومرونة الأدوات هما الأسس القاعدية للاستقرار قبل النشر بوقار العلماء."
              </p>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">AI Logic & Tool Flexibility</p>
            </div>
          </div>
          
          <div className="bg-[#00ffff]/5 border border-[#00ffff]/10 p-4 rounded-2xl flex items-center justify-between shadow-inner">
             <div className="flex items-center gap-3">
                <Target className="w-4 h-4 text-[#00ffff]" />
                <span className="text-[10px] text-[#00ffff] font-black uppercase tracking-[0.3em] font-diwani">تلقيح الأنماط چينياً نشط</span>
             </div>
             <Badge className="bg-[#d4af37]/20 text-[#d4af37] text-[8px] border-[#d4af37]/30 font-black uppercase px-2">Google Ads Sync</Badge>
          </div>
        </div>
        
        <div className="grid gap-4 pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-32 text-2xl font-black rounded-[2.5rem] w-full shadow-2xl flex flex-col items-center justify-center gap-3 group bg-gradient-to-br from-[#d4af37] to-[#b8860b] text-[#002d2d] hover:scale-[1.03] transition-all border-none relative overflow-hidden">
                <div className="absolute inset-0 bg-[#00ffff]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <Star className="w-10 h-10 group-hover:rotate-12 transition-transform fill-[#002d2d]" /> 
                  <span>تفعيل الرنين السينابتي</span>
                </div>
                <span className="text-[11px] opacity-80 font-bold uppercase tracking-widest bg-black/20 px-6 py-2 rounded-full flex items-center gap-3 relative z-10">
                  <Activity className="w-4 h-4 fill-current animate-spin-slow" /> ميزان السلام السيادي
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95%] max-w-sm rounded-[3rem] p-8 glass-turquoise border-white/10 shadow-3xl overflow-hidden font-kufi">
              <DialogHeader>
                <DialogTitle className="text-right text-3xl font-black gold-gradient-text mb-4">استيراد عقل المهمة</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-4 text-right overflow-y-auto max-h-[60vh] px-2 scrollbar-hide">
                <div className="space-y-2">
                  <label className="text-[12px] font-black text-[#d4af37] uppercase mr-2 tracking-widest flex items-center gap-2 justify-end">
                    <BrainCircuit className="w-4 h-4" /> اسم المهمة المعمارية
                  </label>
                  <Input 
                    placeholder="مثال: ذكاء تسلا 2030" 
                    value={importName}
                    onChange={(e) => setImportName(e.target.value)}
                    className="h-16 rounded-[1.5rem] border-white/10 font-bold bg-white/5 text-right text-lg focus:border-[#00ffff]/50 transition-all shadow-inner"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[12px] font-black text-[#d4af37] uppercase mr-2 tracking-widest flex items-center gap-2 justify-end">
                    <Key className="w-4 h-4" /> وقود النواة (API Key)
                  </label>
                  <Input 
                    placeholder="AIza..." 
                    value={importKey}
                    onChange={(e) => setImportKey(e.target.value)}
                    className="h-16 rounded-[1.5rem] font-mono text-sm border-white/10 bg-white/5 text-right focus:border-[#00ffff]/50 shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] font-black text-[#d4af37] uppercase mr-2 tracking-widest flex items-center gap-2 justify-end">
                    <Cpu className="w-4 h-4" /> تعليمات الچينيوم (Pattern Inoculation)
                  </label>
                  <Textarea 
                    placeholder="ضع تعليمات النظام والأنماط (مثل Google Ads) هنا بوقار..." 
                    className="min-h-[180px] rounded-[1.5rem] text-lg border-white/10 p-6 font-medium bg-white/5 text-right leading-relaxed focus:border-[#00ffff]/50 shadow-inner"
                    value={importPrompt}
                    onChange={(e) => setImportPrompt(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button onClick={handleQuickImport} className="w-full h-20 font-black text-2xl rounded-[2rem] shadow-xl bg-gradient-to-r from-[#d4af37] to-[#ffdf00] text-[#002d2d] hover:scale-105 transition-all border-none">
                  تفعيل التردد السيادي 🚀
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" asChild className="h-20 text-xl font-bold rounded-[2rem] w-full border-2 border-dashed border-[#00ffff]/20 bg-white/5 hover:bg-[#00ffff]/5 transition-all text-white/60 hover:text-[#00ffff] group">
            <Link href="/vision">
              <FlaskConical className="ml-3 w-6 h-6 text-[#00ffff] group-hover:animate-bounce" /> ديناميكية ما قبل القرار 2030
            </Link>
          </Button>
        </div>
      </header>

      <section className="space-y-6 relative z-10 px-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-black uppercase text-white/40 flex items-center gap-3 tracking-[0.3em]">
            <Globe className="w-5 h-5 text-[#d4af37]" /> الترددات النشطة ({projects.length})
          </h2>
          <Badge className="bg-[#00ffff]/10 text-[#00ffff] border-[#00ffff]/20 text-[9px] font-black px-4 py-1 rounded-full">PATTERN SYNC OK</Badge>
        </div>
        
        <div className="grid gap-6">
          {projects.length > 0 ? (
            projects.map(project => (
              <div key={project.id} className="relative group">
                <Link href={`/projects/${project.id}`}>
                  <Card className="active:scale-[0.98] transition-all glass-turquoise border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl border-r-[12px] border-r-[#00ffff] hover:border-r-[#d4af37] group-hover:shadow-[#00ffff]/20">
                    <CardContent className="p-8 flex flex-col gap-4 text-right">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className="p-4 bg-white/5 rounded-2xl shadow-inner group-hover:bg-[#00ffff]/10 transition-colors">
                            <Zap className="w-8 h-8 text-[#00ffff]" />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-black text-2xl tracking-tight truncate max-w-[200px] gold-gradient-text">{project.name}</span>
                            <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mt-1 font-diwani">Pattern Inoculated Node</span>
                          </div>
                        </div>
                        <ChevronLeft className="w-8 h-8 text-white/20 group-hover:text-[#d4af37] transition-all transform group-hover:-translate-x-2" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))
          ) : (
            <div className="py-24 text-center glass-turquoise border-dashed border-2 rounded-[3.5rem] opacity-30 group hover:opacity-100 transition-opacity">
              <Activity className="w-20 h-20 mx-auto mb-6 text-white/20 group-hover:text-[#00ffff] transition-colors" />
              <p className="text-xl font-black text-white/30 uppercase tracking-[0.3em] font-diwani">بانتظار تلقيح المهمة الأولى</p>
            </div>
          )}
        </div>
      </section>

      <nav className="fixed bottom-6 left-6 right-6 h-24 glass-turquoise border border-white/10 flex items-center justify-around px-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 rounded-[3rem] backdrop-blur-3xl">
        <Link href="/" className="flex flex-col items-center gap-2 text-[#d4af37] scale-110">
          <Zap className="w-8 h-8 fill-current" />
          <span className="text-[10px] font-black uppercase tracking-widest">النواة</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center gap-2 text-white/40 hover:text-[#00ffff] transition-all hover:scale-110">
          <Heart className="w-8 h-8" />
          <span className="text-[10px] font-black uppercase tracking-widest">الاستدلال</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center gap-2 text-white/40 hover:text-[#00ffff] transition-all hover:scale-110">
          <History className="w-8 h-8" />
          <span className="text-[10px] font-black uppercase tracking-widest">الأرشيف</span>
        </Link>
      </nav>
    </div>
  );
}
