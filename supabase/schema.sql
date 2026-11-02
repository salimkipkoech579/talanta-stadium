-- ====================================================================
-- TALANTA STADIUM KENYA (Talanta Sports City / Raila Amolo Odinga International Stadium)
-- SUPABASE POSTGRESQL DATABASE SCHEMA & MIGRATION SCRIPT
-- ====================================================================
-- Currency: KES (Kenyan Shillings)
-- Platform: Supabase PostgreSQL with Row Level Security (RLS)

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. DROP EXISTING TABLES (Safe migration)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS seats CASCADE;
DROP TABLE IF EXISTS ticket_types CASCADE;
DROP TABLE IF EXISTS seating_sections CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS event_categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- 3. ROLES & PROFILES
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL, -- 'super_admin', 'match_operations', 'ticketing_officer', 'fan'
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(30), -- e.g. +254712345678
    national_id_or_passport VARCHAR(50),
    role_id UUID REFERENCES roles(id),
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EVENT CATEGORIES & EVENTS
CREATE TABLE event_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL, -- 'football', 'rugby', 'athletics', 'concerts', 'corporate'
    name VARCHAR(150) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES event_categories(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    short_description TEXT,
    full_description TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    gates_open_time TIME NOT NULL,
    end_time TIME,
    home_team VARCHAR(150),
    away_team VARCHAR(150),
    tournament_name VARCHAR(200), -- 'AFCON Qualifiers', 'FKF Premier League', 'Live in Nairobi'
    banner_image_url TEXT NOT NULL,
    seating_map_image_url TEXT,
    venue_name VARCHAR(150) DEFAULT 'Talanta Sports City Stadium, Nairobi',
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'live', 'completed', 'postponed', 'cancelled'
    is_featured BOOLEAN DEFAULT FALSE,
    min_price_kes NUMERIC(10, 2) NOT NULL,
    max_price_kes NUMERIC(10, 2) NOT NULL,
    total_capacity INT DEFAULT 60000,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SEATING SECTIONS & SEATS
CREATE TABLE seating_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL, -- 'VVIP_PRESIDENTIAL', 'VIP_GOLD_WEST', 'CAT1_WEST_UPPER', 'CAT2_EAST', 'CAT3_NORTH_ULTRAS', 'CAT3_SOUTH'
    name VARCHAR(150) NOT NULL,
    stand_location VARCHAR(50) NOT NULL, -- 'West', 'East', 'North', 'South', 'Pitch'
    tier_level VARCHAR(50) NOT NULL, -- 'VVIP', 'VIP', 'Category 1', 'Category 2', 'Category 3'
    capacity INT NOT NULL,
    gate_entrance VARCHAR(50) NOT NULL, -- 'Gate A - Presidential', 'Gate B - West VIP', 'Gate C - East', 'Gate D - South'
    amenities TEXT[], -- ARRAY['Exclusive Lounge', 'Buffet & Refreshments', 'Private Restrooms', 'Dedicated Parking']
    color_hex VARCHAR(20) DEFAULT '#0FA958',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ticket_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    section_id UUID REFERENCES seating_sections(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    price_kes NUMERIC(10, 2) NOT NULL,
    sports_levy_kes NUMERIC(10, 2) DEFAULT 50.00,
    vat_kes NUMERIC(10, 2) DEFAULT 0.00,
    total_available INT NOT NULL,
    total_booked INT DEFAULT 0,
    max_per_user INT DEFAULT 6,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, section_id)
);

CREATE TABLE seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID REFERENCES seating_sections(id) ON DELETE CASCADE,
    row_label VARCHAR(10) NOT NULL, -- 'A', 'B', 'C', 'Row 12'
    seat_number VARCHAR(10) NOT NULL, -- '1', '2', '3'
    is_accessible BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(section_id, row_label, seat_number)
);

