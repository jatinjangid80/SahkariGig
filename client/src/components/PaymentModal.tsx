import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: any;
  onPaymentSubmitted?: (status: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  booking,
  onPaymentSubmitted
}) => {
  const [paymentState, setPaymentState] = useState<'PENDING' | 'CUSTOMER_CLAIMED_PAID' | 'PAID'>('PENDING');
  const [utrNumber, setUtrNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleClaimPaid = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setPaymentState('CUSTOMER_CLAIMED_PAID');
      if (onPaymentSubmitted) onPaymentSubmitted('CUSTOMER_CLAIMED_PAID');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base font-outfit">UPI Service Payment</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Amount Box */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Service Fee Payable</span>
            <p className="text-3xl font-extrabold text-slate-900 font-outfit mt-1">
              {booking?.amount || '₹600'}
            </p>
            <p className="text-[11px] text-slate-600 mt-1">
              Beneficiary: <span className="font-semibold text-slate-900">Delhi Labour Cooperative Federation</span>
            </p>
          </div>

          {/* UPI Payment Info */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">UPI VPA:</span>
              <span className="font-bold text-slate-900 font-mono">janseva.coop@upi</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Service Trade:</span>
              <span className="font-semibold text-slate-900">{booking?.service || 'Electrician'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Assigned Professional:</span>
              <span className="font-semibold text-slate-900">{booking?.workerName || 'Rajesh Kumar'}</span>
            </div>
          </div>

          {paymentState === 'PENDING' ? (
            <form onSubmit={handleClaimPaid} className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  UPI Transaction Ref / UTR Number (Optional)
                </label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. 329104891024"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                {isSubmitting ? 'Recording Claim...' : 'I Have Transferred Payment via UPI'}
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center space-y-2">
              <Clock className="w-8 h-8 text-amber-600 mx-auto" />
              <h4 className="font-bold text-amber-900 text-sm">Payment Claim Submitted</h4>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-200 text-amber-900">
                CUSTOMER_CLAIMED_PAID
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your payment claim is pending verification by the cooperative worker/dispatcher upon job completion.
              </p>
              <button
                onClick={onClose}
                className="w-full py-2 bg-slate-900 text-white font-semibold text-xs rounded-lg mt-2"
              >
                Done
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
