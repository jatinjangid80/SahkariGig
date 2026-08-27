import React from 'react';
import { Calendar, Clock, MapPin, MessageSquare, CreditCard, Star, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, QrCode } from 'lucide-react';

const statusSteps = ['requested', 'accepted', 'in_progress', 'completed', 'rated'];

export default function CustomerDashboard({ bookings, onOpenChat, onOpenPayment, onOpenReview, onOpenVerifyModal, onCancelBooking }) {
  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Customer Dashboard</h2>
          <p className="text-sm text-slate-400">Track service requests, live chat with workers & manage payments</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-3xl border border-slate-800">
          <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No active bookings yet</h3>
          <p className="text-sm text-slate-400 mt-1">Select a service category above to book verified cooperative workers.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const currentStepIdx = statusSteps.indexOf(booking.status);
            const isAccepted = ['accepted', 'in_progress', 'completed', 'rated'].includes(booking.status);
            const isCompleted = ['completed', 'rated'].includes(booking.status);

            return (
              <div key={booking.id} className="glass-panel rounded-3xl p-6 border border-slate-800 shadow-xl">
                
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={booking.worker.photoUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80'}
                      alt={booking.worker.name}
                      className="w-12 h-12 rounded-xl object-cover border border-emerald-500/40"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {booking.category}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Booking #{booking.id}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-0.5">{booking.worker.name}</h3>
                      <p className="text-xs text-slate-400">Worker ID: {booking.worker.workerId}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onOpenVerifyModal(booking.worker)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 rounded-xl transition-colors border border-slate-700 flex items-center space-x-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Verify QR ID</span>
                    </button>

                    {isAccepted && (
                      <button
                        onClick={() => onOpenChat(booking.id)}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Live Chat</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* State Machine Progress Stepper */}
                <div className="py-5 border-b border-slate-800">
                  <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Server-Enforced Booking State Machine</p>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    {statusSteps.map((step, idx) => {
                      const isDone = currentStepIdx >= idx;
                      const isCurrent = currentStepIdx === idx;

                      return (
                        <div key={step} className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all ${
                            isCurrent ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20' :
                            isDone ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-900 text-slate-600 border border-slate-800'
                          }`}>
                            {idx + 1}
                          </div>
                          <span className={`text-[10px] uppercase font-bold tracking-tight ${
                            isCurrent ? 'text-emerald-400' : isDone ? 'text-slate-300' : 'text-slate-600'
                          }`}>
                            {step.replace('_', ' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Details & Actions */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 text-xs text-slate-300">
                    <p><span className="font-semibold text-slate-400">Issue:</span> {booking.problemDescription}</p>
                    <p><span className="font-semibold text-slate-400">Address:</span> {booking.address}</p>
                    <p><span className="font-semibold text-slate-400">Scheduled:</span> {new Date(booking.scheduledTime).toLocaleString()}</p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400">Service Fee</span>
                      <p className="text-lg font-bold text-white">₹{booking.amount}</p>
                    </div>

                    {isCompleted && booking.status !== 'rated' && (
                      <button
                        onClick={() => onOpenReview(booking)}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center space-x-1"
                      >
                        <Star className="w-3.5 h-3.5 fill-slate-950" />
                        <span>Rate & Review</span>
                      </button>
                    )}

                    {isCompleted && (
                      <button
                        onClick={() => onOpenPayment(booking)}
                        className="px-4 py-2 gradient-bg hover:opacity-95 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center space-x-1"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay via UPI QR</span>
                      </button>
                    )}

                    {booking.status === 'requested' && (
                      <button
                        onClick={() => onCancelBooking(booking.id)}
                        className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold rounded-xl transition-colors"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