-- 6. BOOKINGS & TICKETS
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'TS-2026-NBO-84920'
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    event_id UUID REFERENCES events(id) ON DELETE RESTRICT,
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL, -- Safaricom M-Pesa format
    national_id VARCHAR(50) NOT NULL,
    total_tickets INT NOT NULL,
    subtotal_kes NUMERIC(10, 2) NOT NULL,
    levy_fee_kes NUMERIC(10, 2) DEFAULT 0.00,
    total_amount_kes NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'refunded'
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    ticket_type_id UUID REFERENCES ticket_types(id) ON DELETE RESTRICT,
    event_id UUID REFERENCES events(id) ON DELETE RESTRICT,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    ticket_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'TKT-KEN-73892-01'
    attendee_name VARCHAR(255) NOT NULL,
    attendee_national_id VARCHAR(50) NOT NULL,
    section_code VARCHAR(50) NOT NULL,
    section_name VARCHAR(150) NOT NULL,
    gate_entrance VARCHAR(100) NOT NULL,
    turnstile_number VARCHAR(50) NOT NULL,
    seat_info VARCHAR(100) NOT NULL, -- 'Section VIP Gold | Row 4 | Seat 18'
    qr_code_hash TEXT UNIQUE NOT NULL, -- Cryptographic verification hash
    status VARCHAR(50) DEFAULT 'valid', -- 'valid', 'scanned', 'cancelled', 'expired'
    scanned_at TIMESTAMPTZ,
    scanned_by UUID REFERENCES profiles(id),
    scanned_gate VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PAYMENTS (DARARA M-PESA STK PUSH)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) DEFAULT 'MPESA_STK_PUSH', -- 'MPESA_STK_PUSH', 'CARD', 'BANK'
    merchant_request_id VARCHAR(100),
    checkout_request_id VARCHAR(100) UNIQUE,
    mpesa_receipt_number VARCHAR(50) UNIQUE, -- e.g. 'TKB49102948'
    phone_number VARCHAR(30) NOT NULL,
    amount_kes NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'initiated', -- 'initiated', 'completed', 'failed', 'cancelled'
    result_code INT,
    result_description TEXT,
    transaction_date TIMESTAMPTZ,
    raw_callback_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. NEWS & ANNOUNCEMENTS
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) DEFAULT 'Stadium News', -- 'Match Preview', 'Infrastructure', 'Traffic & Transport', 'Entertainment'
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    author_name VARCHAR(150) DEFAULT 'Talanta Stadium Media Unit',
    image_url TEXT NOT NULL,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    headline VARCHAR(255) NOT NULL,
    severity VARCHAR(50) DEFAULT 'info', -- 'info', 'warning', 'critical', 'success'
    is_active BOOLEAN DEFAULT TRUE,
    display_from TIMESTAMPTZ DEFAULT NOW(),
    display_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AUDIT LOGS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL, -- 'TICKET_SCAN', 'EVENT_CREATED', 'PAYMENT_VERIFIED', 'BOOKING_CANCELLED'
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE seating_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Users can read their own profile; admins can read all
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- 2. Events & Sections: Public read access
CREATE POLICY "Public read for events" ON events
    FOR SELECT USING (true);

CREATE POLICY "Public read for sections" ON seating_sections
    FOR SELECT USING (true);

CREATE POLICY "Public read for ticket_types" ON ticket_types
    FOR SELECT USING (true);

CREATE POLICY "Public read for news" ON news
    FOR SELECT USING (true);

CREATE POLICY "Public read for announcements" ON announcements
    FOR SELECT USING (is_active = true);

-- 3. Bookings: User can view and create their own bookings
CREATE POLICY "Users can view own bookings" ON bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Tickets: User can view own tickets; Gate staff can verify any ticket
CREATE POLICY "Users can view own tickets" ON tickets
    FOR SELECT USING (auth.uid() = user_id);

