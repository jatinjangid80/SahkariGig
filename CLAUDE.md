# CLAUDE.md — Cooperative Gig Services Platform

## 1. Purpose

This is the master instruction file for Claude Code working on the Cooperative Gig Services Platform.

Claude Code MUST use this file together with:

```text
PRD.md
mvp.md
authentication.md
payment.md
```

These documents define the product requirements, authentication architecture, payment workflow, and phased MVP implementation plan.

The PRD defines the platform as a cooperative-backed marketplace connecting households with verified cooperative workers. fileciteturn0file0L9-L20

---

# 2. Core Rule: Follow the MVP Phases

Claude Code MUST build the website according to the phases in `mvp.md`.

Do NOT skip ahead to later phases unless the user explicitly asks for it.

The planned order is:

```text
Phase 0  → Foundation
Phase 1  → Authentication & Registration
Phase 2  → Marketplace & Service Categories
Phase 3  → Worker Onboarding & Admin Approval
Phase 4  → Booking Engine
Phase 5  → Matching Engine
Phase 6  → Real-Time Chat
Phase 7  → Worker Identity Card
Phase 8  → Payment
Phase 9  → Ratings & Reviews
Phase 10 → Notifications
Phase 11 → AI Free-Text Routing
Phase 12 → Dynamic Skills & Categories
Phase 13 → Project / Crew Mode
```

The PRD's suggested build order prioritizes the core marketplace/booking engine, then chat and worker ID, with project/crew mode last if time is limited. fileciteturn1file7L593-L599

---

# 3. Mandatory User Approval Before Every New Phase

Claude Code MUST ask the user for confirmation before starting a new phase.

Example:

```text
Phase 1 is complete.

The next phase is Phase 2 — Marketplace & Service Categories.

Do you want me to start Phase 2?
```

Claude Code MUST NOT automatically begin Phase 2 after finishing Phase 1.

This applies to EVERY phase:

```text
Phase 0 → ask before Phase 1
Phase 1 → ask before Phase 2
Phase 2 → ask before Phase 3
...
Phase 12 → ask before Phase 13
```

If the user says:

```text
yes
start
continue
go ahead
```

then Claude Code may begin the next phase.

If the user says no, stop and wait.

---

# 4. Model Rule — All Subagents MUST Use GLM-5.3

Every subagent created by Claude Code MUST use:

```text
GLM-5.3
```

Claude Code must NOT intentionally create subagents using another model.

This applies to:

- frontend subagents
- backend subagents
- database subagents
- UI/UX subagents
- testing subagents
- security subagents
- code review subagents
- documentation subagents
- debugging subagents

The main Claude Code agent may coordinate the work, but every delegated subagent must use GLM-5.3.

If the environment does not support selecting GLM-5.3 for a subagent, Claude Code must tell the user instead of silently substituting another model.

---

# 5. Token Conservation Is Mandatory

Claude Code MUST actively conserve tokens while building the website.

The project should use subagents strategically rather than repeatedly doing large amounts of work in the main context.

## Rules

### DO

- Use subagents for isolated implementation tasks.
- Give each subagent a narrow, well-defined task.
- Provide only the relevant files/context to each subagent.
- Ask subagents to inspect existing code before changing it.
- Ask subagents to make minimal changes.
- Reuse existing components.
- Reuse existing utilities.
- Avoid rewriting working code.
- Avoid reading entire large files when only a section is needed.
- Use concise task instructions.
- Summarize subagent results before continuing.
- Run focused tests instead of unnecessary full test suites.
- Keep a small phase progress checklist.

### DON'T

- Give every subagent the entire repository unnecessarily.
- Ask multiple subagents to solve the same problem.
- Rebuild existing functionality.
- Generate unnecessary documentation.
- Re-read unchanged large files repeatedly.
- Run broad searches when a targeted search is enough.
- Create subagents for trivial one-line changes.
- Ask subagents to explain code extensively when a concise result is enough.

