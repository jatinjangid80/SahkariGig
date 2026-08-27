import React from 'react';
import { ShieldCheck, UserCheck, Briefcase, MessageSquare, CreditCard, Users, Settings, LogIn, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentUser, setCurrentUser }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Ministry Badge */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('marketplace')}>
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white font-outfit">Sahkari<span className="gradient-text">Gig</span></span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  SIH26089
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Ministry of Cooperation • Labour Cooperative Platform</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'marketplace'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Marketplace</span>
            </button>

            <button
              onClick={() => setActiveTab('verify')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'verify'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>QR ID Verify</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'chat'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Live Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('crew')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'crew'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Crew Projects</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'admin'
                  ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Coop Admin</span>
            </button>
          </nav>

          {/* User Role Switcher & Profile Badge */}
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  currentUser.role === 'admin' ? 'bg-purple-400 animate-ping' :
                  currentUser.role === 'worker' ? 'bg-amber-400' : 'bg-emerald-400'
                }`} />
                <div className="text-left">
                  <p className="text-xs font-semibold text-white leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{currentUser.role} Mode</p>
                </div>
              </div>
            </div>

            {/* Quick Demo Role Toggle Buttons */}
            <div className="hidden lg:flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setCurrentUser({ id: 'usr-cust-1', name: 'Ananya Roy', email: 'ananya@example.com', role: 'customer' })}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  currentUser.role === 'customer' ? 'bg-emerald-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => setCurrentUser({ id: 'wrk-1', name: 'Rajesh Kumar', email: 'rajesh@coop.org', role: 'worker', status: 'active', workerId: 'COOP-2026-00101' })}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  currentUser.role === 'worker' ? 'bg-amber-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Worker
              </button>
              <button
                onClick={() => setCurrentUser({ id: 'usr-admin-1', name: 'Ramesh Sharma', email: 'admin@coop.org', role: 'admin' })}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  currentUser.role === 'admin' ? 'bg-purple-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
