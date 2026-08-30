DROP POLICY IF EXISTS "Public Read/Write Bookings" ON public.bookings;
CREATE POLICY "Public Read/Write Bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);