-- 5. Payments: User can view payments for own bookings
CREATE POLICY "Users view own payments" ON payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM bookings
            WHERE bookings.id = payments.booking_id
            AND bookings.user_id = auth.uid()
        )
    );

-- 6. Admin Overrides (Functions checking roles)
CREATE OR REPLACE FUNCTION is_admin(user_uid UUID) 
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles p
        JOIN roles r ON p.role_id = r.id
        WHERE p.id = user_uid 
        AND r.name IN ('super_admin', 'match_operations', 'ticketing_officer')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Admins full access on events" ON events
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins full access on bookings" ON bookings
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins full access on tickets" ON tickets
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins full access on payments" ON payments
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins full access on audit_logs" ON audit_logs
    FOR ALL USING (is_admin(auth.uid()));

-- ====================================================================
-- SEED DATA: REALISTIC TALANTA SPORTS CITY NAIROBI SHOWCASE
-- ====================================================================

-- Roles
INSERT INTO roles (id, name, description) VALUES
('00000000-0000-0000-0000-000000000001', 'super_admin', 'Full platform and stadium governance access'),
('00000000-0000-0000-0000-000000000002', 'match_operations', 'Match day gate controllers and stewards'),
('00000000-0000-0000-0000-000000000003', 'fan', 'General stadium visitor and ticket buyer');

-- Categories
INSERT INTO event_categories (id, slug, name, description, display_order) VALUES
('11111111-1111-1111-1111-111111111101', 'football', 'Football (AFCON & KPL)', 'International and domestic football fixtures', 1),
('11111111-1111-1111-1111-111111111102', 'concerts', 'Mega Concerts & Festivals', 'Live music festivals, African and global icons', 2),
('11111111-1111-1111-1111-111111111103', 'rugby', 'Rugby Sevens', 'World class rugby championships and Safari Sevens', 3),
('11111111-1111-1111-1111-111111111104', 'athletics', 'World Athletics Continental Tour', 'Kip Keino Classic and national trials', 4);

-- Seating Sections
INSERT INTO seating_sections (id, code, name, stand_location, tier_level, capacity, gate_entrance, amenities, color_hex) VALUES
('22222222-2222-2222-2222-222222222201', 'VVIP_PRESIDENTIAL', 'VVIP Presidential Skybox', 'West', 'VVIP', 500, 'Gate A - Ceremonial Presidential Plaza', ARRAY['Executive Lounge Access', 'Five-Star Kenyan Buffet & Bar', 'Pitchside Glass Enclosure', 'Valet Parking Lot 1', 'Dedicated Concierge'], '#C5A059'),
('22222222-2222-2222-2222-222222222202', 'VIP_GOLD_WEST', 'VIP Gold Terrace (Lower West)', 'West', 'VIP', 3500, 'Gate B - West Executive Concourse', ARRAY['Padded Luxury Seating', 'VIP Concourse Dining', 'Priority Turnstile Fast-Track', 'Complimentary Match Program'], '#E5C378'),
('22222222-2222-2222-2222-222222222203', 'CAT1_WEST_UPPER', 'Category 1 West Concourse', 'West', 'Category 1', 12000, 'Gate B & C - West Upper', ARRAY['Covered Canopy View', 'Concession Kiosks', 'High-Speed Turnstile Access'], '#0FA958'),
('22222222-2222-2222-2222-222222222204', 'CAT2_EAST_STAND', 'Category 2 East Grandstand', 'East', 'Category 2', 18000, 'Gate D & E - East Entrance', ARRAY['Panoramic Broadcast Angle', 'Spacious Concourse', 'Express Gates'], '#005A2B'),
('22222222-2222-2222-2222-222222222205', 'CAT3_NORTH_ULTRAS', 'Category 3 North Stand (Ultras & Fan Club)', 'North', 'Category 3', 13000, 'Gate F - North Concourse', ARRAY['Atmospheric Fan Zone', 'Safe Standing & Chanting Rails', 'Banners & Drums Allowed'], '#2B4234'),
('22222222-2222-2222-2222-222222222206', 'CAT3_SOUTH_STAND', 'Category 3 South Stand', 'South', 'Category 3', 13000, 'Gate G - South Concourse', ARRAY['Family & General Seating', 'Quick Bus & Train Terminal Access'], '#1C2B22');

