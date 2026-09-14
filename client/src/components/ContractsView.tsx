import React, { useState, useEffect } from 'react';
import { LucideFileText, LucideCheckSquare, LucideUsers, LucideIndianRupee, LucideClock, LucideAlertCircle, LucideHistory, LucideCheckCircle2, LucideCircle } from 'lucide-react';
import { supabase } from '../supabase';

export interface ContractsViewProps {
  currentUser: any;
  onNavigate: (path: string) => void;
  generatedProjectDetails?: {
    projectType: string;
    area: string;
    floors: string;
  } | null;
  isModal?: boolean;
  onClose?: () => void;
}

export const ContractsView: React.FC<ContractsViewProps> = ({ currentUser, onNavigate, generatedProjectDetails, isModal, onClose }) => {
  const [activeVersion, setActiveVersion] = useState<'v1' | 'v2'>('v2');
  const [liveProgress, setLiveProgress] = useState<number>(25);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data } = await supabase.from('projects').select('*').limit(1).single();
        if (data) {
          const savedProgress = localStorage.getItem(`project_progress_${data.id}`);
          if (savedProgress !== null) {
            setLiveProgress(parseInt(savedProgress, 10));
          } else {
            setLiveProgress(data.progress || 25);
          }
        }
      } catch (e) {
        console.warn('ContractsView progress fetch:', e);
      }
    };

    fetchProgress();

    const channel = supabase
      .channel('contracts_view_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProgress();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);
  
  const contractValue = generatedProjectDetails ? Number(generatedProjectDetails.area) * 200 : null;
  const currentTotalValue = contractValue || (activeVersion === 'v1' ? 293480 : 342000);

  const formatCurrency = (amount: number) => `₹${Math.round(amount).toLocaleString('en-IN')}`;

  const getMilestoneState = (milestoneIndex: number) => {
    // 5 milestones thresholds: 25%, 50%, 75%, 90%, 100%
    const thresholds = [25, 50, 75, 90, 100];
    const target = thresholds[milestoneIndex];
    const prevTarget = milestoneIndex === 0 ? 0 : thresholds[milestoneIndex - 1];

    if (liveProgress >= target) {
      return { status: 'Released', isCurrent: false };
    } else if (liveProgress >= prevTarget && liveProgress < target) {
      return { status: 'In Progress', isCurrent: true };
    } else {
      return { status: 'Pending', isCurrent: false };
    }
  };

  const milestones = [
    { name: 'Foundation & Plinth', amount: formatCurrency(currentTotalValue * 0.20), ...getMilestoneState(0) },
    { name: 'Structure & Roof', amount: formatCurrency(currentTotalValue * 0.25), ...getMilestoneState(1) },
    { name: 'Electrical & Plumbing', amount: formatCurrency(currentTotalValue * 0.20), ...getMilestoneState(2) },
    { name: 'Finishing & Painting', amount: formatCurrency(currentTotalValue * 0.20), ...getMilestoneState(3) },
    { name: 'Inspection & Handover', amount: formatCurrency(currentTotalValue * 0.15), ...getMilestoneState(4) },
  ];

  const content = (
    <div className={isModal ? "px-4 sm:px-6 lg:px-8 pb-12 pt-6 max-w-5xl mx-auto" : "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12"}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          {!isModal && (
            <button onClick={() => onNavigate('/projects')} className="text-sm font-semibold text-slate-500 hover:text-emerald-600 mb-2 inline-flex items-center gap-1 cursor-pointer">
              ← Back to Projects
            </button>
          )}
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit tracking-tight flex items-center gap-3">
            <LucideFileText className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            Construction Service Agreement
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            CONTRACT #SG-2026-00142
          </p>
        </div>
      </div>

      {/* Contract Versioning */}
      <div className="mb-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <LucideHistory className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <div>
            <h3 className="font-bold text-amber-900 dark:text-amber-100 text-sm">Contract Version Updated</h3>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">Change Request approved by customer on Aug 28.</p>
          </div>
        </div>
        <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => setActiveVersion('v1')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${activeVersion === 'v1' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            v1 (Original)
          </button>
          <button 
            onClick={() => setActiveVersion('v2')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer flex items-center gap-1 ${activeVersion === 'v2' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            v2 (Current)
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        {/* Contract Header Details */}
        <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Project</div>
            <div className="font-bold text-slate-900 dark:text-white">
              {generatedProjectDetails ? (
                `${generatedProjectDetails.projectType === 'renovation' ? 'Renovation' : 'Construction'} (${generatedProjectDetails.floors.split(' ')[0]})`
              ) : (
                'Single Floor Villa (G+0)'
              )}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Customer</div>
            <div className="font-bold text-slate-900 dark:text-white">{currentUser?.name || 'Jatin Jangid'}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Location</div>
            <div className="font-bold text-slate-900 dark:text-white">{currentUser?.location || 'Jaipur, Rajasthan'}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Built-up Area</div>
            <div className="font-bold text-slate-900 dark:text-white">
              {generatedProjectDetails ? (
                `${generatedProjectDetails.area} sq.ft`
              ) : (
                activeVersion === 'v1' ? '1,450 sq.ft' : <span className="text-emerald-600 dark:text-emerald-400">1,700 sq.ft (+250)</span>
              )}
            </div>
          </div>
          
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Contract Value</div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <LucideIndianRupee className="w-4 h-4 text-slate-400" />
              {contractValue ? (
                `${contractValue.toLocaleString('en-IN')} (Approx)`
              ) : (
                activeVersion === 'v1' ? '2,93,480 (Approx)' : <span className="text-emerald-600 dark:text-emerald-400">3,42,000 (Approx)</span>
              )}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Est. Duration</div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <LucideClock className="w-4 h-4 text-slate-400" />
              {activeVersion === 'v1' ? '75 working days' : <span className="text-emerald-600 dark:text-emerald-400">82 working days</span>}
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Project Supervisor</div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs">ER</div>
              Er. Vikramaditya Rathore (Verified)
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Scope & Workforce */}
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
                <LucideCheckSquare className="w-5 h-5 text-emerald-600" /> Scope of Work
              </h3>
              <ul className="space-y-3">
                {['Foundation & plinth', 'Brickwork', 'RCC / shuttering', 'Electrical wiring & panels', 'Plumbing & sanitation', 'Flooring & tiling', 'Painting', 'Final finishing & cleanup'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <LucideCheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
                <LucideUsers className="w-5 h-5 text-emerald-600" /> Workforce Deployed
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Supervisor</span>
                  <span className="font-bold text-slate-900 dark:text-white">1</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Masons</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeVersion === 'v1' ? '3' : <span className="text-emerald-600">4</span>}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Steel workers</span>
                  <span className="font-bold text-slate-900 dark:text-white">2</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Electricians</span>
                  <span className="font-bold text-slate-900 dark:text-white">1</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Plumbers</span>
                  <span className="font-bold text-slate-900 dark:text-white">1</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Tile workers</span>
                  <span className="font-bold text-slate-900 dark:text-white">2</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Painters</span>
                  <span className="font-bold text-slate-900 dark:text-white">2</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Laborers</span>
                  <span className="font-bold text-slate-900 dark:text-white">5</span>
                </div>
              </div>
            </section>
          </div>

          {/* Payment Schedule */}
          <div>
            <section>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
                <LucideIndianRupee className="w-5 h-5 text-emerald-600" /> Milestone Payment Schedule
              </h3>
              <p className="text-xs text-slate-500 mb-6 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <LucideAlertCircle className="w-4 h-4 inline mr-1 text-emerald-600" />
                Payments are securely held in cooperative escrow and only released when you and the supervisor approve the milestone inspection.
              </p>

              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {milestones.map((m, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-6">
                    {/* Icon */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      {m.status === 'Released' ? <LucideCheckCircle2 className="w-5 h-5 text-emerald-600" /> : <LucideCircle className={`w-5 h-5 ${m.isCurrent ? 'text-indigo-600 fill-indigo-100' : 'text-slate-300'}`} />}
                    </div>
                    
                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold uppercase text-slate-400">Milestone {i + 1}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          m.status === 'Released' ? 'bg-emerald-100 text-emerald-700' :
                          m.status === 'In Progress' ? 'bg-indigo-100 text-indigo-700' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{m.name}</h4>
                      <div className="mt-2 text-lg font-black text-slate-900 dark:text-white">
                        {activeVersion === 'v1' ? m.amount : <span className="text-emerald-600">₹{parseInt(m.amount.replace(/\D/g, '')) + 9704}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
        <div className="bg-slate-50 dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200 relative">
          <div className="sticky top-0 right-0 z-10 flex justify-end p-4">
            <button 
              onClick={onClose} 
              className="p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full shadow-sm border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <span className="sr-only">Close</span>
              &times;
            </button>
          </div>
          <div className="-mt-12">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return content;
};
