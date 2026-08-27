# Payment Module — Cooperative Gig Services Platform

## 1. Purpose

This document defines a separate payment module that can be integrated into the Cooperative Gig Services Platform.

The existing PRD describes the platform as a React + Vite frontend with an Express/Node.js backend and MongoDB Atlas via Mongoose. It also explicitly lists full payment gateway integration as outside the MVP scope, meaning payment can initially be stubbed/mocked. fileciteturn0file0L30-L34

This module upgrades that MVP payment area into a free UPI QR-based payment flow.

---

## 2. Payment Goals

The payment module should:

- Accept the service/project amount from the booking.
- Generate a dynamic UPI payment QR containing the exact amount.
- Allow customers to scan the QR using a UPI app.
- Store payment/order information in MongoDB.
- Connect payment records to the existing Booking.
- Allow the customer to indicate that payment was made.
- Allow a cooperative admin to manually verify and update payment status.
- Never treat a customer's "I Have Paid" button as proof of successful payment.
- Keep payment secrets and database credentials on the backend.

The existing platform already has a Booking model with customer, worker, category, status, scheduled time, and address fields. fileciteturn0file0L145-L153

---

## 3. Important Limitation

### Free UPI QR mode

A normal UPI payment QR/deep link can open the customer's UPI application with a predefined payee and amount.

However, a frontend-only QR code cannot securely verify that the customer actually completed the payment.

Therefore the free version uses:

```text
PENDING
   ↓
CUSTOMER_CLAIMED_PAID
   ↓
Admin checks actual UPI transaction
   ↓
PAID
```

or:

```text
CUSTOMER_CLAIMED_PAID
   ↓
REJECTED
```

Do **not** change a payment to `PAID` merely because the customer clicked "I Have Paid".

For automatic payment confirmation, integrate a payment provider/bank/UPI API later.

---

# 4. Recommended Project Structure

Add the payment module to the existing Express/MongoDB application:

```text
backend/
├── models/
│   ├── Booking.js
│   └── Payment.js
│
├── routes/
│   └── paymentRoutes.js
│
├── controllers/
│   └── paymentController.js
│
├── utils/
│   └── upi.js
│
├── db.js
├── server.js
└── .env

frontend/
├── src/
│   ├── pages/
│   │   └── Payment.jsx
│   ├── components/
│   │   └── PaymentQR.jsx
│   └── services/
│       └── paymentApi.js
```

The PRD already specifies React + Vite, Express/Node.js and MongoDB Atlas/Mongoose as the technical stack. fileciteturn0file0L193-L205

---

# 5. Payment States

Use the following payment state machine:

```text
PENDING
   │
   ├── CUSTOMER_CLAIMED_PAID
   │       │
   │       ├── PAID
   │       │
   │       └── REJECTED
   │
   └── CANCELLED
```

### State meanings

| Status | Meaning |
|---|---|
| `PENDING` | QR/order has been created but payment is not confirmed |
| `CUSTOMER_CLAIMED_PAID` | Customer says they completed payment |
| `PAID` | Admin has verified the transaction |
| `REJECTED` | Payment claim could not be verified |
| `CANCELLED` | Payment/order was cancelled |

---

# 6. Payment MongoDB Model

Create:

`backend/models/Payment.js`

```js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker"
    },

    amount: {
      type: Number,
      required: true,
      min: 1
    },

    currency: {
      type: String,
      default: "INR"
    },

    upiId: {
      type: String,
      required: true
    },

    transactionReference: {
      type: String,
      unique: true,
      sparse: true
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "CUSTOMER_CLAIMED_PAID",
        "PAID",
        "REJECTED",
        "CANCELLED"
      ],
      default: "PENDING"
    },

    customerClaimedAt: Date,

    verifiedAt: Date,

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    rejectionReason: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
```

---

# 7. Environment Variables

Add these to the backend `.env`:

```env
UPI_ID=yourupi@upi
UPI_PAYEE_NAME=Cooperative Gig Services
```

Keep MongoDB credentials in environment variables as well. The existing PRD specifically says `MONGODB_URI` should be an environment variable and should never be hardcoded or committed. fileciteturn0file0L212-L215

