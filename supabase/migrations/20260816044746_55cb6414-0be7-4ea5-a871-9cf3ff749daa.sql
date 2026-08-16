ALTER TABLE public.countries
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS capital text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS summary text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS highlights text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS image_key text NOT NULL DEFAULT '';

UPDATE public.countries SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')) WHERE slug IS NULL OR slug = '';
CREATE UNIQUE INDEX IF NOT EXISTS countries_slug_key ON public.countries (slug);

UPDATE public.countries SET capital='Rome', image_key='italy',
  summary='Study in world-renowned universities, work in fashion & design, or reunite with family in the heart of Europe.',
  description='Italy offers world-class education, rich cultural heritage, and excellent career opportunities. From the fashion capital of Milan to the historic streets of Rome, Italy is a dream destination for students, workers, and families alike.',
  highlights=ARRAY['Top-ranked universities (Bologna, Sapienza, Politecnico)','Affordable tuition for international students','Post-study work permit options','Family reunification within 6-12 months','Rich cultural & lifestyle experience']
WHERE lower(name)='italy';

UPDATE public.countries SET capital='Lisbon', image_key='portugal',
  summary='Enjoy affordable living, excellent education, and a golden visa pathway in this beautiful Atlantic nation.',
  description='Portugal is one of Europe''s most welcoming countries for immigrants. With its Golden Visa program, affordable cost of living, and beautiful Atlantic coastline, Portugal is perfect for those seeking a new beginning in Europe.',
  highlights=ARRAY['Golden Visa investment program','Affordable cost of living','Growing tech & startup ecosystem','Path to EU citizenship','Warm climate & friendly people']
WHERE lower(name)='portugal';

UPDATE public.countries SET capital='Athens', image_key='greece',
  summary='Experience Mediterranean living with affordable education, a growing job market, and rich cultural heritage.',
  description='Greece combines ancient history with modern opportunities. With affordable education, a growing economy, and Mediterranean lifestyle, Greece is an increasingly popular destination for international students and professionals.',
  highlights=ARRAY['Affordable university programs','Low cost of living compared to Western Europe','Growing tourism & hospitality sector','Investor visa programs available','Mediterranean climate & lifestyle']
WHERE lower(name)='greece';

UPDATE public.countries SET capital='Madrid', image_key='spain',
  summary='From Barcelona to Madrid — study, work, or settle in one of Europe''s most vibrant and welcoming countries.',
  description='Spain is one of Europe''s most vibrant and diverse countries. From Barcelona''s architecture to Madrid''s business districts, Spain offers outstanding opportunities for education, employment, and entrepreneurship.',
  highlights=ARRAY['World-renowned universities & business schools','Entrepreneur visa for startup founders','Strong job market in tech & tourism','Family-friendly immigration policies','Vibrant culture & excellent quality of life']
WHERE lower(name)='spain';

UPDATE public.countries SET capital='Paris', image_key='',
  summary='Study, work or settle in one of Europe''s largest economies and cultural capitals.',
  description='France offers globally ranked universities, a strong job market and clear pathways to long-term residence for students, professionals and families.',
  highlights=ARRAY['Globally ranked universities','Post-study work opportunities','Strong public healthcare & transport','Clear family reunification routes']
WHERE lower(name)='france';

CREATE TABLE IF NOT EXISTS public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  icon text NOT NULL DEFAULT 'FileCheck',
  summary text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}'::text[],
  countries text[] NOT NULL DEFAULT '{}'::text[],
  image_key text NOT NULL DEFAULT '',
  enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view enabled services" ON public.services FOR SELECT TO anon, authenticated USING (enabled = true);
CREATE POLICY "Staff and admins view all services" ON public.services FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));
CREATE POLICY "Admins insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update services" ON public.services FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete services" ON public.services FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER services_set_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.services (slug, title, icon, summary, description, features, countries, image_key, sort_order) VALUES
('study-visa','Study Visa','GraduationCap','Pursue your higher education dreams in top European universities.','We provide complete guidance for students aspiring to study in Europe — from university selection and admission support to visa documentation and interview preparation. Our team has helped hundreds of students get admitted to prestigious universities in Italy, Portugal, Greece, and Spain.',ARRAY['University selection guidance','Admission application support','Financial documentation','Interview preparation','Visa filing & tracking'],ARRAY['Italy','Portugal','Greece','Spain'],'study-visa',1),
('family-reunion-visa','Family Reunion Visa','Heart','Reunite with your loved ones living in Europe.','Being away from family is never easy. Our family reunion visa service helps you navigate the complex documentation and legal requirements to bring your family together in Europe. We handle everything from relationship verification documents to financial proofs.',ARRAY['Relationship documentation','Financial requirement assessment','Housing proof assistance','Embassy appointment booking','Application follow-up'],ARRAY['Italy','Portugal','Greece','Spain'],'family-visa',2),
('work-visa','Work Visa','Briefcase','Build your career in Europe''s growing economies.','Whether you''ve received a job offer or are looking to explore work opportunities in Europe, we provide comprehensive work visa and permit services. Our expertise covers seasonal work permits, highly-skilled worker visas, and employment-based immigration.',ARRAY['Job offer verification','Work permit application','Employment contract review','Skills assessment support','Renewal & extension help'],ARRAY['Italy','Portugal','Spain','Greece'],'work-visa',3),
('tourist-visa','Tourist / Visit Visa','Plane','Explore the beauty of Europe hassle-free.','Planning a trip to Europe? We make the Schengen tourist visa process simple and stress-free. From itinerary planning to document preparation, we ensure your application is complete and compelling for a smooth approval.',ARRAY['Itinerary planning assistance','Hotel & flight booking guidance','Travel insurance advice','Financial proof preparation','Schengen visa application'],ARRAY['Schengen','Italy','Spain','Greece'],'tourist-visa',4),
('residence-permit','Residence Permit','FileCheck','Secure your long-term stay in Europe.','For those looking to make Europe their long-term home, we provide expert guidance on residence permit applications. Whether it''s based on employment, study, family, or investment, we know the requirements inside out.',ARRAY['Eligibility assessment','Document compilation','Application filing','Biometric appointment booking','Status tracking & updates'],ARRAY['Italy','Portugal','Greece','Spain'],'residence-visa',5),
('business-investor-visa','Business / Investor Visa','Building2','Expand your business into European markets.','Entrepreneurs and investors looking to establish or expand their business in Europe can rely on our specialized visa services. We help with business plan preparation, investment documentation, and navigating the specific requirements of each country''s investor visa program.',ARRAY['Business plan review','Investment documentation','Company registration guidance','Golden visa programs','Entrepreneur visa support'],ARRAY['Portugal','Spain','Italy','Greece'],'business-visa',6)
ON CONFLICT (slug) DO NOTHING;