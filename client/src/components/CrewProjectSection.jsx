import React, { useState, useEffect } from 'react';
import { Users, CheckSquare, Plus, Clock, ShieldCheck, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

export default function CrewProjectSection({ currentUser }) {
  const [projects, setProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState(75000);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success) setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || 'demo-token';
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          estimatedBudget
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setTitle('');
        setDescription('');
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTaskStatus = async (projectId, taskId, currentStatus) => {
    const nextStatus = currentStatus === 'done' ? 'pending' : currentStatus === 'pending' ? 'in_progress' : 'done';
    try {
      const token = localStorage.getItem('token') || 'demo-token';
      const res = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Multi-Trade Crew Projects</h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
              Phase 13 Feature
            </span>
          </div>
          <p className="text-sm text-slate-400">Cooperative crew assembly for large building renovation & multi-trade projects</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 gradient-bg hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2 border border-emerald-400/30"
        >
          <Plus className="w-4 h-4" />
          <span>New Multi-Trade Project Request</span>
        </button>
      </div>

      {/* Projects Feed */}
      <div className="space-y-6">
        {projects.map((proj) => (
          <div key={proj.id} className="glass-panel rounded-3xl p-6 border border-slate-800 shadow-xl">
            
            {/* Title & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-emerald-400">#{proj.id}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 rounded-md">
                    {proj.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">{proj.title}</h3>
                <p className="text-xs text-slate-400">Client: {proj.customerName} • Target Completion: {proj.targetEndDate}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Progress %</span>
                <p className="text-2xl font-extrabold text-emerald-400">{proj.progressPercentage}%</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="my-4 w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${proj.progressPercentage}%` }}
              />
            </div>

            <p className="text-xs text-slate-300 mb-4">{proj.description}</p>

            {/* Assembled Crew List */}
            <div className="mb-4 pt-3 border-t border-slate-800">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Assembled Cooperative Crew ({proj.crew?.length || 0})</p>
              <div className="flex flex-wrap gap-3">
                {proj.crew?.map((member) => (
                  <div key={member.workerId} className="flex items-center space-x-2 p-2 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-semibold text-white">{member.name}</span>
                    <span className="text-slate-400">({member.trade})</span>
                    {member.isLead && <span className="px-1.5 py-0.5 text-[9px] bg-emerald-500/20 text-emerald-300 font-bold rounded">LEAD</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Task Checklist */}
            <div className="pt-3 border-t border-slate-800">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Multi-Trade Task Checklist</p>
              <div className="space-y-2">
                {proj.tasks?.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTaskStatus(proj.id, task.id, task.status)}
                    className="p-3 bg-slate-900/70 hover:bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${
                        task.status === 'done' ? 'bg-emerald-500 text-slate-950' :
                        task.status === 'in_progress' ? 'bg-amber-500 text-slate-950' : 'border border-slate-700 text-transparent'
                      }`}>
                        ✓
                      </div>
                      <div>
                        <p className={`text-xs font-medium ${task.status === 'done' ? 'line-through text-slate-500' : 'text-white'}`}>
                          {task.taskName}
                        </p>
                        <span className="text-[10px] text-slate-400">Trade: {task.trade} • Due: {task.dueDate}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      task.status === 'done' ? 'bg-emerald-500/20 text-emerald-300' :
                      task.status === 'in_progress' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* New Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg glass-panel rounded-3xl p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Request Multi-Trade Project Crew</h3>
            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 2BHK Complete Electrical & Painting Renovation"
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Project Scope / Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe scope across electrician, painter, plumber..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 py-3 gradient-bg text-white font-bold rounded-xl"
                >
                  Submit Project Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-3 bg-slate-800 text-slate-400 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
