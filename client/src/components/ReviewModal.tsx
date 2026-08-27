import React, { useState } from 'react';
import { X, Star, CheckCircle2 } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: any;
  onReviewSubmitted?: (review: any) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  booking,
  onReviewSubmitted
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('Excellent electrical work! Arrived on time with proper digital ID verification.');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (onReviewSubmitted) {
      onReviewSubmitted({ rating, comment, bookingId: booking?.id });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <h3 className="font-bold text-base font-outfit">Rate Service Experience</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Worker Info */}
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
              {booking?.workerName ? booking.workerName.charAt(0) : 'R'}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">{booking?.workerName || 'Rajesh Kumar'}</p>
              <p className="text-xs text-emerald-700 font-semibold">{booking?.service || 'Electrician'}</p>
            </div>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Star Rating Picker */}
              <div className="text-center space-y-2">
                <span className="text-xs font-semibold text-slate-600">Select Rating (1 to 5 Stars)</span>
                <div className="flex items-center justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Feedback Comment</label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Submit Verified Rating & Review
              </button>

            </form>
          ) : (
            <div className="py-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-slate-900 text-base">Thank You for Your Feedback!</h4>
              <p className="text-xs text-slate-600">Your review helps maintain high quality standards across cooperative federations.</p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl mt-2"
              >
                Close
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
