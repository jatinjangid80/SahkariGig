import React from 'react';
import { Building2, ShieldCheck, Users, ArrowRight, HardHat, CheckCircle2, Sparkles } from 'lucide-react';
import { CategoryGrid } from './CategoryGrid';

interface ServicesViewProps {
  onSelectCategory: (category: string) => void;
  currentUser?: { name?: string; role?: string; email?: string } | null;
  onNavigate?: (path: string) => void;
  onOpenBooking?: (workerOrTrade?: any) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ 
  onSelectCategory, 
  currentUser,
  onNavigate,
  onOpenBooking
}) => {
  return (
    <div className="py-8 sm:py-10 bg-slate-50 dark:bg-[#0b0f19] min-h-[calc(100vh-4rem)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Featured Turnkey House Construction & Supervisor Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 border border-emerald-500/30 p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <HardHat className="w-3.5 h-3.5 text-emerald-400" />
                <span>Turnkey Construction & Site Supervisors</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black font-outfit tracking-tight text-white">
                Book Complete House Construction & Dedicated Supervisor
              </h2>
              
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                End-to-end villa & multi-floor house packages managed on-site by certified 
                <strong> Chief Project Supervisors</strong> with verified cooperative labour crews and milestone-based escrow.
              </p>

              <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-slate-200">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>1 Certified Lead Supervisor Included</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>17+ Verified Multi-Trade Workers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Daily Site Inspections & Milestone Escrow</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                type="button"
                onClick={() => { if (onNavigate) onNavigate('/house-construction'); }}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-sm font-extrabold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Building2 className="w-4 h-4" />
                <span>Book Turnkey Construction & Supervisor</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onOpenBooking) {
                    onOpenBooking({ trade: 'House Construction & Supervisor', name: 'Lead Cooperative Supervisor' });
                  } else if (onNavigate) {
                    onNavigate('/house-construction');
                  }
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-sm font-bold border border-white/20 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4 text-emerald-300" />
                <span>Book Multi-Worker Crew (2–30+)</span>
              </button>
            </div>
          </div>
        </div>

        {/* CategoryGrid rendering */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <CategoryGrid onSelectCategory={onSelectCategory} currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
};
