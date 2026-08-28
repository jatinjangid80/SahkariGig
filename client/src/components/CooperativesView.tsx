import React from 'react';
import { ShieldCheck, BookOpen, Scale, Award, Landmark, Users } from 'lucide-react';

export const CooperativesView: React.FC = () => {
  const federations = [
    {
      name: 'Delhi Labour Cooperative Federation',
      societies: 48,
      members: '4,500+',
      district: 'NCR Delhi',
      established: 1982
    },
    {
      name: 'NCR Multi-State Cooperative Society',
      societies: 32,
      members: '3,200+',
      district: 'Multi-State (Delhi, Haryana, UP)',
      established: 2011
    },
    {
      name: 'Northern India Allied Services Cooperative',
      societies: 18,
      members: '1,800+',
      district: 'Haryana & Punjab region',
      established: 2005
    }
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-[calc(100vh-4rem)] font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title Heading */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Governance & Affiliation
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-outfit">
            Our Cooperative Infrastructure
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-medium">
            Discover how Labour Cooperative Federations and Societies power the platform, ensuring transparency, fair governance, and community support.
          </p>
        </div>

        {/* Pillars of Cooperative Backing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 font-outfit text-base">State Registered</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Every participating society is legally registered under the Cooperative Societies Act, fully audited by the state registrar.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 font-outfit text-base">Democratic Control</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Workers participate in general body meetings, vote on platform policies, and democratically elect society board leaders.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 font-outfit text-base">Social Welfare</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Revenue surpluses fund insurance premiums, retirement accounts, family educational grants, and trade-focused tool kits.
            </p>
          </div>
        </div>

        {/* List of Registered Federations */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 font-outfit uppercase tracking-wider text-left pl-2">
            Affiliated Labour Federations
          </h2>
          
          <div className="space-y-4">
            {federations.map((fed, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-slate-900 font-outfit leading-tight">{fed.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-mono font-bold">Est. {fed.established}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Operating coverage: {fed.district}</p>
                </div>

                <div className="flex gap-4 shrink-0 text-xs">
                  <div className="px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-100 text-center min-w-[90px]">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Societies</p>
                    <p className="text-lg font-extrabold text-slate-950 font-outfit mt-0.5">{fed.societies}</p>
                  </div>
                  <div className="px-3.5 py-2 bg-emerald-50 rounded-xl border border-emerald-100 text-center min-w-[90px]">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase">Members</p>
                    <p className="text-lg font-extrabold text-emerald-800 font-outfit mt-0.5">{fed.members}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
