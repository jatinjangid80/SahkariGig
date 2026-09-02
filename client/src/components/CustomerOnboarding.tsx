import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import {
  User,
  Phone,
  MapPin,
  CheckCircle2,
  CalendarClock,
  ArrowRight,
  ArrowLeft,
  Wrench,
  Droplet,
  Hammer,
  Paintbrush,
  Home,
  HeartHandshake,
  Car,
  Trees,
  Sparkles,
  Cog,
  Languages,
  Clock
} from 'lucide-react';

const CATEGORIES = [
  { id: 'Electrician', icon: Wrench, label: 'Electrician' },
  { id: 'Plumber', icon: Droplet, label: 'Plumber' },
  { id: 'Carpenter', icon: Hammer, label: 'Carpenter' },
  { id: 'Painter', icon: Paintbrush, label: 'Painter' },
  { id: 'Domestic Helper', icon: Home, label: 'Domestic Helper' },
  { id: 'Caregiver', icon: HeartHandshake, label: 'Caregiver' },
  { id: 'Driver', icon: Car, label: 'Driver' },
  { id: 'Gardener', icon: Trees, label: 'Gardener' },
  { id: 'Cleaner', icon: Sparkles, label: 'Cleaner' },
  { id: 'Technician', icon: Cog, label: 'Technician' },
];

