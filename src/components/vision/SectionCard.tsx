
'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionCardProps {
  title: string;
  analysis: string;
  benefit: string;
  icon: LucideIcon;
}

export default function SectionCard({ title, analysis, benefit, icon: Icon }: SectionCardProps) {
  return (
    <div className="glass-card p-8 rounded-[2rem] hover:border-[#d4af37]/50 transition-all duration-500 group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="w-24 h-24 text-[#d4af37]" />
      </div>
      <div className="relative z-10 space-y-4">
        <div className="w-12 h-12 bg-[#d4af37]/10 rounded-xl flex items-center justify-center border border-[#d4af37]/20">
          <Icon className="text-[#d4af37] w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold gold-gradient-text">{title}</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-black text-primary tracking-widest">التحليل التقني</p>
            <p className="text-sm text-white/70 leading-relaxed">{analysis}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-black text-accent tracking-widest">العائد المجتمعي</p>
            <p className="text-sm text-white/50 italic leading-relaxed">{benefit}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
