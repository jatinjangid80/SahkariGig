import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { WhyCooperative } from './components/WhyCooperative';
import { RolesSection } from './components/RolesSection';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { StatusView } from './components/StatusView';
import { Footer } from './components/Footer';

export default function App() {
  const [currentPath, setCurrentPath] = useState('/');

  // Support browser back/forward and initial URL hash or path
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar currentPath={currentPath} onNavigate={navigateTo} />

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentPath === '/' && (
          <>
            <HeroSection onNavigate={navigateTo} />
            <WhyCooperative />
            <RolesSection />
          </>
        )}

        {currentPath === '/about' && (
          <AboutView onNavigate={navigateTo} />
        )}

        {currentPath === '/contact' && (
          <ContactView />
        )}

        {currentPath === '/status' && (
          <StatusView />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

    </div>
  );
}
