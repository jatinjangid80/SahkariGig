# Authentication Module — Cooperative Gig Services Platform

## 1. Purpose

This document defines the authentication and registration system for the Cooperative Gig Services Platform using **Firebase Authentication**.

The existing PRD requires three distinct user roles:

- Customer
- Worker
- Cooperative Admin

It also requires proper role-based access control. Authentication must therefore handle both account registration/login and role-based authorization. fileciteturn0file0L36-L40 fileciteturn0file0L54-L61

This module is separate from `payment.md`.

---

# 2. Authentication Goals

The authentication system should:

- Allow users to register.
- Allow users to log in and log out.
- Use Firebase Authentication for identity management.
- Support Customer, Worker, and Cooperative Admin roles.
- Protect role-specific pages and APIs.
- Store user profile/application information in the existing MongoDB backend.
- Prevent users from selecting privileged roles such as Cooperative Admin without authorization.
- Keep Firebase credentials/configuration separate from backend secrets.
- Connect the authenticated Firebase user to the application's MongoDB user/worker records.

---

# 3. Recommended Architecture

```text
                    FRONTEND
                 React + Vite
                       │
                       ▼
             Firebase Authentication
                       │
              ┌────────┴────────┐
              │                 │
           Register            Login
              │                 │
              └────────┬────────┘
                       ▼
                Firebase User
                       │
                  ID Token
                       │
                       ▼
                Express Backend
                       │
              Verify Firebase Token
                       │
                       ▼
                    MongoDB
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       Customer      Worker     Cooperative
                                  Admin
```

The PRD's existing stack is React + Vite, Express/Node.js, MongoDB Atlas/Mongoose, and role-based authentication. fileciteturn0file0L193-L205

---

# 4. Firebase Authentication Setup

Create/open a Firebase project in Firebase Studio / Firebase Console.

Enable:

```text
Authentication
    ↓
Sign-in method
    ↓
Email/Password
```

The initial registration system should use:

```text
Email
Password
```

Additional providers such as Google or phone authentication can be added later if required.

---

# 5. Registration Roles

The registration UI should provide:

```text
Create Account

Name
Email
Phone
Password
Confirm Password

Register as:

○ Customer
○ Worker
```

Do **not** allow a normal public registration form to create:

```text
Cooperative Admin
```

Cooperative Admin accounts should be created/approved through a controlled administrative process.

For Worker registration, the PRD requires the worker to provide/select skills and remain pending until Cooperative Admin approval. fileciteturn0file0L300-L306

---

# 6. Customer Registration

Customer registration flow:

```text
Customer
   ↓
Enter name
   ↓
Enter email
   ↓
Enter phone
   ↓
Enter password
   ↓
Firebase creates account
   ↓
Create Customer profile in MongoDB
   ↓
Role = customer
   ↓
Customer Dashboard
```

Customer profile can contain:

```js
{
  firebaseUid: String,
  name: String,
  email: String,
  phone: String,
  role: "customer",
  createdAt: Date
}
```

---

# 7. Worker Registration

Worker registration flow:

```text
Worker
   ↓
Enter personal information
   ↓
Enter email/password
   ↓
Select existing skill(s)
OR
Submit a new skill
   ↓
Firebase creates authentication account
   ↓
Create Worker record in MongoDB
   ↓
status = pending
   ↓
Cooperative Admin reviews
   ↓
Approve
   ↓
status = active
```

The PRD specifically states that workers can select existing skills or submit a new skill, and that a worker remains `pending` until Cooperative Admin approval. fileciteturn0file0L70-L81 fileciteturn0file0L300-L306

Worker data should follow the existing PRD model:

```js
{
  firebaseUid: String,

  name: String,

  email: String,

  phone: String,

  skills: [String],

  cooperativeSociety: ObjectId,

  workerId: String,

  rating: 0,

  ratingCount: 0,

  status: "pending",

  profilePhoto: String
}
```

The existing Worker model includes `name`, `email`, `phone`, `skills`, cooperative affiliation, unique worker ID, rating, status, and profile photo. fileciteturn0file0L125-L140

---

# 8. Cooperative Admin

Cooperative Admin must not be created through unrestricted public registration.

