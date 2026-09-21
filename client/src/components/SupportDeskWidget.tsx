import React, { useState } from 'react';
import { HelpCircle, X, MessageSquare, PhoneCall, ShieldCheck, MapPin, CheckCircle2, ArrowRight, Briefcase } from 'lucide-react';

interface SupportDeskWidgetProps {
  onNavigate: (path: string) => void;
  onOpenBooking: (tradeOrWorker?: any) => void;
  onVerifyWorker: (workerId?: string) => void;
  currentUser?: any;
}

export const SupportDeskWidget: React.FC<SupportDeskWidgetProps> = ({
  onNavigate,
  onOpenBooking,
  onVerifyWorker,
  currentUser
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [workerSearchId, setWorkerSearchId] = useState('');

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 px-4 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 cursor-pointer font-bold text-xs"
        >
          <HelpCircle className="w-5 h-5 text-emerald-300" />
          <span>Sahkari Sahayak (Helpdesk)</span>
        </button>
      )}

      {/* Helpdesk Popup Card */}
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-[340px] shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-extrabold text-sm font-outfit">
                Sg
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm font-outfit">Sahkari Sahayak</h3>
                <p className="text-[10px] text-slate-400">Cooperative Services Helpdesk</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quick Services</span>
            
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Electrician', icon: '🔧' },
                { name: 'Plumber', icon: '🚰' },
                { name: 'Carpenter', icon: '🪚' },
                { name: 'Cleaning', icon: '🧹' }
              ].map(s => (
                <button
                  key={s.name}
                  onClick={() => {
                    setIsOpen(false);
                    onOpenBooking({ trade: s.name });
                  }}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left font-bold flex items-center space-x-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <span>{s.icon}</span>
                  <span className="truncate">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Instant QR & ID Verification Lookup */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verify Worker ID</span>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={workerSearchId}
                onChange={e => setWorkerSearchId(e.target.value)}
                placeholder="E.g. WORKER-JAI-1048"
                className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
              <button
                onClick={() => {
                  if (workerSearchId.trim()) {
                    setIsOpen(false);
                    onVerifyWorker(workerSearchId.trim());
                  }
                }}
                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl cursor-pointer"
              >
                Verify
              </button>
            </div>
          </div>

          {/* Cooperative Emergency Helpline */}
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-amber-900 dark:text-amber-300">Emergency Dispatch Helpline</p>
              <p className="text-[10px] text-amber-700 dark:text-amber-400">1800-SAHKARI (Toll Free)</p>
            </div>
            <a
              href="tel:18007245274"
              className="p-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
