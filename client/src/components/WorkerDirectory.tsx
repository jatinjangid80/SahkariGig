import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, MapPin, Search, Filter, QrCode, CheckCircle, Zap, UserCheck } from 'lucide-react';
import { supabase } from '../supabase';

interface Worker {
  id: string;
  name: string;
  avatar: string;
  trade: string;
  rating: number;
  reviewsCount: number;
  coopName: string;
  city?: string;
  hourlyRate: string;
  distanceKm: number;
  isAvailableToday: boolean;
  isTopRated: boolean;
  workerId: string;
}

interface WorkerDirectoryProps {
  selectedCategory?: string;
  selectedCity?: string;
  onSelectWorkerForBooking: (worker: Worker) => void;
  onViewWorkerProfile: (worker: Worker) => void;
  onVerifyQrCode: (workerId: string) => void;
  currentUserId?: string;
}

export const WorkerDirectory: React.FC<WorkerDirectoryProps> = ({
  selectedCategory = 'All',
  selectedCity = 'Jaipur',
  onSelectWorkerForBooking,
  onViewWorkerProfile,
  onVerifyQrCode,
  currentUserId
}) => {
  const [filterTrade, setFilterTrade] = useState(selectedCategory);
  const [minRating, setMinRating] = useState(4.0);
  const [maxDistance, setMaxDistance] = useState(15);
  const [searchQuery, setSearchQuery] = useState('');
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync prop changes into state
  useEffect(() => {
    if (selectedCategory) {
      setFilterTrade(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const fetchWorkers = async () => {
      setIsLoading(true);
      let fetchedWorkers: Worker[] = [];
      try {
        const { data, error } = await supabase.from('workers').select('*');
        if (error) throw error;
        
        if (data && data.length > 0) {
          const formattedWorkers = data.map(w => {
            let finalAvatar = w.avatar;
            if (!finalAvatar || finalAvatar.includes('1540569014015-19a7be504e3a')) {
              finalAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(w.name || 'User')}&background=10b981&color=fff&size=150`;
            }
            return {
              id: w.id,
              name: w.name,
              avatar: finalAvatar,
              trade: w.trade,
              rating: Number(w.rating) || 4.8,
              reviewsCount: w.reviews_count || 124,
              coopName: w.coop_name || 'Jaipur Sahkari Labour Cooperative Society',
              city: w.city || 'Jaipur',
              hourlyRate: w.hourly_rate || '₹400–₹700 / visit',
              distanceKm: Number(w.distance_km) || 2.5,
              isAvailableToday: w.is_available_today ?? true,
              isTopRated: w.is_top_rated ?? true,
              workerId: w.worker_id || `WORKER-JAI-${w.id.slice(0, 4).toUpperCase()}`
            };
          });
          fetchedWorkers = [...fetchedWorkers, ...formattedWorkers];
        }
      } catch (err) {
        console.error("Failed to fetch workers from database, using local fallbacks:", err);
      } finally {
        // Fetch from localStorage
        const localWorkers: Worker[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('worker_profile_')) {
            try {
              const profileStr = localStorage.getItem(key);
              if (profileStr) {
                const p = JSON.parse(profileStr);
                const uid = key.replace('worker_profile_', '');
                let finalLocalAvatar = p.avatarUrl;
                if (!finalLocalAvatar || finalLocalAvatar.includes('1540569014015-19a7be504e3a')) {
                  finalLocalAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.fullName || 'User')}&background=10b981&color=fff&size=150`;
                }
                localWorkers.push({
                  id: uid,
                  name: p.fullName || 'Demo Worker',
                  avatar: finalLocalAvatar,
                  trade: p.skill || 'Electrician',
                  rating: 5.0,
                  reviewsCount: 18,
                  coopName: p.coop || 'Jaipur Labour Cooperative Federation',
                  city: p.city || 'Jaipur',
                  hourlyRate: p.skill === 'Electrician' ? '₹400–₹700 / visit' : (p.skill === 'Plumber' ? '₹350–₹650 / visit' : '₹500–₹900 / visit'),
                  distanceKm: p.radius ? p.radius / 2 : 1.5,
                  isAvailableToday: p.availableDays?.includes('Monday') ?? true,
                  isTopRated: true,
                  workerId: `WORKER-JAI-${uid.slice(0, 4).toUpperCase()}`
                });
              }
            } catch (e) {
              console.error("Failed to parse local profile:", e);
            }
          }
        }
        
        // Filter out duplicates
        const combined = [...fetchedWorkers];
        localWorkers.forEach(lw => {
          if (!combined.find(w => w.id === lw.id || w.workerId === lw.workerId || w.name === lw.name)) {
            combined.push(lw);
          }
        });

        // Add high-quality verified showcase workers
        if (combined.length < 4) {
           combined.push({
             id: 'worker-1',
             name: 'Rajesh Kumar',
             avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=047857&color=fff&size=150',
             trade: 'Electrician',
             rating: 4.8,
             reviewsCount: 124,
             coopName: 'Jaipur Sahkari Labour Federation',
             city: 'Jaipur',
             hourlyRate: '₹400–₹700 / visit',
             distanceKm: 2.1,
             isAvailableToday: true,
             isTopRated: true,
             workerId: 'WORKER-JAI-1011'
           });
           combined.push({
             id: 'worker-2',
             name: 'Amit Verma',
             avatar: 'https://ui-avatars.com/api/?name=Amit+Verma&background=0284c7&color=fff&size=150',
             trade: 'Plumber',
             rating: 4.9,
             reviewsCount: 98,
             coopName: 'Rajasthan Labour Cooperative Society',
             city: 'Jaipur',
             hourlyRate: '₹350–₹650 / visit',
             distanceKm: 3.4,
             isAvailableToday: true,
             isTopRated: true,
             workerId: 'WORKER-JAI-2042'
           });
           combined.push({
             id: 'worker-3',
             name: 'Suresh Jangid',
             avatar: 'https://ui-avatars.com/api/?name=Suresh+Jangid&background=d97706&color=fff&size=150',
             trade: 'Carpenter',
             rating: 4.8,
             reviewsCount: 76,
             coopName: 'Jaipur Artisan Cooperative Federation',
             city: 'Jaipur',
             hourlyRate: '₹450–₹800 / visit',
             distanceKm: 1.8,
             isAvailableToday: true,
             isTopRated: true,
             workerId: 'WORKER-JAI-4122'
           });
           combined.push({
             id: 'worker-4',
             name: 'Mahesh Sharma',
             avatar: 'https://ui-avatars.com/api/?name=Mahesh+Sharma&background=059669&color=fff&size=150',
             trade: 'AC Repair',
             rating: 4.9,
             reviewsCount: 142,
             coopName: 'Pink City HVAC Technicians Cooperative',
             city: 'Jaipur',
             hourlyRate: '₹500–₹850 / visit',
             distanceKm: 2.9,
             isAvailableToday: true,
             isTopRated: true,
             workerId: 'WORKER-JAI-5104'
           });
           combined.push({
             id: 'worker-5',
             name: 'Sunita Devi',
             avatar: 'https://ui-avatars.com/api/?name=Sunita+Devi&background=7c3aed&color=fff&size=150',
             trade: 'Cleaning',
             rating: 4.9,
             reviewsCount: 215,
             coopName: 'Mahila Sahkari Labour Union',
             city: 'Jaipur',
             hourlyRate: '₹250–₹500 / visit',
             distanceKm: 1.2,
             isAvailableToday: true,
             isTopRated: true,
             workerId: 'WORKER-JAI-3099'
           });
           combined.push({
             id: 'worker-6',
             name: 'Vikram Singh',
             avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=db2777&color=fff&size=150',
             trade: 'Painter',
             rating: 4.7,
             reviewsCount: 88,
             coopName: 'Jaipur Painters & Polishers Guild',
             city: 'Jaipur',
             hourlyRate: '₹400–₹750 / visit',
             distanceKm: 4.5,
             isAvailableToday: true,
             isTopRated: false,
             workerId: 'WORKER-JAI-6201'
           });
        }
        
        setWorkers(combined);
        setIsLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const filteredWorkers = workers.filter((worker) => {
    // Hide the currently logged-in user from the directory
    if (currentUserId && worker.id === currentUserId) {
      return false;
    }

    const matchesTrade = 
      filterTrade === 'All' || 
      filterTrade === '' || 
      worker.trade.toLowerCase() === filterTrade.toLowerCase() ||
      (filterTrade.toLowerCase() === 'domestic help' && worker.trade.toLowerCase().includes('clean')) ||
      (filterTrade.toLowerCase() === 'cleaning' && worker.trade.toLowerCase().includes('clean')) ||
      (filterTrade.toLowerCase() === 'technician' && (worker.trade.toLowerCase().includes('ac') || worker.trade.toLowerCase().includes('tech')));

    const matchesRating = worker.rating >= minRating;
    const matchesDistance = worker.distanceKm <= maxDistance;
    const matchesQuery = 
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      worker.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.coopName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTrade && matchesRating && matchesDistance && matchesQuery;
  });

  return (
    <section id="workers-directory" className="py-14 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200">
              Verified Marketplace
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-outfit">
              Trusted workers near you
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Directly connect with background-checked cooperative professionals with standard rates & QR identity.
            </p>
          </div>

          <button
            onClick={() => {
              if (filteredWorkers.length > 0) {
                onSelectWorkerForBooking(filteredWorkers[0]);
              }
            }}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2 self-start md:self-auto cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Auto-Assign Best Match</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 mb-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, skill, or problem..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category & Rating Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
            <div className="flex items-center space-x-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold text-slate-700">Category:</span>
              <select
                value={filterTrade}
                onChange={(e) => setFilterTrade(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Services</option>
                <option value="Electrician">Electrician</option>
                <option value="Plumber">Plumber</option>
                <option value="AC Repair">AC Repair</option>
                <option value="Painter">Painter</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Vehicle Repair">Vehicle Repair</option>
                <option value="Moving">Moving</option>
                <option value="Caregiver">Caregiver</option>
              </select>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-slate-700">Min Rating:</span>
              <select
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value={4.0}>4.0 ★ & above</option>
                <option value={4.5}>4.5 ★ & above</option>
                <option value={4.8}>4.8 ★ & above</option>
              </select>
            </div>
          </div>

        </div>

        {/* Worker Cards Grid */}
        {filteredWorkers.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
            <p className="text-sm font-semibold text-slate-700">No workers match your current filters.</p>
            <button
              onClick={() => {
                setFilterTrade('All');
                setMinRating(4.0);
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => {
              const getTradeIcon = (trade: string) => {
                if (trade.toLowerCase().includes('electrician')) return '⚡';
                if (trade.toLowerCase().includes('plumber')) return '🔧';
                if (trade.toLowerCase().includes('ac') || trade.toLowerCase().includes('cool')) return '❄️';
                if (trade.toLowerCase().includes('painter')) return '🎨';
                if (trade.toLowerCase().includes('carpenter')) return '🔨';
                if (trade.toLowerCase().includes('clean')) return '🧹';
                if (trade.toLowerCase().includes('car') || trade.toLowerCase().includes('vehic')) return '🚗';
                if (trade.toLowerCase().includes('move') || trade.toLowerCase().includes('pack')) return '📦';
                return '🛠️';
              };

              return (
                <div 
                  key={worker.id} 
                  className="bg-white border border-slate-200/90 shadow-xs hover:shadow-lg transition-all rounded-2xl p-5 sm:p-6 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Photo, Name, Verified Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={worker.avatar}
                          alt={worker.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-emerald-100 shadow-xs"
                        />
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <h3 className="text-base font-bold text-slate-900 font-outfit">{worker.name}</h3>
                          </div>
                          <p className="text-xs font-bold text-emerald-800 flex items-center mt-0.5">
                            <span className="mr-1">{getTradeIcon(worker.trade)}</span> 
                            {worker.trade}
                          </p>
                        </div>
                      </div>

                      {/* Verified Badge */}
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    </div>

                    {/* Stats Stack */}
                    <div className="space-y-2 text-xs text-slate-600 bg-slate-50/70 rounded-xl p-3 border border-slate-100 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1.5 shrink-0" />
                          <span className="font-bold text-slate-900 mr-1">{worker.rating}</span>
                          <span className="text-slate-500">· {worker.reviewsCount} jobs</span>
                        </div>
                        <div className="flex items-center text-slate-500 font-medium">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                          <span>{worker.city || 'Jaipur'} · {worker.distanceKm} km</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 text-[11px]">
                        <span className="text-slate-500 truncate max-w-[170px]" title={worker.coopName}>
                          {worker.coopName}
                        </span>
                        {worker.isAvailableToday && (
                          <span className="text-emerald-700 font-semibold flex items-center shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                            Available Today
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer: Price & CTA Actions */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold text-slate-500">Standard Rate:</span>
                      <span className="font-extrabold text-sm text-slate-900 font-outfit">{worker.hourlyRate}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => onViewWorkerProfile(worker)}
                        className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center border border-slate-200 cursor-pointer"
                      >
                        View Profile
                      </button>

                      <button
                        onClick={() => onSelectWorkerForBooking(worker)}
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center cursor-pointer"
                      >
                        Book Worker
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
