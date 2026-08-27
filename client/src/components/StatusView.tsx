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
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-outfit">System Health & Status</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">Real-time status report of foundation services & environment configuration</p>
          </div>

          <button
            onClick={fetchStatus}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-xl transition-colors flex items-center space-x-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-sm font-medium flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span>Querying System Health API...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-start space-x-3 shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-bold text-rose-900">Status API Error</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        ) : statusData ? (
          <div className="space-y-6 animate-fade-in">
            
            {/* System Status Banner */}
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">{statusData.application}</span>
                  <p className="text-sm text-emerald-700 font-semibold">{statusData.phase} — Operational</p>
                </div>
              </div>
              <span className="self-start sm:self-auto px-4 py-1.5 text-xs font-extrabold bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-300">
                {statusData.systemStatus}
              </span>
            </div>

            {/* Individual Services Health */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start space-x-3 hover:shadow-md transition-shadow">
                <Server className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Backend Express API</h4>
                  <p className="text-xs text-indigo-700 font-semibold mt-1">{statusData.services.backendServer.details}</p>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start space-x-3 hover:shadow-md transition-shadow">
                <Database className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Supabase PostgreSQL</h4>
                  <p className="text-xs text-emerald-700 font-semibold mt-1">{statusData.services.supabasePostgres?.details || 'N/A'}</p>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start space-x-3 hover:shadow-md transition-shadow">
                <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Supabase Auth Foundation</h4>
                  <p className="text-xs text-sky-700 font-semibold mt-1">{statusData.services.supabaseAuth?.details || 'N/A'}</p>
                </div>
              </div>

            </div>

            {/* Supported Roles */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Defined System Roles:</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {statusData.supportedRoles.map((r) => (
                  <span key={r} className="px-3 py-1.5 bg-white text-slate-800 rounded-xl border border-slate-200 font-semibold text-xs shadow-sm">
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
