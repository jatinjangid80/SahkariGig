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
    <section id="how-it-works" className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Trust & Safety Framework
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-outfit">
            Why SahkariGig?
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Building a trustworthy foundation for local service work through worker ownership and digital identity verification.
          </p>
        </div>

        {/* 4 Trust Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((point) => {
            const IconComp = point.icon;
            return (
              <div key={point.title} className="light-card p-6 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-4">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-outfit mb-2">
                    {point.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {point.description}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-emerald-700">
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
