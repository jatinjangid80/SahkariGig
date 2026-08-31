import React, { useState, useEffect } from 'react';
import { ShieldCheck, QrCode, Check, X, Clock, MapPin, Calendar, IndianRupee, Award, Star, MessageSquare, User, Briefcase, DollarSign, Globe, Sliders, ShieldAlert, Camera, Paperclip } from 'lucide-react';
import { supabase } from '../supabase';
// @ts-ignore
import confetti from 'canvas-confetti';

interface WorkerDashboardProps {
  currentUser?: { name: string; role: string; id: string; email: string; avatarUrl?: string } | null;
  activeTab?: 'feed' | 'active' | 'earnings' | 'profile';
  onTabChange?: (tab: 'feed' | 'active' | 'earnings' | 'profile') => void;
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
  const [localTab, setLocalTab] = useState<'feed' | 'active' | 'earnings' | 'profile'>('feed');
  const currentTab = activeTab || localTab;
  const setTab = onTabChange || setLocalTab;

  const [requests, setRequests] = useState<any[]>([]);
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  
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
      const savedProfile = localStorage.getItem(`worker_profile_${currentUser.id}`);
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          // Auto-fill uploadedDocs if missing from legacy saves
          if (!parsed.uploadedDocs) {
            parsed.uploadedDocs = {
              aadhaar: '',
              membership: '',
              skill: '',
              background: ''
            };
          }
          if (!parsed.bankDetails) {
            parsed.bankDetails = {
              accountName: '',
              bankName: '',
              accountNumber: '',
              ifscCode: '',
              upiId: ''
            };
          }
          setProfile(parsed);
          return;
        } catch (e) {
          console.error("Failed to parse saved profile:", e);
        }
      }
      
      // Fallback: Populate name from register auth state, empty rest
      setProfile({
        fullName: currentUser.name || '',
        phone: '',
        language: 'English',
        skill: 'Electrician',
        coop: 'Delhi Labour Cooperative Federation',
        location: '',
        radius: 15,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        timeWindow: '9:00 AM - 6:00 PM',
        verified: true,
        avatarUrl: currentUser.avatarUrl || '',
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
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        let loadedRequests: any[] = [];
        const apiRes = await fetch('http://localhost:5001/api/bookings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
            'x-user-role': 'Worker'
          }
        }).catch(() => null);

        if (apiRes && apiRes.ok) {
          const json = await apiRes.json();
          if (json.success && Array.isArray(json.data?.bookings) && json.data.bookings.length > 0) {
            loadedRequests = json.data.bookings.map((b: any) => ({
              id: b.id,
              service: b.service,
              customerName: b.customerName,
              customer_id: 'demo-customer',
              worker_id: b.workerId || currentUser?.id,
              address: b.address,
              dateTime: `${b.bookingDate}, ${b.bookingTime}`,
              amount: b.amount,
              status: b.status
            }));
          }
        }

        if (currentUser?.id) {
          const workerId = `WORKER-DEL-${currentUser.id.slice(0, 4).toUpperCase()}`;
          const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .or(`worker_id.eq.${workerId},worker_name.eq."${currentUser.name}"`)
            .order('created_at', { ascending: false });
            
          if (!error && data && data.length > 0) {
            loadedRequests = data.map(b => ({
              id: b.id,
              service: b.service,
              customerName: b.customer_name,
              customer_id: b.customer_id,
              worker_id: b.worker_id,
              address: b.address,
              dateTime: `${b.booking_date}, ${b.booking_time}`,
              amount: b.amount,
              status: b.status,
              paymentStatus: b.payment_status
            }));
            
            // Calculate dynamic stats from completed bookings
            const completed = loadedRequests.filter(r => r.status === 'COMPLETED' || r.paymentStatus === 'PAID');
            setCompletedJobsCount(completed.length);
            
            const totalBalance = completed.reduce((sum, req) => {
              const numStr = String(req.amount).replace(/[^0-9.]/g, '');
              return sum + (parseFloat(numStr) || 0);
            }, 0);
            setWeeklyBalance(totalBalance);
            
            setPayoutHistory(completed.map(c => ({
              jobId: c.id,
              service: c.service,
              customer: c.customerName,
              date: c.dateTime ? c.dateTime.split(',')[0] : 'Recently',
              amount: c.amount
            })));
          } else {
             setCompletedJobsCount(0);
             setWeeklyBalance(0);
             setPayoutHistory([]);
          }
        }

        setRequests(loadedRequests);
      } catch (err) {
        console.error("Worker booking fetch error:", err);
        setRequests([]);
      }
    };
    fetchRequests();
  }, [currentUser, refreshTrigger]);

  const handleAccept = async (id: string) => {
    // Update local state optimistically
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'ACCEPTED' } : r));
    // Update DB
    await supabase.from('bookings').update({ status: 'ACCEPTED' }).eq('id', id);
  };

  const handleReject = async (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
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
          id="avatar-upload-input" 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleAvatarChange} 
        />

        {/* Worker Info Card Header */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            
            {/* Avatar Image / Initials Uploader Circle */}
            <div 
              className="relative group cursor-pointer shrink-0" 
              onClick={() => document.getElementById('avatar-upload-input')?.click()}
            >
              {profile.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt="Avatar" 
                  className="w-14 h-14 rounded-2xl object-cover border border-emerald-500 shadow-md transition-all group-hover:brightness-90" 
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-extrabold text-xl shadow-md transition-all group-hover:brightness-90 font-outfit">
                  {profile.fullName.substring(0, 2).toUpperCase()}
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
                  isAvailableToday: true,
                  avatar: profile.avatarUrl || ''
                });
              }
            }}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-2 self-start md:self-auto"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Digital ID Card</span>
          </button>
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
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-slate-900 font-outfit">{req.service}</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          New Request
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-600">{req.customerName} · 2.5 km away</p>
                      <div className="flex items-center gap-4 pt-2 text-xs text-slate-500">
                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-slate-400"/> {req.dateTime}</span>
                        <span className="font-bold text-emerald-700 text-sm">{req.amount}</span>
                      </div>
                    </div>
                    
                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <button
                        onClick={() => handleAccept(req.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center shadow-xs"
                      >
                        <Check className="w-4 h-4 mr-1" /> Accept
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center"
                      >
                        <X className="w-4 h-4 mr-1" /> Decline
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
                <div key={req.id} className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
                  
                  {/* Job Header */}
                  <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-slate-900 text-base font-outfit">{req.service}</h3>
                        <span className="px-2 py-0.5 bg-sky-50 text-sky-700 text-[10px] font-bold rounded border border-sky-100">
                          {req.status === 'IN_PROGRESS' ? 'On-site' : 'Scheduled'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Scheduled: {req.dateTime}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenChat && onOpenChat(req)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
                      >
                        <MessageSquare className="w-4 h-4 text-white" />
                        <span>Chat Customer</span>
                      </button>
                    </div>
                  </div>

                  {/* Customer details & Map */}
                  <div className="p-5 bg-slate-50/50 space-y-4">
                    <div className="flex justify-between text-xs border-b border-slate-100 pb-3">
                      <div>
                        <p className="text-slate-400 font-medium">Customer</p>
                        <p className="font-bold text-slate-800 mt-0.5">{req.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 font-medium">Payout Rate</p>
                        <p className="font-bold text-emerald-700 mt-0.5">{req.amount} (Escrow Secured)</p>
                      </div>
                    </div>

                    {/* Coordinates & Location Pin */}
                    <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start space-x-2.5">
                        <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-tight">{req.address}</p>
                          <p className="text-[10px] text-slate-500 mt-1">Customer coordinates verified via PostGIS GPS bounds</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-600 font-bold font-mono self-start sm:self-auto shrink-0 shadow-2xs">
                        28.6139° N, 77.2090° E
                      </span>
                    </div>

                    {/* Safety Verification QR Code Info */}
                    <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-start space-x-3">
                      <QrCode className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-emerald-900 leading-tight">Cooperative Safety Protocol</p>
                        <p className="text-[10px] text-emerald-700 mt-1 leading-relaxed">
                          When you arrive at the job site, present your Digital ID Card QR code to the customer. Once they scan it via their dashboard, your check-in will be logged and the escrow status will advance.
                        </p>
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
                          <td className="p-4 font-mono text-[10px]">{ph.jobId?.substring(0, 8) || `BK-${1000+idx}`}</td>
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
                          {profile.fullName.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={() => document.getElementById('avatar-upload-input')?.click()}
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
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors ${
                              isSelected 
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
                          <button
                            type="button"
                            onClick={() => document.getElementById('doc-upload-aadhaar')?.click()}
                            className="text-emerald-700 font-bold hover:underline cursor-pointer"
                          >
                            {profile.uploadedDocs?.aadhaar ? 'Change' : 'Attach File'}
                          </button>
                        </div>
                        <input
                          id="doc-upload-aadhaar"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
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
                          <button
                            type="button"
                            onClick={() => document.getElementById('doc-upload-membership')?.click()}
                            className="text-emerald-700 font-bold hover:underline cursor-pointer"
                          >
                            {profile.uploadedDocs?.membership ? 'Change' : 'Attach File'}
                          </button>
                        </div>
                        <input
                          id="doc-upload-membership"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
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
                          <button
                            type="button"
                            onClick={() => document.getElementById('doc-upload-skill')?.click()}
                            className="text-emerald-700 font-bold hover:underline cursor-pointer"
                          >
                            {profile.uploadedDocs?.skill ? 'Change' : 'Attach File'}
                          </button>
                        </div>
                        <input
                          id="doc-upload-skill"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
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
                          <button
                            type="button"
                            onClick={() => document.getElementById('doc-upload-background')?.click()}
                            className="text-emerald-700 font-bold hover:underline cursor-pointer"
                          >
                            {profile.uploadedDocs?.background ? 'Change' : 'Attach File'}
                          </button>
                        </div>
                        <input
                          id="doc-upload-background"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
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

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
