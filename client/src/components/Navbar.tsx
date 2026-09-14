import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, LogIn, LogOut, Menu, X, ArrowRight, Settings, ChevronDown, UserCheck, Sun, Moon, Laptop } from 'lucide-react';
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
  const [imageError, setImageError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const { theme, isDark, setTheme } = useTheme();

  useEffect(() => {
    setImageError(false);
  }, [currentUser?.avatarUrl]);

  // Dynamic Scroll Spy for Home page sections
  useEffect(() => {
    if (currentPath !== '/') return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220; // 220px lookahead offset
      const workersElem = document.getElementById('workers-directory');
      const howItWorksElem = document.getElementById('how-sahkari-works');
      const servicesElem = document.getElementById('popular-services');

      const workersTop = workersElem ? workersElem.offsetTop : Infinity;
      const howTop = howItWorksElem ? howItWorksElem.offsetTop : Infinity;
      const servicesTop = servicesElem ? servicesElem.offsetTop : Infinity;

      if (workersElem && scrollPosition >= workersTop) {
        setActiveSection('workers');
      } else if (howItWorksElem && scrollPosition >= howTop) {
        setActiveSection('how-it-works');
      } else if (servicesElem && scrollPosition >= servicesTop) {
        setActiveSection('services');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPath]);

  // Public & Logged In Links
  const navLinks = currentUser?.role === 'Worker' ? [
    { label: 'Job Feed', path: '/dashboard', tab: 'feed' },
    { label: 'Active Job', path: '/dashboard', tab: 'active' },
    { label: 'Earnings', path: '/dashboard', tab: 'earnings' },
    { label: 'Worker Rights', path: '/dashboard', tab: 'rights' },
    { label: 'Profile', path: '/dashboard', tab: 'profile' },
  ] : (currentUser?.role === 'Supervisor' ? [
    { label: 'Dashboard', path: '/dashboard', tab: 'overview' },
    { label: 'Projects', path: '/dashboard', tab: 'projects' },
    { label: 'Workers', path: '/dashboard', tab: 'workers' },
    { label: 'Assignments', path: '/dashboard', tab: 'assignments' },
    { label: 'Progress', path: '/dashboard', tab: 'progress' },
  ] : (currentUser?.role === 'Customer' ? [
    { label: 'Home', path: '/' },
    { label: 'Projects', path: '/projects' },
    { label: 'My Bookings', path: '/dashboard' },
    { label: 'Help', path: '/help' },
  ] : [
    { label: 'Home', path: '/' },
    { label: 'Hire Talent', path: '/workers' },
    { label: 'Projects', path: '/projects' },
    { label: 'Services', path: '/services' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Help', path: '/help' },
  ]));

  const isLinkActive = (link: { label: string; path: string; tab?: string }) => {
    if (currentPath !== '/') {
      if (currentPath !== link.path) return false;
      if (!link.tab) return true;
      if (currentUser?.role === 'Supervisor') {
        const effectiveTab = (!workerActiveTab || workerActiveTab === 'feed') ? 'overview' : workerActiveTab;
        return effectiveTab === link.tab;
      }
      return workerActiveTab === link.tab;
    }
    // Dynamic Scroll-Spy on home page
    if (link.path === '/') return activeSection === 'home';
    if (link.path === '/workers') return activeSection === 'workers';
    if (link.path === '/projects' || link.path === '/teams') return false; // Handled by exact path match
    if (link.path === '/services') return activeSection === 'services';
    if (link.path === '/how-it-works') return activeSection === 'how-it-works';
    return false;
  };

  const handleNavClick = (path: string, tab?: string) => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    if (tab && onWorkerTabChange) {
      onWorkerTabChange(tab as any);
    }

    // Smooth scroll for Home / anchor IDs if on home page
    if (currentPath === '/') {
      if (path === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSection('home');
        return;
      }
      if (path === '/workers') {
        const elem = document.getElementById('workers-directory');
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
          setActiveSection('workers');
          return;
        }
      }
      if (path === '/services') {
        const elem = document.getElementById('popular-services');
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
          setActiveSection('services');
          return;
        }
      }
      if (path === '/how-it-works') {
        const elem = document.getElementById('how-sahkari-works');
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
          setActiveSection('how-it-works');
          return;
        }
      }
    }

    onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-2xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Brand Logo */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group" 
          onClick={() => {
            if (currentUser?.role === 'Supervisor') {
              handleNavClick('/dashboard', 'overview');
            } else if (currentUser?.role === 'Worker') {
              handleNavClick('/dashboard', 'feed');
            } else {
              handleNavClick('/');
            }
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-sm font-extrabold text-xl tracking-tight transition-transform group-hover:scale-105">
            Sg
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-900 dark:text-white text-xl tracking-tight font-outfit">
                SahkariGig
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 shadow-2xs">
                <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600 dark:text-emerald-400" />
                Verified
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">Cooperative Local Marketplace</p>
          </div>
        </div>

        {/* Desktop Navigation Links: Modern Segmented Pill Bar with Scroll Spy */}
        <nav className="hidden md:flex items-center p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-inner">
          {navLinks.map((link) => {
            const isActive = isLinkActive(link);
            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.path, link.tab)}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 ring-1 ring-emerald-500'
                    : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-white hover:bg-white/70 dark:hover:bg-slate-700/60'
                  }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA / Auth Status */}
        <div className="hidden md:flex items-center space-x-3">

          {/* Theme Selector Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer focus:outline-none flex items-center justify-center shadow-2xs"
              title={`Appearance: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
            >
              {isDark ? (
                <Moon className="w-4 h-4 text-sky-400 animate-in spin-in-180 duration-200" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500 animate-in spin-in-180 duration-200" />
              )}
            </button>

            {themeDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setThemeDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <p className="px-3.5 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Appearance</p>

                  <button
                    type="button"
                    onClick={() => { setTheme('light'); setThemeDropdownOpen(false); }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${theme === 'light' ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                  >
                    <span className="flex items-center">
                      <Sun className="w-3.5 h-3.5 mr-2 text-amber-500" />
                      Light
                    </span>
                    {theme === 'light' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setTheme('dark'); setThemeDropdownOpen(false); }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${theme === 'dark' ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                  >
                    <span className="flex items-center">
                      <Moon className="w-3.5 h-3.5 mr-2 text-sky-400" />
                      Dark
                    </span>
                    {theme === 'dark' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setTheme('system'); setThemeDropdownOpen(false); }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${theme === 'system' ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                  >
                    <span className="flex items-center">
                      <Laptop className="w-3.5 h-3.5 mr-2 text-slate-500 dark:text-slate-400" />
                      System
                    </span>
                    {theme === 'system' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                  </button>
                </div>
              </>
            )}
          </div>

          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors focus:outline-none"
              >
                {currentUser.avatarUrl && !currentUser.avatarUrl.includes("ui-avatars.com") && !imageError ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover border border-emerald-500 shadow-2xs" onError={() => setImageError(true)} />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold font-outfit">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left text-xs">
                  <p className="font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[110px]">{currentUser.name}</p>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold capitalize">{currentUser.role}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 mb-1.5">
                      <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">{currentUser.email || 'Verified Account'}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleNavClick('/dashboard', 'profile')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center font-bold cursor-pointer group"
                    >
                      <User className="w-4 h-4 mr-2.5 text-slate-400 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                      <span>Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavClick('/dashboard', 'edit_account')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center font-bold cursor-pointer group"
                    >
                      <UserCheck className="w-4 h-4 mr-2.5 text-slate-400 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                      <span>Edit Account</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavClick('/dashboard', 'settings')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center font-bold cursor-pointer group"
                    >
                      <Settings className="w-4 h-4 mr-2.5 text-slate-400 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                      <span>Settings</span>
                    </button>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1 pt-1">
                      {onLogoutClick && (
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            localStorage.removeItem('mockAdmin');
                            onLogoutClick();
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center font-bold cursor-pointer group"
                        >
                          <LogOut className="w-4 h-4 mr-2.5 text-rose-500 dark:text-rose-400 group-hover:translate-x-0.5 transition-transform" />
                          <span>Log Out</span>
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
                type="button"
                onClick={onLoginClick || (() => onNavigate('/dashboard'))}
                className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Login</span>
              </button>
              <button
                type="button"
                onClick={onGetStartedClick || onLoginClick || (() => onNavigate('/services'))}
                className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg focus:outline-none cursor-pointer"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-sky-400" />}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-in fade-in duration-200">
          {navLinks.map((link) => {
            const isActive = isLinkActive(link);
            return (
              <button
                key={link.label}
                type="button"
                onClick={() => handleNavClick(link.path, link.tab)}
                className={`block w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400'
                  }`}
              >
                {link.label}
              </button>
            );
          })}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 mt-3">
            {currentUser ? (
              <div className="bg-slate-50 dark:bg-slate-800/90 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {currentUser.avatarUrl && !currentUser.avatarUrl.includes("ui-avatars.com") && !imageError ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500 shadow-xs" onError={() => setImageError(true)} />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold font-outfit">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="font-bold text-slate-900 dark:text-white text-xs leading-tight">{currentUser.name}</p>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold capitalize">{currentUser.role} Account</span>
                  </div>
                </div>
                {onLogoutClick && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      localStorage.removeItem('mockAdmin');
                      onLogoutClick();
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); if (onLoginClick) onLoginClick(); else onNavigate('/dashboard'); }}
                  className="w-full py-2.5 px-3 text-center font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl cursor-pointer"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); if (onGetStartedClick) onGetStartedClick(); else handleNavClick('/services'); }}
                  className="w-full py-2.5 px-3 text-center font-bold text-xs text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer"
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
