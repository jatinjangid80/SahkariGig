import React, { useState } from 'react';
import { LucideLayoutDashboard, LucideFileText, LucideUsers, LucideIndianRupee, LucideClock, LucideCheckSquare, LucideImage, LucideMessageSquare, LucidePlusCircle, LucideShieldCheck, LucideAlertCircle } from 'lucide-react';

export interface ProjectControlCenterProps {
  currentUser: any;
  onNavigate: (path: string) => void;
  onOpenChat: (booking: any) => void;
}

export const ProjectControlCenter: React.FC<ProjectControlCenterProps> = ({ currentUser, onNavigate, onOpenChat }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [changeRequestOpen, setChangeRequestOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button onClick={() => onNavigate('/projects')} className="text-sm font-semibold text-slate-500 hover:text-emerald-600 mb-2 inline-flex items-center gap-1 cursor-pointer">
            ← Back to Projects
          </button>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit tracking-tight flex items-center gap-3">
            <LucideLayoutDashboard className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            Project Control Center
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Single Floor Villa — G+0 • <span className="font-semibold text-slate-900 dark:text-white">₹3,42,000 Contract</span>
          </p>
        </div>
        <button 
          onClick={() => setChangeRequestOpen(true)}
          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center gap-2"
        >
          <LucidePlusCircle className="w-4 h-4" /> Request a Change
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Progress</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">38%</div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-emerald-500 w-[38%]"></div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Days Left</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">47 days</div>
          <div className="text-xs text-slate-500 mt-1">Est. completion: Nov 15</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Workers On Site</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">18</div>
          <div className="text-xs text-slate-500 mt-1">Including 1 Supervisor</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Amount Spent</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">₹58,696</div>
          <div className="text-xs text-slate-500 mt-1">1 of 5 milestones paid</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto hide-scrollbar border-b border-slate-200 dark:border-slate-700 mb-6 gap-6">
        {['Overview', 'Contract', 'Team', 'Milestones', 'Payments', 'Documents', 'Messages'].map(tab => (
          <button
            key={tab}
            onClick={() => {
              if (tab === 'Contract') onNavigate('/contracts');
              else if (tab === 'Messages') onOpenChat({ id: 'proj-123', workerName: 'Er. Vikramaditya Rathore', service: 'Supervisor' });
              else setActiveTab(tab);
            }}
            className={`pb-3 font-semibold text-sm transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === tab 
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400' 
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Feed */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Current Phase Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Current Phase: Structure & Roof</h3>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-md">In Progress</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Supervisor <span className="font-semibold text-slate-900 dark:text-white">Er. Vikramaditya Rathore</span> is currently managing the brickwork and column reinforcement on the ground floor.
              </p>
              
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Today's Activity</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <LucideCheckSquare className="w-4 h-4 text-emerald-500" /> Brickwork (North Wall)
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <LucideCheckSquare className="w-4 h-4 text-emerald-500" /> Column reinforcement
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <LucideCheckSquare className="w-4 h-4 text-emerald-500" /> Site inspection by Engineer
                  </li>
                </ul>
              </div>
            </div>

            {/* Latest Updates */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-4">Latest Site Update</h3>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0 overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Vikramaditya" alt="Supervisor" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                      "Brickwork for the ground floor is proceeding nicely. We've completed the north and east walls. I've uploaded the photos from today's progress."
                    </p>
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                      <div className="w-24 h-24 bg-slate-200 rounded-lg shrink-0 flex items-center justify-center text-slate-400">
                        <LucideImage className="w-6 h-6" />
                      </div>
                      <div className="w-24 h-24 bg-slate-200 rounded-lg shrink-0 flex items-center justify-center text-slate-400">
                        <LucideImage className="w-6 h-6" />
                      </div>
                      <div className="w-24 h-24 bg-slate-200 rounded-lg shrink-0 flex items-center justify-center text-slate-400 relative">
                        <LucideImage className="w-6 h-6" />
                        <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center text-white text-xs font-bold">+1 more</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 mt-2">Today at 4:30 PM</div>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Next Action */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 p-5">
              <h3 className="font-bold text-indigo-900 dark:text-indigo-100 text-sm mb-1 uppercase tracking-wider">Next Milestone</h3>
              <p className="text-slate-700 dark:text-slate-300 font-medium mb-3">Slab Casting Inspection</p>
              <p className="text-xs text-slate-500 mb-4">Estimated in 12 days. You will need to approve the inspection to release the next payment of ₹73,370.</p>
              <button 
                onClick={() => setActiveTab('Milestones')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
              >
                View Schedule
              </button>
            </div>

            {/* Project Handover (Future State Preview) */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 opacity-60">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                <LucideShieldCheck className="w-4 h-4 text-emerald-600" /> Project Handover
              </h3>
              <p className="text-xs text-slate-500 mb-3">Complete all milestones to unlock final handover and warranty certificates.</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Final Inspection</span>
                  <span>Pending</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Work Completion Cert.</span>
                  <span>Locked</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Fallback for unbuilt tabs */}
      {activeTab !== 'Overview' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{activeTab}</h3>
          <p className="text-slate-500">This section is currently under development. Please check back later.</p>
        </div>
      )}

      {/* Change Request Modal Overlay */}
      {changeRequestOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Request a Change</h2>
              <button onClick={() => setChangeRequestOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">What would you like to change?</label>
                <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white">
                  <option>Add room / Increase built-up area</option>
                  <option>Change flooring specification</option>
                  <option>Add electrical points</option>
                  <option>Change paint specification</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea rows={3} placeholder="Describe the change you want..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white"></textarea>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800/50 mt-4">
                <p className="text-xs text-amber-700 dark:text-amber-300 font-medium flex items-center gap-1.5">
                  <LucideAlertCircle className="w-4 h-4" /> This will be sent to your Supervisor to estimate impact.
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
              <button onClick={() => setChangeRequestOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer">Cancel</button>
              <button onClick={() => setChangeRequestOpen(false)} className="px-4 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer">Submit Request</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
