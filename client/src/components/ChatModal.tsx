import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ShieldCheck, Paperclip, Smile, MoreVertical, CheckCheck, ArrowLeft, ExternalLink, Circle, Clock, AlertCircle } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { CONFIG } from '../config';
import { encryptMessage, decryptMessage } from '../utils/crypto';
import { supabase } from '../supabase';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: any;
  currentUser?: { name: string; role: string; email?: string } | null;
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, booking, currentUser }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingStatus, setTypingStatus] = useState<{ isTyping: boolean; text: string; senderName: string } | null>(null);
  const [isPartnerOnline, setIsPartnerOnline] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLocalTyping, setIsLocalTyping] = useState(false);
  const channelRef = useRef<any>(null);
  const typingTimeoutRef = useRef<any>(null);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && booking) {
      const storageKey = `chat_history_${booking.id}`;
      let activeChannel: any = null;
      let activePresenceChannel: any = null;

      const initChat = async () => {
        try {
          // 1. Fetch or create a conversation matching the job (booking.id)
          const myId = currentUser?.id || 'demo-customer';
          const partnerId = currentUser?.role === 'Worker' 
            ? (booking.customer_id || 'demo-customer')
            : (booking.worker_id || 'demo-worker');

          // Query conversations
          let convoIdLocal = '';
          let useLegacyFallback = false;

          const { data: convos, error: convoErr } = await supabase
            .from('conversations')
            .select('*')
            .eq('job_id', booking.id);

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
                job_id: booking.id,
                customer_id: currentUser?.role === 'Worker' ? partnerId : myId,
                worker_id: currentUser?.role === 'Worker' ? myId : partnerId
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
              .eq('booking_id', booking.id)
              .order('created_at', { ascending: true });

            if (!historyErr && dbHistory) {
              const decrypted = await Promise.all(dbHistory.map(async (msg: any) => {
                const text = await decryptMessage(msg.text, booking.id);
                return {
                  id: msg.id,
                  bookingId: booking.id,
                  senderType: msg.sender_type,
                  senderId: msg.sender_id,
                  senderName: msg.sender_name,
                  text,
                  createdAt: msg.created_at,
                  readAt: null
                };
              }));
              setMessages(decrypted);
            }

            // Realtime setup for legacy table
            const channel = supabase
              .channel(`chat_room_${booking.id}`)
              .on(
                'postgres_changes',
                {
                  event: 'INSERT',
                  schema: 'public',
                  table: 'chat_messages',
                  filter: `booking_id=eq.${booking.id}`
                },
                async (payload) => {
                  const newMsg = payload.new;
                  setMessages((current) => {
                    if (current.some(m => m.id === newMsg.id)) return current;

                    (async () => {
                      const text = await decryptMessage(newMsg.text, booking.id);
                      const decryptedMsg = {
                        id: newMsg.id,
                        bookingId: booking.id,
                        senderType: newMsg.sender_type,
                        senderId: newMsg.sender_id,
                        senderName: newMsg.sender_name,
                        text,
                        createdAt: newMsg.created_at,
                        readAt: null
                      };

                      setMessages(c => {
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
              .on('broadcast', { event: 'new_message' }, (payload: any) => {
                const newMsg = payload.payload;
                setMessages((current) => {
                  if (current.some(m => m.id === newMsg.id)) return current;

                  (async () => {
                    const text = await decryptMessage(newMsg.text, booking.id);
                    const decryptedMsg = {
                      id: newMsg.id,
                      bookingId: booking.id,
                      senderType: newMsg.sender_type,
                      senderId: newMsg.sender_id,
                      senderName: newMsg.sender_name,
                      text,
                      createdAt: newMsg.created_at,
                      readAt: newMsg.read_at
                    };

                    setMessages(c => {
                      if (c.some(m => m.id === newMsg.id)) return c;
                      return [...c, decryptedMsg];
                    });
                  })();

                  return current;
                });
              })
              .subscribe();

            activeChannel = channel;
            channelRef.current = channel;

            // Presence fallback using booking.id as key
            const presenceChannel = supabase.channel(`presence_${booking.id}`, {
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
                    role: currentUser?.role || 'Customer',
                    name: currentUser?.name || 'User',
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
                const text = await decryptMessage(msg.message, booking.id);
                return {
                  id: msg.id,
                  bookingId: booking.id,
                  senderType: msg.sender_id === myId ? (currentUser?.role || 'Customer') : (currentUser?.role === 'Worker' ? 'Customer' : 'Worker'),
                  senderId: msg.sender_id,
                  senderName: msg.sender_id === myId ? (currentUser?.name || 'User') : (currentUser?.role === 'Worker' ? (booking.customerName || 'Customer') : (booking.workerName || 'Worker')),
                  text,
                  createdAt: msg.created_at,
                  readAt: msg.read_at
                };
              }));
              setMessages(decrypted);

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
              .channel(`convo_room_${convoIdLocal}`)
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
                  setMessages((current) => {
                    if (current.some(m => m.id === newMsg.id)) return current;

                    (async () => {
                      const text = await decryptMessage(newMsg.message, booking.id);
                      const decryptedMsg = {
                        id: newMsg.id,
                        bookingId: booking.id,
                        senderType: newMsg.sender_id === myId ? (currentUser?.role || 'Customer') : (currentUser?.role === 'Worker' ? 'Customer' : 'Worker'),
                        senderId: newMsg.sender_id,
                        senderName: newMsg.sender_id === myId ? (currentUser?.name || 'User') : (currentUser?.role === 'Worker' ? (booking.customerName || 'Customer') : (booking.workerName || 'Worker')),
                        text,
                        createdAt: newMsg.created_at,
                        readAt: newMsg.read_at
                      };

                      setMessages(c => {
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
                  setMessages((prev) =>
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
              .on('broadcast', { event: 'new_message' }, (payload: any) => {
                const newMsg = payload.payload;
                setMessages((current) => {
                  if (current.some(m => m.id === newMsg.id)) return current;

                  (async () => {
                    const text = await decryptMessage(newMsg.text, booking.id);
                    const decryptedMsg = {
                      id: newMsg.id,
                      bookingId: booking.id,
                      senderType: newMsg.sender_type,
                      senderId: newMsg.sender_id,
                      senderName: newMsg.sender_name,
                      text,
                      createdAt: newMsg.created_at,
                      readAt: newMsg.read_at
                    };

                    setMessages(c => {
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
              })
              .subscribe();

            activeChannel = channel;
            channelRef.current = channel;

            // 5. Presence Tracking Channel
            const presenceChannel = supabase.channel(`presence_${convoIdLocal}`, {
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
                    role: currentUser?.role || 'Customer',
                    name: currentUser?.name || 'User',
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
          console.error("Initialization error in ChatModal:", err);
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
  }, [isOpen, booking]);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !booking || !conversationId) return;

    const myId = currentUser?.id || 'demo-customer';
    const receiverId = currentUser?.role === 'Worker' 
      ? (booking.customer_id || 'demo-customer')
      : (booking.worker_id || 'demo-worker');
    
    const textToSend = inputText.trim();
    const tempId = `msg-opt-${Date.now()}`;

    // 1. Optimistic UI update (append immediately to chat state)
    const optimisticMsg = {
      id: tempId,
      bookingId: booking.id,
      senderType: currentUser?.role || 'Customer',
      senderId: myId,
      senderName: currentUser?.name || 'User',
      text: textToSend,
      createdAt: new Date().toISOString(),
      status: 'sending'
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInputText('');

    // Encrypt the message text
    const encryptedText = await encryptMessage(textToSend, booking.id);

    // 2. Direct insert to Supabase database (conditional on legacy fallback)
    if (conversationId === 'legacy') {
      const { data: insertData, error: insertError } = await supabase
        .from('chat_messages')
        .insert({
          booking_id: booking.id,
          sender_id: myId,
          sender_type: currentUser?.role || 'Customer',
          sender_name: currentUser?.name || 'User',
          text: encryptedText
        })
        .select();

      if (insertError) {
        console.error("Failed to insert message:", insertError);
        setMessages((prev) => prev.map(m => m.id === tempId ? { ...m, status: 'failed' } : m));
      } else if (insertData && insertData[0]) {
        const realMsg = insertData[0];
        setMessages((prev) => prev.map(m => m.id === tempId ? { 
          ...m, 
          id: realMsg.id, 
          status: 'sent', 
          createdAt: realMsg.created_at,
          readAt: null 
        } : m));
        
        if (channelRef.current) {
          channelRef.current.send({
            type: 'broadcast',
            event: 'new_message',
            payload: {
              id: realMsg.id,
              sender_id: myId,
              sender_type: currentUser?.role || 'Customer',
              sender_name: currentUser?.name || 'User',
              text: encryptedText,
              created_at: realMsg.created_at,
              read_at: null
            }
          });
        }
      }
    } else {
      const { data: insertData, error: insertError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: myId,
          receiver_id: receiverId,
          message: encryptedText,
          message_type: 'text'
        })
        .select();

      if (insertError) {
        console.error("Failed to insert message:", insertError);
        setMessages((prev) => prev.map(m => m.id === tempId ? { ...m, status: 'failed' } : m));
      } else if (insertData && insertData[0]) {
        const realMsg = insertData[0];
        setMessages((prev) => prev.map(m => m.id === tempId ? { 
          ...m, 
          id: realMsg.id, 
          status: 'sent', 
          createdAt: realMsg.created_at,
          readAt: realMsg.read_at 
        } : m));
        
        if (channelRef.current) {
          channelRef.current.send({
            type: 'broadcast',
            event: 'new_message',
            payload: {
              id: realMsg.id,
              sender_id: myId,
              sender_type: currentUser?.role || 'Customer',
              sender_name: currentUser?.name || 'User',
              text: encryptedText,
              created_at: realMsg.created_at,
              read_at: realMsg.read_at || null
            }
          });
        }
      }
    }

    // 3. Emit via Socket.io backup if connected
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('sendMessage', {
        id: tempId,
        bookingId: booking.id,
        senderId: myId,
        senderType: currentUser?.role || 'Customer',
        senderName: currentUser?.name || 'User',
        text: encryptedText
      });
    }

    // 4. Clear typing status broadcasts
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: {
          senderName: currentUser?.name || 'User',
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

    setShowEmojiPicker(false);
  };

  const handleRetry = async (msg: any) => {
    // Remove the failed message from state
    setMessages(prev => prev.filter(m => m.id !== msg.id));
    
    // Retry sending
    const myId = currentUser?.id || 'demo-customer';
    const receiverId = currentUser?.role === 'Worker' 
      ? (booking.customer_id || 'demo-customer')
      : (booking.worker_id || 'demo-worker');
    
    const tempId = `msg-opt-${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      bookingId: booking.id,
      senderType: currentUser?.role || 'Customer',
      senderId: myId,
      senderName: currentUser?.name || 'User',
      text: msg.text,
      createdAt: new Date().toISOString(),
      status: 'sending'
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    const encryptedText = await encryptMessage(msg.text, booking.id);

    if (conversationId === 'legacy') {
      const { data: insertData, error: insertError } = await supabase
        .from('chat_messages')
        .insert({
          booking_id: booking.id,
          sender_id: myId,
          sender_type: currentUser?.role || 'Customer',
          sender_name: currentUser?.name || 'User',
          text: encryptedText
        })
        .select();

      if (insertError) {
        setMessages((prev) => prev.map(m => m.id === tempId ? { ...m, status: 'failed' } : m));
      } else if (insertData && insertData[0]) {
        const realMsg = insertData[0];
        setMessages((prev) => prev.map(m => m.id === tempId ? { 
          ...m, 
          id: realMsg.id, 
          status: 'sent', 
          createdAt: realMsg.created_at,
          readAt: null 
        } : m));
        
        if (channelRef.current) {
          channelRef.current.send({
            type: 'broadcast',
            event: 'new_message',
            payload: {
              id: realMsg.id,
              sender_id: myId,
              sender_type: currentUser?.role || 'Customer',
              sender_name: currentUser?.name || 'User',
              text: encryptedText,
              created_at: realMsg.created_at,
              read_at: null
            }
          });
        }
      }
    } else {
      const { data: insertData, error: insertError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: myId,
          receiver_id: receiverId,
          message: encryptedText,
          message_type: 'text'
        })
        .select();

      if (insertError) {
        setMessages((prev) => prev.map(m => m.id === tempId ? { ...m, status: 'failed' } : m));
      } else if (insertData && insertData[0]) {
        const realMsg = insertData[0];
        setMessages((prev) => prev.map(m => m.id === tempId ? { 
          ...m, 
          id: realMsg.id, 
          status: 'sent', 
          createdAt: realMsg.created_at,
          readAt: realMsg.read_at 
        } : m));
        
        if (channelRef.current) {
          channelRef.current.send({
            type: 'broadcast',
            event: 'new_message',
            payload: {
              id: realMsg.id,
              sender_id: myId,
              sender_type: currentUser?.role || 'Customer',
              sender_name: currentUser?.name || 'User',
              text: encryptedText,
              created_at: realMsg.created_at,
              read_at: realMsg.read_at || null
            }
          });
        }
      }
    }
  };

  const handleTypingChange = (text: string) => {
    setInputText(text);
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: {
          senderName: currentUser?.name || 'User',
          text: text,
          isTyping: text.trim().length > 0
        }
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getChatPartnerName = () => {
    if (currentUser?.role === 'Worker') {
      return booking?.customerName || 'Customer';
    }
    return booking?.workerName || 'Rajesh Kumar';
  };

  const partnerName = getChatPartnerName();

  const addEmoji = (emoji: string) => {
    const nextText = inputText + emoji;
    handleTypingChange(nextText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs font-sans">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[620px] max-h-[92vh]">
        
        {/* WhatsApp-Style Header */}
        <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between shadow-md z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-extrabold text-sm uppercase shadow-sm">
                {partnerName.substring(0, 2)}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-white font-outfit leading-tight">
                {partnerName}
              </h3>
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-300 font-medium">
                {isPartnerTyping ? (
                  <span className="text-emerald-400 font-bold animate-pulse">typing...</span>
                ) : (
                  <>
                    <Circle className={`w-1.5 h-1.5 fill-current ${isPartnerOnline ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                    <span>{isPartnerOnline ? 'Online' : 'Offline'} · Verified Cooperative Member</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SahkariGig Booking Context Banner */}
        {booking && (
          <div className="bg-emerald-950/90 text-emerald-100 border-b border-emerald-900/60 px-4 py-2.5 flex items-center justify-between text-xs backdrop-blur-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <div>
                <span className="font-extrabold text-white font-outfit">{booking.service || 'Service Booking'}</span>
                <span className="mx-2 text-emerald-400">·</span>
                <span className="text-emerald-200 font-mono text-[11px]">#{booking.id || 'BK-1001'}</span>
                <span className="mx-2 text-emerald-400">·</span>
                <span className="font-bold text-emerald-300">{booking.amount || '₹550'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                {booking.status || 'ACCEPTED'}
              </span>
            </div>
          </div>
        )}

        {/* WhatsApp-Style Message Body */}
        <div className="flex-1 p-4 bg-[#f0f2f5] overflow-y-auto space-y-3 relative">
          
          {/* Today Date Separator Badge */}
          <div className="flex justify-center my-2">
            <span className="px-3 py-1 bg-white/90 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-2xs border border-slate-200/60">
              Today
            </span>
          </div>

          {messages.length === 0 ? (
            <div className="text-center text-slate-400 py-12 text-xs font-medium bg-white/60 backdrop-blur-xs p-6 rounded-2xl border border-slate-200/50 max-w-xs mx-auto">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-80" />
              <span>Direct encrypted chat room for Booking #{booking?.id || 'BK-1001'}. Say hello!</span>
            </div>
          ) : (
            messages.map((msg) => {
              const myName = (currentUser?.name || '').trim().toLowerCase();
              const sender = (msg.senderName || msg.senderId || '').trim().toLowerCase();
              const isMe = Boolean(myName && sender && (sender === myName || sender.includes(myName) || myName.includes(sender)));

              const timeString = msg.createdAt 
                ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl shadow-xs leading-relaxed text-xs relative ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-tr-xs'
                        : 'bg-white text-slate-900 border border-slate-200/80 rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    
                    <div className={`flex items-center justify-end space-x-1.5 mt-1 text-[9px] ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}>
                      <span>{timeString}</span>
                      {isMe && (
                        <>
                          {msg.status === 'sending' && (
                            <Clock className="w-3 h-3 text-emerald-200 animate-spin" />
                          )}
                          {msg.status === 'failed' && (
                            <button 
                              type="button" 
                              onClick={() => handleRetry(msg)}
                              className="focus:outline-none"
                              title="Failed to send. Click to retry."
                            >
                              <AlertCircle className="w-3 h-3 text-red-300 fill-red-850" />
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

        {/* Emoji Selector Dropdown */}
        {showEmojiPicker && (
          <div className="bg-slate-100 border-t border-slate-200 p-2 flex items-center space-x-2 text-lg overflow-x-auto">
            {['👍', '😊', '🙏', '⚡', '🔧', '✅', '👋', '💯', '📍', '🚗'].map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => addEmoji(e)}
                className="p-1.5 hover:bg-white rounded-lg transition-colors"
              >
                {e}
              </button>
            ))}
          </div>
        )}

        {/* WhatsApp-Style Composer Bar */}
        <form onSubmit={handleSend} className="p-2.5 bg-slate-100 border-t border-slate-200 flex items-center space-x-2">
          
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors shrink-0"
            title="Add Emoji"
          >
            <Smile className="w-5 h-5" />
          </button>

          <button
            type="button"
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors shrink-0"
            title="Attach reference file"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <textarea
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
            className="flex-1 px-4 py-2 bg-white border border-slate-300/80 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none max-h-24 font-sans"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-9 h-9 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-full shadow-sm transition-colors flex items-center justify-center shrink-0"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
