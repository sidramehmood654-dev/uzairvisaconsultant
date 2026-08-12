CREATE TABLE public.contact_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text,
  visa_type text,
  message text,
  status text NOT NULL DEFAULT 'new',
  staff_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.contact_enquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_enquiries TO authenticated;
GRANT ALL ON public.contact_enquiries TO service_role;

ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an enquiry"
ON public.contact_enquiries FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Staff and admins view enquiries"
ON public.contact_enquiries FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

CREATE POLICY "Staff and admins update enquiries"
ON public.contact_enquiries FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

CREATE POLICY "Admins delete enquiries"
ON public.contact_enquiries FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER contact_enquiries_set_updated_at
BEFORE UPDATE ON public.contact_enquiries
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();