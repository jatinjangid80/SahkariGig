import React from 'react';
import {
  Zap,
  Droplet,
  Hammer,
  Paintbrush,
  Sparkles,
  HeartPulse,
  Car,
  Trees,
  Brush,
  Wrench,
  ChevronRight
} from 'lucide-react';

interface CategoryGridProps {
  onSelectCategory?: (category: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'electrician',
      name: 'Electrician',
      icon: Zap,
      description: 'Wiring, MCB repairs, fans, light fixtures & appliance setup.',
      workerCount: 18,
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      id: 'plumber',
      name: 'Plumber',
      icon: Droplet,
      description: 'Pipe leaks, taps, drainage, bathroom fittings & water tanks.',
      workerCount: 14,
      color: 'bg-sky-50 text-sky-600 border-sky-200'
    },
    {
      id: 'carpenter',
      name: 'Carpenter',
      icon: Hammer,
      description: 'Furniture assembly, door locks, cabinet fixes & custom woodwork.',
      workerCount: 12,
      color: 'bg-orange-50 text-orange-600 border-orange-200'
    },
    {
      id: 'painter',
      name: 'Painter',
      icon: Paintbrush,
      description: 'Interior & exterior wall painting, touch-ups & waterproofing.',
      workerCount: 15,
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    },
    {
      id: 'domestic-help',
      name: 'Domestic Help',
      icon: Sparkles,
      description: 'Housekeeping, daily cleaning, cooking & household chores.',
      workerCount: 22,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    {
      id: 'caregiver',
      name: 'Caregiver',
      icon: HeartPulse,
      description: 'Elderly assistance, patient care & home nursing support.',
      workerCount: 10,
      color: 'bg-rose-50 text-rose-600 border-rose-200'
    },
    {
      id: 'driver',
      name: 'Driver',
      icon: Car,
      description: 'Personal chauffeur, city trips & outstation driving services.',
      workerCount: 16,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    },
    {
      id: 'gardener',
      name: 'Gardener',
      icon: Trees,
      description: 'Lawn trimming, plant maintenance, potting & garden care.',
      workerCount: 8,
      color: 'bg-teal-50 text-teal-600 border-teal-200'
    },
    {
      id: 'cleaner',
      name: 'Cleaner',
      icon: Brush,
      description: 'Deep home cleaning, sofa & carpet shampooing, kitchen degreasing.',
      workerCount: 19,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      id: 'technician',
      name: 'Technician',
      icon: Wrench,
      description: 'AC servicing, refrigerator repair, washing machine & TV setup.',
      workerCount: 13,
      color: 'bg-slate-100 text-slate-700 border-slate-300'
    }
  ];

  const handleCategoryClick = (categoryName: string) => {
    if (onSelectCategory) {
      onSelectCategory(categoryName);
    }
    const elem = document.getElementById('workers-directory');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Services Directory
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-outfit">
            Find a service
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Choose from verified cooperative workers across everyday household and community services.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className="light-card p-5 cursor-pointer group flex flex-col justify-between hover:-translate-y-1 transition-all"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${cat.color} mb-4 transition-transform group-hover:scale-105`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-outfit group-hover:text-emerald-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    {cat.workerCount} Available
                  </span>
                  <div className="flex items-center text-xs font-semibold text-slate-600 group-hover:text-emerald-700 transition-colors">
                    <span>View</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
