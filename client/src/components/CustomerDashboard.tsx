import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, QrCode, MessageSquare, CreditCard, Star, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../supabase';

interface CustomerDashboardProps {
  currentUser?: { name: string; role: string; id: string; email: string } | null;
  onOpenChat: (booking: any) => void;
  onOpenPayment: (booking: any) => void;
  onOpenReview: (booking: any) => void;
  onVerifyQrCode: (workerId: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  onOpenChat,
  onOpenPayment,
  onOpenReview,
  onVerifyQrCode
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'history' | 'payments'>('overview');

  // Sample bookings with state transitions: REQUESTED -> ACCEPTED -> IN_PROGRESS -> COMPLETED -> RATED
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const apiRes = await fetch('http://localhost:5001/api/bookings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
            'x-user-role': 'Customer'
          }
        }).catch(() => null);

        if (apiRes && apiRes.ok) {
          const json = await apiRes.json();
          if (json.success && Array.isArray(json.data?.bookings)) {
            setBookings(json.data.bookings.map((b: any) => ({
              id: b.id,
              service: b.service,
              workerName: b.workerName,
              workerTrade: b.workerTrade,
              workerId: b.workerId,
              coopName: 'Cooperative Federation',
              date: b.bookingDate,
              time: b.bookingTime,
              address: b.address,
              amount: b.amount,
              status: b.status,
              paymentStatus: b.paymentStatus
            })));
            return;
          }
        }

        if (currentUser?.id) {
          const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('customer_id', currentUser.id)
            .order('created_at', { ascending: false });
          
          if (!error && data) {
            setBookings(data.map(b => ({
              id: b.id,
              service: b.service,
              workerName: b.worker_name,
              workerTrade: b.worker_trade,
              workerId: b.worker_id,
              coopName: 'Cooperative Federation',
              date: b.booking_date,
              time: b.booking_time,
              address: b.address,
              amount: b.amount,
              status: b.status,
              paymentStatus: b.payment_status
            })));
          }
        }
      } catch (err) {
        console.error("Booking fetch error:", err);
      }
    };
    fetchBookings();
  }, [currentUser]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REQUESTED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">REQUESTED</span>;
      case 'ACCEPTED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">ACCEPTED</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">IN PROGRESS</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">COMPLETED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const firstName = currentUser?.name?.split(' ')[0] || 'Customer';

  return (
    <div className="py-8 bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">
              Good morning, {firstName} 👋
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
              Verified Customer
            </span>
          </div>
        </div>

        {/* Task-Centric Layout (Only shown on Overview) */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Task Area */}
            <div className="lg:col-span-2 space-y-8">
            
            {/* Upcoming Service Highlight */}
            <div>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Upcoming service</h2>
              {bookings.filter(b => b.status === 'ACCEPTED' || b.status === 'REQUESTED' || b.status === 'IN_PROGRESS').length > 0 ? (
                <div className="bg-white rounded-2xl border border-emerald-200 shadow-md p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 pointer-events-none" />
                  
                  {bookings.filter(b => b.status === 'ACCEPTED' || b.status === 'REQUESTED' || b.status === 'IN_PROGRESS').slice(0, 1).map(upcoming => (
                    <div key={upcoming.id} className="relative z-10">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                            ⚡
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 font-outfit">{upcoming.service}</h3>
                            <p className="text-sm font-medium text-slate-600 mt-0.5">{upcoming.workerName}</p>
                          </div>
                        </div>
                        {getStatusBadge(upcoming.status)}
                      </div>
                      
                      <div className="mt-6 flex items-center space-x-6 text-sm text-slate-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                          <span className="font-semibold">{upcoming.date} · {upcoming.time}</span>
                        </div>
                      </div>

                      <div className="mt-6 pt-5 border-t border-slate-100 flex gap-3">
                        <button
                          onClick={() => onVerifyQrCode(upcoming.workerId)}
                          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
                        >
                          Verify Worker ID
                        </button>
                        <button
                          onClick={() => onOpenChat(upcoming)}
                          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
                        >
                          Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center py-10">
                  <p className="text-slate-500 font-medium">No upcoming services scheduled.</p>
                  <button className="mt-4 px-6 py-2 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-xl hover:bg-emerald-100 transition-colors">
                    Book a Service
                  </button>
                </div>
              )}
            </div>

            {/* Recent Services List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Recent services</h2>
                <button 
                  onClick={() => setActiveTab('history')}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  View All
                </button>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {bookings.filter(b => b.status === 'COMPLETED').slice(0, 3).map(booking => (
                    <div key={booking.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div>
                        <p className="font-bold text-slate-900 text-sm font-outfit">{booking.service}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{booking.date} · {booking.workerName}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-bold text-slate-900">{booking.amount}</span>
                        {booking.paymentStatus === 'PENDING' ? (
                          <button
                            onClick={() => onOpenPayment(booking)}
                            className="px-3 py-1.5 bg-amber-100 text-amber-800 hover:bg-amber-200 font-bold text-xs rounded-lg transition-colors"
                          >
                            Pay Now
                          </button>
                        ) : (
                          <button
                            onClick={() => onOpenReview(booking)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center"
                          >
                            <Star className="w-3 h-3 mr-1" /> Review
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {bookings.filter(b => b.status === 'COMPLETED').length === 0 && (
                    <div className="p-6 text-center text-sm text-slate-500">
                      No completed services yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
            
          </div>

          {/* Sidebar / Quick Actions */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Quick actions</h2>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 space-y-1">
              <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group">
                <div className="flex items-center space-x-3 text-slate-700 group-hover:text-emerald-700 font-medium text-sm">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span>Book a Service</span>
                </div>
              </button>
              
              <button 
                onClick={() => setActiveTab('bookings')}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group"
              >
                <div className="flex items-center space-x-3 text-slate-700 group-hover:text-emerald-700 font-medium text-sm">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span>My Bookings</span>
                </div>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group">
                <div className="flex items-center space-x-3 text-slate-700 group-hover:text-emerald-700 font-medium text-sm">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span>Messages</span>
                </div>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group">
                <div className="flex items-center space-x-3 text-slate-700 group-hover:text-emerald-700 font-medium text-sm">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <span>Verify Worker ID</span>
                </div>
              </button>
            </div>
            </div>
          </div>
        )}

        {/* Tab-based Full Lists */}
        {activeTab !== 'overview' && (
          <div className="light-card p-6">
            
            <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-6 text-sm font-semibold">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'bookings'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  My Bookings
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'history'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Completed History
                </button>
              </div>
              <button onClick={() => setActiveTab('overview')} className="text-xs font-bold text-slate-500 hover:text-slate-800">
                &larr; Back to Overview
              </button>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              {bookings.filter(b => activeTab === 'history' ? b.status === 'COMPLETED' : b.status !== 'COMPLETED').map((booking) => (
                <div key={booking.id} className="p-5 rounded-xl border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-xs transition-shadow">
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-bold text-slate-900 text-base font-outfit">{booking.service}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    
                    <p className="text-xs text-slate-600">
                      Assigned: <span className="font-semibold text-slate-900">{booking.workerName}</span> ({booking.coopName})
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {booking.date}, {booking.time}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {booking.address}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onVerifyQrCode(booking.workerId)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verify QR</span>
                    </button>

                    <button
                      onClick={() => onOpenChat(booking)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                      <span>Chat</span>
                    </button>

                    {booking.status === 'COMPLETED' ? (
                      <button
                        onClick={() => onOpenReview(booking)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-lg transition-colors flex items-center space-x-1"
                      >
                        <Star className="w-3.5 h-3.5 fill-white" />
                        <span>Review</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenPayment(booking)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors flex items-center space-x-1"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay ({booking.amount})</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {bookings.filter(b => activeTab === 'history' ? b.status === 'COMPLETED' : b.status !== 'COMPLETED').length === 0 && (
                <div className="text-center py-10 text-slate-500 font-medium">
                  No bookings found for this category.
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
