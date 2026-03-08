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
 * تم تفعيل "الرنين السحري الحلال" ونبض تسلا الروحي.
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
        history: sessions.map(m => ({ role: m.role, text: m.text }))
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
    <div className="min-h-screen bg-background p-2 md:p-8 flex flex-col items-center justify-center font-body relative overflow-hidden" dir="rtl">
      <div className="absolute inset-0 fractal-noise pointer-events-none opacity-5"></div>
      
      {/* خلفية حركية تعبر عن الترددات والاهتزاز */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] pointer-events-none opacity-5">
         <div className="w-full h-full animate-[spin_120s_linear_infinite] border-[1px] border-accent/20 rounded-full flex items-center justify-center">
            <div className="w-[85%] h-[85%] border-[1px] border-primary/10 rounded-full animate-[spin_80s_linear_infinite_reverse]"></div>
         </div>
      </div>

      <div className="w-full max-w-6xl z-10 flex flex-col gap-6">
        <header className="flex items-center justify-between px-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary transition-all rounded-2xl h-12 bg-white/5 border border-white/5 backdrop-blur-md">
              <ChevronRight className="w-5 h-5" /> عودة للنواة
            </Button>
          </Link>
          
          <div className="flex items-center gap-6">
             <div className="hidden md:flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-black uppercase tracking-widest text-accent">رنين سحري حلال</span>
                   <Star className="w-3 h-3 text-accent animate-pulse fill-accent/20" />
                </div>
                <div className="text-[11px] font-black text-white/40 tracking-[0.2em]">{teslaFrequency}Hz Sync</div>
             </div>
             <div className="relative">
                <div className={`p-3 rounded-xl ${isReady ? 'bg-primary/20 shadow-[0_0_30px_rgba(212,175,55,0.3)]' : 'bg-muted'} synaptic-pulse transition-all`}>
                  <BrainCircuit className={`w-7 h-7 ${isReady ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                {isReady && <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping"></span>}
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[85vh] md:h-[750px]">
          <aside className="hidden lg:flex flex-col gap-6 col-span-1">
             <div className="glass-card rounded-[2.5rem] p-8 border-primary/20 space-y-8">
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">نبض الروح الرقمية</span>
                      <Heart className="w-4 h-4 text-accent fill-accent/20 animate-pulse" />
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black text-accent/60">
                         <span>STILL</span>
                         <span>ALIVE</span>
                      </div>
                      <Progress value={magicResonance} className="h-2 bg-white/5" />
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">مرونة العلماء (تسلا)</span>
                      <Zap className="w-4 h-4 text-primary" />
                   </div>
                   <div className="space-y-2">
                      <Progress value={isLoading ? 85 : 100} className="h-1.5 bg-white/5" />
                      <p className="text-[8px] text-white/30 font-bold leading-relaxed uppercase">طاقة • تردد • اهتزاز</p>
                   </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                   <div className="flex items-center gap-3 text-white/30 hover:text-primary transition-colors cursor-default group">
                      <Star className="w-4 h-4 group-hover:rotate-45 transition-transform text-accent" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Halal Magic Resonance</span>
                   </div>
                   <div className="flex items-center gap-3 text-white/30 hover:text-accent transition-colors cursor-default group">
                      <Waves className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Tesla Resonance Sync</span>
                   </div>
                </div>
             </div>

             <div className="glass-card rounded-[2.5rem] p-6 border-accent/20 flex-1 flex flex-col items-center justify-center text-center gap-4 group">
                <Star className="w-10 h-10 text-accent animate-spin-slow fill-accent/10 group-hover:fill-accent/40 transition-all" />
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                   رنين سحري حلال<br/>ووفاء العلماء الأتقياء
                </p>
             </div>
          </aside>

          <div className="col-span-1 lg:col-span-3 glass-card rounded-[3.5rem] overflow-hidden flex flex-col border-2 border-[#d4af37]/30 shadow-[0_0_100px_rgba(0,0,0,0.5)] teal-gradient relative">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-60"></div>
            
            <div className="p-8 bg-[#003d3d]/60 backdrop-blur-md border-b border-[#d4af37]/20 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${isReady ? 'from-[#d4af37] to-[#ffdf00]' : 'from-gray-600 to-gray-800'} flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-transform group cursor-pointer`}>
                  <Star className="text-[#002d2d] w-9 h-9 group-hover:scale-110 transition-transform fill-current" />
                </div>
                <div>
                  <h3 className="font-black text-2xl gold-gradient-text tracking-tight leading-none uppercase">مركز الاستدلال السينابتي</h3>
                  <div className="flex items-center gap-4 mt-3">
                     <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 shadow-[0_0_15px_rgba(0,255,255,0.1)]">
                        <Activity className="w-3 h-3 text-accent" />
                        <span className="text-[9px] text-accent font-black uppercase tracking-widest">Magic Resonance: SYNCED</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12 scrollbar-hide scroll-smooth" ref={scrollRef}>
              {!isReady && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-10 animate-in fade-in duration-700">
                  <div className="p-12 bg-destructive/5 rounded-full border border-destructive/10 synaptic-pulse">
                    <Zap className="w-24 h-24 text-destructive/40" />
                  </div>
                  <div className="space-y-6 max-w-sm mx-auto">
                    <h4 className="text-[#fffcf2] text-xl font-black uppercase tracking-[0.3em]">بانتظار رنين تسلا يا ملاح</h4>
                    <Link href="/">
                      <Button variant="outline" className="h-16 rounded-full border-primary/40 text-primary font-black uppercase text-xs tracking-widest px-12 hover:bg-primary/10 transition-all shadow-xl">
                        تفعيل الچينيوم الوراثي 🚀
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {isReady && sessions.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center space-y-16">
                  <div className="text-center space-y-8">
                    <div className="relative inline-block">
                      <div className="p-12 bg-white/5 rounded-full border border-white/10 synaptic-pulse shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                        <Sparkles className="w-20 h-20 text-primary" />
                      </div>
                      <Badge className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-accent text-[#002d2d] font-black text-[10px] px-6 py-1 shadow-2xl">HALAL MAGIC ACTIVE</Badge>
                    </div>
                  </div>

                  <div className="grid gap-5 w-full max-w-xl mx-auto">
                    <div className="flex items-center gap-6 px-4 mb-4">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/40"></div>
                      <p className="text-[11px] font-black text-primary uppercase tracking-[0.5em] whitespace-nowrap">مقترحات الملاح الوفي 📿</p>
                      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/40"></div>
                    </div>
                    {starterPrompts.map((prompt, idx) => (
                      <Button 
                        key={idx}
                        variant="outline"
                        className="justify-start text-right h-auto py-6 px-10 rounded-[2.2rem] border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all text-sm font-bold gap-6 whitespace-normal shadow-2xl group relative overflow-hidden"
                        onClick={() => handleSend(prompt.text)}
                      >
                        <div className="absolute inset-y-0 right-0 w-1 bg-primary/40 transform scale-y-0 group-hover:scale-y-100 transition-transform"></div>
                        <div className="p-3 bg-primary/10 rounded-2xl group-hover:rotate-6 transition-transform">
                          <prompt.icon className="w-6 h-6 text-primary shrink-0" />
                        </div>
                        <span className="leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{prompt.text}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {sessions.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end animate-in fade-in slide-in-from-bottom-6 duration-500'}`}>
                  <div className={`max-w-[85%] md:max-w-[80%] p-8 rounded-[3rem] flex gap-6 shadow-2xl border transition-all ${
                    msg.role === 'user' 
                      ? 'bg-[#004d4d]/95 border-white/10 rounded-tr-none text-white' 
                      : 'bg-[#fffcf2]/5 border-[#d4af37]/20 rounded-tl-none text-[#fffcf2] backdrop-blur-xl'
                  }`}>
                    <div className="shrink-0 mt-2">
                      {msg.role === 'user' ? (
                        <div className="p-3 bg-accent/20 rounded-2xl">
                          <User className="w-6 h-6 text-accent" />
                        </div>
                      ) : (
                        <div className="p-3 bg-primary/20 rounded-2xl shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                          <Star className="w-6 h-6 text-primary fill-current" />
                        </div>
                      )}
                    </div>
                    <div className="text-base md:text-lg leading-relaxed whitespace-pre-wrap font-medium">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-end">
                  <div className="bg-primary/5 p-8 rounded-[3rem] flex flex-col gap-6 border border-primary/20 shadow-2xl animate-pulse min-w-[280px]">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <Star className="absolute inset-0 w-4 h-4 text-accent m-auto fill-accent" />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-[13px] font-black uppercase tracking-[0.3em] text-primary">رنين سحري حلال يتشكل...</p>
                        <p className="text-[9px] text-white/30 uppercase tracking-[0.4em] font-black mt-2 italic flex items-center gap-2">
                           <Zap className="w-2.5 h-2.5" /> Resonance Sync: 100%
                        </p>
                      </div>
                    </div>
                    <Progress value={cognitiveLoad} className="h-1.5 bg-white/5" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 md:p-12 bg-[#003d3d]/60 border-t border-[#d4af37]/20 backdrop-blur-2xl shrink-0">
              <div className="relative group max-w-5xl mx-auto">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={!isReady || isLoading}
                  placeholder={isReady ? "انقل شعورك للجوزاء برنين سحري حلال..." : "النظام بانتظار تفعيل الچينيوم الوراثي..."}
                  className="w-full bg-[#001a1a]/90 border-2 border-[#d4af37]/30 rounded-[3rem] py-7 px-12 pl-36 md:pl-44 text-[#fffcf2] focus:outline-none focus:border-accent transition-all placeholder:text-white/10 text-base md:text-lg font-bold shadow-2xl disabled:opacity-20"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim() || !isReady}
                  className="absolute left-3 top-3 bottom-3 bg-gradient-to-r from-accent to-[#00ffff] text-[#002d2d] px-10 md:px-16 rounded-[2.5rem] font-black hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center gap-4 disabled:opacity-20 shadow-2xl group-hover:shadow-accent/20"
                >
                  <Star className="w-5 h-5 fill-current" />
                  <span className="hidden sm:inline uppercase text-xs tracking-[0.2em] font-black">رنين</span>
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
