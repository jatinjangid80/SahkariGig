const express = require('express');
const router = express.Router();
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

const initialWorkers = [
  {
    id: 'WORKER-DEL-8901',
    workerId: 'WORKER-DEL-8901',
    name: 'Rajesh Kumar',
    trade: 'Electrician',
    coopName: 'Delhi Labour Cooperative Federation',
    rating: 4.9,
    reviewsCount: 128,
    hourlyRate: '₹400–₹700 / visit',
    distanceKm: 1.8,
    isAvailableToday: true,
    isTopRated: true,
    isVerified: true,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'WORKER-DEL-7652',
    workerId: 'WORKER-DEL-7652',
    name: 'Suresh Sharma',
    trade: 'Plumber',
    coopName: 'JanSeva Plumbing Society',
    rating: 4.8,
    reviewsCount: 94,
    hourlyRate: '₹350–₹650 / visit',
    distanceKm: 2.4,
    isAvailableToday: true,
    isTopRated: true,
    isVerified: true,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'WORKER-DEL-4390',
    workerId: 'WORKER-DEL-4390',
    name: 'Vikram Singh',
    trade: 'Carpenter',
    coopName: 'Northern Crafts Cooperative Federation',
    rating: 4.7,
    reviewsCount: 82,
    hourlyRate: '₹500–₹900 / visit',
    distanceKm: 3.5,
    isAvailableToday: false,
    isTopRated: false,
    isVerified: true,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
];

// GET /api/workers - Get all active workers
router.get('/', (req, res) => {
  const { category, status } = req.query;
  let filtered = initialWorkers;

  if (category && category !== 'All') {
    filtered = filtered.filter(w => w.trade.toLowerCase().includes(category.toLowerCase()));
  }

  if (status) {
    filtered = filtered.filter(w => w.status === status);
  }

  return sendSuccess(res, { workers: filtered, total: filtered.length }, 'Worker directory fetched.');
});

// GET /api/workers/pending - Admin worker approval queue
router.get('/pending', authenticate, requireRole('Admin'), (req, res) => {
  const pendingWorkers = initialWorkers.filter(w => w.status === 'pending');
  return sendSuccess(res, { pendingWorkers }, 'Pending workers fetched.');
});

// GET /api/workers/verify/:workerId - QR Public verification
router.get('/verify/:workerId', (req, res) => {
  const worker = initialWorkers.find(
    w => w.workerId.toLowerCase() === req.params.workerId.toLowerCase() || w.id === req.params.workerId
  );

  if (!worker) {
    return sendError(res, 'Worker profile not found or ID is invalid.', 404);
  }

  return sendSuccess(res, {
    verificationStatus: worker.isVerified ? 'VERIFIED' : 'UNVERIFIED',
    worker: {
      workerId: worker.workerId,
      name: worker.name,
      trade: worker.trade,
      coopName: worker.coopName,
      rating: worker.rating,
      isVerified: worker.isVerified,
      status: worker.status
    }
  }, 'Worker verification details loaded.');
});

// PATCH /api/workers/:id/status - Admin approve/reject
router.patch('/:id/status', authenticate, requireRole('Admin'), (req, res) => {
  const { status, rejectionReason } = req.body;
  const worker = initialWorkers.find(w => w.id === req.params.id || w.workerId === req.params.id);

  if (!worker) {
    return sendError(res, 'Worker not found.', 404);
  }

  if (!['active', 'rejected', 'pending'].includes(status)) {
    return sendError(res, 'Invalid status value.', 400);
  }

  worker.status = status;
  if (rejectionReason) worker.rejectionReason = rejectionReason;

  return sendSuccess(res, { worker }, `Worker status updated to ${status}.`);
});

module.exports = router;
