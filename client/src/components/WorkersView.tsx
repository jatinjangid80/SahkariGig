import React, { useState } from 'react';
import { WorkerDirectory } from './WorkerDirectory';
import { ShieldCheck, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

interface WorkersViewProps {
  selectedCategory?: string;
  selectedCity?: string;
  currentUserId?: string;
  onSelectWorkerForBooking: (worker: any) => void;
  onViewWorkerProfile: (worker: any) => void;
  onVerifyQrCode: (workerId: string) => void;
  onNavigate: (path: string) => void;
}

const TRADE_TABS = [
  { label: 'All Services', value: 'All', emoji: '🛠️' },
  { label: 'Electrician', value: 'Electrician', emoji: '⚡' },
  { label: 'Plumber', value: 'Plumber', emoji: '🔧' },
  { label: 'AC Repair', value: 'AC Repair', emoji: '❄️' },
  { label: 'Painter', value: 'Painter', emoji: '🎨' },
  { label: 'Cleaning', value: 'Cleaning', emoji: '🧹' },
  { label: 'Carpenter', value: 'Carpenter', emoji: '🪚' },
  { label: 'Vehicle Repair', value: 'Vehicle Repair', emoji: '🚗' },
  { label: 'Moving', value: 'Moving', emoji: '📦' }
];

export const WorkersView: React.FC<WorkersViewProps> = ({
  selectedCategory = 'All',
  selectedCity = 'Jaipur',
  currentUserId,
  onSelectWorkerForBooking,
  onViewWorkerProfile,
  onVerifyQrCode,
  onNavigate
}) => {
  const [activeCategory, setActiveCategory] = useState(selectedCategory);

  return (
    <div className="py-8 sm:py-12 bg-slate-50 dark:bg-[#0b0f19] min-h-[calc(100vh-4rem)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Hero Banner */}
        <div className="bg-gradient-to-br from-emerald-900/90 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-800/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ministry-Registered Cooperative Federations</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-outfit">
              Hire Verified Cooperative Pros
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-medium">
              Browse background-checked electricians, plumbers, carpenters, and technicians. Standard fair-rate pricing, 100% direct worker pay, and live QR credential verification at your door.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              {TRADE_TABS.map((tab) => {
                const isSelected = activeCategory.toLowerCase() === tab.value.toLowerCase();
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setActiveCategory(tab.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 ring-1 ring-white/30'
                        : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                    }`}
                  >
                    <span>{tab.emoji}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Marketplace Directory */}
        <WorkerDirectory
          selectedCategory={activeCategory}
          selectedCity={selectedCity}
          currentUserId={currentUserId}
          onSelectWorkerForBooking={onSelectWorkerForBooking}
          onViewWorkerProfile={onViewWorkerProfile}
          onVerifyQrCode={onVerifyQrCode}
        />

      </div>
    </div>
  );
};