Example:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/coopgig
PORT=5000
UPI_ID=yourupi@upi
UPI_PAYEE_NAME=Cooperative Gig Services
```

Never put `MONGODB_URI` in React frontend code.

---

# 8. UPI Link Generator

Create:

`backend/utils/upi.js`

```js
function createUPILink({
  amount,
  transactionReference
}) {
  const upiId = process.env.UPI_ID;
  const payeeName = process.env.UPI_PAYEE_NAME;

  if (!upiId) {
    throw new Error("UPI_ID is not configured");
  }

  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName || "Cooperative Gig Services",
    am: Number(amount).toFixed(2),
    cu: "INR",
    tr: transactionReference
  });

  return `upi://pay?${params.toString()}`;
}

module.exports = {
  createUPILink
};
```

---

# 9. Create Payment API

Create:

`backend/controllers/paymentController.js`

```js
const crypto = require("crypto");

const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const { createUPILink } = require("../utils/upi");

async function createPayment(req, res) {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        message: "bookingId is required"
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    /*
      IMPORTANT:
      Do not trust an amount sent by the browser.

      The production implementation should obtain the final
      amount from the booking/service pricing stored on the server.
    */

    const amount = Number(booking.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Booking does not contain a valid amount"
      });
    }

    const transactionReference =
      `COOP-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

    const payment = await Payment.create({
      booking: booking._id,
      customer: booking.customer,
      worker: booking.worker,
      amount,
      upiId: process.env.UPI_ID,
      transactionReference,
      status: "PENDING"
    });

    const upiLink = createUPILink({
      amount,
      transactionReference
    });

    return res.status(201).json({
      paymentId: payment._id,
      bookingId: booking._id,
      amount,
      currency: "INR",
      transactionReference,
      upiLink,
      status: payment.status
    });
  } catch (error) {
    console.error("Create payment error:", error);

    return res.status(500).json({
      message: "Unable to create payment"
    });
  }
}

module.exports = {
  createPayment
};
```

---

# 10. Payment Routes

Create:

`backend/routes/paymentRoutes.js`

```js
const express = require("express");

const {
  createPayment
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/create", createPayment);

module.exports = router;
```

Then in `server.js`:

```js
const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/payments", paymentRoutes);
```

---

# 11. Frontend Payment Page

Create:

`frontend/src/pages/Payment.jsx`

```jsx
import { useState } from "react";

export default function Payment({ bookingId }) {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  async function createPayment() {
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payments/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            bookingId
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment creation failed");
      }

      setPayment(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function claimPayment() {
    if (!payment) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payments/${payment.paymentId}/claim`,
        {
          method: "POST",
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to submit payment");
      }

      setPayment({
        ...payment,
        status: "CUSTOMER_CLAIMED_PAID"
      });

      alert("Payment submitted for verification.");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="payment-page">

      <h1>Payment</h1>

      {!payment && (
        <button
          onClick={createPayment}
          disabled={loading}
        >
          {loading ? "Creating..." : "Generate UPI QR"}
        </button>
      )}

      {payment && (
        <div>

          <h2>₹{Number(payment.amount).toFixed(2)}</h2>

          <p>
            UPI ID: {payment.upiId}
          </p>

          <div id="payment-qr">
            {/* Generate QR here using qrcode.react or another QR library */}
          </div>

          <p>
            Status: {payment.status}
          </p>

          {payment.status === "PENDING" && (
            <button onClick={claimPayment}>
              I Have Paid
            </button>
          )}

        </div>
      )}

    </div>
  );
}
```

---

# 12. QR Code Component

Install a free QR library:

```bash
npm install qrcode.react
```

Create:

`frontend/src/components/PaymentQR.jsx`

```jsx
import { QRCodeSVG } from "qrcode.react";

export default function PaymentQR({ upiLink }) {
  return (
    <div>
      <QRCodeSVG
        value={upiLink}
        size={250}
        level="H"
      />
    </div>
  );
}
```

Then use it inside the payment page:

```jsx
<PaymentQR upiLink={payment.upiLink} />
```

---

# 13. Add the Customer Claim API

Add to the payment controller:

```js
async function claimPayment(req, res) {
  try {
    const payment = await Payment.findById(
      req.params.paymentId
    );

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found"
      });
    }

    if (payment.status !== "PENDING") {
      return res.status(400).json({
        message: "Payment cannot be claimed in its current state"
      });
    }

    payment.status = "CUSTOMER_CLAIMED_PAID";
    payment.customerClaimedAt = new Date();

    await payment.save();

    return res.json({
      message: "Payment submitted for verification",
      status: payment.status
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to claim payment"
    });
  }
}

