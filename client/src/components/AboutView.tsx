import React from 'react';
import { ShieldCheck, Building2, Users, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (path: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4">
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-8 shadow-2xl">
        
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">ABOUT THE PLATFORM</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2 font-outfit">
            Reinventing Gig Work Through Cooperatives
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
            Labour Cooperative Federations and Labour Cooperative Societies possess a large, underutilized pool of skilled workers — electricians, plumbers, carpenters, painters, domestic helpers, caregivers, drivers, gardeners, cleaners, and technicians.
          </p>
        </div>

        <div className="p-6 bg-slate-900/90 rounded-2xl border border-emerald-500/30 space-y-3">
          <h3 className="text-lg font-bold text-emerald-400 font-outfit">Ministry of Cooperation Directive</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Problem Statement ID <span className="font-mono text-emerald-300 font-bold">SIH26089</span> in Smart Automation aims to establish a unified digital platform connecting this workforce to households and community customers on demand with democratic governance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
            <h4 className="font-bold text-white text-sm">Trust-First Identity</h4>
            <p className="text-slate-400">Digital background verification backed by cooperative federations for customer security.</p>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
            <h4 className="font-bold text-white text-sm">Democratic Ownership</h4>
            <p className="text-slate-400">Workers are member-owners who share in revenue without middleman exploitation.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">Phase 0 Architecture Foundation</span>
          <button
            onClick={() => onNavigate('/contact')}
            className="px-5 py-2.5 gradient-bg hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-2"
          >
            <span>Get in touch with admin</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
