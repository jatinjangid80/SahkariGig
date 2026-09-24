import React, { useState } from 'react';
import {
  Search, ShieldCheck, CheckCircle2, Star, MapPin, ArrowRight,
  Check, QrCode, Lock, CreditCard, Building2, UserCheck,
  Briefcase, ChevronRight, Zap, Users, Award, HeartHandshake, PhoneCall, AlertTriangle
} from 'lucide-react';

interface HeroSectionProps {
  currentUser?: { name: string; role: string; id: string; email: string } | null;
  onSearchService?: (query: string, location?: string) => void;
  onNavigate?: (path: string) => void;
  selectedLocation?: string;
  onLocationChange?: (loc: string) => void;
  onOpenBooking?: (workerOrTrade?: any) => void;
  onOpenAuth?: (role: 'Customer' | 'Worker', mode: 'signin' | 'signup') => void;
}

const POPULAR_CITIES = [
  'Jaipur, Rajasthan',
  'Delhi NCR',
  'Mumbai, Maharashtra',
  'Bengaluru, Karnataka',
  'Ahmedabad, Gujarat',
  'Udaipur, Rajasthan',
  'Pune, Maharashtra',
  'Lucknow, Uttar Pradesh'
];

const SERVICES_DATA = [
  { name: 'Electrician', icon: '🔧', desc: 'Wiring, switchboards, fan & appliance repair', startPrice: '₹350' },
  { name: 'Plumbing', icon: '🚰', desc: 'Pipe leakage, tap fittings & water tank repair', startPrice: '₹300' },
  { name: 'Carpentry', icon: '🪚', desc: 'Furniture assembly, doors, locks & woodwork', startPrice: '₹400' },
  { name: 'Cleaning', icon: '🧹', desc: 'Deep home cleaning, kitchen & washroom sanitation', startPrice: '₹450' },
  { name: 'Painting', icon: '🎨', desc: 'Interior, exterior wall painting & putty finish', startPrice: '₹600' },
  { name: 'AC Repair', icon: '❄️', desc: 'AC filter cleaning, gas refill & cooling service', startPrice: '₹499' },
  { name: 'Gardening', icon: '🌱', desc: 'Lawn trimming, plant care & soil maintenance', startPrice: '₹350' },
  { name: 'Masonry', icon: '🔨', desc: 'Tile fixing, plaster repair & civil construction', startPrice: '₹550' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentUser,
  onSearchService,
  onNavigate,
  selectedLocation: externalLocation,
  onLocationChange,
  onOpenBooking,
  onOpenAuth
}) => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [currentCity, setCurrentCity] = useState(externalLocation || 'Jaipur, Rajasthan');
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleSelectCity = (city: string) => {
    setCurrentCity(city);
    if (onLocationChange) onLocationChange(city);
    setIsCityModalOpen(false);
    setCitySearchQuery('');
  };

  const handleServiceClick = (serviceName: string) => {
    setSelectedService(serviceName);
    setSearchPrompt(serviceName);
    if (onSearchService) {
      onSearchService(serviceName, currentCity);
    }
    const elem = document.getElementById('workers-directory');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchPrompt.trim();
    if (onSearchService) {
      onSearchService(query || 'All', currentCity);
    }
    const elem = document.getElementById('workers-directory');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredCities = POPULAR_CITIES.filter(c =>
    c.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">

      {/* True Full-Screen Hero Landing Experience */}
      <section className="bg-gradient-to-b from-emerald-50/40 via-slate-50 to-slate-100/60 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800/80 min-h-[calc(100vh-68px)] lg:h-[calc(100vh-68px)] flex flex-col justify-between items-center pt-8 pb-4 sm:pt-12 sm:pb-6 relative overflow-hidden transition-colors">
        
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-100/40 dark:bg-emerald-950/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Centered Main Hero Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-7 my-auto w-full">

          {/* Trust Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold shadow-2xs">
            <span>Cooperative Workforce Platform · Work Together. Earn Fairly. Grow Together.</span>
          </div>

          {/* Clean Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12] font-outfit">
            Trusted Local Services <br />
            <span className="text-emerald-700 dark:text-emerald-400">Through Cooperatives</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Find verified local professionals for your home and business services — with transparent pricing and fair worker earnings.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                const elem = document.getElementById('service-discovery') || document.getElementById('workers-directory');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm sm:text-base rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Book a Service</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {currentUser?.role === 'Customer' ? (
              <button
                onClick={() => {
                  if (onNavigate) onNavigate('/dashboard');
                }}
                className="px-8 py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm sm:text-base rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Briefcase className="w-4 h-4" />
                <span>My Bookings & Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (onOpenAuth) onOpenAuth('Worker', 'signup');
                  else if (onNavigate) onNavigate('/for-workers');
                }}
                className="px-8 py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm sm:text-base rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Join as a Worker</span>
              </button>
            )}
          </div>

          {/* Customer Live Booked Services Quick Bar (if logged in as Customer) */}
          {currentUser?.role === 'Customer' && (
            <div className="pt-3 max-w-2xl mx-auto">
              <div
                onClick={() => { if (onNavigate) onNavigate('/dashboard'); }}
                className="p-3.5 sm:p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-emerald-200 dark:border-emerald-800/60 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-3 text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white font-outfit">Active Service Booking</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Live Tracking
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Track assigned cooperative workers, chat, and view live dispatch status
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform shrink-0">
                  <span>Go to My Dashboard</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          {/* 4 Core Trust Checkmarks */}
          <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-200">
            <div className="flex items-center space-x-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base">✓</span>
              <span>Verified Workers</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base">✓</span>
              <span>Transparent Pricing</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base">✓</span>
              <span>Local Service</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base">✓</span>
              <span>Cooperative Model</span>
            </div>
          </div>

        </div>

        {/* Floating SCROLL Indicator at bottom of Full Screen Hero */}
        <div className="pt-2 pb-2 flex flex-col items-center justify-center">
          <button
            onClick={() => {
              const elem = document.getElementById('service-discovery') || document.getElementById('workers-directory');
              if (elem) elem.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group flex flex-col items-center cursor-pointer transition-all hover:scale-105 select-none focus:outline-none"
            title="Scroll to explore services"
          >
            <span className="text-[11px] font-extrabold tracking-[0.3em] text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              SCROLL
            </span>
            <div className="w-[2px] h-8 bg-gradient-to-b from-emerald-600 via-teal-600 to-transparent rounded-full mt-1.5 animate-bounce group-hover:h-10 transition-all shadow-xs" />
          </button>
        </div>
      </section>

      {/* Service Discovery Section */}
      <section id="service-discovery" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header & Location Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">
              Explore Verified Services
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Select a trade to connect directly with cooperative-verified professionals
            </p>
          </div>

          {/* Location Selector */}
          <button
            type="button"
            onClick={() => setIsCityModalOpen(true)}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-600 dark:hover:border-emerald-500 text-xs font-bold text-slate-900 dark:text-white transition-colors cursor-pointer shadow-xs"
          >
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2 shrink-0" />
            <span>📍 {currentCity}</span>
            <span className="ml-2.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-bold underline">Change</span>
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-8 flex flex-col sm:flex-row gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchPrompt}
              onChange={e => setSearchPrompt(e.target.value)}
              placeholder="Search electrician, plumber, AC repair, carpenter, painter..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-600 dark:focus:ring-emerald-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-lg transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shrink-0 shadow-xs"
          >
            <span>Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 8 Clean Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES_DATA.map((srv) => {
            const isSelected = selectedService === srv.name;
            return (
              <div
                key={srv.name}
                onClick={() => handleServiceClick(srv.name)}
                className={`group bg-white dark:bg-slate-900 rounded-xl p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-1 ${isSelected
                    ? 'border-emerald-600 dark:border-emerald-500 shadow-md ring-1 ring-emerald-600 dark:ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-emerald-600 dark:hover:border-emerald-500 hover:shadow-md'
                  }`}
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/60 flex items-center justify-center text-2xl transition-colors">
                    {srv.icon}
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white font-outfit group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {srv.name}
                      </h3>
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        From {srv.startPrice}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore →</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Verified near you</span>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* Location Modal */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-outfit">Select Cooperative District</h3>
              </div>
              <button
                onClick={() => setIsCityModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={citySearchQuery}
                onChange={e => setCitySearchQuery(e.target.value)}
                placeholder="Search city or district..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {filteredCities.map((city) => {
                const isSelected = currentCity === city;
                return (
                  <button
                    key={city}
                    onClick={() => handleSelectCity(city)}
                    className={`text-left px-3 py-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 dark:border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                      }`}
                  >
                    <span className="truncate">{city.split(',')[0]}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
