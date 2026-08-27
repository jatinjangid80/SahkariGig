import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CategoryGrid from './components/CategoryGrid';
import WorkerDirectory from './components/WorkerDirectory';
import CustomerDashboard from './components/CustomerDashboard';
import WorkerDashboard from './components/WorkerDashboard';
import AdminPanel from './components/AdminPanel';
import BookingModal from './components/BookingModal';
import WorkerIdCardModal from './components/WorkerIdCardModal';
import VerifyWorkerPage from './components/VerifyWorkerPage';
import ChatModal from './components/ChatModal';
import PaymentModal from './components/PaymentModal';
import CrewProjectSection from './components/CrewProjectSection';
import ReviewModal from './components/ReviewModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState({
    id: 'usr-cust-1',
    name: 'Ananya Roy',
    email: 'ananya@example.com',
    role: 'customer' // 'customer' | 'worker' | 'admin'
  });

  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace' | 'verify' | 'chat' | 'crew' | 'admin'
  const [categories, setCategories] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Modal States
  const [bookingWorker, setBookingWorker] = useState(null);
  const [verifyWorker, setVerifyWorker] = useState(null);
  const [verifyWorkerIdParam, setVerifyWorkerIdParam] = useState('COOP-2026-00101');
  const [chatBookingId, setChatBookingId] = useState(null);
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);

  // Auto-login to obtain real JWT token for selected role
  const authenticateUserRole = async (userObj) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userObj.email, password: 'password123' })
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
      }
    } catch (err) {
      console.error('Auth sync error:', err);
    }
  };

  const handleRoleSwitch = async (newUserObj) => {
    setCurrentUser(newUserObj);
    await authenticateUserRole(newUserObj);
    fetchData();
  };

  // Fetch initial data with auth header
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const [catRes, wrkRes, bkRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/workers'),
        fetch('/api/bookings', { headers })
      ]);

      const catData = await catRes.json();
      const wrkData = await wrkRes.json();
      const bkData = await bkRes.json();

      if (catData.success) setCategories(catData.categories || []);
      if (wrkData.success) setWorkers(wrkData.workers || []);
      if (bkData.success) setBookings(bkData.bookings || []);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    authenticateUserRole(currentUser).then(() => {
      fetchData();
    });
  }, []);

  // Matching Engine API
  const handleAutoMatch = async (category) => {
    try {
      const res = await fetch('/api/matching/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category })
      });
      return await res.json();
    } catch (err) {
      console.error(err);
    }
  };

  // Booking Status Transition API
  const handleUpdateBookingStatus = async (bookingId, nextStatus) => {
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Dynamic Skill Submission API
  const handleSubmitNewSkill = async (skillName, description) => {
    try {
      const token = localStorage.getItem('token') || '';
      await fetch('/api/categories/submit-skill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ skillName, description })
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        setCurrentUser={handleRoleSwitch}
      />

      {/* Main Body View Switching */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* TAB 1: MARKETPLACE */}
        {activeTab === 'marketplace' && (
          <>
            <HeroSection
              categories={categories}
              onSelectCategory={(catName) => setSelectedCategory(catName)}
            />

            <CategoryGrid
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={(catName) => setSelectedCategory(catName)}
            />

            <WorkerDirectory
              workers={workers}
              selectedCategory={selectedCategory}
              onSelectWorker={(wrk) => setBookingWorker(wrk)}
              onOpenVerifyModal={(wrk) => setVerifyWorker(wrk)}
              onAutoMatch={handleAutoMatch}
            />

            {/* Dashboards Section */}
            {currentUser.role === 'customer' && (
              <CustomerDashboard
                bookings={bookings}
                onOpenChat={(id) => setChatBookingId(id)}
                onOpenPayment={(bk) => setPaymentBooking(bk)}
                onOpenReview={(bk) => setReviewBooking(bk)}
                onOpenVerifyModal={(wrk) => setVerifyWorker(wrk)}
                onCancelBooking={(id) => handleUpdateBookingStatus(id, 'cancelled')}
              />
            )}

            {currentUser.role === 'worker' && (
              <WorkerDashboard
                worker={workers.find(w => w.id === currentUser.id) || workers[0]}
                bookings={bookings}
                onUpdateBookingStatus={handleUpdateBookingStatus}
                onOpenVerifyModal={(wrk) => setVerifyWorker(wrk)}
                onSubmitNewSkill={handleSubmitNewSkill}
              />
            )}
          </>
        )}

        {/* TAB 2: QR ID VERIFICATION */}
        {activeTab === 'verify' && (
          <VerifyWorkerPage
            workerIdParam={verifyWorkerIdParam}
            onBackToMarketplace={() => setActiveTab('marketplace')}
          />
        )}

        {/* TAB 3: LIVE CHAT */}
        {activeTab === 'chat' && (
          <div className="py-12">
            <h2 className="text-2xl font-bold text-white mb-4">Select Confirmed Booking to Open Live Chat</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.filter(b => ['accepted', 'in_progress', 'completed'].includes(b.status)).map(b => (
                <div key={b.id} className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white">Booking #{b.id} — {b.category}</h4>
                    <p className="text-xs text-slate-400">Worker: {b.worker.name} • Status: {b.status}</p>
                  </div>
                  <button
                    onClick={() => setChatBookingId(b.id)}
                    className="px-4 py-2 gradient-bg text-white font-bold text-xs rounded-xl shadow-md"
                  >
                    Open Chat Room
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CREW PROJECTS */}
        {activeTab === 'crew' && (
          <CrewProjectSection currentUser={currentUser} />
        )}

        {/* TAB 5: ADMIN PANEL */}
        {activeTab === 'admin' && (
          <AdminPanel
            onWorkerApproved={fetchData}
            onSkillApproved={fetchData}
            onPaymentVerified={fetchData}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Cooperative Gig Services Platform • SIH Problem Statement ID: SIH26089</p>
          <p className="text-slate-400 font-medium">Ministry of Cooperation • Smart Automation Category</p>
        </div>
      </footer>

      {/* MODALS */}
      {bookingWorker && (
        <BookingModal
          worker={bookingWorker}
          selectedCategory={selectedCategory}
          onClose={() => setBookingWorker(null)}
          onBookingSuccess={(newBooking) => {
            setBookingWorker(null);
            fetchData();
          }}
        />
      )}

      {verifyWorker && (
        <WorkerIdCardModal
          worker={verifyWorker}
          onClose={() => setVerifyWorker(null)}
          onNavigateToVerify={(id) => {
            setVerifyWorker(null);
            setVerifyWorkerIdParam(id);
            setActiveTab('verify');
          }}
        />
      )}

      {chatBookingId && (
        <ChatModal
          bookingId={chatBookingId}
          currentUser={currentUser}
          onClose={() => setChatBookingId(null)}
        />
      )}

      {paymentBooking && (
        <PaymentModal
          booking={paymentBooking}
          onClose={() => setPaymentBooking(null)}
          onPaymentClaimSuccess={() => {
            setPaymentBooking(null);
            fetchData();
          }}
        />
      )}

      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onReviewSuccess={() => {
            setReviewBooking(null);
            fetchData();
          }}
        />
      )}

    </div>
  );
}
