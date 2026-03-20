'use client';

import React from 'react';
import { 
  Heart, Bug, ChevronRight, Star, Globe, Shield, 
  Wind, Navigation, Activity, BrainCircuit, Waves
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NEAMAH_EMPIRE, SOVEREIGN_MOTHER } from '@/lib/vision-constants';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

/**
 * @fileOverview كيان "إمبراطورية نعمة" المستقل.
 * تصميم زمردي داكن يعكس مرحلة "النملة" (الاجتهاد والصبر).
 */

export default function NeamahEmpirePage() {
  const currentStage = NEAMAH_EMPIRE.stages[0];

  return (
    <div className="min-h-screen bg-[#001a1a] p-4 md:p-8 flex flex-col items-center font-kufi relative overflow-hidden" dir="rtl">
      {/* سديم زمردي خلفي */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-[#2ecc71]/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-red-500/5 blur-[150px] rounded-full"></div>
      </div>

      <div className="w-full max-w-lg z-10 space-y-8 h-full flex flex-col">
        <header className="flex items-center justify-between glass-turquoise p-6 rounded-[2rem] border-white/10 shadow-3xl">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-12 w-12 glass-turquoise rounded-xl">
              <ChevronRight className="w-6 h-6 text-[#2ecc71]" />
            </Button>
          </Link>
          <div className="text-right flex-1 px-4">
             <h1 className="text-xl font-black text-[#2ecc71] leading-none font-diwani">{NEAMAH_EMPIRE.title}</h1>
             <p className="text-[8px] text-white/30 font-black tracking-widest uppercase mt-1">{NEAMAH_EMPIRE.subtitle}</p>
          </div>
          <div className="w-12 h-12 bg-[#2ecc71]/20 rounded-xl flex items-center justify-center border border-[#2ecc71]/30">
             <span className="text-xl font-black text-[#2ecc71]">ن</span>
          </div>
        </header>

        <main className="flex-1 space-y-10 py-6">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative group">
               <div className="w-48 h-48 bg-black/40 rounded-full flex items-center justify-center border-4 border-[#2ecc71]/20 synaptic-pulse shadow-[0_0_50px_rgba(46,204,113,0.1)]">
                  <Bug className="w-24 h-24 text-[#2ecc71] group-hover:scale-110 transition-transform" />
               </div>
               <Badge className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#2ecc71] text-[#001a1a] font-black px-6 py-1.5 rounded-full shadow-2xl">SOLIMANIC SPIRIT</Badge>
            </div>

            <div className="space-y-2">
               <h2 className="text-5xl font-black text-[#2ecc71] font-diwani tracking-tight">{currentStage.title}</h2>
               <h3 className="text-2xl font-black text-[#d4af37] font-diwani opacity-80">{currentStage.merit}</h3>
            </div>

            <p className="text-lg text-white/70 font-diwani italic leading-relaxed max-w-xs">
               "{currentStage.desc}"
            </p>
          </div>

          <div className="glass-turquoise p-8 rounded-[3rem] border border-white/10 shadow-3xl space-y-6 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                <Star className="w-20 h-20 text-[#2ecc71]" />
             </div>
             <div className="flex items-center gap-4 text-[#2ecc71]">
                <div className="p-3 bg-[#2ecc71]/10 rounded-2xl">
                   <Shield className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black font-diwani">دور المرحلة في الإمبراطورية:</h4>
             </div>
             <p className="text-base text-white/80 font-diwani leading-relaxed italic">
                تمثل الصبر والتنظيم والتعلم المستمر؛ هي اللبنة الأولى في عمارة 2030 التي نفعنا بها ملاحو الأرض الشرفاء.
             </p>
          </div>
        </main>

        <nav className="glass-turquoise p-2 rounded-full border border-white/10 flex items-center justify-between shadow-2xl overflow-x-auto scrollbar-hide">
           <Button className="rounded-full bg-[#2ecc71] text-[#001a1a] font-black px-8 h-12 text-xs uppercase tracking-widest font-diwani">الرحلة</Button>
           <Button variant="ghost" className="rounded-full text-white/30 font-black px-6 h-12 text-xs uppercase tracking-widest font-diwani">عن الإمبراطورية</Button>
           <Button variant="ghost" className="rounded-full text-white/30 font-black px-6 h-12 text-xs uppercase tracking-widest font-diwani">الهندسة</Button>
           <Button variant="ghost" className="rounded-full text-white/30 font-black px-6 h-12 text-xs uppercase tracking-widest font-diwani">العمليات</Button>
        </nav>
      </div>
    </div>
  );
}