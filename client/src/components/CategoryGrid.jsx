import React from 'react';
import { Zap, Droplets, Hammer, Paintbrush, Home, HeartHandshake, Car, Trees, Sparkles, Wrench, ChevronRight } from 'lucide-react';

const iconMap = {
  Zap: Zap,
  Droplets: Droplets,
  Hammer: Hammer,
  Paintbrush: Paintbrush,
  Home: Home,
  HeartHandshake: HeartHandshake,
  Car: Car,
  Trees: Trees,
  Sparkles: Sparkles,
  Wrench: Wrench
};

export default function CategoryGrid({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Explore Service Categories</h2>
          <p className="text-sm text-slate-400">Database-backed dynamic categories approved by Cooperative Federation admins</p>
        </div>

        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline"
          >
            Clear Filter (Show All Categories)
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {categories.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Wrench;
          const isSelected = selectedCategory === cat.name;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.name)}
              className={`p-4 rounded-2xl glass-card cursor-pointer transition-all duration-200 border group ${
                isSelected
                  ? 'bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-500/10'
                  : 'hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-800/80 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white'} transition-colors`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  Approved
                </span>
              </div>

              <h3 className="font-semibold text-white text-base group-hover:text-emerald-400 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>

              <div className="mt-3 flex items-center text-xs font-semibold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Browse Workers</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
