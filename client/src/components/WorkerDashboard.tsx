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
    const fetchRequests = async () => {
      try {
        const apiRes = await fetch('http://localhost:5001/api/bookings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
            'x-user-role': 'Worker'
          }
        }).catch(() => null);

        if (apiRes && apiRes.ok) {
          const json = await apiRes.json();
          if (json.success && Array.isArray(json.data?.bookings)) {
            setRequests(json.data.bookings.map((b: any) => ({
              id: b.id,
              service: b.service,
              customerName: b.customerName,
              address: b.address,
              dateTime: `${b.bookingDate}, ${b.bookingTime}`,
              amount: b.amount,
              status: b.status
            })));
            return;
          }
        }

        // Default sample assigned job for Rajesh Kumar / Worker demo
        setRequests([
          {
            id: 'BK-1001',
            service: 'Electrical Inspection',
            customerName: 'jatinjangid72973',
            address: 'Connaught Place, New Delhi',
            dateTime: '2026-08-30, 10:00 AM',
            amount: '₹550',
            status: 'ACCEPTED'
          }
        ]);

      } catch (err) {
        console.error("Worker booking fetch error:", err);
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

        {/* Task-Centric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Task Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* New Job Requests */}
            <div>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">New Job Requests</h2>
              {requests.filter(r => r.status === 'PENDING').length > 0 ? (
                <div className="space-y-4">
                  {requests.filter(r => r.status === 'PENDING').map(req => (
                    <div key={req.id} className="bg-white rounded-2xl border border-emerald-200 shadow-md p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-60 pointer-events-none" />
                      
                      <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-bold text-slate-900 font-outfit">{req.service}</h3>
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                              New Request
                            </span>
                          </div>
                          <p className="text-sm font-medium text-slate-600 mt-1">{req.customerName} · 2.5 km away</p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-slate-400"/> {req.dateTime}</span>
                            <span className="font-bold text-emerald-700">{req.amount}</span>
                          </div>
                        </div>
                        
                        <div className="flex sm:flex-col gap-2 shrink-0">
                          <button
                            onClick={() => handleAccept(req.id)}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center shadow-sm"
                          >
                            <Check className="w-4 h-4 mr-1" /> Accept
                          </button>
                          <button
                            onClick={() => handleReject(req.id)}
                            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors flex items-center justify-center"
                          >
                            <X className="w-4 h-4 mr-1" /> Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center py-8">
                  <p className="text-slate-500 font-medium text-sm">No new requests right now. Keep your app open to receive alerts.</p>
                </div>
              )}
            </div>

            {/* Today's Schedule */}
            <div>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Today's Schedule</h2>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                {requests.filter(r => r.status === 'ACCEPTED' || r.status === 'IN_PROGRESS').map(req => (
                  <div key={req.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm font-outfit">{req.service}</h3>
                      <p className="text-xs text-slate-500 mt-1">{req.dateTime} · <span className="font-medium text-slate-700">{req.customerName}</span></p>
                      <p className="text-xs text-slate-500 mt-0.5">{req.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-sky-50 text-sky-700 text-[10px] font-bold rounded-lg border border-sky-100 mr-2">
                        {req.status === 'IN_PROGRESS' ? 'On-site' : 'Scheduled'}
                      </span>
                      <button
                        onClick={() => onOpenChat && onOpenChat(req)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors flex items-center space-x-1.5"
                        title="Chat with customer"
                      >
                        <MessageSquare className="w-4 h-4 text-white" />
                        <span>Chat Customer</span>
                      </button>
                    </div>
                  </div>
                ))}
                
                {requests.filter(r => r.status === 'ACCEPTED' || r.status === 'IN_PROGRESS').length === 0 && (
                  <div className="p-6 text-center text-sm text-slate-500">
                    Your schedule is clear for today.
                  </div>
                )}
              </div>
            </div>
            
          </div>

          {/* Sidebar / Earnings */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Earnings this week</h2>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
                <IndianRupee className="w-6 h-6" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 font-outfit">₹4,500</p>
              <p className="text-xs font-medium text-emerald-600 mt-1">+12% from last week</p>
              
              <div className="mt-6 pt-5 border-t border-slate-100 text-left space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Completed Jobs</span>
                  <span className="text-slate-900 font-bold">{requests.filter(r => r.status === 'COMPLETED').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Customer Rating</span>
                  <span className="text-slate-900 font-bold flex items-center">
                    4.9 <Star className="w-3 h-3 ml-1 text-amber-500 fill-amber-500" />
                  </span>
                </div>
              </div>
            </div>
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
