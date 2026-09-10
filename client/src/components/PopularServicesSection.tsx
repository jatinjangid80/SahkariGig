import React from 'react';
import { 
  Wrench, 
  Zap, 
  Snowflake, 
  Paintbrush, 
  Sparkles, 
  Hammer, 
  Car, 
  Package, 
  ArrowRight 
} from 'lucide-react';

interface PopularServicesSectionProps {
  onSelectCategory: (category: string) => void;
}

export const POPULAR_SERVICES = [
  {
    id: 'plumbing',
    name: 'Plumbing',
    searchKey: 'Plumber',
    icon: Wrench,
    emoji: '🔧',
    description: 'Pipe leaks, taps, bathroom fittings, water tank & motor fixes',
    badge: '14+ Pros'
  },
  {
    id: 'electrical',
    name: 'Electrical',
    searchKey: 'Electrician',
    icon: Zap,
    emoji: '⚡',
    description: 'Wiring, MCB switches, fan installation, short circuit & lights',
    badge: '18+ Pros'
  },
  {
    id: 'ac-repair',
    name: 'AC Repair',
    searchKey: 'AC Repair',
    icon: Snowflake,
    emoji: '❄️',
    description: 'AC deep cleaning, gas refill, compressor & cooling repair',
    badge: '12+ Pros'
  },
  {
    id: 'painting',
    name: 'Painting',
    searchKey: 'Painter',
    icon: Paintbrush,
    emoji: '🎨',
    description: 'Full home painting, waterproof coating, touch-ups & texture',
    badge: '15+ Pros'
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    searchKey: 'Cleaning',
    icon: Sparkles,
    emoji: '🧹',
    description: 'Deep house cleaning, sofa & kitchen shampooing, sanitization',
    badge: '22+ Pros'
  },
  {
    id: 'carpentry',
    name: 'Carpentry',
    searchKey: 'Carpenter',
    icon: Hammer,
    emoji: '🔨',
    description: 'Furniture repair, door locks, cabinets, hinges & woodwork',
    badge: '11+ Pros'
  },
  {
    id: 'vehicle-repair',
    name: 'Vehicle Repair',
    searchKey: 'Vehicle Repair',
    icon: Car,
    emoji: '🚗',
    description: 'Car & bike doorstep mechanic, puncture, battery & tune-up',
    badge: '9+ Pros'
  },
  {
    id: 'moving',
    name: 'Moving',
    searchKey: 'Moving',
    icon: Package,
    emoji: '📦',
    description: 'Safe home shifting, packing, loading & heavy item transport',
    badge: '8+ Pros'
  }
];

export const PopularServicesSection: React.FC<PopularServicesSectionProps> = ({ onSelectCategory }) => {
  return (
    <section id="popular-services" className="py-14 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-3.5 py-1.5 rounded-full shadow-2xs">
            Everyday Essentials
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-outfit">
            Popular Services
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
            Click any service to instantly connect with vetted local cooperative professionals.
          </p>
        </div>

        {/* 8-Grid Responsive Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {POPULAR_SERVICES.map((service) => {
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => onSelectCategory(service.searchKey)}
                className="group text-left bg-white dark:bg-slate-800/95 hover:bg-emerald-50/50 dark:hover:bg-slate-750 p-4 sm:p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 dark:hover:border-emerald-400 shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer active:scale-[0.98]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl sm:text-3xl filter drop-shadow-xs">{service.emoji}</span>
                    <span className="text-[10px] sm:text-[11px] font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-700/60 px-2 py-0.5 rounded-md">
                      {service.badge}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-outfit group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {service.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-medium">
                    {service.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  <span>Find {service.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
