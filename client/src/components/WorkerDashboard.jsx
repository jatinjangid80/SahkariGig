import React, { useState } from 'react';
import { ShieldCheck, QrCode, CheckCircle2, XCircle, Play, DollarSign, Award, Plus, Sparkles, AlertCircle } from 'lucide-react';

export default function WorkerDashboard({ worker, bookings, onUpdateBookingStatus, onOpenVerifyModal, onSubmitNewSkill }) {
  const [skillName, setSkillName] = useState('');
  const [skillDesc, setSkillDesc] = useState('');
  const [skillSubmitted, setSkillSubmitted] = useState(false);

  const incomingRequests = bookings.filter(b => b.status === 'requested');
  const activeJobs = bookings.filter(b => ['accepted', 'in_progress'].includes(b.status));
  const completedJobs = bookings.filter(b => ['completed', 'rated'].includes(b.status));

  const totalEarnings = completedJobs.reduce((acc, b) => acc + (b.amount || 0), 0);

  const handleNewSkillSubmit = async (e) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    await onSubmitNewSkill(skillName, skillDesc);
    setSkillSubmitted(true);
    setSkillName('');
    setSkillDesc('');
    setTimeout(() => setSkillSubmitted(false), 4000);
  };

  return (
    <div className="py-8">
      {/* Worker Header Badge */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img src={worker?.photoUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80'} alt="Worker" className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500" />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">{worker?.name || 'Rajesh Kumar'}</h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Cooperative Worker</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">{worker?.cooperativeSociety || 'Jan Seva Labour Cooperative Federation'}</p>
            <p className="text-xs font-mono text-emerald-400 mt-0.5">Worker ID: {worker?.workerId || 'COOP-2026-00101'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-center min-w-28">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Earnings</span>
            <p className="text-xl font-extrabold text-emerald-400 mt-0.5">₹{totalEarnings}</p>
          </div>

          <button
            onClick={() => onOpenVerifyModal(worker || { workerId: 'COOP-2026-00101', name: 'Rajesh Kumar', skills: ['Electrician'], cooperativeSociety: 'Jan Seva Labour Cooperative Federation', rating: 4.9, ratingCount: 48, status: 'active', photoUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80' })}
            className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center space-x-2 border border-emerald-400/30"
          >
            <QrCode className="w-4 h-4" />
            <span>Digital ID Card</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Incoming Requests & Active Jobs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Incoming Job Feed */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span>Incoming Booking Requests ({incomingRequests.length})</span>
            </h3>

            {incomingRequests.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No pending requests right now.</p>
            ) : (
              <div className="space-y-4">
                {incomingRequests.map((req) => (
                  <div key={req.id} className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{req.customer.name}</span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono">#{req.id}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1"><span className="font-semibold text-slate-400">Issue:</span> {req.problemDescription}</p>
                      <p className="text-xs text-slate-400"><span className="font-semibold text-slate-400">Address:</span> {req.address}</p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => onUpdateBookingStatus(req.id, 'accepted')}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept Job</span>
                      </button>
                      <button
                        onClick={() => onUpdateBookingStatus(req.id, 'cancelled')}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold rounded-xl"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Jobs */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4">In-Progress & Accepted Jobs ({activeJobs.length})</h3>
            
            {activeJobs.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No active jobs at the moment.</p>
            ) : (
              <div className="space-y-4">
                {activeJobs.map((job) => (
                  <div key={job.id} className="p-4 bg-slate-900/90 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{job.status.replace('_', ' ')}</span>
                        <span className="text-xs font-semibold text-white">• {job.customer.name}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{job.problemDescription}</p>
                      <p className="text-xs text-slate-400">{job.address}</p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {job.status === 'accepted' && (
                        <button
                          onClick={() => onUpdateBookingStatus(job.id, 'in_progress')}
                          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Start Job</span>
                        </button>
                      )}

                      {job.status === 'in_progress' && (
                        <button
                          onClick={() => onUpdateBookingStatus(job.id, 'completed')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Completed</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Submit New Skill Form (PRD Section 4.2 Dynamic Skill Management) */}
        <div>
          <div className="glass-panel rounded-3xl p-6 border border-slate-800">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Dynamic Skill Submission</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Need to offer a trade not listed? Submit a new skill to route to Cooperative Admin approval queue.
            </p>

            {skillSubmitted && (
              <div className="p-3 mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Skill submitted for admin approval! Will show live once approved.</span>
              </div>
            )}

            <form onSubmit={handleNewSkillSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Skill / Category Name</label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder='e.g. "Solar Panel Installer" or "Drone Surveyor"'
                  className="w-full px-3 py-2 bg-slate-950/80 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Skill Description</label>
                <textarea
                  rows={2}
                  value={skillDesc}
                  onChange={(e) => setSkillDesc(e.target.value)}
                  placeholder="Rooftop solar panel wiring, inverter setup and maintenance..."
                  className="w-full px-3 py-2 bg-slate-950/80 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 gradient-bg hover:opacity-95 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Submit Skill for Admin Review</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
