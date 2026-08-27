import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryGrid } from './components/CategoryGrid';
import { WhyCooperative } from './components/WhyCooperative';
import { WorkerDirectory } from './components/WorkerDirectory';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { StatusView } from './components/StatusView';
import { CustomerDashboard } from './components/CustomerDashboard';
import { WorkerDashboard } from './components/WorkerDashboard';
import { AdminPanel } from './components/AdminPanel';
import { CrewProjectSection } from './components/CrewProjectSection';
import { VerifyWorkerPage } from './components/VerifyWorkerPage';
import { BookingModal } from './components/BookingModal';
import { ChatModal } from './components/ChatModal';
import { PaymentModal } from './components/PaymentModal';
import { ReviewModal } from './components/ReviewModal';
import { WorkerIdCardModal } from './components/WorkerIdCardModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { supabase } from './supabase';

export default function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // User state & role management
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    role: 'Customer' | 'Worker' | 'Admin';
  } | null>({
    name: 'Ananya Sharma',
    role: 'Customer'
  });

  // Modal States
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedWorkerForBooking, setSelectedWorkerForBooking] = useState<any>(null);
  
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [activeBookingForChat, setActiveBookingForChat] = useState<any>(null);
  
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [activeBookingForPayment, setActiveBookingForPayment] = useState<any>(null);
  
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeBookingForReview, setActiveBookingForReview] = useState<any>(null);

  const [workerIdCardModalOpen, setWorkerIdCardModalOpen] = useState(false);
  const [activeWorkerIdCard, setActiveWorkerIdCard] = useState<any>(null);

  const [verifyWorkerId, setVerifyWorkerId] = useState<string | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);

    // Listen to Supabase Auth State Changes (Google OAuth & Email Auth)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const email = session.user.email || '';
        const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || email.split('@')[0];
        const role = session.user.user_metadata?.role || 'Customer';

        setCurrentUser({ name, role });
      }
    });

    return () => {
      window.removeEventListener('popstate', handlePopState);
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (worker?: any) => {
    setSelectedWorkerForBooking(worker || null);
    setBookingModalOpen(true);
  };

  const handleOpenChat = (booking: any) => {
    setActiveBookingForChat(booking);
    setChatModalOpen(true);
  };

  const handleOpenPayment = (booking: any) => {
    setActiveBookingForPayment(booking);
    setPaymentModalOpen(true);
  };

  const handleOpenReview = (booking: any) => {
    setActiveBookingForReview(booking);
    setReviewModalOpen(true);
  };

  const handleVerifyQrCode = (workerId: string) => {
    setVerifyWorkerId(workerId);
    navigateTo('/verify');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      
      {/* Public Header */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigateTo}
        currentUser={currentUser}
        onLoginClick={() => setAuthModalOpen(true)}
        onLogoutClick={() => {
          supabase.auth.signOut();
          setCurrentUser(null);
        }}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentPath === '/' && (
          <>
            {/* Customer-First Hero */}
            <HeroSection
              onSearchService={(cat) => setSelectedCategory(cat)}
              onNavigate={navigateTo}
            />

            {/* Service Discovery Grid */}
            <CategoryGrid
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />

            {/* Why SahkariGig Trust Section */}
            <WhyCooperative />

            {/* Verified Worker Discovery Directory */}
            <WorkerDirectory
              selectedCategory={selectedCategory}
              onSelectWorkerForBooking={handleOpenBooking}
              onViewWorkerProfile={(worker) => {
                setActiveWorkerIdCard(worker);
                setWorkerIdCardModalOpen(true);
              }}
              onVerifyQrCode={handleVerifyQrCode}
            />
          </>
        )}

        {currentPath === '/about' && (
          <AboutView onNavigate={navigateTo} />
        )}

        {currentPath === '/contact' && (
          <ContactView />
        )}

        {currentPath === '/status' && (
          <StatusView />
        )}

        {currentPath === '/verify' && (
          <VerifyWorkerPage
            workerId={verifyWorkerId || 'WORKER-DEL-8901'}
            onClose={() => navigateTo('/')}
          />
        )}

        {currentPath === '/dashboard' && (
          <div>
            {/* Role Bar Switcher for Authenticated User Preview */}
            <div className="bg-slate-900 text-white py-2 px-4 text-xs">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <span className="font-semibold text-slate-300">Preview Dashboard View:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentUser({ name: 'Ananya Sharma', role: 'Customer' })}
                    className={`px-2.5 py-1 rounded font-bold transition-colors ${
                      currentUser?.role === 'Customer' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Customer View
                  </button>
                  <button
                    onClick={() => setCurrentUser({ name: 'Rajesh Kumar', role: 'Worker' })}
                    className={`px-2.5 py-1 rounded font-bold transition-colors ${
                      currentUser?.role === 'Worker' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Worker View
                  </button>
                  <button
                    onClick={() => setCurrentUser({ name: 'Cooperative Federation Admin', role: 'Admin' })}
                    className={`px-2.5 py-1 rounded font-bold transition-colors ${
                      currentUser?.role === 'Admin' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Admin View
                  </button>
                </div>
              </div>
            </div>

            {currentUser?.role === 'Customer' && (
              <CustomerDashboard
                currentUser={currentUser}
                onOpenChat={handleOpenChat}
                onOpenPayment={handleOpenPayment}
                onOpenReview={handleOpenReview}
                onVerifyQrCode={handleVerifyQrCode}
              />
            )}

            {currentUser?.role === 'Worker' && (
              <WorkerDashboard
                currentUser={currentUser}
                onOpenWorkerIdCard={() => {
                  setActiveWorkerIdCard(null);
                  setWorkerIdCardModalOpen(true);
                }}
              />
            )}

            {currentUser?.role === 'Admin' && (
              <AdminPanel />
            )}
          </div>
        )}

        {currentPath === '/projects' && (
          <CrewProjectSection />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Interactive Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          navigateTo('/dashboard');
        }}
      />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        worker={selectedWorkerForBooking}
        onBookingSuccess={() => {
          // Booking dispatched
        }}
      />

      <ChatModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        booking={activeBookingForChat}
      />

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        booking={activeBookingForPayment}
      />

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        booking={activeBookingForReview}
      />

      <WorkerIdCardModal
        isOpen={workerIdCardModalOpen}
        onClose={() => setWorkerIdCardModalOpen(false)}
        worker={activeWorkerIdCard}
      />

    </div>
  );
}