Recommended flow:

```text
Admin account created securely
        ↓
Firebase Authentication account
        ↓
Role = cooperative_admin
        ↓
Admin Dashboard
```

Only an authorized administrator/system process should assign this role.

The admin is responsible for:

- Approving workers
- Rejecting workers
- Managing workers
- Approving new skills/categories
- Viewing cooperative bookings
- Reassigning bookings
- Managing project crews
- Verifying payments

The PRD defines these responsibilities for the Cooperative Admin role. fileciteturn0file0L300-L345

---

# 9. Firebase User vs MongoDB User

Use Firebase for:

```text
Authentication
- Email
- Password
- UID
- Login session
- Token
```

Use MongoDB for:

```text
Application profile
- Name
- Phone
- Role
- Worker information
- Cooperative
- Worker status
- Rating
- Skills
```

The Firebase UID should connect the two:

```text
Firebase UID
      │
      ▼
MongoDB firebaseUid
```

This prevents application data from being mixed into Firebase Authentication.

---

# 10. Frontend Firebase Configuration

Create:

```text
frontend/src/firebase.js
```

Example:

```js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
```

Frontend environment variables:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Firebase web configuration values are not equivalent to private server secrets. Never place MongoDB credentials, JWT secrets, service-account private keys, or other backend secrets in Vite environment variables exposed to the browser.

---

# 11. Registration Code

Install Firebase:

```bash
npm install firebase
```

Example registration function:

```js
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";

import { auth } from "./firebase";

export async function registerUser(
  name,
  email,
  password
) {
  const result =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  await updateProfile(
    result.user,
    {
      displayName: name
    }
  );

  return result.user;
}
```

After Firebase registration succeeds, send the Firebase UID and profile information to the Express backend.

---

# 12. Login

Use Firebase Authentication for login:

```js
import {
  signInWithEmailAndPassword
} from "firebase/auth";

import { auth } from "./firebase";

export async function loginUser(
  email,
  password
) {
  const result =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  return result.user;
}
```

After login:

```text
Firebase Login
      ↓
Firebase User
      ↓
Get ID Token
      ↓
Send token to Express
      ↓
Express verifies token
      ↓
Load MongoDB profile
      ↓
Determine role
      ↓
Redirect to dashboard
```

---

# 13. Sending Firebase Token to Backend

Frontend:

```js
const token =
  await auth.currentUser.getIdToken();

const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/auth/me`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
```

Do not send a plain `userId` from the browser and trust it as authentication.

The backend must verify the Firebase ID token.

---

# 14. Firebase Admin SDK

The Express backend should use the Firebase Admin SDK to verify Firebase ID tokens.

Install:

```bash
npm install firebase-admin
```

Create:

```text
backend/config/firebaseAdmin.js
```

Example:

```js
const admin = require("firebase-admin");

admin.initializeApp({
  credential:
    admin.credential.applicationDefault()
});

module.exports = admin;
```

Use the appropriate secure service-account/application-default configuration for your deployment environment.

Never commit the Firebase service-account private key to GitHub.

---

# 15. Authentication Middleware

Create:

```text
backend/middleware/auth.js
```

Example:

```js
const admin = require("../config/firebaseAdmin");

async function authenticate(req, res, next) {
  try {
    const header =
      req.headers.authorization || "";

    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const token =
      header.substring(7);

    const decodedToken =
      await admin
        .auth()
        .verifyIdToken(token);

    req.firebaseUser = decodedToken;

    next();

  } catch (error) {

    console.error(error);

    return res.status(401).json({
      message: "Invalid or expired authentication token"
    });
  }
}

module.exports = authenticate;
```

---

# 16. Role Middleware

Create:

```text
backend/middleware/roles.js
```

```js
function requireRole(...allowedRoles) {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    next();
  };
}

module.exports = {
  requireRole
};
```

The role should come from trusted server-side application data, not directly from an untrusted request body.

---

# 17. Create/Sync MongoDB User

After Firebase registration, create the corresponding application record.

Example:

```js
const user = await User.create({
  firebaseUid: firebaseUser.uid,
  name,
  email: firebaseUser.email,
  phone,
  role: "customer"
});
```

For a worker:

```js
const worker = await Worker.create({
  firebaseUid: firebaseUser.uid,
  name,
  email: firebaseUser.email,
  phone,
  skills,
  status: "pending"
});
```

The worker remains unavailable for normal job fulfillment until approved.

---

# 18. Worker Approval

Admin workflow:

```text
Worker registers
       ↓
