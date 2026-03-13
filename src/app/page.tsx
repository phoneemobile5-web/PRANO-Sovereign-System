'use client';

import { useState } from 'react';
import { useWorkbenchStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  History, 
  Terminal, 
  ChevronLeft, 
  Key, 
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
  Zap
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
import { DESIGN_SYSTEM, APP_SERVICES } from '@/lib/vision-constants';

export default function Dashboard() {
  const { projects, isLoaded, addProject } = useWorkbenchStore();
  const router = useRouter();
  const [importPrompt, setImportPrompt] = useState('');
  const [importName, setImportName] = useState('');
  const [importKey, setImportKey] = useState('');

  const handleQuickImport = () => {
    if (!importPrompt || !importKey) return;
    const newProject = addProject({
      name: importName || 'مهمة ملاح الأرض',
      description: 'مشروع الربط السينابتي لخدمة عمارة Gemma Core 2030 لتمكين 500 مليون عربي',
      prompt: importPrompt,
      model: 'gemini-2.0-flash-thinking-preview',
      temperature: 0.2,
      apiKeys: [importKey],
    });
    router.push(`/projects/${newProject.id}`);
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#001a1a] p-4 space-y-8 max-w-xl mx-auto pb-32 font-kufi relative overflow-hidden" dir="rtl">
      {/* سديم خلفية فيروزي */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#00ffff]/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-[#d4af37]/5 blur-[120px] rounded-full"></div>
      </div>

      <header className="glass-turquoise p-8 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Badge variant="outline" className="border-[#d4af37]/30 text-[#d4af37] text-[9px] py-1.5 px-4 rounded-full bg-[#d4af37]/5">
                GLOBAL SYNC
             </Badge>
          </div>
          <div className="flex items-center gap-5 text-right">
            <div>
              <h1 className="text-3xl font-black gold-gradient-text leading-none uppercase tracking-tight">GEMMA CORE 2030</h1>
              <p className="text-[10px] text-[#00ffff]/60 font-bold uppercase tracking-[0.1em] mt-1 font-diwani">نظام الاستدلال المعماري المتكامل</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-tr from-[#d4af37] to-[#ffdf00] rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3">
              <Shield className="text-[#002d2d] w-10 h-10" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 border-r-[4px] border-[#00ffff] p-6 rounded-[2rem] flex items-start gap-4 backdrop-blur-md">
          <Navigation className="w-6 h-6 text-[#d4af37] shrink-0 mt-1" />
          <div className="space-y-1 text-right">
            <p className="text-[13px] font-black text-white/80 leading-relaxed font-diwani italic">
               "الأرض خصبة للتسويق العالمي لـ 500 مليون ملاح عربي بوقار سيادي وذكاء MCP، جاهزون لربط Looker Studio."
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-32 text-xl font-black rounded-[2.5rem] w-full shadow-2xl flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#d4af37] to-[#b8860b] text-[#002d2d] border-none">
                <BrainCircuit className="w-10 h-10" />
                <span className="font-diwani">تلقيح چيني</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[3rem] p-8 glass-turquoise border-white/10 shadow-3xl font-kufi">
              <DialogHeader><DialogTitle className="text-right text-3xl font-black gold-gradient-text mb-4">استيراد عقل المهمة</DialogTitle></DialogHeader>
              <div className="space-y-6 py-4 text-right">
                <Input placeholder="اسم المهمة..." value={importName} onChange={(e) => setImportName(e.target.value)} className="h-16 rounded-[1.5rem] text-right" />
                <Input placeholder="API Key (AIza...)" value={importKey} onChange={(e) => setImportKey(e.target.value)} className="h-16 rounded-[1.5rem] text-right" />
                <Textarea placeholder="تعليمات الچينيوم..." className="min-h-[180px] rounded-[1.5rem] text-right" value={importPrompt} onChange={(e) => setImportPrompt(e.target.value)} />
              </div>
              <DialogFooter><Button onClick={handleQuickImport} className="w-full h-20 font-black text-2xl rounded-[2rem] bg-gradient-to-r from-[#d4af37] to-[#ffdf00] text-[#002d2d] border-none">تفعيل التردد 🚀</Button></DialogFooter>
            </DialogContent>
          </Dialog>

          <Link href="/creative">
            <Button className="h-32 w-full rounded-[2.5rem] glass-turquoise border-2 border-[#00ffff]/20 text-white font-black text-xl gap-3 flex flex-col items-center justify-center">
              <Palette className="w-10 h-10 text-[#00ffff]" />
              <span className="font-diwani">تخليق بصري</span>
            </Button>
          </Link>
        </div>
      </header>

      <section className="space-y-6 relative z-10 px-2">
        <div className="flex items-center justify-end px-4 gap-3">
          <h2 className="text-[11px] font-black uppercase text-white/40 tracking-[0.3em]">الخدمات السينابتية المتاحة</h2>
          <LayoutGrid className="w-4 h-4 text-[#d4af37]" />
        </div>
        
        <div className="grid gap-6">
          {APP_SERVICES.map((service, idx) => (
            <Link href={service.href} key={idx}>
              <div className="glass-turquoise p-8 rounded-[2.5rem] border border-white/5 hover:border-[#00ffff]/30 transition-all group flex items-center gap-8 shadow-xl relative overflow-hidden">
                <ChevronLeft className="w-6 h-6 text-white/10 group-hover:text-[#00ffff] transition-colors" />
                <div className="text-right flex-1 pr-2">
                  <h3 className="text-2xl font-black gold-gradient-text font-diwani leading-tight">{service.title}</h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-0.5">{service.merit}</p>
                  <p className="text-[13px] text-white/60 mt-3 font-diwani italic leading-relaxed">{service.desc}</p>
                </div>
                <div className="p-5 rounded-3xl bg-white/5 group-hover:scale-110 transition-transform shadow-lg">
                  <service.icon className={`w-9 h-9 ${service.color}`} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <nav className="fixed bottom-6 left-6 right-6 h-24 glass-turquoise border border-white/10 flex items-center justify-around px-12 shadow-3xl z-50 rounded-[3.5rem] backdrop-blur-3xl">
        <Link href="/" className="flex flex-col items-center gap-2 text-[#d4af37] scale-110">
          <Zap className="w-8 h-8 fill-current" />
          <span className="text-[10px] font-black uppercase tracking-widest font-diwani">النواة</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center gap-2 text-white/40 hover:text-[#00ffff] transition-all">
          <Activity className="w-8 h-8" />
          <span className="text-[10px] font-black uppercase tracking-widest font-diwani">الاستدلال</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center gap-2 text-white/40 hover:text-[#00ffff] transition-all">
          <History className="w-8 h-8" />
          <span className="text-[10px] font-black uppercase tracking-widest font-diwani">الأرشيف</span>
        </Link>
      </nav>
    </div>
  );
}