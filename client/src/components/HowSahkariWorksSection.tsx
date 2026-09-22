import React from 'react';
import { Search, SlidersHorizontal, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface HowSahkariWorksSectionProps {
  onExploreServices?: () => void;
  onNavigate?: (path: string) => void;
}

export const HowSahkariWorksSection: React.FC<HowSahkariWorksSectionProps> = ({ onExploreServices, onNavigate }) => {
  const steps = [
    {
      number: '01',
      title: 'Find',
      subtitle: 'Search verified local pro',
      description: 'Search for any trade, task, or home repair in your city. Our system instantly filters certified cooperative workers nearby.',
      icon: Search,
      highlight: 'Instant trade matching'
    },
    {
      number: '02',
      title: 'Compare',
      subtitle: 'Compare ratings & skills',
      description: 'Review transparent standard rates, verified cooperative credentials, digital ID verification badges, and customer ratings.',
      icon: SlidersHorizontal,
      highlight: 'Standard transparent pricing'
    },
    {
      number: '03',
      title: 'Hire',
      subtitle: 'Connect & get it done',
      description: 'Directly book your trusted professional, scan their live QR ID card upon arrival, and pay safely upon 100% satisfaction.',
      icon: CheckCircle2,
      highlight: 'Tamper-proof QR verification'
    }
  ];

  return (
    <section id="how-sahkari-works" className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-3.5 py-1.5 rounded-full shadow-2xs">
            Transparent Process
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-outfit">
            How SahkariGig Works
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
            A straightforward 3-step workflow designed for speed, safety, and community trust.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-slate-50 dark:bg-slate-800/90 hover:bg-emerald-50/40 dark:hover:bg-slate-750 rounded-3xl p-6 sm:p-7 border-2 border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 dark:hover:border-emerald-400 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Step Number & Icon Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-outfit">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 shadow-xs flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Step Title & Subtitle */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
                    {step.title}
                  </h3>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-2.5">
                    {step.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                {/* Footer Highlight */}
                <div className="mt-6 pt-3.5 border-t border-slate-200 dark:border-slate-700 flex items-center text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <ShieldCheck className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{step.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Action Banner */}
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => {
              const elem = document.getElementById('workers-directory');
              if (elem) elem.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center space-x-2 text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-200 hover:text-emerald-900 dark:hover:text-white bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 border border-emerald-200 dark:border-emerald-700/80 px-5 py-2.5 rounded-2xl transition-all cursor-pointer shadow-xs hover:shadow-md"
          >
            <span>Ready to get started? Browse verified workers near you</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
