# MVP Implementation Plan — Cooperative Gig Services Platform

## 1. Purpose

This document converts the existing Product Requirements Document, Authentication module, and Payment module into a practical phased MVP implementation plan.

The goal is to build a **working, judge-ready MVP** rather than attempting every feature at once.

The PRD defines the product as a cooperative-backed marketplace connecting households with verified cooperative workers, with booking, matching, communication, identity verification, and project coordination. fileciteturn0file0L9-L20

---

# 2. MVP Definition

The MVP should allow this complete primary journey:

```text
Customer registers
      ↓
Customer logs in
      ↓
Browse service categories
      ↓
View available workers
      ↓
Select worker
      ↓
Create booking
      ↓
Worker receives request
      ↓
Worker accepts
      ↓
Customer + worker can chat
      ↓
Worker starts job
      ↓
Worker completes job
      ↓
Customer makes payment
      ↓
Payment is verified
      ↓
Customer gives rating/review
```

At the same time:

```text
Worker registers
      ↓
Admin reviews worker
      ↓
Admin approves
      ↓
Worker becomes active
      ↓
Worker can receive bookings
```

The PRD requires these three roles: Customer, Worker, and Cooperative Admin. fileciteturn0file0L36-L40

---

# 3. Technology Stack

Use the stack already defined in the PRD:

```text
Frontend
React + Vite
Tailwind CSS

Backend
Express + Node.js

Database
MongoDB Atlas + Mongoose

Authentication
Firebase Authentication

Real-time
Socket.io

AI
LLM-based free-text service routing

QR
qrcode / QR generation

Hosting
Frontend: Netlify
Backend: Render / Railway
Database: MongoDB Atlas
```

The PRD specifies React + Vite, Tailwind CSS, Express, MongoDB Atlas/Mongoose, Socket.io, role-based authentication, QR generation, and Netlify/Render/Railway as the architecture. fileciteturn0file0L193-L205

---

# 4. MVP Priority

Use this priority order:

```text
P0 = Must have for MVP
P1 = Important after core flow works
P2 = Stretch / Phase 2
```

## P0 — Must Have

- Authentication
- Customer registration/login
- Worker registration/login
- Cooperative Admin access
- Worker approval
- Service categories
- Worker profiles
- Booking creation
- Worker accept/reject
- Booking state machine
- Customer and Worker dashboards
- Basic matching
- Booking-scoped chat
- Worker identity verification
- UPI QR payment
- Manual payment verification
- Rating/review

## P1 — Important

- AI free-text service routing
- Dynamic service categories
- Notifications
- Better matching by proximity/rating
- Worker earnings summary
- Better admin dashboard

## P2 — Stretch

- Large project/crew mode
- Advanced analytics
- Multi-language
- Native mobile apps
- Automatic payment gateway/webhook integration
- Advanced project management

The PRD explicitly treats full payment gateway integration, full Gantt project management, localization, and native mobile apps as outside the MVP/hackathon scope. fileciteturn0file0L128-L132

---

# 5. Phase 0 — Project Foundation

## Goal

Create the application foundation before implementing business features.

### Tasks

- [ ] Create React + Vite frontend.
- [ ] Create Express + Node.js backend.
- [ ] Connect MongoDB Atlas.
- [ ] Configure environment variables.
- [ ] Configure Firebase project.
- [ ] Enable Firebase Email/Password Authentication.
- [ ] Configure Firebase Admin SDK on backend.
- [ ] Configure Tailwind CSS.
- [ ] Configure frontend/backend API URLs.
- [ ] Configure Git and `.gitignore`.
- [ ] Create basic routing structure.
- [ ] Create common error handling.
- [ ] Create API response structure.

### Expected Result

```text
Frontend runs
Backend runs
MongoDB connects
Firebase Authentication connects
Frontend can communicate with backend
```

---

# 6. Phase 1 — Authentication & Registration

## Goal

Create secure user registration and role-based login.

