import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, User, LogIn, LogOut, Menu, X, ArrowRight,
  ChevronDown, Sun, Moon, Laptop, Globe, AlertTriangle, PhoneCall
} from 'lucide-react';
import { useTheme } from '../utils/theme';

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Separate, role-specific navlinks
  const getNavLinks = () => {
    if (currentUser?.role === 'Worker') {
      return [
        { label: 'Incoming Jobs', path: '/dashboard', tab: 'feed' },
        { label: 'Active Jobs', path: '/dashboard', tab: 'active' },
        { label: 'Earnings & Wallet', path: '/dashboard', tab: 'earnings' },
        { label: 'Welfare & Support', path: '/dashboard', tab: 'rights' },
        { label: 'Profile', path: '/dashboard', tab: 'profile' },
      ];
    }

    if (currentUser?.role === 'Admin') {
      return [
        { label: 'Overview', path: '/dashboard', tab: 'overview' },
        { label: 'Workers', path: '/dashboard', tab: 'kyc' },
        { label: 'Bookings', path: '/dashboard', tab: 'bookings' },
        { label: 'Allocation', path: '/dashboard', tab: 'allocation' },
        { label: 'Payments', path: '/dashboard', tab: 'payments' },
        { label: 'Welfare', path: '/dashboard', tab: 'welfare' },
        { label: 'Complaints', path: '/dashboard', tab: 'disputes' },
        { label: 'Reports', path: '/dashboard', tab: 'reports' },
        { label: 'Settings', path: '/dashboard', tab: 'settings' },
      ];
    }

    if (currentUser?.role === 'Customer') {
      return [
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
      { label: 'How It Works', path: '/how-it-works' },
      { label: 'For Workers', path: '/for-workers' },
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
    <header className={`sticky top-0 z-40 h-[68px] flex items-center transition-all duration-200 ${scrolled
      ? 'bg-white shadow-xs border-b border-[#E2E8F0]'
      : 'bg-[#F8FAFC] border-b border-[#E2E8F0]'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">

        {/* Brand Logo */}
        <div
          className="flex items-center space-x-2.5 cursor-pointer select-none group"
          onClick={() => handleNavClick(currentUser ? '/dashboard' : '/')}
        >
          <div className="w-8 h-8 rounded-lg bg-[#166534] flex items-center justify-center text-white font-black text-sm tracking-tight shadow-xs">
            SG
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-[#0F172A] text-xl tracking-tight font-outfit">
              SahkariGig
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-7">
          {navLinks.map((link) => {
            const active = isLinkActive(link);
            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.path, link.tab)}
                className={`text-sm font-semibold transition-colors cursor-pointer ${active
                  ? 'text-[#166534] font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#166534] cursor-pointer transition-all text-xs font-bold text-[#0F172A]"
              >
                <div className="w-6 h-6 rounded-full bg-[#166534] text-white flex items-center justify-center text-xs font-bold">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span>{currentUser.name.split(' ')[0]}</span>
                <span className="text-[10px] text-[#0F766E] font-semibold bg-[#F0FDFA] px-1.5 py-0.5 rounded border border-[#CCFBF1]">
                  {currentUser.role}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
              </button>

              {userDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-2 z-50 text-xs font-semibold">
                    <div className="px-3.5 py-2 border-b border-[#E2E8F0] mb-1">
                      <p className="font-bold text-[#0F172A] truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-[#64748B] truncate">{currentUser.email || 'Verified Member'}</p>
                    </div>

                    <button
                      onClick={() => handleNavClick('/dashboard', 'profile')}
                      className="w-full text-left px-3.5 py-2 text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-[#64748B]" />
                      <span>Profile & Settings</span>
                    </button>

                    <div className="border-t border-[#E2E8F0] my-1 pt-1">
                      {onLogoutClick && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onLogoutClick();
                          }}
                          className="w-full text-left px-3.5 py-2 text-[#DC2626] hover:bg-[#FEF2F2] flex items-center gap-2 cursor-pointer font-bold"
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
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onLoginClick || (() => onNavigate('/dashboard'))}
                className="text-sm font-bold text-[#0F172A] hover:text-[#166534] px-3 py-2 transition-colors cursor-pointer"
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => {
                  const elem = document.getElementById('service-discovery') || document.getElementById('workers-directory');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                  else onNavigate('/services');
                }}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-[#166534] hover:bg-[#14532D] rounded-lg shadow-xs transition-colors cursor-pointer"
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
            className="p-2 text-[#0F172A] rounded-lg hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[68px] left-0 right-0 bg-white border-b border-[#E2E8F0] shadow-lg px-5 py-4 space-y-3 animate-in fade-in duration-150">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.path, link.tab)}
                className="block w-full text-left py-2.5 px-3 rounded-lg text-sm font-bold text-[#0F172A] hover:bg-[#F8FAFC] hover:text-[#166534] cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
            {currentUser ? (
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC]">
                <div>
                  <p className="font-bold text-sm text-[#0F172A]">{currentUser.name}</p>
                  <p className="text-xs text-[#64748B]">{currentUser.role}</p>
                </div>
                {onLogoutClick && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogoutClick();
                    }}
                    className="text-xs font-bold text-[#DC2626] p-2 hover:bg-rose-50 rounded-lg"
                  >
                    Log Out
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); if (onLoginClick) onLoginClick(); }}
                  className="w-full py-2.5 text-center font-bold text-sm text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg"
                >
                  Login
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); if (onGetStartedClick) onGetStartedClick(); else onNavigate('/services'); }}
                  className="w-full py-2.5 text-center font-bold text-sm text-white bg-[#166534] hover:bg-[#14532D] rounded-lg shadow-xs"
                >
                  Book a Service
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
