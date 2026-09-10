import React from 'react';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  ShieldCheck, 
  PhoneCall, 
  CheckCircle2
} from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
  currentUser?: any;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, currentUser }) => {
  return (
    <footer className="bg-slate-100/80 dark:bg-[#070b14] text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800/80 pt-16 pb-12 font-sans relative overflow-hidden transition-colors duration-200">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Grid: Brand & Column Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-slate-200 dark:border-slate-800/80">
          
          {/* Brand & Description (Spans 2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => onNavigate('/')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-emerald-500 dark:to-emerald-700 flex items-center justify-center text-white font-extrabold text-xl tracking-tight shadow-md transition-transform group-hover:scale-105">
                Sg
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-slate-900 dark:text-white text-xl tracking-tight font-outfit">
                    SahkariGig
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 shadow-2xs">
                    <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600 dark:text-emerald-400" />
                    Cooperative Network
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Worker-owned & governed marketplace</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-md">
              India's community-powered cooperative platform connecting verified local trade professionals with households. Zero exploitative commissions, 100% background-verified professionals, and transparent community pricing.
            </p>

            {/* Helpline Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900/90 border border-emerald-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Cooperative Support: <strong className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">+91 141-2890123</strong> (<span className="text-emerald-600 dark:text-emerald-400">help@sahkarigig.in</span>)</span>
            </div>
          </div>

          {/* Column 1: Platform Links */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider font-outfit">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors text-slate-600 dark:text-slate-400 hover:underline cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/workers')} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors text-slate-600 dark:text-slate-400 hover:underline cursor-pointer">
                  Hire Talent
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors text-slate-600 dark:text-slate-400 hover:underline cursor-pointer">
                  All Services
                </button>
              </li>
              {!currentUser && (
                <li>
                  <button onClick={() => onNavigate('/for-workers')} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors text-slate-600 dark:text-slate-400 hover:underline cursor-pointer">
                    Find Jobs (Join as Worker)
                  </button>
                </li>
              )}
              <li>
                <button onClick={() => onNavigate('/how-it-works')} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors text-slate-600 dark:text-slate-400 hover:underline cursor-pointer">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors text-slate-600 dark:text-slate-400 hover:underline cursor-pointer">
                  About Cooperatives
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Popular Trades */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider font-outfit">
              Popular Services
            </h4>
            <ul className="space-y-2.5 text-sm flex flex-col items-start">
              <li><button onClick={() => onNavigate('/services')} className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors hover:underline text-left cursor-pointer">Electrical Repairs</button></li>
              <li><button onClick={() => onNavigate('/services')} className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors hover:underline text-left cursor-pointer">Plumbing & Sanitation</button></li>
              <li><button onClick={() => onNavigate('/services')} className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors hover:underline text-left cursor-pointer">AC Service & Cooling</button></li>
              <li><button onClick={() => onNavigate('/services')} className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors hover:underline text-left cursor-pointer">Carpentry & Woodwork</button></li>
              <li><button onClick={() => onNavigate('/services')} className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors hover:underline text-left cursor-pointer">Painting & Polishing</button></li>
              <li><button onClick={() => onNavigate('/services')} className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors hover:underline text-left cursor-pointer">Deep Home Cleaning</button></li>
            </ul>
          </div>

          {/* Column 3: Cooperative Standards & Connect */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider font-outfit">
              Trust & Security
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-medium text-slate-700 dark:text-slate-300">100% Background Verified</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Transparent Fixed Rates</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Direct Worker Payouts</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Doorstep QR Verification</span>
              </li>
            </ul>

            <div className="pt-2">
              <h5 className="text-[11px] font-bold uppercase text-slate-800 dark:text-slate-300 tracking-wider mb-2.5">
                Connect With Us
              </h5>
              <div className="flex items-center space-x-2.5">
                <a
                  href="https://github.com/jatinjangid80/SahkariGig"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 hover:border-emerald-600 text-slate-600 dark:text-slate-400 shadow-2xs transition-all hover:scale-105 flex items-center justify-center cursor-pointer"
                  title="GitHub Repository"
                  aria-label="GitHub Repository"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 hover:border-emerald-600 text-slate-600 dark:text-slate-400 shadow-2xs transition-all hover:scale-105 flex items-center justify-center cursor-pointer"
                  title="Twitter"
                  aria-label="Twitter Profile"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 hover:border-emerald-600 text-slate-600 dark:text-slate-400 shadow-2xs transition-all hover:scale-105 flex items-center justify-center cursor-pointer"
                  title="LinkedIn"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Designer, and Links */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 SahkariGig. All rights reserved.</p>

          <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-400">
            <span>Designed & Deployed by</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 tracking-wide">
              Jatin Jangid
            </span>
          </div>

          <div className="flex items-center space-x-4 text-slate-500 dark:text-slate-400">
            <button onClick={() => onNavigate('/about')} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer hover:underline">Privacy</button>
            <span>•</span>
            <button onClick={() => onNavigate('/about')} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer hover:underline">Terms</button>
            <span>•</span>
            <button onClick={() => onNavigate('/about')} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer hover:underline">Security</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
