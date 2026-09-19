-- ============ LAND PARCELS (public land facts shown to authorized citizens) ============
CREATE TABLE public.land_parcels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_number text NOT NULL UNIQUE,
  sub_division text NOT NULL DEFAULT '',
  patta_number text NOT NULL DEFAULT '',
  district text NOT NULL,
  taluk text NOT NULL,
  village text NOT NULL,
  classification text NOT NULL,
  government_area numeric(10,2) NOT NULL,
  surveyed_area numeric(10,2),
  boundary_displacement numeric(10,2),
  verification_status text NOT NULL DEFAULT 'Pending',
  boundary_status text NOT NULL DEFAULT 'Verification Required',
  latest_survey_date date,
  source text NOT NULL DEFAULT 'Village Record',
  latitude numeric(9,6) NOT NULL,
  longitude numeric(9,6) NOT NULL,
  boundary_geometry jsonb,
  drone_survey_date date,
  drone_survey_status text,
  drone_surveyed_area numeric(10,2),
  rtk_survey_date date,
  rtk_status text,
  rtk_public_accuracy text,
  is_demo boolean NOT NULL DEFAULT true,
  last_updated timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.land_surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  land_id uuid NOT NULL REFERENCES public.land_parcels(id) ON DELETE CASCADE,
  survey_date date NOT NULL,
  survey_type text NOT NULL,
  surveyed_area numeric(10,2),
  boundary_movement numeric(10,2),
  verification_status text NOT NULL DEFAULT 'Pending',
  boundary_status text NOT NULL DEFAULT 'Verification Required',
  public_result text NOT NULL DEFAULT '',
  is_demo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.land_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  land_id uuid NOT NULL REFERENCES public.land_parcels(id) ON DELETE CASCADE,
  title text NOT NULL,
  document_type text NOT NULL,
  issued_on date,
  reference text,
  file_path text,
  uploaded_by uuid,
  is_demo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============ CITIZEN IDENTITY & LAND MAPPING ============
CREATE TABLE public.citizen_profiles (
  id uuid PRIMARY KEY,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text,
  village text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.citizen_land_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id uuid NOT NULL,
  land_id uuid NOT NULL REFERENCES public.land_parcels(id) ON DELETE CASCADE,
  relationship text NOT NULL DEFAULT 'Registered Holder',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (citizen_id, land_id)
);

-- demo mapping source: email -> survey numbers (never client readable)
CREATE TABLE public.demo_land_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  survey_number text NOT NULL,
  UNIQUE (email, survey_number)
);

CREATE SEQUENCE public.citizen_request_seq START 1001;

CREATE TABLE public.citizen_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id uuid NOT NULL,
  land_id uuid NOT NULL REFERENCES public.land_parcels(id) ON DELETE CASCADE,
  request_code text NOT NULL UNIQUE DEFAULT ('BG-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.citizen_request_seq')::text, 5, '0')),
  request_type text NOT NULL,
  issue_type text,
  reason text NOT NULL,
  photo_path text,
  document_path text,
  status text NOT NULL DEFAULT 'Submitted',
  latest_update text NOT NULL DEFAULT 'Request received and queued for officer assignment.',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.citizen_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id uuid NOT NULL,
  land_id uuid REFERENCES public.land_parcels(id) ON DELETE CASCADE,
  category text NOT NULL DEFAULT 'Update',
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============ ACCESS HELPER ============
CREATE OR REPLACE FUNCTION public.citizen_has_land_access(_land_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.citizen_land_access
    WHERE land_id = _land_id AND citizen_id = auth.uid()
  )
$$;

-- ============ GRANTS ============
GRANT SELECT ON public.land_parcels TO authenticated;
GRANT SELECT ON public.land_surveys TO authenticated;
GRANT SELECT, INSERT ON public.land_documents TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.citizen_profiles TO authenticated;
GRANT SELECT ON public.citizen_land_access TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.citizen_requests TO authenticated;
GRANT SELECT, UPDATE ON public.citizen_notifications TO authenticated;
GRANT USAGE ON SEQUENCE public.citizen_request_seq TO authenticated;
GRANT ALL ON public.land_parcels TO service_role;
GRANT ALL ON public.land_surveys TO service_role;
GRANT ALL ON public.land_documents TO service_role;
GRANT ALL ON public.citizen_profiles TO service_role;
GRANT ALL ON public.citizen_land_access TO service_role;
GRANT ALL ON public.demo_land_assignments TO service_role;
GRANT ALL ON public.citizen_requests TO service_role;
GRANT ALL ON public.citizen_notifications TO service_role;

-- ============ RLS ============
ALTER TABLE public.land_parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.land_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.land_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_land_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_land_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Citizens read authorized lands" ON public.land_parcels
  FOR SELECT TO authenticated USING (public.citizen_has_land_access(id));

