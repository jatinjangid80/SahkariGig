# Product Requirements Document
## Cooperative Gig Services Platform for Household & Community Services

**Problem Statement ID:** SIH26089
**Category:** Smart Automation
**Ministry:** Ministry of Cooperation
**Document Version:** 1.0
**Last Updated:** August 27, 2026

---

## 1. Overview

### 1.1 Background
Labour Cooperative Federations and Labour Cooperative Societies possess a large, underutilized pool of skilled workers — electricians, plumbers, carpenters, painters, domestic helpers, caregivers, drivers, gardeners, cleaners, and technicians. There is currently no unified digital platform connecting this workforce to households and communities that need these services on demand.

### 1.2 Product Vision
Build a trust-first, cooperative-backed gig services marketplace that connects verified cooperative workers to households — combining real-time booking, intelligent matching, live communication, and identity verification, while also supporting large-scale multi-trade projects (e.g., building construction/renovation) through a crew coordination layer.

### 1.3 Why This Matters
Since the official problem statement stops at the setup paragraph with no fixed "Expected Solution" checklist, the feature scope is intentionally open — this PRD defines a complete, judge-ready, functionally deep solution rather than a decorative UI shell.

---

## 2. Goals & Non-Goals

### 2.1 Goals
- Provide a real, working marketplace connecting cooperative-affiliated workers to customers
- Build a genuine matching engine (skill + proximity + rating), not a random assignment
- Establish trust through verifiable digital worker identity
- Enable real-time coordination between customer and worker via chat
- Support large multi-trade projects through crew-based project management
- Keep the system cooperative-governed (admins onboard and manage their own workers)

### 2.2 Non-Goals (for MVP / Hackathon Scope)
- Full payment gateway integration (can be stubbed/mocked)
- Full Gantt-chart style project management (a checklist + progress % is sufficient)
- Multi-language localization (can be a stretch goal)
- Native mobile apps (responsive web is sufficient for demo)

---

## 3. User Roles

| Role | Description |
|---|---|
| **Customer** | Household/community member booking services |
| **Worker** | Cooperative-affiliated skilled worker fulfilling bookings |
| **Cooperative Admin** | Onboards/manages workers, oversees society-wide bookings and projects |

---

## 4. Core Features

### 4.1 Marketplace & Booking Engine

**Pages:**
- **Home** — hero section + service category grid (electrician, plumber, carpenter, painter, domestic help, caregiver, driver, gardener, cleaner, technician)
- **Category Browse** — list of available workers per category, filterable by rating, price, and availability
- **Worker Profile** — skills, experience, cooperative affiliation, rating, price range, availability calendar
- **Booking Flow** — select service → select worker (or "auto-assign nearest available") → date/time → address → confirm
- **Customer Dashboard** — upcoming/past bookings with live status
- **Worker Dashboard** — incoming requests, accept/reject, schedule, earnings summary
- **Cooperative Admin Panel** — onboard/manage workers, view society-wide bookings, reassign jobs
- **Rating & Review** — post-completion feedback

**Functional Depth (what makes this real, not decorative):**
- **Matching logic:** rank available workers by skill match + proximity + rating — not random selection
- **Booking state machine:** `requested → accepted → in_progress → completed → rated`, with every transition enforced server-side
- **Free-text request routing:** customer types something like "my fan isn't working" and an LLM call classifies it into the correct service category — a genuinely functional AI feature
- **Role-based auth:** three distinct roles (customer, worker, cooperative admin) with proper access control
- **Notifications:** real email/in-app notifications on every booking status change

### 4.2 Dynamic Skill & Category Management

The service categories listed in Section 4.1 (electrician, plumber, etc.) are a **starting set, not a hard limit**. The platform must support new skills and new workers being added at any time without a code change or redeployment.

**How it works:**
- `ServiceCategory` is a live database collection, not a hardcoded list — the home page category grid renders directly from this collection
- During onboarding, a worker selects existing skills from a dropdown **or** types a new skill/category that doesn't exist yet
- A new skill submission is flagged `pending_review` and routed to the cooperative admin panel
- Admin approves it → the skill is added to `ServiceCategory` → it instantly appears in the home page grid and search/filter options, with zero frontend changes needed
- The free-text LLM router (Section 4.1) is prompted with the **current live category list** each time, so it automatically picks up newly approved skills instead of being retrained or hardcoded

**Data model addition:**
```js
// models/ServiceCategory.js
{
  name: String,              // e.g. "Solar Panel Installer"
  icon: String,              // icon key/URL for the grid
  description: String,
  status: { type: String, enum: ['pending_review', 'approved'], default: 'pending_review' },
  createdBy: { type: ObjectId, ref: 'Worker' }, // who first requested this skill
  timestamps: true
}
```

