import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { 
  LucideLayoutDashboard, LucideBriefcase, LucideUsers, 
  LucideCheckSquare, LucidePieChart, LucideUserCircle,
  LucideClock, LucideAlertCircle, LucideCalendar, LucidePlusCircle,
  LucideSearch, LucideCheck, LucideSliders, LucideMapPin, LucideShieldCheck,
  LucidePhone, LucideMail, LucideAward, LucideActivity, LucideTrendingUp,
  LucideTrash2, LucideX, LucideMessageSquare, Sun, Moon, Laptop
} from 'lucide-react';
import { useTheme } from '../utils/theme';

interface SupervisorDashboardProps {
  currentUser: any;
  onNavigate: (path: string) => void;
  onOpenChat?: (booking: any) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const DEFAULT_PROJECTS = [
  {
    id: '716e2b56-e153-43f9-b9ec-a55b60a020ff',
    name: 'Single Floor Villa — G+0',
    customer_name: 'Jatin Jangid',
    customer_phone: '+91 98765 43210',
    location: 'Mansarovar / Jagatpura, Jaipur',
    status: 'IN_PROGRESS',
    progress: 25,
    start_date: '2026-09-01',
    budget: '₹3,42,000',
    tasks: [
      { id: 't1', name: 'Site Marking & Foundation Layout', status: 'COMPLETED' },
      { id: 't2', name: 'Excavation & Footing RCC', status: 'IN_PROGRESS' },
      { id: 't3', name: 'Plinth Beam & Soil Compaction', status: 'PENDING' },
      { id: 't4', name: 'Superstructure Brickwork', status: 'PENDING' },
      { id: 't5', name: 'Roof Slab Shuttering & Casting', status: 'PENDING' }
    ]
  },
  {
    id: 'proj-demo-1',
    name: 'Residential Villa G+1 Construction',
    customer_name: 'Jatin Jangid',
    customer_phone: '+91 98765 43210',
    location: 'Civil Lines, Jaipur',
    status: 'IN_PROGRESS',
    progress: 68,
    start_date: '2026-08-01',
    budget: '₹14,50,000',
    tasks: [
      { id: 't11', name: 'Foundation & Excavation', status: 'COMPLETED' },
      { id: 't12', name: 'RCC Column Reinforcement', status: 'COMPLETED' },
      { id: 't13', name: 'Ground Floor Brickwork', status: 'IN_PROGRESS' },
      { id: 't14', name: 'Electrical Conduit Routing', status: 'PENDING' },
      { id: 't15', name: 'Slab Casting & Curing', status: 'PENDING' }
    ]
  }
];

const DEFAULT_WORKERS = [
  { id: 'w1', worker_id: 'W-101', name: 'Amit Kumar Verma', trade: 'Mason & Bricklayer', coop_name: 'Jaipur Shramik Sahkari', rating: 4.9, is_available_today: false, phone: '+91 98111 22334' },
  { id: 'w2', worker_id: 'W-102', name: 'Rameshwar Lal', trade: 'Senior Electrician', coop_name: 'Rajasthan Vidyut Sahkari', rating: 4.8, is_available_today: true, phone: '+91 98222 33445' },
  { id: 'w3', worker_id: 'W-103', name: 'Sunil Gurjar', trade: 'Master Plumber', coop_name: 'Jaipur Labour Cooperative', rating: 4.9, is_available_today: true, phone: '+91 98333 44556' },
  { id: 'w4', worker_id: 'W-104', name: 'Mohan Lal Saini', trade: 'Painter & Polish Specialist', coop_name: 'Jaipur Shramik Sahkari', rating: 4.7, is_available_today: true, phone: '+91 98444 55667' },
  { id: 'w5', worker_id: 'W-105', name: 'Dinesh Bairwa', trade: 'Carpenter & Shuttering', coop_name: 'Northern Crafts Cooperative', rating: 4.8, is_available_today: false, phone: '+91 98555 66778' }
];

const DEFAULT_ASSIGNMENTS = [
  { id: 'as-1', project_id: '716e2b56-e153-43f9-b9ec-a55b60a020ff', worker_id: 'w1', task: 'Excavation & Footing RCC', status: 'IN_PROGRESS', workers: DEFAULT_WORKERS[0], projects: DEFAULT_PROJECTS[0] },
  { id: 'as-2', project_id: '716e2b56-e153-43f9-b9ec-a55b60a020ff', worker_id: 'w2', task: 'Temporary Distribution & Conduit', status: 'ACCEPTED', workers: DEFAULT_WORKERS[1], projects: DEFAULT_PROJECTS[0] },
  { id: 'as-3', project_id: 'proj-demo-1', worker_id: 'w5', task: 'Shuttering for Slab', status: 'REQUESTED', workers: DEFAULT_WORKERS[4], projects: DEFAULT_PROJECTS[1] }
];

export const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({ 
  currentUser, 
  onNavigate, 
  onOpenChat, 
  activeTab = 'overview', 
  onTabChange 
}) => {
  const { theme, setTheme } = useTheme();
  const [projects, setProjects] = useState<any[]>(DEFAULT_PROJECTS);
  const [workers, setWorkers] = useState<any[]>(DEFAULT_WORKERS);
  const [assignments, setAssignments] = useState<any[]>(DEFAULT_ASSIGNMENTS);
  const [loading, setLoading] = useState(false);

  // Filters & Search
  const [workerSearch, setWorkerSearch] = useState('');
  const [workerAvailabilityFilter, setWorkerAvailabilityFilter] = useState<'ALL' | 'AVAILABLE' | 'ASSIGNED'>('ALL');
  const [selectedProjectIdForProgress, setSelectedProjectIdForProgress] = useState<string>('716e2b56-e153-43f9-b9ec-a55b60a020ff');

  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isUpdateProgressModalOpen, setIsUpdateProgressModalOpen] = useState(false);

