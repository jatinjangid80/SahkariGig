-- =======================================================
-- CoopGig — Realtime Persistent Messaging Schema Migration
-- Run this SQL in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/gjriuaexwaklsyctffli/sql
-- =======================================================

-- 1. Create Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id TEXT, -- Booking ID reference
    customer_id TEXT NOT NULL,
    worker_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    message TEXT NOT NULL, -- AES encrypted text
    message_type TEXT NOT NULL DEFAULT 'text',
    attachment_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_at TIMESTAMPTZ
);

-- 3. Create User Presence Table
CREATE TABLE IF NOT EXISTS public.user_presence (
    user_id TEXT PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'offline',
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies
-- Allow access to all authenticated users and demo fallbacks
CREATE POLICY "Allow all access to conversations" ON public.conversations FOR ALL USING (true);
CREATE POLICY "Allow all access to messages" ON public.messages FOR ALL USING (true);
CREATE POLICY "Allow all access to presence" ON public.user_presence FOR ALL USING (true);

-- 6. Add Tables to Supabase Realtime Publication
-- Enables realtime replication triggers for insert/update events
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.user_presence;
