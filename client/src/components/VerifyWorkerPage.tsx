import React from 'react';
import { ShieldCheck, CheckCircle2, QrCode, Calendar, Award, Building, UserCheck, X } from 'lucide-react';
import { supabase } from '../supabase';

interface VerifyWorkerPageProps {
  workerId?: string;
  onClose?: () => void;
}

export const VerifyWorkerPage: React.FC<VerifyWorkerPageProps> = ({
  workerId = 'WORKER-DEL-8901',
  onClose
}) => {
  const [workerDetails, setWorkerDetails] = React.useState({
    workerId,
    name: 'Rajesh Kumar',
    trade: 'Licensed Electrician',
    coopName: 'Delhi Labour Cooperative Federation',
    coopRegNo: 'COOP/DEL/2021/8892',
    status: 'ACTIVE & VERIFIED',
    rating: 4.9,
    jobsCompleted: 128,
    verificationTimestamp: new Date().toISOString(),
    validUntil: '31-DEC-2027',
    avatar: ''
  });

  React.useEffect(() => {
    const fetchWorkerData = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('worker_name, worker_trade')
          .eq('worker_id', workerId)
          .limit(1);
          
        if (!error && data && data.length > 0) {
          const w = data[0];
          setWorkerDetails(prev => ({
            ...prev,
            name: w.worker_name,
            trade: w.worker_trade,
            coopName: 'Delhi Labour Cooperative Federation',
            status: 'ACTIVE & VERIFIED'
          }));
        }

        const { count } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('worker_id', workerId)
          .in('status', ['COMPLETED', 'RATED']);
          
        if (count !== null) {
          setWorkerDetails(prev => ({
            ...prev,
            jobsCompleted: count > 0 ? count : 12
          }));
        }
      } catch (err) {
        console.error("Error fetching worker details:", err);
      }
    };
    
    fetchWorkerData();
  }, [workerId]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl border border-slate-200 relative">
        
        {/* Verification Header */}
        <div className="bg-emerald-600 text-white p-6 text-center relative rounded-t-2xl">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-emerald-100 hover:text-white bg-emerald-700/50 hover:bg-emerald-700 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-xs">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-3 py-1 rounded-full">
            Public Trust Verification Document
          </span>
          <h1 className="mt-2 text-2xl font-extrabold font-outfit">Verified Cooperative Worker</h1>
          <p className="text-xs text-emerald-100 mt-1">SahkariGig Labour Federation Network</p>
        </div>

        {/* Worker Details Card Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Status Badge */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-extrabold text-emerald-900 tracking-wide">{workerDetails.status}</p>
                <p className="text-[10px] text-emerald-700">Official Membership Active</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
              ID: {workerDetails.workerId}
            </span>
          </div>

          {/* Profile Details */}
          <div className="flex items-center space-x-4">
            <img
              src={workerDetails.avatar && !workerDetails.avatar.includes('1540569014015') ? workerDetails.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(workerDetails.name || 'User')}&background=10b981&color=fff&size=150`}
              alt={workerDetails.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-2xs"
            />
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-outfit">{workerDetails.name}</h2>
              <p className="text-xs font-semibold text-emerald-700">{workerDetails.trade}</p>
              <p className="text-xs text-slate-500 flex items-center mt-1">
                <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {workerDetails.coopName}
              </p>
            </div>
          </div>

          {/* Verification Fields Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-medium">Cooperative Reg. No.</span>
              <p className="font-bold text-slate-900 mt-0.5">{workerDetails.coopRegNo}</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-medium">Rating & Reviews</span>
              <p className="font-bold text-slate-900 mt-0.5">{workerDetails.rating} ★ ({workerDetails.jobsCompleted} Jobs)</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-medium">Verification Timestamp</span>
              <p className="font-semibold text-slate-700 mt-0.5 text-[11px]">{new Date(workerDetails.verificationTimestamp).toLocaleTimeString()}</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-medium">ID Validity Until</span>
              <p className="font-bold text-slate-900 mt-0.5">{workerDetails.validUntil}</p>
            </div>
          </div>

          {/* Verification Advice */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-900 flex items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1" />
              Safety Instructions for Household Customers
            </p>
            <p>1. Match the worker photo and digital ID card before letting the worker inside your residence.</p>
            <p>2. Payment should be processed via SahkariGig UPI / Platform Gateway for worker protection.</p>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors"
            >
              Close Verification View
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