The PRD requires role-based authentication for Customer, Worker, and Cooperative Admin. fileciteturn0file0L150-L157

### Customer

- [ ] Customer registration.
- [ ] Customer login.
- [ ] Customer logout.
- [ ] Customer profile.
- [ ] Customer dashboard.
- [ ] Firebase UID linked to MongoDB User.

### Worker

- [ ] Worker registration.
- [ ] Worker login.
- [ ] Worker profile.
- [ ] Worker skill selection.
- [ ] Worker status defaults to `pending`.
- [ ] Worker dashboard locked until approval.

### Cooperative Admin

- [ ] Secure admin account creation.
- [ ] Admin login.
- [ ] Admin dashboard.
- [ ] Role-protected admin APIs.

### Security

- [ ] Verify Firebase ID token on backend.
- [ ] Server-side role authorization.
- [ ] Protect customer resources.
- [ ] Protect worker resources.
- [ ] Protect admin resources.
- [ ] Never trust role/user ID from the browser.

### Expected Result

```text
Register → Login → Correct Dashboard
```

---

# 7. Phase 2 — Marketplace & Service Categories

## Goal

Make the marketplace usable.

The PRD requires a home page with service categories, worker browsing, filtering, worker profiles, and booking flow. fileciteturn0file0L138-L149

### Tasks

- [ ] Create ServiceCategory model.
- [ ] Seed initial categories:
  - Electrician
  - Plumber
  - Carpenter
  - Painter
  - Domestic Help
  - Caregiver
  - Driver
  - Gardener
  - Cleaner
  - Technician
- [ ] Build Home page.
- [ ] Build category grid.
- [ ] Build category browse page.
- [ ] Build worker listing.
- [ ] Build worker profile page.
- [ ] Show skills.
- [ ] Show experience.
- [ ] Show cooperative affiliation.
- [ ] Show rating.
- [ ] Show price range.
- [ ] Show availability.

### Expected Result

```text
Home
 ↓
Category
 ↓
Worker List
 ↓
Worker Profile
```

---

# 8. Phase 3 — Worker Onboarding & Admin Approval

## Goal

Create the cooperative trust layer.

The PRD requires workers to be onboarded and approved by a Cooperative Admin before becoming active. fileciteturn0file0L300-L306

### Worker

- [ ] Submit registration.
- [ ] Select existing skills.
- [ ] Submit new skill if required.
- [ ] Status = `pending`.
- [ ] Show approval status.

### Admin

- [ ] Worker onboarding queue.
- [ ] View worker details.
- [ ] Approve worker.
- [ ] Reject worker.
- [ ] Store rejection reason.
- [ ] Change approved worker to `active`.

### Expected Result

```text
Worker
  ↓
pending
  ↓
Admin Review
  ↓
active
```

Only active workers should enter the normal booking pool.

---

# 9. Phase 4 — Booking Engine

## Goal

Build the central marketplace workflow.

The PRD defines the booking process as selecting a service, selecting a worker or auto-assignment, choosing date/time, entering address, and confirming. fileciteturn0file0L142-L149

### Customer Flow

```text
Select Service
     ↓
Select Worker
     ↓
Date / Time
     ↓
Address
     ↓
Review
     ↓
Confirm
     ↓
Booking Created
```

### Booking States

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

Cancellation:

```text
requested → cancelled
accepted  → cancelled
```

The PRD requires these transitions to be enforced server-side. fileciteturn0file0L326-L353

### Tasks

- [ ] Create/complete Booking model.
- [ ] Add amount/pricing.
- [ ] Create booking API.
- [ ] Validate booking ownership.
- [ ] Implement state transitions.
- [ ] Prevent invalid transitions.
- [ ] Customer booking history.
- [ ] Worker incoming bookings.
- [ ] Worker accept/reject.
- [ ] Admin booking oversight.

### Expected Result

A real end-to-end booking can be created and moved through its lifecycle.

---

