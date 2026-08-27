import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { CONFIG } from '../config';

interface HeroSectionProps {
  onNavigate: (path: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Foundation Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
            {CONFIG.phase}
          </span>
        </div>

        {/* Hero Title */}
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight font-outfit">
            Cooperative gig services, <br className="hidden sm:inline" />
            <span className="gradient-text">owned by the people</span> who do the work.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed font-sans">
            {CONFIG.appName} is the trust-first platform layer connecting households and community customers with verified cooperative workers, governed by cooperative admins.
          </p>
        </div>

        {/* Call to Actions */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={() => onNavigate('/contact')}
            className="px-6 py-3.5 gradient-bg hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-2"
          >
            <span>Get in touch</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('/about')}
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm rounded-xl border border-slate-800 transition-all"
          >
            How the cooperative works
          </button>
        </div>

      </div>
    </section>
  );
};
