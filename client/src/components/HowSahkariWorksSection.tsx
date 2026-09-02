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
    <section id="how-sahkari-works" className="py-14 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100/70 border border-emerald-200 px-3 py-1 rounded-full">
            Transparent Process
          </span>
          <h2 className="mt-2.5 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-outfit">
            How SahkariGig Works
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
            A straightforward 3-step workflow designed for speed, safety, and community trust.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-slate-50 hover:bg-emerald-50/30 rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Step Number & Icon Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl sm:text-4xl font-black text-emerald-700 font-outfit">
                      {step.number}
                    </span>
                    <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-emerald-700">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Step Title & Subtitle */}
                  <h3 className="text-lg font-bold text-slate-900 font-outfit">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700 mb-2">
                    {step.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Footer Highlight */}
                <div className="mt-5 pt-3 border-t border-slate-200/80 flex items-center text-[11px] font-semibold text-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" />
                  <span>{step.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Action Banner */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              const elem = document.getElementById('workers-directory');
              if (elem) elem.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <span>Ready to get started? Browse verified workers near you</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
