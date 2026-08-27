-- =======================================================
-- CoopGig — Supabase PostgreSQL Schema Setup (SIH26089)
-- Run this SQL in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/gjriuaexwaklsyctffli/sql
-- =======================================================

-- 1. Create Cooperatives Table
CREATE TABLE IF NOT EXISTS public.cooperatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    registration_number TEXT NOT NULL UNIQUE,
    state TEXT NOT NULL DEFAULT 'Delhi',
    status TEXT NOT NULL DEFAULT 'APPROVED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create Workers Table
CREATE TABLE IF NOT EXISTS public.workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    trade TEXT NOT NULL,
    coop_name TEXT NOT NULL DEFAULT 'Delhi Labour Cooperative Federation',
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.80,
    reviews_count INT NOT NULL DEFAULT 12,
    hourly_rate TEXT NOT NULL DEFAULT '₹400–₹700 / visit',
    distance_km NUMERIC(4, 2) NOT NULL DEFAULT 2.00,
    is_available_today BOOLEAN NOT NULL DEFAULT TRUE,
    is_top_rated BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    avatar TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code TEXT NOT NULL UNIQUE,
    service TEXT NOT NULL,
    worker_name TEXT NOT NULL,
    worker_trade TEXT NOT NULL,
    worker_id TEXT NOT NULL,
    customer_name TEXT NOT NULL DEFAULT 'Ananya Sharma',
    address TEXT NOT NULL,
    booking_date TEXT NOT NULL,
    booking_time TEXT NOT NULL,
    amount TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'REQUESTED', -- REQUESTED, ACCEPTED, IN_PROGRESS, COMPLETED
    payment_status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, CUSTOMER_CLAIMED_PAID, PAID
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create Contact Inquiries Table
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Customer',
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Create Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id TEXT NOT NULL,
    worker_id TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Policies for Public Access
ALTER TABLE public.cooperatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Cooperatives" ON public.cooperatives FOR SELECT USING (true);
CREATE POLICY "Public Read Workers" ON public.workers FOR SELECT USING (true);
CREATE POLICY "Public Read/Write Bookings" ON public.bookings FOR ALL USING (true);
CREATE POLICY "Public Write Contact" ON public.contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read/Write Reviews" ON public.reviews FOR ALL USING (true);

-- Insert Initial Seed Data for Labour Cooperative & Workers
INSERT INTO public.cooperatives (name, registration_number, state, status)
VALUES 
    ('Delhi Labour Cooperative Federation', 'COOP/DEL/2021/8892', 'Delhi', 'APPROVED'),
    ('JanSeva Plumbing Society', 'COOP/DEL/2022/4102', 'Delhi', 'APPROVED'),
    ('Northern Crafts Cooperative Federation', 'COOP/DEL/2020/1903', 'Delhi', 'APPROVED')
ON CONFLICT (registration_number) DO NOTHING;

INSERT INTO public.workers (worker_id, name, trade, coop_name, rating, reviews_count, hourly_rate, distance_km, is_available_today, is_top_rated, avatar)
VALUES
    ('WORKER-DEL-8901', 'Rajesh Kumar', 'Electrician', 'Delhi Labour Cooperative Federation', 4.90, 128, '₹400–₹700 / visit', 1.80, true, true, 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80'),
    ('WORKER-DEL-7652', 'Suresh Sharma', 'Plumber', 'JanSeva Plumbing Society', 4.80, 94, '₹350–₹650 / visit', 2.40, true, true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
    ('WORKER-DEL-4390', 'Vikram Singh', 'Carpenter', 'Northern Crafts Cooperative Federation', 4.70, 82, '₹500–₹900 / visit', 3.50, false, false, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80')
ON CONFLICT (worker_id) DO NOTHING;
