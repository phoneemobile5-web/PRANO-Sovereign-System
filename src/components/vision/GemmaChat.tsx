
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { gemmaChat } from '@/ai/flows/gemma-chat-flow';

enum MessageRole {
  USER = 'user',
  MODEL = 'model'
}

interface ChatMessage {
  role: MessageRole;
  text: string;
}

export default function GemmaChat() {
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
      const result = await gemmaChat({ message: input, history: currentHistory });
      const aiMessage: ChatMessage = { role: MessageRole.MODEL, text: result.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col h-[650px] border-[#d4af37]/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] bg-[#002d2d]/60">
      <div className="p-8 bg-[#003d3d]/40 border-b border-[#d4af37]/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#d4af37] to-[#ffdf00] flex items-center justify-center shadow-lg transform rotate-3">
            <Bot className="text-[#002d2d] w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-xl gold-gradient-text tracking-tight">مركز الاستدلال Gemma 3</h3>
            <p className="text-[10px] text-[#fffcf2]/40 uppercase tracking-widest font-black">Cognitive Output Processor</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
            <Sparkles className="w-16 h-16 text-[#d4af37] animate-pulse" />
            <p className="text-[#fffcf2] max-w-xs text-sm font-light leading-relaxed">بانتظار إدخال الموجهات لتحويلها إلى استدلالات إدراكية فائقة السرعة</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === MessageRole.USER ? 'justify-start' : 'justify-end'}`}>
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
              <p className="text-xs font-black uppercase tracking-widest text-[#d4af37]">جاري الاستدلال...</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-[#003d3d]/20 border-t border-[#d4af37]/20">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="أدخل الموجه التقني للتحليل..."
            className="w-full bg-[#001a1a]/80 border-2 border-[#d4af37]/30 rounded-full py-5 px-8 pl-24 text-[#fffcf2] focus:outline-none focus:border-[#d4af37] transition-all placeholder:text-white/10 text-base font-medium shadow-inner"
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
  );
}