# 10. Phase 5 — Matching Engine

## Goal

Avoid random worker assignment.

The PRD specifically requires ranking available workers using skill match + proximity + rating. fileciteturn0file0L150-L155

### MVP Matching

Start simple:

```text
1. Worker is active
2. Worker has required skill
3. Worker is available
4. Rank by distance
5. Rank by rating
```

Example score:

```text
score =
    skillMatch * 0.50
  + proximity * 0.30
  + rating * 0.20
```

The exact scoring weights can be adjusted after testing.

### Tasks

- [ ] Filter inactive workers.
- [ ] Filter unavailable workers.
- [ ] Match required skill.
- [ ] Calculate approximate distance.
- [ ] Include rating.
- [ ] Return ranked workers.
- [ ] Provide "Auto-assign nearest available".

### Expected Result

```text
Customer
   ↓
Auto Assign
   ↓
Matching Engine
   ↓
Ranked Workers
   ↓
Best Available Worker
```

---

# 11. Phase 6 — Real-Time Chat

## Goal

Allow communication after a booking is accepted.

The PRD specifies Socket.io rooms keyed by booking ID and persistent Messages in MongoDB. fileciteturn0file0L324-L328

### Rules

Chat must not be open public messaging.

```text
Booking accepted
       ↓
Chat unlocked
       ↓
Customer ↔ Worker
```

### Tasks

- [ ] Configure Socket.io.
- [ ] Create booking rooms.
- [ ] Join room after acceptance.
- [ ] Send message.
- [ ] Save message to MongoDB.
- [ ] Broadcast message.
- [ ] Load previous messages.
- [ ] Unread count.
- [ ] Prevent unrelated users from joining booking chat.

### Expected Result

```text
Customer sends message
        ↓
MongoDB
        ↓
Socket.io
        ↓
Worker receives message
```

---

# 12. Phase 7 — Worker Identity Card

## Goal

Build the trust/verification feature.

The PRD requires a digital worker ID with worker details and a QR code linking to a live verification page. fileciteturn1file5L408-L421

### Card

Include:

- Worker photo
- Name
- Skill/trade
- Cooperative society
- Unique Worker ID
- Join date
- Current rating
- QR code

### QR Flow

```text
Worker ID Card
      ↓
Scan QR
      ↓
/verify/{workerId}
      ↓
Database lookup
      ↓
Active/Inactive
Rating
Cooperative
```

The verification page must show current database information rather than a static card value. fileciteturn1file8L696-L703

### Expected Result

A customer can verify the worker before or during a service visit.

---

# 13. Phase 8 — Payment Module

## Goal

Add a free UPI QR payment flow using the separate `payment.md` specification.

### MVP Payment Flow

```text
Booking
   ↓
Payment Page
   ↓
Amount from backend
   ↓
Create Payment
   ↓
Generate UPI Link
   ↓
Generate QR
   ↓
Customer scans
   ↓
Customer pays
   ↓
"I Have Paid"
   ↓
CUSTOMER_CLAIMED_PAID
   ↓
Admin checks actual transaction
   ↓
PAID / REJECTED
```

### Payment States

```text
PENDING
CUSTOMER_CLAIMED_PAID
PAID
REJECTED
CANCELLED
```

### Security

- [ ] Amount comes from trusted booking data.
- [ ] Customer can create payment only for their booking.
- [ ] Customer cannot set `PAID`.
- [ ] Worker cannot verify payments.
- [ ] Only authorized Cooperative Admin can verify.
- [ ] Payment record links to Booking.
- [ ] UPI ID stays configurable through backend environment variables.
- [ ] MongoDB credentials never go to frontend.

### Important MVP Limitation

The free UPI QR approach does **not** provide secure automatic payment confirmation.

Therefore:

```text
"I Have Paid"
```

means:

```text
CUSTOMER_CLAIMED_PAID
```

and not:

```text
PAID
```

Automatic confirmation can be added later through a payment provider/webhook integration.

