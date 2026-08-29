import React, { useState } from 'react';
import { ShieldCheck, User, LogIn, Menu, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CONFIG } from '../config';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  currentUser?: { name: string; role: 'Customer' | 'Worker' | 'Admin' | string; avatarUrl?: string } | null;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  workerActiveTab?: string;
  onWorkerTabChange?: (tab: 'feed' | 'active' | 'earnings' | 'profile') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  currentUser,
  onLoginClick,
  onLogoutClick,
  workerActiveTab,
  onWorkerTabChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = currentUser?.role === 'Worker' ? [
    { label: 'Job Feed', path: '/dashboard', tab: 'feed' },
    { label: 'Active Job', path: '/dashboard', tab: 'active' },
    { label: 'Earnings', path: '/dashboard', tab: 'earnings' },
    { label: 'Profile', path: '/dashboard', tab: 'profile' },
  ] : (currentUser?.role === 'Customer' ? [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Find Services', path: '/services' },
    { label: 'Cooperatives', path: '/cooperatives' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'About', path: '/about' },
  ] : [
    { label: 'Home', path: '/' },
    { label: 'Find Services', path: '/services' },
    { label: 'Find Work', path: '/for-workers' },
    { label: 'Cooperatives', path: '/cooperatives' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'About', path: '/about' },
  ]);

  const handleNavClick = (path: string, tab?: string) => {
    setMobileMenuOpen(false);
    if (tab && onWorkerTabChange) {
      onWorkerTabChange(tab as any);
    }
    onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => handleNavClick('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md font-extrabold text-xl tracking-tight transition-transform group-hover:scale-105">
            Sg
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-900 text-xl tracking-tight font-outfit">
                SahkariGig
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                Cooperative
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block font-medium">Worker-owned platform</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.path, link.tab)}
              className={`text-sm font-medium transition-colors ${
                currentPath === link.path && (!link.tab || workerActiveTab === link.tab)
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
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover border border-emerald-500 shadow-2xs" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold font-outfit">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left text-xs">
                  <p className="font-semibold text-slate-900 leading-tight">{currentUser.name}</p>
                  <span className="text-[10px] text-emerald-700 font-medium capitalize">{currentUser.role}</span>
                </div>
              </div>

              {onLogoutClick && (
                <button
                onClick={() => {
                  if (onLogoutClick) {
                    localStorage.removeItem('mockAdmin');
                    onLogoutClick();
                  }
                }}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold text-xs transition-colors"
              >
                Log Out
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
                onClick={() => handleNavClick('/services')}
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
              onClick={() => handleNavClick(link.path, link.tab)}
              className={`block w-full text-left py-2 text-base font-medium transition-colors ${
                currentPath === link.path && (!link.tab || workerActiveTab === link.tab)
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-700 hover:text-emerald-600'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => { setMobileMenuOpen(false); handleNavClick('/services'); }}
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
