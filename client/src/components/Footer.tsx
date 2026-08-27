import React from 'react';
import { CONFIG } from '../config';
import { Github, Twitter, Linkedin, Heart, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 lg:py-16 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16">
          
          {/* Brand & Description */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('/')}>
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-extrabold text-sm tracking-tight shadow-sm">
                Cg
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-white text-xl tracking-tight font-outfit">{CONFIG.appName}</span>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                  {CONFIG.phase}
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-md">
              {CONFIG.appTagline}. Empowering local communities with transparent pricing, smart matching, and verified cooperative professionals.
            </p>
            <div className="flex items-center space-x-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 w-fit px-3 py-1.5 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Ministry of Cooperation Verified</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="font-bold text-white text-sm tracking-wide font-outfit">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-emerald-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-emerald-400 transition-colors">
                  About Cooperative
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-emerald-400 transition-colors">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Connect & Roles */}
          <div className="space-y-5">
            <h4 className="font-bold text-white text-sm tracking-wide font-outfit">Connect</h4>
            <div className="flex items-center space-x-4">
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-emerald-600 hover:text-white transition-all text-slate-400">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-emerald-600 hover:text-white transition-all text-slate-400">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-emerald-600 hover:text-white transition-all text-slate-400">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
            
            <div className="pt-4 space-y-2">
              <h4 className="font-bold text-white text-xs tracking-wide uppercase font-outfit mb-3 text-slate-500">Roles</h4>
              <p className="text-xs">• Customer (Household)</p>
              <p className="text-xs">• Worker (Coop Member)</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Jatin Jangid Credit */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            © 2026 {CONFIG.appName}. SIH Problem Statement ID: SIH26089.
          </p>
          
          <div className="flex items-center space-x-1.5 text-xs bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
            <span>Designed and Deployed with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>by</span>
            <span className="font-bold text-emerald-400 font-outfit tracking-wide">Jatin Jangid</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
