import React, { useState, useEffect } from 'react';
import {
  User, LogOut, Menu, X, ArrowRight,
  ChevronDown, HeartHandshake
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  currentUser?: { name: string; role: 'Customer' | 'Worker' | 'Admin' | string; avatarUrl?: string; email?: string } | null;
  onLoginClick?: () => void;
  onGetStartedClick?: () => void;
  onLogoutClick?: () => void;
  workerActiveTab?: string;
  onWorkerTabChange?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  currentUser,
  onLoginClick,
  onGetStartedClick,
  onLogoutClick,
  workerActiveTab,
  onWorkerTabChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    setAvatarError(false);
  }, [currentUser?.avatarUrl]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Separate, role-specific navlinks
  const getNavLinks = () => {
    if (currentUser?.role === 'Worker') {
      return [
        { label: 'Job Requests', path: '/dashboard', tab: 'feed' },
        { label: 'Active Jobs', path: '/dashboard', tab: 'active' },
        { label: 'Earnings & Wallet', path: '/dashboard', tab: 'earnings' },
        { label: 'Welfare & Support', path: '/dashboard', tab: 'rights' },
        { label: 'Profile', path: '/dashboard', tab: 'profile' },
      ];
    }

    if (currentUser?.role === 'Admin') {
      return [
        { label: 'Operations Center', path: '/dashboard' },
        { label: 'Worker Directory', path: '/workers' },
        { label: 'Services', path: '/services' },
        { label: 'Construction Packages', path: '/projects' },
      ];
    }

    if (currentUser?.role === 'Customer') {
      return [
        { label: 'Home', path: '/' },
        { label: 'Services', path: '/services' },
        { label: 'Nearby Workers', path: '/workers' },
        { label: 'My Dashboard', path: '/dashboard' },
        { label: 'How It Works', path: '/how-it-works' },
        { label: 'Support', path: '/help' },
      ];
    }

    // Public / Unauthenticated
    return [
      { label: 'Home', path: '/' },
      { label: 'Services', path: '/services' },
      { label: 'Nearby Workers', path: '/workers' },
      { label: 'How It Works', path: '/how-it-works' },
      { label: 'About', path: '/about' },
    ];
  };

  const navLinks = getNavLinks();

  const handleNavClick = (path: string, tab?: string) => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    if (tab && onWorkerTabChange) {
      onWorkerTabChange(tab);
    }
    onNavigate(path);
  };

  const isLinkActive = (link: { label: string; path: string; tab?: string }) => {
    if (link.path === '/' && currentPath === '/') return true;
    if (link.path !== '/' && currentPath === link.path) {
      if (!link.tab) return true;
      return workerActiveTab === link.tab;
    }
    return false;
  };

  return (
    <header className="sticky top-0 sm:top-2.5 z-50 w-full px-3 sm:px-6 lg:px-8 py-2 pointer-events-none transition-all duration-300">
      <div className="max-w-7xl mx-auto pointer-events-auto">

        {/* Floating Glassmorphism Pill Container */}
        <div className={`rounded-full transition-all duration-300 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border ${scrolled
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-900/10'
            : 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-slate-200/60 dark:border-slate-800 shadow-md shadow-slate-900/5'
          }`}>

          {/* Brand Logo */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer select-none group shrink-0"
            onClick={() => handleNavClick(currentUser ? '/dashboard' : '/')}
          >
            <div className="w-8 h-8 rounded-full bg-[#166534] flex items-center justify-center text-white font-black text-xs tracking-tight shadow-xs group-hover:scale-105 transition-transform shrink-0 font-outfit">
              SG
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-[#0F172A] dark:text-white text-lg sm:text-xl tracking-tight font-outfit">
                Sahkari<span className="text-[#166534] dark:text-emerald-400">Gig</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => {
              const active = isLinkActive(link);
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.path, link.tab)}
                  className={`text-sm font-semibold transition-all cursor-pointer relative py-1 ${active
                      ? 'text-[#166534] dark:text-emerald-400 font-bold'
                      : 'text-[#475569] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white'
                    }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#166534] dark:bg-emerald-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right CTA Actions */}
          <div className="hidden md:flex items-center space-x-3 shrink-0">
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 border border-[#E2E8F0] dark:border-slate-700 hover:border-[#166534] dark:hover:border-emerald-500 hover:shadow-xs cursor-pointer transition-all text-xs font-bold text-[#0F172A] dark:text-white"
                >
                  {currentUser.avatarUrl && !avatarError ? (
                    <div className="p-[1.5px] rounded-full bg-gradient-to-tr from-[#3B82F6] via-[#6366F1] to-[#A855F7] shrink-0">
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.name}
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        onError={() => setAvatarError(true)}
                        className="w-6 h-6 rounded-full object-cover bg-white"
                      />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center text-xs font-bold shadow-xs shrink-0">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span>{currentUser.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-[#0F766E] dark:text-emerald-300 font-semibold bg-[#F0FDFA] dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-[#CCFBF1] dark:border-emerald-800">
                    {currentUser.role}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2.5 w-52 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-[#E2E8F0] dark:border-slate-800 py-2.5 z-50 text-xs font-semibold animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-[#E2E8F0] dark:border-slate-800 mb-1">
                        <p className="font-bold text-[#0F172A] dark:text-white truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-[#64748B] dark:text-slate-400 truncate">{currentUser.email || 'Verified Member'}</p>
                      </div>

                      <button
                        onClick={() => handleNavClick('/dashboard', 'profile')}
                        className="w-full text-left px-4 py-2 text-[#0F172A] dark:text-slate-200 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-400" />
                        <span>Profile & Settings</span>
                      </button>

                      <div className="border-t border-[#E2E8F0] dark:border-slate-800 my-1 pt-1">
                        {onLogoutClick && (
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onLogoutClick();
                            }}
                            className="w-full text-left px-4 py-2 text-[#DC2626] dark:text-rose-400 hover:bg-[#FEF2F2] dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer font-bold"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Log Out</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                {/* Sign In button with User Icon */}
                <button
                  type="button"
                  onClick={onLoginClick || (() => onNavigate('/dashboard'))}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-sm font-bold text-[#0F172A] dark:text-slate-200 hover:text-[#166534] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#166534] dark:text-emerald-400" />
                  <span>Sign In</span>
                </button>

                {/* Primary CTA Book Now / Book a Service */}
                <button
                  type="button"
                  onClick={() => {
                    const elem = document.getElementById('service-discovery') || document.getElementById('workers-directory');
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                    else onNavigate('/services');
                  }}
                  className="inline-flex items-center justify-center px-5 py-2 text-sm font-bold text-white bg-[#166534] hover:bg-[#14532D] rounded-full shadow-xs hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <span>Book a Service</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#0F172A] rounded-full hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 bg-white/95 backdrop-blur-xl border border-[#E2E8F0] shadow-xl rounded-2xl px-5 py-4 space-y-3 animate-in fade-in duration-150">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.path, link.tab)}
                  className="block w-full text-left py-2 px-3 rounded-xl text-sm font-bold text-[#0F172A] hover:bg-[#F8FAFC] hover:text-[#166534] cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] dark:border-slate-800 space-y-2">

              {currentUser ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAFC] dark:bg-slate-800/80">
                  <div>
                    <p className="font-bold text-sm text-[#0F172A] dark:text-white">{currentUser.name}</p>
                    <p className="text-xs text-[#64748B] dark:text-slate-400">{currentUser.role}</p>
                  </div>
                  {onLogoutClick && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLogoutClick();
                      }}
                      className="text-xs font-bold text-[#DC2626] dark:text-rose-400 p-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                    >
                      Log Out
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setMobileMenuOpen(false); if (onLoginClick) onLoginClick(); }}
                    className="w-full py-2.5 text-center font-bold text-sm text-[#0F172A] dark:text-white bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-full flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#166534] dark:text-emerald-400" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); if (onGetStartedClick) onGetStartedClick(); else onNavigate('/services'); }}
                    className="w-full py-2.5 text-center font-bold text-sm text-white bg-[#166534] hover:bg-[#14532D] rounded-full shadow-xs cursor-pointer"
                  >
                    Book a Service
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