  // Assignment Modal Form
  const [assignProject, setAssignProject] = useState('');
  const [assignWorker, setAssignWorker] = useState('');
  const [assignTask, setAssignTask] = useState('');

  // New Project Modal Form
  const [newProjName, setNewProjName] = useState('');
  const [newProjCustomer, setNewProjCustomer] = useState('');
  const [newProjLocation, setNewProjLocation] = useState('');
  const [newProjBudget, setNewProjBudget] = useState('');

  // Update Progress Form
  const [progressValue, setProgressValue] = useState<number>(68);
  const [newTaskName, setNewTaskName] = useState('');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Dynamic Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 22) return 'Good evening';
    return 'Good night';
  };

  const [greeting, setGreeting] = useState<string>(getGreeting);

  useEffect(() => {
    const updateGreetingTimer = () => setGreeting(getGreeting());
    updateGreetingTimer();
    const timer = setInterval(updateGreetingTimer, 60000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Safe tab switcher
  const handleTabSwitch = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // Fetch initial Supabase data with fallback & Realtime
  useEffect(() => {
    const fetchSupervisorData = async () => {
      try {
        // 1. Fetch Supervisor Profile if available
        let supervisor: any = null;
        try {
          const { data: sData } = await supabase
            .from('supervisors')
            .select('*')
            .eq('user_id', currentUser?.id)
            .maybeSingle();
          supervisor = sData;
        } catch (e) {
          console.warn('Supervisor lookup note:', e);
        }

        if (!supervisor) {
          try {
            const { data: fallback } = await supabase.from('supervisors').select('*').limit(1).maybeSingle();
            supervisor = fallback;
          } catch (e) {
            console.warn('Supervisor fallback note:', e);
          }
        }

        // 2. Fetch Projects directly from public.projects table
        const { data: projData, error: projErr } = await supabase
          .from('projects')
          .select('*, supervisors(*)')
          .order('created_at', { ascending: false });
        
        if (projData && projData.length > 0) {
          setProjects(projData.map(p => {
            const savedProgress = localStorage.getItem(`project_progress_${p.id}`);
            const savedTasks = localStorage.getItem(`project_tasks_${p.id}`);
            return {
              ...p,
              customer_name: p.customer_name || 'Jatin Jangid',
              location: p.location || 'Jaipur, Rajasthan',
              status: p.status || 'IN_PROGRESS',
              start_date: p.start_date || '15 Sep',
              progress: savedProgress !== null ? parseInt(savedProgress, 10) : (p.progress || (p.status === 'COMPLETED' ? 100 : 25)),
              tasks: savedTasks ? JSON.parse(savedTasks) : (p.tasks || [
                { id: '1', name: 'Site Marking & Foundation Layout', status: 'COMPLETED' },
                { id: '2', name: 'Excavation & Footing RCC', status: 'IN_PROGRESS' },
                { id: '3', name: 'Plinth Beam & Soil Compaction', status: 'PENDING' },
                { id: '4', name: 'Superstructure Brickwork', status: 'PENDING' },
                { id: '5', name: 'Roof Slab Shuttering & Casting', status: 'PENDING' }
              ])
            };
          }));
          setSelectedProjectIdForProgress(projData[0].id);
        }

        // 3. Fetch Workers
        const { data: workerData } = await supabase.from('workers').select('*');
        if (workerData && workerData.length > 0) setWorkers(workerData);

        // 4. Fetch Project Assignments
        const { data: assignData } = await supabase
          .from('project_workers')
          .select('*, workers(*), projects(*)')
          .order('assigned_at', { ascending: false });

        if (assignData && assignData.length > 0) {
          setAssignments(assignData);
        }
      } catch (err) {
        console.error('Error fetching supervisor data', err);
      }
    };

    fetchSupervisorData();

    // Supabase Realtime channel for live cross-dashboard updates (projects & assignments)
    const channel = supabase
      .channel('supervisor_dashboard_realtime_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => {
          fetchSupervisorData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'project_workers' },
        () => {
          fetchSupervisorData();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [currentUser]);

  // Handle Assign Worker
  const handleAssignWorkerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignProject || !assignWorker || !assignTask) return;

    const projObj = projects.find(p => p.id === assignProject) || projects[0];
    const workerObj = workers.find(w => w.id === assignWorker) || workers[0];

    try {
      const { data: inserted, error: insErr } = await supabase
        .from('project_workers')
        .insert({
          project_id: assignProject,
          worker_id: assignWorker,
          task: assignTask,
          status: 'IN_PROGRESS'
        })
        .select('*, workers(*), projects(*)')
        .single();

      if (inserted && !insErr) {
        setAssignments(prev => [inserted, ...prev]);
      } else {
        const newAssignment = {
          id: `as-${Date.now()}`,
          project_id: assignProject,
          worker_id: assignWorker,
          task: assignTask,
          status: 'IN_PROGRESS',
          workers: workerObj,
          projects: projObj
        };
        setAssignments(prev => [newAssignment, ...prev]);
      }
    } catch (err) {
      console.warn('Supabase insert note', err);
      const newAssignment = {
        id: `as-${Date.now()}`,
        project_id: assignProject,
        worker_id: assignWorker,
        task: assignTask,
        status: 'IN_PROGRESS',
        workers: workerObj,
        projects: projObj
      };
      setAssignments(prev => [newAssignment, ...prev]);
    }

    setIsAssignModalOpen(false);
    setAssignProject('');
    setAssignWorker('');
    setAssignTask('');
    showToast(`Assigned ${workerObj?.name || 'Worker'} to ${assignTask}!`);
  };

  // Handle Create New Project
  const handleCreateProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName || !newProjCustomer || !newProjLocation) return;

    const newProject = {
      id: `proj-${Date.now()}`,
      name: newProjName,
      customer_name: newProjCustomer,
      location: newProjLocation,
      budget: newProjBudget || '₹5,00,000',
      status: 'IN_PROGRESS',
      progress: 10,
      start_date: new Date().toISOString().split('T')[0],
      tasks: [
        { id: `t-${Date.now()}-1`, name: 'Initial Site Inspection', status: 'COMPLETED' },
        { id: `t-${Date.now()}-2`, name: 'Material Procurement', status: 'IN_PROGRESS' },
        { id: `t-${Date.now()}-3`, name: 'Execution Phase 1', status: 'PENDING' }
      ]
    };

    try {
      await supabase.from('projects').insert({
        name: newProjName,
        customer_name: newProjCustomer,
        location: newProjLocation,
        status: 'IN_PROGRESS',
        start_date: newProject.start_date
      });
    } catch (err) {
      console.warn('Supabase project insert note', err);
    }

    setProjects(prev => [newProject, ...prev]);
    setSelectedProjectIdForProgress(newProject.id);
    setIsNewProjectModalOpen(false);
    setNewProjName('');
    setNewProjCustomer('');
    setNewProjLocation('');
    setNewProjBudget('');
    showToast(`Created project: ${newProjName}!`);
  };

  // Handle Task Status Toggle
  const handleToggleTaskStatus = (taskId: string) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id !== selectedProjectIdForProgress) return proj;
      const updatedTasks = (proj.tasks || []).map((t: any) => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'COMPLETED' ? 'IN_PROGRESS' : t.status === 'IN_PROGRESS' ? 'PENDING' : 'COMPLETED';
          return { ...t, status: nextStatus };
        }
        return t;
      });
      try {
        localStorage.setItem(`project_tasks_${proj.id}`, JSON.stringify(updatedTasks));
      } catch (e) {
        console.error(e);
      }
      return { ...proj, tasks: updatedTasks };
    }));
  };

  // Handle Add New Task to Project
  const handleAddNewTask = () => {
    if (!newTaskName.trim()) return;
    setProjects(prev => prev.map(proj => {
      if (proj.id !== selectedProjectIdForProgress) return proj;
      const newTasks = [...(proj.tasks || []), { id: `t-${Date.now()}`, name: newTaskName.trim(), status: 'PENDING' }];
      try {
        localStorage.setItem(`project_tasks_${proj.id}`, JSON.stringify(newTasks));
      } catch (e) {
        console.error(e);
      }
      return { ...proj, tasks: newTasks };
    }));
    setNewTaskName('');
    showToast('New milestone task added!');
  };

  // Handle Save Progress Update
  const handleSaveProgress = async () => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === selectedProjectIdForProgress) {
        return { 
          ...proj, 
          progress: progressValue,
          status: progressValue === 100 ? 'COMPLETED' : 'IN_PROGRESS'
        };
      }
      return proj;
    }));

    try {
      localStorage.setItem(`project_progress_${selectedProjectIdForProgress}`, String(progressValue));
    } catch (e) {
      console.error(e);
    }

    try {
      await supabase
        .from('projects')
        .update({ status: progressValue === 100 ? 'COMPLETED' : 'IN_PROGRESS' })
        .eq('id', selectedProjectIdForProgress);
    } catch (err) {
      console.warn('Supabase project update status note:', err);
    }

    setIsUpdateProgressModalOpen(false);
    showToast(`Project progress updated to ${progressValue}%!`);
  };

  // Handle Assignment Status Change (Persisted to Supabase)
  const handleUpdateAssignmentStatus = async (id: string, newStatus: string) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    try {
      await supabase.from('project_workers').update({ status: newStatus }).eq('id', id);
    } catch (err) {
      console.warn('Error updating assignment status in Supabase:', err);
    }
    showToast(`Assignment status updated to ${newStatus}`);
  };

  // Handle Remove / Cross Assignment (Deleted from Supabase)
  const handleRemoveAssignment = async (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
    try {
      await supabase.from('project_workers').delete().eq('id', id);
    } catch (err) {
      console.warn('Error deleting assignment from Supabase:', err);
    }
    showToast('Assignment removed successfully');
  };

  const activeProjectForProgress = projects.find(p => p.id === selectedProjectIdForProgress) || projects[0] || DEFAULT_PROJECTS[0];

  // Normalized active tab
  const currentTab = ['overview', 'projects', 'workers', 'assignments', 'progress', 'profile'].includes(activeTab) 
    ? activeTab 
    : (activeTab === 'feed' ? 'overview' : 'overview');

  // Filtered workers
  const filteredWorkers = workers.filter(w => {
    const matchesSearch = w.name?.toLowerCase().includes(workerSearch.toLowerCase()) || 
                          w.trade?.toLowerCase().includes(workerSearch.toLowerCase()) ||
                          w.coop_name?.toLowerCase().includes(workerSearch.toLowerCase());
    const isAssigned = assignments.some(a => a.worker_id === w.id);
    if (workerAvailabilityFilter === 'AVAILABLE') return matchesSearch && !isAssigned;
    if (workerAvailabilityFilter === 'ASSIGNED') return matchesSearch && isAssigned;
    return matchesSearch;
  });

  const formatRelativeTime = (timestamp?: string) => {
    if (!timestamp) return 'Recently';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Recently';
    const now = new Date();
    const diffSecs = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffSecs < 60) return 'Just now';
    if (diffSecs < 3600) return `${Math.max(1, Math.floor(diffSecs / 60))}m ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
    return `${Math.floor(diffSecs / 86400)}d ago`;
  };

  // Dynamic live activities computed directly from Supabase assignments & projects
  const dynamicActivities = [
    ...assignments.map(a => ({
      id: `act-assign-${a.id}`,
      type: 'ASSIGNMENT' as const,
      text: `${a.workers?.name || 'Craftsman'} assigned to `,
      boldText: a.task || 'Site Operations',
      subText: a.projects?.name ? `(${a.projects.name})` : '',
      time: formatRelativeTime(a.assigned_at || a.created_at),
      badge: 'Assigned',
      icon: 'check'
    })),
    ...projects.map(p => ({
      id: `act-proj-${p.id}`,
      type: 'PROJECT' as const,
      text: `Customer ${p.customer_name || 'Jatin Jangid'} project milestone: `,
      boldText: `${p.name || 'Construction Package'} (${p.progress || 25}% complete)`,
      subText: p.location ? `• ${p.location}` : '',
      time: formatRelativeTime(p.created_at),
      badge: p.status || 'Active',
      icon: 'check'
    })),
    {
      id: 'act-safety-1',
      type: 'SCHEDULED' as const,
      text: 'Safety gear and cooperative quality check scheduled for site inspection',
      boldText: '',
      subText: 'Scheduled 9:00 AM',
      time: 'Tomorrow',
      badge: 'Scheduled',
      icon: 'alert'
    }
  ].slice(0, 6);

  /* ------------------------------------------------------------- */
  /* TAB: OVERVIEW                                                 */
  /* ------------------------------------------------------------- */
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => handleTabSwitch('projects')}
          className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Active Projects</div>
            <LucideBriefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">{projects.length}</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <LucideTrendingUp className="w-3.5 h-3.5" /> On schedule
          </div>
        </div>

        <div 
          onClick={() => handleTabSwitch('workers')}
          className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Total Crew</div>
            <LucideUsers className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">{workers.length}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Verified Labourers</div>
        </div>

        <div 
          onClick={() => handleTabSwitch('assignments')}
          className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Assignments</div>
            <LucideCheckSquare className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">
            {assignments.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            {assignments.filter(a => a.status === 'REQUESTED').length} Pending approval
          </div>
        </div>

        <div 
          onClick={() => handleTabSwitch('progress')}
          className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Avg Progress</div>
            <LucidePieChart className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-2">
            {Math.round(projects.reduce((acc, curr) => acc + (curr.progress || 50), 0) / (projects.length || 1))}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Across all sites</div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between bg-emerald-50/70 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/60">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-sm font-bold text-emerald-900 dark:text-emerald-200 font-outfit">Quick Supervisor Controls</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => {
              const p = projects[0] || DEFAULT_PROJECTS[0];
              onOpenChat && onOpenChat({
                id: 'supervisor-chat',
                targetName: p.customer_name || 'Jatin Jangid',
                customerName: p.customer_name || 'Jatin Jangid',
                workerName: currentUser?.name || 'Er. Vikramaditya Rathore',
                service: p.name || 'Single Floor Villa — G+0',
                status: 'ACCEPTED'
              });
            }}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LucideMessageSquare className="w-3.5 h-3.5" /> Client & Worker Chats
          </button>
          <button 
            onClick={() => setIsAssignModalOpen(true)}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LucidePlusCircle className="w-3.5 h-3.5" /> Assign Worker
          </button>
          <button 
            onClick={() => setIsNewProjectModalOpen(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LucidePlusCircle className="w-3.5 h-3.5" /> + New Project
          </button>
          <button 
            onClick={() => {
              setProgressValue(activeProjectForProgress.progress || 60);
              setIsUpdateProgressModalOpen(true);
            }}
            className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-600 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LucideSliders className="w-3.5 h-3.5" /> Update Progress
          </button>
        </div>
      </div>

      {/* Active Projects List */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-outfit">Active Site Projects</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Current ongoing cooperative works</p>
          </div>
          <button 
            onClick={() => handleTabSwitch('projects')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            View All ({projects.length}) →
          </button>
        </div>

        <div className="space-y-4">
          {projects.map(p => {
            const projectWorkersCount = assignments.filter(a => a.project_id === p.id).length;
            return (
              <div key={p.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-base">{p.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {p.status || 'IN_PROGRESS'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><LucideMapPin className="w-3 h-3 text-slate-400" /> {p.location}</span>
                    <span>Customer: <strong className="text-slate-700 dark:text-slate-200">{p.customer_name}</strong></span>
                    <span>Assigned Workers: <strong className="text-slate-700 dark:text-slate-200">{projectWorkersCount}</strong></span>
                  </div>
                  <div className="w-full max-w-md pt-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      <span>Milestone Completion</span>
                      <span>{p.progress || 50}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: `${p.progress || 50}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    onClick={() => {
                      onOpenChat && onOpenChat({
                        id: p.name.includes('Single Floor') ? 'supervisor-chat' : (p.id || 'supervisor-chat'),
                        targetName: p.customer_name || 'Jatin Jangid',
                        customerName: p.customer_name || 'Jatin Jangid',
                        workerName: currentUser?.name || 'Er. Vikramaditya Rathore',
                        service: p.name,
                        status: 'ACCEPTED'
                      });
                    }}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <LucideMessageSquare className="w-3.5 h-3.5" /> Chat Customer
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedProjectIdForProgress(p.id);
                      setProgressValue(p.progress || 50);
                      setIsUpdateProgressModalOpen(true);
                    }}
                    className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Update Progress
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedProjectIdForProgress(p.id);
                      handleTabSwitch('progress');
                    }}
                    className="px-3.5 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-outfit">Recent Field Activities</h3>
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Supabase Feed
          </span>
        </div>

        {dynamicActivities.length > 0 ? (
          <div className="space-y-3 text-xs sm:text-sm">
            {dynamicActivities.map((act) => (
              <div 
                key={act.id} 
                className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                  act.icon === 'alert'
                    ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50'
                    : 'bg-slate-50 dark:bg-slate-750 border-slate-100 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center text-slate-700 dark:text-slate-200">
                  {act.icon === 'alert' ? (
                    <LucideAlertCircle className="w-4 h-4 mr-2.5 text-amber-500 shrink-0" />
                  ) : (
                    <LucideCheckSquare className="w-4 h-4 mr-2.5 text-emerald-500 shrink-0" />
                  )}
                  <span>
                    {act.text}
                    {act.boldText && <strong>{act.boldText}</strong>}
                    {act.subText && <span className="text-slate-400 text-xs ml-1.5">{act.subText}</span>}
                  </span>
                </div>
                <span className={`text-[11px] font-semibold shrink-0 ml-3 ${
                  act.icon === 'alert' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'
                }`}>
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            No recent activity recorded yet.
          </div>
        )}
      </div>
    </div>
  );

  /* ------------------------------------------------------------- */
  /* TAB: PROJECTS                                                 */
  /* ------------------------------------------------------------- */
  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-outfit">My Projects Directory</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage site timelines, assigned workers, and client handovers</p>
        </div>
        <button 
          onClick={() => setIsNewProjectModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LucidePlusCircle className="w-4 h-4" /> + Create New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(p => {
          const assignedList = assignments.filter(a => a.project_id === p.id);
          return (
            <div key={p.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-lg text-slate-900 dark:text-white font-outfit">{p.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <LucideMapPin className="w-3.5 h-3.5 text-emerald-600" /> {p.location}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-full border border-emerald-200 dark:border-emerald-800">
                    {p.status || 'IN_PROGRESS'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-750 p-3 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Customer</span>
                    <strong className="text-slate-800 dark:text-slate-200">{p.customer_name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Budget</span>
                    <strong className="text-slate-800 dark:text-slate-200">{p.budget || '₹5,00,000'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Start Date</span>
                    <strong className="text-slate-800 dark:text-slate-200">{p.start_date || 'Aug 2026'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Assigned Workers</span>
                    <strong className="text-slate-800 dark:text-slate-200">{assignedList.length} Craftsmen</strong>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Overall Project Progress</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{p.progress || 50}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: `${p.progress || 50}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-700">
                <button 
                  onClick={() => {
                    onOpenChat && onOpenChat({
                      id: p.name.includes('Single Floor') ? 'supervisor-chat' : (p.id || 'supervisor-chat'),
                      targetName: p.customer_name || 'Jatin Jangid',
                      customerName: p.customer_name || 'Jatin Jangid',
                      workerName: currentUser?.name || 'Er. Vikramaditya Rathore',
                      service: p.name,
                      status: 'ACCEPTED'
                    });
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <LucideMessageSquare className="w-3.5 h-3.5" /> Chat Customer
                </button>
                <button 
                  onClick={() => {
                    setSelectedProjectIdForProgress(p.id);
                    setProgressValue(p.progress || 50);
                    setIsUpdateProgressModalOpen(true);
                  }}
                  className="flex-1 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
                >
                  Update Progress
                </button>
                <button 
                  onClick={() => {
                    setAssignProject(p.id);
                    setIsAssignModalOpen(true);
                  }}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
                >
                  + Assign Worker
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  /* ------------------------------------------------------------- */
  /* TAB: WORKERS                                                  */
  /* ------------------------------------------------------------- */
  const renderWorkers = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-outfit">Workers Directory</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Search, inspect credentials, and assign cooperative workers to your projects</p>
        </div>
        <button 
          onClick={() => setIsAssignModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LucidePlusCircle className="w-4 h-4" /> Assign Worker
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <LucideSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search worker by name or skill..."
            value={workerSearch}
            onChange={e => setWorkerSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {(['ALL', 'AVAILABLE', 'ASSIGNED'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setWorkerAvailabilityFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                workerAvailabilityFilter === filter
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {filter === 'ALL' ? 'All Workers' : filter === 'AVAILABLE' ? 'Available' : 'Currently Assigned'}
            </button>
          ))}
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkers.map(w => {
          const currentAssignment = assignments.find(a => a.worker_id === w.id);
          const isAssigned = !!currentAssignment;

          return (
            <div key={w.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:border-emerald-400 transition-colors">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-extrabold text-sm border border-emerald-200 dark:border-emerald-800">
                      {w.name?.charAt(0) || 'W'}
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-white text-sm">{w.name}</div>
                      <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{w.trade}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                    isAssigned ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {isAssigned ? 'Assigned' : 'Available'}
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-750 p-2.5 rounded-xl space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                  <div>Cooperative: <strong>{w.coop_name || 'Delhi Labour Federation'}</strong></div>
                  <div>Rating: <strong className="text-amber-600">★ {w.rating || 4.8}</strong></div>
                  {isAssigned && (
                    <div className="text-blue-600 dark:text-blue-400 font-semibold pt-1 border-t border-slate-200 dark:border-slate-700">
                      Task: {currentAssignment?.task}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700 flex gap-2">
                <button 
                  onClick={() => {
                    onOpenChat && onOpenChat({
                      id: `worker-chat-${w.id}`,
                      targetName: w.name,
                      workerName: w.name,
                      customerName: currentUser?.name || 'Er. Vikramaditya Rathore',
                      service: w.trade || 'Cooperative Craftsman',
                      status: 'ACCEPTED'
                    });
                  }}
                  className="flex-1 py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <LucideMessageSquare className="w-3.5 h-3.5" /> Chat Worker
                </button>
                <button 
                  onClick={() => {
                    setAssignWorker(w.id);
                    setIsAssignModalOpen(true);
                  }}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  {isAssigned ? 'Reassign' : 'Assign'}
                </button>
              </div>
            </div>
          );
        })}

        {filteredWorkers.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            No workers match your filter criteria.
          </div>
        )}
      </div>
    </div>
  );

  /* ------------------------------------------------------------- */
  /* TAB: ASSIGNMENTS                                              */
  /* ------------------------------------------------------------- */
  const renderAssignments = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-outfit">Worker Assignments</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Track worker deployment, task progress, and live attendance across sites</p>
        </div>
        <button 
          onClick={() => setIsAssignModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LucidePlusCircle className="w-4 h-4" /> + New Assignment
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-750 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Worker</th>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Project / Site</th>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Assigned Task</th>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Status</th>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {assignments.map(a => (
                <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-750/50 transition-colors">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">
                        {a.workers?.name?.charAt(0) || 'W'}
                      </div>
                      <div>
                        <div>{a.workers?.name}</div>
                        <div className="text-[11px] font-normal text-slate-400">{a.workers?.trade}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">
                    {a.projects?.name || 'Jaipur Villa Site'}
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 font-semibold">
                    {a.task}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                      a.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                      a.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                      a.status === 'ACCEPTED' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => {
                          onOpenChat && onOpenChat({
                            id: `worker-chat-${a.workers?.id || a.worker_id}`,
                            targetName: a.workers?.name || 'Worker',
                            workerName: a.workers?.name || 'Worker',
                            customerName: currentUser?.name || 'Er. Vikramaditya Rathore',
                            service: a.task || 'Site Assignment',
                            status: 'ACCEPTED'
                          });
                        }}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:text-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <LucideMessageSquare className="w-3 h-3" /> Chat
                      </button>
                      {a.status !== 'IN_PROGRESS' && a.status !== 'COMPLETED' && (
                        <button 
                          onClick={() => handleUpdateAssignmentStatus(a.id, 'IN_PROGRESS')}
                          className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Start
                        </button>
                      )}
                      {a.status !== 'COMPLETED' && (
                        <button 
                          onClick={() => handleUpdateAssignmentStatus(a.id, 'COMPLETED')}
                          className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Done
                        </button>
                      )}
                      <button 
                        onClick={() => handleRemoveAssignment(a.id)}
                        title="Remove / Cancel Assignment"
                        className="p-1 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-lg text-xs font-bold transition-colors cursor-pointer ml-1"
                      >
                        <LucideX className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {assignments.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No active assignments found. Click "+ New Assignment" to allocate workers.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* ------------------------------------------------------------- */
  /* TAB: PROGRESS                                                 */
  /* ------------------------------------------------------------- */
  const renderProgress = () => (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-outfit">Project Progress Tracker</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Update completion rates, toggle task milestones, and notify client</p>
        </div>
        
        {/* Project Selector Dropdown */}
        <select 
          value={selectedProjectIdForProgress}
          onChange={e => {
            setSelectedProjectIdForProgress(e.target.value);
            const found = projects.find(p => p.id === e.target.value);
            if (found) setProgressValue(found.progress || 50);
          }}
          className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
        >
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        {/* Overall Progress Gauge */}
        <div className="bg-slate-50 dark:bg-slate-750 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-outfit">{activeProjectForProgress.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Customer: {activeProjectForProgress.customer_name} • {activeProjectForProgress.location}</p>
            </div>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {activeProjectForProgress.progress || 60}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-3.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${activeProjectForProgress.progress || 60}%` }}
            ></div>
          </div>
        </div>

        {/* Milestone Task Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Site Tasks & Milestones</h4>
            <span className="text-xs text-slate-400">Click task to cycle state</span>
          </div>

          <div className="space-y-2">
            {(activeProjectForProgress.tasks || []).map((t: any) => (
              <div 
                key={t.id}
                onClick={() => handleToggleTaskStatus(t.id)}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                    t.status === 'COMPLETED' ? 'bg-emerald-600 border-emerald-600 text-white' :
                    t.status === 'IN_PROGRESS' ? 'bg-blue-100 dark:bg-blue-950 border-blue-400 text-blue-600' :
                    'border-slate-300 dark:border-slate-600'
                  }`}>
                    {t.status === 'COMPLETED' && <LucideCheck className="w-3.5 h-3.5" />}
                    {t.status === 'IN_PROGRESS' && <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>}
                  </div>
                  <span className={`text-xs font-semibold ${t.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {t.name}
                  </span>
                </div>
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                  t.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                  t.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                  'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Add Task */}
          <div className="flex gap-2 pt-2">
            <input 
              type="text"
              placeholder="Add new task milestone..."
              value={newTaskName}
              onChange={e => setNewTaskName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddNewTask()}
              className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button 
              onClick={handleAddNewTask}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Big Action Button */}
        <button 
          onClick={() => {
            setProgressValue(activeProjectForProgress.progress || 60);
            setIsUpdateProgressModalOpen(true);
          }}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <LucideSliders className="w-4 h-4" /> Update Progress
        </button>
      </div>
    </div>
  );

  /* ------------------------------------------------------------- */
  /* TAB: PROFILE                                                  */
  /* ------------------------------------------------------------- */
  const renderProfile = () => (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-emerald-700 text-white flex items-center justify-center text-2xl font-black shadow-md border-2 border-emerald-500">
            {currentUser?.name?.charAt(0) || 'S'}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white font-outfit">{currentUser?.name || 'Er. Vikramaditya Rathore'}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{currentUser?.email || 'supervisor@sahkarigig.org'}</p>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-1">
              Lead Cooperative Project Supervisor
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
          <div className="bg-slate-50 dark:bg-slate-750 p-3 rounded-xl text-center">
            <span className="text-[11px] text-slate-400 block font-semibold">Active Projects</span>
            <strong className="text-lg font-black text-slate-900 dark:text-white">{projects.length}</strong>
          </div>
          <div className="bg-slate-50 dark:bg-slate-750 p-3 rounded-xl text-center">
            <span className="text-[11px] text-slate-400 block font-semibold">Supervised Crew</span>
            <strong className="text-lg font-black text-slate-900 dark:text-white">{workers.length}</strong>
          </div>
          <div className="bg-slate-50 dark:bg-slate-750 p-3 rounded-xl text-center col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-400 block font-semibold">Experience</span>
            <strong className="text-lg font-black text-slate-900 dark:text-white">8+ Yrs</strong>
          </div>
        </div>
      </div>

      {/* Appearance & Theme Settings Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm font-outfit">Appearance & Theme</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 uppercase">
            {theme}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${theme === 'light'
                ? 'border-amber-500 bg-amber-50/70 dark:bg-slate-750 ring-2 ring-amber-500/30 shadow-xs text-amber-600 dark:text-amber-400 font-bold'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
          >
            <Sun className="w-5 h-5 mx-auto mb-1 text-amber-500" />
            <p className="text-xs font-bold">Light</p>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${theme === 'dark'
                ? 'border-sky-500 bg-sky-50/70 dark:bg-slate-750 ring-2 ring-sky-500/30 shadow-xs text-sky-600 dark:text-sky-400 font-bold'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
          >
            <Moon className="w-5 h-5 mx-auto mb-1 text-sky-400" />
            <p className="text-xs font-bold">Dark</p>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${theme === 'system'
                ? 'border-emerald-500 bg-emerald-50/70 dark:bg-slate-750 ring-2 ring-emerald-500/30 shadow-xs text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
          >
            <Laptop className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
            <p className="text-xs font-bold">System</p>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold border border-slate-700 animate-in slide-in-from-bottom-2">
          <LucideCheck className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-outfit">
            {greeting}, {currentUser?.name?.split(' ')[0] || 'Supervisor'} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5 font-medium">
            SahkariGig Supervisor Management Panel
          </p>
        </div>
      </div>

      {/* Active Tab View */}
      <div className="pb-16">
        {currentTab === 'overview' && renderOverview()}
        {currentTab === 'projects' && renderProjects()}
        {currentTab === 'workers' && renderWorkers()}
        {currentTab === 'assignments' && renderAssignments()}
        {currentTab === 'progress' && renderProgress()}
        {currentTab === 'profile' && renderProfile()}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ASSIGN WORKER                                          */}
      {/* ------------------------------------------------------------- */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white font-outfit">Assign Worker to Site</h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            
            <form onSubmit={handleAssignWorkerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Project</label>
                <select 
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={assignProject}
                  onChange={e => setAssignProject(e.target.value)}
                  required
                >
                  <option value="">Select Project...</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name} ({p.location})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Worker</label>
                <select 
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={assignWorker}
                  onChange={e => setAssignWorker(e.target.value)}
                  required
                >
                  <option value="">Select Worker...</option>
                  {workers.map(w => <option key={w.id} value={w.id}>{w.name} — {w.trade}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Assigned Task / Role</label>
                <input 
                  type="text" 
                  placeholder="e.g. Brickwork North Wall or Wiring"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={assignTask}
                  onChange={e => setAssignTask(e.target.value)}
                  required
                />
              </div>

              <div className="flex space-x-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button 
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: CREATE PROJECT                                         */}
      {/* ------------------------------------------------------------- */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white font-outfit">Create New Site Project</h3>
              <button onClick={() => setIsNewProjectModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            
            <form onSubmit={handleCreateProjectSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Project Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Duplex Villa Construction"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newProjName}
                  onChange={e => setNewProjName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Customer Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sanjay Verma"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newProjCustomer}
                  onChange={e => setNewProjCustomer(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Site Location</label>
                <input 
                  type="text" 
                  placeholder="e.g. Vaishali Nagar, Jaipur"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newProjLocation}
                  onChange={e => setNewProjLocation(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Estimated Budget</label>
                <input 
                  type="text" 
                  placeholder="e.g. ₹8,50,000"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newProjBudget}
                  onChange={e => setNewProjBudget(e.target.value)}
                />
              </div>

              <div className="flex space-x-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button 
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: UPDATE PROGRESS                                        */}
      {/* ------------------------------------------------------------- */}
      {isUpdateProgressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white font-outfit">Update Project Progress</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{activeProjectForProgress.name}</p>
              </div>
              <button onClick={() => setIsUpdateProgressModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            
            <div className="space-y-5">
              {/* Slider */}
              <div className="bg-slate-50 dark:bg-slate-750 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Completion Percentage</label>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{progressValue}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={progressValue}
                  onChange={e => setProgressValue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Quick Percentage Presets */}
              <div className="flex justify-between gap-1.5">
                {[25, 50, 75, 100].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setProgressValue(val)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      progressValue === val 
                        ? 'bg-emerald-600 text-white border-emerald-600' 
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {val}%
                  </button>
                ))}
              </div>

              <div className="flex space-x-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button 
                  type="button"
                  onClick={() => setIsUpdateProgressModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSaveProgress}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Save Progress
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