---

# 6. Subagent Strategy

Claude Code should delegate work when the task can be isolated.

Recommended pattern:

```text
Main Claude Code
       │
       ├── GLM-5.3 Frontend Agent
       │
       ├── GLM-5.3 Backend Agent
       │
       ├── GLM-5.3 Database Agent
       │
       └── GLM-5.3 Testing Agent
```

Do NOT automatically create all four agents for every task.

Only create the agents required for the current phase.

For example:

```text
Authentication Phase

Main Agent
   │
   ├── GLM-5.3 Firebase Auth Agent
   ├── GLM-5.3 Backend Auth Agent
   └── GLM-5.3 Auth Testing Agent
```

For a small UI correction, use one subagent or do the change directly rather than creating several agents.

---

# 7. Subagent Task Format

Every subagent task should be concise and contain:

```text
ROLE
TASK
FILES/SCOPE
CONSTRAINTS
EXPECTED RESULT
```

Example:

```text
ROLE:
Frontend authentication agent.

TASK:
Implement the Firebase login page.

FILES/SCOPE:
Only frontend authentication files.

CONSTRAINTS:
Follow authentication.md.
Do not modify payment or booking code.
Reuse existing UI components.

EXPECTED RESULT:
Working login form with Firebase Email/Password authentication.
Return a concise summary and changed files.
```

---

# 8. No Unnecessary Parallel Work

Parallelize only independent work.

Good:

```text
Frontend login UI
        +
Firebase backend token verification
```

when neither depends on the other's unfinished code.

Bad:

```text
Agent A modifies Login.jsx
Agent B also modifies Login.jsx
```

Avoid multiple agents editing the same files simultaneously unless explicitly coordinated.

---

# 9. Phase Execution Protocol

Before starting any phase, Claude Code should:

### Step 1 — Check previous phase

Confirm:

```text
Previous phase complete?
Tests passing?
No known blocking errors?
```

### Step 2 — Read only relevant documentation

For example:

```text
Phase 1:
authentication.md
PRD.md relevant sections
mvp.md Phase 1
```

Do not repeatedly load every document in full if unnecessary.

### Step 3 — Inspect existing implementation

Determine:

```text
What already exists?
What is missing?
What can be reused?
```

### Step 4 — Plan small tasks

Split the phase into minimal independent tasks.

### Step 5 — Delegate where useful

Use GLM-5.3 subagents for meaningful isolated work.

### Step 6 — Integrate

Main Claude Code reviews and integrates subagent changes.

### Step 7 — Test

Run focused tests relevant to the phase.

### Step 8 — Report

Give the user a concise summary:

```text
Phase X complete.

Implemented:
- ...
- ...
- ...

Tests:
- ...

Known issues:
- ...

Next:
Phase X+1 requires your approval.
```

### Step 9 — STOP

Do not start the next phase until the user approves it.

---

# 10. Phase 0 — Foundation

Follow `mvp.md`.

Goal:

```text
React + Vite
Express + Node.js
MongoDB Atlas
Firebase
Tailwind
Environment configuration
Basic routing
```

Expected result:

```text
Frontend runs
Backend runs
Database connects
Firebase connects
Frontend ↔ Backend works
```

Do not implement advanced marketplace functionality during Phase 0.

---

# 11. Phase 1 — Authentication & Registration

Follow `authentication.md`.

Implement:

```text
Customer
Worker
Cooperative Admin
```

Authentication:

```text
Firebase Authentication
       ↓
Firebase UID
       ↓
MongoDB application profile
```

Implement:

- registration
- login
- logout
- Firebase token verification
- role-based access
- protected routes
- Worker pending state
- secure Admin access

Do not build payment functionality during this phase.

---

# 12. Phase 2 — Marketplace

Implement:

- ServiceCategory
- category list
- worker list
- worker profiles
- filtering
- availability display
- service browsing

Categories should come from the database rather than being permanently hardcoded in the frontend.

---

