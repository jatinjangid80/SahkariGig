import React from 'react';
import { CategoryGrid } from './CategoryGrid';

interface ServicesViewProps {
  onSelectCategory: (category: string) => void;
  currentUser?: { name?: string; role?: string; email?: string } | null;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onSelectCategory, currentUser }) => {
  return (
    <div className="py-8 sm:py-10 bg-slate-50 dark:bg-[#0b0f19] min-h-[calc(100vh-4rem)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CategoryGrid rendering */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <CategoryGrid onSelectCategory={onSelectCategory} currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
};
