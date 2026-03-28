
-- Add CRM management columns to leads table
ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS lead_status text NOT NULL DEFAULT 'novo',
  ADD COLUMN IF NOT EXISTS service_value numeric DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pendente',
  ADD COLUMN IF NOT EXISTS site_status text NOT NULL DEFAULT 'nao_criado',
  ADD COLUMN IF NOT EXISTS last_interaction timestamp with time zone DEFAULT now(),
  ADD COLUMN IF NOT EXISTS notes text DEFAULT NULL;
