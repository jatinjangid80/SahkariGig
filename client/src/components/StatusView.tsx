import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Server, Database, Key } from 'lucide-react';
import { CONFIG } from '../config';
import { SystemStatusData } from '../types/api';

export const StatusView: React.FC = () => {
  const [statusData, setStatusData] = useState<SystemStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${CONFIG.apiUrl}/api/status`);
      const data = await res.json();
      if (data.success) {
        setStatusData(data.data);
      } else {
        setError(data.message || 'Failed to fetch status.');
      }
    } catch (err) {
      setError('Could not connect to backend status API endpoint.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="py-12 max-w-3xl mx-auto px-4">
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h1 className="text-2xl font-bold text-white tracking-tight font-outfit">System Health & Status</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">Real-time status report of foundation services & environment configuration</p>
          </div>

          <button
            onClick={fetchStatus}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 rounded-xl border border-slate-800 flex items-center space-x-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span>Querying System Health API...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold">Status API Error</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        ) : statusData ? (
          <div className="space-y-6 animate-fade-in">
            
            {/* System Status Banner */}
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{statusData.application}</span>
                  <p className="text-[11px] text-cyan-300 font-semibold">{statusData.phase} — Operational</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-extrabold bg-cyan-500/20 text-cyan-300 rounded-lg border border-cyan-500/40">
                {statusData.systemStatus}
              </span>
            </div>

            {/* Individual Services Health */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-start space-x-3">
                <Server className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Backend Express API</h4>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">{statusData.services.backendServer.details}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-start space-x-3">
                <Database className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">MongoDB Atlas Connection</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">{statusData.services.mongoDbAtlas.details}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Firebase Auth Foundation</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">{statusData.services.firebaseAuth.details}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-start space-x-3">
                <Key className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">JWT / Server Secrets</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">{statusData.services.jwtSecrets.details}</p>
                </div>
              </div>

            </div>

            {/* Supported Roles */}
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Defined System Roles:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {statusData.supportedRoles.map((r) => (
                  <span key={r} className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg border border-slate-700 font-semibold">
                    {r}
                  </span>
                ))}
              </div>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
};
