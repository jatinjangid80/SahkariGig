import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle, Calendar, MapPin, ShieldCheck, Star, Clock, 
  ArrowRight, ArrowLeft, Printer, Zap, Droplet, Hammer, Paintbrush, 
  Home, Heart, HeartHandshake, Car, Trees, Sparkles, Cog, 
  User, Users, Plus, Minus, Check, HardHat, Briefcase, Layers
} from 'lucide-react';
// @ts-ignore
import confetti from 'canvas-confetti';

interface Worker {
  id: string;
  name: string;
  avatar?: string;
  trade: string;
  rating: number;
  reviewsCount?: number;
  coopName: string;
  hourlyRate: string;
  workerId: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker?: Worker | null;
  onBookingSuccess: (bookingData: any) => void;
  onTrackBooking?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  worker,
  onBookingSuccess,
  onTrackBooking
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingMode, setBookingMode] = useState<'SINGLE' | 'MULTIPLE'>('SINGLE');
  const [workerCount, setWorkerCount] = useState(3);
  const [shiftType, setShiftType] = useState<'HALF_DAY' | 'FULL_DAY' | 'HOURLY'>('FULL_DAY');
  const [selectedTrades, setSelectedTrades] = useState<string[]>([worker?.trade || 'Electrician']);
  const serviceType = selectedTrades.join(', ');
  const [bookingDate, setBookingDate] = useState('Tomorrow');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [address, setAddress] = useState('Flat 402, Green Park Apartments, New Delhi');
  const [notes, setNotes] = useState('Please bring standard multimeter and MCB replacements.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingCode, setBookingCode] = useState('');

  const handleSetBookingMode = (mode: 'SINGLE' | 'MULTIPLE') => {
    setBookingMode(mode);
    if (mode === 'SINGLE' && selectedTrades.length > 1) {
      setSelectedTrades([selectedTrades[0]]);
    }
  };

  const handleTradeClick = (trade: string) => {
    if (bookingMode === 'SINGLE') {
      setSelectedTrades([trade]);
    } else {
      if (selectedTrades.includes(trade)) {
        if (selectedTrades.length > 1) {
          setSelectedTrades(selectedTrades.filter((t) => t !== trade));
        }
      } else {
        setSelectedTrades([...selectedTrades, trade]);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setBookingMode('SINGLE');
      setWorkerCount(3);
      setShiftType('FULL_DAY');
      setSelectedTrades([worker?.trade || 'Electrician']);
      setBookingDate('Tomorrow');
      setBookingTime('10:00 AM');
      setAddress('Flat 402, Green Park Apartments, New Delhi');
      setNotes(worker?.trade === 'Cleaner' ? 'Please bring standard cleaning supplies.' : 'Please bring standard tools and replacements.');
      setIsSubmitting(false);
      setBookingCode('');
    }
  }, [isOpen, worker]);

  if (!isOpen) return null;

  const defaultWorker: Worker = worker || {
    id: 'w-101',
    name: 'Rajesh Kumar',
    trade: selectedTrades[0] || 'Electrician',
    rating: 4.8,
    reviewsCount: 128,
    coopName: 'Delhi Labour Cooperative Federation',
    hourlyRate: '₹400–₹700 / visit',
    workerId: 'WORKER-DEL-8901'
  };

  // Base rate calculation per worker
  const baseRatePerWorker = 500;
  const shiftMultiplier = shiftType === 'HALF_DAY' ? 0.6 : shiftType === 'HOURLY' ? 0.3 : 1.0;
  const shiftLabel = shiftType === 'HALF_DAY' ? 'Half Day (4 hrs)' : shiftType === 'HOURLY' ? 'Hourly Visit' : 'Full Day (8 hrs)';

  const calculatedSingleRate = worker?.hourlyRate || '₹400–₹700 / visit';
  const calculatedTeamRate = `₹${Math.round(baseRatePerWorker * workerCount * shiftMultiplier)} (${workerCount} Workers • ${shiftLabel})`;

  const estimatedDisplayCost = bookingMode === 'SINGLE' ? calculatedSingleRate : calculatedTeamRate;

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedCode = `BK-${Date.now().toString().slice(-4)}`;
      setBookingCode(generatedCode);
      const newBooking = {
        id: generatedCode,
        service: serviceType,
        bookingType: bookingMode,
        workerCount: bookingMode === 'SINGLE' ? 1 : workerCount,
        shiftType: bookingMode === 'MULTIPLE' ? shiftType : undefined,
        workerName: bookingMode === 'SINGLE' 
          ? defaultWorker.name 
          : `${defaultWorker.name} (Lead) + ${workerCount - 1} Crew Members`,
        workerTrade: defaultWorker.trade,
        workerId: defaultWorker.workerId,
        coopName: defaultWorker.coopName,
        date: bookingDate,
        time: bookingTime,
        address,
        estimatedCost: estimatedDisplayCost,
        status: 'REQUESTED',
        createdAt: new Date().toISOString()
      };
      onBookingSuccess(newBooking);
      setCurrentStep(6); // Success Step
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#3b82f6']
      });
    }, 800);
  };

  const handlePrintPDF = () => {
    const printContent = `
      <html>
        <head>
          <title>Booking Receipt - ${bookingCode}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #0f172a; }
            h1 { color: #059669; font-size: 24px; margin-bottom: 5px; }
            .header-sub { font-size: 14px; color: #64748b; margin-bottom: 30px; }
            .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; }
            .row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
            .label { color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; }
            .value { font-weight: 600; font-size: 15px; }
            .footer { margin-top: 40px; font-size: 11px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <h1>SahkariGig Booking Receipt</h1>
          <div class="header-sub">Verified Cooperative Services</div>
          
          <div class="card">
            <div class="row">
              <span class="label">Booking Code</span>
              <span class="value" style="color: #059669;">${bookingCode}</span>
            </div>
            <div class="row">
              <span class="label">Booking Type</span>
              <span class="value">${bookingMode === 'SINGLE' ? 'Single Worker Booking' : `Multiple Workers Crew (${workerCount} Workers)`}</span>
            </div>
            <div class="row">
              <span class="label">Service</span>
              <span class="value">${serviceType}</span>
            </div>
            <div class="row">
              <span class="label">${bookingMode === 'SINGLE' ? 'Assigned Professional' : 'Assigned Crew & Supervisor'}</span>
              <span class="value">${bookingMode === 'SINGLE' ? defaultWorker.name : `${defaultWorker.name} (Supervisor) + ${workerCount - 1} Workers`} (${defaultWorker.coopName})</span>
            </div>
            <div class="row">
              <span class="label">Schedule</span>
              <span class="value">${bookingDate} at ${bookingTime} ${bookingMode === 'MULTIPLE' ? `(${shiftLabel})` : ''}</span>
            </div>
            <div class="row">
              <span class="label">Location</span>
              <span class="value">${address}</span>
            </div>
            <div class="row">
              <span class="label">Estimated Rate</span>
              <span class="value">${estimatedDisplayCost}</span>
            </div>
            <div class="row">
              <span class="label">Status</span>
              <span class="value" style="color: #059669;">REQUESTED</span>
            </div>
          </div>
          
          <div class="footer">
            Keep this receipt for your records. The cooperative team will arrive at the scheduled time.
          </div>
        </body>
      </html>
    `;
    const printWindow = window.open('', '', 'width=800,height=800');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const steps = [
    { num: 1, label: 'Service' },
    { num: 2, label: bookingMode === 'SINGLE' ? 'Worker' : 'Crew' },
    { num: 3, label: 'Schedule' },
    { num: 4, label: 'Address' },
    { num: 5, label: 'Review' }
  ];

  const tradeIcons: Record<string, React.ReactNode> = {
    'Electrician': <Zap className="w-5 h-5 mb-1.5 opacity-80" />,
    'Plumber': <Droplet className="w-5 h-5 mb-1.5 opacity-80" />,
    'Carpenter': <Hammer className="w-5 h-5 mb-1.5 opacity-80" />,
    'Painter': <Paintbrush className="w-5 h-5 mb-1.5 opacity-80" />,
    'Domestic Help': <Home className="w-5 h-5 mb-1.5 opacity-80" />,
    'Domestic Helper': <Home className="w-5 h-5 mb-1.5 opacity-80" />,
    'Caregiver': <HeartHandshake className="w-5 h-5 mb-1.5 opacity-80" />,
    'Driver': <Car className="w-5 h-5 mb-1.5 opacity-80" />,
    'Gardener': <Trees className="w-5 h-5 mb-1.5 opacity-80" />,
    'Cleaner': <Sparkles className="w-5 h-5 mb-1.5 opacity-80" />,
    'Technician': <Cog className="w-5 h-5 mb-1.5 opacity-80" />
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[94vh] max-h-[720px] rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row my-auto transition-all duration-300">
        
        {/* Persistent Summary Sidebar */}
        <div className="w-full md:w-80 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white p-6 md:p-7 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-800 shrink-0">
          {/* Decorative subtle ambient glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-400 bg-emerald-950/90 px-3 py-1 rounded-lg border border-emerald-800/80 shadow-xs">
                Booking Summary
              </span>
              <span className="text-xs font-semibold text-slate-400">Step {currentStep} of 5</span>
            </div>

            <div className="space-y-4">
              {/* Booking Mode Badge */}
              <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700/70 flex items-center space-x-3 shadow-inner">
                <div className={`p-2 rounded-xl ${bookingMode === 'SINGLE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-500/20 text-sky-400'}`}>
                  {bookingMode === 'SINGLE' ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Booking Mode</span>
                  <p className="text-xs font-bold text-slate-100">
                    {bookingMode === 'SINGLE' ? 'Single Professional' : `Crew of ${workerCount} Workers`}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1.5">Selected Services</span>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
                  {selectedTrades.map((t) => (
                    <span 
                      key={t}
                      className="inline-flex items-center text-xs font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 px-2.5 py-1 rounded-lg"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/90">
                <span className="text-[10px] text-slate-400 uppercase font-medium">
                  {bookingMode === 'SINGLE' ? 'Assigned Professional' : 'Assigned Crew & Supervisor'}
                </span>
                <div className="flex items-center space-x-3 mt-1.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {bookingMode === 'SINGLE' ? defaultWorker.name.charAt(0) : <Users className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">
                      {bookingMode === 'SINGLE' ? defaultWorker.name : `${defaultWorker.name} (Lead)`}
                    </p>
                    <div className="flex items-center text-xs text-amber-400 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400 mr-1" />
                      <span>{defaultWorker.rating} ★ Cooperative Rated</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/90">
                <span className="text-[10px] text-slate-400 uppercase font-medium">Scheduled Time</span>
                <p className="text-xs font-semibold text-slate-200 flex items-center mt-1">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  {bookingDate}, {bookingTime}
                </p>
                {bookingMode === 'MULTIPLE' && (
                  <p className="text-[11px] text-slate-400 mt-0.5 ml-4.5">
                    Duration: {shiftLabel}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/90">
                <span className="text-[10px] text-slate-400 uppercase font-medium">Estimated Rate</span>
                <p className="text-base font-extrabold text-emerald-400 mt-0.5">{estimatedDisplayCost}</p>
                <p className="text-[10px] text-slate-500">Zero commission fee • 100% worker payout</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mr-1.5 shrink-0" />
            <span>Cooperative Network Guarantee</span>
          </div>
        </div>

        {/* Multi-step Form Content */}
        <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between bg-white dark:bg-slate-900 transition-colors overflow-hidden">
          
          {/* Header & Step Indicator */}
          <div className="shrink-0">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-outfit">
                  {currentStep === 6 ? 'Booking Confirmed' : 'Book a Service'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct booking or cooperative syndicate crew dispatch
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Progress Bar - Perfectly Aligned Segmented System */}
            {currentStep <= 5 && (
              <div className="mb-4 mt-3">
                <div className="grid grid-cols-5 gap-2">
                  {steps.map((s) => {
                    const isCompleted = currentStep > s.num;
                    const isActive = currentStep === s.num;
                    return (
                      <button
                        key={s.num}
                        type="button"
                        onClick={() => {
                          if (s.num < currentStep) setCurrentStep(s.num);
                        }}
                        disabled={s.num > currentStep}
                        className={`group text-left transition-all duration-200 ${
                          s.num < currentStep ? 'cursor-pointer' : 'cursor-default'
                        }`}
                      >
                        {/* Step Label & Number Badge */}
                        <div className="flex items-center space-x-1.5 mb-1.5">
                          <span
                            className={`text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                              isCompleted
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : isActive
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 ring-2 ring-emerald-500 font-extrabold'
                                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                            }`}
                          >
                            {isCompleted ? '✓' : s.num}
                          </span>
                          <span
                            className={`text-xs font-bold truncate transition-colors ${
                              isActive
                                ? 'text-emerald-700 dark:text-emerald-400 font-extrabold'
                                : isCompleted
                                ? 'text-slate-700 dark:text-slate-300'
                                : 'text-slate-400 dark:text-slate-500 font-medium'
                            }`}
                          >
                            {s.label}
                          </span>
                        </div>

                        {/* Aligned Line Segment for Each Step */}
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ease-out ${
                              s.num <= currentStep
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                                : 'bg-transparent'
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Scrollable Step Content Body */}
          <div className="flex-1 overflow-y-auto pr-1 py-1">
            {/* Step 1: Booking Type (Single vs Multiple) & Select Trade */}
            {currentStep === 1 && (
              <div className="space-y-4">
                {/* Dual Mode Switcher Banner */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                    Select Booking Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => handleSetBookingMode('SINGLE')}
                      className={`p-3 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                        bookingMode === 'SINGLE'
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md border border-emerald-500'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-xl ${bookingMode === 'SINGLE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200/70 text-slate-500 dark:bg-slate-800'}`}>
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-xs sm:text-sm">Single Worker</p>
                          <p className="text-[11px] text-slate-500 hidden sm:block">1 Professional for routine fix</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        bookingMode === 'SINGLE' ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {bookingMode === 'SINGLE' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSetBookingMode('MULTIPLE')}
                      className={`p-3 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                        bookingMode === 'MULTIPLE'
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md border border-emerald-500'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-xl ${bookingMode === 'MULTIPLE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200/70 text-slate-500 dark:bg-slate-800'}`}>
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-xs sm:text-sm">Multiple Workers</p>
                          <p className="text-[11px] text-slate-500 hidden sm:block">Team / Crew for projects</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        bookingMode === 'MULTIPLE' ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {bookingMode === 'MULTIPLE' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Multiple Workers Counter & Shift Setup */}
                {bookingMode === 'MULTIPLE' && (
                  <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/90 dark:border-emerald-800/40 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center">
                          <HardHat className="w-4 h-4 text-emerald-600 mr-1.5" />
                          Number of Workers Required
                        </span>
                        <p className="text-[11px] text-slate-500">Includes 1 cooperative supervisor + skilled crew</p>
                      </div>
                      
                      {/* Counter Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setWorkerCount(Math.max(2, workerCount - 1))}
                          disabled={workerCount <= 2}
                          className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 disabled:opacity-40 transition-all cursor-pointer shadow-xs active:scale-95"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-emerald-500 rounded-xl text-sm font-extrabold text-emerald-700 dark:text-emerald-400 min-w-[3.2rem] text-center shadow-xs">
                          {workerCount}
                        </div>
                        <button
                          type="button"
                          onClick={() => setWorkerCount(Math.min(30, workerCount + 1))}
                          disabled={workerCount >= 30}
                          className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 disabled:opacity-40 transition-all cursor-pointer shadow-xs active:scale-95"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex flex-wrap gap-1.5 pt-1 border-t border-emerald-200/60 dark:border-emerald-800/30">
                      {[
                        { count: 2, label: '2 (Pair)' },
                        { count: 4, label: '4 (Standard Team)' },
                        { count: 6, label: '6 (Heavy Crew)' },
                        { count: 10, label: '10+ (Project Gang)' }
                      ].map((preset) => (
                        <button
                          key={preset.count}
                          type="button"
                          onClick={() => setWorkerCount(preset.count)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            workerCount === preset.count
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Shift Duration Type */}
                    <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/30 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Shift Duration:</span>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setShiftType('HALF_DAY')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            shiftType === 'HALF_DAY'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          Half Day (4h)
                        </button>
                        <button
                          type="button"
                          onClick={() => setShiftType('FULL_DAY')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            shiftType === 'FULL_DAY'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          Full Day (8h)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Trade Selector - Single Select for Single Worker, Multi-Select for Multiple Workers */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      {bookingMode === 'SINGLE' ? 'Select Required Trade' : 'Select Required Trades (Multi-Select)'}
                    </h3>
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      {bookingMode === 'SINGLE' 
                        ? `${selectedTrades[0] || '1 Trade'} Selected` 
                        : `${selectedTrades.length} ${selectedTrades.length > 1 ? 'Trades Selected' : 'Trade Selected'}`}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-52 overflow-y-auto pr-1">
                    {['Electrician', 'Plumber', 'Carpenter', 'Painter', 'Domestic Helper', 'Caregiver', 'Driver', 'Gardener', 'Cleaner', 'Technician'].map((trade) => {
                      const isSelected = selectedTrades.includes(trade);
                      return (
                        <button
                          key={trade}
                          type="button"
                          onClick={() => handleTradeClick(trade)}
                          className={`p-3 rounded-2xl border text-left font-semibold text-xs sm:text-sm flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 shadow-sm ring-1 ring-emerald-500'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-emerald-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          <div className="w-full flex items-center justify-between mb-1">
                            <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                              {tradeIcons[trade]}
                            </div>
                            
                            {/* Single Worker mode: Radio Button; Multiple Workers mode: Checkbox */}
                            {bookingMode === 'SINGLE' ? (
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                isSelected 
                                  ? 'border-emerald-500 bg-emerald-500 text-white shadow-xs' 
                                  : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900'
                              }`}>
                                {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                              </div>
                            ) : (
                              <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center transition-all ${
                                isSelected 
                                  ? 'bg-emerald-600 text-white shadow-xs' 
                                  : 'border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            )}
                          </div>
                          <span className="mt-1 font-bold text-xs sm:text-sm">{trade}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Confirm Worker or Crew Profile */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
                  {bookingMode === 'SINGLE' ? 'Verified Professional Profile' : 'Cooperative Crew Assignment'}
                </h3>
                
                {bookingMode === 'SINGLE' ? (
                  <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex flex-col space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                          {defaultWorker.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-base">{defaultWorker.name}</h4>
                          <p className="text-xs text-slate-500">{defaultWorker.coopName}</p>
                          <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-lg mt-1 border border-emerald-200 dark:border-emerald-800">
                            Verified Craftsman
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-3 py-1.5 rounded-xl flex items-center shadow-xs">
                        {defaultWorker.rating} <Star className="w-3.5 h-3.5 ml-1 fill-emerald-700 dark:fill-emerald-300 inline" />
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
                      <p className="font-mono font-medium">ID: {defaultWorker.workerId}</p>
                      <p>{defaultWorker.reviewsCount} verified customer reviews</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
                          <Users className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-base">
                            Crew of {workerCount} {serviceType} Professionals
                          </h4>
                          <p className="text-xs text-slate-500">{defaultWorker.coopName}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-3 py-1.5 rounded-xl shadow-xs">
                        Syndicate Certified
                      </span>
                    </div>

                    {/* Crew Breakdown List */}
                    <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                      <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 flex items-center justify-between text-xs shadow-xs">
                        <div className="flex items-center space-x-3">
                          <HardHat className="w-5 h-5 text-amber-500 shrink-0" />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{defaultWorker.name} (Lead Supervisor)</p>
                            <p className="text-[11px] text-slate-500">On-site quality controller & safety manager</p>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-lg">Assigned</span>
                      </div>

                      <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 flex items-center justify-between text-xs shadow-xs">
                        <div className="flex items-center space-x-3">
                          <Briefcase className="w-5 h-5 text-emerald-600 shrink-0" />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{workerCount - 1} Certified Trade Technicians</p>
                            <p className="text-[11px] text-slate-500">Background checked, skill verified & insured</p>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-lg">Group Ready</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center space-x-2 text-[11px] text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Includes full tools kit, safety helmets & group insurance coverage</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Date & Time */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">Choose Visit Time</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Select Date</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { val: 'Today', title: 'Today', subtitle: 'Within 2 Hours' },
                        { val: 'Tomorrow', title: 'Tomorrow', subtitle: 'Recommended' },
                        { val: 'Day After Tomorrow', title: 'Day After', subtitle: 'Advance Booking' }
                      ].map((d) => (
                        <button
                          key={d.val}
                          type="button"
                          onClick={() => setBookingDate(d.val)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            bookingDate === d.val
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500 shadow-sm'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-300'
                          }`}
                        >
                          <p className="font-bold text-xs sm:text-sm">{d.title}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{d.subtitle}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Time Slot</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { time: '09:00 AM', label: '09:00 AM – 11:00 AM', period: 'Morning' },
                        { time: '10:00 AM', label: '10:00 AM – 12:00 PM', period: 'Morning Slot' },
                        { time: '02:00 PM', label: '02:00 PM – 04:00 PM', period: 'Afternoon' },
                        { time: '05:00 PM', label: '05:00 PM – 07:00 PM', period: 'Evening' }
                      ].map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => setBookingTime(slot.time)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            bookingTime === slot.time
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500 shadow-sm'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-300'
                          }`}
                        >
                          <div className="flex items-center space-x-1.5 text-xs font-bold">
                            <Clock className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{slot.label}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 mt-0.5 block">{slot.period}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Address */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">Service Location & Notes</h3>
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">Complete Address</label>
                    <div className="relative">
                      <textarea
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-3.5 pl-9 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none shadow-xs"
                        placeholder="Enter flat, building, and street..."
                      />
                      <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-4" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                      {bookingMode === 'SINGLE' ? 'Instructions for Worker' : 'Project Requirements & Site Access'}
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-3.5 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none shadow-xs"
                      placeholder="Any specific tools needed, scope of work, or gate instructions..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">Final Booking Review</h3>
                <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2.5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Booking Mode</span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                      {bookingMode === 'SINGLE' ? '👤 Single Professional' : `👥 Crew of ${workerCount} Workers (${shiftLabel})`}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2.5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Services</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{serviceType}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2.5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      {bookingMode === 'SINGLE' ? 'Professional' : 'Supervisor & Crew'}
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white text-right">
                      {bookingMode === 'SINGLE' ? defaultWorker.name : `${defaultWorker.name} (Lead) + ${workerCount - 1} Workers`}
                      <br/>
                      <span className="text-xs text-slate-500 font-normal">{defaultWorker.coopName}</span>
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2.5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Schedule</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white text-right">
                      {bookingDate}
                      <br/>
                      <span className="text-xs text-slate-500 font-normal">{bookingTime}</span>
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2.5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Estimated Cost</span>
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{estimatedDisplayCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Location</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white text-right max-w-[60%]">{address}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Success Confirmation */}
            {currentStep === 6 && (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-outfit">Booking Requested Successfully!</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  {bookingMode === 'SINGLE' ? (
                    <>Your service booking has been dispatched to <span className="font-bold text-slate-900 dark:text-white">{defaultWorker.name}</span> via the Cooperative Dispatcher.</>
                  ) : (
                    <>Your team booking for <span className="font-bold text-slate-900 dark:text-white">{workerCount} {serviceType} Workers</span> has been dispatched under supervisor <span className="font-bold text-slate-900 dark:text-white">{defaultWorker.name}</span>.</>
                  )}
                </p>
                <div className="inline-block bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-4 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-xs">
                  Status: REQUESTED • Ref: {bookingCode}
                </div>
              </div>
            )}
          </div>

          {/* Footer Navigation Buttons */}
          <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            {currentStep > 1 && currentStep <= 5 && (
              <button
                onClick={handlePrevStep}
                className="px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            {currentStep < 5 && (
              <button
                onClick={handleNextStep}
                className="ml-auto px-7 py-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-emerald-500/25 transition-all duration-200 flex items-center space-x-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {currentStep === 5 && (
              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="ml-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-70 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                {isSubmitting ? 'Confirming...' : bookingMode === 'SINGLE' ? 'Confirm & Dispatch Professional' : `Confirm & Dispatch Crew (${workerCount} Workers)`}
              </button>
            )}

            {currentStep === 6 && (
              <div className="flex w-full space-x-3">
                <button
                  onClick={handlePrintPDF}
                  className="w-1/3 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print PDF</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    if (onTrackBooking) {
                      onTrackBooking();
                    }
                  }}
                  className="w-2/3 py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  Close & Track Booking
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
