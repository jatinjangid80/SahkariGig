import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Mail, User, ShieldCheck } from 'lucide-react';
import { CONFIG } from '../config';
import { supabase } from '../supabase';

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
      const { data, error } = await supabase
        .from('contact_inquiries')
        .insert([
          { name, email, role, message }
        ])
        .select()
        .single();

      if (error) throw error;
      
      setSuccessTicket(data.id.split('-')[0].toUpperCase()); // Uses part of the UUID as a mock ticket ID
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      console.error("Error submitting contact form:", err);
      setErrorMsg(err.message || 'Error connecting to database. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 max-w-2xl mx-auto px-4">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        
        <div className="mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 font-bold">CONTACT THE COOPERATIVE</span>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1 font-outfit">Get in Touch</h1>
          <p className="text-sm text-slate-600 mt-2 font-medium">Have questions about joining as a worker or setting up a household/community account?</p>
        </div>

        {successTicket && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-3 text-sm text-emerald-800 animate-fade-in shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-900">Message Received!</p>
              <p className="mt-0.5">Your support ticket ID is <span className="font-mono text-emerald-700 font-bold">{successTicket}</span>. A cooperative administrator will get in touch shortly.</p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-start space-x-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">Your Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ramesh@example.com"
              className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1.5">Primary Role Interest</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-sm"
            >
              <option value="Customer">Household / Community Customer</option>
              <option value="Worker">Skilled Worker / Cooperative Member</option>
              <option value="Cooperative Admin">Cooperative Society Admin / Staff</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1.5">Message / Query</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your query or interest in the cooperative gig platform..."
              className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center space-x-2 disabled:opacity-50 transition-all btn-interaction"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