module.exports.claimPayment = claimPayment;
```

And add the route:

```js
const {
  createPayment,
  claimPayment
} = require("../controllers/paymentController");

router.post("/create", createPayment);

router.post(
  "/:paymentId/claim",
  claimPayment
);
```

---

# 14. Admin Verification

The cooperative admin should have:

```text
Payment Verification

------------------------------------------------
Order       Amount       Customer       Status
------------------------------------------------
COOP-001   ₹500          Customer A     PENDING

[View Booking]
[Verify Payment]
[Reject]
------------------------------------------------
```

The admin should check the actual UPI/bank transaction before pressing **Verify Payment**.

The verify endpoint should:

```text
CUSTOMER_CLAIMED_PAID
        ↓
      verify
        ↓
       PAID
```

Example backend logic:

```js
async function verifyPayment(req, res) {
  try {
    const payment = await Payment.findById(
      req.params.paymentId
    );

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found"
      });
    }

    if (
      payment.status !==
      "CUSTOMER_CLAIMED_PAID"
    ) {
      return res.status(400).json({
        message: "Payment is not awaiting verification"
      });
    }

    payment.status = "PAID";
    payment.verifiedAt = new Date();
    payment.verifiedBy = req.user._id;

    await payment.save();

    return res.json({
      message: "Payment verified",
      status: payment.status
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to verify payment"
    });
  }
}
```

**This endpoint must be protected by your existing role-based authorization so only a cooperative admin can use it.**

The PRD requires three distinct roles — customer, worker and cooperative admin — with proper access control. fileciteturn0file0L54-L61

---

# 15. Reject Payment

```js
async function rejectPayment(req, res) {
  try {
    const { reason } = req.body;

    const payment = await Payment.findById(
      req.params.paymentId
    );

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found"
      });
    }

    payment.status = "REJECTED";
    payment.rejectionReason =
      reason || "Payment could not be verified";

    await payment.save();

    return res.json({
      message: "Payment rejected",
      status: payment.status
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to reject payment"
    });
  }
}
```

---

# 16. Booking Integration

The recommended flow is:

```text
Customer selects service
        ↓
Selects worker
        ↓
Selects date/time/address
        ↓
Booking created
        ↓
Booking.status = requested
        ↓
Worker accepts
        ↓
Booking.status = accepted
        ↓
Customer opens payment
        ↓
Payment created
        ↓
UPI QR displayed
        ↓
Customer pays
        ↓
Customer claims payment
        ↓
Admin verifies
        ↓
Payment.status = PAID
```

The existing PRD booking lifecycle is:

```text
requested
    ↓
accepted
    ↓
in_progress
    ↓
completed
    ↓
rated
```

with cancellation allowed from `requested` or `accepted`, and transitions enforced server-side. fileciteturn0file0L326-L353

Payment should therefore be a separate state machine rather than replacing the Booking state machine.

---

# 17. Recommended Booking Fields

If the current Booking model does not already have pricing fields, add:

```js
amount: {
  type: Number,
  required: true,
  min: 0
},

currency: {
  type: String,
  default: "INR"
}
```

Do not accept the final amount blindly from the frontend.

Bad:

```js
const amount = req.body.amount;
```

Better:

```js
const booking = await Booking.findById(bookingId);

