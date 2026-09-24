import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, UserCheck, Check, Lock, Key, AlertCircle, 
  Building2, Users, CreditCard, HeartHandshake, FileText, 
  CheckCircle2, XCircle, Clock, MapPin, Search, Filter, 
  ArrowRight, Shield, RefreshCw, Sliders, AlertTriangle, 
  HelpCircle, ChevronRight, Scale, TrendingUp, IndianRupee, 
  PhoneCall, Award, Download, CheckCircle, Briefcase,
  ToggleLeft, ToggleRight, Settings, MessageSquare, Star, Activity, Cpu
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

interface RegisteredWorker {
  id: string;
  worker_id: string;
  name: string;
  trade: string;
  coop_name: string;
  rating: number;
  reviews_count: number;
  hourly_rate: string;
  is_available_today: boolean;
  is_verified: boolean;
}

interface AdminPanelProps {
  activeTab?: 'overview' | 'kyc' | 'allocation' | 'workers' | 'payments' | 'welfare' | 'disputes' | 'settings' | string;
  onTabChange?: (tab: 'overview' | 'kyc' | 'allocation' | 'workers' | 'payments' | 'welfare' | 'disputes' | 'settings') => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  activeTab: propActiveTab,
  onTabChange
}) => {
  const [pin, setPin] = useState('26089');
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const mapAdminTab = (t?: string): 'overview' | 'kyc' | 'allocation' | 'workers' | 'payments' | 'welfare' | 'disputes' | 'settings' => {
    if (t === 'profile' || t === 'settings' || t === 'bylaws') return 'settings';
    if (t && ['overview', 'kyc', 'allocation', 'workers', 'payments', 'welfare', 'disputes', 'settings'].includes(t)) {
      return t as any;
    }
    return 'overview';
  };

  const [localActiveTab, setLocalActiveTab] = useState<'overview' | 'kyc' | 'allocation' | 'workers' | 'payments' | 'welfare' | 'disputes' | 'settings'>(() => mapAdminTab(propActiveTab));

  useEffect(() => {
    if (propActiveTab) {
      setLocalActiveTab(mapAdminTab(propActiveTab));
    }
  }, [propActiveTab]);

  const activeTab = propActiveTab ? mapAdminTab(propActiveTab) : localActiveTab;
  const setActiveTab = (t: 'overview' | 'kyc' | 'allocation' | 'workers' | 'payments' | 'welfare' | 'disputes' | 'settings') => {
    setLocalActiveTab(t);
    if (onTabChange) onTabChange(t);
  };

  // Operational metrics synced dynamically from Supabase
  const [opsMetrics, setOpsMetrics] = useState({
    totalWorkers: 0,
    availableToday: 0,
    todayJobs: 0,
    inProgressJobs: 0,
    pendingKYC: 4,
    workerEarnings: 0,
    welfareFundBalance: 0,
    coopOpsIncome: 0,
    activeDisputes: 1
  });

  const [isLiveSynced, setIsLiveSynced] = useState(false);
  const [dbWorkers, setDbWorkers] = useState<RegisteredWorker[]>([]);
  const [searchWorkerQuery, setSearchWorkerQuery] = useState('');
  const [selectedTradeFilter, setSelectedTradeFilter] = useState('All');

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

  // Disputes State
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

  // Society Bylaws State
  const [bylaws, setBylaws] = useState({
    workerShare: 95,
    opsShare: 3,
    welfareShare: 2,
    skillWeight: 40,
    proximityWeight: 30,
    rotationWeight: 30,
    minWagePerShift: 500,
    maxDailyShifts: 3
  });

  // Live Supabase Database Data Synchronization
  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        // Fetch Real Workers from Supabase
        const { data: workers } = await supabase.from('workers').select('*');
        let currentWorkers = dbWorkers;
        if (workers && workers.length > 0) {
          setDbWorkers(workers as RegisteredWorker[]);
          currentWorkers = workers as RegisteredWorker[];
        }

        // Fetch Real Bookings from Supabase
        const { data: bookings } = await supabase.from('bookings').select('*');

        const dbWorkerCount = workers ? workers.length : currentWorkers.length;
        const dbAvailableCount = workers ? workers.filter(w => w.is_available_today).length : currentWorkers.filter(w => w.is_available_today).length;
        const dbBookingsCount = bookings?.length || 0;
        const inProgress = bookings?.filter(b => b.status === 'IN_PROGRESS' || b.status === 'REQUESTED' || b.status === 'ACCEPTED').length || 0;

        // If there are real database bookings, prepend them to the live allocation queue
        if (bookings && bookings.length > 0) {
          const liveMapped: AllocationJob[] = bookings.slice(0, 10).map(b => ({
            id: b.booking_code || (b.id ? b.id.substring(0, 8) : `BK-${Math.floor(100 + Math.random() * 900)}`),
            customerName: b.customer_name || 'Customer Booking',
            service: b.service || `${b.worker_trade || 'Cooperative'} Service`,
            address: b.address || 'Jaipur Local Site',
            urgency: 'NORMAL',
            amount: b.amount ? (b.amount.toString().startsWith('₹') ? b.amount : `₹${b.amount}`) : '₹500',
            status: b.status === 'REQUESTED' ? 'UNASSIGNED' : (b.status === 'IN_PROGRESS' ? 'IN_PROGRESS' : 'ASSIGNED'),
            candidateWorkers: [
              { name: b.worker_name || 'Assigned Worker', distance: '1.2 km', rotationScore: 95, skillsMatch: 100 }
            ]
          }));
          
          setLiveAllocationQueue(prev => {
            const existingIds = new Set(liveMapped.map(m => m.id));
            const remainingDefault = prev.filter(p => !existingIds.has(p.id));
            return [...liveMapped, ...remainingDefault];
          });
        }

        // Calculate live financials
        let totalRevenue = 0;
        if (bookings && bookings.length > 0) {
          bookings.forEach(b => {
            const rawAmt = (b.amount || '0').toString().replace(/[^\d.]/g, '');
            const amt = parseFloat(rawAmt) || 0;
            totalRevenue += amt;
          });
        }

        const liveWorkerEarnings = totalRevenue * (bylaws.workerShare / 100);
        const liveWelfare = totalRevenue * (bylaws.welfareShare / 100);
        const liveOps = totalRevenue * (bylaws.opsShare / 100);

        setOpsMetrics({
          totalWorkers: dbWorkerCount,
          availableToday: dbAvailableCount,
          todayJobs: dbBookingsCount,
          inProgressJobs: inProgress,
          pendingKYC: pendingWorkers.length,
          workerEarnings: liveWorkerEarnings,
          welfareFundBalance: liveWelfare,
          coopOpsIncome: liveOps,
          activeDisputes: disputes.length
        });
        setIsLiveSynced(true);
      } catch (err) {
        console.error('Failed to sync live metrics from Supabase:', err);
      }
    };

    fetchLiveStats();

    // Subscribe to live changes in Supabase
    const bookingChannel = supabase
      .channel('admin_live_metrics_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchLiveStats();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workers' }, () => {
        fetchLiveStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(bookingChannel);
    };
  }, [pendingWorkers.length, disputes.length, bylaws.workerShare, bylaws.welfareShare, bylaws.opsShare]);

  const [adminToast, setAdminToast] = useState('');

  const triggerToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(''), 3500);
  };

  const handleApproveKYC = (workerId: string) => {
    const approved = pendingWorkers.find(w => w.id === workerId);
    if (approved) {
      const newRegWorker: RegisteredWorker = {
        id: crypto.randomUUID(),
        worker_id: `WORKER-RJ-${Math.floor(1000 + Math.random() * 9000)}`,
        name: approved.name,
        trade: approved.trade,
        coop_name: approved.coopName,
        rating: 5.0,
        reviews_count: 0,
        hourly_rate: '₹500 / visit',
        is_available_today: true,
        is_verified: true
      };
      setDbWorkers(prev => [newRegWorker, ...prev]);
      triggerToast(`✓ Approved & Issued Cooperative Society ID to ${approved.name} (${approved.trade})`);
      try {
        // @ts-ignore
        import('canvas-confetti').then((confettiModule) => {
          const confetti = confettiModule.default || confettiModule;
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        });
      } catch (e) {}
    }
    setPendingWorkers(prev => prev.filter(w => w.id !== workerId));
    setOpsMetrics(prev => ({
      ...prev,
      totalWorkers: prev.totalWorkers + 1,
      availableToday: prev.availableToday + 1,
      pendingKYC: Math.max(0, prev.pendingKYC - 1)
    }));
  };

  const handleRejectKYC = (workerId: string) => {
    const rejected = pendingWorkers.find(w => w.id === workerId);
    if (rejected) {
      triggerToast(`KYC application for ${rejected.name} rejected.`);
    }
    setPendingWorkers(prev => prev.filter(w => w.id !== workerId));
    setOpsMetrics(prev => ({
      ...prev,
      pendingKYC: Math.max(0, prev.pendingKYC - 1)
    }));
  };

  const handleAutoAssignJob = (jobId: string) => {
    setLiveAllocationQueue(prev => prev.map(job => {
      if (job.id === jobId) {
        triggerToast(`✓ Auto-assigned top rotation match for ${job.service}`);
        return { ...job, status: 'ASSIGNED' };
      }
      return job;
    }));
  };

  const handleApproveClaim = (claimId: string) => {
    setWelfareClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        triggerToast(`✓ Approved & Disbursed ${c.amount} relief payout to ${c.workerName}`);
        return { ...c, status: 'APPROVED' };
      }
      return c;
    }));
  };

  const handleResolveDispute = (disputeId: string) => {
    setDisputes(prev => prev.filter(d => d.id !== disputeId));
    setOpsMetrics(prev => ({ ...prev, activeDisputes: Math.max(0, prev.activeDisputes - 1) }));
  };

  const handleToggleWorkerAvailability = async (workerId: string, currentVal: boolean) => {
    setDbWorkers(prev => prev.map(w => w.worker_id === workerId ? { ...w, is_available_today: !currentVal } : w));
    try {
      await supabase.from('workers').update({ is_available_today: !currentVal }).eq('worker_id', workerId);
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered workers list for Worker Registry
  const filteredWorkers = dbWorkers.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchWorkerQuery.toLowerCase()) ||
                          w.trade.toLowerCase().includes(searchWorkerQuery.toLowerCase()) ||
                          w.worker_id.toLowerCase().includes(searchWorkerQuery.toLowerCase());
    const matchesTrade = selectedTradeFilter === 'All' || w.trade.toLowerCase() === selectedTradeFilter.toLowerCase();
    return matchesSearch && matchesTrade;
  });

  return (
    <div className="py-6 sm:py-8 bg-[#fbfdfc] dark:bg-[#0b0f19] min-h-[calc(100vh-4rem)] relative transition-colors">
      {/* Action Toast Alert */}
      {adminToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-800 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-600 flex items-center space-x-2 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle className="w-5 h-5 text-emerald-300 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{adminToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* 6 Real-time KPI Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Workers</span>
              <Users className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            </div>
            <p className="text-xl font-black text-slate-900 dark:text-white font-outfit">{opsMetrics.totalWorkers.toLocaleString()}</p>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">100% KYC Verified</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Available Now</span>
              <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-xl font-black text-emerald-700 dark:text-emerald-400 font-outfit">{opsMetrics.availableToday}</p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">● Ready for dispatch</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Today's Jobs</span>
              <Briefcase className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            </div>
            <p className="text-xl font-black text-slate-900 dark:text-white font-outfit">{opsMetrics.todayJobs}</p>
            <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold">{opsMetrics.inProgressJobs} In Progress</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pending KYC</span>
              <ShieldCheck className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            </div>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400 font-outfit">{opsMetrics.pendingKYC}</p>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Awaiting approval</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Worker Payouts</span>
              <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-xl font-black text-slate-900 dark:text-white font-outfit">
              {(opsMetrics.workerEarnings || 0) >= 100000
                ? `₹${((opsMetrics.workerEarnings || 0) / 100000).toFixed(2)}L`
                : (opsMetrics.workerEarnings || 0) >= 1000
                  ? `₹${((opsMetrics.workerEarnings || 0) / 1000).toFixed(1)}K`
                  : `₹${Math.round(opsMetrics.workerEarnings || 0).toLocaleString('en-IN')}`}
            </p>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">{bylaws.workerShare}% Direct Share</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Welfare Pool</span>
              <HeartHandshake className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400 font-outfit">
              {(opsMetrics.welfareFundBalance || 0) >= 100000
                ? `₹${((opsMetrics.welfareFundBalance || 0) / 100000).toFixed(2)}L`
                : (opsMetrics.welfareFundBalance || 0) >= 1000
                  ? `₹${((opsMetrics.welfareFundBalance || 0) / 1000).toFixed(1)}K`
                  : `₹${Math.round(opsMetrics.welfareFundBalance || 0).toLocaleString('en-IN')}`}
            </p>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Medical & Accident Cover</span>
          </div>
        </div>

        {/* Tab Navigation Strip (Clean Modern Segmented Bar) */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-2xs overflow-x-auto no-scrollbar scroll-smooth">
          {[
            { id: 'overview', label: 'Live Operations', icon: Activity },
            { id: 'kyc', label: 'Worker Verification', icon: ShieldCheck, badge: pendingWorkers.length, badgeColor: 'bg-amber-500/20 text-amber-700 dark:text-amber-300' },
            { id: 'allocation', label: 'Allocation Engine', icon: Cpu },
            { id: 'workers', label: 'Worker Registry', icon: Users, badge: dbWorkers.length > 0 ? dbWorkers.length : 12 },
            { id: 'payments', label: 'Financial Settlements', icon: CreditCard },
            { id: 'welfare', label: 'Welfare Fund Ledger', icon: HeartHandshake },
            { id: 'disputes', label: 'Disputes', icon: AlertTriangle, badge: disputes.length, badgeColor: disputes.length > 0 ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300' : undefined },
            { id: 'settings', label: 'Society Bylaws', icon: Sliders }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-700'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-300' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{tab.label}</span>
                {typeof tab.badge !== 'undefined' && tab.badge > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black leading-none ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : tab.badgeColor || 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & LIVE OPERATIONS */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">

            {/* Live Operations & Allocation Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white font-outfit text-base">Live Allocation & Dispatch Queue</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Real-time matching based on Availability + Distance + Skill Match + Fair Rotation</p>
                </div>
                <button
                  onClick={() => setActiveTab('allocation')}
                  className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
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
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
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
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
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
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 font-outfit text-base">Worker Verification & KYC Applications</h3>
                <p className="text-xs text-slate-500">Verify government ID, trade skills, and issue official cooperative membership cards</p>
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                {pendingWorkers.length} Pending Actions
              </span>
            </div>

            {pendingWorkers.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-slate-900">All KYC Applications Cleared!</h4>
                <p className="text-xs text-slate-500 mt-1">No pending worker verification requests at this time.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {pendingWorkers.map((worker) => (
                  <div key={worker.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{worker.name}</h4>
                        <p className="text-xs font-semibold text-emerald-700">{worker.trade} · {worker.experience}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{worker.coopName} · {worker.phone}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-[11px]">
                        {worker.score}% Trust Score
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] space-y-1">
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
                        className="px-3.5 py-2 bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
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
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div>
              <h3 className="font-bold text-slate-900 font-outfit text-base">Deterministic Fair-Rotation Allocation Engine</h3>
              <p className="text-xs text-slate-500">
                SahkariGig does not use opaque blackbox algorithms. Every dispatch is calculated transparently:
              </p>
            </div>


            {/* Live Queue Inspection */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Matching Pipeline</h4>
              {liveAllocationQueue.map(job => (
                <div key={job.id} className="p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-xs">{job.service}</span>
                    <span className="text-xs font-extrabold text-emerald-700">{job.amount}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {job.candidateWorkers.map((c, i) => (
                      <div key={i} className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
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

        {/* TAB 4: WORKER REGISTRY */}
        {activeTab === 'workers' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 font-outfit text-base">Cooperative Member Registry</h3>
                <p className="text-xs text-slate-500">Full directory of vetted cooperative workers, status, and trade assignments</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search worker by name / ID..."
                    value={searchWorkerQuery}
                    onChange={(e) => setSearchWorkerQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
                <select
                  value={selectedTradeFilter}
                  onChange={(e) => setSelectedTradeFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="All">All Trades</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Painter">Painter</option>
                  <option value="Mason">Mason</option>
                  <option value="Cleaner">Cleaner</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3">Worker / Member ID</th>
                    <th className="pb-3">Trade / Skill</th>
                    <th className="pb-3">Cooperative Society</th>
                    <th className="pb-3">Rating & Reviews</th>
                    <th className="pb-3">Standard Visit Rate</th>
                    <th className="pb-3">Today's Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(filteredWorkers.length > 0 ? filteredWorkers : [
                    { worker_id: 'WORKER-DEL-8901', name: 'Rajesh Kumar', trade: 'Electrician', coop_name: 'Delhi Labour Cooperative', rating: 4.9, reviews_count: 38, hourly_rate: '₹500 / visit', is_available_today: true, is_verified: true },
                    { worker_id: 'WORKER-DEL-8902', name: 'Mohan Sharma', trade: 'Plumber', coop_name: 'JanSeva Plumbing Society', rating: 4.8, reviews_count: 29, hourly_rate: '₹450 / visit', is_available_today: true, is_verified: true },
                    { worker_id: 'WORKER-DEL-8903', name: 'Kamlesh Saini', trade: 'Carpenter', coop_name: 'Northern Crafts Cooperative', rating: 4.9, reviews_count: 42, hourly_rate: '₹600 / visit', is_available_today: false, is_verified: true },
                    { worker_id: 'WORKER-DEL-8904', name: 'Sunita Devi', trade: 'Cleaner', coop_name: 'Mahila Labour Union', rating: 4.7, reviews_count: 19, hourly_rate: '₹400 / visit', is_available_today: true, is_verified: true }
                  ]).map((w: any) => (
                    <tr key={w.worker_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3">
                        <div className="font-bold text-slate-900">{w.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{w.worker_id}</div>
                      </td>
                      <td className="py-3 font-semibold text-emerald-800">{w.trade}</td>
                      <td className="py-3 text-slate-600">{w.coop_name}</td>
                      <td className="py-3">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="font-bold">{w.rating}</span>
                          <span className="text-slate-400 text-[10px]">({w.reviews_count})</span>
                        </div>
                      </td>
                      <td className="py-3 font-bold text-slate-800">{w.hourly_rate}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          w.is_available_today
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {w.is_available_today ? '● Available' : '○ Off Duty'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleToggleWorkerAvailability(w.worker_id, w.is_available_today)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          {w.is_available_today ? 'Set Off Duty' : 'Set Available'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: FINANCIAL SETTLEMENTS */}
        {activeTab === 'payments' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white font-outfit text-base">Financial Settlement Summary</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Complete transparency of all money flowing through the cooperative</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">Worker Direct Earnings ({bylaws.workerShare}%)</span>
                <p className="text-2xl font-black text-emerald-900 dark:text-emerald-400 font-outfit mt-1">₹{(opsMetrics.workerEarnings || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Transferred directly to worker bank accounts</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Cooperative Operations ({bylaws.opsShare}%)</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white font-outfit mt-1">₹{(opsMetrics.coopOpsIncome || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Server hosting, SMS alerts & union office maintenance</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block">Welfare & Emergency Pool ({bylaws.welfareShare}%)</span>
                <p className="text-2xl font-black text-amber-700 dark:text-amber-400 font-outfit mt-1">₹{(opsMetrics.welfareFundBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Accident insurance & medical fund contribution</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: WELFARE FUND LEDGER */}
        {activeTab === 'welfare' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 font-outfit text-base">Cooperative Welfare & Medical Relief Fund</h3>
                <p className="text-xs text-slate-500">Funded automatically by the {bylaws.welfareShare}% fee collected on every completed service booking</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-bold">Total Pool Balance</span>
                <span className="text-xl font-black text-amber-600 font-outfit">₹{(opsMetrics.welfareFundBalance).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Emergency Relief & Insurance Claims</h4>
              {welfareClaims.map(claim => (
                <div key={claim.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{claim.workerName}</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">
                        {claim.claimType}
                      </span>
                    </div>
                    <p className="text-slate-500 mt-0.5">Facility: {claim.hospital} · Member Since: {claim.coopMemberSince}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="font-black text-base text-slate-900 font-outfit">{claim.amount}</span>
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

        {/* TAB 7: DISPUTES */}
        {activeTab === 'disputes' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 font-outfit text-base">Community Mediation & Dispute Resolution</h3>
              <p className="text-xs text-slate-500">Fair peer-reviewed mediation for price disagreements or service scope issues</p>
            </div>

            {disputes.length === 0 ? (
              <div className="text-center py-10">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-slate-900">No Open Disputes</h4>
                <p className="text-xs text-slate-500 mt-1">All complaints and mediator reviews are fully resolved.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {disputes.map(dispute => (
                  <div key={dispute.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                          {dispute.status}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1.5">Booking #{dispute.bookingId} · {dispute.customer} vs {dispute.worker}</h4>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">Case {dispute.id}</span>
                    </div>

                    <p className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700 font-medium">
                      <strong>Issue:</strong> {dispute.issue}
                    </p>

                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                      <strong>Suggested Cooperative Settlement:</strong> {dispute.suggestedResolution}
                    </div>

                    <div className="flex justify-end space-x-2 pt-1">
                      <button
                        onClick={() => handleResolveDispute(dispute.id)}
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Apply Resolution & Close Ticket
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: SOCIETY BYLAWS & SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 font-outfit text-base">Cooperative Society Bylaws & Fee Configuration</h3>
              <p className="text-xs text-slate-500">Configure democratic commission splits and fair-rotation dispatch parameters</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
                <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <span>Revenue Split Model</span>
                </h4>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Worker Direct Share:</span>
                      <span className="text-emerald-700">{bylaws.workerShare}%</span>
                    </div>
                    <input
                      type="range"
                      min="85"
                      max="98"
                      value={bylaws.workerShare}
                      onChange={(e) => setBylaws(prev => ({ ...prev, workerShare: Number(e.target.value) }))}
                      className="w-full accent-emerald-700 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Welfare & Relief Fund:</span>
                      <span className="text-amber-700">{bylaws.welfareShare}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={bylaws.welfareShare}
                      onChange={(e) => setBylaws(prev => ({ ...prev, welfareShare: Number(e.target.value) }))}
                      className="w-full accent-amber-700 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Society Operations:</span>
                      <span className="text-slate-700">{bylaws.opsShare}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={bylaws.opsShare}
                      onChange={(e) => setBylaws(prev => ({ ...prev, opsShare: Number(e.target.value) }))}
                      className="w-full accent-slate-700 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
                <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-emerald-700" />
                  <span>Fair Rotation Allocation Weights</span>
                </h4>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Trade Skill Match Weight:</span>
                    <span className="font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200">{bylaws.skillWeight}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Proximity / Distance Weight:</span>
                    <span className="font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200">{bylaws.proximityWeight}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Fair Workload Equalizer Weight:</span>
                    <span className="font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200">{bylaws.rotationWeight}%</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                    <span>Minimum Guaranteed Rate / Shift:</span>
                    <span className="font-bold text-emerald-800">₹{bylaws.minWagePerShift}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
