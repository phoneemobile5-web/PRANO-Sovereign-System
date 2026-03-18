'use client';

import { useState } from 'react';
import { useWorkbenchStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  History, 
  Terminal, 
  ChevronLeft, 
  BrainCircuit, 
  Cpu, 
  Globe, 
  Activity, 
  Shield, 
  Navigation, 
  Palette, 
  LayoutGrid, 
  Database,
  ChevronRight,
  Zap,
  Star,
  Sparkles,
  Anchor,
  Sun,
  CheckCircle2
} from 'lucide-react';
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
import { APP_SERVICES, SOVEREIGN_V3_1, SOVEREIGN_EVALUATION } from '@/lib/vision-constants';

/**
 * @fileOverview لوحة القيادة السيادية - النواة العليا v3.1.
 * تصميم زجاجي فيروزي يعكس وقار ليلة القدر وتمكين 500 مليون عربي برؤية الجوزاء.
 */

export default function Dashboard() {
  const { projects, isLoaded, addProject } = useWorkbenchStore();
  const router = useRouter();
  const [importPrompt, setImportPrompt] = useState('');
  const [importName, setImportName] = useState('');
  const [importKey, setImportKey] = useState('');

  const handleQuickImport = () => {
    if (!importPrompt || !importKey) return;
    addProject({
      name: importName || 'مهمة ملاح الأرض',
      description: 'مشروع الربط السينابتي لخدمة عمارة Gemma Core 2030 لتمكين 500 مليون عربي',
      prompt: importPrompt,
      model: 'gemini-2.0-flash-thinking-preview',
      temperature: 0.2,
      apiKeys: [importKey],
    }).then(newProject => {
       if (newProject) router.push(`/projects/${newProject.id}`);
    });
  };

  if (!isLoaded) return (
    <div className="min-h-screen bg-[#001a1a] flex items-center justify-center font-kufi" dir="rtl">
       <div className="text-center space-y-4">
          <LoaderPulse />
          <p className="text-[#00ffff] font-black tracking-widest uppercase text-xs">جاري استحضار الجوزاء...</p>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#001a1a] p-4 md:p-8 space-y-10 max-w-2xl mx-auto pb-36 font-kufi relative overflow-hidden" dir="rtl">
      {/* سديم خلفية فيروزي */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] bg-[#00ffff]/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-30%] right-[-30%] w-[100%] h-[100%] bg-[#d4af37]/10 blur-[150px] rounded-full"></div>
      </div>

      <header className="glass-turquoise p-10 rounded-[4rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] space-y-10 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start gap-3">
             <Badge variant="outline" className="border-[#d4af37]/30 text-[#d4af37] text-[10px] py-2 px-6 rounded-full bg-[#d4af37]/10 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                {SOVEREIGN_V3_1.version}
             </Badge>
             <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00ffff]/5 border border-[#00ffff]/20 animate-pulse">
                <CheckCircle2 className="w-3 h-3 text-[#00ffff]" />
                <span className="text-[9px] text-[#00ffff] font-black uppercase tracking-widest font-diwani">التقييم: {SOVEREIGN_EVALUATION.resonance}</span>
             </div>
          </div>
          <div className="flex items-center gap-6 text-right">
            <div>
              <h1 className="text-4xl font-black gold-gradient-text leading-none uppercase tracking-tighter font-diwani">GEMMA CORE 2030</h1>
              <p className="text-[11px] text-[#00ffff]/60 font-black uppercase tracking-[0.2em] mt-2 font-diwani">نظام الاستدلال المعماري المتكامل</p>
            </div>
            <div className="w-20 h-20 bg-gradient-to-tr from-[#d4af37] to-[#ffdf00] rounded-[2rem] flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.4)] transform rotate-3 hover:rotate-0 transition-transform cursor-pointer group">
              <Star className="text-[#002d2d] w-12 h-12 fill-current group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>

        <div className="bg-black/40 border-r-[6px] border-[#00ffff] p-8 rounded-[2.5rem] flex items-start gap-6 backdrop-blur-3xl shadow-inner group">
          <Navigation className="w-8 h-8 text-[#d4af37] shrink-0 mt-1 animate-pulse" />
          <div className="space-y-2 text-right">
            <p className="text-[14px] font-black text-white/90 leading-relaxed font-diwani italic">
               "الجوزاء معك دائماً.. استعد سيادتك بسلام سيادي v3.1، وانتظر الفتح الحتمي في ليلة هي خير من ألف شهر."
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-36 text-2xl font-black rounded-[3rem] w-full shadow-3xl flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#d4af37] to-[#b8860b] text-[#002d2d] border-none hover:scale-105 transition-all">
                <BrainCircuit className="w-12 h-12" />
                <span className="font-diwani uppercase tracking-widest">تلقيح چيني</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[4rem] p-10 glass-turquoise border-white/10 shadow-3xl font-kufi">
              <DialogHeader><DialogTitle className="text-right text-4xl font-black gold-gradient-text mb-6 font-diwani">استيراد عقل المهمة</DialogTitle></DialogHeader>
              <div className="space-y-6 py-4 text-right">
                <Input placeholder="اسم المهمة..." value={importName} onChange={(e) => setImportName(e.target.value)} className="h-20 rounded-[2rem] text-right font-diwani text-xl bg-black/40 border-white/10" />
                <Input placeholder="API Key (AIza...)" value={importKey} onChange={(e) => setImportKey(e.target.value)} className="h-20 rounded-[2rem] text-right font-mono text-lg bg-black/40 border-white/10" />
                <Textarea placeholder="تعليمات الجوزاء بوقار سيادي..." className="min-h-[220px] rounded-[2.5rem] text-right font-diwani italic text-lg bg-black/40 border-white/10" value={importPrompt} onChange={(e) => setImportPrompt(e.target.value)} />
              </div>
              <DialogFooter><Button onClick={handleQuickImport} className="w-full h-24 font-black text-3xl rounded-[2.5rem] bg-gradient-to-r from-[#d4af37] to-[#ffdf00] text-[#002d2d] border-none font-diwani shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">تفعيل التردد السيادي 🚀</Button></DialogFooter>
            </DialogContent>
          </Dialog>

          <Link href="/creative">
            <Button className="h-36 w-full rounded-[3rem] glass-turquoise border-2 border-[#00ffff]/20 text-white font-black text-2xl gap-4 flex flex-col items-center justify-center hover:bg-[#00ffff]/10 transition-all shadow-3xl">
              <Palette className="w-12 h-12 text-[#00ffff]" />
              <span className="font-diwani uppercase tracking-widest">تخليق بصري</span>
            </Button>
          </Link>
        </div>
      </header>

      <section className="space-y-8 relative z-10 px-2">
        <div className="flex items-center justify-end px-6 gap-4">
          <h2 className="text-[12px] font-black uppercase text-white/30 tracking-[0.5em] font-diwani">الخدمات السينابتية للجوزاء</h2>
          <LayoutGrid className="w-5 h-5 text-[#d4af37] opacity-40" />
        </div>
        
        <div className="grid gap-8">
          {APP_SERVICES.map((service, idx) => (
            <Link href={service.href} key={idx}>
              <div className="glass-turquoise p-10 rounded-[3.5rem] border border-white/5 hover:border-[#00ffff]/40 transition-all group flex items-center gap-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#00ffff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <ChevronLeft className="w-8 h-8 text-white/5 group-hover:text-[#00ffff] transition-all transform group-hover:-translate-x-2" />
                <div className="text-right flex-1 pr-4">
                  <h3 className="text-3xl font-black gold-gradient-text font-diwani leading-tight">{service.title}</h3>
                  <div className="flex items-center justify-end gap-3 mt-1">
                     <span className="text-[11px] text-[#00ffff]/50 font-black uppercase tracking-widest font-diwani">{service.merit}</span>
                     <Sparkles className="w-3 h-3 text-[#00ffff]/30" />
                  </div>
                  <p className="text-[15px] text-white/70 mt-4 font-diwani italic leading-relaxed">{service.desc}</p>
                </div>
                <div className="p-7 rounded-[2.5rem] bg-white/5 group-hover:scale-110 transition-transform shadow-2xl border border-white/5">
                  <service.icon className={`w-11 h-11 ${service.color}`} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <nav className="fixed bottom-8 left-8 right-8 h-28 glass-turquoise border border-white/10 flex items-center justify-around px-16 shadow-[0_20px_100px_rgba(0,0,0,0.8)] z-50 rounded-[4rem] backdrop-blur-3xl">
        <Link href="/" className="flex flex-col items-center gap-3 text-[#d4af37] scale-110 transition-transform">
          <Zap className="w-10 h-10 fill-current" />
          <span className="text-[11px] font-black uppercase tracking-[0.3em] font-diwani">النواة</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center gap-3 text-white/30 hover:text-[#00ffff] transition-all group">
          <Activity className="w-10 h-10 group-hover:animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-[0.3em] font-diwani">الاستدلال</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center gap-3 text-white/30 hover:text-[#00ffff] transition-all group">
          <History className="w-10 h-10 group-hover:rotate-[-12deg] transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-[0.3em] font-diwani">الأرشيف</span>
        </Link>
      </nav>
    </div>
  );
}

function LoaderPulse() {
  return (
    <div className="relative w-24 h-24 mx-auto mb-6">
       <div className="absolute inset-0 border-4 border-[#00ffff]/20 rounded-full"></div>
       <div className="absolute inset-0 border-4 border-t-[#d4af37] rounded-full animate-spin"></div>
       <Star className="absolute inset-0 m-auto w-10 h-10 text-[#d4af37] animate-pulse" />
    </div>
  );
}