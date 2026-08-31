const express = require('express');
const router = express.Router();
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { authenticate } = require('../middleware/authMiddleware');

const bookings = [
  {
    id: 'BK-1001',
    bookingCode: 'BK-1001',
    customerName: 'Ananya Sharma',
    service: 'Electrical Inspection',
    workerName: 'Rajesh Kumar',
    workerTrade: 'Electrician',
    workerId: 'WORKER-DEL-8901',
    address: 'Connaught Place, New Delhi',
    bookingDate: '2026-08-30',
    bookingTime: '10:00 AM',
    amount: '₹550',
    status: 'ACCEPTED',
    paymentStatus: 'PENDING',
    createdAt: new Date().toISOString()
  }
];

// GET /api/bookings
router.get('/', authenticate, (req, res) => {
  return sendSuccess(res, { bookings }, 'User bookings retrieved.');
});

// POST /api/bookings - Create new booking
router.post('/', authenticate, (req, res) => {
  const { service, workerId, workerName, workerTrade, address, bookingDate, bookingTime, amount } = req.body;

  if (!service || !address || !bookingDate) {
    return sendError(res, 'Service, address, and date are required.', 400);
  }

  const newBooking = {
    id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
    bookingCode: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: req.user.name || 'Customer',
    service,
    workerName: workerName || 'Assigned Worker',
    workerTrade: workerTrade || service,
    workerId: workerId || 'WORKER-AUTO',
    address,
    bookingDate,
    bookingTime: bookingTime || '11:00 AM',
    amount: amount || '₹499',
    status: 'REQUESTED',
    paymentStatus: 'PENDING',
    createdAt: new Date().toISOString()
  };

  bookings.unshift(newBooking);

  return sendSuccess(res, { booking: newBooking }, 'Booking created successfully!', 201);
});

// PATCH /api/bookings/:id/status - Update state machine
router.patch('/:id/status', authenticate, (req, res) => {
  const { status, paymentStatus } = req.body;
  const booking = bookings.find(b => b.id === req.params.id || b.bookingCode === req.params.id);

  if (!booking) {
    return sendError(res, 'Booking not found.', 404);
  }

  const validStatuses = ['REQUESTED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'RATED'];
  if (status && validStatuses.includes(status)) {
    booking.status = status;
  }

  const validPaymentStatuses = ['PENDING', 'CUSTOMER_CLAIMED_PAID', 'PAID', 'REJECTED'];
  if (paymentStatus && validPaymentStatuses.includes(paymentStatus)) {
    booking.paymentStatus = paymentStatus;
  }

  return sendSuccess(res, { booking }, 'Booking status updated.');
});

module.exports = { router, bookings };