-- Realistic Featured Events
INSERT INTO events (id, category_id, title, slug, short_description, full_description, event_date, start_time, gates_open_time, home_team, away_team, tournament_name, banner_image_url, min_price_kes, max_price_kes, is_featured, status) VALUES
(
    '33333333-3333-3333-3333-333333333301',
    '11111111-1111-1111-1111-111111111101',
    'Harambee Stars vs Côte d''Ivoire (AFCON 2027 Qualifier)',
    'harambee-stars-vs-cote-divoire-2026',
    'Kenya''s national football team hosts reigning continental champions in a high-stakes qualifying clash under the Talanta floodlights.',
    'A momentous international football night at the brand new Talanta Sports City in Nairobi. Harambee Stars take on the Elephants of Côte d''Ivoire in a crucial qualifier. Expect 60,000 roaring fans, state-of-the-art hybrid turf pitch, and thrilling African football action.',
    '2026-11-28',
    '19:00:00',
    '15:00:00',
    'Harambee Stars (KEN)',
    'Côte d''Ivoire (CIV)',
    'CAF Africa Cup of Nations Qualifiers',
    '/src/assets/images/talanta_stadium_interior_1793552928473.jpg',
    500.00,
    15000.00,
    TRUE,
    'scheduled'
),
(
    '33333333-3333-3333-3333-333333333302',
    '11111111-1111-1111-1111-111111111101',
    'Mashemeji Derby: Gor Mahia vs AFC Leopards',
    'mashemeji-derby-gor-mahia-afc-leopards-2026',
    'East Africa''s most passionate, legendary football rivalry takes over the state-of-the-art Talanta pitch.',
    'The historic Mashemeji Derby comes to Talanta Sports City. The green army of Gor Mahia battles the blue-and-white hoops of AFC Leopards in the FKF Premier League title showdown.',
    '2026-12-12',
    '16:00:00',
    '12:00:00',
    'Gor Mahia FC',
    'AFC Leopards SC',
    'FKF Premier League',
    '/src/assets/images/talanta_stadium_exterior_1793552927909.jpg',
    400.00,
    8000.00,
    TRUE,
    'scheduled'
),
(
    '33333333-3333-3333-3333-333333333303',
    '11111111-1111-1111-1111-111111111102',
    'Sauti Sol & Friends: Homecoming Festival Live',
    'sauti-sol-homecoming-live-talanta-2026',
    'A breathtaking musical extravaganza featuring Kenya''s greatest Afro-pop collective with international special guests.',
    'Talanta Stadium transforms into an electric concert colosseum with 360-degree acoustic canopy coverage, pyrotechnics, and the legendary sounds of Sauti Sol performing their iconic catalogue alongside world-class African guest artists.',
    '2026-12-31',
    '20:00:00',
    '16:00:00',
    'Sauti Sol',
    'Special International Guests',
    'New Year''s Eve Spectacular',
    '/src/assets/images/talanta_stadium_concert_1793552928965.jpg',
    1500.00,
    25000.00,
    TRUE,
    'scheduled'
),
(
    '33333333-3333-3333-3333-333333333304',
    '11111111-1111-1111-1111-111111111104',
    'Kip Keino Classic 2027 – World Athletics Continental Tour',
    'kip-keino-classic-world-athletics-2027',
    'World champions, Olympic record-breakers, and Kenya''s finest sprint and middle-distance stars ignite the Talanta track.',
    'Sanctioned by World Athletics, the prestigious Kip Keino Classic brings Olympic medalists from across the globe to compete on Talanta Stadium''s high-performance synthetic running track.',
    '2027-04-18',
    '14:00:00',
    '10:30:00',
    'Team Kenya Athletics',
    'Global All-Stars',
    'World Athletics Continental Tour Gold',
    '/src/assets/images/talanta_stadium_exterior_1793552927909.jpg',
    300.00,
    6000.00,
    FALSE,
    'scheduled'
);

