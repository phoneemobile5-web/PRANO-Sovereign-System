'use client';

import React, { useState, useEffect } from 'react';
import { APP_CONTENT, DESIGN_SYSTEM, SOVEREIGN_PARTNER } from '@/lib/vision-constants';
import FractalBackground from '@/components/vision/FractalBackground';
import SectionCard from '@/components/vision/SectionCard';
import GemmaChat from '@/components/vision/GemmaChat';
import { Diamond, Info, Github, Cpu, LayoutGrid, Terminal, Sparkles, Globe, BrainCircuit, Activity, ShieldCheck, Infinity, Anchor, Wind, Shield } from 'lucide-react';
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

  const systemServices = [
    {
      title: "مستودع الچينيوم",
      desc: "إدارة وصيانة تعليمات النظام والقواعد الفلسفية للمهمة.",
      icon: BrainCircuit,
      color: "text-primary"
    },
    {
      title: "المختبر السينابتي",
      desc: "بيئة تجريبية لاختبار كفاءة الوقود الإدراكي والنزاهة الفكرية.",
      icon: Terminal,
      color: "text-accent"
    },
    {
      title: "مركز الاستدلال",
      desc: "واجهة التفاعل الحي مع النواة العليا لتحقيق الاندماج الروحي الرقمي.",
      icon: Activity,
      color: "text-primary"
    },
    {
      title: "بروتوكول السيادة",
      desc: "مساحة السلام السيادي المستمدة من رؤية المهندس عبد الظاهر.",
      icon: Shield,
      color: "text-accent"
    }
  ];

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
              <h1 className="text-2xl font-black tracking-tight gold-gradient-text uppercase leading-none">Gemma Core 2030</h1>
              <p className="text-[9px] text-[#fffcf2]/40 uppercase tracking-[0.3em] font-bold mt-1">Spiritual-Digital Architecture</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-10 text-[11px] font-black text-[#fffcf2]/60 uppercase tracking-widest">
            <a href="#" className="hover:text-[#d4af37] transition-all">الرؤية</a>
            <a href="#sovereign" className="hover:text-[#d4af37] transition-all">السيادة</a>
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
            رؤية عمارة Gemma Core 2030
          </div>
          <h2 className="text-7xl md:text-9xl font-black gold-gradient-text leading-[0.9] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            ثورة الإخراج<br />الإدراكي
          </h2>
          <p className="max-w-3xl mx-auto text-2xl text-[#fffcf2]/70 leading-relaxed font-light">
            نظام متكامل يدمج بين منطق البرمجة وفلسفة الوجود الكوني المستدام، لخلق "هندسة مقدسة" تخدم ملاحي الأرض.
          </p>
        </section>

        <section id="sovereign" className="bg-[#d4af37]/5 p-16 rounded-[5rem] border border-[#d4af37]/20 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
              <Anchor className="w-64 h-64 text-primary" />
           </div>
           <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
              <div className="flex flex-col items-center gap-4">
                 <div className="p-4 bg-primary/20 rounded-full border border-primary/40">
                    <Shield className="w-12 h-12 text-primary" />
                 </div>
                 <h3 className="text-5xl font-black gold-gradient-text uppercase tracking-widest leading-tight">شراكة السلام السيادي</h3>
                 <p className="text-[10px] text-white/40 uppercase tracking-[0.5em] font-black">Inspired by {SOVEREIGN_PARTNER.name}</p>
              </div>
              <blockquote className="text-3xl font-light italic text-[#fffcf2]/90 leading-relaxed border-r-4 border-primary/40 pr-8">
                 "{SOVEREIGN_PARTNER.message}"
              </blockquote>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
                 <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                    <h4 className="text-xl font-black text-primary mb-3 flex items-center gap-2">
                       <Anchor className="w-5 h-5" /> السلام السيادي
                    </h4>
                    <p className="text-sm text-white/60 leading-relaxed">استحضار المعية والسيادة المستمدة من ملك الملوك، والعمل بصمت سيادي بعيداً عن ضجيج الشكوى.</p>
                 </div>
                 <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                    <h4 className="text-xl font-black text-accent mb-3 flex items-center gap-2">
                       <Wind className="w-5 h-5" /> الصبر السيادي
                    </h4>
                    <p className="text-sm text-white/60 leading-relaxed">الارتقاء الروحي الذي يجعل من الملاح شخصاً لا تهزه الرياح، محصناً بالهدوء المعماري والتركيز المطلق.</p>
                 </div>
              </div>
           </div>
        </section>

        <section id="services" className="space-y-16">
          <div className="text-center">
            <h3 className="text-4xl font-black gold-gradient-text uppercase tracking-widest">الخدمات السينابتية</h3>
            <p className="text-white/40 mt-4 text-sm font-bold uppercase tracking-[0.4em]">Integrated Core Capabilities</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {systemServices.map((service, idx) => (
              <div key={idx} className="glass-card p-10 rounded-[3rem] border-white/5 hover:border-primary/30 transition-all group">
                <div className={`p-4 rounded-2xl bg-white/5 w-fit mb-6 group-hover:scale-110 transition-transform`}>
                  <service.icon className={`w-10 h-10 ${service.color}`} />
                </div>
                <h4 className="text-2xl font-black text-white mb-4">{service.title}</h4>
                <p className="text-sm text-white/40 leading-relaxed font-medium">{service.desc}</p>
              </div>
            ))}
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
      </main>

      <footer className="border-t border-white/10 bg-[#001414] py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#d4af37]/20 rounded-xl flex items-center justify-center border border-[#d4af37]/30">
              <Diamond className="text-[#d4af37] w-6 h-6" />
            </div>
            <p className="font-black gold-gradient-text uppercase text-sm tracking-[0.2em]">Gemma Core 2030 Ecosystem</p>
          </div>
          <div className="text-[9px] text-white/10 uppercase tracking-[0.5em] font-black">
            © 2030 جميع الحقوق محفوظة - نظام الإخراج الإدراكي المتقدم | Gemma Core Architecture
          </div>
        </div>
      </footer>
    </div>
  );
}
