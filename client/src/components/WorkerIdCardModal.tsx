import React, { useState, useRef } from 'react';
import { X, ShieldCheck, Download, Building, Star, Clock, MapPin, IndianRupee, Smartphone, CalendarDays, Map } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';

interface WorkerIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker?: any;
}

export const WorkerIdCardModal: React.FC<WorkerIdCardModalProps> = ({
  isOpen,
  onClose,
  worker
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'idcard'>('overview');
  const [isDownloading, setIsDownloading] = useState(false);
  const idCardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const w = worker || {
    name: 'Rajesh Kumar',
    trade: 'Licensed Electrician',
    coopName: 'Delhi Labour Cooperative Federation',
    workerId: 'WORKER-DEL-8901',
    rating: 4.9,
    reviewsCount: 128,
    hourlyRate: '₹400–₹700 / visit',
    distanceKm: 1.8,
    isAvailableToday: true,
    validUntil: '31-DEC-2027',
    avatar: '',
    // New fields requested by user
    mobile: '+91 98765 43210',
    age: 32,
    stateOfBirth: 'Uttar Pradesh',
    serviceState: 'Delhi NCR'
  };

  const hasAvatar = w.avatar && !w.avatar.includes('1540569014015') && !w.avatar.includes('ui-avatars.com');
  
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const downloadPDF = async () => {
    if (!idCardRef.current) return;
    setIsDownloading(true);
    try {
      const imgData = await htmlToImage.toPng(idCardRef.current, { pixelRatio: 3 });
      
      const img = new Image();
      img.src = imgData;
      await new Promise((resolve) => (img.onload = resolve));
      
      const canvas = { width: img.width, height: img.height };
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [85.6, 53.98] // Standard CR80 ID Card size
      });
      const pdfWidth = 53.98;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`SahkariGig_ID_${w.name.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to download PDF: ' + (err.message || err));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-xs uppercase tracking-wider">Worker Profile</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Info Header */}
        <div className="bg-slate-50 border-b border-slate-200 p-6 flex items-center space-x-4">
          {hasAvatar ? (
            <img
              src={w.avatar}
              alt={w.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
              crossOrigin={w.avatar.startsWith('data:') ? undefined : 'anonymous'}
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm bg-emerald-600 flex items-center justify-center text-white font-bold text-2xl">
              {getInitials(w.name)}
            </div>
          )}
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 font-outfit">{w.name}</h3>
            <p className="text-xs font-semibold text-emerald-700">{w.trade}</p>
            <div className="flex items-center mt-1 space-x-1 text-[11px] text-slate-500 font-medium">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-slate-700 font-bold">{w.rating}</span>
              <span>({w.reviewsCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('idcard')}
            className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 ${
              activeTab === 'idcard'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            ID Card
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center space-x-2 text-slate-500 mb-1">
                    <IndianRupee className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Base Rate</span>
                  </div>
                  <p className="font-semibold text-sm text-slate-900">{w.hourlyRate || w.hourly_rate || '₹400 / hr'}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center space-x-2 text-slate-500 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Distance</span>
                  </div>
                  <p className="font-semibold text-sm text-slate-900">{w.distanceKm || w.distance_km || '2.0'} km away</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">About & Status</h4>
                <div className="flex items-start space-x-3 text-sm">
                  <Building className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <span className="text-slate-700">Member of <strong className="text-slate-900">{w.coopName || w.coop_name || 'Cooperative Federation'}</strong></span>
                </div>
                <div className="flex items-start space-x-3 text-sm">
                  <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <span className="text-slate-700">
                    Status: {w.isAvailableToday || w.is_available_today ? (
                      <span className="text-emerald-600 font-bold">Available Today</span>
                    ) : (
                      <span className="text-amber-600 font-bold">Available Tomorrow</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* ID Card Wrapper */}
              <div className="flex justify-center">
                <div 
                  ref={idCardRef}
                  className="bg-white border-2 border-emerald-600 rounded-xl overflow-hidden w-[260px] shadow-sm flex flex-col relative"
                >
                  {/* ID Card Header (Logo) */}
                  <div className="bg-emerald-600 text-white p-3 flex flex-col items-center justify-center">
                    <div className="flex items-center space-x-1.5">
                      <ShieldCheck className="w-5 h-5 text-emerald-100" />
                      <span className="font-extrabold text-sm font-outfit tracking-wide">SahkariGig</span>
                    </div>
                    <p className="text-[8px] text-emerald-100 mt-1 uppercase tracking-wider opacity-90">Cooperative ID Card</p>
                  </div>

                  {/* ID Card Body */}
                  <div className="p-4 flex flex-col items-center">
                    {hasAvatar ? (
                      <img
                        src={w.avatar}
                        alt={w.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-emerald-50 mb-3"
                        crossOrigin={w.avatar.startsWith('data:') ? undefined : 'anonymous'}
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full object-cover border-4 border-emerald-50 mb-3 bg-emerald-600 flex items-center justify-center text-white font-bold text-3xl">
                        {getInitials(w.name)}
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{w.name}</h3>
                    <p className="text-[10px] font-semibold text-emerald-700 mb-4">{w.trade}</p>

                    <div className="w-full space-y-2 text-[10px]">
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-500 font-medium flex items-center space-x-1">
                          <Smartphone className="w-3 h-3" /> <span>Mobile</span>
                        </span>
                        <span className="font-bold text-slate-900">{w.mobile || w.phone || '+91 98765 43210'}</span>
                      </div>
                      
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-500 font-medium flex items-center space-x-1">
                          <CalendarDays className="w-3 h-3" /> <span>Age</span>
                        </span>
                        <span className="font-bold text-slate-900">{w.age || '32'} yrs</span>
                      </div>

                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-500 font-medium flex items-center space-x-1">
                          <Map className="w-3 h-3" /> <span>Born In</span>
                        </span>
                        <span className="font-bold text-slate-900 text-right">{w.stateOfBirth || w.state_of_birth || 'Uttar Pradesh'}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium flex items-center space-x-1">
                          <MapPin className="w-3 h-3" /> <span>Service</span>
                        </span>
                        <span className="font-bold text-emerald-700 text-right">{w.serviceState || w.service_state || 'Delhi NCR'}</span>
                      </div>
                    </div>
                  </div>

                  {/* ID Card Footer */}
                  <div className="bg-slate-50 p-2 border-t border-slate-200 text-center">
                    <p className="text-[8px] font-mono text-slate-500">ID: {w.workerId || w.worker_id}</p>
                    <p className="text-[7px] text-slate-400 mt-0.5">Valid until {w.validUntil || '31-DEC-2027'}</p>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={downloadPDF}
                disabled={isDownloading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? 'Generating PDF...' : 'Download ID Card PDF'}</span>
              </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
