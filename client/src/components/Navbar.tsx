import React from 'react';
import { ShieldCheck, Activity } from 'lucide-react';
import { CONFIG } from '../config';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('/')}>
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-extrabold text-lg">
              Cg
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white font-outfit">{CONFIG.appName}</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full uppercase">
                  {CONFIG.phase}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Ministry of Cooperation • SIH26089</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => onNavigate('/')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentPath === '/'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('/about')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentPath === '/about'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              About
            </button>

            <button
              onClick={() => onNavigate('/contact')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentPath === '/contact'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Contact
            </button>

            <button
              onClick={() => onNavigate('/status')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
                currentPath === '/status'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Status</span>
            </button>

            <button
              onClick={() => onNavigate('/contact')}
              className="ml-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all hidden md:block"
            >
              Join the cooperative
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};
