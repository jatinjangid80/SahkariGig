import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  X,
  Shield,
  Sun,
  Home,
  Check,
  AlertCircle
} from 'lucide-react';

export interface ServiceCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  workerCount: number;
  color: string;
}

const DEFAULT_CATEGORIES: ServiceCategory[] = [
  {
    id: 'electrician',
    name: 'Electrician',
    iconName: 'Zap',
    description: 'Wiring, MCB repairs, fans, light fixtures & appliance setup.',
    workerCount: 18,
    color: 'bg-amber-50 text-amber-600 border-amber-200'
  },
  {
    id: 'plumber',
    name: 'Plumber',
    iconName: 'Droplet',
    description: 'Pipe leaks, taps, drainage, bathroom fittings & water tanks.',
    workerCount: 14,
    color: 'bg-sky-50 text-sky-600 border-sky-200'
  },
  {
    id: 'carpenter',
    name: 'Carpenter',
    iconName: 'Hammer',
    description: 'Furniture assembly, door locks, cabinet fixes & custom woodwork.',
    workerCount: 12,
    color: 'bg-orange-50 text-orange-600 border-orange-200'
  },
  {
    id: 'painter',
    name: 'Painter',
    iconName: 'Paintbrush',
    description: 'Interior & exterior wall painting, touch-ups & waterproofing.',
    workerCount: 15,
    color: 'bg-purple-50 text-purple-600 border-purple-200'
  },
  {
    id: 'domestic-help',
    name: 'Domestic Help',
    iconName: 'Sparkles',
    description: 'Housekeeping, daily cleaning, cooking & household chores.',
    workerCount: 22,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
  },
  {
    id: 'caregiver',
    name: 'Caregiver',
    iconName: 'HeartPulse',
    description: 'Elderly assistance, patient care & home nursing support.',
    workerCount: 10,
    color: 'bg-rose-50 text-rose-600 border-rose-200'
  },
  {
    id: 'driver',
    name: 'Driver',
    iconName: 'Car',
    description: 'Personal chauffeur, city trips & outstation driving services.',
    workerCount: 16,
    color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
  },
  {
    id: 'gardener',
    name: 'Gardener',
    iconName: 'Trees',
    description: 'Lawn trimming, plant maintenance, potting & garden care.',
    workerCount: 8,
    color: 'bg-teal-50 text-teal-600 border-teal-200'
  },
  {
    id: 'cleaner',
    name: 'Cleaner',
    iconName: 'Brush',
    description: 'Deep home cleaning, sofa & carpet shampooing, kitchen degreasing.',
    workerCount: 19,
    color: 'bg-blue-50 text-blue-600 border-blue-200'
  },
  {
    id: 'technician',
    name: 'Technician',
    iconName: 'Wrench',
    description: 'AC servicing, refrigerator repair, washing machine & TV setup.',
    workerCount: 13,
    color: 'bg-slate-100 text-slate-700 border-slate-300'
  }
];

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
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
  Shield,
  Sun,
  Home
};

