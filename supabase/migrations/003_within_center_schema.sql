-- ==========================================================================
-- Within Center - Database Schema
-- Tables for booking system, blog, contact, and team management
-- ==========================================================================

-- ---- Services / Packages ----
CREATE TABLE IF NOT EXISTS wc_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  price_cents INTEGER,
  price_display TEXT, -- "Call for pricing" or "$5,900"
  duration TEXT,
  category TEXT DEFAULT 'outpatient' CHECK (category IN ('outpatient', 'retreat')),
  features JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---- Providers / Practitioners ----
CREATE TABLE IF NOT EXISTS wc_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  photo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ---- Provider Schedules ----
CREATE TABLE IF NOT EXISTS wc_provider_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES wc_providers(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 6=Sat
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- ---- Bookings ----
CREATE TABLE IF NOT EXISTS wc_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id TEXT, -- matches slug from wc_services
  service_name TEXT NOT NULL,
  provider_id UUID REFERENCES wc_providers(id),
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  client_first_name TEXT NOT NULL,
  client_last_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  client_city TEXT,
  client_state TEXT,
  comments TEXT,
  amount INTEGER, -- cents
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'deposit_paid', 'paid', 'refunded')),
  payment_id TEXT, -- Stripe payment ID (future)
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---- Blog Posts ----
CREATE TABLE IF NOT EXISTS wc_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT, -- markdown
  author TEXT,
  category TEXT,
  tags TEXT[],
  featured_image_url TEXT,
  published_at TIMESTAMPTZ,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---- Contact Form Submissions ----
CREATE TABLE IF NOT EXISTS wc_contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  state TEXT,
  message TEXT,
  source TEXT DEFAULT 'contact_form',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ---- Team Members ----
CREATE TABLE IF NOT EXISTS wc_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  photo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---- Newsletter Subscribers ----
CREATE TABLE IF NOT EXISTS wc_newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- ---- Indexes ----
CREATE INDEX IF NOT EXISTS idx_wc_bookings_date ON wc_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_wc_bookings_status ON wc_bookings(status);
CREATE INDEX IF NOT EXISTS idx_wc_bookings_email ON wc_bookings(client_email);
CREATE INDEX IF NOT EXISTS idx_wc_posts_published ON wc_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_wc_posts_slug ON wc_posts(slug);
CREATE INDEX IF NOT EXISTS idx_wc_contact_status ON wc_contact_submissions(status);

-- ---- Seed: Services ----
INSERT INTO wc_services (slug, name, tagline, price_cents, price_display, duration, category, features, sort_order) VALUES
  ('awaken', 'AWAKEN', 'Come Fully Home to You', 590000, '$5,900', '6 sessions over 2 months', 'outpatient',
   '["1 Medical Consultation w/ MAPS-Trained NP","1 Preparation Session","6 Private Guided Ketamine Ceremonies","6 Integration Sessions (Therapy/Coaching)","2 Month Membership to AWKN Ranch"]', 1),
  ('heal', 'HEAL', 'Heal Your Nervous System', 390000, '$3,900', '3 sessions over 1 month', 'outpatient',
   '["1 Medical Consultation w/ MAPS-Trained NP","1 Preparation Session","3 Private Guided Ketamine Ceremonies","3 Integration Sessions (Therapy/Coaching)","1 Month Membership to AWKN Ranch"]', 2),
  ('explore', 'EXPLORE', 'Expand Your Consciousness', 200000, '$2,000', '1 session', 'outpatient',
   '["1 Medical Consultation w/ MAPS-Trained NP","1 Preparation Session","1 Private Guided Ketamine Ceremony","1 Integration Session (Therapy/Coaching)","2 Day Passes to AWKN Ranch"]', 3),
  ('twin-flame', 'TWIN FLAME', 'Couples Treatment Package', 220000, '$2,200', 'Couples session', 'outpatient',
   '["2 Medical Consultations","1 Preparation Session","1 Guided Ketamine Ceremony","1 Integration Process Session","2 Integration Coaching Sessions"]', 4),
  ('tune-up', 'TUNE-UP', 'For Past Awaken or Retreat Clients', 69500, '$695', '1 session', 'outpatient',
   '["1 Guided Ketamine Ceremony","1 Integration Session (Therapy/Coaching)","1 Day Pass to AWKN Ranch"]', 5),
  ('four-week-retreat', 'Four Week Retreat', 'Comprehensive healing immersion', NULL, 'Call for pricing', '4 weeks', 'retreat',
   '["Medical Consultation with a licensed PA-C","Preparation Session with your therapist/guide","7 Guided Ketamine Sessions","Weekly 1:1 Therapy Session","Weekly 1:1 Coaching Session","Weekly Massage","Community Classes","Home Cooked Meals","Pickleball Lessons","Saunas, Cold plunge, Hot plunge","Movement Classes"]', 6),
  ('two-week-retreat', 'Two Week Retreat', 'Focused healing experience', NULL, 'Call for pricing', '2 weeks', 'retreat',
   '["Medical Consultation with a licensed PA-C","Preparation Session with your therapist/guide","4 Guided Ketamine Sessions","Weekly 1:1 Therapy Session","Weekly 1:1 Coaching Session","Weekly Massage","Community Classes","Home Cooked Meals","Pickleball Lessons","Saunas, Cold plunge, Hot plunge","Movement Classes"]', 7)
