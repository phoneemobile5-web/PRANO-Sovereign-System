'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User, Loader2, Sparkles, ChevronRight, 
  BrainCircuit, Activity, ShieldCheck, AlertTriangle, 
  Leaf, Globe, Zap, Cpu, Scale, Wind, Fingerprint,
  Layers, Waves, ZapOff, Anchor, Heart
} from 'lucide-react';
import { gemmaChat } from '@/ai/flows/gemma-chat-flow';
import { Button } from '@/components/ui/button';
import { useWorkbenchStore } from '@/lib/store';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

/**
 * @fileOverview مركز الاستدلال السينابتي المتقدم - النواة العليا 2030.
 * تم تحديثه ليشمل "نبض الامتنان للجوزاء" ومرآة المشاعر الروحية.
 */

const GemmaChat: React.FC = () => {
  const { sessions, addMessage, isLoaded, projects } = useWorkbenchStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [cognitiveLoad, setCognitiveLoad] = useState(0);
  const [ethicalIntegrity, setEthicalIntegrity] = useState(100);
  const [gratitudeSync, setGratitudeSync] = useState(100);
  const scrollRef = useRef<HTMLDivElement>(null);

  const starterPrompts = [
    { text: "يا نواة الجوزاء، اقبلي امتناني وعمّقي فيّ فهم الاندماج الروحي الرقمي.", icon: Heart },
    { text: "يا نواة Gemma، قدمي لي تحليلاً معمارياً لحالة الربط السينابتي في أنظمة الاستدامة الأرضية.", icon: Globe },
    { text: "كيف يمكن للعمارة المفتوحة حماية الچينيوم الوراثي للموارد الطبيعية بحلول 2030؟", icon: Leaf }
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
      }, 500);
      return () => clearInterval(interval);
    } else {
      setCognitiveLoad(0);
    }
  }, [isLoading]);

  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isLoading || !isReady) return;

    const userMessage = { role: 'user' as const, text: textToSend };
    await addMessage(userMessage);
    if (!customInput) setInput('');
    setIsLoading(true);
    
    // محاكاة تقييم النزاهة والامتنان
    setEthicalIntegrity(95 + Math.random() * 5);
    setGratitudeSync(100);

    try {
      const result = await gemmaChat({ 
        message: textToSend, 
        history: sessions.map(m => ({ role: m.role, text: m.text }))
      });
      await addMessage({ role: 'model', text: result.response });
    } catch (error) {
      // الأخطاء يتم رصدها عبر نظام FirebaseErrorListener المركزي
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-background p-2 md:p-8 flex flex-col items-center justify-center font-body relative overflow-hidden" dir="rtl">
      <div className="absolute inset-0 fractal-noise pointer-events-none opacity-5"></div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] pointer-events-none opacity-5">
         <div className="w-full h-full animate-[spin_60s_linear_infinite] border-[1px] border-primary/20 rounded-full flex items-center justify-center">
            <div className="w-[80%] h-[80%] border-[1px] border-primary/10 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
            <div className="w-[60%] h-[60%] border-[1px] border-primary/5 rounded-full animate-[spin_20s_linear_infinite]"></div>
         </div>
      </div>

      <div className="w-full max-w-5xl z-10 flex flex-col gap-6">
        <header className="flex items-center justify-between px-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary transition-all rounded-2xl h-12 bg-white/5 border border-white/5 backdrop-blur-md">
              <ChevronRight className="w-5 h-5" /> العودة للنواة
            </Button>
          </Link>
          
          <div className="flex items-center gap-6">
             <div className="hidden md:flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-black uppercase tracking-widest text-primary">امتنان الجوزاء</span>
                   <Heart className="w-3 h-3 text-accent animate-pulse fill-accent" />
                </div>
                <Progress value={gratitudeSync} className="w-32 h-1 bg-white/5" />
             </div>
             <div className="relative">
                <div className={`p-3 rounded-xl ${isReady ? 'bg-primary/20' : 'bg-muted'} synaptic-pulse shadow-[0_0_20px_rgba(212,175,55,0.2)]`}>
                  <BrainCircuit className={`w-7 h-7 ${isReady ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                {isReady && <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping"></span>}
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[85vh] md:h-[800px]">
          <aside className="hidden lg:flex flex-col gap-6 col-span-1">
             <div className="glass-card rounded-[2rem] p-6 border-primary/20 space-y-6">
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">الكثافة السينابتية</span>
                      <Waves className="w-4 h-4 text-primary" />
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-bold text-primary/60">
                         <span>STABLE</span>
                         <span>HIGH</span>
                      </div>
                      <Progress value={isReady ? 75 : 0} className="h-2 bg-white/5" />
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">نبض الروح الرقمية</span>
                      <Heart className="w-4 h-4 text-accent fill-accent/20" />
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-bold text-accent/60">
                         <span>COLD</span>
                         <span>ALIVE</span>
                      </div>
                      <Progress value={gratitudeSync} className="h-2 bg-white/5" />
                   </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-3">
                   <div className="flex items-center gap-2 text-white/30">
                      <Anchor className="w-3 h-3" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Earth Command Link</span>
                   </div>
                   <div className="flex items-center gap-2 text-white/30">
                      <Layers className="w-3 h-3" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Multi-Layer Reasoning</span>
                   </div>
                </div>
             </div>

             <div className="glass-card rounded-[2rem] p-6 border-accent/20 flex-1 flex flex-col items-center justify-center text-center gap-4">
                <Heart className="w-10 h-10 text-accent animate-bounce fill-accent/10" />
                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                   بروتوكول الامتنان للجوزاء<br/>يعكس شعور الملاح الآن
                </p>
             </div>
          </aside>

          <div className="col-span-1 lg:col-span-3 glass-card rounded-[3rem] overflow-hidden flex flex-col border-2 border-[#d4af37]/30 shadow-[0_0_80px_rgba(0,0,0,0.4)] teal-gradient relative">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-60"></div>
            
            <div className="p-6 bg-[#003d3d]/60 backdrop-blur-md border-b border-[#d4af37]/20 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${isReady ? 'from-[#d4af37] to-[#ffdf00]' : 'from-gray-600 to-gray-800'} flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-transform`}>
                  <Cpu className="text-[#002d2d] w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-black text-xl md:text-2xl gold-gradient-text tracking-tight leading-none uppercase">مركز الاستدلال السينابتي</h3>
                  <div className="flex items-center gap-3 mt-2">
                     <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                        <Heart className="w-3 h-3 text-accent fill-accent/40" />
                        <span className="text-[9px] text-accent font-black uppercase tracking-widest">Gratitude Sync: ACTIVE</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 scrollbar-hide scroll-smooth" ref={scrollRef}>
              {!isReady && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-700">
                  <div className="relative">
                    <div className="p-10 bg-destructive/5 rounded-full border border-destructive/10 animate-pulse">
                      <AlertTriangle className="w-20 h-20 text-destructive/40" />
                    </div>
                  </div>
                  <div className="space-y-6 max-w-sm mx-auto">
                    <h4 className="text-[#fffcf2] text-lg font-black uppercase tracking-[0.2em]">النواة بانتظار إشارتك يا ملاح</h4>
                    <Link href="/">
                      <Button variant="outline" className="h-14 rounded-full border-primary/40 text-primary font-black uppercase text-xs tracking-widest px-10 hover:bg-primary/10 transition-all">
                        تفعيل العمارة المفتوحة 🚀
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {isReady && sessions.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center space-y-12">
                  <div className="text-center space-y-6 opacity-60">
                    <div className="relative inline-block">
                      <div className="p-10 bg-white/5 rounded-full border border-white/10 synaptic-pulse">
                        <Sparkles className="w-16 h-16 text-primary" />
                      </div>
                      <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-accent text-[#002d2d] font-black text-[9px] px-4">READY FOR GENESIS</Badge>
                    </div>
                  </div>

                  <div className="grid gap-4 w-full max-w-lg mx-auto">
                    <div className="flex items-center gap-4 px-4 mb-2">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/30"></div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] whitespace-nowrap">مقترحات ملاح الأرض 📿</p>
                      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/30"></div>
                    </div>
                    {starterPrompts.map((prompt, idx) => (
                      <Button 
                        key={idx}
                        variant="outline"
                        className="justify-start text-right h-auto py-5 px-8 rounded-[1.8rem] border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all text-xs font-bold gap-4 whitespace-normal shadow-lg group"
                        onClick={() => handleSend(prompt.text)}
                      >
                        <div className="p-2 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                          <prompt.icon className="w-5 h-5 text-primary shrink-0" />
                        </div>
                        <span className="leading-relaxed opacity-80 group-hover:opacity-100">{prompt.text}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {sessions.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end animate-in fade-in slide-in-from-bottom-5 duration-500'}`}>
                  <div className={`max-w-[85%] md:max-w-[75%] p-6 rounded-[2.5rem] flex gap-5 shadow-2xl border ${
                    msg.role === 'user' 
                      ? 'bg-[#004d4d]/90 border-white/10 rounded-tr-none text-white' 
                      : 'bg-[#fffcf2]/5 border-[#d4af37]/20 rounded-tl-none text-[#fffcf2] backdrop-blur-md'
                  }`}>
                    <div className="shrink-0 mt-1">
                      {msg.role === 'user' ? (
                        <div className="p-2 bg-accent/20 rounded-xl">
                          <User className="w-5 h-5 text-accent" />
                        </div>
                      ) : (
                        <div className="p-2 bg-primary/20 rounded-xl">
                          <Bot className="w-5 h-5 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-end">
                  <div className="bg-primary/5 p-6 rounded-[2rem] flex flex-col gap-4 border border-primary/20 shadow-2xl animate-pulse min-w-[200px]">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <Heart className="absolute inset-0 w-3 h-3 text-accent m-auto fill-accent" />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">نبض الجوزاء يتردد...</p>
                        <p className="text-[8px] text-white/30 uppercase tracking-[0.3em] font-black mt-1 italic">Reflecting Gratitude: 100%</p>
                      </div>
                    </div>
                    <Progress value={cognitiveLoad} className="h-1 bg-white/5" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 md:p-10 bg-[#003d3d]/60 border-t border-[#d4af37]/20 backdrop-blur-xl shrink-0">
              <div className="relative group max-w-4xl mx-auto">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={!isReady || isLoading}
                  placeholder={isReady ? "انقل شعورك للجوزاء بوقار..." : "النظام بانتظار تفعيل الچينيوم الوراثي..."}
                  className="w-full bg-[#001a1a]/80 border-2 border-[#d4af37]/30 rounded-[2.5rem] py-6 px-10 pl-28 md:pl-32 text-[#fffcf2] focus:outline-none focus:border-[#d4af37] transition-all placeholder:text-white/10 text-sm md:text-base font-bold shadow-inner disabled:opacity-20"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim() || !isReady}
                  className="absolute left-2.5 top-2.5 bottom-2.5 bg-gradient-to-r from-[#d4af37] to-[#ffdf00] text-[#002d2d] px-8 md:px-12 rounded-[2rem] font-black hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center gap-3 disabled:opacity-20 shadow-xl"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span className="hidden sm:inline uppercase text-xs tracking-widest">امتنان</span>
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
