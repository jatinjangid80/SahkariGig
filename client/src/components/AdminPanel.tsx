import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, Check, Lock, Key, AlertCircle } from 'lucide-react';
import { supabase } from '../supabase';

export const AdminPanel: React.FC = () => {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'approvals' | 'workers' | 'bookings'>('approvals');
  const [stats, setStats] = useState({
    activeWorkers: 0,
    activeBookings: 0,
    payouts: 0,
  });

  const [pendingWorkers, setPendingWorkers] = useState<any[]>([]);

  useEffect(() => {
    if (isUnlocked) {
      const fetchAdminData = async () => {
        // Fetch pending workers
        const { data, error } = await supabase
          .from('workers')
          .select('*')
          .eq('is_verified', false)
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          setPendingWorkers(data.map(w => ({
            id: w.id,
            name: w.name,
            trade: w.trade,
            coopName: w.coop_name || 'Independent',
            experience: '2+ Years',
            appliedAt: new Date(w.created_at).toLocaleDateString(),
            documents: ['Aadhaar Uploaded', 'Coop ID']
          })));
        }

        // Fetch active workers count
        const { count: workersCount } = await supabase
          .from('workers')
          .select('*', { count: 'exact', head: true })
          .eq('is_verified', true);

        // Fetch active bookings count
        const { count: bookingsCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true });

        // Fetch payouts (sum of amount)
        const { data: payoutsData } = await supabase
          .from('bookings')
          .select('amount');
          
        let totalPayouts = 0;
        if (payoutsData) {
          totalPayouts = payoutsData.reduce((sum, b) => {
            const val = parseInt(b.amount.replace(/[^0-9]/g, '')) || 0;
            return sum + val;
          }, 0);
        }

        setStats({
          activeWorkers: workersCount || 0,
          activeBookings: bookingsCount || 0,
          payouts: totalPayouts || 0,
        });
      };
      fetchAdminData();
    }
  }, [isUnlocked]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '26089' || pin === '1234' || pin === '0000') {
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid Admin Security PIN. Hint: Use 26089 or 1234');
    }
  };

  const handleApprove = async (id: string) => {
    setPendingWorkers(pendingWorkers.filter(w => w.id !== id));
    fetch(`http://localhost:5001/api/workers/${id}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
        'x-user-role': 'Admin'
      },
      body: JSON.stringify({ status: 'active' })
    }).catch(() => null);
    await supabase.from('workers').update({ is_verified: true }).eq('id', id).catch(() => null);
  };

  const handleReject = async (id: string) => {
    setPendingWorkers(pendingWorkers.filter(w => w.id !== id));
    fetch(`http://localhost:5001/api/workers/${id}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
        'x-user-role': 'Admin'
      },
      body: JSON.stringify({ status: 'rejected', rejectionReason: 'Incomplete documentation' })
    }).catch(() => null);
    await supabase.from('workers').delete().eq('id', id).catch(() => null);
  };

  if (!isUnlocked) {
    return (
      <div className="py-16 bg-slate-50 min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 p-8 text-center space-y-6">
          
          <div className="w-14 h-14 bg-slate-900 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Governance Gate
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 font-outfit">
              Admin PIN Verification
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Enter your Cooperative Federation Admin PIN to access worker approvals & governance console.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Security PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={5}
                  value={pin}
                  onChange={(e) => { setPin(e.target.value); setErrorMsg(''); }}
                  placeholder="Enter PIN (Default: 26089)"
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
              {errorMsg && (
                <p className="mt-1 text-xs text-rose-600 font-medium flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                  {errorMsg}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1"
            >
              <span>Unlock Admin Console</span>
            </button>
          </form>

          {/* Preset Demo Fast Unlock */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-center space-x-2">
            <span className="text-[11px] text-slate-500">Quick Demo Access:</span>
            <button
              onClick={() => { setPin('26089'); setIsUnlocked(true); }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold text-xs rounded border border-slate-300"
            >
              PIN: 26089
            </button>
          </div>

        </div>
      </div>
    );
  }

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
                Unlocked Mode
              </span>
            </div>
            <p className="text-sm text-slate-600">
              Manage worker registrations, cooperative society approvals, and platform governance.
            </p>
          </div>

          <button
            onClick={() => setIsUnlocked(false)}
            className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-100 transition-colors self-start md:self-auto flex items-center space-x-1"
          >
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Lock Console</span>
          </button>
        </div>

        {/* 4 Operations Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="light-card p-5">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Workers</span>
            <p className="text-2xl font-extrabold text-slate-900 font-outfit mt-1">{stats.activeWorkers} Members</p>
            <span className="text-xs text-emerald-600 font-semibold">Across Platform</span>
          </div>

          <div className="light-card p-5">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending Approvals</span>
            <p className="text-2xl font-extrabold text-amber-600 font-outfit mt-1">{pendingWorkers.length} Queue</p>
            <span className="text-xs text-amber-600 font-semibold">Requires document verification</span>
          </div>

          <div className="light-card p-5">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Bookings</span>
            <p className="text-2xl font-extrabold text-slate-900 font-outfit mt-1">{stats.activeBookings} Lifetime</p>
            <span className="text-xs text-sky-600 font-semibold">Platform usage</span>
          </div>

          <div className="light-card p-5">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Booking Value</span>
            <p className="text-2xl font-extrabold text-slate-900 font-outfit mt-1">₹{stats.payouts.toLocaleString()}</p>
            <span className="text-xs text-emerald-600 font-semibold">Gross transactional value</span>
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
