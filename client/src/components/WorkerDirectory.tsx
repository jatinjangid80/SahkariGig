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
}

export const WorkerDirectory: React.FC<WorkerDirectoryProps> = ({
  selectedCategory = 'All',
  onSelectWorkerForBooking,
  onViewWorkerProfile,
  onVerifyQrCode
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
      try {
        const apiRes = await fetch('http://localhost:5001/api/workers').catch(() => null);
        if (apiRes && apiRes.ok) {
          const json = await apiRes.json();
          if (json.success && Array.isArray(json.data?.workers)) {
            setWorkers(json.data.workers);
            setIsLoading(false);
            return;
          }
        }

        const { data, error } = await supabase.from('workers').select('*');
        if (error) throw error;
        
        if (data) {
          const formattedWorkers = data.map(w => ({
            id: w.id,
            name: w.name,
            avatar: w.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
            trade: w.trade,
            rating: w.rating || 4.5,
            reviewsCount: w.reviews_count || 10,
            coopName: w.coop_name,
            hourlyRate: w.hourly_rate,
            distanceKm: w.distance_km || 2.0,
            isAvailableToday: w.is_available_today,
            isTopRated: w.is_top_rated,
            workerId: w.worker_id
          }));
          setWorkers(formattedWorkers);
        }
      } catch (err) {
        console.error("Using fallback worker list:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const filteredWorkers = workers.filter((worker) => {
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
