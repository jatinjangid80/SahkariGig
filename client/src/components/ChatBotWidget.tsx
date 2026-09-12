import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, X, Send, Bot, Sparkles, User, ArrowRight, 
  ShieldCheck, Calendar, Users, Zap, Droplet, Hammer, Paintbrush, 
  RefreshCw, ChevronRight, HelpCircle, CheckCircle, ExternalLink, QrCode
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actions?: {
    label: string;
    actionType: 'BOOK' | 'NAVIGATE' | 'VERIFY' | 'QUERY';
    payload?: string;
  }[];
}

interface ChatBotWidgetProps {
  onNavigate?: (path: string) => void;
  onOpenBooking?: (workerOrTrade?: any) => void;
  onVerifyWorker?: (workerId?: string) => void;
  currentUser?: any;
}

export const ChatBotWidget: React.FC<ChatBotWidgetProps> = ({
  onNavigate,
  onOpenBooking,
  onVerifyWorker,
  currentUser
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'bot',
      text: `Hello ${currentUser?.name ? currentUser.name : 'there'}! 👋 Welcome to **SahkariGig AI Assistant**. I can help you find verified workers, book single professionals or full crews, check standard cooperative rates, or verify worker credentials. How can I assist you today?`,
      timestamp: 'Just now',
      actions: [
        { label: '⚡ Book Electrician', actionType: 'BOOK', payload: 'Electrician' },
        { label: '👥 Book Team / Crew', actionType: 'BOOK', payload: 'CREW' },
        { label: '💰 Check Price Rates', actionType: 'QUERY', payload: 'What are your rates and pricing?' },
        { label: '🛡️ Verify Worker ID / QR', actionType: 'VERIFY', payload: 'WORKER-DEL-8901' },
        { label: '🤝 How SahkariGig Works', actionType: 'QUERY', payload: 'How does the cooperative model work?' }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const quickPrompts = [
    'How do I book a worker?',
    'Book multiple workers crew',
    'What are the standard rates?',
    'How to verify worker QR code?',
    'Available services in Jaipur / Delhi'
  ];

  // Intelligent Knowledge Base & Intent Matcher
  const generateBotReply = (query: string): { text: string; actions?: Message['actions'] } => {
    const q = query.toLowerCase().trim();

    // 1. Single Worker vs Multiple Worker Booking
    if (q.includes('multiple worker') || q.includes('crew') || q.includes('team') || q.includes('group') || q.includes('bulk')) {
      return {
        text: `👥 **Multiple Workers / Crew Booking Available!**\n\nOn SahkariGig, you can book an entire verified cooperative crew (from 2 up to 30+ workers) for renovation, deep cleaning, event staff, shifting, painting, or construction.\n\n✨ **What's included:**\n- 1 Lead Cooperative Supervisor\n- Verified & background-checked technicians\n- Group accident & safety insurance\n- Half-Day (4 hrs) or Full-Day (8 hrs) shifts\n- Transparent rate: ~₹500/worker/day with zero platform commission!`,
        actions: [
          { label: '👥 Open Crew Booking', actionType: 'BOOK', payload: 'CREW' },
          { label: '👷 View Worker Directory', actionType: 'NAVIGATE', payload: '/workers' }
        ]
      };
    }

    // 2. Booking a specific trade
    if (q.includes('electrician') || q.includes('wiring') || q.includes('switch') || q.includes('fuse') || q.includes('light')) {
      return {
        text: `⚡ **Verified Electricians Available!**\n\nWe have verified master electricians from the Labour Cooperative Federation ready for dispatch.\n\n- **Standard Visit Rate:** ₹400 – ₹700 / visit\n- **Response Time:** Under 2 hours (Express) or Scheduled\n- **Guarantee:** 100% background-verified with government skill certification.`,
        actions: [
          { label: '⚡ Book Electrician Now', actionType: 'BOOK', payload: 'Electrician' },
          { label: '🔍 Browse Electricians', actionType: 'NAVIGATE', payload: '/workers' }
        ]
      };
    }

    if (q.includes('plumber') || q.includes('pipe') || q.includes('leak') || q.includes('tap') || q.includes('drain')) {
      return {
        text: `💧 **Verified Plumbers Ready for Service!**\n\nOur cooperative plumbers handle pipe repairs, leakages, bathroom fixtures, water tank installations, and motor repairs.\n\n- **Standard Visit Rate:** ₹400 – ₹700 / visit\n- **Includes:** Standard leak diagnostics & repair tools.`,
        actions: [
          { label: '💧 Book Plumber Now', actionType: 'BOOK', payload: 'Plumber' },
          { label: '🔍 Browse Plumbers', actionType: 'NAVIGATE', payload: '/workers' }
        ]
      };
    }

    if (q.includes('carpenter') || q.includes('furniture') || q.includes('wood') || q.includes('door') || q.includes('lock')) {
      return {
        text: `🔨 **Skilled Carpenters on Demand!**\n\nExpert carpenters from the Artisan Cooperative for custom woodwork, door repairs, furniture assembly, hinges, and polish.\n\n- **Rate:** ₹450 – ₹800 / visit\n- **Availability:** Jaipur, Delhi NCR, and major hubs.`,
        actions: [
          { label: '🔨 Book Carpenter', actionType: 'BOOK', payload: 'Carpenter' }
        ]
      };
    }

    if (q.includes('painter') || q.includes('paint') || q.includes('wall') || q.includes('whitewash')) {
      return {
        text: `🎨 **Verified Painting Specialists & Crews!**\n\nBook individual painters for touch-ups or a full cooperative crew for whole-house interior/exterior painting.\n\n- **Single Painter:** ₹400 – ₹750 / day\n- **Team Crew (4-8 Painters):** ₹2,000 – ₹4,000 / day`,
        actions: [
          { label: '🎨 Book Painter', actionType: 'BOOK', payload: 'Painter' },
          { label: '👥 Book Painting Crew', actionType: 'BOOK', payload: 'CREW' }
        ]
      };
    }

    if (q.includes('clean') || q.includes('cleaning') || q.includes('maid') || q.includes('domestic') || q.includes('housekeep')) {
      return {
        text: `✨ **Deep Cleaning & Domestic Helpers!**\n\nVerified domestic helpers and deep cleaning professionals for residential flats, offices, and move-in/move-out sanitization.\n\n- **Standard Visit Rate:** ₹500 – ₹900 / visit\n- **Full Crew Deep Clean:** ₹1,500 – ₹3,000 / day`,
        actions: [
          { label: '✨ Book Cleaning Pro', actionType: 'BOOK', payload: 'Cleaner' }
        ]
      };
    }

    // 3. Pricing and Rates
    if (q.includes('price') || q.includes('rate') || q.includes('cost') || q.includes('charge') || q.includes('fee') || q.includes('commission')) {
      return {
        text: `💰 **Transparent Cooperative Pricing (0% Middleman Commission)**\n\nUnlike private gig platforms that take 20-30% cuts, SahkariGig passes **100% of the service fee directly to the worker**.\n\n📋 **Standard Rates:**\n• **Electrician:** ₹400 – ₹700 / visit\n• **Plumber:** ₹400 – ₹700 / visit\n• **Carpenter:** ₹450 – ₹800 / visit\n• **Painter:** ₹400 – ₹750 / visit\n• **Cleaner:** ₹500 – ₹900 / visit\n• **AC Repair:** ₹500 – ₹850 / visit\n• **Crew / Team:** ₹500 / worker / day`,
        actions: [
          { label: '⚡ Book a Service', actionType: 'BOOK', payload: 'Electrician' },
          { label: '🤝 Why 0% Commission?', actionType: 'QUERY', payload: 'Why does SahkariGig charge 0% commission?' }
        ]
      };
    }

    // 4. Verification, Security & QR Code
    if (q.includes('verify') || q.includes('qr') || q.includes('safe') || q.includes('security') || q.includes('id') || q.includes('badge') || q.includes('trust')) {
      return {
        text: `🛡️ **Government-Verified & Cooperative Trust Guarantee**\n\nEvery worker on SahkariGig is rigorously verified:\n1. **Aadhaar & Police Background Verification**\n2. **Skill Assessment by Cooperative Federation**\n3. **Unique Worker ID & On-Site QR Badge**\n4. **Real-time GPS Tracking & SOS Support**\n\nWhen a worker arrives, scan their QR badge to confirm identity before allowing work.`,
        actions: [
          { label: '🛡️ Test QR Verification Tool', actionType: 'VERIFY', payload: 'WORKER-DEL-8901' },
          { label: '👷 Browse Verified Talent', actionType: 'NAVIGATE', payload: '/workers' }
        ]
      };
    }

    // 5. How Cooperative Works / Mission
    if (q.includes('how it work') || q.includes('cooperative') || q.includes('sahkari') || q.includes('about') || q.includes('model') || q.includes('why')) {
      return {
        text: `🤝 **About SahkariGig - The Cooperative Marketplace**\n\nSahkariGig is a democratic, worker-owned digital cooperative platform designed for India's informal labor workforce:\n\n• **Worker Owned:** Workers receive collective dividends and emergency social security.\n• **Zero Exploitation:** 0% commission deductions on jobs.\n• **Fair Standard Pricing:** Customers get honest, regulated cooperative rates.\n• **Customer Guarantee:** Guaranteed dispatch with verified skills.`,
        actions: [
          { label: '⚡ Book a Service', actionType: 'BOOK', payload: 'Electrician' },
          { label: '📖 Learn How It Works', actionType: 'NAVIGATE', payload: '/how-it-works' }
        ]
      };
    }

    // 6. How to book / Job Tracking
    if (q.includes('book') || q.includes('hire') || q.includes('order') || q.includes('schedule') || q.includes('appointment')) {
      return {
        text: `📅 **Booking is Quick & Seamless!**\n\n1. Select your service trade (Electrician, Plumber, Painter, etc.).\n2. Choose **Single Worker** for quick repairs or **Multiple Workers** for team projects.\n3. Pick your preferred date & time slot.\n4. Enter address and submit! Instant dispatch code generated.\n\nYou can track all requests inside your Customer Dashboard.`,
        actions: [
          { label: '⚡ Open Booking Window', actionType: 'BOOK', payload: 'Electrician' },
          { label: '📋 View My Bookings', actionType: 'NAVIGATE', payload: '/dashboard' }
        ]
      };
    }

    // 7. My Bookings / Dashboard / Tracking
    if (q.includes('my booking') || q.includes('status') || q.includes('track') || q.includes('dashboard') || q.includes('history')) {
      return {
        text: `📋 **Track Your Active & Past Bookings**\n\nYou can view all requested jobs, live status, chat directly with assigned workers, and view digital receipts in your Customer Dashboard.`,
        actions: [
          { label: '📋 Go to My Dashboard', actionType: 'NAVIGATE', payload: '/dashboard' }
        ]
      };
    }

    // 8. Payments
    if (q.includes('pay') || q.includes('payment') || q.includes('upi') || q.includes('cash') || q.includes('refund')) {
      return {
        text: `💳 **Secure Payment Options**\n\nSahkariGig supports:\n• **UPI (Google Pay, PhonePe, Paytm)**\n• **Credit / Debit Cards & NetBanking**\n• **Cash on Completion**\n\nPayments are only finalized once the worker completes the job and you approve the digital receipt!`,
        actions: [
          { label: '⚡ Book a Service', actionType: 'BOOK', payload: 'Electrician' }
        ]
      };
    }

    // 9. Location & Cities
    if (q.includes('city') || q.includes('location') || q.includes('jaipur') || q.includes('delhi') || q.includes('mumbai') || q.includes('area') || q.includes('where')) {
      return {
        text: `📍 **Service Availability & Coverage**\n\nSahkariGig is active across:\n• **Jaipur (Rajasthan)** - Full city coverage (Mansarovar, Vaishali, Malviya Nagar, Raja Park, etc.)\n• **Delhi NCR** - New Delhi, Gurugram, Noida, Faridabad\n• **Expanding across tier-1 & tier-2 state cooperative federations.**`,
        actions: [
          { label: '🔍 Find Workers in Jaipur', actionType: 'NAVIGATE', payload: '/workers' },
          { label: '⚡ Instant Book Service', actionType: 'BOOK', payload: 'Electrician' }
        ]
      };
    }

    // 10. Greetings & General
    if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('namaste') || q.includes('good morning') || q.includes('help')) {
      return {
        text: `Hello! 😊 I'm here to help you with anything on **SahkariGig**.\n\nYou can ask me about:\n• Booking an individual worker or crew\n• Checking standard hourly/visit rates\n• Verifying a worker's ID or QR badge\n• Finding top-rated electricians, plumbers, painters, or cleaners near you.`,
        actions: [
          { label: '⚡ Book a Service', actionType: 'BOOK', payload: 'Electrician' },
          { label: '👥 Book Crew (Multiple)', actionType: 'BOOK', payload: 'CREW' },
          { label: '💰 Check Price Rates', actionType: 'QUERY', payload: 'What are the standard rates?' }
        ]
      };
    }

    // Default Fallback with Smart Options
    return {
      text: `I understand! On **SahkariGig**, you can easily book verified cooperative professionals (Single or Multiple workers), check transparent rates, or verify worker credentials with QR codes.\n\nWould you like me to open the booking window or direct you to our verified directory?`,
      actions: [
        { label: '⚡ Book a Service', actionType: 'BOOK', payload: 'Electrician' },
        { label: '👥 Book Multiple Workers', actionType: 'BOOK', payload: 'CREW' },
        { label: '🔍 Browse All Workers', actionType: 'NAVIGATE', payload: '/workers' },
        { label: '🛡️ Verify Worker QR', actionType: 'VERIFY', payload: 'WORKER-DEL-8901' }
      ]
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput('');
    setIsTyping(true);

    // Realistic typing delay
    setTimeout(() => {
      const reply = generateBotReply(text);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: reply.actions
      };
      setMessages([...updated, botMessage]);
      setIsTyping(false);
    }, 600);
  };

  const handleActionClick = (action: { label: string; actionType: 'BOOK' | 'NAVIGATE' | 'VERIFY' | 'QUERY'; payload?: string }) => {
    if (action.actionType === 'QUERY' && action.payload) {
      handleSend(action.payload);
      return;
    }

    if (action.actionType === 'BOOK') {
      if (onOpenBooking) {
        if (action.payload === 'CREW') {
          onOpenBooking({ trade: 'Electrician' });
        } else {
          onOpenBooking({ trade: action.payload || 'Electrician' });
        }
      }
      setIsOpen(false);
      return;
    }

    if (action.actionType === 'NAVIGATE' && action.payload) {
      if (onNavigate) {
        onNavigate(action.payload);
      }
      setIsOpen(false);
      return;
    }

    if (action.actionType === 'VERIFY') {
      if (onVerifyWorker) {
        onVerifyWorker(action.payload || 'WORKER-DEL-8901');
      }
      setIsOpen(false);
      return;
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-fresh',
        sender: 'bot',
        text: `Chat reset! How can I help you today with SahkariGig services?`,
        timestamp: 'Just now',
        actions: [
          { label: '⚡ Book a Service', actionType: 'BOOK', payload: 'Electrician' },
          { label: '👥 Book Multiple Workers', actionType: 'BOOK', payload: 'CREW' },
          { label: '💰 Check Price Rates', actionType: 'QUERY', payload: 'What are your rates?' },
          { label: '🛡️ Verify Worker ID', actionType: 'VERIFY', payload: 'WORKER-DEL-8901' }
        ]
      }
    ]);
  };

  return (
    <>
      {/* Floating Chat Trigger Button with Glowing Tooltip */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center">
        {!isOpen && (
          <div className="hidden sm:flex items-center mr-3 px-3.5 py-2 bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold rounded-2xl shadow-xl border border-slate-700/80 animate-in fade-in slide-in-from-right-3 duration-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 mr-1.5 animate-pulse" />
            <span>Need help? Ask Sahkari AI</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ${
            isOpen ? 'rotate-90 scale-95' : 'scale-100'
          }`}
          aria-label="Toggle Sahkari AI Chat Support"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
        </button>
      </div>

      {/* Interactive AI Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300 font-sans max-h-[620px] h-[82vh]">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 px-5 py-4 flex items-center justify-between text-white border-b border-slate-800 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-sm font-outfit">Sahkari AI Assistant</h3>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Verified Cooperative Knowledge Engine</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button 
                onClick={handleClearChat}
                title="Reset Chat"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-slate-50 dark:bg-slate-900/90 px-4 py-2.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center">
              <Sparkles className="w-3 h-3 text-emerald-500 mr-1" /> Quick:
            </span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-1 rounded-full whitespace-nowrap transition-all shadow-2xs shrink-0 cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 bg-slate-100/60 dark:bg-slate-950/50 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className="flex items-start space-x-2 max-w-[90%]">
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-xs font-medium'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 rounded-tl-xs'
                  }`}>
                    {/* Render Text with basic markdown bullet/bold highlights */}
                    <div className="space-y-1 whitespace-pre-line">
                      {msg.text.split('\n').map((line, i) => {
                        // Simple parser for bold tags **text**
                        const parts = line.split(/(\*\*.*?\*\*)/g);
                        return (
                          <p key={i}>
                            {parts.map((part, j) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={j} className="font-extrabold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
                              }
                              return part;
                            })}
                          </p>
                        );
                      })}
                    </div>

                    {/* Action Shortcut Buttons */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                        {msg.actions.map((act, actIdx) => (
                          <button
                            key={actIdx}
                            onClick={() => handleActionClick(act)}
                            className="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 dark:hover:bg-emerald-600 dark:hover:text-white transition-all shadow-2xs cursor-pointer transform active:scale-95"
                          >
                            <span>{act.label}</span>
                            <ChevronRight className="w-3 h-3 ml-1 opacity-70" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Typing Animation */}
            {isTyping && (
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-xs">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Footer */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about SahkariGig or services..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-emerald-500/30 transition-all cursor-pointer transform active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
