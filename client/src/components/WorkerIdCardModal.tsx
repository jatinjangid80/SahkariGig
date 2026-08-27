import React from 'react';
import { X, ShieldCheck, QrCode, Building, Award } from 'lucide-react';

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
  if (!isOpen) return null;

  const w = worker || {
    name: 'Rajesh Kumar',
    trade: 'Licensed Electrician',
    coopName: 'Delhi Labour Cooperative Federation',
    workerId: 'WORKER-DEL-8901',
    rating: 4.9,
    validUntil: '31-DEC-2027',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-xs uppercase tracking-wider">Digital Worker ID</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Digital ID Card Body */}
        <div className="p-6 text-center space-y-4 bg-gradient-to-b from-slate-50 to-white">
          
          <img
            src={w.avatar}
            alt={w.name}
            className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md mx-auto"
          />

          <div>
            <h3 className="text-xl font-extrabold text-slate-900 font-outfit">{w.name}</h3>
            <p className="text-xs font-semibold text-emerald-700">{w.trade}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{w.coopName}</p>
          </div>

          <div className="inline-block bg-emerald-50 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200">
            ID: {w.workerId}
          </div>

          {/* Simulated QR Code */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs max-w-[180px] mx-auto space-y-2">
            <div className="w-32 h-32 bg-slate-900 mx-auto rounded-lg p-2 flex items-center justify-center">
              <QrCode className="w-28 h-28 text-white" />
            </div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase">Scan to Verify Live Status</p>
          </div>

          <p className="text-[10px] text-slate-400 border-t border-slate-100 pt-3">
            Issued under Ministry of Cooperation Labour Cooperative Framework • Valid until {w.validUntil}
          </p>

        </div>

      </div>
    </div>
  );
};