export const CustomerOnboarding: React.FC<{ currentUser: any, onComplete: () => void }> = ({ currentUser, onComplete }) => {
  const [step, setStep] = useState(1);

  // Tab 1: Account Information
  const [accountInfo, setAccountInfo] = useState({
    fullName: currentUser?.name || '',
    phone: '',
    language: 'English',
    address: ''
  });

  // Tab 2: Service Request Details
  const [requestDetails, setRequestDetails] = useState({
    category: '',
    location: '',
    date: '',
    timeWindow: 'Morning (9 AM - 12 PM)',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync Address <-> Location for convenience if one is filled
  useEffect(() => {
    if (accountInfo.address && !requestDetails.location) {
      setRequestDetails(prev => ({ ...prev, location: accountInfo.address }));
    }
  }, [accountInfo.address]);

  const handleNext = () => {
    setErrorMessage(null);
    if (step === 1) {
      if (!accountInfo.fullName || !accountInfo.phone || !accountInfo.address) {
        setErrorMessage("Please fill in all required fields.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!requestDetails.category || !requestDetails.location || !requestDetails.date || !requestDetails.description) {
        setErrorMessage("Please complete your service request details.");
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    setStep(Math.max(1, step - 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 1. Update customer profile in localStorage (Fallback)
      const customerId = currentUser?.id || `demo-customer-${Date.now()}`;
      const profileData = {
        id: customerId,
        ...accountInfo
      };
      localStorage.setItem(`customer_profile_${customerId}`, JSON.stringify(profileData));

      // 2. Create the booking locally (Fallback)
      const bookingData = {
        id: `BK-${Math.floor(Math.random() * 10000)}`,
        service: `${requestDetails.category} Service`,
        workerName: 'Pending Assignment',
        workerTrade: requestDetails.category,
        workerId: '',
        coopName: 'Auto-assigning Cooperative...',
        date: requestDetails.date,
        time: requestDetails.timeWindow,
        address: requestDetails.location,
        description: requestDetails.description,
        amount: '₹—',
        status: 'REQUESTED',
        paymentStatus: 'PENDING'
      };

      // Push to a list of local bookings for the customer dashboard
      const existingBookingsStr = localStorage.getItem(`customer_bookings_${customerId}`);
      const existingBookings = existingBookingsStr ? JSON.parse(existingBookingsStr) : [];
      existingBookings.unshift(bookingData);
      localStorage.setItem(`customer_bookings_${customerId}`, JSON.stringify(existingBookings));

      // 3. Push to Supabase if connected
      if (currentUser?.id) {
        // Attempt to upsert customer profile (assume a customers table exists or just save to metadata)
        await supabase.auth.updateUser({
          data: { phone: accountInfo.phone, address: accountInfo.address, language: accountInfo.language }
        });

        // Insert booking
        const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
        await supabase.from('bookings').insert({
          id: crypto.randomUUID(),
          booking_code: bookingId,
          customer_id: currentUser.id,
          customer_name: currentUser.name,
          service: `${requestDetails.category} Service`,
          worker_trade: requestDetails.category,
          worker_name: 'Pending Assignment',
          worker_id: 'PENDING',
          address: requestDetails.location,
          booking_date: requestDetails.date,
          booking_time: requestDetails.timeWindow,
          status: 'REQUESTED',
          payment_status: 'PENDING',
          amount: 'Pending',
          // Assuming a description column exists, or we append it to service
        });
      }

      // 4. Redirect
      onComplete();
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong saving your profile and request. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-50 w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col font-sans relative my-auto max-h-[95vh] overflow-y-auto border border-slate-200/60">
        <header className="bg-white border-b border-slate-200 py-4 px-6 md:px-8 flex items-center justify-between sticky top-0 z-10 rounded-t-2xl sm:rounded-t-3xl">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Cg</span>
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">SahkariGig</span>
        </div>
        <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          Step {step} of 3
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
            {step === 1 && "Complete Your Profile"}
            {step === 2 && "Request a Service"}
            {step === 3 && "Review & Confirm"}
          </h1>
          <p className="text-slate-500 text-lg">
            {step === 1 && "We need a few details before you can book workers."}
            {step === 2 && "Tell us what you need help with."}
            {step === 3 && "Check your details and submit your request."}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {errorMessage}
          </div>
        )}

        <div className="bg-white shadow-xl shadow-slate-200/40 rounded-2xl border border-slate-100 overflow-hidden">

          {/* STEP 1: Account Information */}
          {step === 1 && (
            <div className="p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={accountInfo.fullName}
                      onChange={(e) => setAccountInfo({ ...accountInfo, fullName: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      value={accountInfo.phone}
                      onChange={(e) => setAccountInfo({ ...accountInfo, phone: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Language Preference</label>
                  <div className="relative">
                    <Languages className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                      value={accountInfo.language}
                      onChange={(e) => setAccountInfo({ ...accountInfo, language: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors appearance-none cursor-pointer"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi (हिन्दी)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Default Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-4 w-5 h-5 text-slate-400" />
                    <textarea
                      value={accountInfo.address}
                      onChange={(e) => setAccountInfo({ ...accountInfo, address: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors min-h-[120px] resize-none"
                      placeholder="Enter your full home or office address"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Service Request Details */}
          {step === 2 && (
            <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">What kind of service do you need? <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {CATEGORIES.map((cat) => {
                    const isSelected = requestDetails.category === cat.id;
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setRequestDetails({ ...requestDetails, category: cat.id })}
                        className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center space-y-2.5 transition-all ${isSelected
                            ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                            : 'bg-white border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/50'
                          }`}
                      >
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-emerald-600' : 'text-slate-500'}`} />
                        <span className={`text-[11px] font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-600'}`}>
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Service Location <span className="text-red-500">*</span></label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-4 w-5 h-5 text-slate-400" />
                  <textarea
                    value={requestDetails.location}
                    onChange={(e) => setRequestDetails({ ...requestDetails, location: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors min-h-[90px] resize-none"
                    placeholder="Address where the service is needed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Preferred Date <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <CalendarClock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="date"
                      value={requestDetails.date}
                      onChange={(e) => setRequestDetails({ ...requestDetails, date: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Time Window <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                      value={requestDetails.timeWindow}
                      onChange={(e) => setRequestDetails({ ...requestDetails, timeWindow: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors appearance-none cursor-pointer"
                    >
                      <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                      <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                      <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Job Description <span className="text-red-500">*</span></label>
                <textarea
                  value={requestDetails.description}
                  onChange={(e) => setRequestDetails({ ...requestDetails, description: e.target.value })}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors min-h-[120px] resize-none"
                  placeholder="Describe the issue or task in detail. E.g., 'The kitchen sink is leaking continuously from the bottom pipe...'"
                />
              </div>

            </div>
          )}

          {/* STEP 3: Summary / Success */}
          {step === 3 && (
            <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

              <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 text-center shadow-sm">
                <div className="w-20 h-20 bg-emerald-100/50 rounded-full flex items-center justify-center mx-auto mb-5 ring-8 ring-emerald-50">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-black text-emerald-900 mb-2">Ready to post your request!</h3>
                <p className="text-emerald-700 font-medium">
                  We'll route your request to verified cooperatives in your area immediately.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                  <h4 className="font-bold text-slate-700 text-sm tracking-wide uppercase">Request Summary</h4>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Service</span>
                      <span className="block text-base font-bold text-slate-900">{requestDetails.category}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Schedule</span>
                      <span className="block text-base font-bold text-slate-900">
                        {requestDetails.date ? new Date(requestDetails.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : ''}
                      </span>
                      <span className="text-slate-500 text-sm font-medium">{requestDetails.timeWindow}</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</span>
                    <span className="block text-sm font-medium text-slate-800 leading-relaxed">{requestDetails.location}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</span>
                    <span className="block text-sm font-medium text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                      {requestDetails.description}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  By submitting this request, you agree to the platform's terms of service.
                  Pricing will be negotiated directly or based on standard cooperative rates.
                </p>
              </div>

            </div>
          )}

          {/* Navigation Footer */}
          <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1 || isSubmitting}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${step === 1 || isSubmitting
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 transition-all active:scale-95"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`flex items-center space-x-2 px-10 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[15px] shadow-lg shadow-emerald-200 transition-all active:scale-95 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Request</span>
                    <CheckCircle2 className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </main>
      </div>
    </div>
  );
};
