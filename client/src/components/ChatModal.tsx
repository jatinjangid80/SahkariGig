import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ShieldCheck, User } from 'lucide-react';
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
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && booking) {
      // Connect to Socket.IO backend
      socketRef.current = io(CONFIG.apiUrl);

      // Join the specific booking room
      socketRef.current.emit('joinBooking', booking.id);

      // Receive Chat History
      socketRef.current.on('chatHistory', (history: any[]) => {
        setMessages(history);
      });

      // Listen for new messages
      socketRef.current.on('newMessage', (message: any) => {
        setMessages((prev) => [...prev, message]);
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [isOpen, booking]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !socketRef.current || !booking) return;

    const senderName = currentUser?.name || 'Unknown User';
    
    // Emit message to backend
    socketRef.current.emit('sendMessage', {
      bookingId: booking.id,
      senderId: senderName, // Using name as ID for demo purposes
      senderType: currentUser?.role || 'Customer',
      senderName: senderName,
      text: inputText.trim()
    });

    setInputText('');
  };

  const getChatPartnerName = () => {
    if (currentUser?.role === 'Worker') {
      return booking?.customerName || 'Customer';
    }
    return booking?.workerName || 'Worker';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px]">
        
        {/* Chat Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xs uppercase">
              {getChatPartnerName().substring(0, 2)}
            </div>
            <div>
              <h3 className="font-bold text-sm text-white font-outfit">
                {getChatPartnerName()}
              </h3>
              <p className="text-[11px] text-emerald-400 flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Verified Booking Relationship
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 bg-slate-50 overflow-y-auto space-y-3 text-xs">
          {messages.length === 0 ? (
            <div className="text-center text-slate-400 py-10">
              No messages yet. Say hello!
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderName === currentUser?.name;
              
              // Format time from ISO
              const timeString = msg.createdAt 
                ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 mb-1">{isMe ? 'You' : msg.senderName} • {timeString}</span>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl leading-relaxed ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-br-2xs'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-bl-2xs shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Composer */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors flex items-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
