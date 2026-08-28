import React from 'react';
import { ShieldCheck, Award, Handshake, Users, ArrowRight, Clock, Star, Landmark } from 'lucide-react';

interface ForWorkersViewProps {
  onRegisterClick: () => void;
}

export const ForWorkersView: React.FC<ForWorkersViewProps> = ({ onRegisterClick }) => {
  const benefits = [
    {
      icon: Landmark,
      title: 'Democratic Ownership',
      description: 'You are a shareholder and owner of the cooperative federation. Keep 100% of your earnings, with no exploitative middleman fees.'
    },
    {
      icon: ShieldCheck,
      title: 'Vetted Verification',
      description: 'Acquire official digital cooperative credentials. Build trust with local households and businesses instantly.'
    },
    {
      icon: Award,
      title: 'Fair Tariffs & Work Hours',
      description: 'Set your schedule and earn standardized, society-approved hourly rates. Get paid directly and securely online.'
    },
    {
      icon: Handshake,
      title: 'Social Security benefits',
      description: 'Gain access to cooperative insurance, group savings schemes, skill training, and federation welfare funds.'
    }
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            For Skilled Professionals & Tradespeople
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-outfit">
            Work with Dignity. Own your Platform.
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
            Join thousands of electricians, plumbers, carpenters, and domestic professionals who are earning fairly, building reputations, and sharing democratic governance under Labour Cooperative Societies.
          </p>
        </div>

        {/* Dynamic Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start space-x-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 font-outfit text-base">{b.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">{b.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Onboarding Stages Flow */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="relative z-10 space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-outfit">Join In 3 Simple Steps</h2>
              <p className="text-xs text-slate-400 mt-1">Ready to activate your digital cooperative account?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
              <div className="space-y-2 relative">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold font-mono">1</div>
                <h4 className="font-bold text-base font-outfit">Register & Pick Trade</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sign up via this portal or your local cooperative admin. Select your approved skills and federations.
                </p>
              </div>

              <div className="space-y-2 relative">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold font-mono">2</div>
                <h4 className="font-bold text-base font-outfit">Verification Audit</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cooperative admins verify your credentials and active society membership.
                </p>
              </div>

              <div className="space-y-2 relative">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold font-mono">3</div>
                <h4 className="font-bold text-base font-outfit">Get Digitized ID</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Unlock your QR identity card, start accepting household bookings, and coordinate with customers in real-time.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex justify-center sm:justify-start">
              <button
                onClick={onRegisterClick}
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-emerald-500/25 flex items-center space-x-2 transition-all cursor-pointer"
              >
                <span>Register as a Worker</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
