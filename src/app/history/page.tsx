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
 * @fileOverview أرشيف الاستدلال السينابتي لنظام Gemma Core 2030.
 */

export default function HistoryPage() {
  const { projects, sessions, isLoaded, toggleBookmark, deleteSession } = useWorkbenchStore();
  const [filter, setFilter] = useState<'all' | 'bookmarked'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isLoaded) return null;

  const filteredSessions = sessions.filter(session => {
    const matchesFilter = filter === 'all' || session.isBookmarked;
    const matchesSearch = 
      session.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (session.role === 'user' && session.text.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-8 max-w-4xl mx-auto font-body pb-24" dir="rtl">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 bg-card p-8 rounded-[2.5rem] border-2 border-primary/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <HistoryIcon className="w-32 h-32 text-primary" />
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-12 w-12 bg-secondary rounded-xl hover:bg-secondary/80">
              <ChevronRight className="w-6 h-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black gold-gradient-text uppercase leading-none">الأرشيف السينابتي</h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-2">سجل الاستدلال المتكامل للملاح</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 relative z-10">
          <Badge variant="outline" className="gap-2 border-accent/30 text-accent font-black text-[9px] px-4 py-1 rounded-full animate-pulse bg-accent/5">
            <Activity className="w-3 h-3" /> ARCHIVE SYNC ACTIVE
          </Badge>
          <div className="flex bg-secondary/30 rounded-full p-1 border-2 border-primary/10">
            <Button 
              variant={filter === 'all' ? 'primary' : 'ghost'} 
              size="sm" 
              className="h-8 text-[10px] px-6 rounded-full font-black uppercase tracking-widest"
              onClick={() => setFilter('all')}
            >
              الكل
            </Button>
            <Button 
              variant={filter === 'bookmarked' ? 'primary' : 'ghost'} 
              size="sm" 
              className="h-8 text-[10px] px-6 rounded-full font-black uppercase tracking-widest"
              onClick={() => setFilter('bookmarked')}
            >
              المميز
            </Button>
          </div>
        </div>
      </header>

      <div className="relative group">
        <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
        <Input 
          placeholder="البحث في سجلات الإخراج الإدراكي..." 
          className="h-16 pr-14 pl-6 bg-card border-2 border-primary/10 rounded-2xl text-lg font-medium shadow-inner focus:border-primary/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session, idx) => (
            <div key={session.id || idx} className="group bg-card border-2 border-primary/5 rounded-[2rem] overflow-hidden hover:border-primary/30 transition-all shadow-lg hover:shadow-primary/5">
              <div className="p-4 border-b-2 border-primary/5 flex items-center justify-between bg-primary/5">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-background rounded-lg shadow-inner">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    {new Date(session.timestamp).toLocaleString('ar-EG')}
                  </span>
                  <Badge className={cn(
                    "text-[8px] h-5 font-black uppercase",
                    session.role === 'user' ? "bg-accent/20 text-accent border-accent/30" : "bg-primary/20 text-primary border-primary/30"
                  )}>
                    {session.role === 'user' ? 'مدخلات الملاح' : 'إخراج إدراكي'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 text-muted-foreground hover:text-primary rounded-xl"
                    onClick={() => toggleBookmark(session.id!)}
                  >
                    <Star className={cn("w-5 h-5", session.isBookmarked && "fill-primary text-primary")} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 text-muted-foreground hover:text-destructive rounded-xl"
                    onClick={() => deleteSession(session.id!)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <div className="p-8">
                <div className="bg-background/50 rounded-2xl p-6 border-2 border-dashed border-primary/10">
                  <p className="text-lg font-medium leading-relaxed whitespace-pre-wrap">
                    {session.text}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-32 text-center space-y-6 border-4 border-dashed rounded-[3rem] opacity-20 bg-primary/5">
            <HistoryIcon className="w-20 h-20 mx-auto text-primary animate-pulse" />
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-widest">الأرشيف فارغ</h3>
              <p className="text-sm font-bold uppercase tracking-widest">بانتظار الإخراج الإدراكي الأول</p>
            </div>
          </div>
        )}
      </div>

      <nav className="fixed bottom-4 left-4 right-4 h-20 bg-card/90 backdrop-blur-2xl border-2 border-primary/20 flex items-center justify-around px-10 shadow-2xl z-50 rounded-[2.5rem]">
        <Link href="/" className="flex flex-col items-center gap-1 text-muted-foreground/60 hover:text-primary transition-all">
          <BrainCircuit className="w-7 h-7" />
          <span className="text-[10px] font-black uppercase">النواة</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center gap-1 text-muted-foreground/60 hover:text-primary transition-all">
          <Activity className="w-7 h-7" />
          <span className="text-[10px] font-bold uppercase">الاستدلال</span>
        </Link>
        <div className="flex flex-col items-center gap-1 text-primary scale-110">
          <HistoryIcon className="w-7 h-7 fill-current" />
          <span className="text-[10px] font-black uppercase">الأرشيف</span>
        </div>
      </nav>
    </div>
  );
}
