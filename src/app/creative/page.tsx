'use client';

import React, { useState } from 'react';
import { 
  Palette, Sparkles, Download, RefreshCw, 
  ChevronRight, Star, Image as ImageIcon, 
  Zap, ShieldCheck, Globe, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { generateVisualContent } from '@/ai/flows/visual-synthesis-flow';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

/**
 * @fileOverview مختبر التخليق البصري - الإخراج الإبداعي لنظام Gemma Core 2030.
 * تصميم زجاجي فيروزي يدعم توليد الصور باستخدام Imagen 4.
 */

export default function CreativeLab() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ url: string; revised: string } | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      const output = await generateVisualContent({ prompt });
      setResult({ url: output.imageUrl, revised: output.revisedPrompt });
      toast({ title: "تم التخليق البصري بنجاح ✨", description: "الأرض خصبة للإبداع العالمي." });
    } catch (error) {
      toast({ variant: "destructive", title: "فشل الاستحضار البصري ⚠️" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#001a1a] p-4 md:p-8 flex flex-col items-center font-kufi relative overflow-hidden" dir="rtl">
      <Toaster />
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#00ffff]/10 blur-[150px] rounded-full animate-pulse"></div>
      </div>

      <div className="w-full max-w-6xl z-10 space-y-10">
        <header className="flex items-center justify-between glass-turquoise p-8 rounded-[3rem] border border-white/10 shadow-3xl">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-14 w-14 glass-turquoise rounded-2xl hover:bg-white/10">
                <ChevronRight className="w-8 h-8 text-[#00ffff]" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-black gold-gradient-text uppercase leading-none font-diwani">مختبر التخليق البصري</h1>
              <p className="text-[10px] text-[#00ffff]/40 font-black uppercase tracking-[0.3em] mt-2 font-diwani">Visual Creative Registry • Imagen 4.0</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-3 border-[#d4af37]/30 text-[#d4af37] font-black text-[10px] px-6 py-2 rounded-full bg-[#d4af37]/5">
            <Globe className="w-4 h-4" /> GLOBAL CREATIVE SYNC
          </Badge>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section className="glass-turquoise p-10 rounded-[4rem] border border-white/10 space-y-8 flex flex-col justify-between h-fit">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-right">
                <div className="p-4 bg-[#00ffff]/10 rounded-2xl">
                  <Palette className="w-8 h-8 text-[#00ffff]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white/80 font-diwani">موجه التخليق المعماري</h3>
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">Spiritual-Digital Vision Prompt</p>
                </div>
              </div>
              <Textarea 
                placeholder="صف الرؤية البصرية بوقار سيادي... مثال: مدينة فيروزية زجاجية تسبح في سديم من النور الكوني."
                className="min-h-[250px] bg-black/40 border-2 border-white/10 rounded-[2.5rem] p-8 text-xl font-medium focus:border-[#00ffff]/40 transition-all text-right leading-relaxed font-diwani italic"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="h-24 w-full rounded-[2rem] bg-gradient-to-r from-[#d4af37] to-[#ffdf00] text-[#002d2d] font-black text-2xl gap-5 shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all border-none group"
            >
              {isGenerating ? <RefreshCw className="w-10 h-10 animate-spin" /> : <Sparkles className="w-10 h-10 group-hover:rotate-12 transition-transform" />}
              تفعيل الرنين الإبداعي
            </Button>
          </section>

          <section className="glass-turquoise p-10 rounded-[4rem] border border-white/10 flex flex-col items-center justify-center relative overflow-hidden min-h-[500px]">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <ImageIcon className="w-48 h-48 text-[#d4af37]" />
            </div>
            
            {isGenerating ? (
              <div className="text-center space-y-8 animate-in fade-in zoom-in duration-1000">
                <div className="relative inline-block">
                  <div className="p-20 bg-white/5 rounded-full border border-[#00ffff]/20 synaptic-pulse shadow-[0_0_80px_rgba(0,255,255,0.1)]">
                    <Activity className="w-24 h-24 text-[#00ffff] animate-pulse" />
                  </div>
                  <Badge className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#d4af37] text-[#002d2d] font-black px-8 py-2 rounded-full shadow-2xl">CREATING FERTILITY...</Badge>
                </div>
                <p className="text-xl text-white/40 font-black uppercase tracking-[0.4em] font-diwani">جاري سحب البيانات من فضاء تسلا...</p>
              </div>
            ) : result ? (
              <div className="w-full space-y-8 animate-in fade-in zoom-in-95 duration-700">
                <div className="relative aspect-square w-full rounded-[3rem] overflow-hidden shadow-3xl border border-white/10 group">
                  <img src={result.url} alt="Generated Content" className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-10">
                     <Button className="w-full h-16 rounded-2xl bg-white/10 backdrop-blur-md border-white/20 text-white font-black gap-4 hover:bg-white/20" asChild>
                        <a href={result.url} download="gemma-creative-output.png">
                          <Download className="w-6 h-6" /> تحميل الإخراج الإدراكي
                        </a>
                     </Button>
                  </div>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-2">
                   <span className="text-[10px] font-black text-[#00ffff]/60 uppercase tracking-widest font-diwani">الرنين المنقح (Revised Prompt):</span>
                   <p className="text-xs text-white/40 italic font-diwani leading-relaxed">{result.revised}</p>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-8 opacity-20">
                <ImageIcon className="w-32 h-32 mx-auto text-white/40" />
                <p className="text-xl font-black uppercase tracking-[0.5em] font-diwani">بانتظار ومضة الإبداع الأولى</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
