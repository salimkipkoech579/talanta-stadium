import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import {
  fetchEventsFromDb,
  fetchSectionsFromDb,
  fetchNewsFromDb,
  fetchAnnouncementsFromDb,
  recordBookingInDb,
  recordPaymentInDb,
  logAuditEvent,
} from './src/db/queries.ts';
import { getOrCreateUser, getUserByUid } from './src/db/users.ts';
import { adminAuth } from './src/lib/firebase-admin.ts';
import { optionalAuth, requireAuth } from './src/middleware/auth.ts';
import type { AuthRequest } from './src/middleware/auth.ts';
import { NAIROBI_ROOMS } from './src/constants/nairobiRooms.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());
app.use('/videos', express.static(path.resolve(__dirname, 'public/videos')));

interface ServerTicket {
  id: string;
  ticketNumber: string;
  bookingReference: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  gatesOpenTime: string;
  attendeeName: string;
  attendeeNationalId: string;
  sectionCode: string;
  sectionName: string;
  standLocation: string;
  gateEntrance: string;
  turnstileNumber: string;
  seatInfo: string;
  priceKes: number;
  qrCodeHash: string;
  status: 'valid' | 'scanned' | 'cancelled' | 'expired';
  scannedAt?: string;
  scannedGate?: string;
}

interface ServerBooking {
  id: string;
  bookingReference: string;
  userId: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  nationalId: string;
  subtotalKes: number;
  levyFeeKes: number;
  totalAmountKes: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  createdAt: string;
  tickets: ServerTicket[];
  paymentDetails?: {
    receiptNumber: string;
    phoneNumber: string;
    amountKes: number;
    paymentDate: string;
    checkoutRequestId?: string;
  };
}

const DB: {
  users: any[];
  sections: any[];
  events: any[];
  pastResults: any[];
  bookings: ServerBooking[];
  roomBookings: any[];
  news: any[];
  announcements: any[];
  mpesaTransactions: Map<string, any>;
} = {
  users: [
    {
      id: 'usr_fan_01',
      email: 'kipkoechvictor503@gmail.com',
      fullName: 'Victor Kipkoech',
      phoneNumber: '0712345678',
      nationalId: '34567890',
      role: 'fan',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 'usr_admin_01',
      email: 'operations@talantastadium.go.ke',
      fullName: 'Brig. Gen. (Rtd) M. Omondi',
      phoneNumber: '0722000000',
      nationalId: '12345678',
      role: 'super_admin',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 'usr_steward_01',
      email: 'steward.gate4@talantastadium.go.ke',
      fullName: 'Faith Muthoni',
      phoneNumber: '0733112233',
      nationalId: '28990112',
      role: 'match_operations',
    }
  ],
  sections: [],
  events: [],
  pastResults: [],
  bookings: [],
  roomBookings: [],
  news: [],
  announcements: [],
  mpesaTransactions: new Map<string, any>(),
};

const SITE_READINESS_MESSAGE = 'Ticketing and accommodation systems are currently not connected. Please re-enable the live platform configuration to accept bookings.';

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ ok: true, status: 'healthy', bookingPlatformReady: false });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] || 'usr_fan_01';
  const user = DB.users.find(u => u.id === userId) || DB.users[0];
  res.json({ user });
});

app.post('/api/auth/switch-role', (req: Request, res: Response) => {
  const { role } = req.body;
  const user = DB.users.find(u => u.role === role) || DB.users[0];
  res.json({ success: true, user });
});

app.post('/api/auth/firebase-login', async (req: Request, res: Response) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ error: 'Missing ID token' });
  }

  if (!process.env.GOOGLE_CLOUD_PROJECT && !process.env.FIREBASE_PROJECT_ID) {
    return res.status(503).json({ error: 'Firebase authentication is not configured for this deployment.' });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    const dbUser = await getOrCreateUser(
      decoded.uid,
      decoded.email || 'user@talantastadium.go.ke',
      decoded.name || decoded.email?.split('@')[0],
      'fan'
    );

    const sessionUser = {
      id: decoded.uid,
      email: decoded.email || '',
      fullName: decoded.name || decoded.email?.split('@')[0] || 'Fan',
      phoneNumber: (decoded as any).phone_number || '',
      nationalId: '',
      role: dbUser?.role || 'fan',
      avatarUrl: decoded.picture || '',
    };

    const existingIndex = DB.users.findIndex(u => u.id === decoded.uid);
    if (existingIndex >= 0) {
      DB.users[existingIndex] = sessionUser;
    } else {
      DB.users.push(sessionUser);
    }

    res.json({ success: true, user: sessionUser });
  } catch (err: any) {
    console.error('Firebase token verification error:', err);
    res.status(401).json({ error: 'Invalid authentication token' });
  }
});

