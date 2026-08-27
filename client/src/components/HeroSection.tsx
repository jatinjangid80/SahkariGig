import React, { useState } from 'react';
import { Search, ShieldCheck, Sparkles, QrCode, Zap, ArrowRight, CheckCircle, Star } from 'lucide-react';

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
    <section className="relative bg-white pt-12 pb-20 overflow-hidden">
      {/* Premium Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[500px]">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[100px] opacity-70" />
          <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-sky-100/40 rounded-full blur-[80px] opacity-60" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Trust Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-200/60 text-emerald-800 text-xs font-bold shadow-sm backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="tracking-wide uppercase text-[10px]">Verified Cooperative Network</span>
          </div>
        </div>

        {/* Hero Main Heading & Copy */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-extrabold text-slate-900 tracking-tight leading-[1.1] font-outfit">
            Find trusted local work. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Build your cooperative workforce.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto">
            A community-centric marketplace where verified local professionals and cooperatives connect with households and businesses.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate && onNavigate('/workers')}
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center btn-interaction"
            >
              Hire Workers
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button
              onClick={() => {
                const elem = document.getElementById('for-workers');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-700 bg-white border border-slate-300 hover:border-emerald-500 hover:text-emerald-700 rounded-2xl shadow-sm transition-all flex items-center justify-center btn-interaction"
            >
              Find Work
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 mb-10 flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-slate-700">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
              142+ Active Members
            </div>
            <div className="flex items-center">
              <ShieldCheck className="w-5 h-5 text-emerald-500 mr-2" />
              98% Verified Profiles
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 text-amber-500 mr-2 fill-amber-500" />
              4.8 Average Rating
            </div>
          </div>
        </div>

        {/* AI Service Request Box (Prominent) */}
        <div id="ai-request-box" className="mt-6 max-w-3xl mx-auto z-20 relative">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xl">
            <div className="flex items-center space-x-2 mb-4">
              <h3 className="text-lg font-bold text-slate-900 font-outfit">What service do you need?</h3>
            </div>

            <form onSubmit={handleAiRoute} className="relative">
              <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Search for a service, skill or problem... (e.g., 'My ceiling fan is making noise')"
                className="w-full pl-12 pr-36 py-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
              <button
                type="submit"
                disabled={isClassifying || !aiPrompt.trim()}
                className="absolute right-2 top-2 bottom-2 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm rounded-lg shadow-sm transition-colors flex items-center space-x-2"
              >
                {isClassifying ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Find Service</span>
                )}
              </button>
            </form>
            <div className="mt-3 text-[11px] text-slate-500 font-medium flex items-center">
              <span className="mr-2 text-slate-400">Try:</span>
              <div className="flex space-x-2">
                <button onClick={() => setAiPrompt("AC repair")} className="hover:text-emerald-600 hover:underline">AC repair</button>
                 <span>·</span>
                <button onClick={() => setAiPrompt("plumber")} className="hover:text-emerald-600 hover:underline">plumber</button>
                <span>·</span>
                <button onClick={() => setAiPrompt("home painter")} className="hover:text-emerald-600 hover:underline">home painter</button>
                <span>·</span>
                <button onClick={() => setAiPrompt("electrician")} className="hover:text-emerald-600 hover:underline">electrician</button>
              </div>
            </div>

            {/* AI Classification Result (Demo) */}
            {aiResult && !isClassifying && (
              <div className="mt-4 p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-start space-x-3 animate-in slide-in-from-top-2 fade-in duration-300">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-2xl">
                  {aiResult.category === 'Electrician' && '⚡'}
                  {aiResult.category === 'Plumber' && '🔧'}
                  {aiResult.category === 'Painter' && '🎨'}
                  {aiResult.category === 'Carpenter' && '🪚'}
                  {aiResult.category === 'Technician' && '🛠️'}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {aiResult.category} service recommended
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">{aiResult.reason}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full shrink-0">
                      {aiResult.confidence}% match
                    </span>
                  </div>

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
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
