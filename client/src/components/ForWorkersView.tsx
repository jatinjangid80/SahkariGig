import React from 'react';
import { ShieldCheck, Award, Handshake, Users, ArrowRight, Clock, Star, Landmark, HelpCircle, CheckCircle2, QrCode } from 'lucide-react';

interface ForWorkersViewProps {
  onRegisterClick: () => void;
  onDemoWorkerClick?: () => void;
}

export const ForWorkersView: React.FC<ForWorkersViewProps> = ({ onRegisterClick, onDemoWorkerClick }) => {
  const benefits = [
    {
      icon: Landmark,
      title: 'Democratic Ownership',
      description: 'You are a shareholder and co-owner of the cooperative federation. Keep 100% of your earnings with zero exploitative middleman commission deductions.'
    },
    {
      icon: ShieldCheck,
      title: 'Official Digital ID & QR',
      description: 'Acquire official digital cooperative credentials with cryptographic verification to build instant trust with local households.'
    },
    {
      icon: Award,
      title: 'Standardized Fair Tariffs',
      description: 'Set your preferred working hours and earn society-approved hourly rates. Get paid directly to your bank account with zero hold-ups.'
    },
    {
      icon: Handshake,
      title: 'Cooperative Welfare & Insurance',
      description: 'Gain access to group accident insurance, emergency welfare funds, equipment loan support, and skill upgrade certifications.'
    }
  ];

  const faqs = [
    {
      q: 'How do I join a Labour Cooperative Federation?',
      a: 'Register online via SahkariGig with your Aadhaar KYC and skill experience. Your local district federation reviews your details and issues an official Digital Worker ID card.'
    },
    {
      q: 'Do I have to pay heavy commissions like on other apps?',
      a: 'No. SahkariGig is 100% worker-owned. You keep your entire earned tariff minus a tiny, nominal society membership fee used for worker insurance.'
    },
    {
      q: 'How do customers verify my cooperative membership?',
      a: 'Each worker is equipped with a tamper-proof QR code on their Digital ID. When arriving for a job, the customer scans the QR code to verify your active federation status.'
    }
  ];

  return (
    <div className="py-12 bg-slate-50 dark:bg-[#0b0f19] min-h-[calc(100vh-4rem)] transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>For Skilled Trades & Service Professionals</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-outfit">
            Work with Dignity. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-300">
              Own your Platform.
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
            Join thousands of electricians, plumbers, carpenters, and domestic professionals who are earning fairly, building lifelong reputations, and sharing democratic governance under Labour Cooperative Societies.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onRegisterClick}
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Register as Cooperative Member</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {onDemoWorkerClick && (
              <button
                type="button"
                onClick={onDemoWorkerClick}
                className="w-full sm:w-auto px-7 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm rounded-xl shadow-2xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Explore Worker Dashboard Demo</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-start space-x-4 hover:shadow-md hover:border-emerald-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white font-outfit text-base">{b.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed font-medium">{b.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 Simple Onboarding Steps */}
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-emerald-900/50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="relative z-10 space-y-8">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                Simple Onboarding
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-outfit mt-2">Join In 3 Simple Steps</h2>
              <p className="text-xs text-slate-300 mt-1">Get verified by your local Labour Cooperative society in under 48 hours.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
              <div className="space-y-2 relative">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold font-mono text-sm shadow-md">1</div>
                <h4 className="font-bold text-base font-outfit">Online Registration</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Submit your Aadhaar KYC, select your trade skills, and choose your local district cooperative chapter.
                </p>
              </div>

              <div className="space-y-2 relative">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold font-mono text-sm shadow-md">2</div>
                <h4 className="font-bold text-base font-outfit">Federation Verification</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Cooperative committee reviews credentials and activates your digital society membership.
                </p>
              </div>

              <div className="space-y-2 relative">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold font-mono text-sm shadow-md">3</div>
                <h4 className="font-bold text-base font-outfit">Get Digitized QR ID</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Receive your verifiable QR ID card, start accepting household jobs directly, and track 100% of your earnings.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onRegisterClick}
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>Start Worker Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Cooperative Model FAQs */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">
              Frequently Asked Questions on Cooperatives
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="space-y-1.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white font-outfit">{faq.q}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
