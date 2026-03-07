
'use client';

import React, { useState, useEffect } from 'react';
import { APP_CONTENT, DESIGN_SYSTEM } from '@/lib/vision-constants';
import FractalBackground from '@/components/vision/FractalBackground';
import SectionCard from '@/components/vision/SectionCard';
import GemmaChat from '@/components/vision/GemmaChat';
import { Diamond, Info, Github, Cpu, LayoutGrid, Terminal, Sparkles, Globe } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function VisionPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen teal-gradient relative selection:bg-primary/40 selection:text-white" dir="rtl">
      <FractalBackground />

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-[#002d2d]/90 backdrop-blur-2xl border-b border-[#d4af37]/20 py-4 shadow-2xl' : 'bg-transparent py-8'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-tr from-[#d4af37] to-[#ffdf00] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)] group-hover:rotate-12 transition-transform duration-500">
              <Diamond className="text-[#002d2d] w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight gold-gradient-text uppercase leading-none">Gamma-Gemma 2026</h1>
              <p className="text-[9px] text-[#fffcf2]/40 uppercase tracking-[0.3em] font-bold mt-1">Cognitive Output Engine</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-10 text-[11px] font-black text-[#fffcf2]/60 uppercase tracking-widest">
            <a href="#" className="hover:text-[#d4af37] transition-all relative after:content-[''] after:absolute after:bottom-[-4px] after:right-0 after:w-0 after:h-[2px] after:bg-[#d4af37] hover:after:w-full after:transition-all">الرؤية</a>
            <a href="#" className="hover:text-[#d4af37] transition-all relative after:content-[''] after:absolute after:bottom-[-4px] after:right-0 after:w-0 after:h-[2px] after:bg-[#d4af37] hover:after:w-full after:transition-all">التقنيات</a>
            <a href="#" className="hover:text-[#d4af37] transition-all relative after:content-[''] after:absolute after:bottom-[-4px] after:right-0 after:w-0 after:h-[2px] after:bg-[#d4af37] hover:after:w-full after:transition-all">التكامل</a>
            <Link href="/">
              <Button className="bg-[#d4af37] hover:bg-[#ffdf00] text-[#002d2d] px-8 py-6 rounded-full font-black text-sm shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:scale-105 transition-all">
                دخول المنصة
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="pt-48 pb-32 px-6 max-w-7xl mx-auto space-y-32 relative z-10">
        <section className="text-center space-y-12">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-[10px] font-black uppercase tracking-[0.3em] mb-4 animate-bounce">
            <Sparkles className="w-4 h-4" />
            رؤية استراتيجية لعصر الذكاء الفائق
          </div>
          <h2 className="text-7xl md:text-9xl font-black gold-gradient-text leading-[0.9] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            ثورة الإخراج<br />الإدراكي
          </h2>
          <p className="max-w-3xl mx-auto text-2xl text-[#fffcf2]/70 leading-relaxed font-light">
            نظام متكامل يدمج بين القدرة التعبيرية لمنصات <span className="text-[#d4af37] font-bold">Gamma 2026</span> 
            والقوة التحليلية لنماذج <span className="text-[#d4af37] font-bold">Gemma 3</span>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 pt-12">
            <div className="flex items-center gap-4 px-8 py-6 glass-card rounded-3xl border-[#d4af37]/20 hover:scale-105 transition-all cursor-help">
              <Cpu className="w-8 h-8 text-[#d4af37]" />
              <div className="text-right">
                <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">الدقة البصرية</p>
                <p className="font-black text-[#d4af37] text-lg">{DESIGN_SYSTEM.resolution}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-8 py-6 glass-card rounded-3xl border-[#d4af37]/20 hover:scale-105 transition-all cursor-help">
              <LayoutGrid className="w-8 h-8 text-[#d4af37]" />
              <div className="text-right">
                <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">فلسفة التصميم</p>
                <p className="font-black text-[#d4af37] text-sm uppercase tracking-tighter">{DESIGN_SYSTEM.theme}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-8 py-6 glass-card rounded-3xl border-[#d4af37]/20 hover:scale-105 transition-all cursor-help">
              <Terminal className="w-8 h-8 text-[#d4af37]" />
              <div className="text-right">
                <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">اللغات المدعومة</p>
                <p className="font-black text-[#d4af37] text-lg">{DESIGN_SYSTEM.languages}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <SectionCard 
            title={APP_CONTENT.section1.title}
            analysis={APP_CONTENT.section1.technicalAnalysis}
            benefit={APP_CONTENT.section1.societalBenefit}
            icon={APP_CONTENT.section1.icon}
          />
          <SectionCard 
            title={APP_CONTENT.section2.title}
            analysis={APP_CONTENT.section2.technicalAnalysis}
            benefit={APP_CONTENT.section2.societalBenefit}
            icon={APP_CONTENT.section2.icon}
          />
          <SectionCard 
            title={APP_CONTENT.section3.title}
            analysis={APP_CONTENT.section3.technicalAnalysis}
            benefit={APP_CONTENT.section3.societalBenefit}
            icon={APP_CONTENT.section3.icon}
          />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-20 items-center bg-[#d4af37]/5 p-12 rounded-[4rem] border border-[#d4af37]/10 shadow-inner">
          <div className="space-y-10 order-2 xl:order-1">
            <div className="space-y-6">
              <h2 className="text-5xl font-black gold-gradient-text leading-tight">عمارة الذكاء المفتوح:<br />Gemma 3</h2>
              <p className="text-xl text-[#fffcf2]/80 leading-relaxed font-light">
                اكتشف كيف تساهم نماذج Transformer متعددة الوسائط في صياغة قرارات بصرية فورية. من خلال 
                تقنيات <span className="text-[#d4af37] font-bold">Fine-tuning</span> و <span className="text-[#d4af37] font-bold">LoRA</span>، 
                نضمن دقة صفرية الأخطاء في السياق الثقافي العربي.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-[#d4af37]/50 transition-all duration-500">
                <h4 className="text-[#d4af37] font-black mb-3 uppercase tracking-wider">الشبكات السينابتية</h4>
                <p className="text-sm text-white/50 font-medium leading-relaxed">محاكاة الترابطات العصبية للوصول لاستدلال منطقي فائق السرعة.</p>
              </div>
              <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-[#d4af37]/50 transition-all duration-500">
                <h4 className="text-[#d4af37] font-black mb-3 uppercase tracking-wider">الترابطات الكمية</h4>
                <p className="text-sm text-white/50 font-medium leading-relaxed">تكامل بيانات الـ Big Data وتحويلها لإخراج إدراكي متناسق.</p>
              </div>
            </div>

            <Button className="h-20 px-12 bg-transparent border-2 border-[#d4af37] text-[#d4af37] rounded-full font-black text-xl hover:bg-[#d4af37] hover:text-[#002d2d] transition-all group">
              تحميل المخطط التقني الكامل
              <Info className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
            </Button>
          </div>

          <div className="order-1 xl:order-2">
            <GemmaChat />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#001414] py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#d4af37]/20 rounded-xl flex items-center justify-center border border-[#d4af37]/30">
              <Diamond className="text-[#d4af37] w-6 h-6" />
            </div>
            <p className="font-black gold-gradient-text uppercase text-sm tracking-[0.2em]">Gamma 2026 Global Ecosystem</p>
          </div>
          
          <div className="flex items-center gap-12 text-white/30 text-[10px] font-black uppercase tracking-widest">
            <a href="#" className="hover:text-[#d4af37] transition-colors">الخصوصية</a>
            <a href="#" className="hover:text-[#d4af37] transition-colors">الأمن السيبراني</a>
            <a href="#" className="hover:text-[#d4af37] transition-colors">الوثائق التقنية</a>
          </div>

          <div className="flex items-center gap-6">
             <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-[#d4af37] cursor-pointer transition-all hover:scale-110">
                <Github className="w-6 h-6 text-white/40 group-hover:text-[#d4af37]" />
             </div>
             <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-[#d4af37] cursor-pointer transition-all hover:scale-110">
                <Globe className="w-6 h-6 text-white/40 group-hover:text-[#d4af37]" />
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-center text-[9px] text-white/10 uppercase tracking-[0.5em] font-black">
          © 2026 جميع الحقوق محفوظة - نظام الإخراج الإدراكي المتقدم | Gamma-Gemma Architecture
        </div>
      </footer>
    </div>
  );
}
