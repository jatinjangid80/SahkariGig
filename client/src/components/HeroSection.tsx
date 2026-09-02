import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle, Star, MapPin, ArrowRight, Sparkles, ChevronDown, Check } from 'lucide-react';
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
  'Bengaluru, Karnataka',
  'Mumbai, Maharashtra',
  'Pune, Maharashtra',
  'Ahmedabad, Gujarat',
  'Lucknow, Uttar Pradesh',
  'Hyderabad, Telangana'
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
  const [customCityInput, setCustomCityInput] = useState('');
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
  };

  const handleCustomCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCityInput.trim()) {
      handleSelectCity(customCityInput.trim());
      setCustomCityInput('');
    }
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

      if (text.includes('fan') || text.includes('wire') || text.includes('switch') || text.includes('light') || text.includes('mcb') || text.includes('spark') || text.includes('electr')) {
        matchedCategory = 'Electrician';
        reason = 'Matched electrical repair, wiring & lighting troubleshooting.';
      } else if (text.includes('pipe') || text.includes('leak') || text.includes('tap') || text.includes('drain') || text.includes('sink') || text.includes('plumb') || text.includes('water')) {
        matchedCategory = 'Plumber';
        reason = 'Matched plumbing fixtures, water supply & drain repairs.';
      } else if (text.includes('ac') || text.includes('cool') || text.includes('filter') || text.includes('refrigerat') || text.includes('air cond')) {
        matchedCategory = 'AC Repair';
        reason = 'Matched AC servicing, cooling troubleshooting & HVAC.';
      } else if (text.includes('paint') || text.includes('wall') || text.includes('color') || text.includes('putty')) {
        matchedCategory = 'Painter';
        reason = 'Matched interior/exterior wall painting & touch-up work.';
      } else if (text.includes('clean') || text.includes('dust') || text.includes('maid') || text.includes('sweep') || text.includes('mopping')) {
        matchedCategory = 'Cleaning';
        reason = 'Matched deep home cleaning, housekeeping & sanitize service.';
      } else if (text.includes('door') || text.includes('wood') || text.includes('table') || text.includes('lock') || text.includes('carpenter') || text.includes('furniture')) {
        matchedCategory = 'Carpenter';
        reason = 'Matched woodwork, furniture assembly & door fitting.';
      } else if (text.includes('car') || text.includes('bike') || text.includes('vehicle') || text.includes('puncture') || text.includes('mechanic')) {
        matchedCategory = 'Vehicle Repair';
        reason = 'Matched automotive mechanic and vehicle maintenance.';
      } else if (text.includes('move') || text.includes('shift') || text.includes('pack') || text.includes('transport')) {
        matchedCategory = 'Moving';
        reason = 'Matched home shifting, packing & heavy transport assistance.';
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
      console.error("Search Error:", err);
      if (onSearchService) onSearchService(query, currentCity);
    } finally {
      setIsClassifying(false);
    }
  };

  return (
    <section className="relative bg-white pt-6 pb-8 sm:pt-8 sm:pb-12 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[380px]">
          <div className="absolute top-[-10%] right-[-5%] w-[450px] h-[450px] bg-emerald-100/35 rounded-full blur-[80px] opacity-70" />
          <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-sky-100/35 rounded-full blur-[70px] opacity-60" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Trust Badge */}
        <div className="flex justify-center mb-3.5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50/90 border border-emerald-200/80 text-emerald-800 text-[11px] font-bold shadow-2xs backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="tracking-wide uppercase text-[10px] font-bold">Verified Cooperative Network</span>
          </div>
        </div>

        {/* Hero Main Heading & Copy */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-slate-900 tracking-tight leading-[1.15] font-outfit">
            {currentUser?.role === 'Worker' ? (
              <>
                Find trusted local work. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                  Build your cooperative workforce.
                </span>
              </>
            ) : (
              <>
                Find trusted local workers. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                  Get your job done right.
                </span>
              </>
            )}
          </h1>
          
          <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto">
            Community-powered marketplace for verified professionals, workers and cooperatives.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              onClick={() => {
                const elem = document.getElementById('workers-directory');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                else if (onNavigate) onNavigate('/workers');
              }}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md hover:shadow-emerald-600/25 transition-all flex items-center justify-center btn-interaction cursor-pointer"
            >
              Hire Workers
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
            {currentUser?.role !== 'Customer' && (
              <button
                onClick={() => onNavigate && onNavigate('/for-workers')}
                className="w-full sm:w-auto px-6 py-2.5 sm:py-3 text-sm font-bold text-slate-700 bg-white border border-slate-300 hover:border-emerald-600 hover:text-emerald-700 rounded-xl shadow-2xs transition-all flex items-center justify-center btn-interaction cursor-pointer"
              >
                Find Work
              </button>
            )}
          </div>

          {/* Trust Statistics Cards (Compact 3-Card Format) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3.5 max-w-lg mx-auto my-4 sm:my-5">
            <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-xl p-2.5 sm:p-3 text-center shadow-2xs">
              <div className="flex items-center justify-center space-x-1 text-emerald-700 font-extrabold text-sm sm:text-lg font-outfit">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>142+</span>
              </div>
              <p className="text-[10px] font-semibold text-slate-600 mt-0.5">Active Members</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-xl p-2.5 sm:p-3 text-center shadow-2xs">
              <div className="flex items-center justify-center space-x-1 text-emerald-700 font-extrabold text-sm sm:text-lg font-outfit">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>98%</span>
              </div>
              <p className="text-[10px] font-semibold text-slate-600 mt-0.5">Verified Profiles</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-xl p-2.5 sm:p-3 text-center shadow-2xs">
              <div className="flex items-center justify-center space-x-1 text-amber-500 font-extrabold text-sm sm:text-lg font-outfit">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                <span>4.8</span>
              </div>
              <p className="text-[10px] font-semibold text-slate-600 mt-0.5">Average Rating</p>
            </div>
          </div>
        </div>

        {/* High-Conversion Search Box with Location */}
        <div id="ai-request-box" className="mt-1 max-w-3xl mx-auto z-20 relative">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-lg">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 font-outfit uppercase tracking-wider mb-2.5">
              What service do you need?
            </h3>

            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="space-y-2.5">
              <div className="flex flex-col sm:flex-row gap-2">
                
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchPrompt}
                    onChange={(e) => setSearchPrompt(e.target.value)}
                    placeholder="Search for a service, skill, or problem (e.g. AC Repair, Plumber)..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                </div>

                {/* Primary CTA Search Button (Strong Dark Green) */}
                <button
                  type="submit"
                  disabled={isClassifying}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 shrink-0 btn-interaction cursor-pointer"
                >
                  {isClassifying ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Find Workers</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Prominent Location + Popular Tags Row */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                <div className="flex items-center space-x-1.5">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200/80 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 mr-1 shrink-0" />
                    <span className="font-semibold text-slate-800">{currentCity}</span>
                    <button
                      type="button"
                      onClick={() => setIsCityModalOpen(true)}
                      className="ml-2 text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer text-[11px]"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                  <span className="font-bold text-slate-700">Popular:</span>
                  <div className="flex flex-wrap gap-1">
                    {['AC Repair', 'Plumbing', 'Electrician', 'Painting', 'Cleaning'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handlePopularTagClick(tag)}
                        className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 text-slate-700 font-medium transition-colors cursor-pointer text-xs"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </form>

            {/* AI Classification Result Box */}
            {aiResult && !isClassifying && (
              <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start space-x-3 animate-in slide-in-from-top-2 fade-in duration-300">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 text-lg border border-emerald-200">
                  {aiResult.category === 'Electrician' && '⚡'}
                  {aiResult.category === 'Plumber' && '🔧'}
                  {aiResult.category === 'Painter' && '🎨'}
                  {aiResult.category === 'Carpenter' && '🪚'}
                  {aiResult.category === 'AC Repair' && '❄️'}
                  {aiResult.category === 'Cleaning' && '🧹'}
                  {aiResult.category === 'Vehicle Repair' && '🚗'}
                  {aiResult.category === 'Moving' && '📦'}
                  {aiResult.category === 'Technician' && '🛠️'}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-outfit">
                        {aiResult.category} Recommended
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">{aiResult.reason}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full shrink-0 border border-emerald-200">
                      {aiResult.confidence}% match
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (onSearchService) onSearchService(aiResult.category, currentCity);
                      const elem = document.getElementById('workers-directory');
                      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-2.5 w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>See Available {aiResult.category} Workers in {currentCity.split(',')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Location Selector Modal */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900 font-outfit">Select Your Location</h3>
              </div>
              <button
                onClick={() => setIsCityModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Choose your city to find verified cooperative workers and service technicians near you.
            </p>

            {/* Popular City Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {POPULAR_CITIES.map((city) => {
                const isSelected = currentCity === city;
                return (
                  <button
                    key={city}
                    onClick={() => handleSelectCity(city)}
                    className={`text-left px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{city.split(',')[0]}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Location Input */}
            <form onSubmit={handleCustomCitySubmit} className="pt-3 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={customCityInput}
                onChange={(e) => setCustomCityInput(e.target.value)}
                placeholder="Or type other city / area..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
