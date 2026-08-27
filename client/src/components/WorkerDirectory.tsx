import React, { useState } from 'react';
import { Star, ShieldCheck, MapPin, Search, Filter, QrCode, CheckCircle, Zap, UserCheck } from 'lucide-react';

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

  // Sample production-grade verified worker list
  const mockWorkers: Worker[] = [
    {
      id: 'w-101',
      name: 'Rajesh Kumar',
      avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
      trade: 'Electrician',
      rating: 4.9,
      reviewsCount: 128,
      coopName: 'Delhi Labour Cooperative Federation',
      hourlyRate: '₹400–₹700 / visit',
      distanceKm: 1.8,
      isAvailableToday: true,
      isTopRated: true,
      workerId: 'WORKER-DEL-8901'
    },
    {
      id: 'w-102',
      name: 'Suresh Sharma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      trade: 'Plumber',
      rating: 4.8,
      reviewsCount: 94,
      coopName: 'JanSeva Plumbing Society',
      hourlyRate: '₹350–₹650 / visit',
      distanceKm: 2.4,
      isAvailableToday: true,
      isTopRated: true,
      workerId: 'WORKER-DEL-7652'
    },
    {
      id: 'w-103',
      name: 'Vikram Singh',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      trade: 'Carpenter',
      rating: 4.7,
      reviewsCount: 82,
      coopName: 'Northern Crafts Cooperative Federation',
      hourlyRate: '₹500–₹900 / visit',
      distanceKm: 3.5,
      isAvailableToday: false,
      isTopRated: false,
      workerId: 'WORKER-DEL-4390'
    },
    {
      id: 'w-104',
      name: 'Anita Verma',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      trade: 'Painter',
      rating: 4.9,
      reviewsCount: 156,
      coopName: 'National Cooperative Union of India',
      hourlyRate: '₹600–₹1200 / day',
      distanceKm: 2.1,
      isAvailableToday: true,
      isTopRated: true,
      workerId: 'WORKER-DEL-1249'
    },
    {
      id: 'w-105',
      name: 'Sunil Paswan',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      trade: 'Domestic Help',
      rating: 4.6,
      reviewsCount: 65,
      coopName: 'JanSeva Labour Cooperative',
      hourlyRate: '₹300–₹500 / visit',
      distanceKm: 4.2,
      isAvailableToday: true,
      isTopRated: false,
      workerId: 'WORKER-DEL-6582'
    },
    {
      id: 'w-106',
      name: 'Priya Devi',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      trade: 'Caregiver',
      rating: 5.0,
      reviewsCount: 42,
      coopName: 'Mahila Sahkari Healthcare Union',
      hourlyRate: '₹600–₹1000 / shift',
      distanceKm: 1.5,
      isAvailableToday: true,
      isTopRated: true,
      workerId: 'WORKER-DEL-9810'
    }
  ];

  const filteredWorkers = mockWorkers.filter((worker) => {
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
          {filteredWorkers.map((worker) => (
            <div key={worker.id} className="light-card p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              
              <div>
                {/* Worker Header Card Info */}
                <div className="flex items-start space-x-4">
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900 truncate font-outfit">
                        {worker.name}
                      </h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Star className="w-3 h-3 mr-1 fill-amber-400 text-amber-400" />
                        {worker.rating} ({worker.reviewsCount})
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-emerald-700 mt-0.5">{worker.trade}</p>
                    
                    <p className="text-[11px] text-slate-500 truncate mt-1 flex items-center">
                      <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600 shrink-0" />
                      {worker.coopName}
                    </p>
                  </div>
                </div>

                {/* Badges */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" />
                    Verified Member
                  </span>
                  {worker.isAvailableToday && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                      Available Today
                    </span>
                  )}
                  {worker.isTopRated && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
                      Top Rated
                    </span>
                  )}
                </div>

                {/* Rates & Distance */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-medium">Estimated Rate</span>
                    <p className="font-bold text-slate-900 text-xs">{worker.hourlyRate}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-medium">Proximity</span>
                    <p className="font-semibold text-slate-700 text-xs flex items-center">
                      <MapPin className="w-3 h-3 mr-0.5 text-slate-400" />
                      {worker.distanceKm} km away
                    </p>
                  </div>
                </div>
              </div>

              {/* Card CTAs */}
              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onViewWorkerProfile(worker)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>View Profile</span>
                </button>

                <button
                  onClick={() => onSelectWorkerForBooking(worker)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center space-x-1"
                >
                  <span>Book Now</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
