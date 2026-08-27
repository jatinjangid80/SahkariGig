import React, { useState } from 'react';
import { Users, CheckSquare, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export const CrewProjectSection: React.FC = () => {
  const [projects] = useState([
    {
      id: 'proj-501',
      title: '3BHK Flat Renovation Project',
      customer: 'Ananya Sharma',
      location: 'Green Park, New Delhi',
      crew: ['Electrician (Rajesh K.)', 'Plumber (Suresh S.)', 'Painter (Anita V.)'],
      progress: 65,
      tasks: [
        { name: 'Electrical rewiring & MCB box upgrade', done: true },
        { name: 'Bathroom plumbing & fixture replacement', done: true },
        { name: 'Wall priming & dual-coat interior painting', done: false },
        { name: 'Final quality inspection & cooperative sign-off', done: false }
      ]
    }
  ]);

  return (
    <div className="py-8 bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Multi-Trade Projects
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">
            Cooperative Renovation & Community Projects
          </h1>
          <p className="text-sm text-slate-600">
            Multi-skill crew management with checklist-based progress tracking and single point of contact.
          </p>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          {projects.map((proj) => (
            <div key={proj.id} className="light-card p-6 space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-outfit">{proj.title}</h2>
                  <p className="text-xs text-slate-500">{proj.customer} • {proj.location}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700">{proj.progress}% Completed</span>
                  <div className="w-36 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${proj.progress}%` }} />
                  </div>
                </div>
              </div>

              {/* Multi-trade Crew */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center">
                  <Users className="w-4 h-4 text-emerald-600 mr-1.5" />
                  Assigned Multi-Trade Cooperative Crew
                </h3>
                <div className="flex flex-wrap gap-2">
                  {proj.crew.map((member) => (
                    <span key={member} className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200">
                      ✓ {member}
                    </span>
                  ))}
                </div>
              </div>

              {/* Checklist Progress */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center">
                  <CheckSquare className="w-4 h-4 text-emerald-600 mr-1.5" />
                  Project Milestone Checklist
                </h3>
                <div className="space-y-2">
                  {proj.tasks.map((task) => (
                    <div key={task.name} className="flex items-center space-x-2 text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <input
                        type="checkbox"
                        checked={task.done}
                        readOnly
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span className={task.done ? 'line-through text-slate-400 font-medium' : 'font-bold text-slate-900'}>
                        {task.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
