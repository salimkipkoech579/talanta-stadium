import React, { useEffect, useState } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import type { EventItem, SeatingSection, BookingItem, UserProfile, NewsItem, AnnouncementItem, TicketItem, RoomItem, RoomBookingItem } from './types';
import { DEFAULT_SECTIONS } from './constants/seating';
import { NAIROBI_ROOMS } from './constants/nairobiRooms';
import { Navbar } from './components/Navbar';
import { MarqueeAlert } from './components/MarqueeAlert';
import { HeroSection } from './components/HeroSection';
import { StadiumVideoTour } from './components/StadiumVideoTour';
import { InteractiveSeatingPlan } from './components/InteractiveSeatingPlan';
import { EventsSection } from './components/EventsSection';
import { NairobiRoomsSection } from './components/NairobiRoomsSection';
import { FacilitiesSection } from './components/FacilitiesSection';
import { GallerySection } from './components/GallerySection';
import { NewsSection } from './components/NewsSection';
import { ContactLocationSection } from './components/ContactLocationSection';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { BookingModal } from './components/BookingModal';
import { TicketPassModal } from './components/TicketPassModal';
import { RoomDetailsModal } from './components/RoomDetailsModal';
import { RoomBookingModal } from './components/RoomBookingModal';
import { RoomVideoModal } from './components/RoomVideoModal';
import { GateTurnstileScanner } from './components/GateTurnstileScanner';
import { Footer } from './components/Footer';

