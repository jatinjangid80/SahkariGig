import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function BookingModal({ worker, selectedCategory, onClose, onBookingSuccess }) {
  const [category, setCategory] = useState(selectedCategory || worker?.skills[0] || 'Electrician');
  const [problemDescription, setProblemDescription] = useState('');
  const [address, setAddress] = useState('Flat 402, Green Valley Apartments, Sector 62, Noida');
  const [scheduledTime, setScheduledTime] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 16));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!worker) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token') || 'demo-token';
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          workerId: worker.id,
          category,
          problemDescription,
          scheduledTime,
          address,
          amount: worker.hourlyRate || 350
        })
      });
      const data = await res.json();
      if (data.success) {
        onBookingSuccess(data.booking);
      } else {
        setError(data.message || 'Failed to create booking.');
      }
    } catch (err) {
      setError('Connection error while booking worker.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-panel rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={worker.photoUrl} alt={worker.name} className="w-10 h-10 rounded-xl object-cover border border-emerald-500/40" />
            <div>
              <h3 className="font-bold text-white text-base">Book {worker.name}</h3>
              <p className="text-xs text-emerald-400 font-mono">Verified ID: {worker.workerId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Service Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {worker.skills.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Describe the Issue / Task</label>
            <textarea
              required
              rows={3}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="e.g. Ceiling fan is making loud buzzing noise and switchboard needs MCB repair..."
              className="w-full px-3.5 py-2.5 bg-slate-950/80 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Service Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Appointment Date & Time</label>
            <input
              type="datetime-local"
              required
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 text-white rounded-xl border border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Pricing & Guarantee Box */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Cooperative Standard Charge</p>
              <p className="text-lg font-bold text-white">₹{worker.hourlyRate} <span className="text-xs font-normal text-slate-400">/ estimated visit</span></p>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
              <span>Coop Protection</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 gradient-bg hover:opacity-95 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Confirm & Send Booking Request</span>
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