const amount = booking.amount;
```

The backend must be the source of truth for the amount.

---

# 18. Payment UI

The customer page should look approximately like:

```text
┌───────────────────────────────────┐
│             PAYMENT               │
│                                   │
│              ₹500                 │
│                                   │
│          ┌─────────────┐          │
│          │             │          │
│          │   QR CODE   │          │
│          │             │          │
│          └─────────────┘          │
│                                   │
│ UPI ID: yourupi@upi               │
│                                   │
│ Scan using any UPI app             │
│                                   │
│       [ I HAVE PAID ]              │
│                                   │
│ Status: PENDING                    │
└───────────────────────────────────┘
```

On mobile, additionally provide a **Pay with UPI App** button when appropriate:

```text
[ Pay with UPI App ]
```

using the same `upiLink`.

---

# 19. Security Requirements

Follow these rules:

### Never expose:

```text
MONGODB_URI
JWT secret
session secret
admin credentials
private API keys
```

to the frontend.

### Never trust:

```text
amount
customerId
workerId
payment status
admin role
```

when supplied by the browser.

Get them from authenticated server-side data.

### Admin verification

Only:

```text
cooperative_admin
```

should be able to change:

```text
CUSTOMER_CLAIMED_PAID → PAID
```

or:

```text
CUSTOMER_CLAIMED_PAID → REJECTED
```

This matches the PRD's security requirement for role-based access control and environment-based secret management. fileciteturn0file0L216-L219

---

# 20. Notifications

When payment changes state:

```text
PENDING
↓
CUSTOMER_CLAIMED_PAID
```

notify the admin.

When:

```text
CUSTOMER_CLAIMED_PAID
↓
PAID
```

notify the customer.

When:

```text
CUSTOMER_CLAIMED_PAID
↓
REJECTED
```

notify the customer with the rejection reason.

The existing PRD requires notifications for booking status changes, so payment notifications should use the same notification architecture. fileciteturn0file0L54-L61

---

# 21. Free Deployment

The PRD currently proposes:

```text
Frontend → Netlify
Backend  → Render / Railway
Database → MongoDB Atlas M0
```

as its deployment architecture. fileciteturn0file0L193-L205

For a hackathon/demo, keep the existing architecture and use free/no-cost tiers where currently available.

Before production deployment, check the current provider limits and pricing because free-tier policies can change.

---

# 22. Testing Checklist

## Customer

- [ ] Enter/receive a valid booking amount.
- [ ] Create payment.
- [ ] Confirm QR contains the correct UPI ID.
- [ ] Confirm QR contains the exact amount.
- [ ] Scan QR using a UPI application.
- [ ] Confirm payment record is created.
- [ ] Click "I Have Paid".
- [ ] Confirm payment becomes `CUSTOMER_CLAIMED_PAID`.

## Admin

- [ ] See claimed payments.
- [ ] Open related booking.
- [ ] Check actual UPI transaction.
- [ ] Mark verified payment as `PAID`.
- [ ] Reject invalid/unverified payment.
- [ ] Enter rejection reason.

## Security

- [ ] Customer cannot mark payment as `PAID`.
- [ ] Worker cannot verify payment.
- [ ] Customer cannot verify another customer's payment.
- [ ] Amount cannot be changed by manipulating frontend requests.
- [ ] MongoDB credentials are never sent to frontend.
- [ ] Admin verification endpoints require authentication and authorization.

---

# 23. Future Automatic Payment Verification

When the project is ready for a proper payment gateway, replace:

```text
Customer clicks "I Have Paid"
        ↓
Manual admin verification
```

with:

```text
Customer pays
        ↓
Payment provider
        ↓
Webhook
        ↓
Express backend
        ↓
Verify webhook/signature
        ↓
Payment.status = PAID
        ↓
Booking/payment notification
```

The rest of the Payment model and frontend can remain largely the same.

---

# 24. Final Integration Flow

```text
                         CUSTOMER
                            │
                            ▼
                    Existing Booking
                            │
                            ▼
                     Payment Page
                            │
                            ▼
                     Create Payment
                            │
                            ▼
                       Express API
                            │
                            ▼
                      MongoDB Payment
                            │
                            ▼
                     Generate UPI Link
                            │
                            ▼
                        QR Code
                            │
                            ▼
                 Google Pay / PhonePe /
                    Paytm / BHIM
                            │
                            ▼
                         PAYMENT
                            │
                            ▼
                  "I Have Paid" button
                            │
                            ▼
                CUSTOMER_CLAIMED_PAID
                            │
                            ▼
                  COOPERATIVE ADMIN
                            │
                  ┌─────────┴─────────┐
                  ▼                   ▼
               VERIFY              REJECT
                  │                   │
                  ▼                   ▼
                PAID              REJECTED
                  │
                  ▼
             Notify Customer
```

---

## 25. MVP Recommendation

For the hackathon version, implement:

1. Booking amount
2. Payment collection
3. Dynamic UPI QR
4. Payment MongoDB collection
5. `PENDING`
6. `CUSTOMER_CLAIMED_PAID`
7. Admin payment verification
8. `PAID` / `REJECTED`
9. Customer/admin payment status
10. Basic notifications

Do **not** claim that the free QR implementation automatically verifies UPI payments.

This gives the existing platform a real payment workflow while respecting the original PRD's MVP boundary around full payment-gateway integration. fileciteturn0file0L30-L34
