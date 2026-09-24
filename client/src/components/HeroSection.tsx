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
    <div className="bg-[#F8FAFC] text-[#0F172A]">

      {/* True Full-Screen Hero Landing Experience */}
      <section className="bg-gradient-to-b from-[#F4FBF7] via-[#F8FAFC] to-[#F1F5F9] border-b border-[#E2E8F0] min-h-[calc(100vh-68px)] lg:h-[calc(100vh-68px)] flex flex-col justify-between items-center pt-8 pb-4 sm:pt-12 sm:pb-6 relative overflow-hidden">
        
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Centered Main Hero Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-7 my-auto w-full">

          {/* Trust Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#166534] text-xs sm:text-sm font-bold shadow-2xs">
            <span>Cooperative Workforce Platform · Work Together. Earn Fairly. Grow Together.</span>
          </div>

          {/* Clean Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0F172A] tracking-tight leading-[1.12] font-outfit">
            Trusted Local Services <br />
            <span className="text-[#166534]">Through Cooperatives</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-[#64748B] max-w-2xl mx-auto font-medium leading-relaxed">
            Find verified local professionals for your home and business services — with transparent pricing and fair worker earnings.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                const elem = document.getElementById('service-discovery') || document.getElementById('workers-directory');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3.5 bg-[#166534] hover:bg-[#14532D] text-white font-bold text-sm sm:text-base rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Book a Service</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {currentUser?.role === 'Customer' ? (
              <button
                onClick={() => {
                  if (onNavigate) onNavigate('/dashboard');
                }}
                className="px-8 py-3.5 bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-sm sm:text-base rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center space-x-2 cursor-pointer"
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
                className="px-8 py-3.5 bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-sm sm:text-base rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center space-x-2 cursor-pointer"
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
                className="p-3.5 sm:p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-3 text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-extrabold text-slate-900 font-outfit">Active Service Booking</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Live Tracking
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Track assigned cooperative workers, chat, and view live dispatch status
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform shrink-0">
                  <span>Go to My Dashboard</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          {/* 4 Core Trust Checkmarks */}
          <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-bold text-[#0F172A]">
            <div className="flex items-center space-x-2">
              <span className="text-[#16A34A] font-extrabold text-base">✓</span>
              <span>Verified Workers</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[#16A34A] font-extrabold text-base">✓</span>
              <span>Transparent Pricing</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[#16A34A] font-extrabold text-base">✓</span>
              <span>Local Service</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[#16A34A] font-extrabold text-base">✓</span>
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
            <span className="text-[11px] font-extrabold tracking-[0.3em] text-[#64748B] group-hover:text-[#166534] transition-colors">
              SCROLL
            </span>
            <div className="w-[2px] h-8 bg-gradient-to-b from-[#166534] via-[#0F766E] to-transparent rounded-full mt-1.5 animate-bounce group-hover:h-10 transition-all shadow-xs" />
          </button>
        </div>
      </section>

      {/* Service Discovery Section */}
      <section id="service-discovery" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header & Location Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-outfit">
              Explore Verified Services
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              Select a trade to connect directly with cooperative-verified professionals
            </p>
          </div>

          {/* Location Selector */}
          <button
            type="button"
            onClick={() => setIsCityModalOpen(true)}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#166534] text-xs font-bold text-[#0F172A] transition-colors cursor-pointer shadow-xs"
          >
            <MapPin className="w-4 h-4 text-[#166534] mr-2 shrink-0" />
            <span>📍 {currentCity}</span>
            <span className="ml-2.5 text-[11px] text-[#166534] font-bold underline">Change</span>
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-8 flex flex-col sm:flex-row gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchPrompt}
              onChange={e => setSearchPrompt(e.target.value)}
              placeholder="Search electrician, plumber, AC repair, carpenter, painter..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#166534] hover:bg-[#14532D] text-white font-bold text-sm rounded-lg transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shrink-0"
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
                className={`group bg-white rounded-xl p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-1 ${isSelected
                    ? 'border-[#166534] shadow-md ring-1 ring-[#166534]'
                    : 'border-[#E2E8F0] hover:border-[#166534] hover:shadow-md'
                  }`}
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-lg bg-[#F1F5F9] group-hover:bg-[#DCFCE7] flex items-center justify-center text-2xl transition-colors">
                    {srv.icon}
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base text-[#0F172A] font-outfit group-hover:text-[#166534] transition-colors">
                        {srv.name}
                      </h3>
                      <span className="text-xs font-bold text-[#166534] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#DCFCE7]">
                        From {srv.startPrice}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-bold text-[#166534] group-hover:translate-x-0.5 transition-transform">
                  <span>Explore →</span>
                  <span className="text-[11px] text-[#64748B] font-normal">Verified near you</span>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* Location Modal */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-[#E2E8F0] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-[#166534]" />
                <h3 className="font-extrabold text-base text-[#0F172A] font-outfit">Select Cooperative District</h3>
              </div>
              <button
                onClick={() => setIsCityModalOpen(false)}
                className="text-[#64748B] hover:text-[#0F172A] font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
              <input
                type="text"
                value={citySearchQuery}
                onChange={e => setCitySearchQuery(e.target.value)}
                placeholder="Search city or district..."
                className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#166534]"
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
                        ? 'bg-[#F0FDF4] border-[#166534] text-[#166534] font-bold'
                        : 'bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]'
                      }`}
                  >
                    <span className="truncate">{city.split(',')[0]}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#166534] shrink-0" />}
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
