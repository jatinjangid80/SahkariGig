import React from 'react';

interface FooterProps {
  onNavigate: (path: string) => void;
  currentUser?: any;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, currentUser }) => {
  return (
    <footer className="bg-[#0F172A] text-white pt-14 pb-10 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Top Brand & Mission Summary */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => onNavigate('/')}>
              <div className="w-8 h-8 rounded-full bg-[#166534] flex items-center justify-center text-white font-black text-xs font-outfit shadow-sm shrink-0">
                SG
              </div>
              <span className="text-2xl font-black text-white font-outfit tracking-tight">
                Sahkari<span className="text-emerald-400">Gig</span>
              </span>
            </div>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Cooperative workforce platform connecting customers with verified local professionals. Work Together. Earn Fairly. Grow Together.
            </p>
          </div>
        </div>

        {/* 4 Clean Columns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">

          {/* Column 1: PLATFORM */}
          <div className="space-y-3.5">
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#94A3B8]">
              PLATFORM
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/dashboard')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Bookings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/dashboard')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Payments
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: WORKERS */}
          <div className="space-y-3.5">
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#94A3B8]">
              WORKERS
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button onClick={() => onNavigate('/for-workers')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Join Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/dashboard')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Worker Login
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/dashboard')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Earnings & Welfare
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: COMPANY */}
          <div className="space-y-3.5">
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#94A3B8]">
              COMPANY
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors cursor-pointer text-left">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/how-it-works')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Cooperatives
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Our Mission
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: SUPPORT */}
          <div className="space-y-3.5">
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#94A3B8]">
              SUPPORT
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button onClick={() => onNavigate('/help')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Help Center
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Contact
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/help')} className="hover:text-white transition-colors cursor-pointer text-left">
                  FAQs
                </button>
              </li>
            </ul>
          </div>

        </div>



        {/* Bottom Copyright & Legal Links */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#94A3B8] border-t border-slate-800/60">
          <p>© 2026 SahkariGig. All rights reserved.</p>
          <div className="flex items-center space-x-5">
            <button onClick={() => onNavigate('/help')} className="hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('/help')} className="hover:text-white transition-colors cursor-pointer">
              Terms of Service
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('/help')} className="hover:text-white transition-colors cursor-pointer">
              Refund Policy
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
