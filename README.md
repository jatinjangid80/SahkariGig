# CoopGig (SahkariGig) 🚀

**Problem Statement ID:** SIH26089 (Ministry of Cooperation - Smart Automation)
**Designed and Deployed by:** Jatin Jangid

CoopGig is a unified digital platform that connects cooperative-affiliated tradespeople (electricians, plumbers, carpenters, etc.) with households and community customers. It eliminates middlemen, ensures transparent pricing, and guarantees worker verification.

## ✨ Key Features
- **Smart AI Matching:** Instantly routes user requests (e.g., "fan is sparking") to the correct professional category.
- **Trust-First Identity:** Digital Worker IDs backed by Cooperative Federations.
- **Transparent Booking:** Live availability, clear estimated rates, and secure booking flows.
- **Democratic Ownership:** Workers keep their earnings without gig-economy exploitation.
- **Modern UI/UX:** Built with a premium, responsive, and accessible interface.

## 🛠️ Tech Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite, Lucide Icons
- **Backend & Auth:** Node.js, Express, Supabase (PostgreSQL, Row Level Security, Google OAuth)
- **Deployment:** Vercel

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/jatinjangid80/SahkariGig.git
cd SahkariGig
```

### 2. Install dependencies
```bash
npm install
npm --prefix client install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Run Locally
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

## 🗄️ Database Setup
Run the SQL script provided in `supabase_schema.sql` inside your Supabase SQL Editor to set up the tables and policies.
