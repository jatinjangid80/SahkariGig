import React, { useState } from 'react';
import { 
  Search, ShieldCheck, CheckCircle2, Star, MapPin, ArrowRight, 
  Sparkles, Check, QrCode, Lock, CreditCard, Building2, UserCheck, 
  SlidersHorizontal, Briefcase, ChevronRight
} from 'lucide-react';
import { CONFIG } from '../config';

interface HeroSectionProps {
  currentUser?: { name: string; role: string; id: string; email: string } | null;
  onSearchService?: (query: string, location?: string) => void;
  onNavigate?: (path: string) => void;
  selectedLocation?: string;
  onLocationChange?: (loc: string) => void;
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

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentUser,
  onSearchService,
  onNavigate,
  selectedLocation: externalLocation,
  onLocationChange
}) => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [currentCity, setCurrentCity] = useState(externalLocation || 'Jaipur, Rajasthan');
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [isClassifying, setIsClassifying] = useState(false);
  const [aiResult, setAiResult] = useState<{
    category: string;
    confidence: number;
    reason: string;
  } | null>(null);

  const handleSelectCity = (city: string) => {
    setCurrentCity(city);
    if (onLocationChange) onLocationChange(city);
    setIsCityModalOpen(false);
    setCitySearchQuery('');
  };

  const handlePopularTagClick = (tag: string) => {
    setSearchPrompt(tag);
    if (onSearchService) {
      onSearchService(tag, currentCity);
    }
    const elem = document.getElementById('workers-directory');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchPrompt.trim();
    if (!query) {
      const elem = document.getElementById('workers-directory');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setIsClassifying(true);
    try {
      const apiUrl = CONFIG.apiUrl || import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const res = await fetch(`${apiUrl}/api/categories/ai-classify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      }).catch(() => null);

      if (res && res.ok) {
        const json = await res.json();
        if (json.success && json.data?.matched && json.data?.category) {
          setAiResult({
            category: json.data.category.name,
            confidence: json.data.confidence === 'HIGH' ? 96 : 85,
            reason: json.data.category.description || `Classified based on service taxonomy.`
          });
          if (onSearchService) onSearchService(json.data.category.name, currentCity);
          setIsClassifying(false);
          return;
        }
      }

      // Rule-based classification fallback
      const text = query.toLowerCase();
      let matchedCategory = 'Technician';
      let reason = 'Matched home technician and repair services.';

      if (text.includes('fan') || text.includes('wire') || text.includes('switch') || text.includes('light') || text.includes('mcb') || text.includes('electr')) {
        matchedCategory = 'Electrician';
        reason = 'Matched electrical repair, wiring & lighting troubleshooting.';
      } else if (text.includes('pipe') || text.includes('leak') || text.includes('tap') || text.includes('drain') || text.includes('sink') || text.includes('plumb')) {
        matchedCategory = 'Plumber';
        reason = 'Matched plumbing fixtures, water supply & drain repairs.';
      } else if (text.includes('ac') || text.includes('cool') || text.includes('filter') || text.includes('air cond')) {
        matchedCategory = 'AC Repair';
        reason = 'Matched AC servicing, cooling troubleshooting & HVAC.';
      } else if (text.includes('paint') || text.includes('wall') || text.includes('color') || text.includes('putty')) {
        matchedCategory = 'Painter';
        reason = 'Matched interior/exterior wall painting & touch-up work.';
      } else if (text.includes('clean') || text.includes('dust') || text.includes('maid') || text.includes('sweep')) {
        matchedCategory = 'Cleaning';
        reason = 'Matched deep home cleaning, housekeeping & sanitize service.';
      } else if (text.includes('door') || text.includes('wood') || text.includes('table') || text.includes('carpenter') || text.includes('furniture')) {
        matchedCategory = 'Carpenter';
        reason = 'Matched woodwork, furniture assembly & door fitting.';
      }

      setAiResult({
        category: matchedCategory,
        confidence: 94,
        reason
      });

      if (onSearchService) {
        onSearchService(matchedCategory, currentCity);
      }
    } catch (err) {
      if (onSearchService) onSearchService(query, currentCity);
    } finally {
      setIsClassifying(false);
    }
  };

  // Filtered city list for location modal
  const filteredCities = POPULAR_CITIES.filter(c => 
    c.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  // Role-based CTA Button Text
  const getCtaButtonText = () => {
    if (currentUser?.role === 'Worker') return 'Find Jobs';
    if (currentUser?.role === 'Supervisor') return 'Open Projects';
    return 'Find Workers';
  };

  return (
    <section className="relative bg-white dark:bg-[#0b0f19] min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center pt-10 pb-20 sm:pt-14 sm:pb-24 overflow-hidden border-b border-slate-100 dark:border-slate-800/80">
      {/* Background Soft Ambient Light */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-full">
          <div className="absolute top-[5%] right-[5%] w-[550px] h-[450px] bg-emerald-100/40 dark:bg-emerald-500/10 rounded-full blur-[100px] opacity-80" />
          <div className="absolute top-[20%] left-[-5%] w-[500px] h-[400px] bg-sky-100/35 dark:bg-cyan-500/10 rounded-full blur-[90px] opacity-70" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto">

        {/* Top Trust Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50/90 dark:bg-emerald-950/70 border border-emerald-200/90 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-2xs backdrop-blur-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse shrink-0" />
            <span className="tracking-wider uppercase text-[10px] sm:text-xs font-extrabold">Verified Cooperative Network</span>
          </div>
        </div>

        {/* Hero Main Heading & Copy */}
        <div className="text-center max-w-4xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] font-outfit">
            {currentUser?.role === 'Worker' ? (
              <>
                Find verified local jobs. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-300">
                  Build with your cooperative union.
                </span>
              </>
            ) : (
              <>
                Find verified local workers. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-300">
                  Manage your work, from hire to completion.
                </span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 font-semibold tracking-wide flex items-center justify-center gap-2 sm:gap-3 flex-wrap pt-1">
            <span>Trusted workers</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span>Fair pricing</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span>Verified cooperative ID</span>
          </p>
        </div>

        {/* Actionable Search & Location Card */}
        <div id="ai-request-box" className="mt-8 max-w-4xl mx-auto z-20 relative">
          <div className="bg-white dark:bg-slate-900/95 rounded-3xl p-5 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-2xl">
            
            <div className="flex items-center justify-between mb-2.5 px-1">
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 font-outfit uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-emerald-600" />
                What do you need help with?
              </h3>
              <span className="text-[10px] text-slate-400 font-bold hidden sm:inline-block">Instant Cooperative Match</span>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">

                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchPrompt}
                    onChange={(e) => setSearchPrompt(e.target.value)}
                    placeholder="Search plumber, AC repair, electrician, painter, carpenter..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                {/* Primary Role-Aware CTA Button */}
                <button
                  type="submit"
                  disabled={isClassifying}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
                >
                  {isClassifying ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{getCtaButtonText()}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Location Selector & Popular Chips */}
              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-300 gap-2">
                
                {/* Clickable Location Control */}
                <button
                  type="button"
                  onClick={() => setIsCityModalOpen(true)}
                  className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-colors cursor-pointer group"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold">{currentCity}</span>
                  <span className="ml-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold underline">Change</span>
                </button>

                {/* Popular Tags */}
                <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto pb-1 sm:pb-0">
                  <span className="font-bold text-slate-700 dark:text-slate-300 hidden md:inline">Popular:</span>
                  <div className="flex flex-wrap gap-1">
                    {['AC Repair', 'Plumbing', 'Electrician', 'Painting', 'Cleaning'].map((tag) => {
                      const isSelected = searchPrompt.toLowerCase() === tag.toLowerCase();
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handlePopularTagClick(tag)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isSelected
                            ? 'bg-emerald-600 text-white border border-emerald-600 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-800 dark:hover:text-emerald-300 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </form>

            {/* AI Classification Feedback */}
            {aiResult && !isClassifying && (
              <div className="mt-3 p-3 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-start space-x-3 animate-in slide-in-from-top-1 duration-200">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 text-base font-bold">
                  ⚡
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white font-outfit">
                      {aiResult.category} Recommended
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-full">
                      {aiResult.confidence}% match
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">{aiResult.reason}</p>

                  <button
                    onClick={() => {
                      if (onSearchService) onSearchService(aiResult.category, currentCity);
                      const elem = document.getElementById('workers-directory');
                      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-2 w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>View Verified {aiResult.category} Workers</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Immediate 4 Trust Badges Under Search Box */}
        <div className="mt-4 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] font-bold text-slate-600 dark:text-slate-300">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Cooperative Verified</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Transparent Rates</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Digital Worker ID</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>QR Verification</span>
          </div>
        </div>

      </div>

      {/* Floating Animated SCROLL Down Indicator Pinned at Bottom of Viewport */}
      <div 
        onClick={() => {
          const elem = document.getElementById('popular-services') || document.getElementById('how-sahkari-works') || document.getElementById('workers-directory');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        }}
        className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center cursor-pointer group select-none transition-all z-20 hover:scale-105"
        title="Scroll to explore"
      >
        <span className="text-[9px] sm:text-[10px] font-extrabold tracking-[0.35em] uppercase text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-outfit mb-1.5">
          SCROLL
        </span>
        <div className="relative w-[1.5px] h-8 sm:h-10 bg-slate-200 dark:bg-slate-700/80 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-emerald-500 dark:via-emerald-400 to-emerald-600 dark:to-teal-300 rounded-full animate-scroll-line" />
        </div>
      </div>

      {/* Select Location Modal */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white font-outfit text-base">Choose Your Location</h3>
              </div>
              <button
                onClick={() => setIsCityModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* City Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={citySearchQuery}
                onChange={e => setCitySearchQuery(e.target.value)}
                placeholder="Search city or area..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Popular City Grid */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Popular Cities</span>
              <div className="grid grid-cols-2 gap-2">
                {filteredCities.map((city) => {
                  const isSelected = currentCity === city;
                  return (
                    <button
                      key={city}
                      onClick={() => handleSelectCity(city)}
                      className={`text-left px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750'
                        }`}
                    >
                      <span className="truncate">{city.split(',')[0]}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Manual Input */}
            {citySearchQuery && filteredCities.length === 0 && (
              <button
                type="button"
                onClick={() => handleSelectCity(citySearchQuery)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Set Location to "{citySearchQuery}"
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
