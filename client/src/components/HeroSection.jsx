import React, { useState } from 'react';
import { Sparkles, Search, ShieldCheck, ArrowRight, CheckCircle2, Zap, BrainCircuit } from 'lucide-react';

export default function HeroSection({ onSelectCategory, categories }) {
  const [promptText, setPromptText] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const handleAIServiceRoute = async (e) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setLoadingAI(true);
    setAiResult(null);

    try {
      const res = await fetch('/api/ai/classify-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: promptText })
      });
      const data = await res.json();
      setAiResult(data);

      if (data.matchedCategory) {
        setTimeout(() => {
          onSelectCategory(data.matchedCategory);
        }, 1800);
      }
    } catch (err) {
      console.error('AI Routing error:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="relative overflow-hidden py-12 lg:py-16">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Announcement Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 mb-6 shadow-inner">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-semibold text-emerald-400">Cooperative Labour Federation Network</span>
          <span className="text-slate-500">•</span>
          <span className="text-xs text-slate-300">Verified Skilled Workforce</span>
        </div>

        {/* Headline */}
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Trust-First <span className="gradient-text">Cooperative</span> Gig Marketplace
          </h1>
          <p className="mt-4 text-lg text-slate-300 leading-relaxed">
            Connecting verified cooperative-affiliated electricians, plumbers, carpenters, painters, and technicians directly to households and community projects with digital identity verification & AI matching.
          </p>
        </div>

        {/* Free-Text AI Routing Box */}
        <div className="mt-8 max-w-2xl">
          <div className="p-2 rounded-2xl glass-panel border border-emerald-500/30 shadow-2xl">
            <form onSubmit={handleAIServiceRoute} className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <BrainCircuit className="absolute left-3.5 top-3.5 w-5 h-5 text-emerald-400" />
                <input
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder='Describe issue e.g., "my ceiling fan is sparking and tripping MCB"'
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm border border-slate-800"
                />
              </div>
              <button
                type="submit"
                disabled={loadingAI}
                className="w-full sm:w-auto px-6 py-3 gradient-bg hover:opacity-95 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {loadingAI ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>AI Classifying...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>AI Route</span>
                  </>
                )}
              </button>
            </form>

            {/* AI Classification Feedback Badge */}
            {aiResult && (
              <div className="mt-3 p-3 bg-slate-900/90 rounded-xl border border-emerald-500/40 animate-fade-in flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">AI Classification Result:</span>
                    <span className="px-2 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 rounded-md border border-emerald-500/40">
                      {aiResult.matchedCategory || 'General Assistance'}
                    </span>
                    <span className="text-xs text-slate-400">({(aiResult.confidence * 100).toFixed(0)}% confidence)</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{aiResult.explanation}</p>
                </div>
              </div>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-400 flex items-center space-x-2">
            <span>Try typing:</span>
            <button onClick={() => setPromptText('Kitchen pipe leak causing water flooding')} className="underline hover:text-emerald-400">"kitchen pipe leak"</button>
            <span>•</span>
            <button onClick={() => setPromptText('Need painter for 3 room wall putty and acrylic paint')} className="underline hover:text-emerald-400">"painter for 3 rooms"</button>
          </p>
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">100% Cooperative</p>
              <p className="text-xs text-slate-400">Governed by Labour Societies</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">QR Digital ID Card</p>
              <p className="text-xs text-slate-400">Live background verification</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Smart Match Engine</p>
              <p className="text-xs text-slate-400">Skill + Distance + Rating</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Crew Projects</p>
              <p className="text-xs text-slate-400">Multi-trade renovation crews</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
