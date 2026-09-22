import React, { useState } from 'react';
import {
  Search, Users, MessageSquare, ShieldCheck, CreditCard,
  ArrowRight, Check, CheckCircle2, Star, Sparkles, MapPin,
  HeartHandshake, PhoneCall, QrCode, Lock, Building2
} from 'lucide-react';

interface HowSahkariWorksSectionProps {
  onExploreServices?: () => void;
  onNavigate?: (path: string) => void;
  onOpenAuth?: (role: 'Customer' | 'Worker', mode: 'signin' | 'signup') => void;
}

export const HowSahkariWorksSection: React.FC<HowSahkariWorksSectionProps> = ({
  onExploreServices,
  onNavigate,
  onOpenAuth
}) => {
  const [journeyType, setJourneyType] = useState<'customer' | 'worker'>('customer');
  const [activeStep, setActiveStep] = useState<number>(0);

  const customerSteps = [
    {
      step: '01',
      title: 'Post Your Work',
      badge: 'Quick & Simple',
      description: 'Tell us what you need, select your service trade, and pick your preferred time and location.',
      highlight: 'Takes under 60 seconds',
      icon: Search
    },
    {
      step: '02',
      title: 'Get Matched',
      badge: 'Location-Based',
      description: 'SahkariGig matches you with certified, background-verified cooperative workers available in your neighborhood.',
      highlight: '3+ verified workers nearby',
      icon: Users
    },
    {
      step: '03',
      title: 'Connect & Discuss',
      badge: 'Direct Communication',
      description: 'Chat or call directly with the matched worker to discuss schedule, task scope, and standard transparent pricing.',
      highlight: 'Direct in-app chat & call',
      icon: MessageSquare
    },
    {
      step: '04',
      title: 'Verify Before Work',
      badge: 'Safe & Secure',
      description: 'Verify your worker’s digital Sahkari ID and QR badge upon arrival before work begins for complete peace of mind.',
      highlight: 'Tamper-proof digital ID',
      icon: ShieldCheck
    },
    {
      step: '05',
      title: 'Complete & Pay',
      badge: 'Transparent Pricing',
      description: 'Approve the finished job and pay securely. 95% of your payment goes directly into the worker’s bank account.',
      highlight: 'Fair pay & 5-star ratings',
      icon: CreditCard
    }
  ];

  const workerSteps = [
    {
      step: '01',
      title: 'Register & KYC',
      badge: 'Cooperative Member',
      description: 'Sign up, verify your Aadhaar / trade credentials, and join your local registered worker cooperative.',
      highlight: '100% verified membership',
      icon: ShieldCheck
    },
    {
      step: '02',
      title: 'Receive Job Matches',
      badge: 'Local Demand',
      description: 'Get notified for incoming customer requests in your trade and location with guaranteed minimum rates.',
      highlight: 'Zero bidding wars',
      icon: Search
    },
    {
      step: '03',
      title: 'Connect & Confirm',
      badge: 'Direct Client Chat',
      description: 'Talk with the customer, confirm project timing, and get clear location directions without intermediaries.',
      highlight: 'Direct customer contact',
      icon: MessageSquare
    },
    {
      step: '04',
      title: 'Deliver Quality Work',
      badge: 'Professional Standards',
      description: 'Show your digital Sahkari QR ID, deliver the service with pride, and maintain high cooperative quality.',
      highlight: 'Standardized rate card',
      icon: CheckCircle2
    },
    {
      step: '05',
      title: 'Direct Instant Payout',
      badge: '95% Take-Home',
      description: 'Receive 95% of job earnings directly into your bank or UPI, plus automatic accident welfare coverage.',
      highlight: 'Same-day bank settlement',
      icon: CreditCard
    }
  ];

  const steps = journeyType === 'customer' ? customerSteps : workerSteps;

  return (
    <section id="how-sahkari-works" className="py-16 sm:py-24 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 1. User-Focused Heading Hierarchy */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10 sm:mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#166534] text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIMPLE & TRANSPARENT PROCESS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight font-outfit">
            How SahkariGig Works
          </h2>

          <p className="text-base sm:text-lg text-[#64748B] font-medium leading-relaxed max-w-2xl mx-auto">
            From finding the right verified worker to completing the job — everything happens in five simple steps.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-2 text-xs sm:text-sm font-bold text-[#0F172A]">
            <div className="flex items-center space-x-1.5">
              <span className="text-[#16A34A] font-extrabold text-base">✓</span>
              <span>Verified Workers</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[#16A34A] font-extrabold text-base">✓</span>
              <span>Direct Chat</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[#16A34A] font-extrabold text-base">✓</span>
              <span>Transparent Payments</span>
            </div>
          </div>

          {/* Customer / Worker Journey Toggle */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex p-1 rounded-full bg-[#F1F5F9] border border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => { setJourneyType('customer'); setActiveStep(0); }}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  journeyType === 'customer'
                    ? 'bg-[#166534] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                👤 Customer Journey
              </button>
              <button
                type="button"
                onClick={() => { setJourneyType('worker'); setActiveStep(0); }}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  journeyType === 'worker'
                    ? 'bg-[#166534] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                🛠️ Worker Journey
              </button>
            </div>
          </div>
        </div>

        {/* 2. Interactive Timeline Progress Bar */}
        <div className="hidden lg:flex items-center justify-between max-w-4xl mx-auto mb-10 relative">
          <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-[#E2E8F0] -z-0">
            <div
              className="h-full bg-[#166534] transition-all duration-300"
              style={{ width: `${(activeStep / 4) * 100}%` }}
            />
          </div>

          {steps.map((s, idx) => {
            const isCompleted = idx < activeStep;
            const isActive = idx === activeStep;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 border-2 ${
                    isActive
                      ? 'bg-[#166534] text-white border-[#166534] shadow-md scale-110'
                      : isCompleted
                      ? 'bg-[#DCFCE7] text-[#166534] border-[#166534]'
                      : 'bg-white text-[#64748B] border-[#CBD5E1] group-hover:border-[#166534]'
                  }`}
                >
                  {isCompleted ? '✓' : s.step}
                </div>
                <span className={`text-[11px] font-bold mt-2 truncate max-w-[100px] text-center ${
                  isActive ? 'text-[#166534]' : 'text-[#64748B]'
                }`}>
                  {s.title.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. Main Interactive Grid: Left Steps List + Right Live UI Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left: 5 Interactive Step Cards */}
          <div className="lg:col-span-6 space-y-3">
            {steps.map((stepItem, index) => {
              const isActive = activeStep === index;
              const Icon = stepItem.icon;
              return (
                <div
                  key={stepItem.step}
                  onClick={() => setActiveStep(index)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#F0FDF4] border-[#166534] shadow-sm ring-1 ring-[#166534]'
                      : 'bg-white border-[#E2E8F0] hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-xs transition-colors ${
                        isActive
                          ? 'bg-[#166534] text-white'
                          : 'bg-[#F1F5F9] text-[#475569]'
                      }`}>
                        {stepItem.step}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className={`font-bold text-base font-outfit ${
                            isActive ? 'text-[#166534]' : 'text-[#0F172A]'
                          }`}>
                            {stepItem.title}
                          </h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-[#DCFCE7] text-[#166534]'
                              : 'bg-[#F1F5F9] text-[#64748B]'
                          }`}>
                            {stepItem.badge}
                          </span>
                        </div>

                        <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed font-medium">
                          {stepItem.description}
                        </p>
                      </div>
                    </div>

                    <div className={`shrink-0 text-xs font-bold ${
                      isActive ? 'text-[#166534]' : 'text-[#94A3B8]'
                    }`}>
                      {isActive ? '●' : '○'}
                    </div>
                  </div>

                  {/* Highlight pill */}
                  <div className="mt-3 pt-2.5 border-t border-[#E2E8F0]/60 flex items-center justify-between text-[11px] font-semibold text-[#166534]">
                    <span>{stepItem.highlight}</span>
                    <span className="text-[10px] text-[#64748B]">Click to preview →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Dynamic Product UI Mockup Box */}
          <div className="lg:col-span-6">
            <div className="bg-[#0F172A] rounded-3xl p-1.5 sm:p-2 shadow-xl border border-slate-800 text-white">
              
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] text-slate-400 font-mono ml-2">sahkarigig.app/workflow</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 font-mono">
                  STEP 0{activeStep + 1} LIVE PREVIEW
                </span>
              </div>

              {/* Window Mockup Body */}
              <div className="p-4 sm:p-6 bg-[#0B1120] rounded-2xl min-h-[380px] flex flex-col justify-center">

                {/* MOCKUP 0: Post Your Work / Register */}
                {activeStep === 0 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                          🔧
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Selected Service: Plumbing</p>
                          <p className="text-[11px] text-slate-400">Pipe Leakage & Tap Fittings</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-800">
                        ₹300 Standard
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Location</span>
                        <p className="font-bold text-white mt-0.5 flex items-center">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                          Jaipur, Rajasthan
                        </p>
                      </div>
                      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Preferred Time</span>
                        <p className="font-bold text-white mt-0.5">Today, 3:00 PM</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveStep(1)}
                      className="w-full py-3 bg-[#166534] hover:bg-[#14532D] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                    >
                      <span>Find Matching Verified Workers</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* MOCKUP 1: Get Matched / Receive Matches */}
                {activeStep === 1 && (
                  <div className="space-y-3.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs pb-1">
                      <span className="font-bold text-slate-300">Available Verified Workers Nearby</span>
                      <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        3 Pros Online
                      </span>
                    </div>

                    {/* Pro Card 1 */}
                    <div className="bg-slate-900/90 p-3.5 rounded-xl border border-emerald-500/40 shadow-sm flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                          RS
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <p className="text-xs font-bold text-white">Rajesh Sharma</p>
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.2 rounded">
                              ✓ KYC
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">Plumber · 140+ Jobs Completed</p>
                          <div className="flex items-center space-x-2 text-[10px] text-amber-400 font-bold mt-0.5">
                            <span>★ 4.9 (88 reviews)</span>
                            <span className="text-slate-500">·</span>
                            <span className="text-slate-400">2.1 km away</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveStep(2)}
                        className="px-3 py-1.5 bg-[#166534] hover:bg-[#14532D] text-white text-xs font-bold rounded-lg cursor-pointer"
                      >
                        Match Found
                      </button>
                    </div>

                    {/* Pro Card 2 */}
                    <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800 flex items-center justify-between opacity-75">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-xs">
                          VK
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Vikram Kumar</p>
                          <p className="text-[11px] text-slate-400">Plumber & Electrician · 4.8★</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400">3.4 km away</span>
                    </div>
                  </div>
                )}

                {/* MOCKUP 2: Connect & Discuss / Chat */}
                {activeStep === 2 && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    {/* Chat Header */}
                    <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <span className="font-bold text-white">Rajesh Sharma (Plumber)</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Direct In-App Chat</span>
                    </div>

                    {/* Chat Messages */}
                    <div className="space-y-2 py-2">
                      <div className="bg-slate-800/80 p-2.5 rounded-xl rounded-tl-none max-w-[85%] text-xs text-slate-200 border border-slate-700/60">
                        <p className="font-semibold text-[10px] text-emerald-400 mb-0.5">Customer</p>
                        Hi Rajesh ji, my kitchen pipe is leaking under the sink. Can you visit today at 3:00 PM?
                      </div>

                      <div className="bg-[#166534]/40 p-2.5 rounded-xl rounded-tr-none max-w-[85%] ml-auto text-xs text-emerald-100 border border-[#166534]">
                        <p className="font-semibold text-[10px] text-emerald-300 mb-0.5">Rajesh Sharma (Worker)</p>
                        Namaste! Yes, I am nearby in Vaishali Nagar. I will arrive at 3:00 PM with standard fittings.
                      </div>
                    </div>

                    {/* Quick Input Bar */}
                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="text"
                        readOnly
                        value="Confirming booking for 3:00 PM today..."
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
                      />
                      <button
                        onClick={() => setActiveStep(3)}
                        className="px-4 py-2 bg-[#166534] text-white font-bold text-xs rounded-lg cursor-pointer"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}

                {/* MOCKUP 3: Verify Before Work */}
                {activeStep === 3 && (
                  <div className="space-y-3.5 animate-in fade-in duration-200">
                    <div className="bg-slate-900/90 rounded-2xl p-4 border-2 border-emerald-500/50 shadow-md space-y-3 text-center">
                      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>VERIFIED COOPERATIVE WORKER</span>
                      </div>

                      <div className="flex items-center justify-center space-x-4 pt-1">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white font-extrabold flex items-center justify-center text-xl shadow-xs border border-emerald-600">
                          RS
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-sm text-white">Rajesh Sharma</h4>
                          <p className="text-xs text-slate-300">Cooperative ID: <span className="font-mono text-emerald-400 font-bold">SG-RAJ-4091</span></p>
                          <p className="text-[11px] text-slate-400">Jaipur Central Cooperative Society</p>
                        </div>
                      </div>

                      <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/80 text-xs text-emerald-300 font-medium flex items-center justify-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Aadhaar KYC Verified · Police Verified · Skill Certified</span>
                      </div>

                      <button
                        onClick={() => setActiveStep(4)}
                        className="w-full py-2.5 bg-[#166534] hover:bg-[#14532D] text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Verify & Begin Service
                      </button>
                    </div>
                  </div>
                )}

                {/* MOCKUP 4: Complete & Pay */}
                {activeStep === 4 && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                        <span className="font-bold text-white">Work Completed & Approved</span>
                        <span className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                          Invoice #SG-8902
                        </span>
                      </div>

                      {/* Transparent Breakdown */}
                      <div className="space-y-1.5 text-xs text-slate-300">
                        <div className="flex justify-between">
                          <span>Total Service Amount:</span>
                          <span className="font-bold text-white">₹500.00</span>
                        </div>
                        <div className="flex justify-between text-emerald-400 text-[11px]">
                          <span>Worker Payout (95% direct):</span>
                          <span className="font-bold">₹475.00</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-[11px]">
                          <span>Coop Platform Fee (3%):</span>
                          <span>₹15.00</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-[11px]">
                          <span>Worker Welfare & Accident Fund (2%):</span>
                          <span>₹10.00</span>
                        </div>
                      </div>

                      {/* Rating Stars */}
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-400">Rate Rajesh Sharma:</span>
                        <div className="flex text-amber-400 text-sm">
                          {'★★★★★'}
                        </div>
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={() => {
                            const elem = document.getElementById('workers-directory');
                            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="w-full py-2.5 bg-[#166534] hover:bg-[#14532D] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center space-x-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Pay ₹500 & Settle Instant Payout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>

        </div>

        {/* 4. Bottom Action CTA Banner */}
        <div className="mt-14 sm:mt-20 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#166534] to-[#0F766E] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-black font-outfit tracking-tight">
              Ready to get your project started?
            </h3>
            <p className="text-emerald-100 text-sm sm:text-base font-medium max-w-xl">
              Connect directly with verified local cooperative professionals near you in minutes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                const elem = document.getElementById('workers-directory');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                else if (onNavigate) onNavigate('/workers');
              }}
              className="px-6 py-3 bg-white text-[#166534] hover:bg-slate-100 font-bold text-sm rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center space-x-2"
            >
              <span>Find a Worker</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (onOpenAuth) onOpenAuth('Worker', 'signup');
                else if (onNavigate) onNavigate('/for-workers');
              }}
              className="px-6 py-3 bg-[#14532D] hover:bg-[#052E16] text-white font-bold text-sm rounded-xl border border-emerald-400/40 transition-all cursor-pointer flex items-center space-x-2"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Become a Worker</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