**Worker skills field:** already stored as `skills: [String]` on the `Worker` model (Section 5.1) — a free array, so a worker can carry any combination of approved skills, old or newly added, without a schema change.

**Net effect:** onboarding a plumber next week or a "drone surveyor" next year both work the exact same way — through the admin approval queue, not a code deployment.

### 4.3 Worker Identity Card (Trust & Verification Layer)

A digital ID badge that proves a worker is a verified, cooperative-affiliated professional — critical for a platform where strangers enter people's homes.

**Card contents:** photo, name, skill/trade, cooperative society name, unique Worker ID, join date, current rating, QR code

**What makes it real:**
- QR code links to a live verification page (`yourapp.com/verify/{workerId}`) pulling the worker's **current** status directly from the database — active/inactive, rating, cooperative affiliation
- Anyone (customer, building security guard) can scan it on the spot to confirm identity — a genuine safety feature, not a static prop

**Implementation:**
- QR generation via the `qrcode` npm package
- Card rendering: client-side via `html2canvas`/`jsPDF`, or server-side via `@napi-rs/canvas`/Puppeteer for auto-generation
- Unlocked as a "Download ID Card" action on the worker dashboard, only after cooperative admin approval

### 4.4 Real-Time Chat (Socket.io)

- Scoped to a **confirmed booking** — not open DMs — unlocking coordination like "running 10 min late" or "bring extra pipe fitting"
- Backend: Socket.io server attached to the existing Express app, with rooms keyed by `booking_id`
- Messages persist to a `Messages` collection so chat history reloads on reopen, not just live-stream
- UI: chat icon on the booking detail page opening a slide-over panel, with unread badge count

### 4.5 Crew Interface for Large Projects

A second booking type for large multi-trade jobs (e.g., building construction/renovation), layered on top of the single-worker "quick service" booking flow.

- **Project Booking:** customer describes a larger job; cooperative admin assembles a crew (mason, electrician, plumber, painter, etc.) with one worker designated as crew lead
- **Project Dashboard:** crew member list, per-trade task checklist, overall progress %, target timeline (checklist-based — no Gantt chart needed for MVP)
- Each crew member's existing worker dashboard simply filters to "my tasks across all projects I'm on" — no separate interface required

---

## 5. Data Model (MongoDB / Mongoose)

**Design principle:** embed data that's small, bounded, and always fetched with its parent (e.g., a project's crew/tasks); reference data that's queried independently or grows unbounded (e.g., bookings, messages, workers).

### 5.1 Worker
```js
{
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  skills: [String],
  cooperativeSociety: { type: ObjectId, ref: 'CooperativeSociety' },
  workerId: { type: String, unique: true }, // e.g. "COOP-2026-00123"
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'active', 'inactive'], default: 'pending' },
  profilePhoto: String,
  timestamps: true
}
```

### 5.2 Booking
```js
{
  customer: { type: ObjectId, ref: 'User' },
  worker: { type: ObjectId, ref: 'Worker' },
  category: { type: ObjectId, ref: 'ServiceCategory' },
  status: { type: String, enum: ['requested', 'accepted', 'in_progress', 'completed', 'cancelled'], default: 'requested' },
  scheduledTime: Date,
  address: String,
  timestamps: true
}
```

### 5.3 Message
```js
{
  booking: { type: ObjectId, ref: 'Booking' },
  senderType: { type: String, enum: ['customer', 'worker'] },
  sender: ObjectId,
  text: String,
  read: { type: Boolean, default: false },
  timestamps: true
}
```

### 5.4 Project
```js
{
  customer: { type: ObjectId, ref: 'User' },
  description: String,
  status: { type: String, enum: ['planning', 'in_progress', 'completed'], default: 'planning' },
  startDate: Date,
  targetEndDate: Date,
  crew: [{
    worker: { type: ObjectId, ref: 'Worker' },
    trade: String,
    isLead: Boolean
  }],
  tasks: [{
    assignedWorker: { type: ObjectId, ref: 'Worker' },
    taskName: String,
    status: { type: String, enum: ['pending', 'in_progress', 'done'], default: 'pending' },
    dueDate: Date
  }],
  timestamps: true
}
```

### 5.5 Additional Collections (to be finalized)
- `CooperativeSociety` — society name, registration details, list of admins
- `ServiceCategory` — category name, icon, description
- `Review` — bookingId, rating, comment

---

## 6. Technical Architecture

