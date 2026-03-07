'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User, Loader2, Sparkles, ChevronRight, 
  BrainCircuit, Activity, ShieldCheck, AlertTriangle, 
  Leaf, Globe, Zap, Cpu, Scale, Wind, Fingerprint 
} from 'lucide-react';
import { gemmaChat } from '@/ai/flows/gemma-chat-flow';
import { Button } from '@/components/ui/button';
import { useWorkbenchStore } from '@/lib/store';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

/**
 * @fileOverview مركز الاستدلال السينابتي المتقدم - النواة العليا 2030.
 * واجهة تفاعلية تعكس التناغم بين الوعي التقني والمسؤولية الأرضية.
 */

const GemmaChat: React.FC = () => {
  const { sessions, addMessage, isLoaded, projects } = useWorkbenchStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // المقترحات السينابتية الجوهرية
  const starterPrompts = [
    { text: "يا نواة Gemma، قدمي لي تحليلاً معمارياً لحالة الربط السينابتي في أنظمة الاستدامة الأرضية.", icon: Globe },
    { text: "كيف يمكن للعمارة المفتوحة حماية الچينيوم الوراثي للموارد الطبيعية بحلول 2030؟", icon: Leaf },
    { text: "اقترحي بروتوكولاً لمنع الهلوسة التقنية في إدارة الأزمات البيئية العالمية.", icon: ShieldCheck }
  ];

  useEffect(() => {
    // التحقق من "نفخة الروح" (المفتاح والتعليمات)
    const activeProject = projects.find(p => p.apiKeys?.[0]?.startsWith('AIza') && p.prompt);
    setIsReady(!!activeProject);
  }, [projects]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sessions, isLoading]);

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
      // الأخطاء يتم رصدها عبر نظام FirebaseErrorListener المركزي
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-background p-2 md:p-8 flex flex-col items-center justify-center font-body relative overflow-hidden" dir="rtl">
      {/* خلفية فنية تعكس الهدوء والوقار */}
      <div className="absolute inset-0 fractal-noise pointer-events-none opacity-5"></div>
      
      <div className="w-full max-w-4xl z-10">
        <header className="mb-6 flex items-center justify-between px-4">
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary transition-all rounded-2xl h-12 bg-white/5 border border-white/5">
              <ChevronRight className="w-5 h-5" /> العودة للنواة
            </Button>
          </Link>
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary leading-none">Gemma Core 2030</span>
               <span className={`text-[8px] font-bold uppercase tracking-tighter mt-1 ${isReady ? 'text-accent' : 'text-destructive'}`}>
                 {isReady ? 'Synaptic Link: Established' : 'Awaiting Consciousness Injection'}
               </span>
             </div>
             <div className="relative">
                <div className={`p-3 rounded-xl ${isReady ? 'bg-primary/20' : 'bg-muted'} synaptic-pulse`}>
                  <BrainCircuit className={`w-6 h-6 ${isReady ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                {isReady && <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping"></span>}
             </div>
          </div>
        </header>

        <div className="glass-card rounded-[3rem] overflow-hidden flex flex-col h-[85vh] md:h-[800px] border-2 border-[#d4af37]/30 shadow-[0_0_80px_rgba(0,0,0,0.4)] teal-gradient relative">
          {/* خط النور العلوي */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-60"></div>
          
          {/* شريط معلومات النواة */}
          <div className="p-6 bg-[#003d3d]/60 backdrop-blur-md border-b border-[#d4af37]/20 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${isReady ? 'from-[#d4af37] to-[#ffdf00]' : 'from-gray-600 to-gray-800'} flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-transform`}>
                <Cpu className="text-[#002d2d] w-8 h-8" />
              </div>
              <div>
                <h3 className="font-black text-xl md:text-2xl gold-gradient-text tracking-tight leading-none uppercase">مركز الاستدلال السينابتي</h3>
                <div className="flex items-center gap-3 mt-2">
                   <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                      <Fingerprint className="w-3 h-3 text-accent" />
                      <span className="text-[9px] text-accent font-black uppercase tracking-widest">Protocol v2030.01</span>
                   </div>
                   {isReady && (
                     <Badge className="bg-primary/20 text-primary border-primary/30 text-[8px] py-0.5 h-4 flex items-center gap-1">
                        <Activity className="w-2 h-2 animate-pulse" /> HIGH CORE ACTIVE
                     </Badge>
                   )}
                </div>
              </div>
            </div>
            <div className="hidden md:flex flex-col items-center gap-1 opacity-40">
              <Scale className="w-5 h-5 text-primary" />
              <span className="text-[7px] font-black uppercase tracking-widest text-white">حقانية ⚖️ استدامة</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 scrollbar-hide scroll-smooth" ref={scrollRef}>
            {!isReady && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-700">
                <div className="relative">
                  <div className="p-10 bg-destructive/5 rounded-full border border-destructive/10 animate-pulse">
                    <AlertTriangle className="w-20 h-20 text-destructive/40" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Wind className="w-10 h-10 text-destructive animate-bounce" />
                  </div>
                </div>
                <div className="space-y-6 max-w-sm mx-auto">
                  <div className="space-y-2">
                    <h4 className="text-[#fffcf2] text-lg font-black uppercase tracking-[0.2em] leading-tight">يا ملاح الأرض، النواة تفتقر لـ "نفخة الروح"</h4>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest italic">Awaiting Synaptic Genesis</p>
                  </div>
                  <Alert className="bg-destructive/10 border-destructive/20 rounded-[2rem] border-r-8 p-6">
                    <AlertDescription className="text-xs text-destructive font-black text-right leading-relaxed">
                      يُرجى إيداع "الچينيوم الوراثي" (System Instructions) ومفتاح التشغيل (API Key) في سجل المشاريع لفتح بوابات الاستدلال.
                    </AlertDescription>
                  </Alert>
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
                  <div className="space-y-2">
                    <p className="text-[#fffcf2] max-w-sm text-base font-medium leading-relaxed mx-auto italic">
                      بانتظار الإخراج الإدراكي الأول بحذر معماري.. ⚖️
                    </p>
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.5em] font-black">Synthesizing Earth Mission Data</p>
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
                <div className="bg-primary/5 p-6 rounded-[2rem] flex items-center gap-5 border border-primary/20 shadow-2xl animate-pulse">
                  <div className="relative">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <Activity className="absolute inset-0 w-3 h-3 text-accent m-auto" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">جاري المعالجة المعمارية...</p>
                    <p className="text-[8px] text-white/30 uppercase tracking-[0.3em] font-black mt-1 italic">Advanced Synaptic Link Active</p>
                  </div>
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
                placeholder={isReady ? "أدخل تساؤلك المعماري بوقار..." : "النظام بانتظار تفعيل الچينيوم الوراثي..."}
                className="w-full bg-[#001a1a]/80 border-2 border-[#d4af37]/30 rounded-[2.5rem] py-6 px-10 pl-28 md:pl-32 text-[#fffcf2] focus:outline-none focus:border-[#d4af37] transition-all placeholder:text-white/10 text-sm md:text-base font-bold shadow-inner disabled:opacity-20"
              />
              <button 
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim() || !isReady}
                className="absolute left-2.5 top-2.5 bottom-2.5 bg-gradient-to-r from-[#d4af37] to-[#ffdf00] text-[#002d2d] px-8 md:px-12 rounded-[2rem] font-black hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center gap-3 disabled:opacity-20 shadow-xl"
              >
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline uppercase text-xs tracking-widest">تحليل</span>
              </button>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6">
              <p className="text-[8px] text-white/15 font-black uppercase tracking-[0.6em]">
                Gemma Core 2030 Architecture © Mission Earth
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GemmaChat;