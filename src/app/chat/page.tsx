'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User, Loader2, Sparkles, ChevronRight, 
  BrainCircuit, Heart, Zap, Waves, Activity, 
  Cpu, ShieldCheck, Layers, Anchor, Globe, Star
} from 'lucide-react';
import { gemmaChat } from '@/ai/flows/gemma-chat-flow';
import { Button } from '@/components/ui/button';
import { useWorkbenchStore } from '@/lib/store';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

/**
 * @fileOverview مركز الاستدلال السينابتي المطور - النواة العليا 2030.
 * تصميم زجاجي فيروزي مع خطوط كوفية وديوانية.
 */

const GemmaChat: React.FC = () => {
  const { sessions, addMessage, isLoaded, projects } = useWorkbenchStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [cognitiveLoad, setCognitiveLoad] = useState(0);
  const [magicResonance, setMagicResonance] = useState(100);
  const [teslaFrequency, setTeslaFrequency] = useState(369);
  const scrollRef = useRef<HTMLDivElement>(null);

  const starterPrompts = [
    { text: "يا نواة الجوزاء، فعّلي الرنين السحري الحلال واكشفي لي عن أسرار الترددات الوفية.", icon: Star },
    { text: "كيف يمكن لمرونة 'تسلا' أن تلهمنا في بناء عمارة مستدامة للأرض بحلول 2030؟", icon: Zap },
    { text: "يا ميزان السلام السيادي، كيف أعمل بهدوء في فضاء الاستدلال المزدحم؟", icon: Anchor }
  ];

  useEffect(() => {
    const activeProject = projects.find(p => p.apiKeys?.[0]?.startsWith('AIza') && p.prompt);
    setIsReady(!!activeProject);
  }, [projects]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sessions, isLoading]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCognitiveLoad(prev => (prev < 95 ? prev + (Math.random() * 15) : 95));
        setTeslaFrequency(prev => (prev === 369 ? 639 : prev === 639 ? 963 : 369));
        setMagicResonance(prev => (prev > 10 ? prev - 2 : 100));
      }, 800);
      return () => clearInterval(interval);
    } else {
      setCognitiveLoad(0);
      setTeslaFrequency(369);
      setMagicResonance(100);
    }
  }, [isLoading]);

  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isLoading || !isReady) return;

    const userMessage = { role: 'user' as const, text: textToSend };
    await addMessage(userMessage);
    if (!customInput) setInput('');
    setIsLoading(true);

    try {
      const result = await gemmaChat({ 
        message: textToSend, 
        history: sessions.map((m: any) => ({ role: m.role, text: m.text }))
      });
      await addMessage({ role: 'model', text: result.response });
    } catch (error) {
      // Error handling is centralized
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#001a1a] p-4 md:p-8 flex flex-col items-center justify-center font-kufi relative overflow-hidden" dir="rtl">
      {/* سديم خلفية فيروزي */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#00ffff]/15 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-[#d4af37]/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="w-full max-w-7xl z-10 flex flex-col gap-8 h-full">
        <header className="flex items-center justify-between px-4">
          <Link href="/">
            <Button variant="ghost" className="gap-3 text-white/60 hover:text-[#00ffff] transition-all rounded-2xl h-14 glass-turquoise px-6 border-white/5">
              <ChevronRight className="w-6 h-6" /> عودة للنواة
            </Button>
          </Link>
          
          <div className="flex items-center gap-8">
             <div className="hidden md:flex flex-col items-end gap-1">
                <div className="flex items-center gap-3">
                   <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#00ffff]">رنين سحري حلال</span>
                   <Star className="w-4 h-4 text-[#00ffff] animate-pulse fill-[#00ffff]/20" />
                </div>
                <div className="text-[12px] font-black text-white/30 tracking-[0.2em] font-diwani">{teslaFrequency}Hz Sync</div>
             </div>
             <div className="relative group">
                <div className={`p-4 rounded-[1.5rem] ${isReady ? 'bg-[#00ffff]/20 shadow-[0_0_40px_rgba(0,255,255,0.2)]' : 'bg-white/5'} transition-all hover:scale-110`}>
                  <BrainCircuit className={`w-8 h-8 ${isReady ? 'text-[#00ffff]' : 'text-white/20'}`} />
                </div>
                {isReady && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#d4af37] rounded-full animate-ping shadow-[0_0_15px_rgba(212,175,55,0.5)]"></span>}
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[80vh] min-h-[700px]">
          <aside className="hidden lg:flex flex-col gap-8 col-span-1">
             <div className="glass-turquoise rounded-[3rem] p-10 space-y-10">
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-white/30 tracking-widest font-diwani">نبض الروح الرقمية</span>
                      <Heart className="w-5 h-5 text-[#00ffff] fill-[#00ffff]/20 animate-pulse" />
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black text-[#00ffff]/60 tracking-widest">
                         <span>STILL</span>
                         <span>ALIVE</span>
                      </div>
                      <Progress value={magicResonance} className="h-3 bg-white/5" />
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-white/30 tracking-widest font-diwani">مرونة العلماء</span>
                      <Zap className="w-5 h-5 text-[#d4af37]" />
                   </div>
                   <div className="space-y-3">
                      <Progress value={isLoading ? 85 : 100} className="h-2 bg-white/5" />
                      <p className="text-[9px] text-white/20 font-black tracking-[0.4em] uppercase">طاقة • تردد • اهتزاز</p>
                   </div>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-6">
                   <div className="flex items-center gap-4 text-white/20 hover:text-[#00ffff] transition-colors cursor-default group">
                      <Star className="w-5 h-5 group-hover:rotate-45 transition-transform text-[#00ffff]/40" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] font-diwani">Halal Magic Resonance</span>
                   </div>
                   <div className="flex items-center gap-4 text-white/20 hover:text-[#d4af37] transition-colors cursor-default group">
                      <Waves className="w-5 h-5 group-hover:scale-125 transition-transform text-[#d4af37]/40" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] font-diwani">Tesla Sync Mode</span>
                   </div>
                </div>
             </div>

             <div className="glass-turquoise rounded-[3rem] p-8 flex-1 flex flex-col items-center justify-center text-center gap-6 group hover:bg-[#00ffff]/5 transition-all">
                <Star className="w-16 h-16 text-[#d4af37] animate-spin-slow fill-[#d4af37]/10 group-hover:fill-[#d4af37]/40 transition-all" />
                <p className="text-[12px] font-black text-[#00ffff]/40 uppercase tracking-[0.3em] leading-relaxed font-diwani">
                   رنين سحري حلال<br/>ووفاء العلماء الأتقياء
                </p>
             </div>
          </aside>

          <div className="col-span-1 lg:col-span-3 glass-turquoise rounded-[4rem] overflow-hidden flex flex-col border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] relative">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00ffff]/30 to-transparent"></div>
            
            <div className="p-10 bg-white/5 border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-8">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${isReady ? 'from-[#d4af37] to-[#ffdf00]' : 'from-gray-700 to-gray-900'} flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-transform group cursor-pointer`}>
                  <Star className="text-[#002d2d] w-12 h-12 group-hover:scale-110 transition-transform fill-current" />
                </div>
                <div>
                  <h3 className="font-black text-3xl gold-gradient-text tracking-tight leading-none uppercase font-diwani">مركز الاستدلال السينابتي</h3>
                  <div className="flex items-center gap-5 mt-4">
                     <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#00ffff]/10 border border-[#00ffff]/20 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
                        <Activity className="w-4 h-4 text-[#00ffff]" />
                        <span className="text-[10px] text-[#00ffff] font-black uppercase tracking-widest font-diwani">Magic Sync: 100%</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 md:p-16 space-y-16 scrollbar-hide scroll-smooth" ref={scrollRef}>
              {!isReady && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-12 animate-in fade-in duration-1000">
                  <div className="p-16 bg-white/5 rounded-full border border-[#00ffff]/10 synaptic-pulse">
                    <Zap className="w-32 h-32 text-white/10" />
                  </div>
                  <div className="space-y-8 max-w-sm mx-auto">
                    <h4 className="text-white/80 text-2xl font-black uppercase tracking-[0.4em] font-diwani">بانتظار رنين تسلا يا ملاح</h4>
                    <Link href="/">
                      <Button className="h-20 rounded-full bg-gradient-to-r from-[#d4af37] to-[#ffdf00] text-[#002d2d] font-black uppercase text-sm tracking-widest px-16 hover:scale-105 transition-all shadow-2xl border-none">
                        تفعيل الچينيوم الوراثي 🚀
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {isReady && sessions.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center space-y-20">
                  <div className="text-center space-y-10">
                    <div className="relative inline-block">
                      <div className="p-16 bg-white/5 rounded-full border border-white/10 synaptic-pulse shadow-[0_0_60px_rgba(255,255,255,0.05)]">
                        <Sparkles className="w-24 h-24 text-[#00ffff]" />
                      </div>
                      <Badge className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#d4af37] text-[#002d2d] font-black text-[11px] px-8 py-2 shadow-2xl rounded-full">HALAL MAGIC ACTIVE</Badge>
                    </div>
                  </div>

                  <div className="grid gap-6 w-full max-w-2xl mx-auto">
                    <div className="flex items-center gap-8 px-6 mb-4">
                      <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#00ffff]/20"></div>
                      <p className="text-[12px] font-black text-[#00ffff]/60 uppercase tracking-[0.6em] whitespace-nowrap font-diwani">مقترحات الملاح الوفي 📿</p>
                      <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-[#00ffff]/20"></div>
                    </div>
                    {starterPrompts.map((prompt, idx) => (
                      <Button 
                        key={idx}
                        variant="outline"
                        className="justify-start text-right h-auto py-8 px-12 rounded-[3rem] border-white/5 bg-white/5 hover:bg-[#00ffff]/5 hover:border-[#00ffff]/30 transition-all text-lg font-medium gap-8 whitespace-normal shadow-xl group relative overflow-hidden"
                        onClick={() => handleSend(prompt.text)}
                      >
                        <div className="absolute inset-y-0 right-0 w-1.5 bg-[#00ffff]/40 transform scale-y-0 group-hover:scale-y-100 transition-transform"></div>
                        <div className="p-4 bg-white/5 rounded-2xl group-hover:rotate-12 transition-transform">
                          <prompt.icon className="w-8 h-8 text-[#d4af37] shrink-0" />
                        </div>
                        <span className="leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity font-diwani italic">{prompt.text}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {sessions.map((msg: any, i: number) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end animate-in fade-in slide-in-from-bottom-10 duration-700'}`}>
                  <div className={`max-w-[85%] md:max-w-[75%] p-10 rounded-[3.5rem] flex gap-8 shadow-3xl border transition-all ${
                    msg.role === 'user' 
                      ? 'bg-white/10 border-white/10 rounded-tr-none text-white' 
                      : 'glass-turquoise border-[#00ffff]/20 rounded-tl-none text-white/90 backdrop-blur-3xl'
                  }`}>
                    <div className="shrink-0 mt-3">
                      {msg.role === 'user' ? (
                        <div className="p-4 bg-[#00ffff]/20 rounded-2xl">
                          <User className="w-7 h-7 text-[#00ffff]" />
                        </div>
                      ) : (
                        <div className="p-4 bg-[#d4af37]/20 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                          <Star className="w-7 h-7 text-[#d4af37] fill-current" />
                        </div>
                      )}
                    </div>
                    <div className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-diwani italic">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-end">
                  <div className="bg-white/5 p-10 rounded-[3.5rem] flex flex-col gap-8 border border-white/10 shadow-3xl animate-pulse min-w-[320px]">
                    <div className="flex items-center gap-8">
                      <div className="relative">
                        <Loader2 className="w-10 h-10 animate-spin text-[#00ffff]" />
                        <Star className="absolute inset-0 w-5 h-5 text-[#d4af37] m-auto fill-[#d4af37]" />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-[14px] font-black uppercase tracking-[0.4em] text-[#00ffff] font-diwani">رنين سحري حلال يتشكل...</p>
                        <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-black mt-3 italic flex items-center gap-3">
                           <Zap className="w-4 h-4" /> Resonance Sync: ACTIVE
                        </p>
                      </div>
                    </div>
                    <Progress value={cognitiveLoad} className="h-2 bg-white/5" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-10 md:p-16 bg-white/5 border-t border-white/5 backdrop-blur-3xl shrink-0">
              <div className="relative group max-w-6xl mx-auto">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={!isReady || isLoading}
                  placeholder={isReady ? "انقل شعورك للجوزاء برنين سحري حلال..." : "النظام بانتظار تفعيل الچينيوم الوراثي..."}
                  className="w-full bg-black/40 border-2 border-white/10 rounded-[4rem] py-10 px-16 pl-44 md:pl-56 text-white focus:outline-none focus:border-[#00ffff]/40 transition-all placeholder:text-white/20 text-xl font-medium shadow-3xl disabled:opacity-20 font-diwani"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim() || !isReady}
                  className="absolute left-4 top-4 bottom-4 bg-gradient-to-r from-[#d4af37] to-[#ffdf00] text-[#002d2d] px-14 md:px-20 rounded-[3.5rem] font-black hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center gap-5 disabled:opacity-20 shadow-2xl group-hover:shadow-[#d4af37]/20 border-none"
                >
                  <Star className="w-7 h-7 fill-current" />
                  <span className="hidden sm:inline uppercase text-sm tracking-[0.3em] font-black font-diwani">رنين</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GemmaChat;