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
    <section id="popular-services" className="py-12 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100/70 border border-emerald-200 px-3 py-1 rounded-full">
            Everyday Essentials
          </span>
          <h2 className="mt-2.5 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-outfit">
            Popular Services
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
            Click any service to instantly connect with vetted local cooperative professionals.
          </p>
        </div>

        {/* 8-Grid Responsive Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {POPULAR_SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                onClick={() => onSelectCategory(service.searchKey)}
                className="group text-left bg-white hover:bg-emerald-50/40 p-4 rounded-2xl border border-slate-200/90 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-2xl">{service.emoji}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                      {service.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 font-outfit group-hover:text-emerald-700 transition-colors">
                    {service.name}
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600 group-hover:text-emerald-700">
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
