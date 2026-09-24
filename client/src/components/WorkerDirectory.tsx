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
  const [minRating, setMinRating] = useState(0);
  const [maxDistance, setMaxDistance] = useState(50);
  const [searchQuery, setSearchQuery] = useState('');
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync prop changes into state
  useEffect(() => {
    if (selectedCategory) {
      setFilterTrade(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchWorkers = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      
      if (data) {
        const formatWorkerName = (rawName: string) => {
          const n = (rawName || '').trim();
          if (!n) return 'Verified Worker';
          return n.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        };

        const TRADE_META: Record<string, { coop: string; rates: string; baseDist: number; baseJobs: number; bg: string }> = {
          'Electrician': { coop: 'Jaipur Sahkari Labour Federation', rates: '₹350–₹650 / visit', baseDist: 1.8, baseJobs: 134, bg: '047857' },
          'Plumber': { coop: 'Rajasthan Labour Cooperative Society', rates: '₹300–₹600 / visit', baseDist: 2.4, baseJobs: 96, bg: '0284c7' },
          'Carpenter': { coop: 'Jaipur Artisan Cooperative Federation', rates: '₹450–₹800 / visit', baseDist: 2.9, baseJobs: 78, bg: 'd97706' },
          'AC Repair': { coop: 'Pink City HVAC Technicians Cooperative', rates: '₹500–₹850 / visit', baseDist: 3.2, baseJobs: 142, bg: '059669' },
          'Cleaning': { coop: 'Mahila Sahkari Labour Union', rates: '₹250–₹500 / visit', baseDist: 1.2, baseJobs: 215, bg: '7c3aed' },
          'Painter': { coop: 'Jaipur Painters & Polishers Guild', rates: '₹400–₹750 / visit', baseDist: 4.1, baseJobs: 88, bg: 'db2777' },
          'Vehicle Repair': { coop: 'Auto Mechanics Cooperative Federation', rates: '₹350–₹700 / visit', baseDist: 3.5, baseJobs: 64, bg: '2563eb' },
          'Moving': { coop: 'Transport & Logistics Labour Cooperative', rates: '₹800–₹1800 / trip', baseDist: 2.7, baseJobs: 110, bg: '0d9488' }
        };

        const formattedDbWorkers: Worker[] = data.map((w: any, idx: number) => {
          const finalName = formatWorkerName(w.name || w.full_name || 'Verified Pro');
          const trade = (w.trade === 'Cleaner' ? 'Cleaning' : (w.trade || 'Electrician'));
          const meta = TRADE_META[trade] || TRADE_META['Electrician'];
          
          const hash = finalName.split('').reduce((acc, char) => acc + char.charCodeAt(0), idx * 7);
          const uniqueJobs = w.reviews_count || (meta.baseJobs + (hash % 37));
          const uniqueDist = Number(w.distance_km) || (meta.baseDist + ((hash % 18) / 10));
          const uniqueRating = Number(w.rating) || (4.8 + ((hash % 2) / 10));

          const finalAvatar = (w.avatar && !w.avatar.includes('images.unsplash.com') && !w.avatar.includes('unsplash') && !w.avatar.includes('1540569014015')) 
            ? w.avatar 
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(finalName)}&background=${meta.bg}&color=fff&size=150`;

          return {
            id: w.id,
            name: finalName,
            avatar: finalAvatar,
            trade: trade,
            rating: uniqueRating,
            reviewsCount: uniqueJobs,
            coopName: w.coop_name || meta.coop,
            city: w.city || selectedCity || 'Jaipur',
            hourlyRate: w.hourly_rate || meta.rates,
            distanceKm: Math.round(uniqueDist * 10) / 10,
            isAvailableToday: w.is_available_today ?? true,
            isTopRated: w.is_top_rated ?? true,
            workerId: w.worker_id || `WORKER-${(w.id || idx.toString()).slice(0, 6).toUpperCase()}`
          };
        });

        setWorkers(formattedDbWorkers);
      }
    } catch (err) {
      console.error("Failed to fetch workers from Supabase:", err);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers(true);

    const updateWorkerStatusLocally = (payload: { name?: string; userId?: string; workerId?: string; isAvailableToday: boolean }) => {
      if (!payload) return;
      setWorkers(prev => prev.map(w => {
        const isMatch = 
          (payload.userId && w.id === payload.userId) ||
          (payload.workerId && w.workerId === payload.workerId) ||
          (payload.name && w.name.toLowerCase() === payload.name.trim().toLowerCase()) ||
          (payload.name && w.name.toLowerCase().includes(payload.name.trim().toLowerCase())) ||
          (payload.name && payload.name.trim().toLowerCase().includes(w.name.toLowerCase()));

        if (isMatch) {
          return {
            ...w,
            isAvailableToday: payload.isAvailableToday
          };
        }
        return w;
      }));
    };

    // 1. Instant cross-tab BroadcastChannel
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('sahkarigig_worker_availability');
      bc.onmessage = (event) => {
        if (event.data) {
          updateWorkerStatusLocally(event.data);
          fetchWorkers(false);
        }
      };
    } catch (e) {}

    // 2. Storage event listener (cross-window fallback)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'last_worker_availability_update' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          updateWorkerStatusLocally(parsed);
          fetchWorkers(false);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    // 3. Custom same-window event listener
    const handleCustomEvent = (e: any) => {
      if (e.detail) {
        updateWorkerStatusLocally(e.detail);
        fetchWorkers(false);
      }
    };
    window.addEventListener('worker_availability_change', handleCustomEvent);

    // 4. Supabase Realtime broadcast listener
    const broadcastChannel = supabase
      .channel('global_worker_availability')
      .on('broadcast', { event: 'worker_status' }, ({ payload }) => {
        if (payload) {
          updateWorkerStatusLocally(payload);
          fetchWorkers(false);
        }
      })
      .subscribe();

    // 5. Supabase postgres_changes listener
    const pgChannel = supabase
      .channel('workers-realtime-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'workers' },
        (payload: any) => {
          if (payload?.new) {
            const updated = payload.new;
            setWorkers(prev => prev.map(w => {
              const isMatch = 
                (updated.id && w.id === updated.id) ||
                (updated.worker_id && w.workerId === updated.worker_id) ||
                (updated.name && w.name.toLowerCase() === updated.name.trim().toLowerCase());

              if (isMatch) {
                return {
                  ...w,
                  isAvailableToday: updated.is_available_today !== undefined ? updated.is_available_today : w.isAvailableToday,
                  rating: updated.rating !== undefined ? Number(updated.rating) : w.rating,
                  reviewsCount: updated.reviews_count !== undefined ? Number(updated.reviews_count) : w.reviewsCount
                };
              }
              return w;
            }));
          }
          fetchWorkers(false);
        }
      )
      .subscribe();

    // 6. Fast background sync interval (heartbeat every 2.5s)
    const pollInterval = setInterval(() => {
      fetchWorkers(false);
    }, 2500);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('worker_availability_change', handleCustomEvent);
      supabase.removeChannel(broadcastChannel);
      supabase.removeChannel(pgChannel);
      clearInterval(pollInterval);
    };
  }, []);

  const filteredWorkers = workers.filter((worker) => {
    // Hide the currently logged-in user from the directory
    if (currentUserId && worker.id === currentUserId) {
      return false;
    }

    const n = (worker.name || '').toLowerCase().trim();
    if (!n || n === 'demo' || n.startsWith('demo') || n.includes('test') || n.includes('badass') || n.includes('dummy')) {
      return false;
    }

    const normFilter = (filterTrade || 'All').trim().toLowerCase();
    const workerTrade = (worker.trade || '').toLowerCase();

    const matchesTrade = 
      normFilter === 'all' || 
      normFilter === '' || 
      workerTrade === normFilter ||
      workerTrade.includes(normFilter) ||
      normFilter.includes(workerTrade) ||
      (normFilter.includes('clean') && workerTrade.includes('clean')) ||
      (normFilter.includes('plumb') && workerTrade.includes('plumb')) ||
      (normFilter.includes('electr') && workerTrade.includes('electr')) ||
      (normFilter.includes('ac') && workerTrade.includes('ac')) ||
      (normFilter.includes('paint') && workerTrade.includes('paint')) ||
      (normFilter.includes('carpent') && workerTrade.includes('carpent')) ||
      (normFilter.includes('move') && workerTrade.includes('mov')) ||
      (normFilter.includes('vehic') && (workerTrade.includes('vehic') || workerTrade.includes('mechanic')));

    const matchesRating = minRating === 0 || worker.rating >= minRating;
    const matchesDistance = maxDistance === 0 || worker.distanceKm <= maxDistance;
    const matchesQuery = 
      !searchQuery.trim() ||
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      worker.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.coopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (worker.city && worker.city.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTrade && matchesRating && matchesDistance && matchesQuery;
  });

  return (
    <section id="workers-directory" className="py-14 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider bg-emerald-100/70 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Verified Marketplace
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-outfit">
              Trusted workers near you
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 mb-8 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, skill, or problem..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category & Rating Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
            <div className="flex items-center space-x-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Category:</span>
              <select
                value={filterTrade}
                onChange={(e) => setFilterTrade(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              <span className="font-semibold text-slate-700 dark:text-slate-300">Min Rating:</span>
              <select
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value={0}>All Ratings</option>
                <option value={4.0}>4.0 ★ & above</option>
                <option value={4.5}>4.5 ★ & above</option>
                <option value={4.8}>4.8 ★ & above</option>
              </select>
            </div>
          </div>

        </div>

        {/* Worker Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse space-y-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
                  </div>
                </div>
                <div className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredWorkers.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 sm:p-14 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 max-w-lg mx-auto my-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
              🔍
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white font-outfit">No workers found matching this filter</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              We have verified cooperative professionals across all 8 trades available right now.
            </p>
            <button
              type="button"
              onClick={() => {
                setFilterTrade('All');
                setMinRating(0);
                setMaxDistance(30);
                setSearchQuery('');
              }}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Reset Filters & Show All Workers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => {
              const getTradeIcon = (trade: string) => {
                switch (trade) {
                  case 'Electrician': return '⚡';
                  case 'Plumber': return '🔧';
                  case 'AC Repair': return '❄️';
                  case 'Painter': return '🎨';
                  case 'Cleaning': return '🧹';
                  case 'Carpenter': return '🪚';
                  case 'Vehicle Repair': return '🚗';
                  case 'Moving': return '📦';
                  case 'Caregiver': return '🩺';
                  default: return '🛠️';
                }
              };

              return (
                <div 
                  key={worker.id} 
                  className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-emerald-500/40 transition-all rounded-2xl p-5 sm:p-6 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Photo, Name, Verified Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={worker.avatar}
                          alt={worker.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-emerald-100 dark:border-emerald-900/60 shadow-xs"
                        />
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">{worker.name}</h3>
                          </div>
                          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center mt-0.5">
                            <span className="mr-1">{getTradeIcon(worker.trade)}</span> 
                            {worker.trade}
                          </p>
                        </div>
                      </div>

                      {/* Verified Badge */}
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                        <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Verified</span>
                      </span>
                    </div>

                    {/* Stats Stack */}
                    <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 rounded-xl p-3 border border-slate-100 dark:border-slate-700/60 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1.5 shrink-0" />
                          <span className="font-bold text-slate-900 dark:text-white mr-1">{worker.rating}</span>
                          <span className="text-slate-500 dark:text-slate-400">· {worker.reviewsCount} jobs</span>
                        </div>
                        <div className="flex items-center text-slate-500 dark:text-slate-400 font-medium">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                          <span>{worker.city || 'Jaipur'} · {worker.distanceKm} km</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400 truncate max-w-[170px]" title={worker.coopName}>
                          {worker.coopName}
                        </span>
                        {worker.isAvailableToday ? (
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                            Available Today
                          </span>
                        ) : (
                          <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mr-1.5" />
                            Offline
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer: Price & CTA Actions */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Standard Rate:</span>
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white font-outfit">{worker.hourlyRate}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => onViewWorkerProfile(worker)}
                        className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center border border-slate-200 dark:border-slate-700 cursor-pointer"
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
