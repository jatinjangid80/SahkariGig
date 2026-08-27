import React, { useState } from 'react';
import { Calendar, Clock, MapPin, QrCode, MessageSquare, CreditCard, Star, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface CustomerDashboardProps {
  onOpenChat: (booking: any) => void;
  onOpenPayment: (booking: any) => void;
  onOpenReview: (booking: any) => void;
  onVerifyQrCode: (workerId: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onOpenChat,
  onOpenPayment,
  onOpenReview,
  onVerifyQrCode
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'history' | 'payments'>('bookings');

  // Sample bookings with state transitions: REQUESTED -> ACCEPTED -> IN_PROGRESS -> COMPLETED -> RATED
  const [bookings, setBookings] = useState([
    {
      id: 'bk-101',
      service: 'Electrician',
      workerName: 'Rajesh Kumar',
      workerTrade: 'Electrician',
      workerId: 'WORKER-DEL-8901',
      coopName: 'Delhi Labour Cooperative Federation',
      date: 'Today',
      time: '10:00 AM',
      address: 'Flat 402, Green Park Apartments, New Delhi',
      amount: '₹600',
      status: 'ACCEPTED',
      paymentStatus: 'PENDING'
    },
    {
      id: 'bk-102',
      service: 'Plumber',
      workerName: 'Suresh Sharma',
      workerTrade: 'Plumber',
      workerId: 'WORKER-DEL-7652',
      coopName: 'JanSeva Plumbing Society',
      date: 'Yesterday',
      time: '02:00 PM',
      address: 'House 12, Sector 15, Gurgaon',
      amount: '₹450',
      status: 'COMPLETED',
      paymentStatus: 'PAID'
    }
  ]);

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

  return (
    <div className="py-8 bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">
              Good morning, Ananya
            </h1>
            <p className="text-sm text-slate-600">
              Manage your household service bookings, live worker verifications, and payments.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Verified Customer Account
            </span>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="light-card p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Upcoming Booking</span>
              <Calendar className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 font-outfit">1 Active</p>
            <span className="text-xs text-emerald-600 font-medium">Rajesh Kumar (Today 10 AM)</span>
          </div>

          <div className="light-card p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Active Services</span>
              <Clock className="w-4 h-4 text-sky-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 font-outfit">0 In-Flight</p>
            <span className="text-xs text-slate-500">Normal service schedule</span>
          </div>

          <div className="light-card p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Total Completed</span>
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 font-outfit">12 Services</p>
            <span className="text-xs text-slate-500">100% Cooperative verified</span>
          </div>

          <div className="light-card p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Pending Payment</span>
              <CreditCard className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 font-outfit">₹600</p>
            <span className="text-xs text-amber-600 font-medium">1 Payment pending</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="light-card p-6">
          
          {/* Tab Navigation */}
          <div className="flex items-center space-x-6 border-b border-slate-200 pb-3 mb-6 text-sm font-semibold">
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

          {/* Bookings List */}
          <div className="space-y-4">
            {bookings.map((booking) => (
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
          </div>

        </div>

      </div>
    </div>
  );
};
