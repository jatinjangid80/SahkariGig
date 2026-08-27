import React, { useState, useEffect } from 'react';
import { ShieldCheck, QrCode, Check, X, Clock, MapPin, Calendar, IndianRupee, Award, Star, MessageSquare } from 'lucide-react';
import { supabase } from '../supabase';

interface WorkerDashboardProps {
  currentUser?: { name: string; role: string; id: string; email: string } | null;
  onOpenWorkerIdCard?: () => void;
  onOpenChat?: (booking: any) => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ currentUser, onOpenWorkerIdCard, onOpenChat }) => {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    if (!currentUser?.name) return;
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('worker_name', currentUser.name)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setRequests(data.map(b => ({
          id: b.id,
          service: b.service,
          customerName: b.customer_name,
          address: b.address,
          dateTime: `${b.booking_date}, ${b.booking_time}`,
          amount: b.amount,
          status: b.status
        })));
      }
    };
    fetchRequests();
  }, [currentUser]);

  const handleAccept = async (id: string) => {
    // Update local state optimistically
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'ACCEPTED' } : r));
    // Update DB
    await supabase.from('bookings').update({ status: 'ACCEPTED' }).eq('id', id);
  };

  const handleReject = async (id: string) => {
    // Update local state optimistically
    setRequests(requests.filter(r => r.id !== id));
    // Optionally update DB status to 'REJECTED' if you support it, or delete it
  };

  const fullName = currentUser?.name || 'Worker';

  return (
    <div className="py-8 bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Worker Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">
                {fullName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Verified Electrician
              </span>
            </div>
            <p className="text-sm text-slate-600">
              Delhi Labour Cooperative Federation • Worker ID: WORKER-DEL-8901
            </p>
          </div>

          <button
            onClick={onOpenWorkerIdCard}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-2 self-start md:self-auto"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>View / Download Digital ID Card</span>
          </button>
        </div>

        {/* 4 Top Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="light-card p-5">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">New Requests</span>
            <p className="text-2xl font-extrabold text-slate-900 font-outfit mt-1">{requests.filter(r => r.status === 'PENDING').length} Jobs</p>
            <span className="text-xs text-amber-600 font-semibold">Action required</span>
          </div>

          <div className="light-card p-5">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Today's Jobs</span>
            <p className="text-2xl font-extrabold text-slate-900 font-outfit mt-1">2 Scheduled</p>
            <span className="text-xs text-sky-600 font-semibold">First job at 10:00 AM</span>
          </div>

          <div className="light-card p-5">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Jobs</span>
            <p className="text-2xl font-extrabold text-slate-900 font-outfit mt-1">1 In-Progress</p>
            <span className="text-xs text-emerald-600 font-semibold">On-site verification done</span>
          </div>

          <div className="light-card p-5">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Monthly Earnings</span>
            <p className="text-2xl font-extrabold text-slate-900 font-outfit mt-1">₹18,400</p>
            <span className="text-xs text-emerald-600 font-semibold">+14% vs last month</span>
          </div>
        </div>

        {/* New Job Requests */}
        <div className="light-card p-6">
          <h2 className="text-lg font-extrabold text-slate-900 font-outfit mb-4">
            New Booking Requests
          </h2>

          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="p-5 rounded-xl border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 text-base">{req.service}</h3>
                    <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-emerald-50 text-emerald-700">
                      {req.amount}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-600">
                    Customer: <span className="font-semibold text-slate-900">{req.customerName}</span>
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {req.dateTime}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {req.address}
                    </span>
                  </div>
                </div>

                {req.status === 'PENDING' ? (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleReject(req.id)}
                      className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleAccept(req.id)}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors flex items-center space-x-1"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      <span>Accept Job</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-200">
                      Accepted & Confirmed
                    </span>
                    <button
                      onClick={() => onOpenChat && onOpenChat(req)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center space-x-1"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      <span>Chat with Customer</span>
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>

        {/* My Skills & Verification Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="light-card p-6">
            <h3 className="text-base font-bold text-slate-900 font-outfit mb-3">Approved Skills & Trades</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-900">Residential Wiring & Circuit Fixes</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">Approved</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-900">Commercial Appliance Setup</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">Approved</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-900">Solar Inverter Maintenance</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded">Under Admin Review</span>
              </div>
            </div>
          </div>

          <div className="light-card p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-outfit mb-2">Cooperative Member Status</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your profile is active and verified under Delhi Labour Cooperative Federation.
              </p>
              <div className="mt-4 flex items-center space-x-2 text-emerald-700 text-xs font-bold">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Identity Verification Active (Validity: 2027)</span>
              </div>
            </div>

            <button
              onClick={onOpenWorkerIdCard}
              className="mt-6 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors"
            >
              Open Digital Worker ID Card
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
