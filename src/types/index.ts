export type UserRole = 'super_admin' | 'match_operations' | 'ticketing_officer' | 'fan';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  nationalId: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface SeatingSection {
  id: string;
  code: string;
  name: string;
  standLocation: 'West' | 'East' | 'North' | 'South' | 'Pitch';
  tierLevel: 'VVIP' | 'VIP' | 'Category 1' | 'Category 2' | 'Category 3';
  capacity: number;
  gateEntrance: string;
  amenities: string[];
  colorHex: string;
  priceKes: number;
  availableSeats: number;
}

export interface EventItem {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  eventDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  gatesOpenTime: string; // HH:mm
  homeTeam?: string;
  awayTeam?: string;
  tournamentName: string;
  bannerImageUrl: string;
  venueName: string;
  minPriceKes: number;
  maxPriceKes: number;
  totalCapacity: number;
  ticketsSold: number;
  status: 'scheduled' | 'live' | 'completed' | 'postponed' | 'cancelled';
  isFeatured: boolean;
  sections?: SeatingSection[];
}

export interface TicketItem {
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

export interface BookingItem {
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
  tickets: TicketItem[];
  subtotalKes: number;
  levyFeeKes: number;
  totalAmountKes: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  createdAt: string;
  paymentDetails?: {
    receiptNumber: string;
    phoneNumber: string;
    amountKes: number;
    paymentDate: string;
    checkoutRequestId?: string;
  };
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  authorName: string;
  imageUrl: string;
  publishedAt: string;
  isFeatured: boolean;
}

export interface AnnouncementItem {
  id: string;
  headline: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  isActive: boolean;
}

export interface AdminStats {
  totalRevenueKes: number;
  totalTicketsSold: number;
  activeEventsCount: number;
  registeredUsersCount: number;
  recentBookings: BookingItem[];
  scannedTicketsCount: number;
  gateThroughput: {
    gate: string;
    scanned: number;
    capacity: number;
  }[];
}

export type NairobiNeighborhood = 'Karen' | 'Westlands' | 'Kilimani' | 'Upper Hill' | 'CBD' | 'Gigiri' | 'National Park Border';
export type RoomSpaceCategory = 'Presidential & Skybox' | 'Executive Classic' | 'Boutique Heritage' | 'Panoramic Suite' | 'Luxury Lodge' | 'Manor & Holiday House';

export interface RoomItem {
  id: string;
  hotelName: string;
  roomName: string;
  neighborhood: NairobiNeighborhood;
  address: string;
  distanceToTalanta: string;
  distanceKm: number;
  spaceCategory: RoomSpaceCategory;
  floorAreaSqM: number;
  bedConfig: string;
  guestCapacity: number;
  pricePerNightKes: number;
  rating: number;
  reviewsCount: number;
  bookingScoreText?: string;
  propertyType?: 'Hotel & Suite' | 'Private House & Manor' | 'Serviced Apartment' | 'Safari Lodge';
  houseHighlights?: string[];
  imageUrl: string;
  galleryUrls: string[];
  classicFeatures: string[];
  cancellationPolicy: string;
  shortDescription: string;
  matchdayShuttleIncluded: boolean;
  availableUnits: number;
  videoUrl?: string;
  videoPoster?: string;
  videoDuration?: string;
  videoHighlights?: string[];
}

export interface RoomBookingItem {
  id: string;
  bookingReference: string;
  userId: string;
  roomId: string;
  roomName: string;
  hotelName: string;
  neighborhood: string;
  address?: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guestCount: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  nationalId: string;
  specialRequests?: string;
  pricePerNightKes: number;
  subtotalKes: number;
  tourismLevyKes: number;
  totalAmountKes: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentReceipt?: string;
  qrCodeToken: string;
  createdAt: string;
}
