import React, { useState, useRef } from 'react';
import { Camera, Check, CheckCircle, ChevronRight, ShieldCheck, Upload, Banknote, FileText, IndianRupee } from 'lucide-react';
import { supabase } from '../supabase';

interface WorkerOnboardingProps {
  currentUser: { name: string; role: string; id: string; email: string; avatarUrl?: string } | null;
  onComplete: () => void;
  onLogout?: () => void;
}

export const WorkerOnboarding: React.FC<WorkerOnboardingProps> = ({ currentUser, onComplete, onLogout }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 8;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const [profile, setProfile] = useState({
    fullName: currentUser?.name || '',
    phone: '',
    language: 'English',
    skill: 'Electrician',
    experience: '1-3 years',
    coop: 'Delhi Labour Cooperative Federation',
    aadhaar: '',
    membershipId: '',
    location: '',
    radius: 15,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeWindow: '9:00 AM - 6:00 PM',
    accountName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    declaration: {
      accurate: false,
      affiliated: false,
      authorize: false,
      genuine: false,
      terms: false
    }
  });

  const allDeclarationsChecked = Object.values(profile.declaration).every(Boolean);

  const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const toggleDay = (day: string) => {
    if (profile.availableDays.includes(day)) {
      setProfile(p => ({ ...p, availableDays: profile.availableDays.filter(d => d !== day) }));
    } else {
      setProfile(p => ({ ...p, availableDays: [...profile.availableDays, day] }));
    }
  };

  const handleSubmit = async () => {
    if (!allDeclarationsChecked) return;
    setIsSubmitting(true);
    
    // Save to local storage for the dashboard
    const savedProfile = {
      fullName: profile.fullName,
      phone: profile.phone,
      language: profile.language,
      skill: profile.skill,
      coop: profile.coop,
      location: profile.location,
      radius: profile.radius,
      availableDays: profile.availableDays,
      timeWindow: profile.timeWindow,
      verified: true,
      avatarUrl: currentUser?.avatarUrl || '',
      uploadedDocs: {
        aadhaar: profile.aadhaar ? 'aadhaar.pdf' : '',
        membership: profile.membershipId ? 'membership.pdf' : '',
        skill: '',
        background: ''
      },
      bankDetails: {
        // Obfuscated
        accountNumber: `•••• •••• ${profile.accountNumber.slice(-4) || '1234'}`
      }
    };
    
    if (currentUser?.id) {
      localStorage.setItem(`worker_profile_${currentUser.id}`, JSON.stringify(savedProfile));

      try {
        await supabase.auth.updateUser({
          data: {
            full_name: profile.fullName,
            phone: profile.phone,
            avatar_url: avatarUrl
          }
        });
      } catch (err) {
        console.error("Error updating user auth metadata", err);
      }

      
      try {
        const workerId = `WORKER-DEL-${currentUser.id.slice(0, 4).toUpperCase()}`;
        const { error } = await supabase.from('workers').upsert({
          worker_id: workerId,
          user_id: currentUser.id,
          name: profile.fullName,
          trade: profile.skill,
          coop_name: profile.coop,
          rating: 5.0, // Initial high rating for demo
          reviews_count: 0,
          hourly_rate: profile.skill === 'Electrician' ? '₹400–₹700 / visit' : (profile.skill === 'Plumber' ? '₹350–₹650 / visit' : '₹500–₹900 / visit'),
          distance_km: 1.5,
          is_available_today: true,
          is_top_rated: false,
          is_verified: true,
          avatar: avatarUrl || currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName || 'User')}&background=10b981&color=fff&size=150`
        }, { onConflict: 'worker_id' });
        
        if (error) {
          console.error("Failed to insert into Supabase:", error);
        }
      } catch (err) {
        console.error("Error upserting worker:", err);
      }
    }
    
    setIsSubmitting(false);
    onComplete();
  };

  const stepsList = [
    "Profile", "Skills", "Affiliation", "Documents", 
    "Location", "Availability", "Bank Details", "Declaration"
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {onLogout && (
        <button 
          onClick={onLogout}
          className="absolute top-4 right-4 z-50 text-slate-500 hover:text-slate-900 flex items-center gap-2 bg-white/80 px-4 py-2 rounded-lg border border-slate-200 hover:border-slate-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Log Out
        </button>
      )}
      <div className="w-full max-w-3xl bg-white backdrop-blur-xl rounded-3xl border border-slate-200 shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row min-h-[600px] mt-12 md:mt-0">
        
        {/* Sidebar Progress */}
        <div className="md:w-64 bg-white border-r border-slate-200 p-8 hidden md:block">
          <h2 className="text-slate-900 font-bold font-outfit text-lg mb-8">Onboarding</h2>
          <div className="space-y-6">
            {stepsList.map((s, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step > idx + 1 ? 'bg-emerald-500 text-white' : 
                  step === idx + 1 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 
                  'bg-slate-100 text-slate-400'
                }`}>
                  {step > idx + 1 ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={`text-sm font-medium ${step === idx + 1 ? 'text-slate-900' : 'text-slate-400'}`}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative">
          
          {/* Mobile Progress */}
          <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
            <span className="text-emerald-400 font-bold text-sm">Step {step} of {totalSteps}</span>
            <span className="text-slate-900 font-medium text-sm">{stepsList[step-1]}</span>
          </div>

          <div className="p-8 flex-1 overflow-y-auto">
            {/* Step 1: Worker Profile */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 font-outfit">Worker Profile</h3>
                  <p className="text-slate-500 text-sm mt-1">Tell us a bit about yourself.</p>
                </div>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-emerald-400 border border-slate-200 overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8" />
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors">
                    Upload Photo
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Full Name</label>
                    <input type="text" value={profile.fullName} onChange={e => setProfile({...profile, fullName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-slate-100 transition-colors" placeholder="e.g. Rahul Sharma" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Phone Number</label>
                    <input type="text" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-slate-100 transition-colors" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Preferred Language</label>
                    <select value={profile.language} onChange={e => setProfile({...profile, language: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors">
                      <option>English</option>
                      <option>Hindi (हिन्दी)</option>
                      <option>Punjabi (ਪੰਜਾਬੀ)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Skills & Experience */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 font-outfit">Skills & Experience</h3>
                  <p className="text-slate-500 text-sm mt-1">What is your primary trade?</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Primary Skill / Trade</label>
                    <select value={profile.skill} onChange={e => setProfile({...profile, skill: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors">
                      <option>Electrician</option>
                      <option>Plumber</option>
                      <option>Carpenter</option>
                      <option>Painter</option>
                      <option>Domestic Help</option>
                      <option>Cleaner</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Years of Experience</label>
                    <select value={profile.experience} onChange={e => setProfile({...profile, experience: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors">
                      <option>Less than 1 year</option>
                      <option>1 - 3 years</option>
                      <option>3 - 5 years</option>
                      <option>5+ years</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Cooperative Affiliation */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 font-outfit">Cooperative Affiliation</h3>
                  <p className="text-slate-500 text-sm mt-1">Select your registered cooperative society.</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Federation Society</label>
                    <select value={profile.coop} onChange={e => setProfile({...profile, coop: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors">
                      <option>Delhi Labour Cooperative Federation</option>
                      <option>Haryana Karigar Association</option>
                      <option>Noida Builders Cooperative Society</option>
                      <option>Mumbai Domestic Workers Union</option>
                    </select>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start space-x-3 mt-4">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <p className="text-sm text-emerald-100/80 leading-relaxed">
                      By selecting a cooperative federation, you agree that your profile will be sent to their administrative panel for verification. You must be an active member.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Verification Documents */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 font-outfit">Verification Documents</h3>
                  <p className="text-slate-500 text-sm mt-1">Provide ID and membership proofs.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                    <h4 className="text-slate-900 font-medium">Upload Aadhaar Card</h4>
                    <p className="text-xs text-slate-500 mt-1">JPG, PNG or PDF (Max 5MB)</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Society Membership ID / Number</label>
                    <input type="text" value={profile.membershipId} onChange={e => setProfile({...profile, membershipId: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-slate-100 transition-colors" placeholder="e.g. DEL-COOP-89012" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Service Location */}
            {step === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 font-outfit">Service Location</h3>
                  <p className="text-slate-500 text-sm mt-1">Where will you be working?</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Home Base / Locality</label>
                    <input type="text" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-slate-100 transition-colors" placeholder="e.g. Connaught Place, New Delhi" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                      <label>Maximum Travel Radius</label>
                      <span className="text-emerald-400">{profile.radius} km</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="50" 
                      value={profile.radius} 
                      onChange={e => setProfile({...profile, radius: parseInt(e.target.value)})}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Availability */}
            {step === 6 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 font-outfit">Availability</h3>
                  <p className="text-slate-500 text-sm mt-1">Set your standard working hours.</p>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-3">Available Days</label>
                    <div className="flex flex-wrap gap-2">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <button 
                          key={day}
                          onClick={() => toggleDay(day)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            profile.availableDays.includes(day) 
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Time Window</label>
                    <input type="text" value={profile.timeWindow} onChange={e => setProfile({...profile, timeWindow: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-slate-100 transition-colors" placeholder="e.g. 9:00 AM - 6:00 PM" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Bank Details */}
            {step === 7 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 font-outfit">Payment & Bank Details</h3>
                  <p className="text-slate-500 text-sm mt-1">Add your bank account to receive payments for completed jobs.</p>
                </div>
                
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start space-x-3 mb-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-100/90 font-medium">
                    Your bank details are encrypted and used only for payments and account verification.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Account Holder Name</label>
                    <input type="text" value={profile.accountName} onChange={e => setProfile({...profile, accountName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-slate-100 transition-colors" placeholder="Enter account holder name" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Bank Name</label>
                    <select value={profile.bankName} onChange={e => setProfile({...profile, bankName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors">
                      <option value="">Select bank</option>
                      <option>State Bank of India</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Punjab National Bank</option>
                      <option>Axis Bank</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Account Number</label>
                    <input type="password" value={profile.accountNumber} onChange={e => setProfile({...profile, accountNumber: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-slate-100 transition-colors font-mono tracking-widest" placeholder="Enter account number" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">IFSC Code</label>
                    <input type="text" value={profile.ifscCode} onChange={e => setProfile({...profile, ifscCode: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-slate-100 transition-colors font-mono uppercase" placeholder="e.g. SBIN0001234" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">UPI ID (Optional)</label>
                    <input type="text" value={profile.upiId} onChange={e => setProfile({...profile, upiId: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-slate-100 transition-colors" placeholder="example@upi" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 8: Declaration */}
            {step === 8 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 font-outfit">Worker Declaration</h3>
                  <p className="text-slate-500 text-sm mt-1">Please review and confirm the following before submitting your profile.</p>
                </div>
                
                <div className="space-y-4">
                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <div className="mt-0.5">
                      <input 
                        type="checkbox" 
                        className="peer hidden" 
                        checked={profile.declaration.accurate}
                        onChange={e => setProfile({...profile, declaration: {...profile.declaration, accurate: e.target.checked}})}
                      />
                      <div className="w-5 h-5 rounded border-2 border-slate-500 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center transition-colors">
                        {profile.declaration.accurate && <Check className="w-3.5 h-3.5 text-slate-900" />}
                      </div>
                    </div>
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                      I confirm that the information provided in my worker profile is accurate and complete.
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <div className="mt-0.5">
                      <input 
                        type="checkbox" 
                        className="peer hidden" 
                        checked={profile.declaration.affiliated}
                        onChange={e => setProfile({...profile, declaration: {...profile.declaration, affiliated: e.target.checked}})}
                      />
                      <div className="w-5 h-5 rounded border-2 border-slate-500 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center transition-colors">
                        {profile.declaration.affiliated && <Check className="w-3.5 h-3.5 text-slate-900" />}
                      </div>
                    </div>
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                      I confirm that I am affiliated with the cooperative/federation selected in my profile.
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <div className="mt-0.5">
                      <input 
                        type="checkbox" 
                        className="peer hidden" 
                        checked={profile.declaration.authorize}
                        onChange={e => setProfile({...profile, declaration: {...profile.declaration, authorize: e.target.checked}})}
                      />
                      <div className="w-5 h-5 rounded border-2 border-slate-500 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center transition-colors">
                        {profile.declaration.authorize && <Check className="w-3.5 h-3.5 text-slate-900" />}
                      </div>
                    </div>
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                      I authorize SahkariGig and the relevant cooperative federation to verify the information and documents submitted by me.
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <div className="mt-0.5">
                      <input 
                        type="checkbox" 
                        className="peer hidden" 
                        checked={profile.declaration.genuine}
                        onChange={e => setProfile({...profile, declaration: {...profile.declaration, genuine: e.target.checked}})}
                      />
                      <div className="w-5 h-5 rounded border-2 border-slate-500 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center transition-colors">
                        {profile.declaration.genuine && <Check className="w-3.5 h-3.5 text-slate-900" />}
                      </div>
                    </div>
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                      I agree to provide genuine documents and understand that inaccurate or fraudulent information may result in verification failure or account suspension.
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <div className="mt-0.5">
                      <input 
                        type="checkbox" 
                        className="peer hidden" 
                        checked={profile.declaration.terms}
                        onChange={e => setProfile({...profile, declaration: {...profile.declaration, terms: e.target.checked}})}
                      />
                      <div className="w-5 h-5 rounded border-2 border-slate-500 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center transition-colors">
                        {profile.declaration.terms && <Check className="w-3.5 h-3.5 text-slate-900" />}
                      </div>
                    </div>
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                      I agree to the SahkariGig Terms of Service and Privacy Policy.
                    </span>
                  </label>
                </div>
              </div>
            )}
            
          </div>

          {/* Navigation Footer */}
          <div className="p-6 border-t border-slate-200 flex items-center justify-between bg-white">
            {step > 1 ? (
              <button 
                onClick={handlePrev}
                className="px-6 py-2.5 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            {step < totalSteps ? (
              <button 
                onClick={handleNext}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center space-x-2"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={!allDeclarationsChecked || isSubmitting}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center space-x-2"
              >
                <span>{isSubmitting ? 'Submitting...' : 'Submit Profile'}</span>
                {!isSubmitting && <CheckCircle className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

