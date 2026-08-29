import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, MapPin, QrCode, MessageSquare, CreditCard, Star, ShieldCheck, CheckCircle2, AlertCircle, Send, CheckCheck, Lock, Circle, Smile, Paperclip, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabase';
import { io } from 'socket.io-client';
import { encryptMessage, decryptMessage } from '../utils/crypto';
import { CONFIG } from '../config';

interface CustomerDashboardProps {
  currentUser?: { name: string; role: string; id: string; email: string } | null;
  onOpenChat: (booking: any) => void;
  onOpenPayment: (booking: any) => void;
  onOpenReview: (booking: any) => void;
  onVerifyQrCode: (workerId: string) => void;
  onNavigate: (path: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  onOpenChat,
  onOpenPayment,
  onOpenReview,
  onVerifyQrCode,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'history' | 'payments' | 'messages'>('overview');

  // Sample bookings with state transitions: REQUESTED -> ACCEPTED -> IN_PROGRESS -> COMPLETED -> RATED
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      let loadedBookings: any[] = [];
      try {
        const apiRes = await fetch('http://localhost:5001/api/bookings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
            'x-user-role': 'Customer'
          }
        }).catch(() => null);

        if (apiRes && apiRes.ok) {
          const json = await apiRes.json();
          if (json.success && Array.isArray(json.data?.bookings) && json.data.bookings.length > 0) {
            loadedBookings = json.data.bookings.map((b: any) => ({
              id: b.id,
              service: b.service,
              workerName: b.workerName,
              workerTrade: b.workerTrade,
              workerId: b.workerId,
              coopName: 'Delhi Labour Cooperative Federation',
              date: b.bookingDate,
              time: b.bookingTime,
              address: b.address,
              amount: b.amount,
              status: b.status,
              paymentStatus: b.paymentStatus
            }));
          }
        }

