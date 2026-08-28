import React from 'react';
import { Search, MapPin, MessageSquare, ShieldCheck, CreditCard, Star, Users } from 'lucide-react';

export const HowItWorksView: React.FC = () => {
  const steps = [
    {
      icon: Search,
      title: '1. Describe or Pick Trade',
      description: 'Find a service using our category grid, or use the free-text AI Routing box to match your exact home repairs.'
    },
    {
      icon: MapPin,
      title: '2. Proximity Matching',
      description: 'Our matching algorithm searches for the closest available worker registered under your local cooperative federation.'
    },
    {
      icon: MessageSquare,
      title: '3. Encrypted Direct Chat',
      description: 'Coordinate date, time, and specific project details via our secure real-time WebSocket chat room.'
    },
    {
      icon: ShieldCheck,
      title: '4. Instant QR Verification',
      description: 'When the professional arrives at your location, scan their physical or digital ID QR card to confirm background checks.'
    },
    {
      icon: CreditCard,
      title: '5. Escrow Payment & Review',
      description: 'Approve the work, pay standard rates online, and write feedback. 100% of the pay goes straight to the worker.'
    }
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-[calc(100vh-4rem)] font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Lifecycle & Engine
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-outfit">
            How SahkariGig Operates
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-medium">
            Learn about our automated matching engine, direct customer communication channels, and identity security frameworks.
          </p>
        </div>

        {/* Step-by-Step Flow */}
        <div className="relative border-l border-slate-200 ml-4 md:ml-6 pl-8 md:pl-10 space-y-8 py-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative group">
                {/* Bullet Icon */}
                <span className="absolute -left-[50px] md:-left-[58px] top-0.5 w-10 h-10 rounded-xl bg-white border border-slate-200 group-hover:border-emerald-500 shadow-sm flex items-center justify-center text-emerald-600 transition-colors z-10">
                  <Icon className="w-5 h-5" />
                </span>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs group-hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-900 font-outfit text-base leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* State Machine Visualization banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 text-center space-y-4">
          <h3 className="text-lg font-bold font-outfit">State-Enforced Booking Lifespans</h3>
          
          <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-bold font-mono">
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400">REQUESTED</span>
            <span className="text-slate-600">→</span>
            <span className="px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">ACCEPTED</span>
            <span className="text-slate-600">→</span>
            <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">IN PROGRESS</span>
            <span className="text-slate-600">→</span>
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">COMPLETED</span>
          </div>
          
          <p className="text-[11px] text-slate-400 max-w-md mx-auto leading-relaxed">
            Every booking transitions dynamically through strict status stages, providing absolute visibility for customer safety and cooperative audits.
          </p>
        </div>

      </div>
    </div>
  );
};