ON CONFLICT (slug) DO NOTHING;

-- ---- Seed: Team Members ----
INSERT INTO wc_team_members (name, role, bio, sort_order) VALUES
  ('William', 'Founder', 'Former Google employee who launched four healthcare companies in Austin, TX. Personal healing journey through plant medicine, ancient traditions, gut health, and nervous system regulation.', 1),
  ('Dr. Julie Kaesberg', 'Medical Director', NULL, 2),
  ('Justin De La Cruz', 'Managing Director', NULL, 3),
  ('Maeve O''Neill', 'Professional Counselor-Supervisor', NULL, 4),
  ('Dr. Samuel Lee, M.D.', 'Psychiatrist', 'Board-certified psychiatrist specializing in spiritually-based mental health and integrative methodologies. Graduate of Loma Linda University School of Medicine.', 5),
  ('Sabrina', 'Director of Admissions & Intake', 'Master''s degrees in Philosophy, Cosmology & Consciousness studies and Transformational Coaching. Over two decades supporting transformational work and psychedelic medicine retreats.', 6),
  ('Shannon Grossman', 'Inpatient Retreat Manager', NULL, 7),
  ('Juls', 'Retreat & Membership Coordinator', NULL, 8),
  ('Kyle Breen', 'Ranch Services, Class Manager', NULL, 9),
  ('Darlene Neth', 'Retreat Staff & Facilitator', NULL, 10),
  ('Leslie Glace', 'Head of Integration and Scheduling', NULL, 11),
  ('Danielle Napier', 'Psychiatric Nurse, RN, BCH, CCHt Lead Guide', NULL, 12),
  ('Eric Vikre', 'AWKN Ranch Operations', NULL, 13),
  ('Lida', 'Ceremonialist & Psychedelic Guide', 'Healer and medicine woman rooted in indigenous traditions. Former co-director at Shamanic Healing Center in Costa Rica with expertise in sacred and natural medicine.', 14),
  ('Ayesha Macon', 'Psychiatric Nurse Practitioner, PMHNP', NULL, 15),
  ('Patrick', 'Admissions & Intake Coordinator', NULL, 16),
  ('Heather', 'Certified Coach & Psychedelic Guide', '14 years'' experience with plant medicines and sacred ceremonies. Licensed massage therapist. Recovered from life-threatening alcohol addiction through plant medicine ceremony.', 17),
  ('Aaron', 'Certified Coach & Psychedelic Guide', 'Grief Recovery Specialist and coach in Compassionate Communication. Collaborates with indigenous mentors since 2017. Studied with Yawanawa tribe in Brazil.', 18),
  ('Amber', 'Therapist & Psychedelic Guide', 'Master''s in Clinical Mental Health Counseling with certifications in psychedelic-assisted therapy. Background includes crisis support and U.S. Coast Guard service.', 19),
  ('Delaney Siano', 'Retreat Staff & Chef', NULL, 20),
  ('Michael Whali', 'Admissions Support / Ranch Services', NULL, 21),
  ('Alyssa Ablan', 'Lead Nurse', NULL, 22),
  ('Misty Render', 'Retreat Staff and Chef', NULL, 23);

-- ---- RLS Policies ----
-- Public read for services, team, and published posts
ALTER TABLE wc_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active services" ON wc_services FOR SELECT USING (is_active = true);

ALTER TABLE wc_team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active team members" ON wc_team_members FOR SELECT USING (is_active = true);

ALTER TABLE wc_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published posts" ON wc_posts FOR SELECT USING (is_published = true);

-- Public insert for bookings, contact, newsletter
ALTER TABLE wc_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can create bookings" ON wc_bookings FOR INSERT WITH CHECK (true);

ALTER TABLE wc_contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can submit contact forms" ON wc_contact_submissions FOR INSERT WITH CHECK (true);

ALTER TABLE wc_newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can subscribe to newsletter" ON wc_newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Authenticated users can manage all data
CREATE POLICY "Authenticated manage services" ON wc_services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated manage team" ON wc_team_members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated manage posts" ON wc_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated manage bookings" ON wc_bookings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated manage contacts" ON wc_contact_submissions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated manage newsletter" ON wc_newsletter_subscribers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated manage providers" ON wc_providers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated manage schedules" ON wc_provider_schedules FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE wc_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active providers" ON wc_providers FOR SELECT USING (is_active = true);

ALTER TABLE wc_provider_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active schedules" ON wc_provider_schedules FOR SELECT USING (is_active = true);
