import React, { useState } from 'react';
import { ShieldCheck, User, LogIn, Menu, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CONFIG } from '../config';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  currentUser?: { name: string; role: 'Customer' | 'Worker' | 'Admin' } | null;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  currentUser,
  onLoginClick,
  onLogoutClick
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/#services' },
    { label: 'How It Works', path: '/#how-it-works' },
    { label: 'For Workers', path: '/#for-workers' },
    { label: 'About', path: '/about' },
  ];

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    if (path.startsWith('/#')) {
      const targetId = path.replace('/#', '');
      onNavigate('/');
      setTimeout(() => {
        const elem = document.getElementById(targetId);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      onNavigate(path);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => handleNavClick('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md font-extrabold text-xl tracking-tight transition-transform group-hover:scale-105">
            Cg
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-900 text-xl tracking-tight font-outfit">
                {CONFIG.appName}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                Cooperative
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block font-medium">Ministry of Cooperation Verified</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.path)}
              className={`text-sm font-medium transition-colors ${
                currentPath === link.path
                  ? 'text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right CTA / Auth Status */}
        <div className="hidden md:flex items-center space-x-4">
          {currentUser ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left text-xs">
                  <p className="font-semibold text-slate-900 leading-tight">{currentUser.name}</p>
                  <span className="text-[10px] text-emerald-700 font-medium capitalize">{currentUser.role}</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('/dashboard')}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
              >
                Dashboard
              </button>
              {onLogoutClick && (
                <button
                  onClick={onLogoutClick}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Sign Out
                </button>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={onLoginClick || (() => onNavigate('/dashboard'))}
                className="inline-flex items-center text-sm font-semibold text-slate-700 hover:text-emerald-700 transition-colors btn-interaction"
              >
                <LogIn className="w-4 h-4 mr-1.5 text-slate-500" />
                Sign In
              </button>
              <button
                onClick={() => handleNavClick('/#services')}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors btn-interaction"
              >
                Find a Worker
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.path)}
              className="block w-full text-left py-2 text-base font-medium text-slate-700 hover:text-emerald-600"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => { setMobileMenuOpen(false); handleNavClick('/#services'); }}
              className="w-full py-2.5 px-4 text-center font-semibold text-white bg-emerald-600 rounded-xl"
            >
              Find a Worker
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
