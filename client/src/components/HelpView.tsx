import React from 'react';
import { HelpCircle, Mail, Phone, MessageCircle, FileText, ChevronRight } from 'lucide-react';

export const HelpView: React.FC = () => {
  const faqs = [
    {
      question: 'How do I book a worker?',
      answer: 'You can browse available workers on the home page or search by category. Once you find a suitable worker, click "Book Now" and select your preferred date and time.'
    },
    {
      question: 'How does payment work?',
      answer: 'Payments are securely processed through the platform after the job is completed. You can pay via credit card, UPI, or other supported methods.'
    },
    {
      question: 'What if I need to cancel my booking?',
      answer: 'You can cancel your booking from your dashboard under "My Jobs". Cancellations made at least 24 hours in advance are fully refunded.'
    },
    {
      question: 'Are the workers verified?',
      answer: 'Yes, all our workers belong to registered cooperatives and undergo background checks before they can accept jobs on SahkariGig.'
    }
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-[calc(100vh-4rem)] font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title Heading */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Support & Resources
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-outfit">
            How can we help you?
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-medium">
            Find answers to common questions or reach out to our support team for assistance with your bookings or account.
          </p>
        </div>

        {/* Support Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 font-outfit text-base">Live Chat</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Chat with our support team in real-time. Available Mon-Fri, 9am - 6pm.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 font-outfit text-base">Phone Support</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Call us at 1800-SAHKARI for urgent inquiries regarding your ongoing jobs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 font-outfit text-base">Email Us</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Drop us an email at support@sahkarigig.com and we'll reply within 24 hours.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 font-outfit uppercase tracking-wider text-left pl-2 flex items-center">
            <HelpCircle className="w-5 h-5 mr-2 text-emerald-600" />
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 font-outfit leading-tight flex items-start justify-between">
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
