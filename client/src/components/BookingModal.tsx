import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Calendar, MapPin, ShieldCheck, Star, Clock, ArrowRight, ArrowLeft, Printer, Zap, Droplet, Hammer, Paintbrush, Home, Heart, HeartHandshake, Car, Trees, Sparkles, Cog } from 'lucide-react';
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
  const [serviceType, setServiceType] = useState(worker?.trade || 'Electrician');
  const [bookingDate, setBookingDate] = useState('Tomorrow');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [address, setAddress] = useState('Flat 402, Green Park Apartments, New Delhi');
  const [notes, setNotes] = useState('Please bring standard multimeter and MCB replacements.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingCode, setBookingCode] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setServiceType(worker?.trade || 'Electrician');
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
    trade: serviceType,
    rating: 4.8,
    reviewsCount: 128,
    coopName: 'Delhi Labour Cooperative Federation',
    hourlyRate: '₹400–₹700 / visit',
    workerId: 'WORKER-DEL-8901'
  };

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
        workerName: defaultWorker.name,
        workerTrade: defaultWorker.trade,
        workerId: defaultWorker.workerId,
        coopName: defaultWorker.coopName,
        date: bookingDate,
        time: bookingTime,
        address,
        estimatedCost: defaultWorker.hourlyRate,
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
              <span class="label">Service</span>
              <span class="value">${serviceType}</span>
            </div>
            <div class="row">
              <span class="label">Professional</span>
              <span class="value">${defaultWorker.name} (${defaultWorker.coopName})</span>
            </div>
            <div class="row">
              <span class="label">Schedule</span>
              <span class="value">${bookingDate} at ${bookingTime}</span>
            </div>
            <div class="row">
              <span class="label">Location</span>
              <span class="value">${address}</span>
            </div>
            <div class="row">
              <span class="label">Rate</span>
              <span class="value">${defaultWorker.hourlyRate}</span>
            </div>
            <div class="row">
              <span class="label">Status</span>
              <span class="value" style="color: #059669;">REQUESTED</span>
            </div>
          </div>
          
          <div class="footer">
            Keep this receipt for your records. The professional will arrive at the scheduled time.
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
    { num: 2, label: 'Worker' },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row my-8 transition-all duration-300 transform">
        
        {/* Persistent Summary Sidebar */}
        <div className="w-full md:w-80 bg-gradient-to-b from-slate-900 to-slate-950 text-white p-7 flex flex-col justify-between relative overflow-hidden">
          {/* Decorative subtle element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800">
                Booking Summary
              </span>
              <span className="text-xs text-slate-400">Step {currentStep} of 5</span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium">Selected Service</span>
                <p className="font-bold text-lg text-white font-outfit">{serviceType}</p>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-medium">Assigned Professional</span>
                <div className="flex items-center space-x-3 mt-1">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                    {defaultWorker.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{defaultWorker.name}</p>
                    <div className="flex items-center text-xs text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400 mr-1" />
                      <span>{defaultWorker.rating} ★</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-medium">Scheduled Time</span>
                <p className="text-xs font-semibold text-slate-200 flex items-center mt-1">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  {bookingDate}, {bookingTime}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-medium">Estimated Visit Rate</span>
                <p className="text-sm font-extrabold text-emerald-400">{defaultWorker.hourlyRate}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mr-1.5 shrink-0" />
            <span>Cooperative Network Guarantee</span>
          </div>
        </div>

        {/* Multi-step Form Content */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between bg-white">
          
          {/* Header & Step Indicator */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-xl font-extrabold text-slate-900 font-outfit">
                {currentStep === 6 ? 'Booking Confirmed' : 'Book a Service'}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Redesign - Progress Bar */}
            {currentStep <= 5 && (
              <div className="mb-8 mt-2">
                <div className="flex items-center justify-between mb-2">
                  {steps.map((s) => (
                    <div key={s.num} className={`text-xs font-bold transition-colors duration-300 ${currentStep >= s.num ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {s.label}
                    </div>
                  ))}
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  {steps.map((s) => (
                    <div 
                      key={s.num} 
                      className={`h-full flex-1 transition-all duration-500 ease-in-out ${currentStep >= s.num ? 'bg-emerald-500' : 'bg-transparent'} ${s.num < steps.length ? 'border-r border-slate-100/30' : ''}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Select Service */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <h3 className="text-base font-bold text-slate-900 font-outfit">Select Required Trade</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {['Electrician', 'Plumber', 'Carpenter', 'Painter', 'Domestic Helper', 'Caregiver', 'Driver', 'Gardener', 'Cleaner', 'Technician'].map((trade) => (
                    <button
                      key={trade}
                      onClick={() => setServiceType(trade)}
                      className={`p-4 rounded-2xl border text-left font-semibold text-sm flex flex-col items-start transition-all duration-300 ${
                        serviceType === trade
                          ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 shadow-[0_0_0_1px_rgba(16,185,129,1)] scale-[1.02]'
                          : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50 hover:shadow-sm text-slate-700'
                      }`}
                    >
                      <div className={serviceType === trade ? 'text-emerald-600' : 'text-slate-500'}>
                        {tradeIcons[trade]}
                      </div>
                      <span className="mt-1">{trade}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Confirm Worker */}
            {/* Step 2: Confirm Worker */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-base font-bold text-slate-900 font-outfit">Verified Worker Profile</h3>
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{defaultWorker.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{defaultWorker.coopName}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md flex items-center">
                      {defaultWorker.rating} <Star className="w-3 h-3 ml-1 fill-emerald-700 inline" />
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <p className="text-xs font-mono font-medium text-slate-500">ID: {defaultWorker.workerId}</p>
                    <p className="text-xs text-slate-500">{defaultWorker.reviewsCount} verified reviews</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Date & Time */}
            {/* Step 3: Date & Time */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-base font-bold text-slate-900 font-outfit">Choose Visit Time</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Date</label>
                    <select
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full p-3.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none shadow-sm"
                    >
                      <option value="Today">Today (Within 2 Hours)</option>
                      <option value="Tomorrow">Tomorrow</option>
                      <option value="Day After Tomorrow">Day After Tomorrow</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Time Slot</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full p-3.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none shadow-sm"
                    >
                      <option value="09:00 AM">09:00 AM – 11:00 AM</option>
                      <option value="10:00 AM">10:00 AM – 12:00 PM</option>
                      <option value="02:00 PM">02:00 PM – 04:00 PM</option>
                      <option value="05:00 PM">05:00 PM – 07:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Address */}
            {/* Step 4: Address */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-base font-bold text-slate-900 font-outfit">Service Location & Notes</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Complete Address</label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-3.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none shadow-sm"
                      placeholder="Enter flat, building, and street..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Instructions for Worker</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-3.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none shadow-sm"
                      placeholder="Any specific tools needed or gate instructions..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-base font-bold text-slate-900 font-outfit">Final Booking Review</h3>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex justify-between border-b border-slate-200 pb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Service</span>
                    <span className="text-sm font-semibold text-slate-900">{serviceType}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Professional</span>
                    <span className="text-sm font-semibold text-slate-900 text-right">{defaultWorker.name}<br/><span className="text-xs text-slate-500 font-normal">{defaultWorker.coopName}</span></span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Schedule</span>
                    <span className="text-sm font-semibold text-slate-900 text-right">{bookingDate}<br/><span className="text-xs text-slate-500 font-normal">{bookingTime}</span></span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Location</span>
                    <span className="text-sm font-semibold text-slate-900 text-right max-w-[60%]">{address}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Success Confirmation */}
            {currentStep === 6 && (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-outfit">Booking Requested Successfully!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your service booking has been dispatched to <span className="font-semibold text-slate-900">{defaultWorker.name}</span> via the Cooperative Dispatcher.
                </p>
                <div className="inline-block bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
                  Status: REQUESTED
                </div>
              </div>
            )}

          </div>

          {/* Footer Buttons */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
            {currentStep > 1 && currentStep <= 5 && (
              <button
                onClick={handlePrevStep}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            {currentStep < 5 && (
              <button
                onClick={handleNextStep}
                className="ml-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors flex items-center space-x-1"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {currentStep === 5 && (
              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="ml-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {isSubmitting ? 'Confirming...' : 'Confirm & Dispatch Booking'}
              </button>
            )}

            {currentStep === 6 && (
              <div className="flex w-full space-x-3">
                <button
                  onClick={handlePrintPDF}
                  className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1"
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
                  className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
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
