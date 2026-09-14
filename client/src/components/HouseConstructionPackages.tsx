import React, { useState, useEffect } from 'react';
import { LucideBuilding2, LucideUsers, LucideFileSignature, LucideClock, LucideCheckCircle, LucideChevronRight } from 'lucide-react';
import { ContractsView } from './ContractsView';
import { supabase } from '../supabase';

export interface HouseConstructionPackagesProps {
  currentUser: any;
  onNavigate: (path: string) => void;
  onOpenBooking: (worker: any) => void;
  onOpenAuth: (role?: 'Customer' | 'Worker', mode?: 'signin' | 'signup') => void;
  hasGeneratedProject?: boolean;
  generatedProjectDetails?: {
    projectType: string;
    area: string;
    floors: string;
  } | null;
  onProjectGenerated?: (details: { projectType: string; area: string; floors: string; }) => void;
}

const DEFAULT_CUSTOMER_PROJECTS = [
  {
    id: '716e2b56-e153-43f9-b9ec-a55b60a020ff',
    name: 'Single Floor Villa — G+0',
    customer_name: 'Jatin Jangid',
    customer_phone: '+91 98765 43210',
    location: 'Mansarovar / Jagatpura, Jaipur',
    status: 'IN_PROGRESS',
    budget: '₹3,42,000',
    progress: 25,
    start_date: '15 Sep',
    supervisors: {
      id: 's1',
      name: 'Er. Vikramaditya Rathore',
      phone: '+91 94140 12345'
    }
  }
];

