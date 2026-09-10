import React from 'react';
import { ShieldCheck, QrCode, Zap, Award } from 'lucide-react';

export const WhyCooperative: React.FC = () => {
  const trustPoints = [
    {
      icon: ShieldCheck,
      title: 'Cooperative Verified',
      description: 'Workers are vetted and affiliated with Ministry-registered Labour Cooperative Federations for full accountability.',
      accent: 'emerald'
    },
    {
      icon: QrCode,
      title: 'Digital Worker ID',
      description: 'Every approved worker holds a tamper-proof digital ID card backed by blockchain-style cryptographic verification.',
      accent: 'sky'
    },
    {
      icon: QrCode,
      title: 'Live QR Verification',
      description: 'Households can scan the worker’s QR code upon arrival to instantly verify active membership and safety status.',
      accent: 'indigo'
    },
    {
      icon: Zap,
      title: 'Smart Match Engine',
      description: 'AI matches workers based on exact trade skill, verified distance, real rating, and immediate availability.',
      accent: 'amber'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider bg-emerald-100/80 dark:bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-300 dark:border-emerald-800 shadow-2xs">
            Trust & Safety Framework
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-outfit">
            Why SahkariGig?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
            Building a trustworthy foundation for local service work through worker ownership and digital identity verification.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto mb-16 bg-white dark:bg-slate-800/90 rounded-3xl shadow-xl border-2 border-slate-200 dark:border-slate-700/80 overflow-hidden">
          <div className="grid grid-cols-2 bg-slate-900 dark:bg-slate-950 text-white font-outfit text-sm font-bold">
            <div className="p-5 border-r border-slate-800 dark:border-slate-800 flex items-center justify-center">Traditional Gig Platform</div>
            <div className="p-5 flex items-center justify-center bg-emerald-700 dark:bg-emerald-800 text-white">SahkariGig</div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            <div className="grid grid-cols-2 text-sm font-medium">
              <div className="p-5 border-r border-slate-100 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 flex items-center justify-center text-center">Individual workers</div>
              <div className="p-5 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-center bg-emerald-50/50 dark:bg-emerald-950/30">Cooperative workforce</div>
            </div>
            <div className="grid grid-cols-2 text-sm font-medium">
              <div className="p-5 border-r border-slate-100 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 flex items-center justify-center text-center">Platform-centric</div>
              <div className="p-5 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-center bg-emerald-50/50 dark:bg-emerald-950/30">Community-centric</div>
            </div>
            <div className="grid grid-cols-2 text-sm font-medium">
              <div className="p-5 border-r border-slate-100 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 flex items-center justify-center text-center">Generic profiles</div>
              <div className="p-5 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-center bg-emerald-50/50 dark:bg-emerald-950/30">Skill + cooperative identity</div>
            </div>
            <div className="grid grid-cols-2 text-sm font-medium">
              <div className="p-5 border-r border-slate-100 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 flex items-center justify-center text-center">Individual opportunities</div>
              <div className="p-5 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-center bg-emerald-50/50 dark:bg-emerald-950/30">Cooperative opportunities</div>
            </div>
            <div className="grid grid-cols-2 text-sm font-medium">
              <div className="p-5 border-r border-slate-100 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 flex items-center justify-center text-center">Limited local trust</div>
              <div className="p-5 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-center bg-emerald-50/50 dark:bg-emerald-950/30">Local verification</div>
            </div>
          </div>
        </div>

        {/* 4 Trust Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((point) => {
            const IconComp = point.icon;
            return (
              <div key={point.title} className="bg-white dark:bg-slate-800/95 p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit mb-2">
                    {point.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {point.description}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                  <Award className="w-3.5 h-3.5 mr-1" />
                  <span>Cooperative Standard</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
