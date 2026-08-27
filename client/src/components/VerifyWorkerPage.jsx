import React, { useState, useEffect } from 'react';
import { ShieldCheck, Star, MapPin, Building2, CheckCircle2, AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function VerifyWorkerPage({ workerIdParam, onBackToMarketplace }) {
  const [workerId, setWorkerId] = useState(workerIdParam || 'COOP-2026-00101');
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchVerification = async (idToVerify) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/workers/verify/${idToVerify}`);
      const data = await res.json();
      if (data.success) {
        setVerificationData(data);
      } else {
        setError(data.message || 'Worker ID not found.');
      }
    } catch (err) {
      setError('Failed to reach verification database server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerification(workerId);
  }, [workerId]);

  return (
    <div className="py-10 max-w-2xl mx-auto px-4">
      
      {/* Top Header */}
      <button
        onClick={onBackToMarketplace}
        className="mb-6 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition-colors flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Marketplace</span>
      </button>

      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
        
        {/* Ministry Title */}
        <div className="text-center pb-6 border-b border-slate-800">
          <div className="inline-flex p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-emerald-400 mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Public Worker Identity Verification</h2>
          <p className="text-xs text-slate-400 mt-1">Ministry of Cooperation • Labour Cooperative Federation Database</p>
        </div>

        {/* Worker ID Search Input */}
        <div className="py-6 border-b border-slate-800">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Verify Worker ID Number</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              placeholder="e.g. COOP-2026-00101"
              className="flex-1 px-4 py-2.5 bg-slate-950/80 text-white font-mono text-sm rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={() => fetchVerification(workerId)}
              className="px-4 py-2.5 gradient-bg hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Verify Now</span>
            </button>
          </div>
        </div>

        {/* Verification Status Card Result */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <span>Querying Ministry Worker Registry...</span>
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
            <h4 className="text-base font-bold text-white">Verification Failed</h4>
            <p className="text-xs text-rose-400 mt-1">{error}</p>
          </div>
        ) : verificationData && verificationData.worker ? (
          <div className="pt-6 animate-fade-in space-y-6">
            
            {/* Live Verification Badge Banner */}
            <div className="p-4 bg-emerald-500/15 border-2 border-emerald-500/40 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Live Status: VERIFIED & ACTIVE</span>
                  <p className="text-[11px] text-slate-300">Official Labour Cooperative Member in Good Standing</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Checked: {new Date(verificationData.worker.verifiedAt).toLocaleTimeString()}</span>
            </div>

            {/* Worker Details Grid */}
            <div className="flex items-center space-x-4">
              <img
                src={verificationData.worker.photoUrl}
                alt={verificationData.worker.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
              />
              <div>
                <h3 className="text-xl font-bold text-white">{verificationData.worker.name}</h3>
                <p className="text-xs text-emerald-300 font-medium">{verificationData.worker.skills.join(', ')}</p>
                <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{verificationData.worker.cooperativeSociety}</span>
                </p>
                <div className="mt-1 flex items-center space-x-1 text-xs text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold">{verificationData.worker.rating}</span>
                  <span className="text-[10px] text-slate-400">({verificationData.worker.ratingCount} ratings)</span>
                </div>
              </div>
            </div>

            {/* Key Governance Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Worker Registry ID</span>
                <p className="font-mono font-bold text-white mt-0.5">{verificationData.worker.workerId}</p>
              </div>
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Trade Experience</span>
                <p className="font-bold text-white mt-0.5">{verificationData.worker.experienceYears} Years Verified</p>
              </div>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
}
