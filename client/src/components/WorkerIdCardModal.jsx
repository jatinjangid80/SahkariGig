import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, ShieldCheck, Download, Star, CheckCircle2, Building2 } from 'lucide-react';

export default function WorkerIdCardModal({ worker, onClose, onNavigateToVerify }) {
  if (!worker) return null;

  const verifyUrl = `${window.location.origin}/verify/${worker.workerId || 'COOP-2026-00101'}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md glass-panel rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Cooperative Worker Digital ID Card</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Physical Digital ID Card Layout */}
        <div className="p-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-emerald-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            
            {/* Background Watermark Pattern */}
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="font-extrabold text-white text-sm tracking-wide font-outfit uppercase">MINISTRY OF COOPERATION</span>
                </div>
                <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Labour Cooperative Federation Identity</p>
              </div>

              <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-md">
                VERIFIED ACTIVE
              </span>
            </div>

            {/* Card Main Profile Section */}
            <div className="mt-4 flex items-center space-x-4">
              <img
                src={worker.photoUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80'}
                alt={worker.name}
                className="w-20 h-20 rounded-xl object-cover border-2 border-emerald-500 shadow-md shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-white text-lg truncate leading-tight">{worker.name}</h4>
                <p className="text-xs text-slate-300 font-medium truncate">{worker.skills?.join(', ') || 'Skilled Technician'}</p>
                <div className="mt-1 flex items-center space-x-1 text-xs text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold">{worker.rating || 4.9}</span>
                  <span className="text-[10px] text-slate-400">({worker.ratingCount || 48} reviews)</span>
                </div>
                <p className="text-[11px] font-mono font-bold text-emerald-400 mt-1">ID: {worker.workerId || 'COOP-2026-00101'}</p>
              </div>
            </div>

            {/* Society & Details */}
            <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{worker.cooperativeSociety || 'Jan Seva Labour Cooperative Federation'}</span>
              </div>
              <p className="text-[10px] text-slate-400">Affiliation Status: Registered & Background Verified</p>
            </div>

            {/* QR Code Verification Section */}
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="pr-2">
                <p className="text-xs font-bold text-white">Scan for Live Verification</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Scans pull real-time status from Ministry database.</p>
                <button
                  onClick={() => onNavigateToVerify(worker.workerId || 'COOP-2026-00101')}
                  className="mt-2 text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 underline"
                >
                  Test Scan Endpoint (/verify/{worker.workerId || 'COOP-2026-00101'})
                </button>
              </div>

              <div className="p-2 bg-white rounded-xl shadow-md shrink-0">
                <QRCodeSVG value={verifyUrl} size={72} level="H" />
              </div>
            </div>

          </div>

          <div className="mt-4 flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors border border-slate-700 flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Print / Download Identity Badge</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
