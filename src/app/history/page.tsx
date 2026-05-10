'use client';

import { useWorkbenchStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Trash2, Star, Search, Clock, ExternalLink, History as HistoryIcon, BrainCircuit, ChevronRight, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * @fileOverview أرشيف الاستدلال السينابتي لنظام Gemma Core 2030 المطور.
 * تصميم زجاجي فيروزي مع لمسات كوفية.
 */

export default function HistoryPage() {
  const { projects, sessions, isLoaded, toggleBookmark, deleteSession } = useWorkbenchStore();
  const [filter, setFilter] = useState<'all' | 'bookmarked'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isLoaded) return null;

  const filteredSessions = sessions.filter((session: any) => {
    const matchesFilter = filter === 'all' || session.isBookmarked;
    const matchesSearch = 
      session.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (session.role === 'user' && session.text.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#001a1a] p-4 md:p-8 space-y-10 max-w-5xl mx-auto font-kufi pb-32" dir="rtl">
      {/* سديم خلفية */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-[20%] right-[10%] w-[60%] h-[60%] bg-[#00ffff]/20 blur-[180px] rounded-full"></div>
      </div>

      <header className="flex flex-col md:flex-row items-center justify-between gap-8 glass-turquoise p-10 rounded-[3.5rem] border border-white/10 shadow-3xl relative overflow-hidden z-10">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <HistoryIcon className="w-48 h-48 text-[#d4af37]" />
        </div>
        
        <div className="flex items-center gap-6 relative z-10">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-16 w-16 glass-turquoise rounded-2xl hover:bg-white/10 border-white/5">
              <ChevronRight className="w-8 h-8 text-white/60" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-black gold-gradient-text uppercase leading-none font-diwani">الأرشيف السينابتي</h1>
            <p className="text-[11px] text-[#00ffff]/40 font-bold uppercase tracking-[0.3em] mt-3 font-diwani">سجل الاستدلال المتكامل للملاح</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4 relative z-10">
          <Badge variant="outline" className="gap-3 border-[#00ffff]/30 text-[#00ffff] font-black text-[10px] px-6 py-2 rounded-full animate-pulse bg-[#00ffff]/5">
            <Activity className="w-4 h-4" /> ARCHIVE SYNC ACTIVE
          </Badge>
          <div className="flex glass-turquoise rounded-full p-1.5 border border-white/10">
            <Button 
              variant={filter === 'all' ? 'default' : 'ghost'} 
              size="sm" 
              className={cn(
                "h-10 text-[11px] px-8 rounded-full font-black uppercase tracking-widest transition-all",
                filter === 'all' ? "bg-[#d4af37] text-[#002d2d]" : "text-white/40 hover:text-white"
              )}
              onClick={() => setFilter('all')}
            >
              الكل
            </Button>
            <Button 
              variant={filter === 'bookmarked' ? 'default' : 'ghost'} 
              size="sm" 
              className={cn(
                "h-10 text-[11px] px-8 rounded-full font-black uppercase tracking-widest transition-all",
                filter === 'bookmarked' ? "bg-[#d4af37] text-[#002d2d]" : "text-white/40 hover:text-white"
              )}
              onClick={() => setFilter('bookmarked')}
            >
              المميز
            </Button>
          </div>
        </div>
      </header>

      <div className="relative group z-10">
        <Search className="absolute right-8 top-1/2 -translate-y-1/2 w-7 h-7 text-[#00ffff]/30" />
        <Input 
          placeholder="البحث في سجلات الإخراج الإدراكي..." 
          className="h-20 pr-20 pl-8 glass-turquoise border-white/10 rounded-[2.5rem] text-xl font-medium shadow-2xl focus:border-[#00ffff]/40 transition-all font-diwani"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-8 z-10 relative">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session: any, idx: number) => (
            <div key={session.id || idx} className="group glass-turquoise border-white/5 rounded-[3rem] overflow-hidden hover:border-[#00ffff]/30 transition-all shadow-2xl hover:shadow-[#00ffff]/5">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-6">
                  <div className="p-3 bg-black/20 rounded-2xl shadow-inner">
                    <Clock className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em] font-diwani">
                    {new Date(session.timestamp).toLocaleString('ar-EG')}
                  </span>
                  <Badge className={cn(
                    "text-[9px] h-6 px-4 font-black uppercase rounded-full",
                    session.role === 'user' ? "bg-[#00ffff]/20 text-[#00ffff] border-[#00ffff]/30" : "bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30"
                  )}>
                    {session.role === 'user' ? 'مدخلات الملاح' : 'إخراج إدراكي'}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-12 w-12 text-white/30 hover:text-[#d4af37] rounded-xl glass-turquoise border-white/5"
                    onClick={() => toggleBookmark(session.id!)}
                  >
                    <Star className={cn("w-6 h-6", session.isBookmarked && "fill-[#d4af37] text-[#d4af37]")} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-12 w-12 text-white/30 hover:text-destructive rounded-xl glass-turquoise border-white/5"
                    onClick={() => deleteSession(session.id!)}
                  >
                    <Trash2 className="w-6 h-6" />
                  </Button>
                </div>
              </div>
              <div className="p-10">
                <div className="bg-black/20 rounded-[2rem] p-8 border border-white/5">
                  <p className="text-xl font-medium leading-relaxed whitespace-pre-wrap font-diwani italic text-white/80">
                    {session.text}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-40 text-center space-y-8 glass-turquoise border-dashed border-2 rounded-[4rem] opacity-20">
            <HistoryIcon className="w-24 h-24 mx-auto text-[#d4af37] animate-pulse" />
            <div className="space-y-4">
              <h3 className="text-3xl font-black uppercase tracking-[0.4em] font-diwani">الأرشيف فارغ</h3>
              <p className="text-sm font-bold uppercase tracking-[0.3em] font-diwani">بانتظار الإخراج الإدراكي الأول</p>
            </div>
          </div>
        )}
      </div>

      <nav className="fixed bottom-6 left-6 right-6 h-22 glass-turquoise border border-white/10 flex items-center justify-around px-12 shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-50 rounded-[3rem]">
        <Link href="/" className="flex flex-col items-center gap-2 text-white/30 hover:text-[#d4af37] transition-all">
          <BrainCircuit className="w-8 h-8" />
          <span className="text-[10px] font-black uppercase tracking-widest font-diwani">النواة</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center gap-2 text-white/30 hover:text-[#d4af37] transition-all">
          <Activity className="w-8 h-8" />
          <span className="text-[10px] font-black uppercase tracking-widest font-diwani">الاستدلال</span>
        </Link>
        <div className="flex flex-col items-center gap-2 text-[#d4af37] scale-110">
          <HistoryIcon className="w-8 h-8 fill-current" />
          <span className="text-[10px] font-black uppercase tracking-widest font-diwani">الأرشيف</span>
        </div>
      </nav>
    </div>
  );
}