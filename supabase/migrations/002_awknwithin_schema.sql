-- AWKNWithin Core Schema
-- One shared project for AWKN Ranch (venue rental + membership) and Within Center (retreats + therapy)

-- ============================================================
-- SHARED: People (contacts shared across both brands)
-- ============================================================
CREATE TABLE IF NOT EXISTS people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  notes TEXT,
  is_awkn_member BOOLEAN DEFAULT false,
  is_within_client BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE people ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read people" ON people FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert people" ON people FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update people" ON people FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- AWKN RANCH: Venues
-- ============================================================
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  capacity INT,
  hourly_rate_cents INT,
  half_day_rate_cents INT,
  full_day_rate_cents INT,
  amenities TEXT[],
  photos TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read venues" ON venues FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write venues" ON venues FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- AWKN RANCH: Membership Plans
-- ============================================================
CREATE TABLE IF NOT EXISTS membership_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_cents INT NOT NULL,
  billing_period TEXT CHECK (billing_period IN ('monthly', 'annual', 'one_time')) DEFAULT 'monthly',
  benefits TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read membership_plans" ON membership_plans FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write membership_plans" ON membership_plans FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- AWKN RANCH: Active Memberships
-- ============================================================
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES membership_plans(id),
  status TEXT CHECK (status IN ('active', 'paused', 'cancelled', 'expired')) DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read memberships" ON memberships FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write memberships" ON memberships FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- AWKN RANCH: Venue Bookings
-- ============================================================
CREATE TABLE IF NOT EXISTS venue_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID REFERENCES venues(id),
  person_id UUID REFERENCES people(id),
  title TEXT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  rate_type TEXT CHECK (rate_type IN ('hourly', 'half_day', 'full_day', 'custom')),
  total_cents INT,
  status TEXT CHECK (status IN ('inquiry', 'confirmed', 'completed', 'cancelled')) DEFAULT 'inquiry',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE venue_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read venue_bookings" ON venue_bookings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write venue_bookings" ON venue_bookings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- WITHIN CENTER: Practitioners
-- ============================================================
CREATE TABLE IF NOT EXISTS practitioners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID REFERENCES people(id),
  title TEXT,
  specialties TEXT[],
  bio TEXT,
  photo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE practitioners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read practitioners" ON practitioners FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write practitioners" ON practitioners FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- WITHIN CENTER: Retreat Programs (templates)
-- ============================================================
CREATE TABLE IF NOT EXISTS retreat_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  program_type TEXT CHECK (program_type IN ('ketamine', 'psilocybin', 'mdma', 'integration_only', 'other')),
  duration_days INT,
  capacity INT,
  price_cents INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE retreat_programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read retreat_programs" ON retreat_programs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write retreat_programs" ON retreat_programs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- WITHIN CENTER: Retreats (specific instances)
-- ============================================================
CREATE TABLE IF NOT EXISTS retreats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES retreat_programs(id),
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  capacity INT,
  status TEXT CHECK (status IN ('planning', 'open', 'full', 'completed', 'cancelled')) DEFAULT 'planning',
  lead_practitioner_id UUID REFERENCES practitioners(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE retreats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read retreats" ON retreats FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write retreats" ON retreats FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- WITHIN CENTER: Retreat Participants
-- ============================================================
CREATE TABLE IF NOT EXISTS retreat_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  retreat_id UUID REFERENCES retreats(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id),
  status TEXT CHECK (status IN ('inquiry', 'screening', 'accepted', 'enrolled', 'completed', 'withdrawn')) DEFAULT 'inquiry',
  enrolled_at TIMESTAMPTZ,
  intake_completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(retreat_id, person_id)
);

ALTER TABLE retreat_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read retreat_participants" ON retreat_participants FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write retreat_participants" ON retreat_participants FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- WITHIN CENTER: Intake Forms
-- ============================================================
CREATE TABLE IF NOT EXISTS intake_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID REFERENCES people(id),
  participant_id UUID REFERENCES retreat_participants(id),
  form_data JSONB,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_by UUID REFERENCES practitioners(id),
  reviewed_at TIMESTAMPTZ,
  status TEXT CHECK (status IN ('pending', 'approved', 'needs_review', 'declined')) DEFAULT 'pending',
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE intake_forms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read intake_forms" ON intake_forms FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write intake_forms" ON intake_forms FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- WITHIN CENTER: Therapy Sessions
-- ============================================================
CREATE TABLE IF NOT EXISTS therapy_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID REFERENCES people(id),
  retreat_id UUID REFERENCES retreats(id),
  practitioner_id UUID REFERENCES practitioners(id),
  session_type TEXT CHECK (session_type IN ('preparation', 'medicine', 'integration', 'followup')),
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration_minutes INT,
  status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE therapy_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read therapy_sessions" ON therapy_sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write therapy_sessions" ON therapy_sessions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- WITHIN CENTER: Integration Sessions
-- ============================================================
CREATE TABLE IF NOT EXISTS integration_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID REFERENCES people(id),
  retreat_id UUID REFERENCES retreats(id),
  practitioner_id UUID REFERENCES practitioners(id),
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration_minutes INT,
  status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
  notes TEXT,
  session_number INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE integration_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read integration_sessions" ON integration_sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write integration_sessions" ON integration_sessions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- Auto-update updated_at trigger (shared)
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_people_updated_at BEFORE UPDATE ON people FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_memberships_updated_at BEFORE UPDATE ON memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_venue_bookings_updated_at BEFORE UPDATE ON venue_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_retreats_updated_at BEFORE UPDATE ON retreats FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_retreat_participants_updated_at BEFORE UPDATE ON retreat_participants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_therapy_sessions_updated_at BEFORE UPDATE ON therapy_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
