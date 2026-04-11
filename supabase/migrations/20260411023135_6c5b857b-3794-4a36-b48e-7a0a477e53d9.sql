ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS google_rating numeric DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS google_reviews_count integer DEFAULT NULL;