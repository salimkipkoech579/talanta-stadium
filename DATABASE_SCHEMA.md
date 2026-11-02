# TALANTA STADIUM – KENYA | DATABASE & BACKEND ARCHITECTURE

Official Documentation for the Digital Stadium Experience & Ticketing Platform (Talanta Sports City / Raila Amolo Odinga International Stadium, Nairobi, Kenya).

---

## 1. Overview & Database Architecture

The platform uses a relational architecture designed for **Supabase PostgreSQL**, with high-performance indexing, audit logging, Row Level Security (RLS), and support for Safaricom Daraja M-Pesa STK Push.

The complete executable SQL migration script is located at:
`/supabase/schema.sql`

### Tables Implemented:
1. **`roles`**: Granular platform access levels (`super_admin`, `match_operations`, `ticketing_officer`, `fan`).
2. **`profiles`**: User metadata, national ID/passport numbers, phone numbers, and verification status.
3. **`event_categories`**: Sport & entertainment taxonomy (`football`, `rugby`, `athletics`, `concerts`).
4. **`events`**: Tournament matches, concert festivals, schedule, team rosters, venue details, and gate open times.
5. **`seating_sections`**: Stadium architecture tiers (`VVIP_PRESIDENTIAL`, `VIP_GOLD_WEST`, `CAT1_WEST_UPPER`, `CAT2_EAST_STAND`, `CAT3_NORTH_ULTRAS`, `CAT3_SOUTH_STAND`).
6. **`ticket_types`**: Event-specific pricing in Kenyan Shillings (KES), sports levy, and allocations.
7. **`seats`**: Detailed row and seat numbers for numbered sections.
8. **`bookings`**: Customer orders, M-Pesa contact information, and state machine (`pending`, `confirmed`, `cancelled`).
9. **`tickets`**: Cryptographic QR-hash verified digital tickets, turnstiles, gates, and steward check-in status.
10. **`payments`**: Safaricom Daraja M-Pesa STK push logs, checkout request IDs, M-Pesa transaction receipts (`Lipa na M-Pesa`), and raw callback payloads.
11. **`news`**: Stadium editorial, match reports, CAF/FIFA inspections, and transport advisories.
12. **`announcements`**: Marquee alerts for matchday transit, gate turnstiles, and security advisories.
13. **`audit_logs`**: Immutable security audit trail for turnstile scans, refunds, and permission changes.

---

## 2. Safaricom Daraja M-Pesa STK Push Integration

The backend supports two operating modes:

### A. Live / Sandbox Daraja API
Set the following environment variables in `.env`:
```bash
DARAJA_CONSUMER_KEY="your_safaricom_consumer_key"
DARAJA_CONSUMER_SECRET="your_safaricom_consumer_secret"
DARAJA_PASSKEY="your_lipa_na_mpesa_passkey"
DARAJA_BUSINESS_SHORTCODE="174379" # or your paybill/till number
DARAJA_ENV="sandbox" # or "production"
CALLBACK_URL="https://your-domain.com/api/payments/mpesa/callback"
```

### B. Instant Interactive Development & Demo Mode
In development or when Daraja credentials are not populated:
- The system automatically triggers the **Talanta Stadium Interactive M-Pesa Simulator**.
- An authentic Safaricom SIM Toolkit STK Push modal appears directly on the user's interface with audio beep, transaction summary, and PIN confirmation prompt.
- Confirmed PIN sends an automated Safaricom callback payload to the backend, updates the booking to `confirmed`, issues the official M-Pesa receipt number (`TKB...`), and generates cryptographic QR code tickets.

---

## 3. Deployment Instructions

### Local Development:
```bash
npm install
npm run dev
```
Dev server starts at `http://localhost:3000` with the Express API and Vite frontend running simultaneously.

### Production Build:
```bash
npm run build
npm start
```

### Supabase Deployment:
1. Log in to your [Supabase Dashboard](https://supabase.com).
2. Create a new project (e.g. `talanta-stadium-nairobi`).
3. Open the **SQL Editor** in the Supabase Dashboard.
4. Copy and paste the entire contents of `/supabase/schema.sql` and click **Run**.
5. Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in your environment.
