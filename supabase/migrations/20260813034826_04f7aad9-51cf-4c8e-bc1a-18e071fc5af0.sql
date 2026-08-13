CREATE TABLE public.countries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  flag text NOT NULL DEFAULT '',
  enabled boolean NOT NULL DEFAULT true,
  visa_types text[] NOT NULL DEFAULT '{}',
  fee numeric NOT NULL DEFAULT 0,
  processing_days text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.countries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.countries TO authenticated;
GRANT ALL ON public.countries TO service_role;

ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view enabled countries" ON public.countries
FOR SELECT TO anon, authenticated USING (enabled = true);

CREATE POLICY "Staff and admins view all countries" ON public.countries
FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

CREATE POLICY "Admins insert countries" ON public.countries
FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update countries" ON public.countries
FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete countries" ON public.countries
FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER countries_set_updated_at BEFORE UPDATE ON public.countries
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.countries (name, flag, enabled, visa_types, fee, processing_days, sort_order) VALUES
('Italy','🇮🇹',true,ARRAY['Study','Work','Family','Tourist','Business','Residence'],1200,'30–60',1),
('Portugal','🇵🇹',true,ARRAY['Study','Work','Golden Visa','Tourist','Residence'],1500,'45–75',2),
('Greece','🇬🇷',true,ARRAY['Study','Tourist','Residence','Golden Visa'],1100,'30–45',3),
('Spain','🇪🇸',true,ARRAY['Study','Work','Family','Tourist','Business','Residence'],1300,'30–60',4),
('France','🇫🇷',false,ARRAY['Tourist'],900,'—',5);