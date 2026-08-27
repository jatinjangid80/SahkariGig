import React, { useState } from 'react';
import { X, CheckCircle, Calendar, MapPin, ShieldCheck, Star, Clock, ArrowRight, ArrowLeft } from 'lucide-react';

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
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  worker,
  onBookingSuccess
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [serviceType, setServiceType] = useState(worker?.trade || 'Electrician');
  const [bookingDate, setBookingDate] = useState('Tomorrow');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [address, setAddress] = useState('Flat 402, Green Park Apartments, New Delhi');
  const [notes, setNotes] = useState('Please bring standard multimeter and MCB replacements.');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const newBooking = {
        id: `bk-${Date.now().toString().slice(-4)}`,
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
    }, 800);
  };

  const steps = [
    { num: 1, label: 'Service' },
    { num: 2, label: 'Worker' },
    { num: 3, label: 'Schedule' },
    { num: 4, label: 'Address' },
    { num: 5, label: 'Review' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row my-8">
        
        {/* Persistent Summary Sidebar */}
        <div className="w-full md:w-72 bg-slate-900 text-white p-6 flex flex-col justify-between">
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
            <span>Ministry of Cooperation Guarantee</span>
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

            {/* Step Progress Pills */}
            {currentStep <= 5 && (
              <div className="flex items-center space-x-2 my-6 overflow-x-auto pb-1">
                {steps.map((s) => (
                  <div
                    key={s.num}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      currentStep === s.num
                        ? 'bg-emerald-600 text-white'
                        : currentStep > s.num
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <span>{s.num}.</span>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Step 1: Select Service */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Select Required Trade</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Electrician', 'Plumber', 'Carpenter', 'Painter', 'Domestic Help', 'Caregiver'].map((trade) => (
                    <button
                      key={trade}
                      onClick={() => setServiceType(trade)}
                      className={`p-3 rounded-xl border text-left font-semibold text-xs transition-all ${
                        serviceType === trade
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {trade}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Confirm Worker */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Verified Worker Profile</h3>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-base">{defaultWorker.name}</h4>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {defaultWorker.rating} ★ ({defaultWorker.reviewsCount} reviews)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{defaultWorker.coopName}</p>
                  <p className="text-xs font-semibold text-slate-800">ID: {defaultWorker.workerId}</p>
                </div>
              </div>
            )}

            {/* Step 3: Date & Time */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Choose Visit Time</h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <select
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 text-slate-900"
                  >
                    <option value="Today">Today (Within 2 Hours)</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Day After Tomorrow">Day After Tomorrow</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 text-slate-900"
                  >
                    <option value="09:00 AM">09:00 AM – 11:00 AM</option>
                    <option value="10:00 AM">10:00 AM – 12:00 PM</option>
                    <option value="02:00 PM">02:00 PM – 04:00 PM</option>
                    <option value="05:00 PM">05:00 PM – 07:00 PM</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 4: Address */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Service Location & Notes</h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Complete Address</label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Instructions for Worker</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 text-slate-900"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="space-y-4 text-xs text-slate-700">
                <h3 className="text-sm font-bold text-slate-900">Final Booking Review</h3>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <p><span className="font-semibold text-slate-900">Service:</span> {serviceType}</p>
                  <p><span className="font-semibold text-slate-900">Worker:</span> {defaultWorker.name} ({defaultWorker.coopName})</p>
                  <p><span className="font-semibold text-slate-900">Schedule:</span> {bookingDate}, {bookingTime}</p>
                  <p><span className="font-semibold text-slate-900">Address:</span> {address}</p>
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
                className="ml-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                {isSubmitting ? 'Confirming...' : 'Confirm & Dispatch Booking'}
              </button>
            )}

            {currentStep === 6 && (
              <button
                onClick={onClose}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Close & Track Booking
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
