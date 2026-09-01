import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: any;
  onPaymentSubmitted?: (status: string) => void;
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  booking,
  onPaymentSubmitted
}) => {
  const [paymentState, setPaymentState] = useState<'PENDING' | 'CUSTOMER_CLAIMED_PAID' | 'PAID'>(booking?.paymentStatus || 'PENDING');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleRazorpayPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      setIsSubmitting(false);
      return;
    }

    try {
      const bookingId = booking?.id || booking?.bookingCode;
      if (!bookingId) {
        throw new Error('Booking ID is missing');
      }

      // Determine correct API URL (relative on Vercel, localhost:5001 for local dev)
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const baseUrl = import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:5001' : '');

      // Create order
      const apiRes = await fetch(`${baseUrl}/api/payments/create-order`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookingId })
      });
      
      const data = await apiRes.json();
      
      if (!apiRes.ok) {
        throw new Error(data.message || 'Failed to create payment order');
      }

      const { order } = data.data;

      // Init Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_replace_me',
        amount: order.amount,
        currency: order.currency,
        name: 'Cooperative Gig Services',
        description: `Payment for ${booking?.service}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyRes = await fetch(`${baseUrl}/api/payments/verify`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: bookingId
              })
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
              alert(verifyData.message || 'Payment verification failed');
            } else {
              setPaymentState('PAID');
              if (onPaymentSubmitted) onPaymentSubmitted('PAID');
            }
          } catch (err) {
            console.error(err);
            alert('An error occurred during payment verification.');
          }
        },
        prefill: {
          name: booking?.customerName || 'Customer',
        },
        theme: {
          color: '#10b981'
        }
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on('payment.failed', function (response: any){
        alert(response.error.description);
      });
      rzp1.open();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Payment initialization failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base font-outfit">Secure Payment</h3>
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

          {/* Payment Info */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Payment Gateway:</span>
              <span className="font-bold text-slate-900 font-mono">Razorpay (Secure)</span>
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
            <form onSubmit={handleRazorpayPayment} className="space-y-4 pt-2 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>{isSubmitting ? 'Initializing...' : 'Pay Securely with Razorpay'}</span>
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-900 text-sm">Payment Successful</h4>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-200 text-emerald-900">
                PAID
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your payment has been successfully verified. The booking is now confirmed.
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