        if (loadedBookings.length === 0 && currentUser?.id) {
          const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('customer_id', currentUser.id)
            .order('created_at', { ascending: false });
          
          if (!error && data && data.length > 0) {
            loadedBookings = data.map(b => ({
              id: b.id,
              service: b.service,
              workerName: b.worker_name,
              workerTrade: b.worker_trade,
              workerId: b.worker_id,
              coopName: 'Delhi Labour Cooperative Federation',
              date: b.booking_date,
              time: b.booking_time,
              address: b.address,
              amount: b.amount,
              status: b.status,
              paymentStatus: b.payment_status
            }));
          }
        }
      } catch (err) {
        console.error("Booking fetch error:", err);
      }

      // Prepopulate mock data if empty
      if (loadedBookings.length === 0) {
        loadedBookings = [
          {
            id: 'BK-1001',
            service: 'Electrical Inspection',
            workerName: 'Rajesh Kumar',
            workerTrade: 'Electrician',
            workerId: 'WORKER-DEL-8901',
            coopName: 'Delhi Labour Cooperative Federation',
            date: '2026-08-30',
            time: '10:00 AM',
            address: 'Connaught Place, New Delhi',
            amount: '₹550',
            status: 'ACCEPTED',
            paymentStatus: 'PENDING'
          },
          {
            id: 'BK-1002',
            service: 'Plumbing Leak Repair',
            workerName: 'Amit Singh',
            workerTrade: 'Plumber',
            workerId: 'WORKER-DEL-3342',
            coopName: 'NCR Multi-State Cooperative Society',
            date: '2026-08-25',
            time: '02:30 PM',
            address: 'Dwarka Sector 12, New Delhi',
            amount: '₹420',
            status: 'COMPLETED',
            paymentStatus: 'PAID'
          },
          {
            id: 'BK-1003',
            service: 'Carpenter Woodwork Repair',
            workerName: 'Vikram Rathore',
            workerTrade: 'Carpenter',
            workerId: 'WORKER-DEL-4412',
            coopName: 'Delhi Labour Cooperative Federation',
            date: '2026-08-31',
            time: '11:00 AM',
            address: 'Saket, New Delhi',
            amount: '₹800',
            status: 'REQUESTED',
            paymentStatus: 'PENDING'
          }
        ];
      }

      setBookings(loadedBookings);
    };
    fetchBookings();
  }, [currentUser]);

  // Chat / Messaging states
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [typingStatus, setTypingStatus] = useState<{ isTyping: boolean; text: string; senderName: string } | null>(null);
  const [isPartnerOnline, setIsPartnerOnline] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLocalTyping, setIsLocalTyping] = useState(false);
  const channelRef = useRef<any>(null);
  const typingTimeoutRef = useRef<any>(null);
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, selectedChat, activeTab]);

  useEffect(() => {
    if (activeTab === 'messages' && selectedChat) {
      const storageKey = `chat_history_${selectedChat.id}`;
      let activeChannel: any = null;
      let activePresenceChannel: any = null;

      const initChat = async () => {
        try {
          // 1. Fetch or create a conversation matching the job (selectedChat.id)
          const myId = currentUser?.id || 'demo-customer';
          const partnerId = selectedChat.worker_id || 'demo-worker';

          // Query conversations
          let convoIdLocal = '';
          let useLegacyFallback = false;

          const { data: convos, error: convoErr } = await supabase
            .from('conversations')
            .select('*')
            .eq('job_id', selectedChat.id);

          if (convoErr) {
            console.warn("Conversations table not found, using legacy chat_messages fallback.");
            useLegacyFallback = true;
          } else if (convos && convos.length > 0) {
            convoIdLocal = convos[0].id;
          } else {
            // Create a conversation
            const { data: newConvo, error: createErr } = await supabase
              .from('conversations')
              .insert({
                job_id: selectedChat.id,
                customer_id: myId,
                worker_id: partnerId
              })
              .select();

            if (createErr) {
              console.warn("Create conversation failed (might not be migrated), using legacy fallback:", createErr);
              useLegacyFallback = true;
            } else if (newConvo && newConvo.length > 0) {
              convoIdLocal = newConvo[0].id;
            }
          }

          if (useLegacyFallback) {
            setConversationId('legacy');

            // Load history from legacy table
            const { data: dbHistory, error: historyErr } = await supabase
              .from('chat_messages')
              .select('*')
              .eq('booking_id', selectedChat.id)
              .order('created_at', { ascending: true });

            if (!historyErr && dbHistory) {
              const decrypted = await Promise.all(dbHistory.map(async (msg: any) => {
                const text = await decryptMessage(msg.text, selectedChat.id);
                return {
                  id: msg.id,
                  bookingId: selectedChat.id,
                  senderType: msg.sender_type,
                  senderId: msg.sender_id,
                  senderName: msg.sender_name,
                  text,
                  createdAt: msg.created_at,
                  readAt: null
                };
              }));
              setChatMessages(decrypted);
            }

            // Realtime setup for legacy table
            const channel = supabase
              .channel(`chat_room_dash_${selectedChat.id}`)
              .on(
                'postgres_changes',
                {
                  event: 'INSERT',
                  schema: 'public',
                  table: 'chat_messages',
                  filter: `booking_id=eq.${selectedChat.id}`
                },
                async (payload) => {
                  const newMsg = payload.new;
                  setChatMessages((current) => {
                    if (current.some(m => m.id === newMsg.id)) return current;

                    (async () => {
                      const text = await decryptMessage(newMsg.text, selectedChat.id);
                      const decryptedMsg = {
                        id: newMsg.id,
                        bookingId: selectedChat.id,
                        senderType: newMsg.sender_type,
                        senderId: newMsg.sender_id,
                        senderName: newMsg.sender_name,
                        text,
                        createdAt: newMsg.created_at,
                        readAt: null
                      };

                      setChatMessages(c => {
                        if (c.some(m => m.id === newMsg.id)) return c;
                        return [...c, decryptedMsg];
                      });
                    })();

                    return current;
                  });
                }
              )
              .on('broadcast', { event: 'typing' }, (payload: any) => {
                const { senderName, text, isTyping } = payload.payload;
                setTypingStatus(isTyping ? { senderName, text, isTyping } : null);
              })
              .on('broadcast', { event: 'header_typing' }, (payload: any) => {
                const { isTyping } = payload.payload;
                setIsPartnerTyping(isTyping);
              })
              .subscribe();

            activeChannel = channel;
            channelRef.current = channel;

            // Presence fallback using booking.id as key
            const presenceChannel = supabase.channel(`presence_dash_${selectedChat.id}`, {
              config: {
                presence: { key: myId }
              }
            });

            presenceChannel
              .on('presence', { event: 'sync' }, () => {
                const state = presenceChannel.presenceState();
                const keys = Object.keys(state);
                const isOnline = keys.some(key => key !== myId);
                setIsPartnerOnline(isOnline);
              })
              .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                  await presenceChannel.track({
                    role: 'Customer',
                    name: currentUser?.name || 'Customer',
                    online_at: new Date().toISOString()
                  });
                  
                  // Gracefully upsert DB presence (if table exists)
                  await supabase
                    .from('user_presence')
                    .upsert({
                      user_id: myId,
                      status: 'online',
                      updated_at: new Date().toISOString()
                    }).select().then(() => {}, () => {});
                }
              });

            activePresenceChannel = presenceChannel;
          } else if (convoIdLocal) {
            setConversationId(convoIdLocal);

            // 2. Fetch history from messages table
            const { data: dbHistory, error: historyErr } = await supabase
              .from('messages')
              .select('*')
              .eq('conversation_id', convoIdLocal)
              .order('created_at', { ascending: true });

            if (!historyErr && dbHistory) {
              const decrypted = await Promise.all(dbHistory.map(async (msg: any) => {
                const text = await decryptMessage(msg.message, selectedChat.id);
                return {
                  id: msg.id,
                  bookingId: selectedChat.id,
                  senderType: msg.sender_id === myId ? 'Customer' : 'Worker',
                  senderId: msg.sender_id,
                  senderName: msg.sender_id === myId ? (currentUser?.name || 'Customer') : (selectedChat.workerName || 'Worker'),
                  text,
                  createdAt: msg.created_at,
                  readAt: msg.read_at
                };
              }));
              setChatMessages(decrypted);

              // 3. Mark unread received messages as read
              const unreadIds = dbHistory
                .filter(m => m.sender_id !== myId && !m.read_at)
                .map(m => m.id);

              if (unreadIds.length > 0) {
                await supabase
                  .from('messages')
                  .update({ read_at: new Date().toISOString() })
                  .in('id', unreadIds);
              }
            }

            // 4. Set up Supabase Realtime channel for messages and typing
            const channel = supabase
              .channel(`convo_room_dash_${convoIdLocal}`)
              .on(
                'postgres_changes',
                {
                  event: 'INSERT',
                  schema: 'public',
                  table: 'messages',
                  filter: `conversation_id=eq.${convoIdLocal}`
                },
                async (payload) => {
                  const newMsg = payload.new;
                  setChatMessages((current) => {
                    if (current.some(m => m.id === newMsg.id)) return current;

                    (async () => {
                      const text = await decryptMessage(newMsg.message, selectedChat.id);
                      const decryptedMsg = {
                        id: newMsg.id,
                        bookingId: selectedChat.id,
                        senderType: newMsg.sender_id === myId ? 'Customer' : 'Worker',
                        senderId: newMsg.sender_id,
                        senderName: newMsg.sender_id === myId ? (currentUser?.name || 'Customer') : (selectedChat.workerName || 'Worker'),
                        text,
                        createdAt: newMsg.created_at,
                        readAt: newMsg.read_at
                      };

                      setChatMessages(c => {
                        if (c.some(m => m.id === newMsg.id)) return c;
                        return [...c, decryptedMsg];
                      });

                      // Mark as read immediately if we are active
                      if (newMsg.sender_id !== myId && !newMsg.read_at) {
                        await supabase
                          .from('messages')
                          .update({ read_at: new Date().toISOString() })
                          .eq('id', newMsg.id);
                      }
                    })();

                    return current;
                  });
                }
              )
              .on(
                'postgres_changes',
                {
                  event: 'UPDATE',
                  schema: 'public',
                  table: 'messages',
                  filter: `conversation_id=eq.${convoIdLocal}`
                },
                (payload) => {
                  const updatedMsg = payload.new;
                  setChatMessages((prev) =>
                    prev.map((m) => (m.id === updatedMsg.id ? { ...m, readAt: updatedMsg.read_at } : m))
                  );
                }
              )
              .on('broadcast', { event: 'typing' }, (payload: any) => {
                const { senderName, text, isTyping } = payload.payload;
                setTypingStatus(isTyping ? { senderName, text, isTyping } : null);
              })
              .on('broadcast', { event: 'header_typing' }, (payload: any) => {
                const { isTyping } = payload.payload;
                setIsPartnerTyping(isTyping);
              })
              .subscribe();

            activeChannel = channel;
            channelRef.current = channel;

            // 5. Presence Tracking Channel
            const presenceChannel = supabase.channel(`presence_dash_${convoIdLocal}`, {
              config: {
                presence: { key: myId }
              }
            });

            presenceChannel
              .on('presence', { event: 'sync' }, () => {
                const state = presenceChannel.presenceState();
                const keys = Object.keys(state);
                const isOnline = keys.some(key => key !== myId);
                setIsPartnerOnline(isOnline);
              })
              .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                  await presenceChannel.track({
                    role: 'Customer',
                    name: currentUser?.name || 'Customer',
                    online_at: new Date().toISOString()
                  });
                  // Update DB presence to online
                  await supabase
                    .from('user_presence')
                    .upsert({
                      user_id: myId,
                      status: 'online',
                      updated_at: new Date().toISOString()
                    }).select().then(() => {}, () => {});
                }
              });

            activePresenceChannel = presenceChannel;
          }
        } catch (err) {
          console.error("Initialization error in CustomerDashboard Chat:", err);
        }
      };

      initChat();

      return () => {
        if (activeChannel) {
          supabase.removeChannel(activeChannel);
        }
        if (activePresenceChannel) {
          // Update DB presence to offline on leave
          const myId = currentUser?.id || 'demo-customer';
          supabase
            .from('user_presence')
            .upsert({
              user_id: myId,
              status: 'offline',
              last_seen: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }).then(() => {});

          supabase.removeChannel(activePresenceChannel);
        }
        channelRef.current = null;
      };
    }
  }, [activeTab, selectedChat]);

  const handleSendDashboardMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || !selectedChat || !conversationId) return;

    const myId = currentUser?.id || 'demo-customer';
    const partnerId = selectedChat.worker_id || 'demo-worker';
    
    const textToSend = chatInput.trim();
    const tempId = `msg-opt-${Date.now()}`;

    // 1. Optimistic UI update
    const optimisticMsg = {
      id: tempId,
      bookingId: selectedChat.id,
      senderType: 'Customer',
      senderId: myId,
      senderName: currentUser?.name || 'Customer',
      text: textToSend,
      createdAt: new Date().toISOString(),
      status: 'sending'
    };

    setChatMessages((prev) => [...prev, optimisticMsg]);
    setChatInput('');

    // Encrypt
    const encryptedText = await encryptMessage(textToSend, selectedChat.id);

    // 2. Direct insert to Supabase DB (conditional on legacy fallback)
    if (conversationId === 'legacy') {
      const { data: insertData, error: insertError } = await supabase
        .from('chat_messages')
        .insert({
          booking_id: selectedChat.id,
          sender_id: myId,
          sender_type: currentUser?.role || 'Customer',
          sender_name: currentUser?.name || 'Customer',
          text: encryptedText
        })
        .select();

      if (insertError) {
        console.error("Failed to insert message:", insertError);
        setChatMessages((prev) => prev.map(m => m.id === tempId ? { ...m, status: 'failed' } : m));
      } else if (insertData && insertData[0]) {
        const realMsg = insertData[0];
        setChatMessages((prev) => prev.map(m => m.id === tempId ? { 
          ...m, 
          id: realMsg.id, 
          status: 'sent', 
          createdAt: realMsg.created_at,
          readAt: null 
        } : m));
      }
    } else {
      const { data: insertData, error: insertError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: myId,
          receiver_id: partnerId,
          message: encryptedText,
          message_type: 'text'
        })
        .select();

      if (insertError) {
        console.error("Failed to insert message:", insertError);
        setChatMessages((prev) => prev.map(m => m.id === tempId ? { ...m, status: 'failed' } : m));
      } else if (insertData && insertData[0]) {
        const realMsg = insertData[0];
        setChatMessages((prev) => prev.map(m => m.id === tempId ? { 
          ...m, 
          id: realMsg.id, 
          status: 'sent', 
          createdAt: realMsg.created_at,
          readAt: realMsg.read_at 
        } : m));
      }
    }

    // 3. Emit via Socket.io if connected (backup)
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('sendMessage', {
        id: tempId,
        bookingId: selectedChat.id,
        senderId: myId,
        senderType: 'Customer',
        senderName: currentUser?.name || 'Customer',
        text: encryptedText
      });
    }

    // 4. Clear typing status broadcasts
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: {
          senderName: currentUser?.name || 'Customer',
          text: '',
          isTyping: false
        }
      });
      channelRef.current.send({
        type: 'broadcast',
        event: 'header_typing',
        payload: { isTyping: false }
      });
    }
  };

  const handleRetryDashboardMessage = async (msg: any) => {
    // Remove the failed message from state
    setChatMessages(prev => prev.filter(m => m.id !== msg.id));
    
    // Retry sending
    const myId = currentUser?.id || 'demo-customer';
    const partnerId = selectedChat.worker_id || 'demo-worker';
    
    const tempId = `msg-opt-${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      bookingId: selectedChat.id,
      senderType: 'Customer',
      senderId: myId,
      senderName: currentUser?.name || 'Customer',
      text: msg.text,
      createdAt: new Date().toISOString(),
      status: 'sending'
    };

    setChatMessages((prev) => [...prev, optimisticMsg]);
    const encryptedText = await encryptMessage(msg.text, selectedChat.id);

    if (conversationId === 'legacy') {
      const { data: insertData, error: insertError } = await supabase
        .from('chat_messages')
        .insert({
          booking_id: selectedChat.id,
          sender_id: myId,
          sender_type: currentUser?.role || 'Customer',
          sender_name: currentUser?.name || 'Customer',
          text: encryptedText
        })
        .select();

      if (insertError) {
        setChatMessages((prev) => prev.map(m => m.id === tempId ? { ...m, status: 'failed' } : m));
      } else if (insertData && insertData[0]) {
        const realMsg = insertData[0];
        setChatMessages((prev) => prev.map(m => m.id === tempId ? { 
          ...m, 
          id: realMsg.id, 
          status: 'sent', 
          createdAt: realMsg.created_at,
          readAt: null 
        } : m));
      }
    } else {
      const { data: insertData, error: insertError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: myId,
          receiver_id: partnerId,
          message: encryptedText,
          message_type: 'text'
        })
        .select();

      if (insertError) {
        setChatMessages((prev) => prev.map(m => m.id === tempId ? { ...m, status: 'failed' } : m));
      } else if (insertData && insertData[0]) {
        const realMsg = insertData[0];
        setChatMessages((prev) => prev.map(m => m.id === tempId ? { 
          ...m, 
          id: realMsg.id, 
          status: 'sent', 
          createdAt: realMsg.created_at,
          readAt: realMsg.read_at 
        } : m));
      }
    }
  };

  const handleDashboardTypingChange = (text: string) => {
    setChatInput(text);
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: {
          senderName: currentUser?.name || 'Customer',
          text: text,
          isTyping: text.trim().length > 0
        }
      });
    }

    // Debounced header typing status update (WhatsApp style)
    if (!isLocalTyping && text.trim().length > 0) {
      setIsLocalTyping(true);
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'header_typing',
          payload: { isTyping: true }
        });
      }
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsLocalTyping(false);
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'header_typing',
          payload: { isTyping: false }
        });
      }
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REQUESTED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">REQUESTED</span>;
      case 'ACCEPTED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">ACCEPTED</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">IN PROGRESS</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">COMPLETED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const firstName = currentUser?.name?.split(' ')[0] || 'Customer';

  return (
    <div className="py-8 bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">
              Good morning, {firstName} 👋
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
              Verified Customer
            </span>
          </div>
        </div>

        {/* Global Tabs */}
        <div className="flex items-center space-x-6 border-b border-slate-200 mt-6 pb-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 text-sm font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 border-b-2 text-sm font-semibold transition-colors ${
              activeTab === 'bookings'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            My Bookings
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 border-b-2 text-sm font-semibold transition-colors ${
              activeTab === 'history'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-3 border-b-2 text-sm font-semibold transition-colors ${
              activeTab === 'messages'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Messages
          </button>
        </div>

        {/* Task-Centric Layout (Only shown on Overview) */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Task Area */}
            <div className="lg:col-span-2 space-y-8">
            
            {/* Upcoming Service Highlight */}
            <div>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Upcoming service</h2>
              {bookings.filter(b => b.status === 'ACCEPTED' || b.status === 'REQUESTED' || b.status === 'IN_PROGRESS').length > 0 ? (
                <div className="bg-white rounded-2xl border border-emerald-200 shadow-md p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 pointer-events-none" />
                  
                  {bookings.filter(b => b.status === 'ACCEPTED' || b.status === 'REQUESTED' || b.status === 'IN_PROGRESS').slice(0, 1).map(upcoming => (
                    <div key={upcoming.id} className="relative z-10">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                            ⚡
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 font-outfit">{upcoming.service}</h3>
                            <p className="text-sm font-medium text-slate-600 mt-0.5">{upcoming.workerName}</p>
                          </div>
                        </div>
                        {getStatusBadge(upcoming.status)}
                      </div>
                      
                      <div className="mt-6 flex items-center space-x-6 text-sm text-slate-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                          <span className="font-semibold">{upcoming.date} · {upcoming.time}</span>
                        </div>
                      </div>

                      <div className="mt-6 pt-5 border-t border-slate-100 flex gap-3">
                        <button
                          onClick={() => onVerifyQrCode(upcoming.workerId)}
                          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
                        >
                          Verify Worker ID
                        </button>
                        <button
                          onClick={() => onOpenChat(upcoming)}
                          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
                        >
                          Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center py-10">
                  <p className="text-slate-500 font-medium">No upcoming services scheduled.</p>
                  <button 
                    onClick={() => onNavigate('/services')}
                    className="mt-4 px-6 py-2 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-xl hover:bg-emerald-100 transition-colors"
                  >
                    Book a Service
                  </button>
                </div>
              )}
            </div>

            {/* Recent Services List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Recent services</h2>
                <button 
                  onClick={() => setActiveTab('history')}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  View All
                </button>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {bookings.filter(b => b.status === 'COMPLETED').slice(0, 3).map(booking => (
                    <div key={booking.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div>
                        <p className="font-bold text-slate-900 text-sm font-outfit">{booking.service}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{booking.date} · {booking.workerName}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-bold text-slate-900">{booking.amount}</span>
                        {booking.paymentStatus === 'PENDING' ? (
                          <button
                            onClick={() => onOpenPayment(booking)}
                            className="px-3 py-1.5 bg-amber-100 text-amber-800 hover:bg-amber-200 font-bold text-xs rounded-lg transition-colors"
                          >
                            Pay Now
                          </button>
                        ) : (
                          <button
                            onClick={() => onOpenReview(booking)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center"
                          >
                            <Star className="w-3 h-3 mr-1" /> Review
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {bookings.filter(b => b.status === 'COMPLETED').length === 0 && (
                    <div className="p-6 text-center text-sm text-slate-500">
                      No completed services yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
            
          </div>

          {/* Sidebar / Quick Actions */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Quick actions</h2>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 space-y-1">
              <button 
                onClick={() => onNavigate('/services')}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group"
              >
                <div className="flex items-center space-x-3 text-slate-700 group-hover:text-emerald-700 font-medium text-sm">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span>Book a Service</span>
                </div>
              </button>
              
              <button 
                onClick={() => setActiveTab('bookings')}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group"
              >
                <div className="flex items-center space-x-3 text-slate-700 group-hover:text-emerald-700 font-medium text-sm">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span>My Bookings</span>
                </div>
              </button>
              
              <button 
                onClick={() => {
                  setSelectedChat(bookings[0] || null);
                  setActiveTab('messages');
                }}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group"
              >
                <div className="flex items-center space-x-3 text-slate-700 group-hover:text-emerald-700 font-medium text-sm">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span>Messages</span>
                </div>
              </button>
              
              <button 
                onClick={() => onVerifyQrCode('WORKER-DEL-8901')}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group"
              >
                <div className="flex items-center space-x-3 text-slate-700 group-hover:text-emerald-700 font-medium text-sm">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <span>Verify Worker ID</span>
                </div>
              </button>
            </div>
            </div>
          </div>
        )}

        {/* Tab-based Full Lists */}
        {activeTab !== 'overview' && activeTab !== 'messages' && (
          <div className="light-card p-6">
            
            {/* Bookings List */}
            <div className="space-y-4">
              {bookings.filter(b => activeTab === 'history' ? b.status === 'COMPLETED' : b.status !== 'COMPLETED').map((booking) => (
                <div key={booking.id} className="p-5 rounded-xl border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-xs transition-shadow">
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-bold text-slate-900 text-base font-outfit">{booking.service}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    
                    <p className="text-xs text-slate-600">
                      Assigned: <span className="font-semibold text-slate-900">{booking.workerName}</span> ({booking.coopName})
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {booking.date}, {booking.time}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {booking.address}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onVerifyQrCode(booking.workerId)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verify QR</span>
                    </button>

                    <button
                      onClick={() => onOpenChat(booking)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                      <span>Chat</span>
                    </button>

                    {booking.status === 'COMPLETED' ? (
                      <button
                        onClick={() => onOpenReview(booking)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-lg transition-colors flex items-center space-x-1"
                      >
                        <Star className="w-3.5 h-3.5 fill-white" />
                        <span>Review</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenPayment(booking)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors flex items-center space-x-1"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay ({booking.amount})</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {bookings.filter(b => activeTab === 'history' ? b.status === 'COMPLETED' : b.status !== 'COMPLETED').length === 0 && (
                <div className="text-center py-10 text-slate-500 font-medium">
                  No bookings found for this category.
                </div>
              )}
            </div>

          </div>
        )}

        {/* Embedded Messaging Tab */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl flex flex-col md:flex-row h-[600px] max-h-[85vh]">
            
            {/* Left Column: Chat Room List */}
            <div className={`w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50 ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
              <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 font-outfit text-base">Conversations</h3>
                <button
                  onClick={() => setActiveTab('overview')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900"
                >
                  &larr; Back
                </button>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {bookings.map((booking) => {
                  const isSelected = selectedChat?.id === booking.id;
                  return (
                    <div
                      key={booking.id}
                      onClick={() => setSelectedChat(booking)}
                      className={`p-4 cursor-pointer hover:bg-slate-100 transition-colors flex items-center justify-between ${
                        isSelected ? 'bg-emerald-50 border-l-4 border-emerald-600' : 'bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-slate-900 font-outfit">{booking.service}</span>
                          <span className="text-[9px] font-mono text-slate-400 font-semibold">#{booking.id}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">Worker: {booking.workerName}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded uppercase">
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {bookings.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No active service bookings found to chat.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Active Conversation */}
            <div className={`flex-1 flex flex-col bg-[#f0f2f5] relative ${selectedChat ? 'flex' : 'hidden md:flex'}`}>
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between shadow-md">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setSelectedChat(null)}
                        className="md:hidden p-1 text-slate-400 hover:text-white rounded-lg transition-colors mr-1"
                        title="Back to conversations"
                      >
                        <ArrowLeft className="w-4.5 h-4.5" />
                      </button>
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-extrabold text-sm uppercase">
                        {selectedChat.workerName.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-white leading-tight font-outfit">
                          {selectedChat.workerName}
                        </h4>
                        <div className="flex items-center space-x-1.5 text-[9px] text-slate-300 font-medium">
                          {isPartnerTyping ? (
                            <span className="text-emerald-400 font-bold animate-pulse">typing...</span>
                          ) : (
                            <>
                              <Circle className={`w-1.5 h-1.5 fill-current ${isPartnerOnline ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                              <span>{isPartnerOnline ? 'Online' : 'Offline'} · {selectedChat.coopName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-emerald-300 font-bold text-[10px] font-mono border border-emerald-800/80 bg-emerald-950/60 px-2.5 py-1 rounded-lg">
                      <Lock className="w-3.5 h-3.5 mr-1" />
                      <span>E2E Encrypted</span>
                    </div>
                  </div>

                  {/* Booking contextual status banner */}
                  <div className="bg-emerald-950/80 border-b border-emerald-900/60 px-4 py-2 text-[10px] text-emerald-200 flex justify-between font-medium">
                    <span>Active Booking: <strong className="text-white">{selectedChat.service}</strong></span>
                    <span>Rate: <strong className="text-white">{selectedChat.amount}</strong></span>
                  </div>

                  {/* Chat Message list body */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 relative">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-slate-400 py-12 text-xs font-medium bg-white/60 p-6 rounded-2xl border border-slate-200/50 max-w-xs mx-auto mt-10">
                        <ShieldCheck className="w-7 h-7 text-emerald-600 mx-auto mb-2 opacity-80" />
                        <span>This is a secure private chat room with {selectedChat.workerName}. Type a message below to coordinate.</span>
                      </div>
                    ) : (
                      chatMessages.map((msg) => {
                        const isMe = msg.senderType === 'Customer';
                        const timeString = msg.createdAt 
                          ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                          >
                            <div
                              className={`max-w-[80%] px-3 py-2 rounded-2xl shadow-xs leading-relaxed text-xs relative ${
                                isMe
                                  ? 'bg-emerald-600 text-white rounded-tr-xs'
                                  : 'bg-white text-slate-900 border border-slate-200/80 rounded-tl-xs'
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                              <div className={`flex items-center justify-end space-x-1.5 mt-1 text-[8px] ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}>
                                <span>{timeString}</span>
                                {isMe && (
                                  <>
                                    {msg.status === 'sending' && (
                                      <Clock className="w-3 h-3 text-emerald-200 animate-spin" />
                                    )}
                                    {msg.status === 'failed' && (
                                      <button 
                                        type="button" 
                                        onClick={() => handleRetryDashboardMessage(msg)}
                                        className="focus:outline-none"
                                        title="Failed to send. Click to retry."
                                      >
                                        <AlertCircle className="w-3.5 h-3.5 text-red-300 fill-red-850" />
                                      </button>
                                    )}
                                    {(msg.status === 'sent' || !msg.status) && (
                                      <CheckCheck className={`w-3.5 h-3.5 ${msg.readAt ? 'text-sky-300 font-bold' : 'text-emerald-200'}`} />
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    {typingStatus && typingStatus.isTyping && (
                      <div className="flex items-start animate-fade-in">
                        <div className="bg-white border border-slate-200/80 text-slate-600 text-xs px-3.5 py-2.5 rounded-2xl rounded-tl-xs shadow-xs flex items-center space-x-2">
                          <Circle className="w-1.5 h-1.5 fill-emerald-500 text-emerald-500 animate-pulse" />
                          <span className="font-medium text-slate-500">
                            <strong className="text-slate-700">{typingStatus.senderName}</strong> is typing
                            {typingStatus.text ? (
                              <span>: <span className="italic text-emerald-600 font-semibold">"{typingStatus.text}"</span></span>
                            ) : (
                              "..."
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Chat input composer */}
                  <form
                    onSubmit={handleSendDashboardMessage}
                    className="p-2.5 bg-slate-100 border-t border-slate-200 flex items-center space-x-2"
                  >
                    <textarea
                      rows={1}
                      value={chatInput}
                      onChange={(e) => handleDashboardTypingChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendDashboardMessage();
                        }
                      }}
                      placeholder="Type secure message... (Enter to send)"
                      className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-sans"
                    />

                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="w-9 h-9 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-full shadow-sm transition-colors flex items-center justify-center shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-white/70">
                  <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
                  <h4 className="font-bold text-slate-700 font-outfit">Your Inbox</h4>
                  <p className="text-xs text-slate-500 max-w-xs mt-1">
                    Select a service conversation from the left panel to coordinate with your cooperative technician in real-time.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