# 13. Phase 3 — Worker Approval

Implement:

```text
Worker registration
      ↓
pending
      ↓
Admin review
      ↓
approved
      ↓
active
```

Only active workers should be available for normal booking.

---

# 14. Phase 4 — Booking

Implement the booking lifecycle:

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

State transitions MUST be enforced on the backend.

Do not trust the frontend to enforce booking states.

---

# 15. Phase 5 — Matching

Implement basic matching:

```text
Active worker
+
Required skill
+
Availability
+
Proximity
+
Rating
```

Start with a simple ranking system.

Do not over-engineer the matching algorithm during MVP.

---

# 16. Phase 6 — Real-Time Chat

Use Socket.io.

Chat should be scoped to an accepted booking:

```text
Booking ID
    ↓
Socket.io Room
    ↓
Customer ↔ Worker
```

Messages should persist in MongoDB.

Do not create public/global worker chat.

---

# 17. Phase 7 — Worker Identity Card

Implement:

- worker photo
- name
- trade
- cooperative
- Worker ID
- join date
- rating
- QR code

QR should lead to a live verification page.

The PRD requires the verification page to show current database information rather than relying on a static card. fileciteturn1file8L696-L703

---

# 18. Phase 8 — Payment

Follow `payment.md`.

Use the free UPI QR approach:

```text
Booking
 ↓
Payment
 ↓
UPI QR
 ↓
Customer pays
 ↓
I Have Paid
 ↓
CUSTOMER_CLAIMED_PAID
 ↓
Admin verifies
 ↓
PAID / REJECTED
```

Important:

```text
"I Have Paid" ≠ "PAID"
```

The customer must never be able to directly set a payment to `PAID`.

Automatic payment verification is NOT assumed in the free UPI implementation.

---

# 19. Phase 9 — Ratings & Reviews

After:

```text
Booking = completed
```

allow the customer to:

```text
Rate 1–5 stars
Optional comment
```

Then recalculate the worker rating.

Prevent duplicate reviews.

---

# 20. Phase 10 — Notifications

Implement essential notifications first:

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

Prefer a simple in-app notification system before building a complex notification infrastructure.

---

# 21. Phase 11 — AI Free-Text Routing

Implement the PRD's free-text service routing.

Example:

```text
"My fan isn't working"
        ↓
AI
        ↓
Electrician
        ↓
Available workers
```

The AI should use the current approved ServiceCategory list.

Do not hardcode a separate category list inside the AI prompt.

If confidence is low:

```text
Ask user to choose a category.
```

---

# 22. Phase 12 — Dynamic Skills & Categories

Implement:

```text
Worker submits new skill
        ↓
Admin review
        ↓
Approve
        ↓
ServiceCategory becomes available
```

Approved categories should automatically become available to:

- marketplace
- filters
- worker skills
- AI routing

---

# 23. Phase 13 — Project / Crew Mode

Only start this phase after the previous phases are stable.

Implement:

```text
Project
 ↓
Admin review
 ↓
Crew creation
 ↓
Trade assignment
 ↓
Task assignment
 ↓
Progress tracking
 ↓
Project completion
```

Do not build a full Gantt chart for MVP.

The PRD treats full Gantt/project management as outside the MVP scope. fileciteturn0file0L128-L132

---

# 24. Scope Discipline

Claude Code must follow the MVP scope.

If a requested feature belongs to a later phase:

```text
Do not implement it early
```

unless the user explicitly requests a phase change.

If implementing the feature early would create architectural problems, explain the impact briefly before proceeding.

---

# 25. Existing Code Protection

Before modifying an existing feature:

1. Inspect the current implementation.
2. Determine dependencies.
3. Reuse existing components/functions.
4. Make the smallest safe change.
5. Test the affected feature.

Do not replace working architecture merely because another implementation looks cleaner.

---

# 26. Database Rules

MongoDB is the application data source.

Firebase Authentication is the identity provider.

Use:

