import React from 'react';
import { CategoryGrid } from './CategoryGrid';

interface ServicesViewProps {
  onSelectCategory: (category: string) => void;
  currentUser?: { name?: string; role?: string; email?: string } | null;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onSelectCategory, currentUser }) => {
  return (
    <div className="py-10 bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* CategoryGrid rendering */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <CategoryGrid onSelectCategory={onSelectCategory} currentUser={currentUser} />
        </div>

        {/* Quality Guarantee Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 flex items-start space-x-4 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
              ✓
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white font-outfit text-base">Standardized Rates</h3>
              <p className="text-xs text-slate-600 dark:text-slate-200 mt-1 leading-relaxed font-medium">
                No bargaining or hidden fees. All rates are defined transparently by the cooperative society and agreed upon beforehand.
              </p>
            </div>
          </div>

          <div className="p-6 bg-sky-50/70 dark:bg-sky-950/30 rounded-2xl border border-sky-200/80 dark:border-sky-800/60 flex items-start space-x-4 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
              ★
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white font-outfit text-base">Verified Skill Assured</h3>
              <p className="text-xs text-slate-600 dark:text-slate-200 mt-1 leading-relaxed font-medium">
                Every worker is vetted, certified, and fully registered with a Labour Cooperative Federation before serving the community.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