### 6.1 Stack
| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Backend | Express (Node.js) |
| Database | MongoDB Atlas (M0 free tier) via Mongoose |
| Real-time | Socket.io |
| Auth | Role-based (customer / worker / cooperative admin) |
| AI Routing | LLM call for free-text → category classification |
| ID Card | `qrcode` + `html2canvas`/`jsPDF` (client) or Puppeteer/`@napi-rs/canvas` (server) |
| Frontend Hosting | Netlify |
| Backend Hosting | Render / Railway |

### 6.2 Database Connection
```js
// db.js
const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

module.exports = connectDB;
```

```
# .env (never commit — add to .gitignore)
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/coopgig?retryWrites=true&w=majority
PORT=5000
```

### 6.3 Socket.io + MongoDB Integration
Messages are persisted on receipt, then broadcast — so late joiners and page refreshes still see full history:
```js
io.on('connection', (socket) => {
  socket.on('joinBooking', (bookingId) => socket.join(bookingId));

  socket.on('sendMessage', async ({ bookingId, senderId, senderType, text }) => {
    const message = await Message.create({ booking: bookingId, sender: senderId, senderType, text });
    io.to(bookingId).emit('newMessage', message);
  });
});
```

### 6.4 Deployment Notes
- Use MongoDB Atlas rather than local Mongo — no server management, cloud-ready from day one
- Whitelist `0.0.0.0/0` for hackathon simplicity; tighten IP access before any production use
- Set `MONGODB_URI` as an environment variable on the hosting platform's dashboard — never hardcode or commit it

---

## 7. Non-Functional Requirements
- **Security:** role-based access control, hashed passwords, environment-based secrets management
- **Reliability:** enforced booking state machine — no invalid status transitions
- **Scalability:** referenced (not embedded) collections for unbounded data (bookings, messages, workers)
- **Trust & Safety:** live-verifiable worker identity via QR-linked status page
- **Usability:** clean, mobile-responsive UI with clear category icons and booking calendar

---

## 8. Success Metrics (Demo-Oriented)
- End-to-end booking flow completes across all state transitions without manual intervention
- Free-text request correctly routes to the right category via LLM classification
- QR code scan resolves to a live, accurate worker verification page
- Chat messages persist and reload correctly across sessions
- A sample multi-trade project can be created, staffed with a crew, and tracked to completion

---

## 9. Suggested Build Order

Given hackathon time constraints, build in this sequence — the first three stages alone already form a complete, demoable product:

1. **Core marketplace + booking engine** (matching logic, state machine, auth, notifications)
2. **Real-time chat** (Socket.io, booking-scoped, persisted history)
3. **Worker ID card** (QR verification, downloadable badge)
4. **Crew / project mode** (largest scope addition — build last if time is short)

---

## 11. Application Workflow

This section maps out the end-to-end flow for each role and each major feature, so it can be implemented screen-by-screen and state-by-state.

### 11.1 Customer Workflow

```
1. Land on Home
   → sees hero + live category grid (pulled from ServiceCategory)

2. Choose a path:
   a) Browse a category → view worker list (filter by rating/price/availability)
   b) Type free-text request (e.g. "my fan isn't working")
      → LLM classifies text against current live category list
      → redirected to matching category's worker list

3. Select a worker OR choose "Auto-assign nearest available"
   → if auto-assign: matching engine ranks workers by
     skill match + proximity + rating → top worker suggested

4. Booking Flow
   → pick date/time → enter address → review → confirm
   → Booking created with status = "requested"
   → Notification sent to selected worker

5. Track booking in Customer Dashboard
   requested → accepted → in_progress → completed
   (each transition triggers a notification to the customer)

6. Once booking = "accepted", Chat unlocks
   → real-time coordination with worker via Socket.io (booking-scoped room)

7. On arrival, customer may scan worker's ID Card QR code
   → opens /verify/{workerId} → confirms live status, rating, cooperative affiliation

8. Once booking = "completed"
   → customer prompted to leave Rating & Review
   → Review saved → Worker.rating recalculated
   → Booking status = "rated" (final state)

--- For large jobs ---
9. Customer can instead submit a "Project Booking"
   → describes job (e.g. "renovate 2BHK") → submitted to Cooperative Admin
   → Admin assembles a crew → Project created (status = "planning")
   → Customer views Project Dashboard: crew list, task checklist, progress %
```

### 11.2 Worker Workflow

