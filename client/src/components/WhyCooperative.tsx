import React from 'react';
import { ShieldCheck, Users, HeartHandshake } from 'lucide-react';

export const WhyCooperative: React.FC = () => {
  return (
    <section className="py-16 border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">WHY COOPERATIVE</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1 font-outfit">
            A trustworthy base for local service work
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            This release establishes the shared foundation: design system, layout, routing, API structure, and configuration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-outfit">Verified by the cooperative</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Every worker is vetted and backed by their cooperative federation, so households know exactly who shows up at their doorstep.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-500/20">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-outfit">Worker-owned by design</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Cooperative admins govern membership and quality standards; workers share in the value they create with democratic ownership.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/20">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-outfit">Built for community trust</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Clear pricing, fair terms, and accountable service for households and community customers across all major trades.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
