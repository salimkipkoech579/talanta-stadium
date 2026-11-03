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

// In-Memory Database Store (mirrors Supabase schema)
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

  sections: [
    {
      id: 'sec_vvip',
      code: 'VVIP_PRESIDENTIAL',
      name: 'VVIP Presidential Skybox Suite',
      standLocation: 'West',
      tierLevel: 'VVIP',
      capacity: 500,
      gateEntrance: 'Gate A - Ceremonial Presidential Plaza',
      amenities: ['Executive Skybox Lounge', '5-Star Kenyan Banquet & Bar', 'Pitchside Heated Glass View', 'Valet Reserved Parking', 'Dedicated Protocol Concierge'],
      colorHex: '#C5A059',
      priceKes: 15000,
      availableSeats: 386,
    },
    {
      id: 'sec_vip_gold',
      code: 'VIP_GOLD_WEST',
      name: 'VIP Gold Terrace (Lower West)',
      standLocation: 'West',
      tierLevel: 'VIP',
      capacity: 3500,
      gateEntrance: 'Gate B - West Executive Concourse',
      amenities: ['Padded Ergonomic Seating', 'VIP Concourse Bar & Dining', 'Fast-Track Turnstile Access', 'Souvenir Match Program'],
      colorHex: '#E5C378',
      priceKes: 5000,
      availableSeats: 1650,
    },
    {
      id: 'sec_cat1_west',
      code: 'CAT1_WEST_UPPER',
      name: 'Category 1 West Concourse',
      standLocation: 'West',
      tierLevel: 'Category 1',
      capacity: 12000,
      gateEntrance: 'Gate B & C - West Upper',
      amenities: ['Covered Canopy Protection', 'Midfield Sightlines', 'Concourse Kiosks'],
      colorHex: '#0FA958',
      priceKes: 2000,
      availableSeats: 4800,
    },
    {
      id: 'sec_cat2_east',
      code: 'CAT2_EAST_STAND',
      name: 'Category 2 East Grandstand',
      standLocation: 'East',
      tierLevel: 'Category 2',
      capacity: 18000,
      gateEntrance: 'Gate D & E - East Entrance',
      amenities: ['Panoramic TV Broadcast Angle', 'Spacious East Concourse', 'Rapid Turnstiles'],
      colorHex: '#005A2B',
      priceKes: 1000,
      availableSeats: 5200,
    },
    {
      id: 'sec_cat3_north',
      code: 'CAT3_NORTH_ULTRAS',
      name: 'Category 3 North Stand (Ultras & Fan Club)',
      standLocation: 'North',
      tierLevel: 'Category 3',
      capacity: 13000,
      gateEntrance: 'Gate F - North Concourse',
      amenities: ['Electric Fan Club Atmosphere', 'Safe-Standing & Chanting Rails', 'Official Drums & Flags Permitted'],
      colorHex: '#2B4234',
      priceKes: 500,
      availableSeats: 2600,
    },
    {
      id: 'sec_cat3_south',
      code: 'CAT3_SOUTH_STAND',
      name: 'Category 3 South Stand (Family & General)',
      standLocation: 'South',
      tierLevel: 'Category 3',
      capacity: 13000,
      gateEntrance: 'Gate G - South Concourse',
      amenities: ['Family Seating Zone', 'Direct Access to Commuter Rail Terminal'],
      colorHex: '#1C2B22',
      priceKes: 500,
      availableSeats: 4900,
    }
  ],

  events: [
    {
      id: 'evt_inaugural_bayern_ajax',
      categoryId: 'football',
      categoryName: 'Inaugural Grand Opening',
      title: 'Grand Inauguration: FC Bayern Munich vs AFC Ajax',
      slug: 'bayern-munich-vs-ajax-talanta-inaugural-2027',
      shortDescription: 'Kenya inaugurates the newly built 60,000-capacity Talanta Stadium with European football royalty on January 5th, 2027.',
      fullDescription: 'A historic day for Kenyan sports. The world-class 60,000 capacity Talanta Stadium (Raila Amolo Odinga International Stadium) opens its doors with an iconic showcase match between German champions Bayern Munich and Dutch powerhouses AFC Ajax. Experience the state-of-the-art hybrid pitch, the diagrid Maasai shield exterior, and electric Nairobi matchday atmosphere.',
      eventDate: '2027-01-05',
      startTime: '18:00',
      gatesOpenTime: '13:00',
      homeTeam: 'FC Bayern Munich',
      awayTeam: 'AFC Ajax Amsterdam',
      tournamentName: 'Talanta Stadium Inaugural Trophy',
      bannerImageUrl: '/assets/aistudio/images__23__66d33c9b.jpeg',
      venueName: 'Talanta Sports City Stadium, Nairobi',
      minPriceKes: 1000,
      maxPriceKes: 25000,
      totalCapacity: 60000,
      ticketsSold: 48920,
      status: 'scheduled' as const,
      isFeatured: true,
    },
    {
      id: 'evt_afcon_ken_civ',
      categoryId: 'football',
      categoryName: 'Football (CAF & FIFA)',
      title: 'Harambee Stars vs Côte d\'Ivoire (AFCON 2027 Qualifier)',
      slug: 'harambee-stars-vs-cote-divoire-2026',
      shortDescription: 'Kenya\'s national team hosts the African Champions in an electric 60,000 sell-out clash under Talanta floodlights.',
      fullDescription: 'A defining night in African football history. Harambee Stars take on the reigning continental giants Côte d\'Ivoire in Nairobi. Talanta Sports City features FIFA-grade hybrid turf, smart automated turnstiles, 360-degree LED boundary boards, and world-class hospitality.',
      eventDate: '2026-11-28',
      startTime: '19:00',
      gatesOpenTime: '15:00',
      homeTeam: 'Harambee Stars (KEN)',
      awayTeam: 'Côte d\'Ivoire (CIV)',
      tournamentName: 'CAF Africa Cup of Nations Qualifiers',
      bannerImageUrl: '/assets/aistudio/images__13__09ed1a8f.jpeg',
      venueName: 'Talanta Sports City Stadium, Nairobi',
      minPriceKes: 500,
      maxPriceKes: 15000,
      totalCapacity: 60000,
      ticketsSold: 40464,
      status: 'scheduled' as const,
      isFeatured: true,
    },
    {
      id: 'evt_mashemeji_derby',
      categoryId: 'football',
      categoryName: 'Football (FKF Premier League)',
      title: 'Mashemeji Derby: Gor Mahia FC vs AFC Leopards SC',
      slug: 'mashemeji-derby-gor-mahia-afc-leopards-2026',
      shortDescription: 'East Africa\'s ultimate football rivalry brings roaring color, passion, and pride to Talanta Stadium.',
      fullDescription: 'The 96th edition of the Mashemeji Derby. K\'Ogalo against Ingwe. The green and white legions face off with the blue-and-white hoops in what is projected to be the most attended league match in Kenyan history.',
      eventDate: '2026-12-12',
      startTime: '16:00',
      gatesOpenTime: '12:00',
      homeTeam: 'Gor Mahia FC',
      awayTeam: 'AFC Leopards SC',
      tournamentName: 'FKF Premier League',
      bannerImageUrl: '/assets/aistudio/images__7__974ef065.jpeg',
      venueName: 'Talanta Sports City Stadium, Nairobi',
      minPriceKes: 400,
      maxPriceKes: 8000,
      totalCapacity: 60000,
      ticketsSold: 32180,
      status: 'scheduled' as const,
      isFeatured: false,
    },
    {
      id: 'evt_sauti_sol_live',
      categoryId: 'concerts',
      categoryName: 'Mega Concerts & Festivals',
      title: 'Sauti Sol & Friends: Homecoming Festival Live',
      slug: 'sauti-sol-homecoming-live-talanta-2026',
      shortDescription: 'Kenya\'s global afro-pop icons return to head an epic New Year\'s Eve stadium spectacular.',
      fullDescription: '50,000 music enthusiasts celebrate live music at Talanta Stadium. Featuring breathtaking golden pyrotechnics, acoustic canopy distribution, multiple stage layouts, and special international African guest artists.',
      eventDate: '2026-12-31',
      startTime: '20:00',
      gatesOpenTime: '16:00',
      homeTeam: 'Sauti Sol',
      awayTeam: 'Special International Guests',
      tournamentName: 'Nairobi NYE Festival',
      bannerImageUrl: '/assets/aistudio/images__12__cd65bb66.jpeg',
      venueName: 'Talanta Sports City Stadium, Nairobi',
      minPriceKes: 1500,
      maxPriceKes: 25000,
      totalCapacity: 50000,
      ticketsSold: 28400,
      status: 'scheduled' as const,
      isFeatured: false,
    },
    {
      id: 'evt_kip_keino_classic',
      categoryId: 'athletics',
      categoryName: 'World Athletics',
      title: 'Kip Keino Classic 2027 – Continental Tour Gold',
      slug: 'kip-keino-classic-world-athletics-2027',
      shortDescription: 'Olympic medalists and world sprint champions ignite Talanta Stadium\'s high-speed synthetic track.',
      fullDescription: 'Part of the elite World Athletics Continental Tour Gold circuit. See 100m, 800m, 1500m and 3000m steeplechase world champions battle under the Nairobi sunshine.',
      eventDate: '2027-04-18',
      startTime: '14:00',
      gatesOpenTime: '10:30',
      homeTeam: 'Team Kenya Athletics',
      awayTeam: 'Global All-Stars',
      tournamentName: 'World Athletics Continental Tour Gold',
      bannerImageUrl: '/assets/aistudio/images__18__b0a77f48.jpeg',
      venueName: 'Talanta Sports City Stadium, Nairobi',
      minPriceKes: 300,
      maxPriceKes: 6000,
      totalCapacity: 60000,
      ticketsSold: 14200,
      status: 'scheduled' as const,
      isFeatured: false,
    }
  ],

  pastResults: [
    {
      id: 'res_01',
      match: 'Harambee Stars vs Uganda Cranes',
      tournament: 'CECAFA Senior Challenge Cup Final',
      date: '2026-10-14',
      score: '2 - 1',
      stadium: 'Talanta Sports City',
      attendance: '58,240',
      highlightsUrl: '#',
    },
    {
      id: 'res_02',
      match: 'Kenya Simbas vs Zimbabwe Goshawks',
      tournament: 'Rugby Africa Cup Final',
      date: '2026-09-27',
      score: '31 - 24',
      stadium: 'Talanta Sports City',
      attendance: '34,900',
      highlightsUrl: '#',
    }
  ],

  bookings: [
    {
      id: 'bkg_sample_01',
      bookingReference: 'TS-2026-NBO-84729',
      userId: 'usr_fan_01',
      eventId: 'evt_afcon_ken_civ',
      eventTitle: 'Harambee Stars vs Côte d\'Ivoire (AFCON 2027 Qualifier)',
      eventDate: '2026-11-28',
      contactName: 'Victor Kipkoech',
      contactEmail: 'kipkoechvictor503@gmail.com',
      contactPhone: '0712345678',
      nationalId: '34567890',
      subtotalKes: 5000,
      levyFeeKes: 100,
      totalAmountKes: 5100,
      status: 'confirmed' as const,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      paymentDetails: {
        receiptNumber: 'TKB8910245',
        phoneNumber: '254712345678',
        amountKes: 5100,
        paymentDate: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      tickets: [
        {
          id: 'tkt_demo_01',
          ticketNumber: 'TKT-KEN-84729-01',
          bookingReference: 'TS-2026-NBO-84729',
          eventId: 'evt_afcon_ken_civ',
          eventTitle: 'Harambee Stars vs Côte d\'Ivoire (AFCON 2027 Qualifier)',
          eventDate: '2026-11-28',
          eventTime: '19:00',
          gatesOpenTime: '15:00',
          attendeeName: 'Victor Kipkoech',
          attendeeNationalId: '34567890',
          sectionCode: 'VIP_GOLD_WEST',
          sectionName: 'VIP Gold Terrace (Lower West)',
          standLocation: 'West Stand',
          gateEntrance: 'Gate B - West Executive Concourse',
          turnstileNumber: 'Turnstile B4',
          seatInfo: 'VIP Gold Block C | Row 7 | Seat 22',
          priceKes: 5000,
          qrCodeHash: 'TS-HASH-TKT-KEN-84729-01-SECURE-VIP',
          status: 'valid' as const,
        }
      ]
    }
  ],

  news: [
    {
      id: 'news_00_inaugural',
      title: 'Kenya Confirms 60,000-Capacity Talanta Stadium Inauguration: Bayern Munich vs Ajax on January 5th, 2027',
      slug: 'kenya-confirms-bayern-munich-vs-ajax-inaugural',
      category: 'Official Inauguration',
      excerpt: 'Kenya will open the newly built 60,000 capacity Talanta Stadium with a blockbuster showdown between Bayern Munich and AFC Ajax.',
      content: 'In a landmark announcement for Kenyan and African sports, Talanta Stadium (Raila Amolo Odinga International Stadium) in Nairobi will officially open on January 5th, 2027 with European football royalty: German powerhouse FC Bayern Munich battling Dutch giants AFC Ajax Amsterdam. The match will test all 72 automated turnstile gates, hybrid turf pitch, and executive skybox suites.',
      authorName: 'Ministry of Sports & Talanta Bureau',
      imageUrl: '/assets/aistudio/Screenshot_20261101-192730_fc987783.jpg',
      publishedAt: '2026-11-01T08:00:00Z',
      isFeatured: true,
    },
    {
      id: 'news_01',
      title: 'Iconic Maasai Shield & Crossed Spears Facade Installed on Diagrid Canopy',
      slug: 'maasai-shield-facade-installed-talanta',
      category: 'Architecture',
      excerpt: 'The national emblem of Kenya now adorns the white woven diagrid exterior, symbolizing the strength of Kenyan athletes.',
      content: 'The architectural centerpiece of Talanta Sports City has reached completion with the mounting of the towering Kenyan Maasai Shield and crossed spears on the exterior facade. The woven lattice structure reflects indigenous craft while providing shading and natural ventilation.',
      authorName: 'Talanta Communications Office',
      imageUrl: '/assets/aistudio/images__23__66d33c9b.jpeg',
      publishedAt: '2026-10-30T10:00:00Z',
      isFeatured: true,
    },
    {
      id: 'news_02',
      title: 'Night Illumination & 360-Degree LED Boundary Tests Complete',
      slug: 'night-illumination-led-boundary-tests',
      category: 'Technology',
      excerpt: 'Stunning aerial night tests show the stadium radiating over the Nairobi skyline with green pitch floodlights and glowing facade.',
      content: 'Engineers have concluded full-power lighting tests of the 2,500 lux broadcast-grade LED system. The stadium will be completely flicker-free for 4K global broadcast and features automated emergency backup generators with solar canopy support.',
      authorName: 'Engineering & Technology Desk',
      imageUrl: '/assets/aistudio/images__12__cd65bb66.jpeg',
      publishedAt: '2026-10-28T14:30:00Z',
      isFeatured: false,
    },
    {
      id: 'news_03',
      title: 'Executive VVIP Presidential Skyboxes & Glass Suites Unveiled',
      slug: 'vvip-presidential-lounge-annual-leasing',
      category: 'Hospitality',
      excerpt: 'Corporate organizations and international delegations can now tour the luxury suites overlooking the pitch.',
      content: 'Talanta Stadium Management has unveiled exclusive hospitality packages. Each suite includes private chef dining, sommelier bar services, dedicated turnstile elevator access, and cushioned balcony seats with direct views of the center circle.',
      authorName: 'Commercial Partnerships',
      imageUrl: '/assets/aistudio/images__10__2fa6bda6.jpeg',
      publishedAt: '2026-10-24T09:15:00Z',
      isFeatured: false,
    }
  ],

  announcements: [
    {
      id: 'ann_01',
      headline: 'Match tickets for Harambee Stars vs Côte d\'Ivoire are selling fast on Safaricom M-Pesa. Gates open at 3:00 PM.',
      severity: 'info' as const,
      isActive: true,
    },
    {
      id: 'ann_02',
      headline: 'Security Notice: Please bring original National ID / Passport matching the name printed on your digital ticket.',
      severity: 'warning' as const,
      isActive: true,
    }
  ],

  mpesaTransactions: new Map<string, any>(),
  roomBookings: []
};

