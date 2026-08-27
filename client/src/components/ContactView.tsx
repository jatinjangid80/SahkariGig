import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Mail, User, ShieldCheck } from 'lucide-react';
import { CONFIG } from '../config';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Customer');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessTicket(null);

    try {
      const res = await fetch(`${CONFIG.apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, message })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessTicket(data.data?.ticketId || 'TICK-2026-001');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setErrorMsg(data.message || 'Failed to submit contact request.');
      }
    } catch (err) {
      setErrorMsg('Error connecting to backend API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 max-w-2xl mx-auto px-4">
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl">
        
        <div className="mb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">CONTACT THE COOPERATIVE</span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1 font-outfit">Get in Touch</h1>
          <p className="text-xs text-slate-400 mt-1">Have questions about joining as a worker or setting up a household/community account?</p>
        </div>

        {successTicket && (
          <div className="mb-6 p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl flex items-start space-x-3 text-xs text-emerald-300 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Message Received!</p>
              <p className="mt-0.5">Your support ticket ID is <span className="font-mono text-emerald-300 font-bold">{successTicket}</span>. A cooperative administrator will get in touch shortly.</p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Your Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 text-white rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ramesh@example.com"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 text-white rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Primary Role Interest</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 text-white rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Customer">Household / Community Customer</option>
              <option value="Worker">Skilled Worker / Cooperative Member</option>
              <option value="Cooperative Admin">Cooperative Society Admin / Staff</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Message / Query</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your query or interest in the cooperative gig platform..."
              className="w-full px-3.5 py-2.5 bg-slate-950/80 text-white rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 gradient-bg hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
