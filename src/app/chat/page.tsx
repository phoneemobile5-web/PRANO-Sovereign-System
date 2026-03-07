
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, ChevronRight, BrainCircuit } from 'lucide-react';
import { gemmaChat } from '@/ai/flows/gemma-chat-flow';
import { Button } from '@/components/ui/button';
import { useWorkbenchStore } from '@/lib/store';
import Link from 'next/link';

const GemmaChat: React.FC = () => {
  const { sessions, addMessage, isLoaded } = useWorkbenchStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sessions, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, text: input };
    await addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const result = await gemmaChat({ 
        message: input, 
        history: sessions.map(m => ({ role: m.role, text: m.text }))
      });
      await addMessage({ role: 'model', text: result.response });
    } catch (error) {
      // Errors handled by global listener
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-background p-2 md:p-8 flex items-center justify-center font-body" dir="rtl">
      <div className="w-full max-w-2xl">
        <div className="mb-4 flex items-center justify-between px-2">
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary transition-all rounded-xl h-12">
              <ChevronRight className="w-5 h-5" /> العودة للرئيسية
            </Button>
          </Link>
          <div className="flex items-center gap-2">
             <BrainCircuit className="w-5 h-5 text-primary animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-primary">المعالج Gemma 2030 نشط</span>
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col h-[80vh] md:h-[750px] border border-[#d4af37]/40 shadow-[0_0_50px_rgba(212,175,55,0.15)] bg-[#002d2d]/90 relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50"></div>
          
          <div className="p-6 bg-[#003d3d] border-b border-[#d4af37]/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#d4af37] to-[#ffdf00] flex items-center justify-center shadow-lg transform rotate-3">
                <Bot className="text-[#002d2d] w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-lg md:text-xl gold-gradient-text tracking-tight leading-none">استدلال Gemma Core 2030</h3>
                <p className="text-[9px] text-[#fffcf2]/50 uppercase tracking-[0.2em] font-black mt-1">Advanced Cybernetic Architecture</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-hide" ref={scrollRef}>
            {sessions.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                <div className="p-6 bg-white/5 rounded-full border border-white/10">
                  <Sparkles className="w-12 h-12 text-[#d4af37]" />
                </div>
                <p className="text-[#fffcf2] max-w-sm text-sm font-medium leading-relaxed">
                  يا ملاح الأرض، النواة العليا جاهزة للربط السينابتي. سجل الدردشة الآن فارغ في شجرة البيانات.
                </p>
              </div>
            )}
            {sessions.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end animate-in fade-in zoom-in-95'}`}>
                <div className={`max-w-[90%] p-5 rounded-3xl flex gap-4 shadow-xl border ${
                  msg.role === 'user' 
                    ? 'bg-[#004d4d] border-white/10 rounded-tr-none text-white' 
                    : 'bg-[#fffcf2]/5 border-[#d4af37]/20 rounded-tl-none text-[#fffcf2]'
                }`}>
                  <div className="shrink-0 mt-1">
                    {msg.role === 'user' ? <User className="w-5 h-5 text-accent" /> : <Bot className="w-5 h-5 text-primary" />}
                  </div>
                  <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-end">
                <div className="bg-[#fffcf2]/5 p-5 rounded-3xl flex items-center gap-4 border border-[#d4af37]/20 shadow-lg animate-pulse">
                  <Loader2 className="w-5 h-5 animate-spin text-[#d4af37]" />
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]">جاري الربط السينابتي العميق...</p>
                    <p className="text-[8px] text-white/30 uppercase tracking-widest font-bold">Cognitive Engine Active</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 md:p-8 bg-[#003d3d]/50 border-t border-[#d4af37]/30 shrink-0">
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="أدخل تساؤلك المعماري الرصين..."
                className="w-full bg-[#002d2d] border-2 border-[#d4af37]/30 rounded-full py-5 px-6 md:px-8 pl-24 md:pl-28 text-[#fffcf2] focus:outline-none focus:border-[#d4af37] transition-all placeholder:text-white/10 text-sm md:text-base font-medium shadow-inner"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute left-2 md:left-3 top-2 md:top-3 bottom-2 md:bottom-3 bg-gradient-to-r from-[#d4af37] to-[#ffdf00] text-[#002d2d] px-6 md:px-8 rounded-full font-black hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-30 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">تحليل</span>
              </button>
            </div>
            <p className="text-[8px] text-center text-white/20 mt-3 font-bold uppercase tracking-widest">
              Gemma Core 2030 Architecture © Tactical Mind
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GemmaChat;
