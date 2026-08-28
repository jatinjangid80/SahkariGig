import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ShieldCheck, Paperclip, Smile, MoreVertical, CheckCheck, ArrowLeft, ExternalLink, Circle } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { CONFIG } from '../config';

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
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && booking) {
      const storageKey = `chat_history_${booking.id}`;
      const savedLocal = localStorage.getItem(storageKey);
      if (savedLocal) {
        try {
          setMessages(JSON.parse(savedLocal));
        } catch (e) {}
      }

      // Connect to Socket.IO backend if valid URL
      if (CONFIG.apiUrl) {
        socketRef.current = io(CONFIG.apiUrl);
        socketRef.current.emit('joinBooking', booking.id);

        socketRef.current.on('chatHistory', (history: any[]) => {
          if (history && history.length > 0) {
            setMessages(history);
            localStorage.setItem(storageKey, JSON.stringify(history));
          }
        });

        socketRef.current.on('newMessage', (message: any) => {
          setMessages((prev) => {
            const updated = [...prev, message];
            localStorage.setItem(storageKey, JSON.stringify(updated));
            return updated;
          });
        });
      }

      // Window storage listener for cross-tab sync without socket
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === storageKey && e.newValue) {
          try {
            setMessages(JSON.parse(e.newValue));
          } catch (err) {}
        }
      };
      window.addEventListener('storage', handleStorageChange);

      return () => {
        socketRef.current?.disconnect();
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [isOpen, booking]);

  if (!isOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !booking) return;

    const senderName = currentUser?.name || 'User';
    const storageKey = `chat_history_${booking.id}`;

    const newMsg = {
      id: `msg-${Date.now()}`,
      bookingId: booking.id,
      senderType: currentUser?.role || 'Customer',
      senderName: senderName,
      text: inputText.trim(),
      createdAt: new Date().toISOString()
    };

    // Emit via Socket.io if connected
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('sendMessage', {
        bookingId: booking.id,
        senderId: senderName,
        senderType: currentUser?.role || 'Customer',
        senderName: senderName,
        text: inputText.trim()
      });
    }

    // Update local state and localStorage
    setMessages((prev) => {
      const updated = [...prev, newMsg];
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });

    setInputText('');
    setShowEmojiPicker(false);
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
    setInputText(prev => prev + emoji);
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
              <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 font-medium">
                <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400 animate-pulse" />
                <span>Online · Verified Cooperative Member</span>
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
                    
                    <div className={`flex items-center justify-end space-x-1 mt-1 text-[9px] ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}>
                      <span>{timeString}</span>
                      {isMe && <CheckCheck className="w-3.5 h-3.5 text-emerald-200" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {isTyping && (
            <div className="flex items-start">
              <div className="bg-white border border-slate-200/80 text-slate-500 text-xs px-3.5 py-2 rounded-xl rounded-tl-xs italic shadow-xs">
                {partnerName} is typing...
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
