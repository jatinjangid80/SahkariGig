import React from 'react';
import { CategoryGrid } from './CategoryGrid';
import { ShieldCheck, Search, Flame, Sparkles } from 'lucide-react';

interface ServicesViewProps {
  onSelectCategory: (category: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onSelectCategory }) => {
  return (
    <div className="py-10 bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Banner with Premium Design */}
        <div className="relative rounded-3xl bg-slate-900 text-white overflow-hidden shadow-xl p-8 sm:p-12 border border-slate-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 mr-1" />
              <span>Ministry of Cooperation Endorsed</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-outfit">
              Verified Cooperative Gig Directory
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Find and book vetted electricians, plumbers, painters, domestic help, and technicians. Every booking directly pays cooperative members at standardized, community-approved rates.
            </p>
          </div>
        </div>

        {/* CategoryGrid rendering */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <CategoryGrid onSelectCategory={onSelectCategory} />
        </div>

        {/* Quality Guarantee Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-800">
          <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shrink-0">
              ✓
            </div>
            <div>
              <h3 className="font-bold text-slate-900 font-outfit text-base">Standardized Rates</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                No bargaining or hidden fees. All rates are defined transparently by the cooperative society and agreed upon beforehand.
              </p>
            </div>
          </div>

          <div className="p-6 bg-sky-50/50 rounded-2xl border border-sky-100 flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg shrink-0">
              ★
            </div>
            <div>
              <h3 className="font-bold text-slate-900 font-outfit text-base">Verified Skill Assured</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Every worker is vetted, certified, and fully registered with a Labour Cooperative Federation before serving the community.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
