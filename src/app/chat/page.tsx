
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, ChevronRight, Zap } from 'lucide-react';
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
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary">
              <ChevronRight className="w-4 h-4" /> العودة للرئيسية
            </Button>
          </Link>
          <div className="flex items-center gap-2">
             <Zap className="w-5 h-5 text-primary fill-current" />
             <span className="text-xs font-black uppercase tracking-widest text-primary">المختبر النشط</span>
          </div>
        </div>

        <div className="glass-card rounded-3xl overflow-hidden flex flex-col h-[700px] border border-[#d4af37]/40 shadow-2xl bg-[#002d2d]/90">
          <div className="p-6 bg-[#003d3d] border-b border-[#d4af37]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#ffdf00] flex items-center justify-center shadow-lg">
                <Bot className="text-[#002d2d] w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg gold-gradient-text">مركز الاستدلال المنطقي (Gemma 3)</h3>
                <p className="text-xs text-[#fffcf2]/60">عمارة الذكاء المفتوح 2026</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                <Sparkles className="w-12 h-12 text-[#d4af37]" />
                <p className="text-[#fffcf2] max-w-xs text-sm">اسأل عن تفاصيل Gamma 2026 أو تقنيات التحويل المتعددة الوسائط</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === MessageRole.USER ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl flex gap-3 shadow-md ${
                  msg.role === MessageRole.USER 
                    ? 'bg-[#004d4d] border border-white/10 rounded-tr-none text-white' 
                    : 'bg-[#fffcf2]/10 border border-[#d4af37]/30 rounded-tl-none text-[#fffcf2]'
                }`}>
                  <div className="shrink-0 mt-1">
                    {msg.role === MessageRole.USER ? <User className="w-4 h-4 text-[#fffcf2]/70" /> : <Bot className="w-4 h-4 text-[#d4af37]" />}
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-end">
                <div className="bg-[#fffcf2]/10 p-4 rounded-2xl flex items-center gap-3 border border-[#d4af37]/30 shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-[#d4af37]" />
                  <p className="text-xs italic text-[#fffcf2]/80">جاري الاستدلال المنطقي...</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-[#003d3d]/50 border-t border-[#d4af37]/30">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="أدخل استفسارك التقني هنا..."
                className="w-full bg-[#002d2d] border border-[#d4af37]/40 rounded-full py-4 px-6 pl-20 text-[#fffcf2] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 transition-all placeholder:text-white/20 text-sm"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute left-2 top-2 bottom-2 bg-gradient-to-r from-[#d4af37] to-[#ffdf00] text-[#002d2d] px-5 rounded-full font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">إرسال</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GemmaChat;
