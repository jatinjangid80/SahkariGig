import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, UserCheck, Check, Lock, Key, AlertCircle, 
  Building2, Users, CreditCard, HeartHandshake, FileText, 
  CheckCircle2, XCircle, Clock, MapPin, Search, Filter, 
  ArrowRight, Shield, RefreshCw, Sliders, AlertTriangle, 
  HelpCircle, ChevronRight, Scale, TrendingUp, IndianRupee, 
  PhoneCall, Award, Download, CheckCircle
} from 'lucide-react';
import { supabase } from '../supabase';
import { CONFIG } from '../config';

interface PendingWorker {
  id: string;
  name: string;
  trade: string;
  phone: string;
  coopName: string;
  experience: string;
  appliedAt: string;
  documents: {
    aadhaar: boolean;
    skillCert: boolean;
    societyCard: boolean;
  };
  score: number;
}

interface AllocationJob {
  id: string;
  customerName: string;
  service: string;
  address: string;
  urgency: 'EMERGENCY' | 'NORMAL' | 'SCHEDULED';
  amount: string;
  status: 'UNASSIGNED' | 'ASSIGNED' | 'IN_PROGRESS';
  candidateWorkers: {
    name: string;
    distance: string;
    rotationScore: number;
    skillsMatch: number;
  }[];
}