const COLOR_PRESETS = [
  { label: 'Emerald', value: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { label: 'Amber', value: 'bg-amber-50 text-amber-600 border-amber-200' },
  { label: 'Sky Blue', value: 'bg-sky-50 text-sky-600 border-sky-200' },
  { label: 'Purple', value: 'bg-purple-50 text-purple-600 border-purple-200' },
  { label: 'Rose', value: 'bg-rose-50 text-rose-600 border-rose-200' },
  { label: 'Indigo', value: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
  { label: 'Orange', value: 'bg-orange-50 text-orange-600 border-orange-200' },
  { label: 'Teal', value: 'bg-teal-50 text-teal-600 border-teal-200' },
  { label: 'Slate', value: 'bg-slate-100 text-slate-700 border-slate-300' }
];

interface CategoryGridProps {
  onSelectCategory?: (category: string) => void;
  currentUser?: { name?: string; role?: string; email?: string } | null;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory, currentUser }) => {
  const [categories, setCategories] = useState<ServiceCategory[]>(() => {
    try {
      const saved = localStorage.getItem('sahkari_services');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CATEGORIES;
  });

  const isAdmin = currentUser?.role === 'Admin';

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formWorkerCount, setFormWorkerCount] = useState(10);
  const [formIcon, setFormIcon] = useState('Zap');
  const [formColor, setFormColor] = useState(COLOR_PRESETS[0].value);
  const [actionSuccess, setActionSuccess] = useState('');

  const saveCategories = (updated: ServiceCategory[]) => {
    setCategories(updated);
    try {
      localStorage.setItem('sahkari_services', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormName('');
    setFormDesc('');
    setFormWorkerCount(10);
    setFormIcon('Zap');
    setFormColor(COLOR_PRESETS[0].value);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, cat: ServiceCategory) => {
    e.stopPropagation();
    setEditingId(cat.id);
    setFormName(cat.name);
    setFormDesc(cat.description);
    setFormWorkerCount(cat.workerCount);
    setFormIcon(cat.iconName || 'Zap');
    setFormColor(cat.color || COLOR_PRESETS[0].value);
    setIsModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the "${name}" service?`)) {
      const updated = categories.filter(c => c.id !== id);
      saveCategories(updated);
      showToast(`Service "${name}" removed successfully!`);
    }
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingId) {
      // Edit existing
      const updated = categories.map(c => {
        if (c.id === editingId) {
          return {
            ...c,
            name: formName.trim(),
            description: formDesc.trim(),
            workerCount: Number(formWorkerCount) || 1,
            iconName: formIcon,
            color: formColor
          };
        }
        return c;
      });
      saveCategories(updated);
      showToast(`Service "${formName}" updated successfully!`);
    } else {
      // Add new
      const newCat: ServiceCategory = {
        id: `service-${Date.now()}`,
        name: formName.trim(),
        iconName: formIcon,
        description: formDesc.trim() || 'Cooperative verified trade service',
        workerCount: Number(formWorkerCount) || 5,
        color: formColor
      };
      saveCategories([...categories, newCat]);
      showToast(`New service "${formName}" added successfully!`);
    }

    setIsModalOpen(false);
  };

  const showToast = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 3000);
  };

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
    <section id="services" className="py-16 bg-white border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Toast Alert */}
        {actionSuccess && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in slide-in-from-bottom-5">
            <Check className="w-5 h-5 text-emerald-300" />
            <span className="text-sm font-bold">{actionSuccess}</span>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div className="text-center sm:text-left max-w-2xl">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Services Directory
              </span>
              {isAdmin && (
                <span className="inline-flex items-center text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-3 py-0.5 rounded-full border border-indigo-200">
                  <Shield className="w-3 h-3 mr-1 text-indigo-600" />
                  Admin Management Mode
                </span>
              )}
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-outfit">
              Find a service
            </h2>
            <p className="mt-2 text-base text-slate-600">
              Choose from verified cooperative workers across everyday household and community services.
            </p>
          </div>

          {/* Admin Add Service Button */}
          {isAdmin && (
            <button
              onClick={handleOpenAdd}
              className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service</span>
            </button>
          )}
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat) => {
            const IconComponent = ICON_MAP[cat.iconName] || Zap;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className="light-card p-5 cursor-pointer group flex flex-col justify-between hover:-translate-y-1 transition-all relative border border-slate-200/80 hover:border-emerald-500 rounded-2xl bg-white shadow-2xs hover:shadow-md"
              >
                <div>
                  {/* Top row with Icon and Admin Quick Actions */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${cat.color} transition-transform group-hover:scale-105 shadow-xs`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    {/* Admin Action Buttons */}
                    {isAdmin && (
                      <div className="flex items-center space-x-1 opacity-90 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <button
                          title="Edit Service"
                          onClick={(e) => handleOpenEdit(e, cat)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          title="Delete Service"
                          onClick={(e) => handleDelete(e, cat.id, cat.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-outfit group-hover:text-emerald-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
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

      {/* Admin Add/Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  {editingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-outfit">
                    {editingId ? 'Edit Service Details' : 'Add New Service Category'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Admin control for cooperative services catalogue</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Service Name / Trade Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Solar Technician, Roofer, Security Guard"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Brief description of work handled by this trade..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Available Workers
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={formWorkerCount}
                    onChange={(e) => setFormWorkerCount(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Icon
                  </label>
                  <select
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {Object.keys(ICON_MAP).map((iconKey) => (
                      <option key={iconKey} value={iconKey}>
                        {iconKey}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Card Theme Color
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormColor(preset.value)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        formColor === preset.value
                          ? 'ring-2 ring-emerald-600 border-emerald-600 ' + preset.value
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {editingId ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
