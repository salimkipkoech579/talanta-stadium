import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

// 1. Users / Profiles table (Linked with Firebase UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  fullName: text('full_name'),
  phoneNumber: text('phone_number'),
  nationalId: text('national_id'),
  role: text('role').default('fan').notNull(), // 'fan', 'super_admin', 'match_operations'
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 2. Roles & Permissions table
export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  roleName: text('role_name').notNull().unique(),
  description: text('description'),
  permissions: text('permissions'), // JSON string of permission keys
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. Event Categories
export const eventCategories = pgTable('event_categories', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
});

// 4. Events
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  eventId: text('event_id').notNull().unique(), // e.g. evt_inaugural_bayern_ajax
  categoryId: text('category_id').notNull(),
  categoryName: text('category_name').notNull(),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  shortDescription: text('short_description'),
  fullDescription: text('full_description'),
  eventDate: text('event_date').notNull(), // YYYY-MM-DD
  startTime: text('start_time').notNull(), // HH:MM
  gatesOpenTime: text('gates_open_time').notNull(),
  homeTeam: text('home_team'),
  awayTeam: text('away_team'),
  tournamentName: text('tournament_name'),
  bannerImageUrl: text('banner_image_url'),
  venueName: text('venue_name').default('Talanta Sports City Stadium, Nairobi'),
  minPriceKes: integer('min_price_kes').default(500).notNull(),
  maxPriceKes: integer('max_price_kes').default(25000).notNull(),
  totalCapacity: integer('total_capacity').default(60000).notNull(),
  ticketsSold: integer('tickets_sold').default(0).notNull(),
  status: text('status').default('scheduled').notNull(), // 'scheduled', 'live', 'completed', 'cancelled'
  isFeatured: boolean('is_featured').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 5. Seating Sections
export const seatingSections = pgTable('seating_sections', {
  id: serial('id').primaryKey(),
  sectionCode: text('section_code').notNull().unique(), // VVIP_PRESIDENTIAL, VIP_GOLD_WEST, etc.
  name: text('name').notNull(),
  standLocation: text('stand_location').notNull(), // West, East, North, South
  tierLevel: text('tier_level').notNull(), // VVIP, VIP, Category 1, Category 2, Category 3
  capacity: integer('capacity').notNull(),
  gateEntrance: text('gate_entrance').notNull(),
  amenities: text('amenities'), // JSON string of amenities array
  colorHex: text('color_hex').notNull(),
  priceKes: integer('price_kes').notNull(),
  availableSeats: integer('available_seats').notNull(),
});

// 6. Seats
export const seats = pgTable('seats', {
  id: serial('id').primaryKey(),
  sectionId: integer('section_id').references(() => seatingSections.id),
  rowNumber: text('row_number').notNull(),
  seatNumber: integer('seat_number').notNull(),
  status: text('status').default('available').notNull(), // available, reserved, booked, maintenance
});

// 7. Ticket Types
export const ticketTypes = pgTable('ticket_types', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  basePriceKes: integer('base_price_kes').notNull(),
});

// 8. Bookings
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  bookingReference: text('booking_reference').notNull().unique(),
  userId: text('user_id').notNull(), // Firebase UID or local session user
  eventId: text('event_id').notNull(),
  eventTitle: text('event_title').notNull(),
  eventDate: text('event_date').notNull(),
  contactName: text('contact_name').notNull(),
  contactEmail: text('contact_email').notNull(),
  contactPhone: text('contact_phone').notNull(),
  nationalId: text('national_id').notNull(),
  subtotalKes: integer('subtotal_kes').notNull(),
  levyFeeKes: integer('levy_fee_kes').default(0).notNull(),
  totalAmountKes: integer('total_amount_kes').notNull(),
  status: text('status').default('pending').notNull(), // 'pending', 'confirmed', 'cancelled', 'refunded'
  createdAt: timestamp('created_at').defaultNow(),
});

// 9. Tickets
export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  ticketNumber: text('ticket_number').notNull().unique(),
  bookingReference: text('booking_reference').notNull().references(() => bookings.bookingReference),
  eventId: text('event_id').notNull(),
  eventTitle: text('event_title').notNull(),
  eventDate: text('event_date').notNull(),
  eventTime: text('event_time').notNull(),
  gatesOpenTime: text('gates_open_time').notNull(),
  attendeeName: text('attendee_name').notNull(),
  attendeeNationalId: text('attendee_national_id').notNull(),
  sectionCode: text('section_code').notNull(),
  sectionName: text('section_name').notNull(),
  standLocation: text('stand_location').notNull(),
  gateEntrance: text('gate_entrance').notNull(),
  turnstileNumber: text('turnstile_number').notNull(),
  seatInfo: text('seat_info').notNull(),
  priceKes: integer('price_kes').notNull(),
  qrCodeHash: text('qr_code_hash').notNull().unique(),
  status: text('status').default('valid').notNull(), // 'valid', 'scanned', 'cancelled', 'expired'
  scannedAt: text('scanned_at'),
  scannedGate: text('scanned_gate'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 10. Payments (Safaricom Daraja M-Pesa tracking)
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  checkoutRequestId: text('checkout_request_id').notNull().unique(),
  merchantRequestId: text('merchant_request_id'),
  bookingReference: text('booking_reference').notNull(),
  phoneNumber: text('phone_number').notNull(),
  amountKes: integer('amount_kes').notNull(),
  receiptNumber: text('receipt_number'),
  status: text('status').default('initiated').notNull(), // 'initiated', 'completed', 'failed'
  paymentDate: timestamp('payment_date').defaultNow(),
});

// 11. News & Press Releases
export const news = pgTable('news', {
  id: serial('id').primaryKey(),
  articleId: text('article_id').notNull().unique(),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  category: text('category').notNull(),
  excerpt: text('excerpt'),
  content: text('content'),
  authorName: text('author_name').default('Talanta Stadium Media Unit'),
  imageUrl: text('image_url'),
  isFeatured: boolean('is_featured').default(false).notNull(),
  publishedAt: timestamp('published_at').defaultNow(),
});

// 12. Announcements
export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  announcementId: text('announcement_id').notNull().unique(),
  headline: text('headline').notNull(),
  severity: text('severity').default('info').notNull(), // 'info', 'warning', 'critical'
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 13. Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  action: text('action').notNull(), // 'TICKET_SCANNED', 'BOOKING_CREATED', 'PAYMENT_CONFIRMED', etc.
  actorId: text('actor_id'),
  targetResource: text('target_resource'),
  details: text('details'),
  timestamp: timestamp('timestamp').defaultNow(),
});

// Relations
export const bookingsRelations = relations(bookings, ({ many }) => ({
  tickets: many(tickets),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  booking: one(bookings, {
    fields: [tickets.bookingReference],
    references: [bookings.bookingReference],
  }),
}));
