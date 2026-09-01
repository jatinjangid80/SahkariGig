import React, { useState } from 'react';
import { ShieldCheck, User, LogIn, LogOut, Menu, X, ArrowRight, CheckCircle2 } from 'lucide-react';
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
              className={`text-sm font-medium transition-colors focus:outline-none ${
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
            <div className="relative group">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 cursor-pointer transition-colors hover:bg-slate-200">
                {currentUser.avatarUrl && !currentUser.avatarUrl.includes("ui-avatars.com") && !imageError ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover border border-emerald-500 shadow-2xs" onError={() => setImageError(true)} />
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

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                <div className="py-2">
                  <button
                    onClick={() => handleNavClick('/dashboard', 'profile')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center font-medium"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                  {onLogoutClick && (
                    <button
                      onClick={() => {
                        localStorage.removeItem('mockAdmin');
                        onLogoutClick();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center font-medium"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log Out
                    </button>
                  )}
                </div>
              </div>
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
              className={`block w-full text-left py-2 text-base font-medium transition-colors focus:outline-none ${
                currentPath === link.path && (!link.tab || workerActiveTab === link.tab)
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-700 hover:text-emerald-600'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-100 space-y-3 mt-4">
            {currentUser ? (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {currentUser.avatarUrl && !currentUser.avatarUrl.includes("ui-avatars.com") && !imageError ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-sm" onError={() => setImageError(true)} />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold font-outfit">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="font-bold text-slate-900 text-sm leading-tight">{currentUser.name}</p>
                    <span className="text-[11px] text-emerald-700 font-medium capitalize">{currentUser.role} Account</span>
                  </div>
                </div>
                {onLogoutClick && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      localStorage.removeItem('mockAdmin');
                      onLogoutClick();
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Log Out"
                  >
                    <LogIn className="w-5 h-5 rotate-180" />
                  </button>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => { setMobileMenuOpen(false); if (onLoginClick) onLoginClick(); else onNavigate('/dashboard'); }}
                  className="w-full py-2.5 px-4 text-center font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleNavClick('/services'); }}
                  className="w-full py-2.5 px-4 text-center font-semibold text-white bg-emerald-600 rounded-xl shadow-md flex items-center justify-center space-x-2"
                >
                  <span>Find a Worker</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
