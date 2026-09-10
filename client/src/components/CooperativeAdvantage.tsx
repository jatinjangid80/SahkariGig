import React from 'react';
import { ShieldCheck, HeartHandshake, Scale, Award, ArrowRight } from 'lucide-react';

interface CooperativeAdvantageProps {
  onNavigate?: (path: string) => void;
}

export const CooperativeAdvantage: React.FC<CooperativeAdvantageProps> = ({ onNavigate }) => {
  const advantages = [
    {
      icon: HeartHandshake,
      title: 'Fair Wages for Workers',
      description: 'Zero exploitative 25% middlemen cuts. Workers receive 100% of standard earnings, resulting in happier, dedicated professionals who take pride in their craft.',
      highlight: '100% Direct Pay'
    },
    {
      icon: ShieldCheck,
      title: 'Higher Customer Accountability',
      description: 'Backed by registered labour cooperative federations, cryptographic digital worker IDs, and instant QR verification at your doorstep for complete peace of mind.',
      highlight: 'Verified Safety'
    },
    {
      icon: Scale,
      title: 'Transparent Community Pricing',
      description: 'No surge pricing or hidden booking markups. Standardized, fair market rates set collaboratively with local trade unions and municipal benchmarks.',
      highlight: 'Zero Surge Pricing'
    }
  ];

  return (
    <section className="py-10 sm:py-12 bg-emerald-950/5 dark:bg-emerald-950/20 border-y border-emerald-100/80 dark:border-emerald-900/40 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
              <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>The Cooperative Advantage</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-outfit tracking-tight">
              Why Choose SahkariGig?
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-xl">
              Unlike traditional gig apps that exploit workers with heavy commissions, our cooperative model creates a win-win for both customers and skilled local tradespeople.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onNavigate) onNavigate('/about');
              const elem = document.getElementById('how-it-works');
              if (elem) elem.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 group cursor-pointer shrink-0"
          >
            <span>Learn how cooperatives work</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 3 Advantage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {advantages.map((adv) => {
            const Icon = adv.icon;
            return (
              <div
                key={adv.title}
                className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 sm:p-6 border border-emerald-100 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800">
                      {adv.highlight}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit mb-2">
                    {adv.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {adv.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