---

# 14. Phase 9 — Ratings & Reviews

## Goal

Complete the service lifecycle.

The PRD requires customer rating/review after booking completion and recalculation of the worker's rating. fileciteturn1file3L267-L292

### Flow

```text
Booking.completed
      ↓
Customer prompted
      ↓
Rating 1–5
      ↓
Optional comment
      ↓
Review saved
      ↓
Worker rating recalculated
      ↓
Booking = rated
```

### Tasks

- [ ] Review model.
- [ ] Rating UI.
- [ ] Comment UI.
- [ ] Prevent duplicate reviews.
- [ ] Recalculate worker rating.
- [ ] Lock rated booking from further review.

---

# 15. Phase 10 — Notifications

## Goal

Keep users informed about important events.

The PRD requires email/in-app notifications on booking status changes. fileciteturn1file0L81-L88

### MVP Notifications

At minimum:

```text
Booking requested
Booking accepted
Booking rejected
Job started
Job completed
Payment claimed
Payment verified
Payment rejected
Worker approved
Worker rejected
```

Start with in-app notifications if time is limited.

Email can be added after the core flow is stable.

---

# 16. Phase 11 — AI Free-Text Routing

## Goal

Implement the AI feature after the core marketplace works.

The PRD requires free-text input such as "my fan isn't working" to be classified against the current live ServiceCategory list. fileciteturn1file8L673-L677

### Flow

```text
Customer types:
"My fan isn't working"
        ↓
LLM
        ↓
Current ServiceCategory list
        ↓
Electrician
        ↓
Worker list
```

If confidence is low:

```text
LLM
 ↓
unclear
 ↓
Ask customer to select category
```

### Important

Do not hardcode the AI category list.

The prompt should receive the current approved ServiceCategory list.

---

# 17. Phase 12 — Dynamic Skills & Categories

## Goal

Allow new skills to be added without frontend code changes.

The PRD defines ServiceCategory as a live database collection and requires admin approval for new skills. fileciteturn1file5L395-L407

### Flow

```text
Worker submits new skill
        ↓
pending_review
        ↓
Admin
        ↓
Approve
        ↓
ServiceCategory = approved
        ↓
Home + filters + AI router
```

### Tasks

- [ ] New skill form.
- [ ] Admin approval queue.
- [ ] Approve/reject.
- [ ] Live category rendering.
- [ ] Include approved categories in AI routing.

---

# 18. Phase 13 — Project / Crew Mode

## Goal

Add the larger multi-trade project workflow only after the single-worker marketplace is stable.

The PRD describes Project Booking for jobs such as building construction/renovation, where the admin assembles a crew and assigns tasks. fileciteturn1file4L329-L336

### Flow

```text
Customer
   ↓
Project Booking
   ↓
Admin Review
   ↓
Build Crew
   ↓
Assign Trades
   ↓
Create Tasks
   ↓
Project = planning
   ↓
Project = in_progress
   ↓
Tasks completed
   ↓
Project = completed
```

### MVP Project Features

- [ ] Project description.
- [ ] Start date.
- [ ] Target end date.
- [ ] Crew members.
- [ ] Trade.
- [ ] Crew lead.
- [ ] Task checklist.
- [ ] Task assignment.
- [ ] Task status.
- [ ] Progress percentage.

No Gantt chart is required for MVP. fileciteturn1file4L329-L336

---

# 19. Recommended Actual Build Order

If development time is limited, use this exact order:

```text
PHASE 0
Foundation
   ↓
PHASE 1
Authentication
   ↓
PHASE 2
Marketplace
   ↓
PHASE 3
Worker Approval
   ↓
PHASE 4
Booking
   ↓
PHASE 5
Matching
   ↓
PHASE 6
Chat
   ↓
PHASE 7
Worker ID
   ↓
PHASE 8
Payment
   ↓
PHASE 9
Rating
   ↓
PHASE 10
Notifications
   ↓
PHASE 11
AI Routing
   ↓
PHASE 12
Dynamic Skills
   ↓
PHASE 13
Project/Crew
```

