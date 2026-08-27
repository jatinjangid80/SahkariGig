import React, { useState, useEffect } from 'react';
import { Settings, UserCheck, Sparkles, CreditCard, ShieldCheck, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminPanel({ onWorkerApproved, onSkillApproved, onPaymentVerified }) {
  const [workersList, setWorkersList] = useState([]);
  const [pendingSkills, setPendingSkills] = useState([]);
  const [paymentsList, setPaymentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('workers');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || 'demo-token';
      const headers = { 'Authorization': `Bearer ${token}` };

      const [wRes, sRes, pRes] = await Promise.all([
        fetch('/api/admin/workers', { headers }),
        fetch('/api/admin/pending-skills', { headers }),
        fetch('/api/payments', { headers })
      ]);

      const wData = await wRes.json();
      const sData = await sRes.json();
      const pData = await pRes.json();

      if (wData.success) setWorkersList(wData.workers || []);
      if (sData.success) setPendingSkills(sData.pendingSkills || []);
      if (pData.success) setPaymentsList(pData.payments || []);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApproveWorker = async (id, action) => {
    try {
      const token = localStorage.getItem('token') || 'demo-token';
      const res = await fetch(`/api/admin/approve-worker/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
        if (onWorkerApproved) onWorkerApproved();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveSkill = async (id, action) => {
    try {
      const token = localStorage.getItem('token') || 'demo-token';
      const res = await fetch(`/api/admin/approve-skill/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
        if (onSkillApproved) onSkillApproved();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyPayment = async (id, action) => {
    try {
      const token = localStorage.getItem('token') || 'demo-token';
      const res = await fetch(`/api/admin/payments/${id}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
        if (onPaymentVerified) onPaymentVerified();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pendingWorkers = workersList.filter(w => w.status === 'pending');
  const claimedPayments = paymentsList.filter(p => p.status === 'CUSTOMER_CLAIMED_PAID');

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Cooperative Admin Governance Panel</h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
              Jan Seva Federation
            </span>
          </div>
          <p className="text-sm text-slate-400">Onboard workers, approve dynamic skills & verify member payments</p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl transition-colors border border-slate-700 flex items-center space-x-1.5 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queues</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('workers')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 ${
            activeTab === 'workers'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Pending Workers Queue ({pendingWorkers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 ${
            activeTab === 'skills'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>New Skill Approvals ({pendingSkills.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 ${
            activeTab === 'payments'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>UPI Payment Verification ({claimedPayments.length})</span>
        </button>
      </div>

      {/* Tab Content 1: Pending Workers */}
      {activeTab === 'workers' && (
        <div className="space-y-4">
          {pendingWorkers.length === 0 ? (
            <div className="p-8 text-center glass-panel rounded-3xl border border-slate-800 text-xs text-slate-400">
              No workers currently awaiting onboarding approval.
            </div>
          ) : (
            pendingWorkers.map((w) => (
              <div key={w.id} className="glass-panel rounded-2xl p-5 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <img src={w.photoUrl} alt={w.name} className="w-12 h-12 rounded-xl object-cover border border-purple-400/40" />
                  <div>
                    <h4 className="font-bold text-white text-base">{w.name}</h4>
                    <p className="text-xs text-slate-400">{w.cooperativeSociety} • Skills: {w.skills.join(', ')}</p>
                    <p className="text-xs font-mono text-purple-400">Temp ID: {w.workerId}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleApproveWorker(w.id, 'approve')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Worker</span>
                  </button>
                  <button
                    onClick={() => handleApproveWorker(w.id, 'reject')}
                    className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl border border-rose-500/30"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content 2: Dynamic Skill Approvals (PRD Section 4.2) */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          {pendingSkills.length === 0 ? (
            <div className="p-8 text-center glass-panel rounded-3xl border border-slate-800 text-xs text-slate-400">
              No new skill submissions pending review.
            </div>
          ) : (
            pendingSkills.map((s) => (
              <div key={s.id} className="glass-panel rounded-2xl p-5 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white text-base">{s.name}</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md font-semibold">Pending Admin Review</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{s.description}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleApproveSkill(s.id, 'approve')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Make Live</span>
                  </button>
                  <button
                    onClick={() => handleApproveSkill(s.id, 'reject')}
                    className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl border border-rose-500/30"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content 3: UPI Payment Verification */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          {claimedPayments.length === 0 ? (
            <div className="p-8 text-center glass-panel rounded-3xl border border-slate-800 text-xs text-slate-400">
              No unverified payment claims in queue.
            </div>
          ) : (
            claimedPayments.map((p) => (
              <div key={p.id} className="glass-panel rounded-2xl p-5 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white text-base">Booking #{p.bookingId}</span>
                    <span className="text-xs font-semibold text-emerald-400">Amount: ₹{p.amount}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1"><span className="font-semibold text-slate-400">Customer Claimed UTR:</span> <span className="font-mono text-amber-300">{p.utrNumber}</span></p>
                  <p className="text-xs text-slate-400">Customer: {p.customerName} → Worker: {p.workerName}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleVerifyPayment(p.id, 'approve')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify & Confirm PAID</span>
                  </button>
                  <button
                    onClick={() => handleVerifyPayment(p.id, 'reject')}
                    className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl border border-rose-500/30"
                  >
                    Reject Claim
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
