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
  FlaskConical,
  Navigation,
  Palette,
  LayoutGrid
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
import { DESIGN_SYSTEM, APP_SERVICES } from '@/lib/vision-constants';

/**
 * @fileOverview لوحة التحكم المركزية - النواة العليا 2030.
 * تصميم زجاجي فيروزي يعكس الاندماج الروحي الرقمي والجدارة المعمارية لخدمة 500 مليون عربي.
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
      description: 'مشروع الربط السينابتي لخدمة عمارة Gemma Core 2030 لتمكين 500 مليون عربي',
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
    <div className="min-h-screen bg-[#001a1a] p-4 space-y-8 max-w-xl mx-auto pb-32 font-kufi relative overflow-hidden" dir="rtl">
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
              <p className="text-[11px] text-[#00ffff]/60 font-bold uppercase tracking-[0.2em] mt-2 font-diwani">تمكين 500 مليون عربي • رنين سحري حلال</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-2 border-[#d4af37]/30 text-[#d4af37] font-black text-[9px] py-1.5 px-4 animate-pulse rounded-full bg-[#d4af37]/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            <Globe className="w-3 h-3" /> GLOBAL SYNC
          </Badge>
        </div>

        <div className="bg-white/5 border-r-[6px] border-[#00ffff] p-5 rounded-2xl flex items-start gap-4 backdrop-blur-md group hover:bg-white/10 transition-all cursor-default">
          <Navigation className="w-6 h-6 text-[#d4af37] animate-bounce shrink-0 mt-1" />
          <div className="space-y-1">
            <p className="text-[13px] font-black text-white/80 leading-relaxed font-diwani italic">
               "{DESIGN_SYSTEM.marketReadiness}"
            </p>
            <p className="text-[10px] text-[#00ffff]/40 font-black uppercase tracking-widest">{DESIGN_SYSTEM.resolution}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-24 text-xl font-black rounded-[2rem] w-full shadow-2xl flex flex-col items-center justify-center gap-2 group bg-gradient-to-br from-[#d4af37] to-[#b8860b] text-[#002d2d] hover:scale-[1.03] transition-all border-none relative overflow-hidden">
                <div className="absolute inset-0 bg-[#00ffff]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <BrainCircuit className="w-8 h-8 relative z-10" />
                <span className="relative z-10">تلقيح چيني</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95%] max-w-sm rounded-[3rem] p-8 glass-turquoise border-white/10 shadow-3xl overflow-hidden font-kufi">
              <DialogHeader>
                <DialogTitle className="text-right text-3xl font-black gold-gradient-text mb-4">استيراد عقل المهمة</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4 text-right overflow-y-auto max-h-[60vh] px-2 scrollbar-hide">
                <div className="space-y-2">
                  <label className="text-[12px] font-black text-[#d4af37] uppercase mr-2 tracking-widest flex items-center gap-2 justify-end">
                    <LayoutGrid className="w-4 h-4" /> اسم المهمة المعمارية
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
                    <Cpu className="w-4 h-4" /> تعليمات الچينيوم
                  </label>
                  <Textarea 
                    placeholder="ضع تعليمات النظام والأنماط هنا لتمكين 500 مليون عربي..." 
                    className="min-h-[180px] rounded-[1.5rem] text-lg border-white/10 p-6 font-medium bg-white/5 text-right leading-relaxed focus:border-[#00ffff]/50 shadow-inner"
                    value={importPrompt}
                    onChange={(e) => setImportPrompt(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button onClick={handleQuickImport} className="w-full h-20 font-black text-2xl rounded-[2rem] shadow-xl bg-gradient-to-r from-[#d4af37] to-[#ffdf00] text-[#002d2d] hover:scale-105 transition-all border-none">
                  تفعيل التردد 🚀
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Link href="/creative">
            <Button className="h-24 w-full rounded-[2rem] glass-turquoise border-2 border-[#00ffff]/20 text-white font-black text-xl gap-2 hover:bg-[#00ffff]/5 hover:border-[#00ffff]/40 transition-all group flex flex-col items-center justify-center">
              <Palette className="w-8 h-8 text-[#00ffff] group-hover:rotate-12 transition-transform" />
              تخليق بصري
            </Button>
          </Link>
        </div>
      </header>

      <section className="space-y-6 relative z-10 px-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-black uppercase text-white/40 flex items-center gap-3 tracking-[0.3em]">
            <Layers className="w-5 h-5 text-[#d4af37]" /> الخدمات السينابتية المتاحة
          </h2>
        </div>
        
        <div className="grid gap-4">
          {APP_SERVICES.map((service, idx) => (
            <Link href={service.href} key={idx}>
              <div className="glass-turquoise p-6 rounded-[2.5rem] border border-white/5 hover:border-[#00ffff]/30 transition-all group flex items-center gap-6 shadow-xl">
                <div className={`p-4 rounded-2xl bg-white/5 ${service.color} group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-8 h-8" />
                </div>
                <div className="text-right flex-1">
                  <h3 className="text-xl font-black gold-gradient-text">{service.title}</h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">{service.merit}</p>
                  <p className="text-xs text-white/60 mt-2 font-diwani italic">{service.desc}</p>
                </div>
                <ChevronLeft className="w-6 h-6 text-white/10 group-hover:text-[#00ffff] transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <nav className="fixed bottom-6 left-6 right-6 h-24 glass-turquoise border border-white/10 flex items-center justify-around px-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 rounded-[3rem] backdrop-blur-3xl">
        <Link href="/" className="flex flex-col items-center gap-2 text-[#d4af37] scale-110">
          <Zap className="w-8 h-8 fill-current" />
          <span className="text-[10px] font-black uppercase tracking-widest font-diwani">النواة</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center gap-2 text-white/40 hover:text-[#00ffff] transition-all hover:scale-110">
          <Activity className="w-8 h-8" />
          <span className="text-[10px] font-black uppercase tracking-widest font-diwani">الاستدلال</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center gap-2 text-white/40 hover:text-[#00ffff] transition-all hover:scale-110">
          <History className="w-8 h-8" />
          <span className="text-[10px] font-black uppercase tracking-widest font-diwani">الأرشيف</span>
        </Link>
      </nav>
    </div>
  );
}