app.get('/api/events', async (req: Request, res: Response) => {
  const { category, search } = req.query;
  let eventList: any[] = [];

  try {
    const dbEvents = await fetchEventsFromDb();
    if (dbEvents && dbEvents.length > 0) {
      eventList = dbEvents.map((e: any) => ({
        id: e.eventId,
        categoryId: e.categoryId,
        categoryName: e.categoryName,
        title: e.title,
        slug: e.slug,
        shortDescription: e.shortDescription,
        fullDescription: e.fullDescription,
        eventDate: e.eventDate,
        startTime: e.startTime,
        gatesOpenTime: e.gatesOpenTime,
        homeTeam: e.homeTeam,
        awayTeam: e.awayTeam,
        tournamentName: e.tournamentName,
        bannerImageUrl: e.bannerImageUrl,
        venueName: e.venueName,
        minPriceKes: e.minPriceKes,
        maxPriceKes: e.maxPriceKes,
        totalCapacity: e.totalCapacity,
        ticketsSold: e.ticketsSold,
        status: e.status,
        isFeatured: e.isFeatured,
      }));
    }
  } catch (err) {
    console.error('Error fetching events from Cloud SQL:', err);
  }

  let filtered = [...eventList];
  if (category && category !== 'all') filtered = filtered.filter(e => e.categoryId === category);
  if (search) {
    const s = String(search).toLowerCase();
    filtered = filtered.filter(e => e.title.toLowerCase().includes(s) || (e.tournamentName && e.tournamentName.toLowerCase().includes(s)));
  }

  res.json({ events: filtered });
});

app.get('/api/seating', async (_req: Request, res: Response) => {
  try {
    const dbSections = await fetchSectionsFromDb();
    if (dbSections && dbSections.length > 0) {
      const sections = dbSections.map((s: any) => ({
        id: `sec_${s.id}`,
        code: s.sectionCode,
        name: s.name,
        standLocation: s.standLocation,
        tierLevel: s.tierLevel,
        capacity: s.capacity,
        gateEntrance: s.gateEntrance,
        amenities: s.amenities ? (typeof s.amenities === 'string' ? JSON.parse(s.amenities) : s.amenities) : [],
        colorHex: s.colorHex,
        priceKes: s.priceKes,
        availableSeats: s.availableSeats,
      }));
      return res.json({ sections });
    }
  } catch (err) {
    console.error('Error querying seating sections from Cloud SQL:', err);
  }

  res.json({ sections: [] });
});

app.get('/api/fixtures/results', (_req: Request, res: Response) => {
  res.json({ results: [] });
});

app.get('/api/news', async (_req: Request, res: Response) => {
  let newsList: any[] = [];
  let annList: any[] = [];

  try {
    const [dbNews, dbAnnouncements] = await Promise.all([
      fetchNewsFromDb(),
      fetchAnnouncementsFromDb(),
    ]);

    if (dbNews && dbNews.length > 0) {
      newsList = dbNews.map((n: any) => ({
        id: n.articleId,
        title: n.title,
        slug: n.slug,
        category: n.category,
        excerpt: n.excerpt,
        content: n.content,
        authorName: n.authorName,
        imageUrl: n.imageUrl,
        publishedAt: n.publishedAt ? new Date(n.publishedAt).toISOString() : new Date().toISOString(),
        isFeatured: n.isFeatured,
      }));
    }

    if (dbAnnouncements && dbAnnouncements.length > 0) {
      annList = dbAnnouncements.map((a: any) => ({
        id: a.announcementId,
        headline: a.headline,
        severity: a.severity as any,
        isActive: a.isActive,
      }));
    }
  } catch (err) {
    console.error('Error querying news from Cloud SQL:', err);
  }

  res.json({ news: newsList, announcements: annList });
});

app.post('/api/bookings', (req: Request, res: Response) => {
  return res.status(503).json({
    error: 'Booking platform is disabled until payment and ticketing services are configured.',
    detail: SITE_READINESS_MESSAGE,
  });
});

app.post('/api/payments/mpesa/stkpush', (_req: Request, res: Response) => {
  return res.status(503).json({
    error: 'M-Pesa integration is not configured for this deployment.',
    detail: SITE_READINESS_MESSAGE,
  });
});

app.post('/api/payments/mpesa/simulate-callback', (_req: Request, res: Response) => {
  return res.status(503).json({
    error: 'Payment callback handling is disabled.',
    detail: SITE_READINESS_MESSAGE,
  });
});

app.get('/api/payments/status/:checkoutRequestId', (_req: Request, res: Response) => {
  return res.status(503).json({
    error: 'Payment status service is unavailable.',
    detail: SITE_READINESS_MESSAGE,
  });
});

app.get('/api/rooms', (_req: Request, res: Response) => {
  res.json({ total: 0, allCount: 0, rooms: [] });
});

app.get('/api/rooms/:id', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Accommodation availability is not configured.' });
});

app.post('/api/room-bookings', (_req: Request, res: Response) => {
  res.status(503).json({ error: 'Accommodation inventory is not available yet.' });
});

app.get('/api/bookings', (_req: Request, res: Response) => {
  res.json({ bookings: [] });
});

app.get('/api/admin/stats', (_req: Request, res: Response) => {
  res.json({
    totalRevenueKes: 0,
    totalTicketsSold: 0,
    activeEventsCount: 0,
    registeredUsersCount: 0,
    scannedTicketsCount: 0,
    gateThroughput: [],
    recentBookings: [],
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Talanta Stadium Platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
