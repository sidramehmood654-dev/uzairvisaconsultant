CREATE TABLE public.visa_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  full_name TEXT NOT NULL,
  passport_number TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  visa_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  travel_date DATE,
  duration TEXT,
  dob DATE,
  nationality TEXT,
  address TEXT,
  occupation TEXT,
  employer TEXT,
  purpose TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.visa_applications TO authenticated;
GRANT ALL ON public.visa_applications TO service_role;
ALTER TABLE public.visa_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own applications" ON public.visa_applications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own applications" ON public.visa_applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own applications" ON public.visa_applications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own applications" ON public.visa_applications FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.visa_applications(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own payments" ON public.payments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER trg_visa_app_updated BEFORE UPDATE ON public.visa_applications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();