// ==========================================
// API ROUTES
// ==========================================

// Current user profile session
app.get('/api/auth/me', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] || 'usr_fan_01';
  const user = DB.users.find(u => u.id === userId) || DB.users[0];
  res.json({ user });
});

// Switch role/user for demo
app.post('/api/auth/switch-role', (req: Request, res: Response) => {
  const { role } = req.body;
  const user = DB.users.find(u => u.role === role) || DB.users[0];
  res.json({ success: true, user });
});

// Firebase Google Login verification & Cloud SQL user sync
app.post('/api/auth/firebase-login', async (req: Request, res: Response) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ error: 'Missing ID token' });
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

// Events List
app.get('/api/events', async (req: Request, res: Response) => {
  const { category, search } = req.query;
  let eventList = [...DB.events];

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

  if (category && category !== 'all') {
    filtered = filtered.filter(e => e.categoryId === category);
  }
  if (search) {
    const s = String(search).toLowerCase();
    filtered = filtered.filter(e => e.title.toLowerCase().includes(s) || (e.tournamentName && e.tournamentName.toLowerCase().includes(s)));
  }

  res.json({ events: filtered });
});

// Event Details with Sections
app.get('/api/events/:id', (req: Request, res: Response) => {
  const event = DB.events.find(e => e.id === req.params.id || e.slug === req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.json({ event, sections: DB.sections });
});

// Create Event (Admin)
app.post('/api/events', (req: Request, res: Response) => {
  const newEvent = {
    id: `evt_${Date.now()}`,
    categoryId: req.body.categoryId || 'football',
    categoryName: req.body.categoryName || 'Football',
    title: req.body.title,
    slug: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    shortDescription: req.body.shortDescription || '',
    fullDescription: req.body.fullDescription || '',
    eventDate: req.body.eventDate,
    startTime: req.body.startTime || '16:00',
    gatesOpenTime: req.body.gatesOpenTime || '12:00',
    homeTeam: req.body.homeTeam || '',
    awayTeam: req.body.awayTeam || '',
    tournamentName: req.body.tournamentName || 'Special Event',
    bannerImageUrl: req.body.bannerImageUrl || '/src/assets/images/talanta_stadium_interior_1793552928473.jpg',
    venueName: 'Talanta Sports City Stadium, Nairobi',
    minPriceKes: Number(req.body.minPriceKes) || 500,
    maxPriceKes: Number(req.body.maxPriceKes) || 10000,
    totalCapacity: Number(req.body.totalCapacity) || 60000,
    ticketsSold: 0,
    status: 'scheduled' as const,
    isFeatured: Boolean(req.body.isFeatured),
  };
  DB.events.unshift(newEvent);
  res.status(201).json({ event: newEvent });
});

// Update Event (Admin)
app.put('/api/events/:id', (req: Request, res: Response) => {
  const index = DB.events.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }
  DB.events[index] = { ...DB.events[index], ...req.body };
  res.json({ event: DB.events[index] });
});

