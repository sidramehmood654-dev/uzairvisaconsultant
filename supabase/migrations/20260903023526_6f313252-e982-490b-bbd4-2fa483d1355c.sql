CREATE TABLE public.form_submission_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form text NOT NULL,
  ip_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.form_submission_log TO service_role;

ALTER TABLE public.form_submission_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view submission log"
  ON public.form_submission_log FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

GRANT SELECT ON public.form_submission_log TO authenticated;

CREATE INDEX idx_form_submission_log_lookup
  ON public.form_submission_log (form, ip_hash, created_at DESC);

-- Public contact form must now go through the captcha-protected edge function
DROP POLICY IF EXISTS "Anyone can submit an enquiry" ON public.contact_enquiries;
REVOKE INSERT ON public.contact_enquiries FROM anon;
GRANT ALL ON public.contact_enquiries TO service_role;