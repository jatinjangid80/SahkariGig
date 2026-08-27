import React, { useState } from 'react';
import { X, ShieldCheck, QrCode, Building, Award, Star, Clock, MapPin, IndianRupee } from 'lucide-react';

interface WorkerIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker?: any;
}

export const WorkerIdCardModal: React.FC<WorkerIdCardModalProps> = ({
  isOpen,
  onClose,
  worker
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'idcard'>('overview');

  if (!isOpen) return null;

  const w = worker || {
    name: 'Rajesh Kumar',
    trade: 'Licensed Electrician',
    coopName: 'Delhi Labour Cooperative Federation',
    workerId: 'WORKER-DEL-8901',
    rating: 4.9,
    reviewsCount: 128,
    hourlyRate: '₹400–₹700 / visit',
    distanceKm: 1.8,
    isAvailableToday: true,
    validUntil: '31-DEC-2027',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-xs uppercase tracking-wider">Worker Profile</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Info Header */}
        <div className="bg-slate-50 border-b border-slate-200 p-6 flex items-center space-x-4">
          <img
            src={w.avatar}
            alt={w.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
          />
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 font-outfit">{w.name}</h3>
            <p className="text-xs font-semibold text-emerald-700">{w.trade}</p>
            <div className="flex items-center mt-1 space-x-1 text-[11px] text-slate-500 font-medium">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-slate-700 font-bold">{w.rating}</span>
              <span>({w.reviewsCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('idcard')}
            className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 ${
              activeTab === 'idcard'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            ID Card
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center space-x-2 text-slate-500 mb-1">
                    <IndianRupee className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Base Rate</span>
                  </div>
                  <p className="font-semibold text-sm text-slate-900">{w.hourlyRate || w.hourly_rate || '₹400 / hr'}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center space-x-2 text-slate-500 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Distance</span>
                  </div>
                  <p className="font-semibold text-sm text-slate-900">{w.distanceKm || w.distance_km || '2.0'} km away</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">About & Status</h4>
                <div className="flex items-start space-x-3 text-sm">
                  <Building className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <span className="text-slate-700">Member of <strong className="text-slate-900">{w.coopName || w.coop_name || 'Cooperative Federation'}</strong></span>
                </div>
                <div className="flex items-start space-x-3 text-sm">
                  <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <span className="text-slate-700">
                    Status: {w.isAvailableToday || w.is_available_today ? (
                      <span className="text-emerald-600 font-bold">Available Today</span>
                    ) : (
                      <span className="text-amber-600 font-bold">Available Tomorrow</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-5">
              <div className="inline-block bg-emerald-50 text-emerald-800 text-xs font-extrabold px-3 py-1.5 rounded-full border border-emerald-200">
                Gov. ID: {w.workerId || w.worker_id}
              </div>

              {/* Simulated QR Code */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm max-w-[180px] mx-auto space-y-2">
                <div className="w-32 h-32 bg-slate-900 mx-auto rounded-lg p-2 flex items-center justify-center">
                  <QrCode className="w-28 h-28 text-white" />
                </div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase">Scan to Verify Live Status</p>
              </div>

              <p className="text-[10px] text-slate-400 border-t border-slate-100 pt-4">
                Issued under Ministry of Cooperation Labour Cooperative Framework • Valid until {w.validUntil || '31-DEC-2027'}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