CREATE POLICY "Citizens read surveys of authorized lands" ON public.land_surveys
  FOR SELECT TO authenticated USING (public.citizen_has_land_access(land_id));

CREATE POLICY "Citizens read documents of authorized lands" ON public.land_documents
  FOR SELECT TO authenticated USING (public.citizen_has_land_access(land_id));

CREATE POLICY "Citizens upload documents for authorized lands" ON public.land_documents
  FOR INSERT TO authenticated
  WITH CHECK (public.citizen_has_land_access(land_id) AND uploaded_by = auth.uid());

CREATE POLICY "Citizens read own profile" ON public.citizen_profiles
  FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Citizens create own profile" ON public.citizen_profiles
  FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Citizens update own profile" ON public.citizen_profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "Citizens read own land access" ON public.citizen_land_access
  FOR SELECT TO authenticated USING (citizen_id = auth.uid());

CREATE POLICY "Citizens read own requests" ON public.citizen_requests
  FOR SELECT TO authenticated USING (citizen_id = auth.uid());
CREATE POLICY "Citizens create own requests" ON public.citizen_requests
  FOR INSERT TO authenticated
  WITH CHECK (citizen_id = auth.uid() AND public.citizen_has_land_access(land_id));
CREATE POLICY "Citizens update own requests" ON public.citizen_requests
  FOR UPDATE TO authenticated USING (citizen_id = auth.uid()) WITH CHECK (citizen_id = auth.uid());

CREATE POLICY "Citizens read own notifications" ON public.citizen_notifications
  FOR SELECT TO authenticated USING (citizen_id = auth.uid());
CREATE POLICY "Citizens update own notifications" ON public.citizen_notifications
  FOR UPDATE TO authenticated USING (citizen_id = auth.uid()) WITH CHECK (citizen_id = auth.uid());

-- ============ CLAIM / BOOTSTRAP FUNCTION ============
CREATE OR REPLACE FUNCTION public.claim_citizen_lands(_full_name text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  mail text := lower(coalesce(auth.jwt() ->> 'email', ''));
  surveys text[];
  parcel record;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO public.citizen_profiles (id, full_name, email)
  VALUES (uid, coalesce(_full_name, split_part(mail, '@', 1)), mail)
  ON CONFLICT (id) DO UPDATE
    SET full_name = CASE WHEN _full_name IS NOT NULL AND _full_name <> '' THEN _full_name ELSE public.citizen_profiles.full_name END,
        email = EXCLUDED.email;

  SELECT array_agg(survey_number) INTO surveys
  FROM public.demo_land_assignments WHERE lower(email) = mail;

  IF surveys IS NULL THEN
    surveys := ARRAY['245/3', '247/2'];
  END IF;

  INSERT INTO public.citizen_land_access (citizen_id, land_id)
  SELECT uid, p.id FROM public.land_parcels p WHERE p.survey_number = ANY(surveys)
  ON CONFLICT (citizen_id, land_id) DO NOTHING;

  FOR parcel IN
    SELECT p.* FROM public.land_parcels p
    JOIN public.citizen_land_access a ON a.land_id = p.id AND a.citizen_id = uid
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM public.citizen_notifications n
      WHERE n.citizen_id = uid AND n.land_id = parcel.id AND n.category = 'Access'
    ) THEN
      INSERT INTO public.citizen_notifications (citizen_id, land_id, category, title, message)
      VALUES (uid, parcel.id, 'Access',
              'Land linked to your account',
              'Survey No. ' || parcel.survey_number || ' (' || parcel.village || ') is now visible in your verification centre.');

      IF parcel.latest_survey_date IS NOT NULL THEN
        INSERT INTO public.citizen_notifications (citizen_id, land_id, category, title, message)
        VALUES (uid, parcel.id, 'Survey',
                'Survey completed for ' || parcel.survey_number,
                'Latest survey dated ' || to_char(parcel.latest_survey_date, 'DD Mon YYYY') || ' recorded ' ||
                coalesce(parcel.surveyed_area::text, '—') || ' acres against the government record of ' || parcel.government_area || ' acres.');
      END IF;

      INSERT INTO public.citizen_notifications (citizen_id, land_id, category, title, message)
      VALUES (uid, parcel.id, 'Verification',
              'Verification status: ' || parcel.verification_status,
              'Boundary status for Survey No. ' || parcel.survey_number || ' is "' || parcel.boundary_status || '". A public report is available in Citizen Reports.');
    END IF;
  END LOOP;
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_citizen_lands(text) TO authenticated;

-- request status progression trigger keeps updated_at fresh
CREATE OR REPLACE FUNCTION public.touch_citizen_request()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER citizen_requests_touch BEFORE UPDATE ON public.citizen_requests
FOR EACH ROW EXECUTE FUNCTION public.touch_citizen_request();
