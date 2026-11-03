import React, { useState, useEffect } from 'react';
import { EventItem, SeatingSection, BookingItem, UserProfile, NewsItem, AnnouncementItem, TicketItem } from './types';
import { DEFAULT_SECTIONS } from './constants/seating';
import { Navbar } from './components/Navbar';
import { MarqueeAlert } from './components/MarqueeAlert';
import { HeroSection } from './components/HeroSection';
import { StadiumVideoTour } from './components/StadiumVideoTour';
import { InteractiveSeatingPlan } from './components/InteractiveSeatingPlan';
import { EventsSection } from './components/EventsSection';
import { FacilitiesSection } from './components/FacilitiesSection';
import { GallerySection } from './components/GallerySection';
import { NewsSection } from './components/NewsSection';
import { ContactLocationSection } from './components/ContactLocationSection';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { BookingModal } from './components/BookingModal';
import { TicketPassModal } from './components/TicketPassModal';
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

  // Modals state
  const [bookingEvent, setBookingEvent] = useState<EventItem | null>(null);
  const [bookingSection, setBookingSection] = useState<SeatingSection | undefined>(undefined);
  const [activeTicketPass, setActiveTicketPass] = useState<BookingItem | null>(null);
  const [scannerOpen, setScannerOpen] = useState<boolean>(false);
  const [scannerPrefillTicket, setScannerPrefillTicket] = useState<TicketItem | null>(null);

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

      // 6. Bookings
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

  // Booking handlers
  const handleStartBooking = (event: EventItem, section?: SeatingSection) => {
    setBookingEvent(event);
    setBookingSection(section);
  };

  const handleBookingConfirmed = (newBooking: BookingItem) => {
    setUserBookings(prev => [newBooking, ...prev]);
    setBookingEvent(null);
    setBookingSection(undefined);
    // Show digital ticket pass immediately
    setActiveTicketPass(newBooking);
    fetchData();
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      alert('Failed to cancel booking');
    }
  };

  // Test scan from ticket pass modal
  const handleTestScanTicket = (ticket: TicketItem) => {
    setActiveTicketPass(null);
    setScannerPrefillTicket(ticket);
    setScannerOpen(true);
  };

  const handleGoogleSignIn = async () => {
    try {
      const cred = await signInWithPopup(auth, googleAuthProvider);
      const token = await cred.user.getIdToken();
      const res = await fetch('/api/auth/firebase-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setCurrentUser(data.user);
          fetchData();
        }
      }
    } catch (err) {
      console.error('Google Sign-In error:', err);
    }
  };

  const featuredEvent = events.find(e => e.isFeatured) || events[0];

  return (
    <div className="min-h-screen bg-[#060908] text-slate-100 flex flex-col font-sans selection:bg-[#C5A059] selection:text-black">
      
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

            <FacilitiesSection />

            <GallerySection />

            <NewsSection news={news} />

            <ContactLocationSection />
          </>
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
            onViewTicketPass={(booking) => setActiveTicketPass(booking)}
            onCancelBooking={handleCancelBooking}
            onExploreEvents={() => setActiveTab('events')}
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

      {/* MODAL 1: BOOKING & M-PESA FUNNEL */}
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

      {/* MODAL 2: DIGITAL TICKET PASS & QR CODE */}
      {activeTicketPass && (
        <TicketPassModal
          booking={activeTicketPass}
          onClose={() => setActiveTicketPass(null)}
          onTestScan={handleTestScanTicket}
        />
      )}

      {/* MODAL 3: GATE STEWARD TURNSTILE SCANNER */}
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
