import React from 'react';
import { Home, UserCheck, ShieldCheck } from 'lucide-react';
import { CONFIG } from '../config';

export const RolesSection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">ROLES</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1 font-outfit">
            Three roles, one cooperative
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            Role-aware experiences arrive in later phases; the foundation defines them once, centrally in backend and frontend configurations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONFIG.roles.map((r) => {
            return (
              <div key={r.role} className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700">
                      {r.role}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Phase 0 Schema</span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-outfit">{r.tagline}</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{r.description}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
