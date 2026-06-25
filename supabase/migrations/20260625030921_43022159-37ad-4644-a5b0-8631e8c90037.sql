CREATE OR REPLACE FUNCTION public.bootstrap_role(_role app_role)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _exists boolean;
BEGIN
  IF _uid IS NULL THEN
    RETURN 'unauthenticated';
  END IF;

  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE role = _role) INTO _exists;
  IF _exists THEN
    RETURN 'role_already_assigned';
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (_uid, _role)
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN 'granted';
END;
$$;

REVOKE ALL ON FUNCTION public.bootstrap_role(app_role) FROM public;
GRANT EXECUTE ON FUNCTION public.bootstrap_role(app_role) TO authenticated;