-- Ticket Types for Harambee Stars vs Côte d'Ivoire
INSERT INTO ticket_types (event_id, section_id, name, price_kes, sports_levy_kes, total_available, total_booked) VALUES
('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', 'VVIP Skybox Hospitality', 15000.00, 200.00, 300, 114),
('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222202', 'VIP Gold Terrace', 5000.00, 100.00, 3000, 1850),
('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222203', 'Category 1 West Concourse', 2000.00, 50.00, 10000, 7200),
('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222204', 'Category 2 East Grandstand', 1000.00, 50.00, 16000, 12800),
('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222205', 'Category 3 North Stand (Ultras)', 500.00, 20.00, 12000, 9400),
('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222206', 'Category 3 South Stand', 500.00, 20.00, 12000, 8100);

-- News Articles
INSERT INTO news (id, title, slug, category, excerpt, content, image_url, published_at, is_featured) VALUES
(
    '44444444-4444-4444-4444-444444444401',
    'CAF Technical Commission Approves Talanta Stadium for AFCON Tournament',
    'caf-approves-talanta-stadium-afcon',
    'Infrastructure',
    'Inspection inspectors award Talanta Stadium top FIFA Category 4 rating after testing acoustic roof, hybrid pitch and automated turnstiles.',
    'The Confederation of African Football (CAF) Stadium Inspection Committee has officially accredited Talanta Sports City Stadium as a premier Grade-A venue. The 60,000 capacity arena boasts pitch sub-air drainage, broadcast-grade LED floodlights, 12 executive dressing rooms, and digital automated ticketing gates.',
    '/src/assets/images/talanta_stadium_exterior_1793552927909.jpg',
    NOW() - INTERVAL '2 days',
    TRUE
),
(
    '44444444-4444-4444-4444-444444444402',
    'Kenya Railways Introduces Matchday Talanta Commuter Express Train Service',
    'kenya-railways-talanta-commuter-express',
    'Traffic & Transport',
    'Dedicated direct matchday trains will ferry fans from Nairobi Central Station directly to Talanta Stadium Station in 14 minutes.',
    'To guarantee effortless fan mobility and eliminate road congestion along Ngong Road, Kenya Railways in partnership with Talanta Stadium operations has announced special express commuter train frequencies before and after all international matches and concerts.',
    '/src/assets/images/talanta_stadium_interior_1793552928473.jpg',
    NOW() - INTERVAL '5 days',
    FALSE
),
(
    '44444444-4444-4444-4444-444444444403',
    'VVIP Presidential Lounge & Corporate Skyboxes Open for Annual Leasing',
    'vvip-presidential-lounge-annual-leasing',
    'Stadium News',
    'Corporate organizations and international delegations can now reserve bespoke private boxes overlooking the pitch.',
    'Talanta Stadium Management has unveiled exclusive hospitality packages for corporate entities. The VVIP suite offers private chef catering, private elevator access, meeting spaces, and prime midfield seating.',
    '/src/assets/images/talanta_stadium_vip_lounge_1793552928292.jpg',
    NOW() - INTERVAL '10 days',
    FALSE
);

-- Announcements
INSERT INTO announcements (headline, severity, is_active) VALUES
('Ticket Sales for Harambee Stars vs Côte d''Ivoire are now live on Safaricom M-Pesa. Early entry advised.', 'info', TRUE),
('Gate Turnstiles open 4 hours prior to kickoff. Ensure your national ID matches your digital ticket name.', 'warning', TRUE);
