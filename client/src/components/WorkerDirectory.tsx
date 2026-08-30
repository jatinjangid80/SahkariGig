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
  hourlyRate: string;
  distanceKm: number;
  isAvailableToday: boolean;
  isTopRated: boolean;
  workerId: string;
}

interface WorkerDirectoryProps {
  selectedCategory?: string;
  onSelectWorkerForBooking: (worker: Worker) => void;
  onViewWorkerProfile: (worker: Worker) => void;
  onVerifyQrCode: (workerId: string) => void;
  currentUserId?: string;
}

export const WorkerDirectory: React.FC<WorkerDirectoryProps> = ({
  selectedCategory = 'All',
  onSelectWorkerForBooking,
  onViewWorkerProfile,
  onVerifyQrCode,
  currentUserId
}) => {
  const [filterTrade, setFilterTrade] = useState(selectedCategory);
  const [minRating, setMinRating] = useState(4.0);
  const [maxDistance, setMaxDistance] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
              rating: Number(w.rating) || 4.5,
              reviewsCount: w.reviews_count || 10,
              coopName: w.coop_name,
              hourlyRate: w.hourly_rate,
              distanceKm: Number(w.distance_km) || 2.0,
              isAvailableToday: w.is_available_today,
              isTopRated: w.is_top_rated,
              workerId: w.worker_id
            };
          });
          fetchedWorkers = [...fetchedWorkers, ...formattedWorkers];
        }
      } catch (err) {
        console.error("Failed to fetch workers from database, using local fallbacks:", err);
      } finally {
        // Now also fetch from localStorage to ensure new demo workers show up even if DB insert failed
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
                  reviewsCount: 0,
                  coopName: p.coop || 'Delhi Labour Cooperative Federation',
                  hourlyRate: p.skill === 'Electrician' ? '₹400–₹700 / visit' : (p.skill === 'Plumber' ? '₹350–₹650 / visit' : '₹500–₹900 / visit'),
                  distanceKm: p.radius ? p.radius / 2 : 1.5,
                  isAvailableToday: p.availableDays?.includes('Monday') ?? true,
                  isTopRated: true,
                  workerId: `WORKER-DEL-${uid.slice(0, 4).toUpperCase()}`
                });
              }
            } catch (e) {
              console.error("Failed to parse local profile:", e);
            }
          }
        }
        
        // Filter out duplicates (if the DB and local storage both have the same worker)
        const combined = [...fetchedWorkers];
        localWorkers.forEach(lw => {
          if (!combined.find(w => w.id === lw.id || w.workerId === lw.workerId || w.name === lw.name)) {
            combined.push(lw);
          }
        });

        // Add dummy data if STILL empty
        if (combined.length === 0) {
           combined.push({
             id: 'dummy-1',
             name: 'Rajesh Kumar',
             avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=10b981&color=fff&size=150',
             trade: 'Electrician',
             rating: 4.8,
             reviewsCount: 124,
             coopName: 'Delhi Labour Cooperative Federation',
             hourlyRate: '₹400–₹700 / visit',
             distanceKm: 2.5,
             isAvailableToday: true,
             isTopRated: true,
             workerId: 'WORKER-DEL-1011'
           });
           combined.push({
             id: 'dummy-2',
             name: 'Amit Singh',
             avatar: 'https://ui-avatars.com/api/?name=Amit+Singh&background=10b981&color=fff&size=150',
             trade: 'Plumber',
             rating: 4.6,
             reviewsCount: 89,
             coopName: 'Noida Builders Cooperative Society',
             hourlyRate: '₹350–₹650 / visit',
             distanceKm: 4.2,
             isAvailableToday: true,
             isTopRated: false,
             workerId: 'WORKER-UP-2042'
           });
           combined.push({
             id: 'dummy-3',
             name: 'Priya Sharma',
             avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=10b981&color=fff&size=150',
             trade: 'Domestic Help',
             rating: 4.9,
             reviewsCount: 210,
             coopName: 'Delhi Labour Cooperative Federation',
             hourlyRate: '₹200–₹400 / visit',
             distanceKm: 1.1,
             isAvailableToday: true,
             isTopRated: true,
             workerId: 'WORKER-DEL-3099'
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

    const matchesTrade = filterTrade === 'All' || filterTrade === '' || worker.trade.toLowerCase() === filterTrade.toLowerCase();
    const matchesRating = worker.rating >= minRating;
    const matchesDistance = worker.distanceKm <= maxDistance;
    const matchesQuery = worker.name.toLowerCase().includes(searchQuery.toLowerCase()) || worker.trade.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTrade && matchesRating && matchesDistance && matchesQuery;
  });

  return (
    <section id="workers-directory" className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Verified Marketplace
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-outfit">
              Verified workers near you
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Book verified cooperative-affiliated tradespeople with transparent pricing & instant confirmation.
            </p>
          </div>

          <button
            onClick={() => {
              if (filteredWorkers.length > 0) {
                onSelectWorkerForBooking(filteredWorkers[0]);
              }
            }}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2 self-start md:self-auto"
          >
            <Zap className="w-4 h-4" />
            <span>Auto-Assign Best Match (Skill + Proximity)</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="light-card p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by worker or trade..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
            <div className="flex items-center space-x-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold text-slate-700">Category:</span>
              <select
                value={filterTrade}
                onChange={(e) => setFilterTrade(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Categories</option>
                <option value="Electrician">Electrician</option>
                <option value="Plumber">Plumber</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Painter">Painter</option>
                <option value="Domestic Help">Domestic Help</option>
                <option value="Caregiver">Caregiver</option>
              </select>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-slate-700">Min Rating:</span>
              <select
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value={4.0}>4.0 ★ & above</option>
                <option value={4.5}>4.5 ★ & above</option>
                <option value={4.8}>4.8 ★ & above</option>
              </select>
            </div>
          </div>

        </div>

        {/* Worker Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map((worker) => {
            const getTradeIcon = (trade: string) => {
              if (trade.toLowerCase().includes('electrician')) return '⚡';
              if (trade.toLowerCase().includes('plumber')) return '🔧';
              if (trade.toLowerCase().includes('painter')) return '🎨';
              if (trade.toLowerCase().includes('carpenter')) return '🪚';
              return '🛠️';
            };

            return (
              <div key={worker.id} className="bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  {/* Header: Photo, Name, Trade */}
                  <div className="flex items-center space-x-4 mb-5">
                    <img
                      src={worker.avatar}
                      alt={worker.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-emerald-100 shadow-sm"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-outfit">{worker.name}</h3>
                      <p className="text-sm font-semibold text-emerald-700 flex items-center">
                        <span className="mr-1.5 text-base">{getTradeIcon(worker.trade)}</span> 
                        {worker.trade}
                      </p>
                    </div>
                  </div>

                  {/* Body: Stats Stack */}
                  <div className="space-y-2.5 text-sm text-slate-600">
                    <div className="flex items-center text-emerald-700 font-medium">
                      <CheckCircle className="w-4 h-4 mr-2.5 shrink-0" />
                      Cooperative Verified
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-2.5 fill-amber-400 text-amber-400 shrink-0" />
                      <span className="font-semibold text-slate-900 mr-1">{worker.rating}</span>
                      <span>({worker.reviewsCount} reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2.5 text-slate-400 shrink-0" />
                      {worker.distanceKm} km away
                    </div>
                    {worker.isAvailableToday && (
                      <div className="flex items-center text-emerald-600 font-medium">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3.5 ml-1 animate-pulse" />
                        Available today
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer: Price & Actions */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <div className="font-bold text-slate-900 mb-4">{worker.hourlyRate}</div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => onViewWorkerProfile(worker)}
                      className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl transition-colors flex items-center justify-center border border-slate-200"
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() => onSelectWorkerForBooking(worker)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-colors flex items-center justify-center"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
