import React, { useState, useEffect } from 'react';
import {
  EventItem,
  SeatingSection,
  BookingItem,
  UserProfile,
  NewsItem,
  AnnouncementItem,
  TicketItem,
  RoomItem,
  RoomBookingItem,
} from './types';
import { DEFAULT_SECTIONS } from './constants/seating';
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
import { NAIROBI_ROOMS } from './constants/nairobiRooms';
import { GateTurnstileScanner } from './components/GateTurnstileScanner';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from './lib/firebase';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'usr_fan_01',
    email: 'kipkoechvictor503@gmail.com',
    fullName: 'Victor Kipkoech',
    phoneNumber: '0712345678',
    nationalId: '34567890',
    role: 'fan',
  });

  const [events, setEvents] = useState<EventItem[]>([]);
  const [sections, setSections] = useState<SeatingSection[]>(DEFAULT_SECTIONS);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [pastResults, setPastResults] = useState<any[]>([]);
  const [userBookings, setUserBookings] = useState<BookingItem[]>([]);
  const [roomBookings, setRoomBookings] = useState<RoomBookingItem[]>([]);

  // Modals state
  const [bookingEvent, setBookingEvent] = useState<EventItem | null>(null);
  const [bookingSection, setBookingSection] = useState<SeatingSection | undefined>(undefined);
  const [activeTicketPass, setActiveTicketPass] = useState<BookingItem | null>(null);
  const [scannerOpen, setScannerOpen] = useState<boolean>(false);
  const [scannerPrefillTicket, setScannerPrefillTicket] = useState<TicketItem | null>(null);

  // Room Modals state
  const [selectedRoomForDetails, setSelectedRoomForDetails] = useState<RoomItem | null>(null);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<RoomItem | null>(null);
  const [selectedRoomForVideo, setSelectedRoomForVideo] = useState<RoomItem | null>(null);

  // Fetch initial data
  const fetchData = async () => {
    try {
      // 1. Current user
      const authRes = await fetch('/api/auth/me', {
        headers: { 'x-user-id': currentUser.id },
      });
      if (authRes.ok) {
        const authData = await authRes.json();
        if (authData.user) setCurrentUser(authData.user);
      }

      // 2. Events
      const evtRes = await fetch('/api/events');
      if (evtRes.ok) {
        const evtData = await evtRes.json();
        setEvents(evtData.events || []);
      }

      // 3. Sections
      const secRes = await fetch('/api/seating');
      if (secRes.ok) {
        const secData = await secRes.json();
        setSections(secData.sections || []);
      }

      // 4. News & Announcements
      const newsRes = await fetch('/api/news');
      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setNews(newsData.news || []);
        setAnnouncements(newsData.announcements || []);
      }

      // 5. Results
      const resRes = await fetch('/api/fixtures/results');
      if (resRes.ok) {
        const resData = await resRes.json();
        setPastResults(resData.results || []);
      }

      // 6. Match Bookings
      const bkgRes = await fetch('/api/bookings', {
        headers: {
          'x-user-id': currentUser.id,
          'x-user-role': currentUser.role,
        },
      });
      if (bkgRes.ok) {
        const bkgData = await bkgRes.json();
        setUserBookings(bkgData.bookings || []);
      }

      // 7. Hotel Room Bookings
      const rmBkgRes = await fetch('/api/room-bookings', {
        headers: {
          'x-user-id': currentUser.id,
        },
      });
      if (rmBkgRes.ok) {
        const rmBkgData = await rmBkgRes.json();
        setRoomBookings(rmBkgData.bookings || []);
      }
    } catch (err) {
      console.error('Error fetching initial data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser.id, currentUser.role]);

  // Switch role handler
  const handleSwitchRole = async (role: 'fan' | 'super_admin' | 'match_operations') => {
    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      }
    } catch (err) {
      console.error('Failed to switch role:', err);
    }
  };

  // Match Booking handlers
  const handleStartBooking = (event: EventItem, section?: SeatingSection) => {
    setBookingEvent(event);
    setBookingSection(section);
  };

  const handleBookingConfirmed = (newBooking: BookingItem) => {
    setUserBookings(prev => [newBooking, ...prev]);
    setBookingEvent(null);
    setBookingSection(undefined);
    setActiveTicketPass(newBooking);
    fetchData();
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'POST' });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Failed to cancel match booking:', err);
    }
  };

  // Room Booking handlers
  const handleSelectRoom = (room: RoomItem) => {
    setSelectedRoomForDetails(room);
  };

  const handleBookRoom = (room: RoomItem) => {
    setSelectedRoomForDetails(null);
    setSelectedRoomForVideo(null);
    setSelectedRoomForBooking(room);
  };

  const handleWatchRoomVideo = (room: RoomItem) => {
    setSelectedRoomForVideo(room);
  };

  const handleRoomBookingConfirmed = (newBooking: RoomBookingItem) => {
    setRoomBookings(prev => [newBooking, ...prev]);
    fetchData();
  };

  const handleCancelRoomBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/room-bookings/${bookingId}/cancel`, { method: 'POST' });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Failed to cancel room booking:', err);
    }
  };

  const handleTestScanTicket = (ticket: TicketItem) => {
    setActiveTicketPass(null);
    setScannerPrefillTicket(ticket);
    setScannerOpen(true);
  };

  const handleGoogleSignIn = async () => {
    try {
      const cred = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await cred.user.getIdToken();
      const res = await fetch('/api/auth/firebase-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      }
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
    }
  };

  const featuredEvent = events.find(e => e.isFeatured) || events[0];

  return (
    <div className="min-h-screen bg-white text-gray-700 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Announcements Ticker */}
      <MarqueeAlert announcements={announcements} />

      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onOpenScanner={() => {
          setScannerPrefillTicket(null);
          setScannerOpen(true);
        }}
        myTicketsCount={userBookings.reduce((sum, b) => sum + (b.status === 'confirmed' ? b.tickets.length : 0), 0)}
        onGoogleSignIn={handleGoogleSignIn}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <HeroSection
              featuredEvent={featuredEvent}
              onBookEvent={(evt) => handleStartBooking(evt)}
              onExploreSeating={() => setActiveTab('seating')}
              onViewEvents={() => setActiveTab('events')}
            />

            <StadiumVideoTour />

            <EventsSection
              events={events}
              onBookEvent={(evt) => handleStartBooking(evt)}
              pastResults={pastResults}
            />

            <InteractiveSeatingPlan
              sections={sections}
              selectedEvent={featuredEvent}
              onSelectSection={(sec) => {
                if (featuredEvent) {
                  handleStartBooking(featuredEvent, sec);
                } else {
                  setActiveTab('events');
                }
              }}
            />

            {/* Curated 50 Best Classic Rooms in Nairobi on Home */}
            <NairobiRoomsSection
              onSelectRoom={handleSelectRoom}
              onBookRoom={handleBookRoom}
              onWatchVideo={handleWatchRoomVideo}
            />

            <FacilitiesSection />

            <GallerySection />

            <NewsSection news={news} />

            <ContactLocationSection />
          </>
        )}

        {/* Dedicated Nairobi Rooms Tab */}
        {activeTab === 'rooms' && (
          <NairobiRoomsSection
            onSelectRoom={handleSelectRoom}
            onBookRoom={handleBookRoom}
            onWatchVideo={handleWatchRoomVideo}
          />
        )}

        {activeTab === 'tour' && (
          <>
            <StadiumVideoTour />
            <FacilitiesSection />
            <GallerySection />
          </>
        )}

        {activeTab === 'events' && (
          <EventsSection
            events={events}
            onBookEvent={(evt) => handleStartBooking(evt)}
            pastResults={pastResults}
          />
        )}

        {activeTab === 'seating' && (
          <InteractiveSeatingPlan
            sections={sections}
            selectedEvent={featuredEvent}
            onSelectSection={(sec) => {
              if (featuredEvent) {
                handleStartBooking(featuredEvent, sec);
              }
            }}
          />
        )}

        {activeTab === 'facilities' && (
          <FacilitiesSection />
        )}

        {activeTab === 'news' && (
          <NewsSection news={news} />
        )}

        {activeTab === 'contact' && (
          <ContactLocationSection />
        )}

        {activeTab === 'dashboard' && (
          <UserDashboard
            currentUser={currentUser}
            bookings={userBookings}
            roomBookings={roomBookings}
            onViewTicketPass={(booking) => setActiveTicketPass(booking)}
            onCancelBooking={handleCancelBooking}
            onCancelRoomBooking={handleCancelRoomBooking}
            onExploreEvents={() => setActiveTab('events')}
            onExploreRooms={() => setActiveTab('rooms')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            events={events}
            onRefreshEvents={fetchData}
            onOpenScanner={() => {
              setScannerPrefillTicket(null);
              setScannerOpen(true);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />

      {/* MODAL 1: MATCH TICKET BOOKING & M-PESA */}
      {bookingEvent && (
        <BookingModal
          event={bookingEvent}
          sections={sections}
          initialSection={bookingSection}
          currentUser={currentUser}
          onClose={() => {
            setBookingEvent(null);
            setBookingSection(undefined);
          }}
          onBookingConfirmed={handleBookingConfirmed}
        />
      )}

      {/* MODAL 2: DIGITAL MATCH TICKET PASS & QR CODE */}
      {activeTicketPass && (
        <TicketPassModal
          booking={activeTicketPass}
          onClose={() => setActiveTicketPass(null)}
          onTestScan={handleTestScanTicket}
        />
      )}

      {/* MODAL 3: ROOM DETAILS & GALLERY */}
      {selectedRoomForDetails && (
        <RoomDetailsModal
          room={selectedRoomForDetails}
          onClose={() => setSelectedRoomForDetails(null)}
          onBookNow={handleBookRoom}
        />
      )}

      {/* MODAL 4: ROOM RESERVATION & M-PESA FUNNEL */}
      {selectedRoomForBooking && (
        <RoomBookingModal
          room={selectedRoomForBooking}
          currentUser={currentUser}
          onClose={() => setSelectedRoomForBooking(null)}
          onBookingConfirmed={handleRoomBookingConfirmed}
        />
      )}

      {/* MODAL 5: ROOM HD VIDEO TOUR & VIRTUAL WALKTHROUGH */}
      {selectedRoomForVideo && (
        <RoomVideoModal
          room={selectedRoomForVideo}
          allRooms={NAIROBI_ROOMS}
          onClose={() => setSelectedRoomForVideo(null)}
          onBookNow={(room) => {
            setSelectedRoomForVideo(null);
            setSelectedRoomForBooking(room);
          }}
          onViewDetails={(room) => {
            setSelectedRoomForVideo(null);
            setSelectedRoomForDetails(room);
          }}
          onSwitchRoom={(room) => setSelectedRoomForVideo(room)}
        />
      )}

      {/* MODAL 5: GATE STEWARD TURNSTILE SCANNER */}
      {scannerOpen && (
        <GateTurnstileScanner
          prefillTicket={scannerPrefillTicket}
          onClose={() => {
            setScannerOpen(false);
            setScannerPrefillTicket(null);
          }}
        />
      )}

    </div>
  );
}