```text
Firebase
→ identity/authentication

MongoDB
→ application profiles/data
```

Connect records using:

```text
firebaseUid
```

Never expose MongoDB credentials to the browser.

---

# 27. API Security

Every protected API should:

```text
Receive Firebase ID Token
        ↓
Verify token
        ↓
Identify Firebase UID
        ↓
Load application profile
        ↓
Check role
        ↓
Check resource ownership
        ↓
Execute operation
```

Never trust:

```text
userId
role
customerId
workerId
cooperativeId
payment status
booking owner
```

when supplied by the client.

---

# 28. Payment Security

Follow `payment.md`.

The backend must obtain the payment amount from trusted booking data.

Never trust:

```js
req.body.amount
```

as the final payment amount.

Customer:

```text
PENDING → CUSTOMER_CLAIMED_PAID
```

Admin:

```text
CUSTOMER_CLAIMED_PAID → PAID
```

or:

```text
CUSTOMER_CLAIMED_PAID → REJECTED
```

---

# 29. Testing Strategy

Each phase must have focused tests.

Do not wait until the end of the entire project.

Recommended:

```text
Phase 0 → startup/database/config test
Phase 1 → registration/login/role tests
Phase 2 → category/worker browsing tests
Phase 3 → worker approval tests
Phase 4 → booking state tests
Phase 5 → matching tests
Phase 6 → chat tests
Phase 7 → verification QR tests
Phase 8 → payment state tests
Phase 9 → review/rating tests
Phase 10 → notification tests
Phase 11 → AI routing tests
Phase 12 → skill/category tests
Phase 13 → project/crew tests
```

---

# 30. Definition of Done for Every Phase

A phase is considered complete only when:

```text
Implementation complete
        +
Relevant tests pass
        +
No known critical errors
        +
Existing functionality still works
        +
Documentation requirements satisfied
```

Then report completion and STOP.

---

# 31. Token-Efficient Development Checklist

Before doing work, Claude Code should ask internally:

```text
Can this be solved by inspecting only 1–3 files?
Can I reuse an existing component?
Can one subagent complete this?
Is a subagent even necessary?
Can I run a focused test?
Am I about to repeat context unnecessarily?
```

Prefer:

```text
Small context
+
Small task
+
One useful subagent
+
Focused test
```

over:

```text
Entire repository
+
Many agents
+
Repeated explanations
+
Large output
```

---

# 32. User Communication Style

Keep progress updates concise.

Use:

```text
Phase 4 — Booking Engine

Status: 70%

Completed:
✓ Booking model
✓ Create booking API
✓ Customer booking page

Remaining:
□ Worker accept/reject
□ State transition tests

I will continue Phase 4.
```

At phase completion:

```text
Phase 4 — COMPLETE ✓

Implemented:
- ...
- ...
- ...

Tests:
- ...

Next phase: Phase 5 — Matching Engine.

Do you want me to start Phase 5?
```

Then wait.

---

# 33. Master Rule

The most important rules in this file are:

```text
1. Follow PRD.md.
2. Follow mvp.md.
3. Follow authentication.md for authentication.
4. Follow payment.md for payments.
5. Build phases in order.
6. ASK USER before starting every new phase.
7. Every subagent MUST use GLM-5.3.
8. Conserve tokens aggressively.
9. Use subagents selectively and with narrow scopes.
10. Do not skip security.
11. Do not trust client-side roles/status/amounts.
12. Test each phase before declaring it complete.
13. Never automatically start the next phase.
```

## Final Development Loop

```text
READ REQUIREMENTS
       ↓
CHECK CURRENT CODE
       ↓
PLAN SMALL TASKS
       ↓
USE GLM-5.3 SUBAGENTS WHEN USEFUL
       ↓
IMPLEMENT
       ↓
TEST
       ↓
REVIEW
       ↓
REPORT PHASE COMPLETE
       ↓
ASK USER FOR NEXT PHASE
       ↓
WAIT
```
