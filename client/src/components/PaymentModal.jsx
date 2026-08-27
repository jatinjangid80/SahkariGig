import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { X, CreditCard, ShieldCheck, CheckCircle2, Copy, AlertCircle } from 'lucide-react';

export default function PaymentModal({ booking, onClose, onPaymentClaimSuccess }) {
  const [utrNumber, setUtrNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  if (!booking) return null;

  const upiId = 'janseva.coop@upi';
  const amount = booking.amount || 450;
  const upiUrl = `upi://pay?pa=${upiId}&pn=JanSevaCooperative&am=${amount}&cu=INR&tn=Booking_${booking.id}`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      setError('Please enter the 12-digit UPI UTR / Reference number from your payment app.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token') || 'demo-token';
      const res = await fetch('/api/payments/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId: booking.id,
          utrNumber,
          amount
        })
      });

      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        onPaymentClaimSuccess(data.payment);
      } else {
        setError(data.message || 'Failed to submit payment claim.');
      }
    } catch (err) {
      setError('Error submitting payment claim.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md glass-panel rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Direct UPI Payment</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-center">
          
          <div>
            <span className="text-xs text-slate-400">Total Payable Amount for Booking #{booking.id}</span>
            <p className="text-3xl font-extrabold text-white mt-0.5">₹{amount}</p>
          </div>

          {/* QR Code Container */}
          <div className="p-4 bg-white rounded-2xl inline-block shadow-xl border-4 border-emerald-500/30">
            <QRCodeSVG value={upiUrl} size={160} level="H" />
          </div>

          {/* UPI ID & Copy */}
          <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Federation UPI ID</span>
              <p className="font-mono text-emerald-400 font-bold">{upiId}</p>
            </div>
            <button
              onClick={handleCopyUPI}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center space-x-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* Payment Claim Form */}
          <form onSubmit={handleSubmitClaim} className="space-y-3 text-left">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Enter 12-Digit UPI UTR / Reference No.</label>
              <input
                type="text"
                required
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="e.g. 894102941029"
                className="w-full px-3.5 py-2.5 bg-slate-950 text-white font-mono text-xs rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 gradient-bg hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Submit Payment Claim ("I Have Paid")</span>
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
