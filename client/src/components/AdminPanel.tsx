import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Check, X, Users, AlertCircle, FileText, Settings, Award } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'workers' | 'bookings'>('approvals');

  const [pendingWorkers, setPendingWorkers] = useState([
    {
      id: 'app-301',
      name: 'Ramesh Sharma',
      trade: 'Plumber & Sanitation Specialist',
      coopName: 'JanSeva Plumbing Society',
      experience: '7 Years',
      appliedAt: '2 Hours ago',
      documents: ['Aadhaar Verified', 'Trade Certificate', 'Coop Membership ID']
    },
    {
      id: 'app-302',
      name: 'Mohan Lal',
      trade: 'Mason & Carpenter',
      coopName: 'Northern Crafts Cooperative Federation',
      experience: '10 Years',
      appliedAt: 'Yesterday',
      documents: ['Aadhaar Verified', 'Coop Membership ID']
    }
  ]);

  const handleApprove = (id: string) => {
    setPendingWorkers(pendingWorkers.filter(w => w.id !== id));
  };

  const handleReject = (id: string) => {
    setPendingWorkers(pendingWorkers.filter(w => w.id !== id));
  };

  return (
    <div className="py-8 bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">
                Cooperative Federation Admin Console
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white">
                Admin Mode
              </span>
            </div>
            <p className="text-sm text-slate-600">
              Manage worker registrations, cooperative society approvals, and platform governance.
            </p>
          </div>
        </div>

        {/* 4 Operations Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="light-card p-5">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Workers</span>
            <p className="text-2xl font-extrabold text-slate-900 font-outfit mt-1">142 Members</p>
            <span className="text-xs text-emerald-600 font-semibold">Across 18 Cooperatives</span>
          </div>

          <div className="light-card p-5">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending Approvals</span>
            <p className="text-2xl font-extrabold text-amber-600 font-outfit mt-1">{pendingWorkers.length} Queue</p>
            <span className="text-xs text-amber-600 font-semibold">Requires document verification</span>
          </div>

          <div className="light-card p-5">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Bookings</span>
            <p className="text-2xl font-extrabold text-slate-900 font-outfit mt-1">38 Today</p>
            <span className="text-xs text-sky-600 font-semibold">98.2% Fulfillment rate</span>
          </div>

          <div className="light-card p-5">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cooperative Payouts</span>
            <p className="text-2xl font-extrabold text-slate-900 font-outfit mt-1">₹1,42,800</p>
            <span className="text-xs text-emerald-600 font-semibold">Disbursed this week</span>
          </div>
        </div>

        {/* Operational Section: Worker Approvals Queue */}
        <div className="light-card p-6">
          
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
            <h2 className="text-lg font-extrabold text-slate-900 font-outfit flex items-center">
              <UserCheck className="w-5 h-5 text-emerald-600 mr-2" />
              Worker Membership Approval Queue
            </h2>
            <span className="text-xs text-slate-500">{pendingWorkers.length} pending review</span>
          </div>

          {pendingWorkers.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="font-semibold text-slate-800">Queue Clean!</p>
              <p>All pending worker member applications have been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingWorkers.map((applicant) => (
                <div key={applicant.id} className="p-5 rounded-xl border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-slate-900 text-base">{applicant.name}</h3>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {applicant.trade}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      Cooperative: <span className="font-semibold text-slate-900">{applicant.coopName}</span> • Exp: {applicant.experience}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                      {applicant.documents.map((doc) => (
                        <span key={doc} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                          ✓ {doc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleReject(applicant.id)}
                      className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(applicant.id)}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors flex items-center space-x-1"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      <span>Approve & Issue Digital ID</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