const guestUser: UserProfile = {
  id: '',
  email: '',
  fullName: 'Guest',
  phoneNumber: '',
  nationalId: '',
  role: 'fan',
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentUser, setCurrentUser] = useState<UserProfile>(guestUser);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [sections, setSections] = useState<SeatingSection[]>(DEFAULT_SECTIONS);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [pastResults, setPastResults] = useState<any[]>([]);
  const [userBookings, setUserBookings] = useState<BookingItem[]>([]);
  const [roomBookings, setRoomBookings] = useState<RoomBookingItem[]>([]);
  const [bookingEvent, setBookingEvent] = useState<EventItem | null>(null);
  const [bookingSection, setBookingSection] = useState<SeatingSection>();
  const [activeTicketPass, setActiveTicketPass] = useState<BookingItem | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerPrefillTicket, setScannerPrefillTicket] = useState<TicketItem | null>(null);
  const [selectedRoomForDetails, setSelectedRoomForDetails] = useState<RoomItem | null>(null);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<RoomItem | null>(null);
  const [selectedRoomForVideo, setSelectedRoomForVideo] = useState<RoomItem | null>(null);

  const fetchData = async () => {
    try {
      const [eventsRes, sectionsRes, newsRes, resultsRes, bookingsRes, roomsRes] = await Promise.all([
        fetch('/api/events'), fetch('/api/seating'), fetch('/api/news'), fetch('/api/fixtures/results'),
        fetch('/api/bookings', { headers: { 'x-user-id': currentUser.id, 'x-user-role': currentUser.role } }),
        fetch('/api/room-bookings', { headers: { 'x-user-id': currentUser.id } }),
      ]);
      if (eventsRes.ok) setEvents((await eventsRes.json()).events || []);
      if (sectionsRes.ok) setSections((await sectionsRes.json()).sections || []);
      if (newsRes.ok) {
        const data = await newsRes.json();
        setNews(data.news || []);
        setAnnouncements(data.announcements || []);
      }
      if (resultsRes.ok) setPastResults((await resultsRes.json()).results || []);
      if (bookingsRes.ok) setUserBookings((await bookingsRes.json()).bookings || []);
      if (roomsRes.ok) setRoomBookings((await roomsRes.json()).bookings || []);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  useEffect(() => { void fetchData(); }, [currentUser.id, currentUser.role]);

  useEffect(() => {
    const syncSession = async (_event: AuthChangeEvent, session: Session | null) => {
      if (!session) {
        setCurrentUser(guestUser);
        return;
      }
      try {
        // Keep this compatibility endpoint until server.ts is switched to
        // /api/auth/supabase-login; its token is now verified by Supabase Auth.
        const response = await fetch('/api/auth/firebase-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: session.access_token }),
        });
        if (!response.ok) throw new Error('Unable to sync Supabase user profile');
        const { user } = await response.json();
        if (user) setCurrentUser(user);
      } catch (error) {
        console.error('Supabase sign-in profile sync failed:', error);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setTimeout(() => { void syncSession(event, session); }, 0);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) console.error('Supabase Google sign-in failed:', error);
  };

  const handleSwitchRole = async (role: 'fan' | 'super_admin' | 'match_operations') => {
    try {
      const response = await fetch('/api/auth/switch-role', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role }),
      });
      if (response.ok) setCurrentUser((await response.json()).user);
    } catch (error) { console.error('Failed to switch role:', error); }
  };

  const handleStartBooking = (event: EventItem, section?: SeatingSection) => { setBookingEvent(event); setBookingSection(section); };
  const handleTestScanTicket = (ticket: TicketItem) => { setActiveTicketPass(null); setScannerPrefillTicket(ticket); setScannerOpen(true); };
  const showScanner = () => { setScannerPrefillTicket(null); setScannerOpen(true); };
  const featuredEvent = events.find(event => event.isFeatured) || events[0];

  return <div className="min-h-screen bg-white text-gray-700 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
    <MarqueeAlert announcements={announcements} />
    <Navbar activeTab={activeTab} setActiveTab={setActiveTab} currentUser={currentUser}
      onSwitchRole={handleSwitchRole} onOpenScanner={showScanner}
      myTicketsCount={userBookings.reduce((sum, booking) => sum + (booking.status === 'confirmed' ? booking.tickets.length : 0), 0)}
      onGoogleSignIn={handleGoogleSignIn} />
    <main className="flex-1">
      {activeTab === 'home' && <>
        <HeroSection featuredEvent={featuredEvent} onBookEvent={event => handleStartBooking(event)} onExploreSeating={() => setActiveTab('seating')} onViewEvents={() => setActiveTab('events')} />
        <StadiumVideoTour />
        <EventsSection events={events} onBookEvent={event => handleStartBooking(event)} pastResults={pastResults} />
        <InteractiveSeatingPlan sections={sections} selectedEvent={featuredEvent} onSelectSection={section => featuredEvent ? handleStartBooking(featuredEvent, section) : setActiveTab('events')} />
        <NairobiRoomsSection onSelectRoom={setSelectedRoomForDetails} onBookRoom={room => setSelectedRoomForBooking(room)} onWatchVideo={setSelectedRoomForVideo} />
        <FacilitiesSection /><GallerySection /><NewsSection news={news} /><ContactLocationSection />
      </>}
      {activeTab === 'rooms' && <NairobiRoomsSection onSelectRoom={setSelectedRoomForDetails} onBookRoom={setSelectedRoomForBooking} onWatchVideo={setSelectedRoomForVideo} />}
      {activeTab === 'tour' && <><StadiumVideoTour /><FacilitiesSection /><GallerySection /></>}
      {activeTab === 'events' && <EventsSection events={events} onBookEvent={event => handleStartBooking(event)} pastResults={pastResults} />}
      {activeTab === 'seating' && <InteractiveSeatingPlan sections={sections} selectedEvent={featuredEvent} onSelectSection={section => featuredEvent && handleStartBooking(featuredEvent, section)} />}
      {activeTab === 'facilities' && <FacilitiesSection />}
      {activeTab === 'news' && <NewsSection news={news} />}
      {activeTab === 'contact' && <ContactLocationSection />}
      {activeTab === 'dashboard' && <UserDashboard currentUser={currentUser} bookings={userBookings} roomBookings={roomBookings}
        onViewTicketPass={setActiveTicketPass}
        onCancelBooking={async id => { await fetch(`/api/bookings/${id}/cancel`, { method: 'POST' }); void fetchData(); }}
        onCancelRoomBooking={async id => { await fetch(`/api/room-bookings/${id}/cancel`, { method: 'POST' }); void fetchData(); }}
        onExploreEvents={() => setActiveTab('events')} onExploreRooms={() => setActiveTab('rooms')} />}
      {activeTab === 'admin' && <AdminDashboard currentUser={currentUser} events={events} onRefreshEvents={fetchData} onOpenScanner={showScanner} />}
    </main>
    <Footer onNavigate={setActiveTab} />
    {bookingEvent && <BookingModal event={bookingEvent} sections={sections} initialSection={bookingSection} currentUser={currentUser}
      onClose={() => { setBookingEvent(null); setBookingSection(undefined); }}
      onBookingConfirmed={booking => { setUserBookings(previous => [booking, ...previous]); setBookingEvent(null); setBookingSection(undefined); setActiveTicketPass(booking); void fetchData(); }} />}
    {activeTicketPass && <TicketPassModal booking={activeTicketPass} onClose={() => setActiveTicketPass(null)} onTestScan={handleTestScanTicket} />}
    {selectedRoomForDetails && <RoomDetailsModal room={selectedRoomForDetails} onClose={() => setSelectedRoomForDetails(null)} onBookNow={room => { setSelectedRoomForDetails(null); setSelectedRoomForBooking(room); }} />}
    {selectedRoomForBooking && <RoomBookingModal room={selectedRoomForBooking} currentUser={currentUser} onClose={() => setSelectedRoomForBooking(null)} onBookingConfirmed={booking => { setRoomBookings(previous => [booking, ...previous]); void fetchData(); }} />}
    {selectedRoomForVideo && <RoomVideoModal room={selectedRoomForVideo} allRooms={NAIROBI_ROOMS} onClose={() => setSelectedRoomForVideo(null)}
      onBookNow={room => { setSelectedRoomForVideo(null); setSelectedRoomForBooking(room); }}
      onViewDetails={room => { setSelectedRoomForVideo(null); setSelectedRoomForDetails(room); }} onSwitchRoom={setSelectedRoomForVideo} />}
    {scannerOpen && <GateTurnstileScanner prefillTicket={scannerPrefillTicket} onClose={() => { setScannerOpen(false); setScannerPrefillTicket(null); }} />}
  </div>;
}
