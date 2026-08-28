import React from 'react';
import { CONFIG } from '../config';
import { Github, Twitter, Linkedin, ShieldCheck, PhoneCall, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 font-sans relative overflow-hidden">
      {/* Background Accent Blur */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Grid: Brand & Column Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-slate-800">
          
          {/* Brand & Description (Spans 2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => onNavigate('/')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-extrabold text-xl tracking-tight shadow-md transition-transform group-hover:scale-105">
                Sg
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-white text-xl tracking-tight font-outfit">
                    SahkariGig
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" />
                    Cooperative Network
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Worker-owned platform</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-400 max-w-md">
              Cooperative gig services, owned by the people who do the work. Empowering local communities with transparent pricing, smart matching, and 100% verified trade professionals.
            </p>

            {/* Emergency / Helpline Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-emerald-400 shadow-xs">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cooperative Support: <strong className="text-white">1800-SAHKARI-GIG</strong></span>
            </div>
          </div>

          {/* Column 1: Platform Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-outfit">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-emerald-400 transition-colors text-slate-400 hover:underline">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/#services')} className="hover:text-emerald-400 transition-colors text-slate-400 hover:underline">
                  Find Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/#for-workers')} className="hover:text-emerald-400 transition-colors text-slate-400 hover:underline">
                  Join as Worker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/verify')} className="hover:text-emerald-400 transition-colors text-slate-400 hover:underline">
                  Verify Worker ID
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-emerald-400 transition-colors text-slate-400 hover:underline">
                  About Cooperatives
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Popular Trades */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-outfit">Popular Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-slate-400 hover:text-white cursor-pointer">Electrical Repairs</span></li>
              <li><span className="text-slate-400 hover:text-white cursor-pointer">Plumbing & Sanitation</span></li>
              <li><span className="text-slate-400 hover:text-white cursor-pointer">Carpentry & Woodwork</span></li>
              <li><span className="text-slate-400 hover:text-white cursor-pointer">Painting & Polishing</span></li>
              <li><span className="text-slate-400 hover:text-white cursor-pointer">Home Cleaning</span></li>
            </ul>
          </div>

          {/* Column 3: Cooperative Standards & Connect */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-outfit">Trust & Security</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>100% Background Verified</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Transparent Fixed Rates</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Direct Worker Payouts</span>
              </li>
            </ul>

            <div className="pt-2">
              <h5 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">Connect With Us</h5>
              <div className="flex items-center space-x-3">
                <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center text-slate-400">
                  <Github className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center text-slate-400">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center text-slate-400">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Jatin Jangid Creator Badge */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 text-center md:text-left">
            <p>© 2026 SahkariGig. All rights reserved.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">SIH Problem Statement ID: <span className="font-semibold text-slate-300">SIH26089</span></p>
          </div>
          
          <div className="flex items-center space-x-1.5 text-xs bg-gradient-to-r from-slate-800 via-slate-800/90 to-slate-800 px-4 py-2.5 rounded-full border border-slate-700/80 shadow-md">
            <span className="text-slate-300">Designed and Deployed by</span>
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-outfit tracking-wide text-sm ml-1">
              Jatin Jangid
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
