import React, { useState } from 'react';
import { Star, ShieldCheck, MapPin, Award, Clock, ArrowRight, Zap, Filter, QrCode } from 'lucide-react';

export default function WorkerDirectory({ workers, selectedCategory, onSelectWorker, onOpenVerifyModal, onAutoMatch }) {
  const [minRatingFilter, setMinRatingFilter] = useState(0);
  const [maxDistanceFilter, setMaxDistanceFilter] = useState(10);
  const [autoMatchResult, setAutoMatchResult] = useState(null);

  const filteredWorkers = workers.filter(w => {
    if (w.status !== 'active') return false;
    if (selectedCategory && !w.skills.includes(selectedCategory)) return false;
    if (w.rating < minRatingFilter) return false;
    if (w.location?.distanceKm > maxDistanceFilter) return false;
    return true;
  });

  const handleAutoAssignClick = async () => {
    const category = selectedCategory || 'Electrician';
    const result = await onAutoMatch(category);
    if (result && result.recommendedWorker) {
      setAutoMatchResult(result);
    }
  };

  return (
    <div className="py-8">
      {/* Directory Header & Smart Matching Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {selectedCategory ? `${selectedCategory} Professionals` : 'Verified Cooperative Workers'}
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
              {filteredWorkers.length} Active Workers
            </span>
          </div>
          <p className="text-sm text-slate-400">Backing by Ministry registered Labour Cooperative Federations</p>
        </div>

        {/* Auto-Assign Matching Engine Button */}
        <button
          onClick={handleAutoAssignClick}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 border border-emerald-400/30"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>Auto-Assign Best Match (Skill + Proximity)</span>
        </button>
      </div>

      {/* Auto-Match Highlight Banner if Triggered */}
      {autoMatchResult && autoMatchResult.recommendedWorker && (
        <div className="mb-6 p-4 rounded-2xl glass-panel border border-amber-500/40 bg-slate-900/90 shadow-xl animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400 border border-amber-500/30">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-extrabold uppercase text-amber-400 tracking-wider">Algorithmic Best Match Found:</span>
                  <span className="px-2 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-300 rounded-md">
                    Score: {autoMatchResult.recommendedWorker.matchScore}%
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white mt-0.5">{autoMatchResult.recommendedWorker.name}</h4>
                <p className="text-xs text-slate-300">
                  {autoMatchResult.recommendedWorker.cooperativeSociety} • {autoMatchResult.recommendedWorker.location.distanceKm} km away • Rating {autoMatchResult.recommendedWorker.rating}★
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectWorker(autoMatchResult.recommendedWorker)}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shrink-0"
            >
              Book Recommended Worker
            </button>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-3 rounded-xl glass-card border border-slate-800">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
          <Filter className="w-4 h-4 text-emerald-400" />
          <span>Filters:</span>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <span>Min Rating:</span>
          <select
            value={minRatingFilter}
            onChange={(e) => setMinRatingFilter(parseFloat(e.target.value))}
            className="bg-slate-900 text-white text-xs px-2.5 py-1 rounded-lg border border-slate-700 focus:outline-none"
          >
            <option value={0}>All Ratings</option>
            <option value={4.5}>4.5★ & above</option>
            <option value={4.8}>4.8★ & above</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <span>Max Distance:</span>
          <select
            value={maxDistanceFilter}
            onChange={(e) => setMaxDistanceFilter(parseFloat(e.target.value))}
            className="bg-slate-900 text-white text-xs px-2.5 py-1 rounded-lg border border-slate-700 focus:outline-none"
          >
            <option value={10}>Within 10 km</option>
            <option value={3}>Within 3 km</option>
            <option value={5}>Within 5 km</option>
          </select>
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkers.map((worker) => (
          <div key={worker.id} className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
            
            {/* Header: Photo + Name + Verified Badge */}
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={worker.photoUrl}
                    alt={worker.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/30 group-hover:border-emerald-500 transition-colors shadow-md"
                  />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="font-bold text-white text-lg tracking-tight group-hover:text-emerald-400 transition-colors">
                        {worker.name}
                      </h3>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" title="Cooperative Verified" />
                    </div>
                    <p className="text-xs text-slate-400">{worker.cooperativeSociety}</p>
                    <p className="text-[11px] font-mono text-emerald-400 mt-0.5">ID: {worker.workerId}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 bg-amber-500/10 text-amber-300 text-xs font-semibold px-2 py-1 rounded-lg border border-amber-500/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{worker.rating}</span>
                  <span className="text-[10px] text-slate-400">({worker.ratingCount})</span>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {worker.skills.map((skill) => (
                  <span key={skill} className="px-2.5 py-0.5 text-xs font-medium bg-slate-800 text-emerald-300 rounded-md border border-slate-700">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Experience & Location Details */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center space-x-1.5">
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  <span>{worker.experienceYears} Years Exp</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{worker.location.distanceKm} km away</span>
                </div>
              </div>
            </div>

            {/* Footer: Price + Actions */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Rate / hr</span>
                <p className="text-lg font-bold text-white">₹{worker.hourlyRate}<span className="text-xs font-normal text-slate-400">/hr</span></p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenVerifyModal(worker)}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700"
                  title="View Digital QR ID Card"
                >
                  <QrCode className="w-4 h-4 text-emerald-400" />
                </button>

                <button
                  onClick={() => onSelectWorker(worker)}
                  className="px-4 py-2.5 gradient-bg hover:opacity-95 text-white font-semibold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center space-x-1"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