export const HouseConstructionPackages: React.FC<HouseConstructionPackagesProps> = ({
  currentUser,
  onNavigate,
  onOpenBooking,
  onOpenAuth,
  hasGeneratedProject,
  generatedProjectDetails,
  onProjectGenerated
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState('complete');
  const [inputArea, setInputArea] = useState('');
  const [inputFloors, setInputFloors] = useState('Ground Floor Only (G+0)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [projectsList, setProjectsList] = useState<any[]>(DEFAULT_CUSTOMER_PROJECTS);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*, supervisors(*)')
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          setProjectsList(data.map(p => {
            const savedProgress = localStorage.getItem(`project_progress_${p.id}`);
            return {
              ...p,
              customer_name: p.customer_name || currentUser?.name || 'Jatin Jangid',
              location: p.location || 'Jaipur, Rajasthan',
              status: p.status || 'IN_PROGRESS',
              start_date: p.start_date || '15 Sep',
              progress: savedProgress !== null ? parseInt(savedProgress, 10) : (p.progress || (p.status === 'COMPLETED' ? 100 : 25))
            };
          }));
        }
      } catch (err) {
        console.error('Error fetching customer projects:', err);
      }
    };

    fetchProjects();

    const channel = supabase
      .channel('customer_projects_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [currentUser]);

  const hasProjects = projectsList.length > 0 || hasGeneratedProject;


  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit tracking-tight">
            My Projects
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Manage your contract-based construction and execution teams.
          </p>
        </div>
        <button 
          onClick={() => {
            if (!currentUser) {
              onOpenAuth('Customer', 'signup');
            } else {
              setIsCreateModalOpen(true);
            }
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          + Create New Project
        </button>
      </div>

      {/* Project Card List */}
      {hasProjects ? (
        <div className="space-y-6">
          {projectsList.map((p, idx) => {
            const customerDisplayName = currentUser?.name || p.customer_name || 'Jatin Jangid';
            const locationDisplay = p.location || currentUser?.location || 'Jaipur, Rajasthan';
            const supervisorName = p.supervisors?.name || 'Er. Vikramaditya Rathore';
            
            return (
              <div key={p.id || idx} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    
                    {/* Project Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2.5 rounded-xl">
                          <LucideBuilding2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {p.name || 'My House Construction'}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            Customer: <strong className="text-slate-800 dark:text-slate-200">{customerDisplayName}</strong> • {locationDisplay}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Status</div>
                          <div className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            {p.status || 'Contract Ready'}
                          </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Team</div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            17 Workers + 1 Sup.
                          </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Supervisor</div>
                          <div className="font-semibold text-slate-900 dark:text-white truncate">
                            {supervisorName}
                          </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Start Date</div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {p.start_date || '15 Sep'}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-6">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-medium text-slate-700 dark:text-slate-300">Phase 1 of 4 (Site Mobilization & Foundation)</span>
                          <span className="text-emerald-600 font-bold">{p.progress || 25}% Complete</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${p.progress || 25}%` }}></div>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => onNavigate('/control-center')}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      View Project Control Center <LucideChevronRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setIsContractModalOpen(true)}
                      className="flex-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 border border-emerald-200 dark:border-emerald-800/50 cursor-pointer"
                    >
                      <LucideFileSignature className="w-4 h-4" /> Open Contract
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
          <div className="bg-slate-100 dark:bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <LucideBuilding2 className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No active projects</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            You don't have any construction projects running yet. Create a new project to start hiring a cooperative team.
          </p>
          <button 
            onClick={() => {
              if (!currentUser) {
                onOpenAuth('Customer', 'signup');
              } else {
                setIsCreateModalOpen(true);
              }
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            + Create Your First Project
          </button>
        </div>
      )}
      
      {/* Create New Project Banner */}
      <div className="mt-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-8 border border-indigo-100 dark:border-indigo-800/50 text-center">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Start a New Construction Project</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
          Need another floor? Or planning a commercial space? SahkariGig provides complete contract-based execution with verified cooperative workforce teams.
        </p>
        <button 
          onClick={() => {
            if (!currentUser) {
              onOpenAuth('Customer', 'signup');
            } else {
              setIsCreateModalOpen(true);
            }
          }}
          className="bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 font-bold py-2.5 px-6 rounded-lg shadow-sm hover:shadow transition-shadow cursor-pointer"
        >
          Configure Package
        </button>
      </div>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <LucideBuilding2 className="w-5 h-5 text-emerald-600" />
                Configure New Project
              </h2>
              <button 
                onClick={() => !isGenerating && setIsCreateModalOpen(false)} 
                className={`text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-2xl leading-none cursor-pointer ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isGenerating}
              >
                &times;
              </button>
            </div>
            
            {isGenerating ? (
              <div className="p-12 flex flex-col items-center justify-center space-y-6">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-700"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Generating AI Contract...</h3>
                  <p className="text-sm text-slate-500 mt-2">Analyzing requirements and assembling cooperative team structure.</p>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Project Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => setSelectedProjectType('complete')}
                    className={`rounded-xl p-4 cursor-pointer transition-colors ${
                      selectedProjectType === 'complete' 
                        ? 'border border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                        : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-300'
                    }`}
                  >
                    <h3 className={`font-bold ${selectedProjectType === 'complete' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>Complete Home Construction</h3>
                    <p className={`text-xs mt-1 ${selectedProjectType === 'complete' ? 'text-emerald-600/80 dark:text-emerald-400/80' : 'text-slate-500 dark:text-slate-400'}`}>Foundation to Handover</p>
                  </div>
                  <div 
                    onClick={() => setSelectedProjectType('renovation')}
                    className={`rounded-xl p-4 cursor-pointer transition-colors ${
                      selectedProjectType === 'renovation' 
                        ? 'border border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                        : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-300'
                    }`}
                  >
                    <h3 className={`font-bold ${selectedProjectType === 'renovation' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>Renovation / Addition</h3>
                    <p className={`text-xs mt-1 ${selectedProjectType === 'renovation' ? 'text-emerald-600/80 dark:text-emerald-400/80' : 'text-slate-500 dark:text-slate-400'}`}>Add a floor, remodel, etc.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Built-up Area (Sq.ft)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 1500" 
                  value={inputArea}
                  onChange={(e) => setInputArea(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Number of Floors</label>
                <select 
                  value={inputFloors}
                  onChange={(e) => setInputFloors(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white"
                >
                  <option>Ground Floor Only (G+0)</option>
                  <option>G+1 (Two Floors)</option>
                  <option>G+2 (Three Floors)</option>
                  <option>G+3 (Four Floors)</option>
                </select>
              </div>
              </div>
            )}

            {!isGenerating && (
              <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <span className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">
                  A dedicated cooperative supervisor will be automatically assigned.
                </span>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsCreateModalOpen(false)} 
                    className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={async () => {
                      setIsGenerating(true);
                      const customerName = currentUser?.name || 'Jatin Jangid';
                      const pName = `${selectedProjectType === 'renovation' ? 'House Renovation' : 'House Construction'} — ${inputFloors.split(' ')[0]}`;
                      
                      try {
                        const { data: newProj } = await supabase
                          .from('projects')
                          .insert({
                            name: pName,
                            customer_name: customerName,
                            customer_id: currentUser?.id || null,
                            location: currentUser?.location || 'Jaipur, Rajasthan',
                            status: 'IN_PROGRESS',
                            start_date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                          })
                          .select('*, supervisors(*)')
                          .single();

                        if (newProj) {
                          setProjectsList(prev => [newProj, ...prev]);
                        }
                      } catch (err) {
                        console.warn('Supabase project creation note:', err);
                      }

                      setTimeout(() => {
                        setIsGenerating(false);
                        setIsCreateModalOpen(false);
                        onProjectGenerated?.({
                          projectType: selectedProjectType,
                          area: inputArea || '1500',
                          floors: inputFloors
                        });
                        setIsContractModalOpen(true);
                      }, 1500);
                    }} 
                    className="px-5 py-2.5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    Generate Contract <LucideChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contract Modal Overlay */}
      {isContractModalOpen && (
        <ContractsView 
          currentUser={currentUser} 
          onNavigate={onNavigate} 
          generatedProjectDetails={generatedProjectDetails}
          isModal={true}
          onClose={() => setIsContractModalOpen(false)}
        />
      )}
    </div>
  );
};
