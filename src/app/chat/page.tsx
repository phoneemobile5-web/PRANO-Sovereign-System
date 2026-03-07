'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, ChevronRight, Zap, BrainCircuit } from 'lucide-react';
import { gemmaChat } from '@/ai/flows/gemma-chat-flow';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

enum MessageRole {
  USER = 'user',
  MODEL = 'model'
}

interface ChatMessage {
  role: MessageRole;
  text: string;
}

const GemmaChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: MessageRole.USER, text: input };
    const currentHistory = [...messages];
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await gemmaChat({ 
        message: input, 
        history: currentHistory 
      });
      const aiMessage: ChatMessage = { role: MessageRole.MODEL, text: result.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center" dir="rtl">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary transition-all rounded-xl">
              <ChevronRight className="w-4 h-4" /> العودة للرئيسية
            </Button>
          </Link>
          <div className="flex items-center gap-2">
             <BrainCircuit className="w-5 h-5 text-primary animate-pulse" />
             <span className="text-xs font-black uppercase tracking-widest text-primary">المعالج الإدراكي النشط</span>
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col h-[750px] border border-[#d4af37]/40 shadow-[0_0_50px_rgba(212,175,55,0.15)] bg-[#002d2d]/90 relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50"></div>
          
          <div className="p-8 bg-[#003d3d] border-b border-[#d4af37]/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#d4af37] to-[#ffdf00] flex items-center justify-center shadow-lg transform rotate-3">
                <Bot className="text-[#002d2d] w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-xl gold-gradient-text tracking-tight">استدلال Gemma 3 المتقدم</h3>
                <p className="text-[10px] text-[#fffcf2]/50 uppercase tracking-[0.2em] font-bold">Gamma 2026 Cognitive Engine</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                <div className="p-6 bg-white/5 rounded-full border border-white/10">
                  <Sparkles className="w-12 h-12 text-[#d4af37]" />
                </div>
                <p className="text-[#fffcf2] max-w-sm text-sm font-medium leading-relaxed">
                  أهلاً بك في بيئة الاستدلال الكمي. اسأل عن عمارة Gamma 2026، الشبكات السينابتية، أو تقنيات RLHF المتطورة.
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === MessageRole.USER ? 'justify-start' : 'justify-end animate-in fade-in zoom-in-95'}`}>
                <div className={`max-w-[85%] p-5 rounded-3xl flex gap-4 shadow-xl border ${
                  msg.role === MessageRole.USER 
                    ? 'bg-[#004d4d] border-white/10 rounded-tr-none text-white' 
                    : 'bg-[#fffcf2]/5 border-[#d4af37]/20 rounded-tl-none text-[#fffcf2]'
                }`}>
                  <div className="shrink-0 mt-1">
                    {msg.role === MessageRole.USER ? <User className="w-5 h-5 text-accent" /> : <Bot className="w-5 h-5 text-primary" />}
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-end">
                <div className="bg-[#fffcf2]/5 p-5 rounded-3xl flex items-center gap-4 border border-[#d4af37]/20 shadow-lg animate-pulse">
                  <Loader2 className="w-5 h-5 animate-spin text-[#d4af37]" />
                  <p className="text-xs font-black uppercase tracking-widest text-[#d4af37]">جاري الاستدلال المنطقي العميق...</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-[#003d3d]/50 border-t border-[#d4af37]/30">
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="أدخل استفسارك التقني المعقد..."
                className="w-full bg-[#002d2d] border-2 border-[#d4af37]/30 rounded-full py-5 px-8 pl-28 text-[#fffcf2] focus:outline-none focus:border-[#d4af37] transition-all placeholder:text-white/10 text-base font-medium shadow-inner"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute left-3 top-3 bottom-3 bg-gradient-to-r from-[#d4af37] to-[#ffdf00] text-[#002d2d] px-8 rounded-full font-black hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-30 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">تحليل</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GemmaChat;