Firebase account created
       ↓
MongoDB Worker.status = pending
       ↓
Admin sees Worker Onboarding Queue
       ↓
Admin approves
       ↓
Worker.status = active
       ↓
Worker dashboard/booking eligibility unlocked
```

The PRD explicitly defines this pending → active workflow. fileciteturn0file0L300-L317

---

# 19. Protected Frontend Routes

Example:

```jsx
<Route
  path="/customer"
  element={
    <ProtectedRoute role="customer">
      <CustomerDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/worker"
  element={
    <ProtectedRoute role="worker">
      <WorkerDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin"
  element={
    <ProtectedRoute role="cooperative_admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

Frontend protection improves user experience, but it is not sufficient for security.

Every sensitive Express API must also verify authentication and authorization.

---

# 20. Role Permissions

## Customer

Can:

- Browse services
- View workers
- Create bookings
- View own bookings
- Chat for accepted bookings
- Make payments
- Submit reviews
- View own project information

## Worker

Can:

- Manage own profile
- Manage own skills
- Receive bookings
- Accept/reject bookings
- Start/complete jobs
- Chat on accepted bookings
- View own earnings
- Manage assigned project tasks
- Download worker ID card after approval

## Cooperative Admin

Can:

- Manage workers in their cooperative
- Approve/reject workers
- Approve/reject new skills
- View cooperative bookings
- Reassign bookings
- Assemble project crews
- Manage project tasks
- Verify payments

The PRD defines these three role workflows and responsibilities. fileciteturn0file0L267-L345

---

# 21. Logout

Use Firebase:

```js
import { signOut } from "firebase/auth";

import { auth } from "./firebase";

export async function logoutUser() {
  await signOut(auth);
}
```

After logout:

```text
Firebase session ends
       ↓
Clear application state
       ↓
Redirect to /login
```

---

# 22. Authentication State

Create a global authentication state using React Context or another state-management approach.

The application should track:

```js
{
  firebaseUser,
  profile,
  role,
  loading,
  authenticated
}
```

Example:

```text
loading
   ↓
Firebase checks session
   ↓
authenticated?
   ├── No → Login
   │
   └── Yes
         ↓
      Load MongoDB profile
         ↓
      Check role
         ↓
      Dashboard
```

---

# 23. Error Handling

Registration should handle:

- Email already in use
- Invalid email
- Weak password
- Missing required fields
- Password mismatch
- Network errors
- Firebase errors

Login should handle:

- Invalid credentials
- Disabled account
- Network errors
- Expired session

Worker registration should additionally handle:

- Invalid skill
- Pending skill submission
- Missing cooperative information

---

# 24. Security Rules

Never allow a client to submit:

```json
{
  "role": "cooperative_admin"
}
```

and automatically become an admin.

Never trust:

```text
role
userId
firebaseUid
workerId
cooperativeSociety
```

from the browser for authorization decisions.

The backend should derive identity from the verified Firebase token and load trusted role/cooperative information from MongoDB.

Sensitive backend credentials must remain in environment variables/secret management.

The PRD requires role-based access control, hashed/password security where applicable, and environment-based secrets management. fileciteturn0file0L216-L219

---

# 25. Registration Pages

Create:

```text
/register
/login
```

Registration page:

```text
┌───────────────────────────────────┐
│       Create Your Account         │
│                                   │
│ Name                              │
│ [________________________]        │
│                                   │
│ Email                             │
│ [________________________]        │
│                                   │
│ Phone                             │
│ [________________________]        │
│                                   │
│ Password                          │
│ [________________________]        │
│                                   │
│ Confirm Password                  │
│ [________________________]        │
│                                   │
│ Register as                       │
│                                   │
│ ( ) Customer                      │
│ ( ) Worker                        │
│                                   │
│ [ Create Account ]                │
│                                   │
│ Already have an account? Login    │
└───────────────────────────────────┘
```

If Worker is selected, display additional worker fields:

```text
Skills
Cooperative Society
Profile Photo
```

New skills should follow the PRD's approval process rather than immediately becoming active categories. fileciteturn0file0L70-L81

---

# 26. Integration With Existing Booking System

Authentication must be completed before users can access protected booking operations.

```text
Customer Login
      ↓
Customer Dashboard
      ↓
Create Booking
      ↓
Booking.customer = authenticated MongoDB user
```

Worker:

```text
Worker Login
      ↓
Worker Dashboard
      ↓
Booking.worker = authenticated Worker
```

Admin:

```text
Admin Login
      ↓
Admin Dashboard
      ↓
Access cooperative-scoped administration
```

The PRD requires booking ownership, worker assignment, and cooperative-admin oversight. fileciteturn0file0L42-L61

---

# 27. Integration With Payment

Authentication must also protect the payment system described in `payment.md`.

Customer:

```text
Authenticated Customer
       ↓
Own Booking
       ↓
Create Payment
       ↓
UPI QR
```

The backend must verify that the authenticated customer actually owns the booking before creating its payment.

Admin:

```text
Authenticated Cooperative Admin
       ↓
Payment Verification
       ↓
PAID / REJECTED
```

A customer must never be allowed to change a payment directly to:

```text
PAID
```

---

# 28. Recommended API Structure

```text
/api/auth/me
/api/auth/profile

/api/customers/...
/api/workers/...
/api/admin/...

/api/bookings/...
/api/payments/...
```

Every protected endpoint should use:

```js
authenticate
```

and role-specific endpoints should additionally use:

```js
requireRole(...)
```

Example:

```js
router.get(
  "/admin/payments",
  authenticate,
  requireRole("cooperative_admin"),
  getPayments
);
```

---

# 29. Firebase Studio Implementation Instructions

When implementing this module in Firebase Studio:

1. Configure Firebase Authentication.
2. Enable Email/Password authentication.
3. Create Login and Registration pages.
4. Create Customer and Worker registration flows.
5. Do not expose unrestricted Cooperative Admin registration.
6. Add Firebase Authentication to the React application.
7. Send Firebase ID tokens to Express.
8. Verify tokens on the Express backend using Firebase Admin SDK.
9. Sync Firebase users with MongoDB application records.
10. Implement role-based protected routes.
11. Keep Worker status as `pending` until Cooperative Admin approval.
12. Integrate authentication with existing Booking and Payment APIs.
13. Do not replace MongoDB application data with Firebase Authentication user data.
14. Keep backend secrets out of the frontend.

---

# 30. Final Authentication Flow

```text
                         USER
                          │
                          ▼
                  Registration/Login
                          │
                          ▼
              Firebase Authentication
                          │
                          ▼
                   Firebase UID
                          │
                          ▼
                   Firebase ID Token
                          │
                          ▼
                  Express Backend
                          │
                  Verify ID Token
                          │
                          ▼
                       MongoDB
                          │
            ┌─────────────┼─────────────┐
            ▼             ▼             ▼
        Customer        Worker      Cooperative
                                      Admin
            │             │             │
            ▼             ▼             ▼
       Customer       Pending       Admin
       Dashboard      Approval      Dashboard
                          │
                          ▼
                    Admin Approval
                          │
                          ▼
                    Worker Active
```

---

# 31. Definition of Done

Authentication is complete when:

- [ ] Firebase Authentication is configured.
- [ ] Customer registration works.
- [ ] Worker registration works.
- [ ] Customer login works.
- [ ] Worker login works.
- [ ] Logout works.
- [ ] Firebase UID is stored against the application profile.
- [ ] MongoDB profile is created after registration.
- [ ] Worker status starts as `pending`.
- [ ] Admin approval changes Worker status to `active`.
- [ ] Cooperative Admin access is restricted.
- [ ] Protected frontend routes work.
- [ ] Protected Express APIs verify Firebase ID tokens.
- [ ] Role authorization works server-side.
- [ ] Users can access only their permitted resources.
- [ ] Authentication works with the existing booking system.
- [ ] Authentication works with the payment system.
- [ ] No backend secrets are exposed in the frontend.
