import React, { useState } from 'react';
import { Search, ShieldCheck, Sparkles, QrCode, Zap, ArrowRight, CheckCircle } from 'lucide-react';

interface HeroSectionProps {
  onSearchService?: (query: string) => void;
  onNavigate?: (path: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearchService, onNavigate }) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isClassifying, setIsClassifying] = useState(false);
  const [aiResult, setAiResult] = useState<{
    category: string;
    confidence: number;
    reason: string;
  } | null>(null);

  const handleAiRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsClassifying(true);
    setTimeout(() => {
      setIsClassifying(false);
      const text = aiPrompt.toLowerCase();
      if (text.includes('fan') || text.includes('wire') || text.includes('switch') || text.includes('light') || text.includes('mcb') || text.includes('spark')) {
        setAiResult({
          category: 'Electrician',
          confidence: 96,
          reason: 'Your request indicates electrical component repair or wiring troubleshooting.'
        });
      } else if (text.includes('pipe') || text.includes('leak') || text.includes('tap') || text.includes('drain') || text.includes('sink') || text.includes('water')) {
        setAiResult({
          category: 'Plumber',
          confidence: 94,
          reason: 'Your request involves plumbing fixtures, pipe repairs, or drainage.'
        });
      } else if (text.includes('paint') || text.includes('wall') || text.includes('color')) {
        setAiResult({
          category: 'Painter',
          confidence: 92,
          reason: 'Your request matches interior or exterior wall painting services.'
        });
      } else if (text.includes('door') || text.includes('wood') || text.includes('table') || text.includes('lock')) {
        setAiResult({
          category: 'Carpenter',
          confidence: 90,
          reason: 'Your request indicates woodwork, door fixing, or furniture assembly.'
        });
      } else {
        setAiResult({
          category: 'Technician',
          confidence: 88,
          reason: 'Matched general appliance repair and home technician service.'
        });
      }
    }, 600);
  };

  return (
    <section className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-12 pb-16 overflow-hidden">
      {/* Background Subtle Accent Circles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl" />
        <div className="absolute top-20 left-10 w-80 h-80 bg-sky-100/50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Trust Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>Ministry of Cooperation Registered Labour Federations</span>
          </div>
        </div>

        {/* Hero Main Heading & Copy */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] font-outfit">
            Trusted skilled workers, <br />
            <span className="text-emerald-700">backed by cooperatives.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Book verified local professionals for home and community services with transparent pricing, smart matching, and live worker verification.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                const elem = document.getElementById('services');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-md transition-all flex items-center justify-center"
            >
              Find a Worker
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button
              onClick={() => {
                if (onNavigate) onNavigate('/about');
              }}
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-2xl shadow-2xs transition-all flex items-center justify-center"
            >
              Become a Worker
            </button>
          </div>

          {/* Trust Row */}
          <div className="mt-10 pt-6 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium text-slate-600">
            <div className="flex items-center justify-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cooperative Verified</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>Digital Worker ID</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Smart Matching</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Secure Booking</span>
            </div>
          </div>
        </div>

        {/* AI Service Request Box */}
        <div id="ai-request-box" className="mt-12 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md relative">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900 font-outfit">What do you need help with?</h3>
            </div>

            <form onSubmit={handleAiRoute} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe your issue, e.g., 'ceiling fan is sparking and tripping MCB'"
                  className="w-full pl-4 pr-32 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={isClassifying || !aiPrompt.trim()}
                  className="absolute right-2 top-2 bottom-2 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center space-x-1"
                >
                  {isClassifying ? (
                    <span>Matching...</span>
                  ) : (
                    <>
                      <span>Find Service</span>
                      <Search className="w-3.5 h-3.5 ml-1" />
                    </>
                  )}
                </button>
              </div>

              {/* Sample prompts */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
                <span className="font-medium text-slate-600">Try typing:</span>
                <button
                  type="button"
                  onClick={() => setAiPrompt('ceiling fan is sparking and tripping MCB')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                >
                  "ceiling fan sparking"
                </button>
                <button
                  type="button"
                  onClick={() => setAiPrompt('kitchen pipe leaking under sink')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                >
                  "kitchen pipe leaking"
                </button>
                <button
                  type="button"
                  onClick={() => setAiPrompt('need house painter for 3 bedrooms')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                >
                  "house painter for 3 rooms"
                </button>
              </div>
            </form>

            {/* AI Classification Result Card */}
            {aiResult && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-left transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Recommended Service</span>
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-600 text-white rounded-md">
                      {aiResult.category}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">{aiResult.confidence}% Match</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-600">{aiResult.reason}</p>

                <button
                  onClick={() => {
                    if (onSearchService) onSearchService(aiResult.category);
                    const elem = document.getElementById('workers-directory');
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors flex items-center justify-center"
                >
                  See Available {aiResult.category} Workers
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
