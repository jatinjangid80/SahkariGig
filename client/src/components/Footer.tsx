import React from 'react';
import { CONFIG } from '../config';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/90 py-10 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand */}
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-white text-lg font-outfit">{CONFIG.appName}</span>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
              {CONFIG.phase}
            </span>
          </div>
          <p className="mt-2 text-slate-400 text-xs leading-relaxed max-w-sm">
            {CONFIG.appTagline}
          </p>
          <p className="mt-4 text-[11px] text-slate-600">
            © 2026 {CONFIG.appName}. SIH Problem Statement ID: SIH26089.
          </p>
        </div>

        {/* Platform Links */}
        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Platform Navigation</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onNavigate('/')} className="hover:text-emerald-400 transition-colors">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/about')} className="hover:text-emerald-400 transition-colors">
                About the cooperative
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/contact')} className="hover:text-emerald-400 transition-colors">
                Contact & Inquiries
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/status')} className="hover:text-cyan-400 transition-colors flex items-center space-x-1">
                <span>System status</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </button>
            </li>
          </ul>
        </div>

        {/* Roles & Ministry */}
        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Supported Roles</h4>
          <ul className="space-y-1.5 text-slate-400">
            <li>• Customer (Households)</li>
            <li>• Worker (Cooperative Member)</li>
            <li>• Cooperative Admin</li>
          </ul>
          <p className="mt-4 text-[11px] text-slate-500">
            Ministry of Cooperation • Smart Automation Category
          </p>
        </div>

      </div>
    </footer>
  );
};