This follows the PRD's suggested build order, which prioritizes the core marketplace/booking engine, then real-time chat, then worker ID, with crew/project mode last if time is short. fileciteturn1file7L593-L599

---

# 20. Minimum Demo That Must Work

For the hackathon/demo, the following flow should work completely:

## Customer

```text
Register
 ↓
Login
 ↓
Choose Electrician
 ↓
View Workers
 ↓
Select Worker
 ↓
Book Service
 ↓
View Booking
```

## Worker

```text
Register
 ↓
Pending
 ↓
Admin Approval
 ↓
Active
 ↓
Receive Booking
 ↓
Accept
 ↓
Chat
 ↓
Start Job
 ↓
Complete Job
```

## Customer

```text
Receive booking update
 ↓
Chat
 ↓
Payment QR
 ↓
Pay
 ↓
Claim Payment
 ↓
Admin Verification
 ↓
PAID
 ↓
Rating
```

## Admin

```text
Login
 ↓
Approve Worker
 ↓
View Bookings
 ↓
View Claimed Payments
 ↓
Verify Payment
 ↓
Manage Workers
```

---

# 21. Definition of MVP Complete

The MVP is complete when:

- [ ] Three roles work.
- [ ] Registration works.
- [ ] Login/logout works.
- [ ] Role-based access works.
- [ ] Worker approval works.
- [ ] Categories load from database.
- [ ] Worker profiles work.
- [ ] Customer can create booking.
- [ ] Worker can accept/reject booking.
- [ ] Booking state transitions are enforced server-side.
- [ ] Customer and worker dashboards work.
- [ ] Matching produces sensible ranked workers.
- [ ] Booking chat works and persists.
- [ ] Worker ID QR verification works.
- [ ] Payment QR works.
- [ ] Payment claim works.
- [ ] Admin payment verification works.
- [ ] Rating/review works.
- [ ] Basic notifications work.
- [ ] Core flow can be demonstrated from registration to completed service.

The PRD's success metrics emphasize an end-to-end working booking flow, AI routing, live worker verification, persistent chat, and a sample multi-trade project. fileciteturn1file0L81-L88

---

# 22. What NOT to Build First

Do not start with:

```text
❌ Advanced analytics
❌ Native mobile app
❌ Gantt charts
❌ Complex payment gateway
❌ Advanced recommendation engine
❌ Multi-language system
❌ Complex notification infrastructure
❌ Full project-management suite
```

Build the **customer → worker → booking → service → payment → review** loop first.

---

# 23. Final MVP Architecture

```text
                         ┌─────────────────┐
                         │    React/Vite    │
                         │     Frontend     │
                         └────────┬────────┘
                                  │
                   ┌──────────────┼──────────────┐
                   │              │              │
                   ▼              ▼              ▼
              Firebase       Express API     Socket.io
                 Auth              │              │
                   │               │              │
                   └───────┬───────┘              │
                           ▼                      │
                    MongoDB Atlas ◄───────────────┘
                           │
          ┌────────────────┼──────────────────┐
          ▼                ▼                  ▼
       Users            Workers            Bookings
          │                │                  │
          │                │                  ├── Messages
          │                │                  ├── Payments
          │                │                  └── Reviews
          │                │
          │                └── Worker ID / Verification
          │
          └── Roles / Profiles
```

---

# 24. Final Principle

The MVP should be **functional first, polished second**.

The most important demonstration is:

```text
Real user
   ↓
Real authentication
   ↓
Real worker
   ↓
Real booking
   ↓
Real booking state changes
   ↓
Real chat
   ↓
Real worker verification
   ↓
Real UPI payment request
   ↓
Real payment verification workflow
   ↓
Real review
```

Once this complete loop works reliably, add AI routing, dynamic skills, notifications, and finally project/crew mode.

