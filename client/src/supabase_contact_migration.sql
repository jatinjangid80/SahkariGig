-- Create contact inquiries table
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert contact inquiries
CREATE POLICY "Allow public insert to contact_inquiries"
  ON public.contact_inquiries FOR INSERT
  WITH CHECK (true);

-- Only authenticated users (admins) can view inquiries (you can adjust this later)
CREATE POLICY "Allow authenticated users to read contact_inquiries"
  ON public.contact_inquiries FOR SELECT
  USING (auth.role() = 'authenticated');
