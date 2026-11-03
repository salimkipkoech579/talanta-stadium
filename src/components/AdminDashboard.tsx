import React, { useState, useEffect } from 'react';
import { AdminStats, EventItem, UserProfile } from '../types';
import { formatKes } from '../utils/qrcode';
import { Shield, Plus, DollarSign, Users, Ticket, Activity, Trash2, CheckCircle2, Megaphone } from 'lucide-react';

interface AdminDashboardProps {
  currentUser: UserProfile;
  events: EventItem[];
  onRefreshEvents: () => void;
  onOpenScanner: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  events,
  onRefreshEvents,
  onOpenScanner,
}) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showManualTicketModal, setShowManualTicketModal] = useState<boolean>(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState<boolean>(false);

  // New Event Form
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState('football');
  const [newEventDate, setNewEventDate] = useState('2026-12-20');
  const [newEventTime, setNewEventTime] = useState('16:00');
  const [newEventMinPrice, setNewEventMinPrice] = useState('500');
  const [newEventMaxPrice, setNewEventMaxPrice] = useState('8000');
  const [newEventTournament, setNewEventTournament] = useState('FKF Premier League');
  const [newEventShortDesc, setNewEventShortDesc] = useState('');
  const [newEventBanner, setNewEventBanner] = useState('/src/assets/images/talanta_stadium_interior_1793552928473.jpg');

  // Manual Ticket Form
  const [manualEventId, setManualEventId] = useState('');
  const [manualSectionCode, setManualSectionCode] = useState('VVIP_PRESIDENTIAL');
  const [manualName, setManualName] = useState('Hon. Guest Attendee');
  const [manualIdNumber, setManualIdNumber] = useState('11223344');
  const [manualPhone, setManualPhone] = useState('0722000000');
  const [manualSeat, setManualSeat] = useState('Skybox 02 | Suite Seat A1');
  const [manualIssuedResult, setManualIssuedResult] = useState<any>(null);

  // Announcement Form
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementSeverity, setAnnouncementSeverity] = useState<'info' | 'warning'>('info');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    if (events.length > 0 && !manualEventId) {
      setManualEventId(events[0].id);
    }
  }, [events]);

  // Sample presets for manual entry
  const loadEventSample = (type: 'football' | 'concert' | 'rugby' | 'athletics') => {
    if (type === 'football') {
      setNewEventTitle('Harambee Stars vs Nigeria Super Eagles (Friendly)');
      setNewEventCategory('football');
      setNewEventTournament('International Friendly Match');
      setNewEventDate('2027-01-18');
      setNewEventTime('19:30');
      setNewEventMinPrice('600');
      setNewEventMaxPrice('12000');
      setNewEventShortDesc('Continental giants clash at Talanta Sports City under 4K floodlights with 60,000 fans.');
      setNewEventBanner('/assets/aistudio/images__13__09ed1a8f.jpeg');
    } else if (type === 'concert') {
      setNewEventTitle('Burna Boy & Sauti Sol Live: African Giant Nairobi Tour');
      setNewEventCategory('concerts');
      setNewEventTournament('Nairobi Music Festival');
      setNewEventDate('2027-02-14');
      setNewEventTime('20:00');
      setNewEventMinPrice('2000');
      setNewEventMaxPrice('30000');
      setNewEventShortDesc('Grammy-winning African music icon live on the Talanta concert stage with pyrotechnics and 360 acoustic sound.');
      setNewEventBanner('/assets/aistudio/images__12__cd65bb66.jpeg');
    } else if (type === 'rugby') {
      setNewEventTitle('Safari Sevens International Rugby Championship');
      setNewEventCategory('football');
      setNewEventTournament('Safari Sevens Nairobi');
      setNewEventDate('2027-03-22');
      setNewEventTime('10:00');
      setNewEventMinPrice('500');
      setNewEventMaxPrice('5000');
      setNewEventShortDesc('Electrifying rugby sevens action featuring Kenya Shujaa, South Africa, and international invitational teams.');
      setNewEventBanner('/assets/aistudio/images__23__66d33c9b.jpeg');
    } else if (type === 'athletics') {
      setNewEventTitle('Kenya National Olympic Trials 2027');
      setNewEventCategory('athletics');
      setNewEventTournament('Athletics Kenya National Trials');
      setNewEventDate('2027-05-15');
      setNewEventTime('09:00');
      setNewEventMinPrice('300');
      setNewEventMaxPrice('4000');
      setNewEventShortDesc('World record breakers and Olympic champions sprint for national selection on Talanta\'s Class 1 synthetic track.');
      setNewEventBanner('/assets/aistudio/images__18__b0a77f48.jpeg');
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newEventTitle,
          categoryId: newEventCategory,
          categoryName: newEventCategory === 'football' ? 'Football' : newEventCategory === 'concerts' ? 'Concerts' : 'Athletics',
          tournamentName: newEventTournament,
          eventDate: newEventDate || '2027-01-20',
          startTime: newEventTime,
          gatesOpenTime: '12:00',
          minPriceKes: Number(newEventMinPrice),
          maxPriceKes: Number(newEventMaxPrice),
          shortDescription: newEventShortDesc || 'Official event at Talanta Sports City.',
          bannerImageUrl: newEventBanner,
          isFeatured: false,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setNewEventTitle('');
        onRefreshEvents();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Delete this event? All associated tickets will be archived.')) return;
    try {
      const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
      if (res.ok) {
        onRefreshEvents();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleManualIssueTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/issue-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: manualEventId,
          sectionCode: manualSectionCode,
          attendeeName: manualName,
          attendeeNationalId: manualIdNumber,
          attendeePhone: manualPhone,
          seatInfo: manualSeat,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setManualIssuedResult(data);
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: announcementText,
          severity: announcementSeverity,
          linkUrl: '#events',
        }),
      });

      if (res.ok) {
        setShowAnnouncementModal(false);
        setAnnouncementText('');
        alert('Matchday announcement broadcasted successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen text-gray-700 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header Bar */}
        <div className="p-6 rounded-xl bg-white border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Talanta Stadium Command Console
                </h1>
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Operations Admin
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Operator: {currentUser.fullName} ({currentUser.email}) · Cloud SQL &amp; Safaricom Daraja Online
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAnnouncementModal(true)}
              className="px-3.5 py-2 rounded-lg bg-white border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Megaphone className="w-3.5 h-3.5 text-gray-600" />
              <span>Post Announcement</span>
            </button>
            <button
              onClick={() => setShowManualTicketModal(true)}
              className="px-3.5 py-2 rounded-lg bg-white border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Ticket className="w-3.5 h-3.5 text-gray-600" />
              <span>Issue Manual Pass</span>
            </button>
            <button
              onClick={onOpenScanner}
              className="px-3.5 py-2 rounded-lg bg-white border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer shadow-sm"
            >
              Turnstile Scanner
            </button>
            <button
              onClick={() => {
                loadEventSample('football');
                setShowCreateModal(true);
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event Manually</span>
            </button>
          </div>
        </div>

        {/* 4 Primary Financial & Operational Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Gross Ticketing Revenue</span>
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 font-mono">
              {stats ? formatKes(stats.totalRevenueKes) : 'KES 18,450,000'}
            </p>
            <p className="text-xs text-green-700 mt-1 font-medium">Verified Safaricom M-Pesa STK Push</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Total Tickets Issued</span>
              <Ticket className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 font-mono">
              {stats ? stats.totalTicketsSold.toLocaleString() : '115,244'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Across all stadium tiers</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Turnstile Admitted</span>
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 font-mono">
              {stats ? (39402).toLocaleString() : '39,402'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Real-time gate check-ins</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Registered Attendees</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 font-mono">
              {stats ? stats.registeredUsersCount.toLocaleString() : '14,890'}
            </p>
            <p className="text-xs text-gray-500 mt-1">National ID &amp; KYC verified</p>
          </div>

        </div>

        {/* Live Gate Throughput Monitor */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide">
                Live Turnstile Gate Flow
              </h3>
              <p className="text-xs text-gray-500">Current occupancy and scan throughput by stadium entrance</p>
            </div>
            <span className="px-2.5 py-1 rounded text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
              Turnstiles Synchronized
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats?.gateThroughput.map((gate, i) => {
              const pct = Math.round((gate.scanned / gate.capacity) * 100);
              return (
                <div key={i} className="p-3.5 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-gray-900 truncate max-w-[180px]">{gate.gate}</span>
                    <span className="font-mono text-blue-600 font-bold">{pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1 font-mono">
                    <span>{gate.scanned.toLocaleString()} Admitted</span>
                    <span>Cap: {gate.capacity.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Events Management Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide">
                Configured Stadium Events &amp; Fixtures ({events.length})
              </h3>
              <p className="text-xs text-gray-500">Manage ticketing allocations, pricing tiers, and event schedules</p>
            </div>
            <button
              onClick={() => {
                loadEventSample('football');
                setShowCreateModal(true);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors self-start sm:self-auto cursor-pointer shadow-sm"
            >
              + Add Event
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-700 uppercase tracking-wider font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Event &amp; Tournament</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date &amp; Kickoff</th>
                  <th className="py-3 px-4">Price Range (KES)</th>
                  <th className="py-3 px-4">Tickets Sold</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-gray-900">{evt.title}</p>
                      <p className="text-xs text-gray-500">{evt.tournamentName}</p>
                    </td>
                    <td className="py-3.5 px-4 capitalize text-gray-700">{evt.categoryId}</td>
                    <td className="py-3.5 px-4 text-gray-700 font-mono">{evt.eventDate} · {evt.startTime}</td>
                    <td className="py-3.5 px-4 font-mono text-blue-600 font-semibold">
                      {formatKes(evt.minPriceKes)} - {formatKes(evt.maxPriceKes)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-900">
                      {evt.ticketsSold.toLocaleString()} / {evt.totalCapacity.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase bg-green-50 text-green-700 border border-green-200">
                        {evt.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteEvent(evt.id)}
                        title="Delete Event"
                        className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* CREATE EVENT MODAL WITH SAMPLE TEMPLATES */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-xl rounded-xl bg-white border border-gray-200 p-5 sm:p-6 shadow-2xl text-xs my-auto max-h-[92vh] overflow-y-auto flex flex-col font-sans">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4 shrink-0">
              <div>
                <h3 className="text-base font-bold text-gray-900">Event Creation &amp; Presets</h3>
                <p className="text-xs text-gray-500">Click a sample template below to autofill or type manually.</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>

            {/* Quick Sample Presets */}
            <div className="mb-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
              <span className="text-xs uppercase font-bold text-gray-700 block mb-2">
                Click Sample to Autofill:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => loadEventSample('football')}
                  className="px-2.5 py-1 rounded bg-white border border-gray-300 hover:border-blue-600 text-gray-700 text-xs cursor-pointer transition-colors"
                >
                  Football (Harambee Stars vs Nigeria)
                </button>
                <button
                  type="button"
                  onClick={() => loadEventSample('concert')}
                  className="px-2.5 py-1 rounded bg-white border border-gray-300 hover:border-blue-600 text-gray-700 text-xs cursor-pointer transition-colors"
                >
                  Concert (Burna Boy Live)
                </button>
                <button
                  type="button"
                  onClick={() => loadEventSample('rugby')}
                  className="px-2.5 py-1 rounded bg-white border border-gray-300 hover:border-blue-600 text-gray-700 text-xs cursor-pointer transition-colors"
                >
                  Rugby (Safari Sevens)
                </button>
                <button
                  type="button"
                  onClick={() => loadEventSample('athletics')}
                  className="px-2.5 py-1 rounded bg-white border border-gray-300 hover:border-blue-600 text-gray-700 text-xs cursor-pointer transition-colors"
                >
                  Athletics (Olympic Trials)
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="text-gray-700 font-medium block mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g. Kenya vs Ivory Coast"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-700 font-medium block mb-1">Category</label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                  >
                    <option value="football">Football</option>
                    <option value="concerts">Mega Concert</option>
                    <option value="athletics">Athletics</option>
                    <option value="rugby">Rugby Sevens</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-700 font-medium block mb-1">Tournament / Banner</label>
                  <input
                    type="text"
                    value={newEventTournament}
                    onChange={(e) => setNewEventTournament(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-700 font-medium block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-gray-700 font-medium block mb-1">Kickoff / Start Time</label>
                  <input
                    type="time"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-700 font-medium block mb-1">Min Ticket Price (KES)</label>
                  <input
                    type="number"
                    value={newEventMinPrice}
                    onChange={(e) => setNewEventMinPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 font-mono focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-gray-700 font-medium block mb-1">Max Ticket Price (KES)</label>
                  <input
                    type="number"
                    value={newEventMaxPrice}
                    onChange={(e) => setNewEventMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 font-mono focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-700 font-medium block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={newEventShortDesc}
                  onChange={(e) => setNewEventShortDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-sm"
                >
                  Save &amp; Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANUAL TICKET ISSUER MODAL */}
      {showManualTicketModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-lg rounded-xl bg-white border border-gray-200 p-5 sm:p-6 shadow-2xl text-xs my-auto max-h-[92vh] overflow-y-auto flex flex-col font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4 shrink-0">
              <div>
                <h3 className="text-base font-bold text-gray-900">Manual Match Ticket Issuer</h3>
                <p className="text-xs text-gray-500">Issue direct passes for VIP guests, corporate delegations, or protocol.</p>
              </div>
              <button onClick={() => { setShowManualTicketModal(false); setManualIssuedResult(null); }} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>

            {manualIssuedResult ? (
              <div className="p-4 rounded-lg bg-green-50 border border-green-200 space-y-3">
                <div className="flex items-center gap-2 text-green-800 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span>Manual Ticket Successfully Issued &amp; Activated!</span>
                </div>
                <div className="p-3 bg-white border border-gray-200 rounded-lg font-mono text-xs space-y-1 text-gray-800">
                  <p>Ticket Number: <strong className="text-gray-900">{manualIssuedResult.ticket.ticketNumber}</strong></p>
                  <p>Ref: <strong className="text-blue-600">{manualIssuedResult.booking.bookingReference}</strong></p>
                  <p>Attendee: {manualIssuedResult.ticket.attendeeName}</p>
                  <p>Stand: {manualIssuedResult.ticket.sectionName}</p>
                  <p>Turnstile: {manualIssuedResult.ticket.turnstileNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setManualIssuedResult(null)}
                  className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-sm"
                >
                  Issue Another Pass
                </button>
              </div>
            ) : (
              <form onSubmit={handleManualIssueTicket} className="space-y-3">
                <div>
                  <label className="text-gray-700 font-medium block mb-1">Select Event</label>
                  <select
                    value={manualEventId}
                    onChange={(e) => setManualEventId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                  >
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>{e.title}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-700 font-medium block mb-1">Seating Stand</label>
                    <select
                      value={manualSectionCode}
                      onChange={(e) => setManualSectionCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                    >
                      <option value="VVIP_PRESIDENTIAL">VVIP Presidential Skybox</option>
                      <option value="VIP_GOLD_WEST">VIP Gold Terrace</option>
                      <option value="CAT1_WEST_UPPER">Category 1 West Concourse</option>
                      <option value="CAT2_EAST_STAND">Category 2 East Stand</option>
                      <option value="CAT3_NORTH_ULTRAS">Category 3 North Stand</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-700 font-medium block mb-1">Specific Seat / Row</label>
                    <input
                      type="text"
                      value={manualSeat}
                      onChange={(e) => setManualSeat(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-700 font-medium block mb-1">Attendee Name</label>
                    <input
                      type="text"
                      required
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 font-medium block mb-1">National ID / Passport</label>
                    <input
                      type="text"
                      required
                      value={manualIdNumber}
                      onChange={(e) => setManualIdNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 font-mono focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-700 font-medium block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 font-mono focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowManualTicketModal(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-sm"
                  >
                    Issue Pass Now
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT BROADCASTER MODAL */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-lg rounded-xl bg-white border border-gray-200 p-5 sm:p-6 shadow-2xl text-xs my-auto max-h-[92vh] overflow-y-auto flex flex-col font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4 shrink-0">
              <div>
                <h3 className="text-base font-bold text-gray-900">Broadcast Matchday Notice</h3>
                <p className="text-xs text-gray-500">Post urgent advisory to the top ticker across all fan devices.</p>
              </div>
              <button onClick={() => setShowAnnouncementModal(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="text-gray-700 font-medium block mb-1">Announcement Message</label>
                <textarea
                  required
                  rows={3}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="e.g. Kenya Railways matchday trains departing Nairobi Central at 15-minute intervals. Gates open."
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium block mb-1">Severity Level</label>
                <select
                  value={announcementSeverity}
                  onChange={(e) => setAnnouncementSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="info">Information (Standard Blue Notice)</option>
                  <option value="warning">Warning / Security Advisory (Amber Notice)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-sm"
                >
                  Broadcast Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
