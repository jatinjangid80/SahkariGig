import React, { useState, useEffect, useRef } from 'react';
import { 
  LucideSend, LucideSearch, LucidePhone, LucideCheckCheck, 
  LucidePaperclip, LucideSparkles, LucideBuilding2, LucideUsers, 
  LucideUser, LucideShieldCheck, LucideCircle, LucideMoreVertical,
  LucidePlus, LucideCheck, LucideSmile, LucideMessageSquare, LucideArrowLeft
} from 'lucide-react';
import { supabase } from '../supabase';

interface Contact {
  id: string;
  name: string;
  role: 'Customer' | 'Worker' | 'Supervisor' | 'Support';
  subTitle?: string;
  project?: string;
  avatarBg?: string;
  initials: string;
  isOnline?: boolean;
  phone?: string;
  lastMessage?: string;
  lastTime?: string;
  unreadCount?: number;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

interface MessengerViewProps {
  currentUser?: { name: string; role: string; id: string; email: string } | null;
  onNavigate?: (path: string) => void;
  initialContactId?: string;
}

const DEFAULT_CONTACTS: Contact[] = [
  {
    id: 'c-jatin',
    name: 'Jatin Jangid',
    role: 'Customer',
    subTitle: 'Client • Single Floor Villa G+0',
    project: 'Single Floor Villa — G+0',
    avatarBg: 'bg-emerald-700',
    initials: 'JJ',
    isOnline: true,
    phone: '+91 98290 12345',
    lastMessage: 'Can you confirm when the slab casting inspection starts?',
    lastTime: '10:45 AM',
    unreadCount: 2
  },
  {
    id: 'w-tarun',
    name: 'Tarun Bhaiya',
    role: 'Worker',
    subTitle: 'Site Worker • Verified Cleaner',
    project: 'Single Floor Villa — G+0',
    avatarBg: 'bg-blue-600',
    initials: 'TB',
    isOnline: true,
    phone: '+91 98765 43210',
    lastMessage: 'Finished debris clearance on ground floor section A.',
    lastTime: '11:12 AM',
    unreadCount: 0
  },
  {
    id: 'w-justin',
    name: 'Justin Joseph',
    role: 'Worker',
    subTitle: 'Lead Electrician • Rajasthan Vidyut Coop',
    project: 'Single Floor Villa — G+0',
    avatarBg: 'bg-amber-600',
    initials: 'JJ',
    isOnline: false,
    phone: '+91 98111 88990',
    lastMessage: 'Main conduit piping layout completed for living room.',
    lastTime: 'Yesterday',
    unreadCount: 0
  },
  {
    id: 'w-pintu',
    name: 'Pintu Lal',
    role: 'Worker',
    subTitle: 'Master Mason • Jaipur Shramik Sahkari',
    project: 'Single Floor Villa — G+0',
    avatarBg: 'bg-purple-600',
    initials: 'PL',
    isOnline: true,
    phone: '+91 98222 77665',
    lastMessage: 'North wall brickwork 90% completed. Ready for inspection.',
    lastTime: 'Sep 13',
    unreadCount: 0
  },
  {
    id: 's-vikram',
    name: 'Er. Vikramaditya Rathore',
    role: 'Supervisor',
    subTitle: 'Chief Project Supervisor • Certified Engineer',
    project: 'Single Floor Villa — G+0',
    avatarBg: 'bg-emerald-800',
    initials: 'VR',
    isOnline: true,
    phone: '+91 98333 44556',
    lastMessage: 'Inspection report submitted and verified for Milestone 2.',
    lastTime: 'Sep 12',
    unreadCount: 0
  },
  {
    id: 'support-coop',
    name: 'Rajasthan Coop Union Desk',
    role: 'Support',
    subTitle: 'Federation Dispute & Safety Desk',
    project: 'Cooperative Federation',
    avatarBg: 'bg-slate-700',
    initials: 'RC',
    isOnline: true,
    phone: '1800-SAHKARI',
    lastMessage: 'Escrow payment milestone ₹85,500 protected under union statute.',
    lastTime: 'Sep 10',
    unreadCount: 0
  }
];

const QUICK_PROMPTS = [
  "Site inspection completed today. Quality verified.",
  "Materials arriving tomorrow at 10:00 AM.",
  "Slab casting approved for next phase.",
  "Payment milestone released. Thank you!",
  "Please update site attendance logs."
];

export const MessengerView: React.FC<MessengerViewProps> = ({
  currentUser,
  onNavigate,
  initialContactId
}) => {
  const [contacts, setContacts] = useState<Contact[]>(DEFAULT_CONTACTS);
  const [selectedContact, setSelectedContact] = useState<Contact>(DEFAULT_CONTACTS[0]);
  const [filterRole, setFilterRole] = useState<'ALL' | 'Customer' | 'Worker' | 'Supervisor'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  // Set initial contact if provided or adjust based on currentUser role
  useEffect(() => {
    if (initialContactId) {
      const match = DEFAULT_CONTACTS.find(c => c.id === initialContactId);
      if (match) setSelectedContact(match);
    } else if (currentUser?.role === 'Customer') {
      // If customer is viewing, default to chat with Supervisor Vikramaditya
      const supervisor = DEFAULT_CONTACTS.find(c => c.role === 'Supervisor');
      if (supervisor) setSelectedContact(supervisor);
    } else if (currentUser?.role === 'Worker') {
      // If worker is viewing, default to chat with Supervisor Vikramaditya
      const supervisor = DEFAULT_CONTACTS.find(c => c.role === 'Supervisor');
      if (supervisor) setSelectedContact(supervisor);
    }
  }, [currentUser, initialContactId]);

  // Load messages for the selected contact
  useEffect(() => {
    if (!selectedContact) return;

    const myId = currentUser?.id || 'demo-user';
    const chatId = [myId, selectedContact.id].sort().join('_');
    const storageKey = `sahkari_chat_${chatId}`;

    // Initial load from localStorage
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved chat messages', e);
      }
    } else {
      // Default seeded messages for realistic context
      const initialSeed: Message[] = [
        {
          id: 'seed-1',
          senderId: selectedContact.id,
          senderName: selectedContact.name,
          senderRole: selectedContact.role,
          text: `Namaste! This is ${selectedContact.name}. I am connected for the ${selectedContact.project || 'SahkariGig Project'}.`,
          timestamp: 'Yesterday at 5:30 PM',
          isSelf: false,
          status: 'read'
        },
        {
          id: 'seed-2',
          senderId: selectedContact.id,
          senderName: selectedContact.name,
          senderRole: selectedContact.role,
          text: selectedContact.lastMessage || 'Looking forward to coordinating smoothly.',
          timestamp: selectedContact.lastTime || 'Today at 10:00 AM',
          isSelf: false,
          status: 'read'
        }
      ];
      setMessages(initialSeed);
      localStorage.setItem(storageKey, JSON.stringify(initialSeed));
    }

    // Set up Supabase real-time broadcast channel
    const channel = supabase.channel(`live_messenger_${chatId}`);
    channel
      .on('broadcast', { event: 'new_msg' }, (payload: any) => {
        const incoming = payload.payload;
        if (incoming && incoming.senderId !== myId) {
          setMessages(prev => {
            if (prev.some(m => m.id === incoming.id)) return prev;
            const updated = [...prev, { ...incoming, isSelf: false }];
            localStorage.setItem(storageKey, JSON.stringify(updated));
            return updated;
          });
        }
      })
      .on('broadcast', { event: 'typing' }, (payload: any) => {
        if (payload.payload?.senderId === selectedContact.id) {
          setIsTyping(payload.payload.isTyping);
        }
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [selectedContact, currentUser]);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content || !selectedContact) return;

    const myId = currentUser?.id || 'demo-user';
    const myName = currentUser?.name || 'Er. Vikramaditya Rathore';
    const myRole = currentUser?.role || 'Supervisor';
    const chatId = [myId, selectedContact.id].sort().join('_');
    const storageKey = `sahkari_chat_${chatId}`;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: myId,
      senderName: myName,
      senderRole: myRole,
      text: content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
      status: 'sent'
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setInputText('');

    // Broadcast in real-time
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'new_msg',
        payload: newMsg
      }).catch((e: any) => console.warn('Supabase broadcast error', e));
    }

    // Also update contact's last message snippet
    setContacts(prev => prev.map(c => 
      c.id === selectedContact.id ? { ...c, lastMessage: content, lastTime: 'Just now' } : c
    ));
  };

  const filteredContacts = contacts.filter(c => {
    const matchesRole = filterRole === 'ALL' || c.role === filterRole;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.project && c.project.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (c.subTitle && c.subTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-outfit">
              Sahkari Messenger Hub
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <LucideShieldCheck className="w-3.5 h-3.5 mr-1" />
              Verified Escrow Channel
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time direct communications between Site Supervisors, Customers, and Cooperative Craftsmen.
          </p>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('/dashboard')}
            className="self-start sm:self-auto px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LucideArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        )}
      </div>

      {/* Main Messenger Window Container */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px] max-h-[750px]">
        
        {/* LEFT COLUMN: CONTACTS LIST (4 Cols) */}
        <div className="lg:col-span-4 border-r border-slate-200 dark:border-slate-700 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
          
          {/* Search Box */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 space-y-3">
            <div className="relative">
              <LucideSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search customers, workers, projects..."
                className="w-full pl-9 pr-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1">
              {(['ALL', 'Customer', 'Worker', 'Supervisor'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors shrink-0 cursor-pointer ${
                    filterRole === role
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                  }`}
                >
                  {role === 'ALL' ? 'All Chats' : `${role}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Contacts Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredContacts.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <LucideUsers className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-bold">No contacts found</p>
              </div>
            ) : (
              filteredContacts.map(contact => {
                const isSelected = selectedContact.id === contact.id;
                return (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-l-4 border-emerald-600'
                        : 'hover:bg-white dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {/* Avatar Initials Badge */}
                    <div className="relative shrink-0">
                      <div className={`w-11 h-11 rounded-2xl ${contact.avatarBg || 'bg-emerald-700'} text-white font-black text-sm flex items-center justify-center shadow-xs font-outfit uppercase`}>
                        {contact.initials}
                      </div>
                      {contact.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 ring-1 ring-emerald-400" />
                      )}
                    </div>

                    {/* Contact Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate font-outfit">
                          {contact.name}
                        </p>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0">
                          {contact.lastTime}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                          contact.role === 'Customer' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' :
                          contact.role === 'Worker' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                          'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {contact.role}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {contact.project}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 truncate font-normal">
                        {contact.lastMessage}
                      </p>
                    </div>

                    {/* Unread Counter */}
                    {(contact.unreadCount || 0) > 0 && (
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-2xs">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE CHAT CONVERSATION (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col h-full bg-white dark:bg-slate-800">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/60">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl ${selectedContact.avatarBg || 'bg-emerald-700'} text-white font-black text-xs flex items-center justify-center shadow-xs font-outfit uppercase`}>
                {selectedContact.initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-outfit">
                    {selectedContact.name}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    selectedContact.role === 'Customer' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' :
                    selectedContact.role === 'Worker' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {selectedContact.role}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                  <span>•</span>
                  <span>{selectedContact.project}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a 
                href={`tel:${selectedContact.phone || '18007245274'}`}
                className="p-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-slate-600 rounded-xl text-slate-600 dark:text-slate-300 transition-colors"
                title="Call Contact"
              >
                <LucidePhone className="w-4 h-4" />
              </a>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('/control-center')}
                  className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  View Project
                </button>
              )}
            </div>
          </div>

          {/* Chat Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30 dark:bg-slate-900/30">
            
            {/* Escrow Guarantee Security Tag */}
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
              <div className="flex items-center gap-2">
                <LucideShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>End-to-End Escrow Protected. Cooperative arbitration enabled for this thread.</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">Active</span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-end gap-2 max-w-[80%]">
                  {!msg.isSelf && (
                    <div className={`w-7 h-7 rounded-xl ${selectedContact.avatarBg || 'bg-emerald-700'} text-white font-bold text-[10px] flex items-center justify-center shrink-0 uppercase mb-1`}>
                      {selectedContact.initials}
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed shadow-2xs ${
                      msg.isSelf
                        ? 'bg-emerald-600 text-white rounded-br-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-200/80 dark:border-slate-600 rounded-bl-xs'
                    }`}
                  >
                    {!msg.isSelf && (
                      <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                        {msg.senderName} ({msg.senderRole})
                      </p>
                    )}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    
                    <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                      msg.isSelf ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-400'
                    }`}>
                      <span>{msg.timestamp}</span>
                      {msg.isSelf && (
                        <LucideCheckCheck className="w-3.5 h-3.5 text-emerald-200" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium italic">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                <span>{selectedContact.name} is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-2 shrink-0 flex items-center gap-1">
                <LucideSparkles className="w-3 h-3 text-emerald-500" /> Quick:
              </span>
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 hover:text-emerald-700 rounded-lg text-[11px] font-semibold border border-slate-200 dark:border-slate-600 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input Bar */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => alert("Attaching site photos & verification documents to message")}
              className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Attach File / Photo"
            >
              <LucidePaperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={`Message ${selectedContact.name}...`}
              className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <LucideSend className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
