import React from 'react';
import { X, Printer, Download, ShieldCheck, CheckCircle2, Building2, UserCheck, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  booking
}) => {
  if (!isOpen || !booking) return null;

  const rawAmount = typeof booking.amount === 'string' 
    ? parseInt(booking.amount.replace(/[^0-9]/g, '')) || 500
    : Number(booking.amount) || 500;

  const workerEarnings = Math.round(rawAmount * 0.95);
  const coopOps = Math.round(rawAmount * 0.03);
  const welfareFund = rawAmount - workerEarnings - coopOps; // Exactly 2%

  const bookingCode = booking.booking_code || booking.id || 'SG-10482';
  const bookingDate = booking.booking_date || booking.date || new Date().toLocaleDateString('en-IN');
  const serviceName = booking.service || booking.trade || 'General Cooperative Service';
  const workerName = booking.worker_name || booking.workerName || 'Rajesh Kumar';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Invoice Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5 mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-xl font-outfit shadow-sm">
              Sg
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white font-outfit flex items-center gap-1.5">
                SahkariGig Cooperative Society
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Reg. No: COOP-RJ-2024-8901 · GSTIN: 08AAACS1234F1Z5
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Tax & Cooperative Invoice
            </span>
            <p className="text-xs text-slate-500 font-bold mt-1">Invoice #{bookingCode}</p>
          </div>
        </div>

        {/* Billing Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs mb-6">
          <div>
            <span className="text-slate-400 font-bold block uppercase text-[10px]">Date of Service</span>
            <span className="font-bold text-slate-900 dark:text-white">{bookingDate}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block uppercase text-[10px]">Payment Status</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400">
              {booking.payment_status === 'PAID' ? '✓ Settled' : 'Pending Escrow'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block uppercase text-[10px]">Assigned Worker</span>
            <span className="font-bold text-slate-900 dark:text-white">{workerName}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block uppercase text-[10px]">Cooperative Union</span>
            <span className="font-bold text-slate-900 dark:text-white truncate block">Jaipur Labour Guild</span>
          </div>
        </div>

        {/* Transparent Money Flow Breakdown Table */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Transparent Cooperative Economics Breakdown
          </h3>
          
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
            <div className="bg-slate-100 dark:bg-slate-800 p-3 font-bold text-slate-700 dark:text-slate-300 flex justify-between">
              <span>Item / Description</span>
              <span>Amount (₹)</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 p-3 space-y-2">
              <div className="flex justify-between items-center py-1">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{serviceName}</p>
                  <p className="text-[11px] text-slate-500">Verified trade service rendered by {workerName}</p>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">₹{rawAmount}</span>
              </div>

              <div className="pt-2 text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5 bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                <div className="flex justify-between font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    Worker Direct Earnings (95%)
                  </span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">₹{workerEarnings}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    Cooperative Operations & Technology (3%)
                  </span>
                  <span>₹{coopOps}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Worker Welfare, Medical & Pension Fund (2%)
                  </span>
                  <span className="font-bold text-amber-700 dark:text-amber-400">₹{welfareFund}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm font-extrabold text-slate-900 dark:text-white">
              <span>Total Paid</span>
              <span className="text-emerald-700 dark:text-emerald-400 text-base">₹{rawAmount}</span>
            </div>
          </div>
        </div>

        {/* QR Verification Seal */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <QRCodeSVG value={`https://sahkari-gig.vercel.app/verify/${bookingCode}`} size={48} />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Digitally Verified Cooperative Receipt</p>
              <p className="text-[11px] text-slate-500">Scan to verify authentic society registration and worker credentials</p>
            </div>
          </div>

          <div className="hidden sm:block text-right">
            <ShieldCheck className="w-8 h-8 text-emerald-600 inline-block mb-1" />
            <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300">Society Certified</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