// Delete Event (Admin)
app.delete('/api/events/:id', (req: Request, res: Response) => {
  const index = DB.events.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }
  const deleted = DB.events.splice(index, 1);
  res.json({ success: true, deleted: deleted[0] });
});

// Manual Ticket Issuance (Admin/Steward manual ticketing)
app.post('/api/tickets/issue-manual', (req: Request, res: Response) => {
  const { eventId, sectionCode, attendeeName, attendeeNationalId, contactPhone, seatInfo } = req.body;
  const event = DB.events.find(e => e.id === eventId) || DB.events[0];
  const section = DB.sections.find(s => s.code === sectionCode) || DB.sections[0];

  const randomRefDigits = Math.floor(10000 + Math.random() * 90000);
  const bookingReference = `TS-MANUAL-${randomRefDigits}`;
  const ticketNumber = `TKT-VIP-${randomRefDigits}-01`;
  const hash = crypto.createHash('sha256')
    .update(`${ticketNumber}-${bookingReference}-${section.code}-${attendeeNationalId}`)
    .digest('hex');

  const newTicket: ServerTicket = {
    id: `tkt_manual_${Date.now()}`,
    ticketNumber,
    bookingReference,
    eventId: event.id,
    eventTitle: event.title,
    eventDate: event.eventDate,
    eventTime: event.startTime,
    gatesOpenTime: event.gatesOpenTime,
    attendeeName: attendeeName || 'VIP Guest',
    attendeeNationalId: attendeeNationalId || 'N/A',
    sectionCode: section.code,
    sectionName: section.name,
    standLocation: `${section.standLocation} Stand`,
    gateEntrance: section.gateEntrance,
    turnstileNumber: `Turnstile ${section.standLocation.charAt(0)}1`,
    seatInfo: seatInfo || `${section.tierLevel} | Reserved Manual Pass`,
    priceKes: section.priceKes,
    qrCodeHash: hash,
    status: 'valid',
  };

  const manualBooking: ServerBooking = {
    id: `bkg_manual_${Date.now()}`,
    bookingReference,
    userId: 'usr_fan_01',
    eventId: event.id,
    eventTitle: event.title,
    eventDate: event.eventDate,
    contactName: attendeeName || 'VIP Guest',
    contactEmail: 'manual.desk@talantastadium.go.ke',
    contactPhone: contactPhone || '0700000000',
    nationalId: attendeeNationalId || 'MANUAL',
    tickets: [newTicket],
    subtotalKes: section.priceKes,
    levyFeeKes: 0,
    totalAmountKes: section.priceKes,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    paymentDetails: {
      receiptNumber: `MANUAL-${Math.floor(100000 + Math.random() * 900000)}`,
      phoneNumber: contactPhone || '0700000000',
      amountKes: section.priceKes,
      paymentDate: new Date().toISOString(),
    }
  };

  DB.bookings.unshift(manualBooking);
  event.ticketsSold += 1;

  res.status(201).json({ success: true, booking: manualBooking, ticket: newTicket });
});

