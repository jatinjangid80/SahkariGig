import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryGrid } from './components/CategoryGrid';
import { WhyCooperative } from './components/WhyCooperative';
import { WorkerDirectory } from './components/WorkerDirectory';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
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
// @ts-ignore
import confetti from 'canvas-confetti';

import { ServicesView } from './components/ServicesView';
import { ForWorkersView } from './components/ForWorkersView';
import { CooperativesView } from './components/CooperativesView';
import { HowItWorksView } from './components/HowItWorksView';
import { WorkerOnboarding } from './components/WorkerOnboarding';
import { CustomerOnboarding } from './components/CustomerOnboarding';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // User state & role management
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string; id: string; email: string; avatarUrl?: string } | null>(null);
  const [workerActiveTab, setWorkerActiveTab] = useState<'feed' | 'active' | 'earnings' | 'profile'>('feed');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<'Customer' | 'Worker'>('Customer');
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOpenAuth = (role: 'Customer' | 'Worker' = 'Customer', mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalRole(role);
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  useEffect(() => {
    // Hardcoded Admin Bypass
    if (localStorage.getItem('mockAdmin') === 'true') {
      setCurrentUser({ id: 'admin-123', name: 'jatin Admin', email: 'admin@gmail.com', role: 'Admin' });
      return;
    }

    // Demo User Bypass (survives page reload)
    const savedDemoUser = localStorage.getItem('demoUser');
    if (savedDemoUser) {
      setCurrentUser(JSON.parse(savedDemoUser));
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          role: session.user.user_metadata?.role || 'Customer'
        });
      } else {
        // Auto-prompt login page modal on first visit of the session if not logged in
        if (!sessionStorage.getItem('hasPromptedLogin')) {
          sessionStorage.setItem('hasPromptedLogin', 'true');
          setAuthModalOpen(true);
        }
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          role: session.user.user_metadata?.role || 'Customer'
        });
      } else {
        if (localStorage.getItem('mockAdmin') !== 'true' && !localStorage.getItem('demoUser')) {
          setCurrentUser(null);
          if (currentPath === '/dashboard') {
            navigateTo('/');
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [currentPath]);

    useEffect(() => {
    if (currentUser && currentPath === '/') {
      navigateTo('/dashboard');
    }
  }, [currentUser, currentPath]);

  // Modal States
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
      if (localStorage.getItem('mockAdmin') === 'true') return;
      
      if (session?.user) {
        const email = session.user.email || '';
        const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || email.split('@')[0];
        const role = session.user.user_metadata?.role || 'Customer';

        setCurrentUser({ name, role, id: session.user.id, email });
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
      {currentPath !== '/worker-onboarding' && currentPath !== '/customer-onboarding' && (
        <Navbar
          currentPath={currentPath}
          onNavigate={navigateTo}
          currentUser={currentUser}
          onLoginClick={() => handleOpenAuth('Customer', 'signin')}
          onLogoutClick={() => {
            localStorage.removeItem('demoUser');
            localStorage.removeItem('mockAdmin');
            supabase.auth.signOut();
            setCurrentUser(null);
            navigateTo('/');
          }}
          workerActiveTab={workerActiveTab}
          onWorkerTabChange={setWorkerActiveTab}
        />
      )}

      {/* Main Page Content */}
      <main className="flex-1">
        {(currentPath === '/' || currentPath === '/workers') && (
          <>
            {currentPath === '/' && (
              <HeroSection
                currentUser={currentUser}
                onSearchService={(cat) => setSelectedCategory(cat)}
                onNavigate={navigateTo}
              />
            )}

            {/* Verified Worker Discovery Directory */}
            <div id="workers-directory" className="py-6">
              <WorkerDirectory
                selectedCategory={selectedCategory}
                currentUserId={currentUser?.id}
                onSelectWorkerForBooking={handleOpenBooking}
                onViewWorkerProfile={(worker) => {
                  setActiveWorkerIdCard(worker);
                  setWorkerIdCardModalOpen(true);
                }}
                onVerifyQrCode={handleVerifyQrCode}
              />
            </div>

            {currentPath === '/' && <WhyCooperative />}
          </>
        )}

        {currentPath === '/about' && (
          <AboutView onNavigate={navigateTo} />
        )}

        {currentPath === '/services' && (
          <ServicesView
            onSelectCategory={(category) => {
              setSelectedCategory(category);
              navigateTo('/workers');
            }}
          />
        )}

        {currentPath === '/for-workers' && (
          <ForWorkersView
            onRegisterClick={() => handleOpenAuth('Worker', 'signup')}
          />
        )}

        {currentPath === '/cooperatives' && (
          <CooperativesView />
        )}

        {currentPath === '/how-it-works' && (
          <HowItWorksView />
        )}

        {currentPath === '/contact' && (
          <ContactView />
        )}

        {currentPath === '/verify' && (
          <VerifyWorkerPage
            workerId={verifyWorkerId || 'WORKER-DEL-8901'}
            onClose={() => navigateTo('/')}
          />
        )}

        {currentPath === '/worker-onboarding' && (
          <WorkerOnboarding 
            currentUser={currentUser}
            onComplete={() => navigateTo('/dashboard')}
          />
        )}

        {currentPath === '/customer-onboarding' && (
          <CustomerOnboarding 
            currentUser={currentUser}
            onComplete={() => navigateTo('/dashboard')}
          />
        )}

        {currentPath === '/dashboard' && (
          <div>
            {(!currentUser || currentUser?.role === 'Customer') && (
              <CustomerDashboard
                currentUser={currentUser || { id: 'demo-123', name: 'Guest User', role: 'Customer', email: 'guest@sahkarigig.org' }}
                onOpenChat={handleOpenChat}
                onOpenPayment={handleOpenPayment}
                onOpenReview={handleOpenReview}
                onVerifyQrCode={handleVerifyQrCode}
                onNavigate={navigateTo}
                refreshTrigger={refreshTrigger}
              />
            )}

            {currentUser?.role === 'Worker' && (
              <WorkerDashboard
                currentUser={currentUser}
                activeTab={workerActiveTab}
                onTabChange={setWorkerActiveTab}
                onProfileUpdate={(updatedUser) => {
                  setCurrentUser(prev => prev ? { ...prev, ...updatedUser } : null);
                  const saved = localStorage.getItem('demoUser');
                  if (saved) {
                    const parsed = JSON.parse(saved);
                    localStorage.setItem('demoUser', JSON.stringify({ ...parsed, ...updatedUser }));
                  }
                }}
                onOpenChat={handleOpenChat}
                onOpenWorkerIdCard={(wData) => {
                  setActiveWorkerIdCard(wData);
                  setWorkerIdCardModalOpen(true);
                }}
                refreshTrigger={refreshTrigger}
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
      {currentPath !== '/worker-onboarding' && (
        <Footer onNavigate={navigateTo} />
      )}

      {/* Interactive Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRole={authModalRole}
        defaultMode={authModalMode}
        onSuccess={(user, isSignup) => {
          const demoUser = {
            id: user.id || 'demo-' + Date.now(),
            name: user.name,
            email: user.email,
            role: user.role
          };
          if (user.email === 'google.user@example.com') { localStorage.setItem('demoUser', JSON.stringify(demoUser)); }
          setCurrentUser(demoUser);
          
          if (user.role === 'Worker' && isSignup) {
            navigateTo('/worker-onboarding');
          } else if (user.role === 'Customer' && isSignup) {
            navigateTo('/customer-onboarding');
          } else {
            navigateTo('/dashboard');
          }
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#10b981', '#06b6d4', '#f59e0b', '#3b82f6']
          });
        }}
      />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        worker={selectedWorkerForBooking}
        onBookingSuccess={async (newBooking) => {
          if (currentUser?.id) {
            const { error } = await supabase.from('bookings').insert({
              id: crypto.randomUUID(),
              booking_code: newBooking.id,
              customer_id: currentUser.id,
              customer_name: currentUser.name,
              worker_id: newBooking.workerId,
              worker_name: newBooking.workerName,
              worker_trade: newBooking.workerTrade,
              service: newBooking.service,
              booking_date: newBooking.date,
              booking_time: newBooking.time,
              address: newBooking.address,
              amount: newBooking.estimatedCost,
              status: 'REQUESTED',
              payment_status: 'PENDING'
            });
            if (error) {
              console.error('Failed to save booking:', error);
              alert('Database Error: ' + error.message);
            }
          }
        }}
      />

      <ChatModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        booking={activeBookingForChat}
        currentUser={currentUser}
      />

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        booking={activeBookingForPayment}
        onPaymentSubmitted={(status) => {
          if (status === 'PAID') {
            setRefreshTrigger(prev => prev + 1);
          }
        }}
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