```
1. Sign up → select existing skill(s) from dropdown,
   OR submit a new skill (status = "pending_review")
   → Worker.status = "pending" until Cooperative Admin approves

2. Once approved by admin:
   → Worker.status = "active"
   → Worker unlocks: dashboard, ID Card download, booking eligibility

3. Worker Dashboard
   → Incoming requests appear in real time (new Booking, status="requested")
   → Worker can Accept or Reject
     - Accept → Booking.status = "accepted" → customer notified → chat unlocked
     - Reject → Booking re-enters matching pool for next-best worker

4. Job execution
   → Worker marks "Start Job" → Booking.status = "in_progress"
   → Worker marks "Complete Job" → Booking.status = "completed"
   → Customer notified to leave a review

5. Worker checks Earnings Summary (completed bookings, running totals)

6. Worker downloads/re-downloads ID Card anytime after approval
   → Card always reflects live status/rating via QR link

--- For crew/project work ---
7. If added to a Project's crew by an admin:
   → Project tasks appear filtered into the SAME worker dashboard
     ("my tasks across all projects I'm on")
   → Worker updates task status: pending → in_progress → done
```

### 11.3 Cooperative Admin Workflow

```
1. Admin logs into Cooperative Admin Panel

2. Worker Onboarding Queue
   → reviews new worker sign-ups (status = "pending")
   → approves → Worker.status = "active" (worker notified, ID card unlocked)
   → rejects → worker notified with reason

3. New Skill/Category Approval Queue
   → reviews any ServiceCategory with status = "pending_review"
   → approves → category goes live instantly on home page + LLM router
   → rejects → category discarded, worker notified

4. Society-Wide Booking Oversight
   → views all bookings tied to their cooperative's workers
   → can manually reassign a booking if a worker cancels/is unavailable

5. Project Assembly (for Project Bookings)
   → reviews incoming project requests from customers
   → assembles a crew: selects workers per trade, assigns one as "lead"
   → defines initial task checklist and target end date
   → Project.status = "planning" → moves to "in_progress" once work starts
   → monitors progress % as crew updates individual tasks
```

### 11.4 System-Level Flow: Booking State Machine

```
requested → accepted → in_progress → completed → rated
     │
     └──→ cancelled  (allowed from "requested" or "accepted" only)

Rules:
- Every transition is enforced server-side; no status can be skipped
- Each transition fires a notification (email + in-app) to the relevant party
- "rated" is a terminal state — booking becomes read-only in dashboards
```

### 11.5 System-Level Flow: Free-Text Request Routing (AI)

```
Customer text input
   → sent to LLM with the CURRENT live ServiceCategory list as context
   → LLM returns best-matching category (or "unclear — ask clarifying question")
   → if confident match → redirect to that category's worker list
   → if unclear → prompt customer to pick manually from the grid
```

### 11.6 System-Level Flow: Dynamic Skill Addition

```
Worker submits new skill during signup or from dashboard
   → ServiceCategory created with status = "pending_review", createdBy = workerId
   → Appears in Admin's approval queue
   → Admin approves
       → status = "approved"
       → category instantly visible on Home grid, filters, and LLM router
   → Admin rejects
       → worker notified, category discarded
```

### 11.7 System-Level Flow: Real-Time Chat

```
Booking.status becomes "accepted"
   → chat becomes available to both customer and worker
   → both clients emit "joinBooking" → join Socket.io room keyed by bookingId
   → sendMessage event → message saved to Messages collection → broadcast to room
   → reopening the booking later reloads full message history from DB
```

### 11.8 System-Level Flow: Worker ID Card & Verification

```
Worker approved by admin
   → unique workerId generated (e.g. "COOP-2026-00123")
   → QR code generated, encoding /verify/{workerId}
   → Card becomes downloadable (PDF/image) from worker dashboard

Anyone scans QR code
   → opens /verify/{workerId} (public page)
   → live lookup: Worker.status, Worker.rating, cooperativeSociety.name
   → displays real-time verification, not cached/static data
```

### 11.9 System-Level Flow: Project / Crew Mode

```
Customer submits Project Booking request
   → Admin reviews → builds crew (workers + trades + lead)
   → Project created: status = "planning"

Work begins
   → Project.status = "in_progress"
   → Admin/lead defines tasks, assigns to crew members by trade

Each crew member
   → sees assigned tasks in their existing Worker Dashboard
   → updates task status: pending → in_progress → done

Progress %
   → calculated as (tasks done / total tasks) × 100
   → shown on both customer's Project Dashboard and admin's oversight view

All tasks done
   → Project.status = "completed"
```

---

## 12. Open Items / Next Steps
- Finalize `CooperativeSociety`, `ServiceCategory`, and `Review` schemas
- Define auth/route structure (JWT vs. session-based)
- Decide on LLM provider/integration point for free-text category classification
- Confirm notification channel (email provider, in-app only, or both)