// Post Announcement (Admin)
app.post('/api/announcements', (req: Request, res: Response) => {
  const newAnn = {
    id: `ann_${Date.now()}`,
    headline: req.body.headline,
    severity: req.body.severity || 'info',
    isActive: true,
  };
  DB.announcements.unshift(newAnn);
  res.status(201).json({ announcement: newAnn });
});

// Seating sections list
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
  res.json({ sections: DB.sections });
});

// Past Results
app.get('/api/fixtures/results', (_req: Request, res: Response) => {
  res.json({ results: DB.pastResults });
});

// News & Announcements
app.get('/api/news', async (_req: Request, res: Response) => {
  let newsList = DB.news;
  let annList = DB.announcements.filter(a => a.isActive);

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

app.post('/api/news', (req: Request, res: Response) => {
  const newArticle = {
    id: `news_${Date.now()}`,
    title: req.body.title,
    slug: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: req.body.category || 'Stadium News',
    excerpt: req.body.excerpt,
    content: req.body.content,
    authorName: req.body.authorName || 'Talanta Stadium Media Unit',
    imageUrl: req.body.imageUrl || '/src/assets/images/talanta_stadium_exterior_1793552927909.jpg',
    publishedAt: new Date().toISOString(),
    isFeatured: Boolean(req.body.isFeatured),
  };
  DB.news.unshift(newArticle);
  res.status(201).json({ article: newArticle });
});

// Create Booking (Initiates Reservation)
app.post('/api/bookings', (req: Request, res: Response) => {
  const {
    eventId,
    sectionCode,
    quantity,
    contactName,
    contactEmail,
    contactPhone,
    nationalId,
    attendees
  } = req.body;

  const event = DB.events.find(e => e.id === eventId);
  const section = DB.sections.find(s => s.code === sectionCode);

  if (!event || !section) {
    return res.status(400).json({ error: 'Invalid event or section selected' });
  }

  const ticketQty = Math.max(1, Math.min(Number(quantity) || 1, 6));
  const subtotalKes = section.priceKes * ticketQty;
  const levyFeeKes = ticketQty * 50; // Sports Development Levy 50 KES per ticket
  const totalAmountKes = subtotalKes + levyFeeKes;

  const randomRefDigits = Math.floor(10000 + Math.random() * 90000);
  const bookingReference = `TS-2026-NBO-${randomRefDigits}`;

  // Prepare tickets
  const generatedTickets = [];
  for (let i = 0; i < ticketQty; i++) {
    const attendee = (attendees && attendees[i]) || { name: contactName, nationalId };
    const ticketIndex = i + 1;
    const ticketNumber = `TKT-KEN-${randomRefDigits}-0${ticketIndex}`;
    const hash = crypto.createHash('sha256')
      .update(`${ticketNumber}-${bookingReference}-${section.code}-${attendee.nationalId}`)
      .digest('hex');

    const randomSeat = Math.floor(1 + Math.random() * 90);
    const randomRow = ['A', 'B', 'C', 'D', 'E', 'F', 'G'][Math.floor(Math.random() * 7)];

    generatedTickets.push({
      id: `tkt_${Date.now()}_${i}`,
      ticketNumber,
      bookingReference,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.eventDate,
      eventTime: event.startTime,
      gatesOpenTime: event.gatesOpenTime,
      attendeeName: attendee.name,
      attendeeNationalId: attendee.nationalId,
      sectionCode: section.code,
      sectionName: section.name,
      standLocation: `${section.standLocation} Stand`,
      gateEntrance: section.gateEntrance,
      turnstileNumber: `Turnstile ${section.standLocation.charAt(0)}${Math.floor(1 + Math.random() * 8)}`,
      seatInfo: `${section.tierLevel} | Row ${randomRow} | Seat ${randomSeat}`,
      priceKes: section.priceKes,
      qrCodeHash: hash,
      status: 'valid' as const,
    });
  }

  const newBooking = {
    id: `bkg_${Date.now()}`,
    bookingReference,
    userId: req.body.userId || 'usr_fan_01',
    eventId: event.id,
    eventTitle: event.title,
    eventDate: event.eventDate,
    contactName,
    contactEmail,
    contactPhone,
    nationalId,
    tickets: generatedTickets,
    subtotalKes,
    levyFeeKes,
    totalAmountKes,
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
  };

  DB.bookings.unshift(newBooking);

  // Persist to Cloud SQL asynchronously
  recordBookingInDb(newBooking, generatedTickets).catch((err) => {
    console.error('Error persisting booking to Cloud SQL:', err);
  });
  logAuditEvent('BOOKING_CREATED', newBooking.userId, newBooking.bookingReference, JSON.stringify({ amount: totalAmountKes }));

  res.status(201).json({
    booking: newBooking,
    amountKes: totalAmountKes,
    bookingReference,
  });
});

// Safaricom Daraja M-Pesa STK Push Endpoint
app.post('/api/payments/mpesa/stkpush', (req: Request, res: Response) => {
  const { bookingReference, phoneNumber, amountKes } = req.body;

  const booking = DB.bookings.find(b => b.bookingReference === bookingReference);
  if (!booking) {
    return res.status(404).json({ error: 'Booking reference not found' });
  }

  // Format phone number to standard Kenyan 254XXXXXXXXX
  let cleanedPhone = String(phoneNumber).replace(/[^0-9]/g, '');
  if (cleanedPhone.startsWith('0')) {
    cleanedPhone = '254' + cleanedPhone.slice(1);
  } else if (!cleanedPhone.startsWith('254')) {
    cleanedPhone = '254' + cleanedPhone;
  }

  const checkoutRequestId = `ws_CO_${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`;
  const merchantRequestId = `MR_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

  // Store transaction tracking
  const txRecord = {
    checkoutRequestId,
    merchantRequestId,
    bookingReference,
    phoneNumber: cleanedPhone,
    amountKes: amountKes || booking.totalAmountKes,
    status: 'initiated', // 'initiated', 'completed', 'failed'
    timestamp: new Date().toISOString(),
    receiptNumber: '',
  };

  DB.mpesaTransactions.set(checkoutRequestId, txRecord);

  // Return prompt response
  res.json({
    success: true,
    CustomerMessage: `Success. Request accepted for processing on ${cleanedPhone}. Please enter your M-Pesa PIN on your handset.`,
    CheckoutRequestID: checkoutRequestId,
    MerchantRequestID: merchantRequestId,
    ResponseCode: '0',
    ResponseDescription: 'Success. Request accepted for processing',
    bookingReference,
    amountKes: txRecord.amountKes,
    phone: cleanedPhone,
  });
});

// Simulate or Process M-Pesa Callback (For Demo mode or Live webhook)
app.post('/api/payments/mpesa/simulate-callback', (req: Request, res: Response) => {
  const { checkoutRequestId, pin, isSuccess = true } = req.body;

  const tx = DB.mpesaTransactions.get(checkoutRequestId);
  if (!tx) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  if (!isSuccess) {
    tx.status = 'failed';
    return res.json({ success: false, message: 'Transaction cancelled by user.' });
  }

  // Generate genuine Safaricom format receipt code (e.g. TKB9482701)
  const letters = 'TKBCDFGHJKLMNPQRSTVWXYZ';
  const prefix = letters[Math.floor(Math.random() * letters.length)] + letters[Math.floor(Math.random() * letters.length)] + 'B';
  const randomDigits = Math.floor(1000000 + Math.random() * 9000000);
  const mpesaReceiptNumber = `${prefix}${randomDigits}`;

  tx.status = 'completed';
  tx.receiptNumber = mpesaReceiptNumber;
  tx.completedAt = new Date().toISOString();

  // Confirm booking
  const booking = DB.bookings.find(b => b.bookingReference === tx.bookingReference);
  if (booking) {
    booking.status = 'confirmed';
    booking.paymentDetails = {
      receiptNumber: mpesaReceiptNumber,
      phoneNumber: tx.phoneNumber,
      amountKes: tx.amountKes,
      paymentDate: tx.completedAt,
      checkoutRequestId,
    };

    // Increment tickets sold on event
    const event = DB.events.find(e => e.id === booking.eventId);
    if (event) {
      event.ticketsSold += booking.tickets.length;
    }

    // Persist payment to Cloud SQL
    recordPaymentInDb(tx).catch((err) => {
      console.error('Error persisting payment to Cloud SQL:', err);
    });
    logAuditEvent('PAYMENT_CONFIRMED', tx.phoneNumber, tx.bookingReference, JSON.stringify({ receipt: mpesaReceiptNumber, amount: tx.amountKes }));
  }

  res.json({
    success: true,
    message: 'M-Pesa payment verified successfully',
    receiptNumber: mpesaReceiptNumber,
    booking,
  });
});

// Check Payment Status (Polling endpoint)
app.get('/api/payments/status/:checkoutRequestId', (req: Request, res: Response) => {
  const tx = DB.mpesaTransactions.get(req.params.checkoutRequestId);
  if (!tx) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  const booking = DB.bookings.find(b => b.bookingReference === tx.bookingReference);
  res.json({
    checkoutRequestId: tx.checkoutRequestId,
    status: tx.status,
    receiptNumber: tx.receiptNumber,
    booking,
  });
});

// Get Bookings for User or Admin
app.get('/api/bookings', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  const role = req.headers['x-user-role'] as string;

  if (role === 'super_admin' || role === 'ticketing_officer') {
    return res.json({ bookings: DB.bookings });
  }

  const userBookings = DB.bookings.filter(b => b.userId === (userId || 'usr_fan_01'));
  res.json({ bookings: userBookings });
});

// Single Booking by Reference
app.get('/api/bookings/:reference', (req: Request, res: Response) => {
  const booking = DB.bookings.find(b => b.bookingReference === req.params.reference);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  res.json({ booking });
});

// Cancel eligible booking
app.post('/api/bookings/:id/cancel', (req: Request, res: Response) => {
  const booking = DB.bookings.find(b => b.id === req.params.id || b.bookingReference === req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  booking.status = 'cancelled';
  booking.tickets.forEach(t => {
    t.status = 'cancelled';
  });

  res.json({ success: true, message: 'Booking cancelled successfully. M-Pesa refund request queued.', booking });
});

// ==========================================
// NAIROBI 50 CLASSIC ROOMS API ROUTES
// ==========================================

// Get all 50 classic Nairobi rooms with filters & sorting
app.get('/api/rooms', (req: Request, res: Response) => {
  const { neighborhood, category, search, minPrice, maxPrice, sortBy } = req.query;

  let rooms = [...NAIROBI_ROOMS];

  if (neighborhood && neighborhood !== 'all') {
    rooms = rooms.filter(r => r.neighborhood.toLowerCase() === String(neighborhood).toLowerCase());
  }

  if (category && category !== 'all') {
    rooms = rooms.filter(r => r.spaceCategory.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const s = String(search).toLowerCase();
    rooms = rooms.filter(r =>
      r.hotelName.toLowerCase().includes(s) ||
      r.roomName.toLowerCase().includes(s) ||
      r.neighborhood.toLowerCase().includes(s) ||
      r.classicFeatures.some(f => f.toLowerCase().includes(s))
    );
  }

  if (minPrice) {
    const min = Number(minPrice);
    if (!isNaN(min)) rooms = rooms.filter(r => r.pricePerNightKes >= min);
  }

  if (maxPrice) {
    const max = Number(maxPrice);
    if (!isNaN(max)) rooms = rooms.filter(r => r.pricePerNightKes <= max);
  }

  // Sort
  if (sortBy === 'price_asc') {
    rooms.sort((a, b) => a.pricePerNightKes - b.pricePerNightKes);
  } else if (sortBy === 'price_desc') {
    rooms.sort((a, b) => b.pricePerNightKes - a.pricePerNightKes);
  } else if (sortBy === 'rating') {
    rooms.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'distance') {
    rooms.sort((a, b) => a.distanceKm - b.distanceKm);
  } else if (sortBy === 'space') {
    rooms.sort((a, b) => b.floorAreaSqM - a.floorAreaSqM);
  }

  res.json({
    total: rooms.length,
    allCount: NAIROBI_ROOMS.length,
    rooms,
  });
});

// Single room by ID
app.get('/api/rooms/:id', (req: Request, res: Response) => {
  const room = NAIROBI_ROOMS.find(r => r.id === req.params.id);
  if (!room) {
    return res.status(404).json({ error: 'Classic room not found' });
  }
  res.json({ room });
});

// Create Room Booking
app.post('/api/room-bookings', (req: Request, res: Response) => {
  const {
    roomId,
    checkInDate,
    checkOutDate,
    guestCount = 2,
    guestName,
    guestPhone,
    guestEmail,
    nationalId,
    specialRequests = '',
    userId = 'usr_fan_01',
  } = req.body;

  const room = NAIROBI_ROOMS.find(r => r.id === roomId);
  if (!room) {
    return res.status(404).json({ error: 'Room not found in Nairobi collection' });
  }

  if (!checkInDate || !checkOutDate || !guestName || !guestPhone) {
    return res.status(400).json({ error: 'Please provide check-in date, check-out date, guest name, and phone number' });
  }

  // Calculate nights
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const diffTime = checkOut.getTime() - checkIn.getTime();
  const calculatedNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const subtotalKes = calculatedNights * room.pricePerNightKes;
  const tourismLevyKes = Math.round(subtotalKes * 0.02); // 2% Kenya Tourism Training & Infrastructure Levy
  const totalAmountKes = subtotalKes + tourismLevyKes;

  const randomRefNum = Math.floor(10000 + Math.random() * 90000);
  const bookingReference = `HTL-NBO-${randomRefNum}`;
  const qrCodeToken = `NBO-HOTEL-${bookingReference}-${room.id}-${Date.now()}`;

  const newRoomBooking = {
    id: `rm_bkg_${Date.now()}`,
    bookingReference,
    userId,
    roomId: room.id,
    roomName: room.roomName,
    hotelName: room.hotelName,
    neighborhood: room.neighborhood,
    address: room.address,
    checkInDate,
    checkOutDate,
    nights: calculatedNights,
    guestCount: Number(guestCount) || 2,
    guestName,
    guestPhone,
    guestEmail: guestEmail || 'guest@example.com',
    nationalId: nationalId || '34567890',
    specialRequests,
    pricePerNightKes: room.pricePerNightKes,
    subtotalKes,
    tourismLevyKes,
    totalAmountKes,
    status: 'confirmed',
    imageUrl: room.imageUrl,
    distanceToTalanta: room.distanceToTalanta,
    matchdayShuttleIncluded: room.matchdayShuttleIncluded,
    qrCodeToken,
    createdAt: new Date().toISOString(),
    paymentReceipt: `TK${Math.floor(10000000 + Math.random() * 90000000)}`,
  };

  DB.roomBookings.unshift(newRoomBooking);

  logAuditEvent('ROOM_BOOKED', userId, bookingReference, JSON.stringify({ hotel: room.hotelName, amount: totalAmountKes }));

  res.status(201).json({
    success: true,
    booking: newRoomBooking,
  });
});

// Get User Room Bookings
app.get('/api/room-bookings', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  const userBookings = DB.roomBookings.filter(b => b.userId === (userId || 'usr_fan_01'));
  res.json({ bookings: userBookings });
});

// Cancel Room Booking
app.post('/api/room-bookings/:id/cancel', (req: Request, res: Response) => {
  const booking = DB.roomBookings.find(b => b.id === req.params.id || b.bookingReference === req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Room booking not found' });
  }

  booking.status = 'cancelled';
  res.json({ success: true, message: 'Room reservation cancelled successfully.', booking });
});

// Steward / Turnstile QR Code Verification Endpoint
app.post('/api/tickets/verify', (req: Request, res: Response) => {
  const { qrHash, ticketNumber, gate } = req.body;

  let matchedTicket: any = null;
  let matchedBooking: any = null;

  for (const b of DB.bookings) {
    for (const t of b.tickets) {
      if (
        (qrHash && t.qrCodeHash === qrHash) ||
        (ticketNumber && t.ticketNumber.toUpperCase() === String(ticketNumber).trim().toUpperCase())
      ) {
        matchedTicket = t;
        matchedBooking = b;
        break;
      }
    }
    if (matchedTicket) break;
  }

  if (!matchedTicket) {
    return res.status(404).json({
      valid: false,
      status: 'invalid',
      title: 'INVALID TICKET',
      message: 'Ticket not found in the Talanta Stadium ticketing database. Counterfeit or unrecognized barcode.',
    });
  }

  if (matchedTicket.status === 'cancelled') {
    return res.status(400).json({
      valid: false,
      status: 'cancelled',
      title: 'TICKET CANCELLED',
      message: 'This ticket was cancelled or refunded prior to the event.',
      ticket: matchedTicket,
    });
  }

  if (matchedTicket.status === 'scanned') {
    return res.status(409).json({
      valid: false,
      status: 'already_scanned',
      title: 'ALREADY SCANNED',
      message: `Entry DENIED. This ticket was already checked in at ${matchedTicket.scannedAt} via ${matchedTicket.scannedGate || 'Gate Turnstile'}.`,
      ticket: matchedTicket,
    });
  }

  // Mark ticket as scanned
  matchedTicket.status = 'scanned';
  matchedTicket.scannedAt = new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  matchedTicket.scannedGate = gate || 'Gate Turnstile B4';

  res.json({
    valid: true,
    status: 'admitted',
    title: 'ACCESS GRANTED',
    message: 'Welcome to Talanta Sports City! Ticket verified.',
    ticket: matchedTicket,
    booking: {
      bookingReference: matchedBooking?.bookingReference,
      contactName: matchedBooking?.contactName,
    }
  });
});

// Admin Stats Endpoint
app.get('/api/admin/stats', (_req: Request, res: Response) => {
  const confirmedBookings = DB.bookings.filter(b => b.status === 'confirmed');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalAmountKes, 18450000);
  const totalSold = DB.events.reduce((sum, e) => sum + e.ticketsSold, 0);

  const scannedCount = DB.bookings.reduce((sum, b) => {
    return sum + b.tickets.filter(t => t.status === 'scanned').length;
  }, 14);

  const gateThroughput = [
    { gate: 'Gate A (VVIP Ceremonial Plaza)', scanned: 412, capacity: 500 },
    { gate: 'Gate B (West VIP Concourse)', scanned: 2980, capacity: 3500 },
    { gate: 'Gate C (West Concourse Upper)', scanned: 8940, capacity: 12000 },
    { gate: 'Gate D (East Grandstand Lower)', scanned: 9400, capacity: 10000 },
    { gate: 'Gate E (East Grandstand Upper)', scanned: 7600, capacity: 8000 },
    { gate: 'Gate F (North Stand Ultras)', scanned: 9850, capacity: 13000 },
    { gate: 'Gate G (South Stand Family)', scanned: 8400, capacity: 13000 },
  ];

  res.json({
    totalRevenueKes: totalRevenue,
    totalTicketsSold: totalSold,
    activeEventsCount: DB.events.length,
    registeredUsersCount: 14890,
    scannedTicketsCount: scannedCount,
    gateThroughput,
    recentBookings: DB.bookings.slice(0, 10),
  });
});

// ==========================================
// VITE DEV SERVER OR PRODUCTION SERVING
// ==========================================
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
