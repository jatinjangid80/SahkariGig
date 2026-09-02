import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, LogIn, LogOut, Menu, X, ArrowRight, Settings, ChevronDown, UserCheck } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  currentUser?: { name: string; role: 'Customer' | 'Worker' | 'Admin' | string; avatarUrl?: string; email?: string } | null;
  onLoginClick?: () => void;
  onGetStartedClick?: () => void;
  onLogoutClick?: () => void;
  workerActiveTab?: string;
  onWorkerTabChange?: (tab: 'feed' | 'active' | 'earnings' | 'profile') => void;
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
  const [imageError, setImageError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [currentUser?.avatarUrl]);

  // Public & Logged In Links
  const navLinks = currentUser?.role === 'Worker' ? [
    { label: 'Job Feed', path: '/dashboard', tab: 'feed' },
    { label: 'Active Job', path: '/dashboard', tab: 'active' },
    { label: 'Earnings', path: '/dashboard', tab: 'earnings' },
    { label: 'Profile', path: '/dashboard', tab: 'profile' },
  ] : (currentUser?.role === 'Customer' ? [
    { label: 'Find Workers', path: '/workers' },
    { label: 'Services', path: '/services' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'My Bookings', path: '/dashboard' },
  ] : [
    { label: 'Find Workers', path: '/workers' },
    { label: 'Find Work', path: '/for-workers' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Services', path: '/services' },
  ]);

  const handleNavClick = (path: string, tab?: string) => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    if (tab && onWorkerTabChange) {
      onWorkerTabChange(tab as any);
    }
    
    // Smooth scroll for anchor IDs if on home page
    if (path === '/workers' && currentPath === '/') {
      const elem = document.getElementById('workers-directory');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    if (path === '/how-it-works' && currentPath === '/') {
      const elem = document.getElementById('how-sahkari-works');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => handleNavClick('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-sm font-extrabold text-xl tracking-tight transition-transform group-hover:scale-105">
            Sg
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-900 text-xl tracking-tight font-outfit">
                SahkariGig
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs">
                <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                Verified
              </span>
            </div>
            <p className="text-[10px] text-slate-500 hidden sm:block font-medium">Cooperative Local Marketplace</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-7">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.path, link.tab)}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                currentPath === link.path && (!link.tab || workerActiveTab === link.tab)
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right CTA / Auth Status */}
        <div className="hidden md:flex items-center space-x-3">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-colors focus:outline-none"
              >
                {currentUser.avatarUrl && !currentUser.avatarUrl.includes("ui-avatars.com") && !imageError ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover border border-emerald-500 shadow-2xs" onError={() => setImageError(true)} />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold font-outfit">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left text-xs">
                  <p className="font-bold text-slate-900 leading-tight truncate max-w-[110px]">{currentUser.name}</p>
                  <span className="text-[10px] text-emerald-700 font-semibold capitalize">{currentUser.role}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                  <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{currentUser.email || 'Verified Account'}</p>
                    </div>

                    <button
                      onClick={() => handleNavClick('/dashboard', 'profile')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors flex items-center font-semibold cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 mr-2 text-slate-500" />
                      Profile
                    </button>

                    <button
                      onClick={() => handleNavClick('/dashboard', 'profile')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors flex items-center font-semibold cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5 mr-2 text-slate-500" />
                      Edit Account
                    </button>

                    <button
                      onClick={() => handleNavClick('/dashboard', 'profile')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors flex items-center font-semibold cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 mr-2 text-slate-500" />
                      Settings
                    </button>

                    <div className="border-t border-slate-100 my-1 pt-1">
                      {onLogoutClick && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            localStorage.removeItem('mockAdmin');
                            onLogoutClick();
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors flex items-center font-semibold cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5 mr-2" />
                          Log Out
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={onLoginClick || (() => onNavigate('/dashboard'))}
                className="px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-emerald-800 transition-colors cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={onGetStartedClick || onLoginClick || (() => onNavigate('/services'))}
                className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
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
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-in fade-in duration-200">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.path, link.tab)}
              className={`block w-full text-left py-2 text-sm font-semibold transition-colors focus:outline-none ${
                currentPath === link.path && (!link.tab || workerActiveTab === link.tab)
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-700 hover:text-emerald-700'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100 space-y-2 mt-3">
            {currentUser ? (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {currentUser.avatarUrl && !currentUser.avatarUrl.includes("ui-avatars.com") && !imageError ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500 shadow-xs" onError={() => setImageError(true)} />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold font-outfit">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="font-bold text-slate-900 text-xs leading-tight">{currentUser.name}</p>
                    <span className="text-[10px] text-emerald-700 font-semibold capitalize">{currentUser.role} Account</span>
                  </div>
                </div>
                {onLogoutClick && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      localStorage.removeItem('mockAdmin');
                      onLogoutClick();
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); if (onLoginClick) onLoginClick(); else onNavigate('/dashboard'); }}
                  className="w-full py-2.5 px-3 text-center font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Login
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); if (onGetStartedClick) onGetStartedClick(); else handleNavClick('/services'); }}
                  className="w-full py-2.5 px-3 text-center font-bold text-xs text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