export const AdminPanel: React.FC = () => {
  const [pin, setPin] = useState('26089');
  const [isUnlocked, setIsUnlocked] = useState(true); // Default unlocked for easy inspection / demo
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<
    'overview' | 'kyc' | 'workers' | 'allocation' | 'payments' | 'welfare' | 'disputes' | 'settings'
  >('overview');

  // Operational metrics
  const [opsMetrics, setOpsMetrics] = useState({
    totalWorkers: 1248,
    availableToday: 384,
    todayJobs: 217,
    pendingKYC: 18,
    workerEarnings: 482450,
    welfareFundBalance: 24580,
    coopOpsIncome: 14470,
    activeDisputes: 2
  });

  // KYC Queue State
  const [pendingWorkers, setPendingWorkers] = useState<PendingWorker[]>([
    {
      id: 'KYC-101',
      name: 'Manoj Verma',
      trade: 'Electrician',
      phone: '+91 98290 11223',
      coopName: 'Jaipur Sahkari Labour Federation',
      experience: '6 Years (ITI Certified)',
      appliedAt: 'Today, 11:30 AM',
      documents: { aadhaar: true, skillCert: true, societyCard: true },
      score: 96
    },
    {
      id: 'KYC-102',
      name: 'Sunita Meena',
      trade: 'Cleaning',
      phone: '+91 94140 88991',
      coopName: 'Mahila Sahkari Labour Union',
      experience: '4 Years Experience',
      appliedAt: 'Today, 09:15 AM',
      documents: { aadhaar: true, skillCert: true, societyCard: false },
      score: 88
    },
    {
      id: 'KYC-103',
      name: 'Rameshwar Lal',
      trade: 'Plumber',
      phone: '+91 98291 44556',
      coopName: 'Rajasthan Labour Cooperative Society',
      experience: '9 Years Experience',
      appliedAt: 'Yesterday',
      documents: { aadhaar: true, skillCert: true, societyCard: true },
      score: 98
    },
    {
      id: 'KYC-104',
      name: 'Dinesh Gurjar',
      trade: 'Masonry',
      phone: '+91 96102 33441',
      coopName: 'Jaipur Artisan Cooperative Federation',
      experience: '12 Years (Master Mason)',
      appliedAt: '2 days ago',
      documents: { aadhaar: true, skillCert: false, societyCard: true },
      score: 82
    }
  ]);

  // Live Allocation Queue
  const [liveAllocationQueue, setLiveAllocationQueue] = useState<AllocationJob[]>([
    {
      id: 'SG-EMG-902',
      customerName: 'Pooja Agarwal (Mansarovar, Jaipur)',
      service: 'Electrician — Main Switchboard Fire Spark',
      address: 'Plot 42, Sector 7, Mansarovar',
      urgency: 'EMERGENCY',
      amount: '₹650',
      status: 'UNASSIGNED',
      candidateWorkers: [
        { name: 'Rajesh Kumar', distance: '1.4 km', rotationScore: 98, skillsMatch: 100 },
        { name: 'Mohan Sharma', distance: '2.8 km', rotationScore: 84, skillsMatch: 95 }
      ]
    },
    {
      id: 'SG-JOB-844',
      customerName: 'Vikram Singh (Malviya Nagar)',
      service: 'Plumber — Overhead Water Tank Leakage',
      address: 'B-18, Model Town, Malviya Nagar',
      urgency: 'NORMAL',
      amount: '₹450',
      status: 'UNASSIGNED',
      candidateWorkers: [
        { name: 'Suresh Saini', distance: '1.9 km', rotationScore: 92, skillsMatch: 95 },
        { name: 'Pintu Sharma', distance: '3.1 km', rotationScore: 78, skillsMatch: 90 }
      ]
    },
    {
      id: 'SG-JOB-842',
      customerName: 'Aditi Mathur (Vaishali Nagar)',
      service: 'AC Repair — Gas Refill & Cooling Service',
      address: 'D-402, Royal Palms, Vaishali Nagar',
      urgency: 'SCHEDULED',
      amount: '₹850',
      status: 'IN_PROGRESS',
      candidateWorkers: [
        { name: 'Kamlesh Saini (Assigned)', distance: '0.8 km', rotationScore: 96, skillsMatch: 100 }
      ]
    }
  ]);

  // Welfare Fund Claims
  const [welfareClaims, setWelfareClaims] = useState([
    {
      id: 'CLM-501',
      workerName: 'Rajendra Prasad (Carpenter)',
      claimType: 'Accidental Injury at Site',
      amount: '₹6,500',
      appliedDate: '20 Sep 2024',
      status: 'PENDING_APPROVAL',
      hospital: 'Jaipur SMS Government Hospital',
      coopMemberSince: '2022'
    },
    {
      id: 'CLM-502',
      workerName: 'Shanti Devi (Cleaning Member)',
      claimType: 'Child School Books Support',
      amount: '₹2,000',
      appliedDate: '18 Sep 2024',
      status: 'APPROVED',
      hospital: 'Cooperative Education Trust',
      coopMemberSince: '2023'
    }
  ]);

  // Disputes
  const [disputes, setDisputes] = useState([
    {
      id: 'DSP-801',
      bookingId: 'SG-10390',
      customer: 'Amit Choudhary',
      worker: 'Mahesh Kumar (Painter)',
      issue: 'Customer requested 2 additional coats without agreed add-on rate',
      status: 'MEDIATION_ACTIVE',
      suggestedResolution: 'Cooperative standard extra-coat rate of ₹120 applied with 50% society waiver.'
    }
  ]);

  const handleApproveKYC = (workerId: string) => {
    setPendingWorkers(prev => prev.filter(w => w.id !== workerId));
    setOpsMetrics(prev => ({
      ...prev,
      totalWorkers: prev.totalWorkers + 1,
      availableToday: prev.availableToday + 1,
      pendingKYC: Math.max(0, prev.pendingKYC - 1)
    }));
  };

  const handleRejectKYC = (workerId: string) => {
    setPendingWorkers(prev => prev.filter(w => w.id !== workerId));
    setOpsMetrics(prev => ({
      ...prev,
      pendingKYC: Math.max(0, prev.pendingKYC - 1)
    }));
  };

  const handleAutoAssignJob = (jobId: string) => {
    setLiveAllocationQueue(prev => prev.map(job => {
      if (job.id === jobId) {
        return { ...job, status: 'ASSIGNED' };
      }
      return job;
    }));
  };

  const handleApproveClaim = (claimId: string) => {
    setWelfareClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'APPROVED' } : c));
  };

  if (!isUnlocked) {
    return (
      <div className="py-16 bg-[#fbfdfc] dark:bg-[#071311] min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-6">
          <div className="w-14 h-14 bg-emerald-800 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">Cooperative Administration</h2>
            <p className="text-xs text-slate-500 mt-1">Authorized officers & society admins only</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (pin === '26089' || pin === '1234') setIsUnlocked(true); else setErrorMsg('Invalid Security PIN'); }} className="space-y-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN (Default: 26089)"
              className="w-full text-center tracking-widest text-lg font-bold py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            {errorMsg && <p className="text-xs text-rose-600 font-bold">{errorMsg}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Access Operations Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-[#fbfdfc] dark:bg-[#071311] min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header & Cooperative Society Identity */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-black text-xl font-outfit shadow-sm">
              Sg
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-outfit">
                  Cooperative Operations Control Center
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  SIH26089 Live
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Jaipur District Cooperative Labour & Artisans Federation · Registered Society #COOP-RJ-2024
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start md:self-auto">
            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse mr-2" />
              Live Operations Active
            </span>
          </div>
        </div>

        {/* 6 Real-time KPI Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Workers</span>
              <Users className="w-4 h-4 text-emerald-700" />
            </div>
            <p className="text-xl font-black text-slate-900 dark:text-white font-outfit">{opsMetrics.totalWorkers.toLocaleString()}</p>
            <span className="text-[10px] text-slate-500 font-medium">100% KYC Verified</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Available Now</span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl font-black text-emerald-700 dark:text-emerald-400 font-outfit">{opsMetrics.availableToday}</p>
            <span className="text-[10px] text-emerald-600 font-bold">● Ready for dispatch</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Today's Jobs</span>
              <Briefcase className="w-4 h-4 text-sky-600" />
            </div>
            <p className="text-xl font-black text-slate-900 dark:text-white font-outfit">{opsMetrics.todayJobs}</p>
            <span className="text-[10px] text-sky-600 font-bold">32 In Progress</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Pending KYC</span>
              <ShieldCheck className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-xl font-black text-amber-600 font-outfit">{pendingWorkers.length}</p>
            <span className="text-[10px] text-amber-600 font-bold">Awaiting approval</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Worker Payouts</span>
              <IndianRupee className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl font-black text-slate-900 dark:text-white font-outfit">₹4.82L</p>
            <span className="text-[10px] text-emerald-700 font-bold">95% Direct Share</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Welfare Pool</span>
              <HeartHandshake className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xl font-black text-amber-600 font-outfit">₹24.5K</p>
            <span className="text-[10px] text-amber-600 font-bold">Medical & Accident Cover</span>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2 text-xs font-bold">
          {[
            { id: 'overview', label: '📊 Live Operations' },
            { id: 'kyc', label: `🪪 Worker Verification (${pendingWorkers.length})` },
            { id: 'allocation', label: '⚖️ Allocation Engine' },
            { id: 'workers', label: '👷 Worker Registry' },
            { id: 'payments', label: '💳 Financial Settlements' },
            { id: 'welfare', label: '🏥 Welfare Fund Ledger' },
            { id: 'disputes', label: `⚖️ Disputes (${disputes.length})` },
            { id: 'settings', label: '⚙️ Society Bylaws' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & LIVE OPERATIONS */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Live Operational Status Strip */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80">
                <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                  <span>32 Jobs In Progress</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">Active electricians, plumbers, & cleaners on client sites across Jaipur</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80">
                <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-bold text-xs mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>11 Unassigned Requests</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">Queued in deterministic fair-rotation matching pipeline</p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80">
                <div className="flex items-center space-x-2 text-rose-800 dark:text-rose-300 font-bold text-xs mb-1">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>4 Emergency Requests</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">Short-circuit & pipe burst alerts flagged for instant 15-min dispatch</p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80">
                <div className="flex items-center space-x-2 text-sky-800 dark:text-sky-300 font-bold text-xs mb-1">
                  <CheckCircle className="w-4 h-4 text-sky-600" />
                  <span>99.4% On-Time Arrival</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">Average ETA across 217 completed shifts: 18.2 minutes</p>
              </div>
            </div>

            {/* Live Operations & Allocation Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white font-outfit text-base">Live Allocation & Dispatch Queue</h3>
                  <p className="text-xs text-slate-500">Real-time matching based on Availability + Distance + Skill Match + Fair Rotation</p>
                </div>
                <button
                  onClick={() => setActiveTab('allocation')}
                  className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  View Full Engine →
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {liveAllocationQueue.map((job) => (
                  <div key={job.id} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          job.urgency === 'EMERGENCY'
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {job.urgency}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{job.service}</span>
                        <span className="text-[10px] text-slate-400">Ref: {job.id}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {job.address} · <span className="font-semibold text-slate-900 dark:text-white ml-1">{job.customerName}</span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 self-end md:self-auto">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">{job.amount}</span>
                      {job.status === 'UNASSIGNED' ? (
                        <button
                          onClick={() => handleAutoAssignJob(job.id)}
                          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          Auto-Assign Top Match
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800">
                          ✓ Assigned & En Route
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WORKER VERIFICATION & KYC */}
        {activeTab === 'kyc' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white font-outfit text-base">Worker Verification & KYC Applications</h3>
                <p className="text-xs text-slate-500">Verify government ID, trade skills, and issue official cooperative membership cards</p>
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-3 py-1 rounded-full border border-amber-200">
                {pendingWorkers.length} Pending Actions
              </span>
            </div>

            {pendingWorkers.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-slate-900 dark:text-white">All KYC Applications Cleared!</h4>
                <p className="text-xs text-slate-500 mt-1">No pending worker verification requests at this time.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {pendingWorkers.map((worker) => (
                  <div key={worker.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{worker.name}</h4>
                        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{worker.trade} · {worker.experience}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{worker.coopName} · {worker.phone}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px]">
                        {worker.score}% Trust Score
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span>Aadhaar Identity Verification:</span>
                        <span className="font-bold text-emerald-600">✓ Verified via UIDAI</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Trade Skill Certification:</span>
                        <span className={worker.documents.skillCert ? 'font-bold text-emerald-600' : 'font-bold text-amber-600'}>
                          {worker.documents.skillCert ? '✓ ITI / Skill Council Diploma' : '⚠️ Pending Peer Practical Test'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Police & Society Background:</span>
                        <span className="font-bold text-emerald-600">✓ Clean Record</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-1">
                      <button
                        onClick={() => handleRejectKYC(worker.id)}
                        className="px-3.5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-rose-100 hover:text-rose-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApproveKYC(worker.id)}
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Issue Society ID</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ALLOCATION ENGINE */}
        {activeTab === 'allocation' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white font-outfit text-base">Deterministic Fair-Rotation Allocation Engine</h3>
              <p className="text-xs text-slate-500">
                SahkariGig does not use opaque blackbox algorithms. Every dispatch is calculated transparently:
              </p>
            </div>

            {/* Formula Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-200 space-y-2 font-mono">
              <p className="font-bold text-emerald-900 dark:text-emerald-300">
                Match Score = (Skill Match × 40%) + (Proximity Score × 30%) + (Fair Rotation Workload × 30%)
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                • <strong>Fair Rotation:</strong> Workers with fewer shifts this week are prioritized to eliminate platform favoritism.<br />
                • <strong>Proximity:</strong> Minimizes worker travel distance & fuel costs (within 5–10 km radius).
              </p>
            </div>

            {/* Live Queue Inspection */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Matching Pipeline</h4>
              {liveAllocationQueue.map(job => (
                <div key={job.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">{job.service}</span>
                    <span className="text-xs font-extrabold text-emerald-700">{job.amount}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {job.candidateWorkers.map((c, i) => (
                      <div key={i} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <div>
                          <span className="font-bold block">{c.name}</span>
                          <span className="text-[10px] text-slate-500">{c.distance} away · Skills: {c.skillsMatch}%</span>
                        </div>
                        <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          Rotation Score: {c.rotationScore}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: WELFARE FUND LEDGER */}
        {activeTab === 'welfare' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white font-outfit text-base">Cooperative Welfare & Medical Relief Fund</h3>
                <p className="text-xs text-slate-500">Funded automatically by the 2% fee collected on every completed service booking</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-bold">Total Pool Balance</span>
                <span className="text-xl font-black text-amber-600 font-outfit">₹24,580</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Emergency Relief & Insurance Claims</h4>
              {welfareClaims.map(claim => (
                <div key={claim.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 dark:text-white">{claim.workerName}</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                        {claim.claimType}
                      </span>
                    </div>
                    <p className="text-slate-500 mt-0.5">Facility: {claim.hospital} · Member Since: {claim.coopMemberSince}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="font-black text-base text-slate-900 dark:text-white font-outfit">{claim.amount}</span>
                    {claim.status === 'PENDING_APPROVAL' ? (
                      <button
                        onClick={() => handleApproveClaim(claim.id)}
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Approve Relief Payout
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl">
                        ✓ Disbursed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FINANCIAL SETTLEMENTS */}
        {activeTab === 'payments' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white font-outfit text-base">Financial Settlement Summary</h3>
              <p className="text-xs text-slate-500">Complete transparency of all money flowing through the cooperative</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">Worker Direct Earnings (95%)</span>
                <p className="text-2xl font-black text-emerald-900 dark:text-emerald-200 font-outfit mt-1">₹4,82,450</p>
                <span className="text-[10px] text-slate-500">Transferred directly to worker bank accounts</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Cooperative Operations (3%)</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white font-outfit mt-1">₹14,470</p>
                <span className="text-[10px] text-slate-500">Server hosting, SMS alerts & union office maintenance</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block">Welfare & Emergency Pool (2%)</span>
                <p className="text-2xl font-black text-amber-700 dark:text-amber-400 font-outfit mt-1">₹9,650</p>
                <span className="text-[10px] text-slate-500">Accident insurance & medical fund contribution</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
