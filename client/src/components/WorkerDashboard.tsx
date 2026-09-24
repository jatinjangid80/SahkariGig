import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, QrCode, Check, X, Clock, MapPin, Calendar, IndianRupee, Award, Star, MessageSquare, User, Briefcase, DollarSign, Globe, Sliders, ShieldAlert, Camera, Paperclip, CheckCircle2, Navigation, ExternalLink, Sun, Moon, Laptop, Scale, Shield, HeartHandshake, FileText, PhoneCall, Vote, AlertCircle, Sparkles, Building2, HelpCircle, CheckCircle, Heart, ArrowUpRight, Send, AlertTriangle, Copy, Phone } from 'lucide-react';
import { supabase } from '../supabase';
import { useTheme } from '../utils/theme';
// @ts-ignore
import confetti from 'canvas-confetti';

interface WorkerDashboardProps {
  currentUser?: { name: string; role: string; id: string; email: string; avatarUrl?: string } | null;
  activeTab?: 'feed' | 'active' | 'earnings' | 'rights' | 'profile';
  onTabChange?: (tab: 'feed' | 'active' | 'earnings' | 'rights' | 'profile') => void;
  onProfileUpdate?: (updatedUser: { avatarUrl?: string; name?: string }) => void;
  onOpenWorkerIdCard?: (worker: any) => void;
  onOpenChat?: (booking: any) => void;
  refreshTrigger?: number;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({
  currentUser,
  activeTab,
  onTabChange,
  onProfileUpdate,
  onOpenWorkerIdCard,
  onOpenChat,
  refreshTrigger
}) => {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { theme, isDark, setTheme } = useTheme();
  const [isAvailableOnline, setIsAvailableOnline] = useState(true);
  const [localTab, setLocalTab] = useState<'feed' | 'active' | 'earnings' | 'rights' | 'profile'>('feed');
  
  const getMappedTab = (tab?: string): 'feed' | 'active' | 'earnings' | 'rights' | 'profile' => {
    if (tab === 'wallet') return 'earnings';
    if (tab === 'availability') return 'feed';
    if (tab === 'jobs') return 'active';
    if (tab && ['feed', 'active', 'earnings', 'rights', 'profile'].includes(tab)) return tab as any;
    return 'feed';
  };

  const currentTab = getMappedTab(activeTab || localTab);
  const setTab = onTabChange || setLocalTab;
  const [rightsLang, setRightsLang] = useState<'en' | 'hi'>('en');

  const [requests, setRequests] = useState<any[]>([]);
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [reliefModalOpen, setReliefModalOpen] = useState(false);
  const [reliefClaimSubmitted, setReliefClaimSubmitted] = useState(false);
  const [grievanceModalOpen, setGrievanceModalOpen] = useState(false);
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);
  const [callModalData, setCallModalData] = useState<{
    isOpen: boolean;
    customerName: string;
    phone: string;
    service: string;
    address: string;
  } | null>(null);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [claimData, setClaimData] = useState({
    type: 'medical',
    amount: '5000',
    description: '',
    urgency: 'high'
  });
  const [grievanceData, setGrievanceData] = useState({
    category: 'Payment Dispute',
    customerName: '',
    jobId: '',
    details: ''
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);
  const [previewDocsData, setPreviewDocsData] = useState<Record<string, { url: string, type: string }>>({});

  // Dynamic Supabase Stats
  const [weeklyBalance, setWeeklyBalance] = useState(0);
  const [completedJobsCount, setCompletedJobsCount] = useState(0);
  const [payoutHistory, setPayoutHistory] = useState<any[]>([]);

  // Worker Profile States (aligned with Screenshot 1)
  const [profile, setProfile] = useState({
    fullName: currentUser?.name || '',
    phone: '',
    language: 'English',
    skill: 'Electrician',
    coop: 'Delhi Labour Cooperative Federation',
    location: '',
    radius: 15,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    timeWindow: '9:00 AM - 6:00 PM',
    verified: true,
    avatarUrl: currentUser?.avatarUrl || '',
    uploadedDocs: {
      aadhaar: '',
      membership: '',
      skill: '',
      background: ''
    },
    bankDetails: {
      accountName: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      upiId: ''
    }
  });

  useEffect(() => {
    if (currentUser?.id) {
      const fetchProfile = async () => {
        // First try local storage
        const savedProfile = localStorage.getItem(`worker_profile_${currentUser.id}`);
        if (savedProfile) {
          try {
            const parsed = JSON.parse(savedProfile);
            if (!parsed.uploadedDocs) parsed.uploadedDocs = { aadhaar: '', membership: '', skill: '', background: '' };
            if (!parsed.bankDetails) parsed.bankDetails = { accountName: '', bankName: '', accountNumber: '', ifscCode: '', upiId: '' };
            setProfile(parsed);
          } catch (e) {
            console.error("Failed to parse saved profile:", e);
          }
        }

        // Then sync from Supabase
        try {
          const { data, error } = await supabase
            .from('workers')
            .select('*')
            .or(`user_id.eq.${currentUser.id},id.eq.${currentUser.id},name.ilike.%${currentUser.name}%`)
            .limit(1)
            .maybeSingle();

          if (data && !error) {
            if (typeof data.is_available_today === 'boolean') {
              setIsAvailableOnline(data.is_available_today);
            }
            const loadedProfile = {
              fullName: data.name || currentUser.name || '',
              skill: data.trade || 'Electrician',
              coop: data.coop_name || 'Delhi Labour Cooperative Federation',
              location: data.location || '',
              phone: data.phone || '',
              experience: data.experience || '1-3 years',
              language: data.language || 'English',
              avatarUrl: data.avatar || currentUser.avatarUrl || '',
              verified: data.is_verified ?? true,
              radius: 15,
              availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
              timeWindow: '9:00 AM - 6:00 PM',
              uploadedDocs: { aadhaar: '', membership: '', skill: '', background: '' },
              bankDetails: { accountName: '', bankName: '', accountNumber: '', ifscCode: '', upiId: '' }
            };
            setProfile(loadedProfile);
          } else if (!savedProfile) {
            const defaultProfile = {
              fullName: currentUser.name || 'Worker Member',
              skill: 'Cleaner',
              coop: 'Haryana Karigar Association',
              location: 'Jaipur, Rajasthan',
              phone: '+91 98765 43210',
              experience: '2-4 years',
              language: 'English',
              avatarUrl: currentUser.avatarUrl || '',
              verified: true,
              radius: 15,
              availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
              timeWindow: '9:00 AM - 6:00 PM',
              uploadedDocs: { aadhaar: 'aadhaar_verified.pdf', membership: 'coop_card.pdf', skill: 'skill_cert.pdf', background: 'pcc_cert.pdf' },
              bankDetails: { accountName: currentUser.name || 'Tarun Bhaiya', bankName: 'State Bank of India', accountNumber: '38924719283', ifscCode: 'SBIN0001234', upiId: `${(currentUser.name || 'tarun').toLowerCase().replace(/\s+/g, '')}@upi` }
            };
            setProfile(defaultProfile);
            localStorage.setItem(`worker_profile_${currentUser.id}`, JSON.stringify(defaultProfile));
          }
        } catch (err) {
          console.error("Failed to load worker profile from Supabase:", err);
        }
      };

      fetchProfile();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        if (currentUser?.id) {
          // Fetch internal worker ID by user_id or direct ID
          let internalWorkerId: string | null = null;
          let displayWorkerId = `WORKER-DEL-${currentUser.id.slice(0, 4).toUpperCase()}`;
          const { data: workerData } = await supabase
            .from('workers')
            .select('id, worker_id')
            .or(`user_id.eq.${currentUser.id},id.eq.${currentUser.id}`)
            .limit(1)
            .maybeSingle();
          
          if (workerData?.id) {
            internalWorkerId = workerData.id;
            if (workerData.worker_id) {
              displayWorkerId = workerData.worker_id;
            }
          } else {
            internalWorkerId = currentUser.id;
          }

          let loadedAssignments: any[] = [];
          if (internalWorkerId) {
            const { data: pwData } = await supabase
              .from('project_workers')
              .select(`
                id,
                task,
                status,
                assigned_at,
                project_id,
                projects (
                  name,
                  customer_name,
                  location,
                  start_date
                )
              `)
              .or(`worker_id.eq.${internalWorkerId},worker_id.eq.${currentUser.id},worker_id.eq.${displayWorkerId}`)
              .order('assigned_at', { ascending: false });

            if (pwData) {
              loadedAssignments = pwData.map((pw: any) => ({
                id: pw.id,
                isProjectTask: true,
                service: pw.projects?.name || 'Site Assignment',
                customerName: pw.projects?.customer_name || 'Project Client',
                supervisorName: 'Er. Vikramaditya (Supervisor)',
                address: pw.projects?.location || 'Project Site',
                task: pw.task || 'Assigned Site Work',
                startDate: pw.projects?.start_date || 'Today',
                status: (pw.status === 'PENDING' || !pw.status) ? 'REQUESTED' : pw.status,
                amount: '₹800/day',
                paymentStatus: pw.status === 'COMPLETED' ? 'PAID' : 'PENDING'
              }));
            }
          }

          let loadedBookings: any[] = [];
          const { data: bookData } = await supabase
            .from('bookings')
            .select('*')
            .or(`worker_id.eq.${internalWorkerId},worker_id.eq.${currentUser.id},worker_id.eq.${displayWorkerId}`)
            .order('created_at', { ascending: false });

          if (bookData) {
            loadedBookings = bookData.map((b: any) => ({
              id: b.id,
              isProjectTask: false,
              service: b.service_name || b.service || 'Direct Booking',
              customerId: b.customer_id,
              customerName: b.customer_name || 'Verified Customer',
              customerPhone: b.customer_phone || '+91 98765 43210',
              address: b.customer_address || b.address || 'Jaipur, Rajasthan',
              task: b.service_name || b.notes || 'Direct Service Call',
              startDate: b.scheduled_date || b.booking_date || b.date_time || 'Today',
              status: b.status || 'REQUESTED',
              amount: b.amount ? `₹${b.amount}` : '₹500',
              paymentStatus: b.payment_status || 'PENDING'
            }));
          }

          setRequests([...loadedAssignments, ...loadedBookings]);
        }
      } catch (err) {
        console.error("Worker booking fetch error:", err);
        setRequests([]);
      }
    };

    fetchRequests();

    // Set up realtime subscription across both assignments and direct bookings
    if (currentUser?.id) {
      const channel = supabase
        .channel(`worker_live_jobs_${currentUser.id}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'project_workers' },
          () => {
            fetchRequests();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'bookings' },
          () => {
            fetchRequests();
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
  }, [currentUser, refreshTrigger]);

  // Recalculate stats whenever requests change
  useEffect(() => {
    const completed = requests.filter(r => r.status === 'COMPLETED' || r.paymentStatus === 'PAID');
    setCompletedJobsCount(completed.length);

    const totalBalance = completed.reduce((sum, req) => {
      const match = String(req.amount).match(/(\d+(\.\d+)?)/);
      return sum + (match ? parseFloat(match[0]) : 0);
    }, 0);
    setWeeklyBalance(totalBalance);

    setPayoutHistory(completed.map(c => {
      const match = String(c.amount).match(/(\d+(\.\d+)?)/);
      const amountVal = match ? match[0] : '0';
      let displayDate = c.dateTime ? c.dateTime.split(',')[0] : 'Recently';
      displayDate = displayDate.replace('Tomorrow', 'Yesterday').replace('Day After Tomorrow', '2 Days Ago');

      return {
        jobId: c.id.slice(0, 8).toUpperCase(),
        service: c.service,
        customer: c.customerName,
        date: displayDate,
        amount: `₹${amountVal}`
      };
    }));
  }, [requests]);

  const handleAccept = async (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'IN_PROGRESS' } : r));
    setLocalTab('active');
    if (onTabChange) {
      onTabChange('active');
    }
    try {
      await supabase.from('project_workers').update({ status: 'IN_PROGRESS' }).eq('id', id);
      await supabase.from('bookings').update({ status: 'ACCEPTED' }).eq('id', id);
    } catch (e) {
      console.error('Failed to accept job:', e);
    }
  };

  const handleMarkCompleted = async (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'COMPLETED' } : r));
    try {
      await supabase.from('project_workers').update({ status: 'COMPLETED' }).eq('id', id);
      await supabase.from('bookings').update({ status: 'COMPLETED' }).eq('id', id);
    } catch (e) {
      console.error('Failed to complete job:', e);
    }
  };

  const handleReject = async (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
    try {
      await supabase.from('project_workers').delete().eq('id', id);
      await supabase.from('bookings').update({ status: 'CANCELLED' }).eq('id', id);
    } catch (e) {
      console.error('Failed to reject job:', e);
    }
  };

  const handleTriggerPayout = async () => {
    setPayoutLoading(true);
    setPayoutSuccess(false);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/payments/payout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({
          workerId: currentUser?.id || 'demo-worker',
          amount: 4500 // Extract from dashboard context
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process payout.');
      }

      if (data.data?.razorpayUrl) {
        window.open(data.data.razorpayUrl, '_blank');
      }

      setPayoutSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#3b82f6', '#f59e0b']
      });
      setTimeout(() => setPayoutSuccess(false), 5000);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'An error occurred during transfer.');
    } finally {
      setPayoutLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    if (currentUser?.id) {
      localStorage.setItem(`worker_profile_${currentUser.id}`, JSON.stringify(profile));
      try {
        const workerId = `WORKER-DEL-${currentUser.id.slice(0, 4).toUpperCase()}`;
        const { error } = await supabase.from('workers').upsert({
          worker_id: workerId,
          user_id: currentUser.id,
          name: profile.fullName,
          trade: profile.skill,
          coop_name: profile.coop,
          rating: 4.80,
          reviews_count: 12,
          hourly_rate: profile.skill === 'Electrician' ? '₹400–₹700 / visit' : (profile.skill === 'Plumber' ? '₹350–₹650 / visit' : '₹500–₹900 / visit'),
          distance_km: 2.00,
          is_available_today: true,
          is_top_rated: true,
          is_verified: true,
          avatar: profile.avatarUrl || null
        }, { onConflict: 'worker_id' });

        if (error) {
          console.error("Failed to sync worker to Supabase:", error);
        }
      } catch (err) {
        console.error("Error upserting worker profile:", err);
      }
    }
    if (onProfileUpdate) {
      onProfileUpdate({ name: profile.fullName, avatarUrl: profile.avatarUrl });
    }
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleToggleOnlineStatus = async () => {
    const nextStatus = !isAvailableOnline;
    setIsAvailableOnline(nextStatus);

    if (currentUser) {
      try {
        const workerId = `WORKER-DEL-${currentUser.id.slice(0, 4).toUpperCase()}`;
        const { data: updatedRows, error } = await supabase
          .from('workers')
          .update({ is_available_today: nextStatus })
          .or(`user_id.eq.${currentUser.id},id.eq.${currentUser.id},worker_id.eq.${workerId},name.ilike.%${currentUser.name || profile.fullName}%`)
          .select();

        if (!error && (!updatedRows || updatedRows.length === 0)) {
          await supabase.from('workers').upsert({
            worker_id: workerId,
            user_id: currentUser.id,
            name: profile.fullName || currentUser.name || 'Verified Worker',
            trade: profile.skill || 'Electrician',
            coop_name: profile.coop || 'Delhi Labour Cooperative Federation',
            rating: 4.80,
            reviews_count: 12,
            hourly_rate: profile.skill === 'Electrician' ? '₹400–₹700 / visit' : (profile.skill === 'Plumber' ? '₹350–₹650 / visit' : '₹500–₹900 / visit'),
            distance_km: 2.00,
            is_available_today: nextStatus,
            is_top_rated: true,
            is_verified: true,
            avatar: profile.avatarUrl || currentUser.avatarUrl || null
          }, { onConflict: 'worker_id' });
        }
      } catch (err) {
        console.error("Error updating online status in Supabase:", err);
      }
    }
  };

  const toggleDay = (day: string) => {
    if (profile.availableDays.includes(day)) {
      setProfile(p => ({ ...p, availableDays: profile.availableDays.filter(d => d !== day) }));
    } else {
      setProfile(p => ({ ...p, availableDays: [...profile.availableDays, day] }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfile(prev => ({ ...prev, avatarUrl: base64String }));
        if (onProfileUpdate) {
          onProfileUpdate({ avatarUrl: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocUpload = (provider: 'aadhaar' | 'membership' | 'skill' | 'background', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewDocsData(prev => ({
        ...prev,
        [provider]: { url: fileUrl, type: file.type }
      }));

      setProfile(prev => {
        const updated = {
          ...prev,
          uploadedDocs: {
            ...prev.uploadedDocs,
            [provider]: file.name
          }
        };
        // Persist immediately if logged in
        if (currentUser?.id) {
          localStorage.setItem(`worker_profile_${currentUser.id}`, JSON.stringify(updated));
        }
        return updated;
      });
    }
  };

  return (
    <div className="py-6 bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Hidden File Input for Avatar */}
        <input
          ref={avatarInputRef}
          id="avatar-upload-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleAvatarChange(e);
            e.target.value = ''; // Allow re-uploading the same file
          }}
        />

        {/* Worker Info Card Header */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">

            {/* Avatar Image / Initials Uploader Circle */}
            <div
              className="relative group cursor-pointer shrink-0"
              onClick={() => avatarInputRef.current?.click()}
            >
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="Avatar"
                  className="w-14 h-14 rounded-2xl object-cover border border-emerald-500 shadow-md transition-all group-hover:brightness-90"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-extrabold text-xl shadow-md transition-all group-hover:brightness-90 font-outfit">
                  {profile.fullName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] text-white font-bold transition-all">
                <Camera className="w-3.5 h-3.5 mr-0.5" /> Change
              </div>
            </div>

            {(() => {
              const generatedWorkerId = currentUser?.id
                ? `WORKER-DEL-${currentUser.id.slice(0, 4).toUpperCase()}`
                : 'WORKER-DEL-8901';
              return (
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit leading-tight">
                      {profile.fullName}
                    </h1>
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                      Verified {profile.skill}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    {profile.coop} • ID: {generatedWorkerId}
                  </p>
                </div>
              );
            })()}
          </div>

          <div className="flex items-center space-x-2.5 self-start md:self-auto">
            {/* Live Availability Toggle Pill */}
            <button
              onClick={handleToggleOnlineStatus}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border cursor-pointer shadow-2xs ${
                isAvailableOnline
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
              }`}
              title="Toggle Live Availability on SahkariGig"
            >
              <span className={`w-2 h-2 rounded-full ${isAvailableOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>{isAvailableOnline ? 'Available (Online)' : 'Offline'}</span>
            </button>

            <button
              onClick={() => {
                if (onOpenWorkerIdCard) {
                  const generatedWorkerId = currentUser?.id
                    ? `WORKER-DEL-${currentUser.id.slice(0, 4).toUpperCase()}`
                    : 'WORKER-DEL-8901';
                  onOpenWorkerIdCard({
                    name: profile.fullName,
                    trade: profile.skill,
                    coopName: profile.coop,
                    workerId: generatedWorkerId,
                    rating: 4.8,
                    reviewsCount: 12,
                    hourlyRate: profile.skill === 'Electrician' ? '₹400–₹700 / visit' : (profile.skill === 'Plumber' ? '₹350–₹650 / visit' : '₹500–₹900 / visit'),
                    distanceKm: 2.0,
                    isAvailableToday: isAvailableOnline,
                    avatar: profile.avatarUrl || ''
                  });
                }
              }}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Digital ID Card</span>
            </button>
          </div>
        </div>

        {/* Tab Content Panels */}
        <div className="space-y-6">

          {/* TAB 1: JOB FEED */}
          {currentTab === 'feed' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Incoming Job Requests</h2>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">Live feed connected</span>
              </div>

              {requests.filter(r => r.status === 'REQUESTED').map(req => (
                <div key={req.id} className="bg-white rounded-3xl border border-emerald-200 shadow-md p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-60 pointer-events-none" />

                  <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-slate-900 font-outfit uppercase">{req.service}</h3>
                      </div>
                      
                      <div className="text-sm font-medium text-slate-600 space-y-1">
                        <p>Customer: <span className="font-bold text-slate-900">{req.customerName}</span></p>
                        <p>Location: <span className="font-bold text-slate-900">{req.address}</span></p>
                        <p>Cooperative Payout: <span className="font-bold text-emerald-700">{req.amount}</span> <span className="text-xs text-slate-500 font-normal">(95% Worker Guaranteed)</span></p>
                      </div>

                      <div className="pt-2">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Task</p>
                        <p className="text-sm font-semibold text-slate-900">{req.task}</p>
                      </div>

                      <div className="flex items-center gap-4 pt-2 text-sm text-slate-500 font-medium">
                        <span className="flex items-center">Start Date: <span className="font-bold text-slate-900 ml-1">{req.startDate}</span></span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0 self-end sm:self-start">
                      <button
                        onClick={() => handleAccept(req.id)}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center shadow-xs cursor-pointer"
                      >
                        Accept Assignment
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {requests.filter(r => r.status === 'REQUESTED').length === 0 && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-8 text-center py-12">
                  <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-600 font-bold text-sm font-outfit">Your Inbox is Clear</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    No incoming requests right now. Keep your app open to receive alerts from local cooperative customers.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACTIVE JOBS */}
          {currentTab === 'active' && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Scheduled & In-Progress Jobs</h2>

              {requests.filter(r => r.status === 'ACCEPTED' || r.status === 'IN_PROGRESS').map(req => (
                <div key={req.id} className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden p-6">

                  {/* Job Header */}
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1 block">Active Job</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 font-outfit uppercase">{req.service}</h3>
                      
                      <div className="text-sm font-medium text-slate-600 space-y-1">
                        <p>Customer: <span className="font-bold text-slate-900">{req.customerName}</span></p>
                        <p>Location: <span className="font-bold text-slate-900">{req.address}</span></p>
                        <p>Estimated Payout: <span className="font-bold text-emerald-700">{req.amount}</span></p>
                      </div>

                      <div className="pt-2">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Task</p>
                        <p className="text-sm font-semibold text-slate-900">{req.task}</p>
                      </div>

                      <div className="flex items-center gap-4 pt-2 text-sm text-slate-500 font-medium">
                        <span className="flex items-center">Start Date: <span className="font-bold text-slate-900 ml-1">{req.startDate}</span></span>
                      </div>
                      
                      <div className="flex items-center gap-4 pt-1 text-sm text-slate-500 font-medium">
                        <span className="flex items-center">Status: <span className="font-bold text-emerald-700 ml-1">{req.status}</span></span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0 self-end sm:self-start">
                      <button
                        onClick={() => onOpenChat && onOpenChat({
                          id: req.id,
                          bookingId: req.id,
                          customer_id: req.customerId || req.customer_id,
                          customerName: req.customerName,
                          worker_id: currentUser?.id,
                          workerName: currentUser?.name,
                          service: req.service
                        })}
                        className="px-5 py-2.5 bg-[#166534] hover:bg-[#14532D] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                        title="Chat directly with the Customer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat with Customer</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCopiedPhone(false);
                          setCallModalData({
                            isOpen: true,
                            customerName: req.customerName,
                            phone: req.customerPhone || '+91 98765 43210',
                            service: req.service,
                            address: req.address
                          });
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                        title="Call or view customer contact details"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Call Customer</span>
                      </button>
                    </div>
                  </div>

                  {/* Location & Safety Section */}
                  <div className="mt-6 space-y-4">
                    {/* Location Pin & Service Address (Direct Google Maps Navigation) */}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(req.address || 'New Delhi')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-100 hover:bg-emerald-50/80 rounded-2xl p-4 border border-slate-200/80 hover:border-emerald-300 flex items-center justify-between gap-4 transition-all group cursor-pointer shadow-2xs"
                      title="Open in Google Maps"
                    >
                      <div className="flex items-start space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 group-hover:border-emerald-300 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs transition-colors">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 leading-tight">
                            {req.address}
                          </p>
                          <p className="text-[10px] text-slate-500 group-hover:text-emerald-700 mt-0.5 flex items-center">
                            <span>Tap to open Google Maps navigation</span>
                            <ExternalLink className="w-2.5 h-2.5 ml-1" />
                          </p>
                        </div>
                      </div>

                      <div className="px-3 py-1.5 rounded-xl bg-emerald-700 group-hover:bg-emerald-800 text-white text-[11px] font-bold flex items-center space-x-1.5 shrink-0 shadow-xs transition-colors">
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Directions</span>
                      </div>
                    </a>

                    {/* Safety Verification QR Code Info */}
                    <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-start space-x-3">
                      <QrCode className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-emerald-900 leading-tight">Cooperative Safety Protocol</p>
                        <p className="text-[10px] text-emerald-700 mt-1 leading-relaxed">
                          When you arrive at the job site, present your Digital ID Card QR code to the customer. Once they scan it via their dashboard, your check-in will be logged and the escrow status will advance.
                        </p>
                        <button
                          onClick={() => handleMarkCompleted(req.id)}
                          className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-1"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark Job as Completed</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {requests.filter(r => r.status === 'ACCEPTED' || r.status === 'IN_PROGRESS').length === 0 && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-8 text-center py-12">
                  <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-600 font-bold text-sm font-outfit">No Active Jobs</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Accept job offers from your Job Feed tab to start coordinating with cooperative members.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EARNINGS */}
          {currentTab === 'earnings' && (
            <div className="space-y-6">

              {/* Earnings Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 text-center">
                  <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-2 text-emerald-600">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Balance</p>
                  <p className="text-2xl font-extrabold text-slate-900 font-outfit mt-1">₹{weeklyBalance.toLocaleString()}</p>
                  <p className="text-[10px] font-semibold text-emerald-600 mt-1">Based on completed jobs</p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 text-center">
                  <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-2 text-emerald-600">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Completed Jobs</p>
                  <p className="text-2xl font-extrabold text-slate-900 font-outfit mt-1">{completedJobsCount} Jobs</p>
                  <p className="text-[10px] font-semibold text-slate-500 mt-1">{profile.coop}</p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 text-center">
                  <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-2 text-amber-600">
                    <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  </div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Worker Rating</p>
                  <p className="text-2xl font-extrabold text-slate-900 font-outfit mt-1">4.9 / 5.0</p>
                  <p className="text-[10px] font-semibold text-amber-600 mt-1">Top-Rated Member Badge</p>
                </div>
              </div>

              {/* Payout Trigger buttons */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm font-outfit">Withdraw Earnings</h3>
                  <p className="text-xs text-slate-500 max-w-md">
                    CoopGig operates with **0% platform commissions**. 100% of your earnings go directly into your linked bank account.
                  </p>
                </div>
                <button
                  onClick={handleTriggerPayout}
                  disabled={payoutLoading}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
                >
                  {payoutLoading ? 'Processing Transfer...' : 'Withdraw to Bank'}
                </button>
              </div>

              {payoutSuccess && (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-2xl text-xs font-semibold text-center animate-pulse">
                  🎉 Transfer of ₹4,500 succeeded! Funds have been credited to your cooperative registry account.
                </div>
              )}

              {/* History Table */}
              <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-outfit">Completed Payout History</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold bg-slate-50/30">
                        <th className="p-4">Job ID</th>
                        <th className="p-4">Service</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      {payoutHistory.length > 0 ? payoutHistory.map((ph, idx) => (
                        <tr key={idx}>
                          <td className="p-4 font-mono text-[10px]">
                            {`BK-${(ph.jobId?.replace(/[^0-9a-fA-F]/g, '').substring(0, 4) || '001').toUpperCase()}`}
                          </td>
                          <td className="p-4 font-bold text-slate-900">{ph.service}</td>
                          <td className="p-4">{ph.customer}</td>
                          <td className="p-4">{ph.date}</td>
                          <td className="p-4 text-right text-emerald-700 font-bold">{String(ph.amount).startsWith('₹') ? ph.amount : `₹${ph.amount}`}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500">No completed jobs yet to generate payouts.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB: WORKER RIGHTS */}
          {currentTab === 'rights' && (
            <div className="space-y-6 animate-in fade-in duration-200">

              {/* Language Switcher Bar */}
              <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 text-xs font-bold font-outfit">
                  <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{rightsLang === 'hi' ? 'भाषा चुनें (Language):' : 'Select Language:'}</span>
                </div>
                
                {/* Segmented Switch */}
                <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setRightsLang('en')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      rightsLang === 'en'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    type="button"
                    onClick={() => setRightsLang('hi')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      rightsLang === 'hi'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    🇮🇳 हिन्दी (Hindi)
                  </button>
                </div>
              </div>

              {/* Hero Banner with Cooperative Shield */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-700/50">
                <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-0 right-1/4 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-2xl">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                      <Scale className="w-3.5 h-3.5 text-emerald-300" />
                      <span>{rightsLang === 'hi' ? 'सहकारी श्रमिक सुरक्षा अधिकार पत्र' : 'Cooperative Labour Protection Charter'}</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white tracking-tight">
                      {rightsLang === 'hi' ? 'आपके गारंटीकृत श्रमिक अधिकार और सुरक्षा' : 'Your Guaranteed Worker Rights & Protections'}
                    </h2>

                    <p className="text-sm text-emerald-100/90 leading-relaxed font-normal">
                      {rightsLang === 'hi' ? (
                        <>
                          <span className="font-bold text-white">सहकारी गिग (SahkariGig)</span> में आप एक सदस्य-मालिक हैं, कोई अस्थायी ठेका मजदूर नहीं। आपका हर काम सहकारी नियमों द्वारा सुरक्षित है: <span className="font-semibold text-emerald-300">0% प्लेटफ़ॉर्म कमीशन</span>, <span className="font-semibold text-emerald-300">तय न्यूनतम आधार वेतन</span>, <span className="font-semibold text-emerald-300">आपातकालीन चिकित्सा सहायता</span>, और <span className="font-semibold text-emerald-300">लोकतांत्रिक यूनियन मतदान अधिकार</span>।
                        </>
                      ) : (
                        <>
                          At <span className="font-bold text-white">SahkariGig</span>, you are a member-owner, not a disposable contractor. Every gig you accept is protected by cooperative statute: <span className="font-semibold text-emerald-300">0% platform commission</span>, <span className="font-semibold text-emerald-300">guaranteed minimum floor rates</span>, <span className="font-semibold text-emerald-300">emergency medical coverage</span>, and <span className="font-semibold text-emerald-300">democratic union voting rights</span>.
                        </>
                      )}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/10 text-emerald-200 text-[11px] font-bold border border-white/10">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" /> 
                        {rightsLang === 'hi' ? '100% भुगतान स्वामित्व' : '100% Payout Sovereignty'}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/10 text-emerald-200 text-[11px] font-bold border border-white/10">
                        <Vote className="w-3.5 h-3.5 mr-1 text-amber-400" /> 
                        {rightsLang === 'hi' ? '1 श्रमिक = 1 वोट' : '1 Worker = 1 Vote'}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/10 text-emerald-200 text-[11px] font-bold border border-white/10">
                        <Heart className="w-3.5 h-3.5 mr-1 text-rose-400" /> 
                        {rightsLang === 'hi' ? '₹25,000 आपातकालीन सहायता कोष' : '₹25,000 Emergency Mutual Fund'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setReliefClaimSubmitted(false);
                        setReliefModalOpen(true);
                      }}
                      className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <HeartHandshake className="w-4 h-4 text-slate-950" />
                      <span>{rightsLang === 'hi' ? 'आपातकालीन सहायता कोष आवेदन' : 'Apply Emergency Relief Fund'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setGrievanceSubmitted(false);
                        setGrievanceModalOpen(true);
                      }}
                      className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/20 flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <AlertCircle className="w-4 h-4 text-amber-300" />
                      <span>{rightsLang === 'hi' ? 'श्रमिक शिकायत / विवाद दर्ज करें' : 'File Worker Grievance / Dispute'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 6 Core Rights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                {/* 1. Zero Commission */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-xs hover:shadow-md p-6 space-y-3.5 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold group-hover:scale-105 transition-transform">
                    <IndianRupee className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      {rightsLang === 'hi' ? 'अधिकार #1 · शून्य कटौती' : 'Right #1 · Zero Cut'}
                    </span>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-2 font-outfit">
                      {rightsLang === 'hi' ? '0% प्लेटफ़ॉर्म कमीशन' : '0% Platform Commission'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {rightsLang === 'hi' 
                      ? "आपको ग्राहक के भुगतान का 100% हिस्सा मिलता है। अन्य ऐप्स 20%–30% तक काटते हैं, लेकिन सहकारी गिग में श्रमिकों से ₹0 शुल्क लिया जाता है। पैसा सीधे आपके बैंक खाते में आता है।"
                      : "You keep 100% of the customer's payment. Unlike corporate gig apps that extract 20%–30% in fees, SahkariGig charges ₹0 to workers. Escrow releases directly to your bank account."}
                  </p>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    <span>{rightsLang === 'hi' ? 'सक्रिय लाभ: 100% कमाई आपकी' : 'Active Benefit: 100% Retained'}</span>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>

                {/* 2. Guaranteed Minimum Floor Rate */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-xs hover:shadow-md p-6 space-y-3.5 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold group-hover:scale-105 transition-transform">
                    <Scale className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-blue-800 dark:text-blue-300 uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                      {rightsLang === 'hi' ? 'अधिकार #2 · उचित मजदूरी' : 'Right #2 · Fair Wage'}
                    </span>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-2 font-outfit">
                      {rightsLang === 'hi' ? 'न्यूनतम गारंटीकृत आधार वेतन' : 'Fair Floor Wage Protection'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {rightsLang === 'hi'
                      ? `ग्राहक कम दाम लगाने का दबाव नहीं बना सकते। यूनियन फेडरेशन द्वारा आधार दरें तय की जाती हैं (${profile.skill}: ₹400–₹700 न्यूनतम विजिट दर), जिससे गरिमापूर्ण आजीविका सुनिश्चित होती है।`
                      : `Customers cannot force predatory low-ball pricing. Minimum base rates are collectively determined by the trade union federation (${profile.skill}: ₹400–₹700 min visit base) ensuring dignified livelihood.`}
                  </p>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] font-bold text-blue-700 dark:text-blue-400">
                    <span>{rightsLang === 'hi' ? 'लागू न्यूनतम दर सुरक्षा' : 'Enforced Baseline Rates'}</span>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                {/* 3. Emergency Relief Fund */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-xs hover:shadow-md p-6 space-y-3.5 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-700 dark:text-rose-400 font-bold group-hover:scale-105 transition-transform">
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-rose-800 dark:text-rose-300 uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                      {rightsLang === 'hi' ? 'अधिकार #3 · आपसी सहायता' : 'Right #3 · Mutual Aid'}
                    </span>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-2 font-outfit">
                      {rightsLang === 'hi' ? 'सहकारी आपातकालीन सहायता कोष' : 'Cooperative Emergency Relief Fund'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {rightsLang === 'hi'
                      ? "कार्यस्थल पर चोट लगने, अचानक अस्पताल में भर्ती होने या औजारों की चोरी/खराबी पर ₹25,000 तक की तत्काल सहायता। 24 घंटे के भीतर त्वरित भुगतान।"
                      : "Instant mutual aid grant up to ₹25,000 for on-job physical injuries, acute medical hospitalizations, or critical equipment theft/breakdown. Fast-track disbursement within 24 hours."}
                  </p>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] font-bold text-rose-700 dark:text-rose-400">
                    <span>{rightsLang === 'hi' ? 'कवरेज: ₹25,000 तक' : 'Coverage: Up to ₹25,000'}</span>
                    <Heart className="w-4 h-4 fill-rose-500" />
                  </div>
                </div>

                {/* 4. Democratic Union Representation */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-xs hover:shadow-md p-6 space-y-3.5 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold group-hover:scale-105 transition-transform">
                    <Vote className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                      {rightsLang === 'hi' ? 'अधिकार #4 · लोकतांत्रिक शासन' : 'Right #4 · Governance'}
                    </span>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-2 font-outfit">
                      {rightsLang === 'hi' ? 'लोकतांत्रिक मतदान और पारदर्शिता' : 'Democratic Voting & Transparency'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {rightsLang === 'hi'
                      ? "सहकारी समिति के निर्णयों, नियमों और दरों में आपका समान वोट है। कोई मनमाना खाता निलंबन या छिपा हुआ एल्गोरिदम नहीं।"
                      : "You have an equal vote in cooperative governance, fee schedules, and policy updates. Algorithms are open and auditable: no random shadow-banning or automated account terminations."}
                  </p>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] font-bold text-amber-700 dark:text-amber-400">
                    <span>{rightsLang === 'hi' ? '1 सदस्य = 1 समान वोट' : '1 Member = 1 Equal Vote'}</span>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>

                {/* 5. Legal Ombudsman & Free Arbitration */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-xs hover:shadow-md p-6 space-y-3.5 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-700 dark:text-purple-400 font-bold group-hover:scale-105 transition-transform">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-purple-800 dark:text-purple-300 uppercase tracking-wider bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                      {rightsLang === 'hi' ? 'अधिकार #5 · कानूनी रक्षा' : 'Right #5 · Legal Defense'}
                    </span>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-2 font-outfit">
                      {rightsLang === 'hi' ? 'मुफ़्त कानूनी सहायता और लोकपाल' : 'Free Legal Aid & Dispute Ombudsman'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {rightsLang === 'hi'
                      ? "भुगतान विवाद या ग्राहक के दुर्व्यवहार पर महासंघ की ओर से निशुल्क कानूनी सहायता। निष्पक्ष लोकपाल द्वारा 48 घंटे में समाधान।"
                      : "Full federation legal support for unpaid invoices, client misconduct, or unfair damages accusations. An independent worker-customer ombudsman resolves cases fairly within 48 hours."}
                  </p>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] font-bold text-purple-700 dark:text-purple-400">
                    <span>{rightsLang === 'hi' ? 'लोकपाल समाधान: 48 घंटे में' : 'Ombudsman Resolution: 48h'}</span>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                {/* 6. Social Security & Pension Integration */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-xs hover:shadow-md p-6 space-y-3.5 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold group-hover:scale-105 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-teal-800 dark:text-teal-300 uppercase tracking-wider bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                      {rightsLang === 'hi' ? 'अधिकार #6 · सामाजिक सुरक्षा' : 'Right #6 · Social Security'}
                    </span>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-2 font-outfit">
                      {rightsLang === 'hi' ? 'ई-श्रम और पेंशन योजना लिंकेज' : 'e-Shram & Pension Linkage'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {rightsLang === 'hi'
                      ? "श्रम मंत्रालय के ई-श्रम पोर्टल और प्रधानमंत्री श्रम योगी मानधन (PM-SYM) से सीधा जुड़ाव। सहकारी कल्याण पॉइंट्स पेंशन में जोड़े जाते हैं।"
                      : "Seamless integration with Ministry of Labour e-Shram portal and Pradhan Mantri Shram Yogi Maandhan (PM-SYM). Sahkari cooperative matches community welfare points for pension credits."}
                  </p>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] font-bold text-teal-700 dark:text-teal-400">
                    <span>{rightsLang === 'hi' ? 'सत्यापित ई-श्रम कनेक्टेड' : 'Verified e-Shram Connected'}</span>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>

              </div>

              {/* Cooperative Support Hotline & Emergency Contacts */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-slate-700">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <PhoneCall className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-base font-outfit">
                      {rightsLang === 'hi' ? '24x7 सहकारी यूनियन हेल्पलाइन और आपातकालीन सहायता' : '24x7 Cooperative Union Hotline & SOS'}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl">
                      {rightsLang === 'hi'
                        ? "कार्यस्थल पर किसी भी समस्या, दुर्घटना या उत्पीड़न की स्थिति में हमारे आपातकालीन यूनियन डेस्क पर तुरंत कॉल करें।"
                        : "Need immediate assistance on a job site or facing client harassment? Call our emergency union desk toll-free or connect directly with your regional labor coordinator."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <a
                    href="tel:18007245274"
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-md flex items-center space-x-2"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{rightsLang === 'hi' ? '1800-SAHKARI पर कॉल करें' : 'Call 1800-SAHKARI'}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      alert(rightsLang === 'hi' 
                        ? "सहकारी महासंघ श्रमिक चार्टर (PDF)\n\nसहकारी श्रम अधिनियम की धारा 42 के तहत, सभी सदस्य 100% पारिश्रमिक के हकदार हैं और सामूहिक कल्याण समझौते के तहत सुरक्षित हैं।" 
                        : "Opening Sahkari Cooperative Federation Labour Charter (PDF)\n\nUnder section 42 of the Cooperative Labour Act, all members retain 100% of gig remuneration and are covered under collective bargaining agreements.");
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{rightsLang === 'hi' ? 'चार्टर नियम देखें' : 'View Charter'}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: PROFILE & ONBOARDING SETTINGS */}
          {currentTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Profile Config Form */}
              <form onSubmit={handleSaveProfile} className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-5">
                <h3 className="font-extrabold text-slate-900 text-base font-outfit border-b border-slate-100 pb-3 flex items-center justify-between">
                  <span>Worker Profile Settings</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase">Active</span>
                </h3>

                {/* Section 1: Account info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Personal & Account Information</h4>

                  {/* Visual Avatar File Uploader Field */}
                  <div className="bg-slate-50/50 rounded-2xl border border-slate-200 p-4 space-y-3">
                    <label className="block text-[11px] font-bold text-slate-600">Profile Picture (Avatar)</label>
                    <div className="flex items-center space-x-4">
                      {profile.avatarUrl ? (
                        <img
                          src={profile.avatarUrl}
                          alt="Avatar preview"
                          className="w-16 h-16 rounded-2xl object-cover border border-emerald-500 shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-extrabold text-xl shadow-sm font-outfit">
                          {profile.fullName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                          className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[10px] rounded-xl transition-all shadow-2xs cursor-pointer flex items-center space-x-1"
                        >
                          <Camera className="w-3.5 h-3.5 text-slate-500" />
                          <span>Upload Image File</span>
                        </button>
                        <p className="text-[9px] text-slate-400">Supports PNG, JPG, or GIF up to 2MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Phone Number</label>
                      <input
                        type="text"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Preferred UI Language</label>
                      <select
                        value={profile.language}
                        onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      >
                        <option>English</option>
                        <option>Hindi (हिन्दी)</option>
                        <option>Punjabi (ਪੰਜਾਬੀ)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Skill Category</label>
                      <select
                        value={profile.skill}
                        onChange={(e) => setProfile({ ...profile, skill: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      >
                        <option>Electrician</option>
                        <option>Plumber</option>
                        <option>Carpenter</option>
                        <option>Painter</option>
                        <option>Domestic Helper</option>
                        <option>Caregiver</option>
                        <option>Driver</option>
                        <option>Gardener</option>
                        <option>Cleaner</option>
                        <option>Technician</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Cooperative Affiliation */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cooperative Federation Affiliation</h4>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Federation Society</label>
                    <select
                      value={profile.coop}
                      onChange={(e) => setProfile({ ...profile, coop: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    >
                      <option>Delhi Labour Cooperative Federation</option>
                      <option>Haryana Karigar Association</option>
                      <option>Noida Builders Cooperative Society</option>
                    </select>
                  </div>
                </div>

                {/* Section 3: Service Location Radius */}
                <div className="space-y-4 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Service Radius & Location</h4>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Home Base Address</label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span>Maximum Service Area Radius</span>
                      <span className="text-emerald-700 font-bold">{profile.radius} km</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={50}
                      value={profile.radius}
                      onChange={(e) => setProfile({ ...profile, radius: parseInt(e.target.value) })}
                      className="w-full accent-emerald-600 bg-slate-200 h-1.5 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Section 4: Availability Schedule */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Availability Schedule</h4>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-2">Available Days</label>
                    <div className="flex flex-wrap gap-2">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                        const isSelected = profile.availableDays.includes(day);
                        return (
                          <button
                            type="button"
                            key={day}
                            onClick={() => toggleDay(day)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors ${isSelected
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                                : 'bg-slate-50 border-slate-200 text-slate-600'
                              }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Hours Window</label>
                    <input
                      type="text"
                      value={profile.timeWindow}
                      onChange={(e) => setProfile({ ...profile, timeWindow: e.target.value })}
                      placeholder="e.g. 9:00 AM - 6:00 PM"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Section 5: Payment & Bank Details */}
                <div className="space-y-4 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment & Bank Details</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Account Holder Name</label>
                      <input
                        type="text"
                        value={profile.bankDetails?.accountName || ''}
                        onChange={(e) => setProfile({ ...profile, bankDetails: { ...profile.bankDetails, accountName: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                        placeholder="Name on bank account"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Bank Name</label>
                      <input
                        type="text"
                        value={profile.bankDetails?.bankName || ''}
                        onChange={(e) => setProfile({ ...profile, bankDetails: { ...profile.bankDetails, bankName: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                        placeholder="e.g. State Bank of India"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Account Number</label>
                      <input
                        type="password"
                        value={profile.bankDetails?.accountNumber || ''}
                        onChange={(e) => setProfile({ ...profile, bankDetails: { ...profile.bankDetails, accountNumber: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
                        placeholder="•••• •••• ••••"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1.5">IFSC Code</label>
                      <input
                        type="text"
                        value={profile.bankDetails?.ifscCode || ''}
                        onChange={(e) => setProfile({ ...profile, bankDetails: { ...profile.bankDetails, ifscCode: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono uppercase"
                        placeholder="SBIN000XXXX"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Save Changes
                  </button>
                  {profileSaved && (
                    <span className="text-xs font-bold text-emerald-700 animate-pulse">✓ Profile saved successfully!</span>
                  )}
                </div>
              </form>

              {/* Onboarding Verification Status details */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4 h-fit">
                <h3 className="font-extrabold text-slate-900 text-sm font-outfit border-b border-slate-100 pb-3 flex items-center justify-between">
                  <span>Verification Status</span>
                </h3>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 flex items-start space-x-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Verification Active</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Your profile is certified by cooperative federation administrators.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verification Providers (MVP)</h4>
                    <div className="divide-y divide-slate-100">
                      {/* Aadhaar KYC */}
                      <div className="py-2.5 flex flex-col space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-600">Aadhaar KYC</span>
                          <span className="font-bold text-emerald-700">PASSED</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 bg-slate-50 border border-slate-200/60 rounded-xl p-2 mt-1">
                          <div className="flex items-center space-x-1.5 font-medium max-w-[70%] truncate">
                            <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{profile.uploadedDocs?.aadhaar || 'No document attached'}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            {profile.uploadedDocs?.aadhaar && (
                              <button type="button" onClick={() => setPreviewDoc('aadhaar')} className="text-sky-600 font-bold hover:underline cursor-pointer">Preview</button>
                            )}
                            <button
                              type="button"
                              onClick={() => document.getElementById('doc-upload-aadhaar')?.click()}
                              className="text-emerald-700 font-bold hover:underline cursor-pointer"
                            >
                              {profile.uploadedDocs?.aadhaar ? 'Change' : 'Attach File'}
                            </button>
                          </div>
                        </div>
                        <input
                          id="doc-upload-aadhaar"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
                          onChange={(e) => handleDocUpload('aadhaar', e)}
                        />
                      </div>

                      {/* Federation Membership */}
                      <div className="py-2.5 flex flex-col space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-600">Federation Membership</span>
                          <span className="font-bold text-emerald-700">ACTIVE</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 bg-slate-50 border border-slate-200/60 rounded-xl p-2 mt-1">
                          <div className="flex items-center space-x-1.5 font-medium max-w-[70%] truncate">
                            <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{profile.uploadedDocs?.membership || 'No document attached'}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            {profile.uploadedDocs?.membership && (
                              <button type="button" onClick={() => setPreviewDoc('membership')} className="text-sky-600 font-bold hover:underline cursor-pointer">Preview</button>
                            )}
                            <button
                              type="button"
                              onClick={() => document.getElementById('doc-upload-membership')?.click()}
                              className="text-emerald-700 font-bold hover:underline cursor-pointer"
                            >
                              {profile.uploadedDocs?.membership ? 'Change' : 'Attach File'}
                            </button>
                          </div>
                        </div>
                        <input
                          id="doc-upload-membership"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
                          onChange={(e) => handleDocUpload('membership', e)}
                        />
                      </div>

                      {/* Skill Trade Certification */}
                      <div className="py-2.5 flex flex-col space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-600">Skill Trade Certification</span>
                          <span className="font-bold text-emerald-700">VERIFIED</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 bg-slate-50 border border-slate-200/60 rounded-xl p-2 mt-1">
                          <div className="flex items-center space-x-1.5 font-medium max-w-[70%] truncate">
                            <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{profile.uploadedDocs?.skill || 'No document attached'}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            {profile.uploadedDocs?.skill && (
                              <button type="button" onClick={() => setPreviewDoc('skill')} className="text-sky-600 font-bold hover:underline cursor-pointer">Preview</button>
                            )}
                            <button
                              type="button"
                              onClick={() => document.getElementById('doc-upload-skill')?.click()}
                              className="text-emerald-700 font-bold hover:underline cursor-pointer"
                            >
                              {profile.uploadedDocs?.skill ? 'Change' : 'Attach File'}
                            </button>
                          </div>
                        </div>
                        <input
                          id="doc-upload-skill"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
                          onChange={(e) => handleDocUpload('skill', e)}
                        />
                      </div>

                      {/* Criminal Background Check */}
                      <div className="py-2.5 flex flex-col space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-600">Criminal Background Check</span>
                          <span className="font-bold text-emerald-700">CLEAN</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 bg-slate-50 border border-slate-200/60 rounded-xl p-2 mt-1">
                          <div className="flex items-center space-x-1.5 font-medium max-w-[70%] truncate">
                            <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{profile.uploadedDocs?.background || 'No document attached'}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            {profile.uploadedDocs?.background && (
                              <button type="button" onClick={() => setPreviewDoc('background')} className="text-sky-600 font-bold hover:underline cursor-pointer">Preview</button>
                            )}
                            <button
                              type="button"
                              onClick={() => document.getElementById('doc-upload-background')?.click()}
                              className="text-emerald-700 font-bold hover:underline cursor-pointer"
                            >
                              {profile.uploadedDocs?.background ? 'Change' : 'Attach File'}
                            </button>
                          </div>
                        </div>
                        <input
                          id="doc-upload-background"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
                          onChange={(e) => handleDocUpload('background', e)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/60 flex items-start space-x-2.5 text-[10px]">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-amber-800 leading-normal font-medium">
                      Need to update verified details? Please contact your Federation Admin at the local coop board directory.
                    </p>
                  </div>
                </div>
              </div>

              {/* Appearance & Theme Settings Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm font-outfit">Appearance & Theme</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 uppercase">
                    {theme}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${theme === 'light'
                        ? 'border-amber-500 bg-amber-50/70 dark:bg-slate-800 ring-2 ring-amber-500/30 shadow-xs text-amber-600 dark:text-amber-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                  >
                    <Sun className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                    <p className="text-xs font-bold">Light</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${theme === 'dark'
                        ? 'border-sky-500 bg-sky-50/70 dark:bg-slate-800 ring-2 ring-sky-500/30 shadow-xs text-sky-600 dark:text-sky-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                  >
                    <Moon className="w-5 h-5 mx-auto mb-1 text-sky-400" />
                    <p className="text-xs font-bold">Dark</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('system')}
                    className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${theme === 'system'
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-slate-800 ring-2 ring-emerald-500/30 shadow-xs text-emerald-600 dark:text-emerald-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                  >
                    <Laptop className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
                    <p className="text-xs font-bold">System</p>
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <span className="text-indigo-600 font-bold font-outfit text-sm">DOC</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{profile.uploadedDocs[previewDoc]}</h3>
                  <p className="text-xs text-slate-500">Document Preview</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 bg-slate-100 p-4 flex flex-col items-center justify-center overflow-hidden">
              {previewDocsData[previewDoc]?.url ? (
                previewDocsData[previewDoc].type.startsWith('image/') ? (
                  <img src={previewDocsData[previewDoc].url} alt="Document Preview" className="max-w-full max-h-full object-contain rounded-xl shadow-md border border-slate-200" />
                ) : (
                  <iframe src={previewDocsData[previewDoc].url} className="w-full h-full rounded-xl shadow-md border border-slate-200 bg-white" title="Document Preview" />
                )
              ) : (
                // Fallback for previously uploaded documents (demo mode)
                profile.uploadedDocs[previewDoc]?.toLowerCase().endsWith('.pdf') ? (
                  <iframe src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" className="w-full h-full rounded-xl shadow-md border border-slate-200 bg-white" title="Document Preview" />
                ) : (
                  <img src={`https://ui-avatars.com/api/?name=Document&background=0D8ABC&color=fff&size=512`} alt="Document Preview" className="max-w-full max-h-full object-contain rounded-xl shadow-md border border-slate-200" />
                )
              )}
            </div>
            <div className="p-4 bg-white border-t border-slate-100 flex justify-end space-x-3">
              <button
                onClick={() => {
                  const url = previewDocsData[previewDoc]?.url || (profile.uploadedDocs[previewDoc]?.toLowerCase().endsWith('.pdf') ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' : 'https://ui-avatars.com/api/?name=Document&background=0D8ABC&color=fff&size=512');
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = profile.uploadedDocs[previewDoc] || 'Document';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors text-sm"
              >
                Download Original
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Relief Fund Application Modal */}
      {reliefModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-rose-50/60 dark:bg-rose-950/40 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base font-outfit">Emergency Mutual Relief Claim</h3>
                  <p className="text-[11px] text-rose-700 dark:text-rose-300 font-medium">Cooperative Welfare Grant · Fast-Track 24h</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReliefModalOpen(false)}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reliefClaimSubmitted ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-lg font-extrabold text-slate-900 dark:text-white font-outfit">Relief Claim Submitted</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xs mx-auto">
                    Claim #REL-{Math.floor(1000 + Math.random() * 9000)} is filed with the <span className="font-bold text-emerald-600">{profile.coop}</span> welfare committee. A regional coordinator will contact you directly within 4 hours.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setReliefModalOpen(false)}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setReliefClaimSubmitted(true);
                  confetti({
                    particleCount: 50,
                    spread: 60,
                    origin: { y: 0.7 }
                  });
                }}
                className="p-6 space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Claim Category</label>
                  <select
                    value={claimData.type}
                    onChange={(e) => setClaimData({ ...claimData, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="medical">On-Job Injury / Emergency Medical Care</option>
                    <option value="equipment">Critical Tool Theft / Equipment Breakdown</option>
                    <option value="hardship">Temporary Illness / Acute Family Hardship</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Grant Requested (₹)</label>
                    <input
                      type="number"
                      required
                      max="25000"
                      value={claimData.amount}
                      onChange={(e) => setClaimData({ ...claimData, amount: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Maximum grant: ₹25,000</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Urgency</label>
                    <select
                      value={claimData.urgency}
                      onChange={(e) => setClaimData({ ...claimData, urgency: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="immediate">Immediate (&lt; 6 Hours)</option>
                      <option value="high">High (&lt; 24 Hours)</option>
                      <option value="normal">Standard (2–3 Days)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Incident Details</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe what happened (location, medical bills, damaged tools)..."
                    value={claimData.description}
                    onChange={(e) => setClaimData({ ...claimData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span>Approved claims are credited directly into your linked bank account ({profile.bankDetails?.bankName || 'Verified Cooperative Account'}).</span>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReliefModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Relief Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Worker Grievance & Dispute Filing Modal */}
      {grievanceModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-amber-50/60 dark:bg-amber-950/40 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base font-outfit">File Worker Grievance</h3>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">Independent Cooperative Ombudsman</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGrievanceModalOpen(false)}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {grievanceSubmitted ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-lg font-extrabold text-slate-900 dark:text-white font-outfit">Grievance Registered</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xs mx-auto">
                    Dispute docket #GRV-{Math.floor(1000 + Math.random() * 9000)} has been assigned to the regional legal ombudsman. Case review begins within 24 hours.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setGrievanceModalOpen(false)}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setGrievanceSubmitted(true);
                }}
                className="p-6 space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Dispute Type</label>
                  <select
                    value={grievanceData.category}
                    onChange={(e) => setGrievanceData({ ...grievanceData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Payment Dispute">Unpaid Job / Escrow Release Delay</option>
                    <option value="Customer Misconduct">Customer Misconduct / Harassment on Job</option>
                    <option value="Unfair Rating">Unfair Low Rating / Malicious Review</option>
                    <option value="Safety Violation">Unsafe Working Conditions at Customer Site</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Customer / Entity Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Sharma"
                      value={grievanceData.customerName}
                      onChange={(e) => setGrievanceData({ ...grievanceData, customerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Job ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. BK-4091"
                      value={grievanceData.jobId}
                      onChange={(e) => setGrievanceData({ ...grievanceData, jobId: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Detailed Explanation</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide full facts regarding the dispute..."
                    value={grievanceData.details}
                    onChange={(e) => setGrievanceData({ ...grievanceData, details: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setGrievanceModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>File Dispute</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Call Customer Direct Modal */}
      {callModalData?.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base font-outfit">Contact Customer</h3>
                  <p className="text-[11px] text-slate-500">{callModalData.service} · Direct Contact</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCallModalData(null)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-5 space-y-4 text-center">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Name</p>
                <p className="text-lg font-black text-slate-900 dark:text-white font-outfit mt-0.5">{callModalData.customerName}</p>
                <p className="text-xs text-slate-500 mt-0.5">{callModalData.address}</p>
              </div>

              {/* Number Card */}
              <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-800/60 text-center">
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">Customer Phone Number</span>
                <p className="text-xl font-black text-slate-900 dark:text-white font-mono mt-0.5 tracking-wide">{callModalData.phone}</p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <a
                  href={`tel:${callModalData.phone.replace(/\s+/g, '')}`}
                  className="py-3 px-4 bg-[#166534] hover:bg-[#14532D] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Dial on Mobile</span>
                </a>
                <a
                  href={`https://wa.me/${callModalData.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Namaste ${callModalData.customerName}, I am ${currentUser?.name || 'your SahkariGig professional'} regarding your ${callModalData.service} service request.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <p className="text-[10px] text-slate-400 dark:text-slate-500 pt-1">
                🔒 Cooperative Privacy: Direct communication for arrival coordination & safety.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
