import React from 'react';
import { ShieldCheck, Building2, Users, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (path: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4">
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 space-y-8 shadow-xl">
        
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 font-bold">ABOUT THE PLATFORM</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-2 font-outfit">
            Reinventing Gig Work Through Cooperatives
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed font-medium">
            Labour Cooperative Federations and Labour Cooperative Societies possess a large, underutilized pool of skilled workers — electricians, plumbers, carpenters, painters, domestic helpers, caregivers, drivers, gardeners, cleaners, and technicians.
          </p>
        </div>

        <div className="p-6 bg-emerald-50/80 rounded-2xl border border-emerald-200/60 space-y-3">
          <h3 className="text-lg font-bold text-emerald-800 font-outfit">Ministry of Cooperation Directive</h3>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            Problem Statement ID <span className="font-mono text-emerald-700 font-bold">SIH26089</span> in Smart Automation aims to establish a unified digital platform connecting this workforce to households and community customers on demand with democratic governance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <h4 className="font-bold text-slate-900 text-base">Trust-First Identity</h4>
            <p className="text-slate-600 font-medium">Digital background verification backed by cooperative federations for customer security.</p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <h4 className="font-bold text-slate-900 text-base">Democratic Ownership</h4>
            <p className="text-slate-600 font-medium">Workers are member-owners who share in revenue without middleman exploitation.</p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-500 font-mono font-medium">Phase 0 Architecture Foundation</span>
          <button
            onClick={() => onNavigate('/contact')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center space-x-2 transition-all"
          >
            <span>Get in touch with admin</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
