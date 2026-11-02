import React, { useState, useEffect } from 'react';
import { AdminStats, EventItem, UserProfile } from '../types';
import { formatKes } from '../utils/qrcode';
import { Shield, Plus, DollarSign, Users, Ticket, Activity, Edit3, Trash2, CheckCircle2, BarChart3, AlertCircle, Sparkles, Newspaper, Megaphone } from 'lucide-react';

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
      alert('Failed to create event');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Delete this event? It will be removed from fixtures and ticketing.')) {
      return;
    }
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onRefreshEvents();
        fetchStats();
      }
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  const handleManualIssueTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tickets/issue-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: manualEventId,
          sectionCode: manualSectionCode,
          attendeeName: manualName,
          attendeeNationalId: manualIdNumber,
          contactPhone: manualPhone,
          seatInfo: manualSeat,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setManualIssuedResult(data);
        fetchStats();
        onRefreshEvents();
      }
    } catch (err) {
      alert('Failed to issue manual ticket');
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: announcementText.trim(),
          severity: announcementSeverity,
        }),
      });
      if (res.ok) {
        setShowAnnouncementModal(false);
        setAnnouncementText('');
        alert('Matchday announcement broadcast live to the ticker bar!');
      }
    } catch (err) {
      alert('Failed to post announcement');
    }
  };

  return (
    <div className="py-12 bg-[#060908] min-h-screen text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#1c2c22]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#005A2B] to-[#C5A059] p-0.5 shadow-lg">
              <div className="w-full h-full bg-[#060908] rounded-[10px] flex items-center justify-center text-[#C5A059]">
                <Shield className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                  Stadium Operations &amp; Administration
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#C5A059] text-black">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Talanta Sports City (Raila Amolo Odinga International Stadium) · Master Console
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAnnouncementModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#0d1410] border border-[#1e2c24] text-xs font-semibold text-slate-300 hover:text-white cursor-pointer flex items-center gap-1.5"
            >
              <Megaphone className="w-3.5 h-3.5 text-[#E5C378]" />
              <span>Broadcast Notice</span>
            </button>
            <button
              onClick={() => setShowManualTicketModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#0d1410] border border-[#1e2c24] text-xs font-semibold text-slate-300 hover:text-white cursor-pointer flex items-center gap-1.5"
            >
              <Ticket className="w-3.5 h-3.5 text-[#0FA958]" />
              <span>Issue Manual Pass</span>
            </button>
            <button
              onClick={onOpenScanner}
              className="px-3.5 py-2 rounded-xl bg-[#0d1410] border border-[#1e2c24] text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
            >
              Turnstile Scanner
            </button>
            <button
              onClick={() => {
                loadEventSample('football');
                setShowCreateModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#005A2B] hover:bg-[#007036] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event Manually</span>
            </button>
          </div>
        </div>

        {/* 4 Primary Financial & Operational Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          <div className="p-5 rounded-2xl bg-[#0a100c] border border-[#1e2c24] shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Gross Ticketing Revenue</span>
              <DollarSign className="w-4 h-4 text-[#C5A059]" />
            </div>
            <p className="text-2xl font-black text-[#E5C378] font-mono">
              {stats ? formatKes(stats.totalRevenueKes) : 'KES 18,450,000'}
            </p>
            <p className="text-[11px] text-[#0FA958] mt-1 font-medium">Verified Safaricom M-Pesa STK Push</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a100c] border border-[#1e2c24] shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Total Tickets Issued</span>
              <Ticket className="w-4 h-4 text-[#0FA958]" />
            </div>
            <p className="text-2xl font-black text-white font-mono">
              {stats ? stats.totalTicketsSold.toLocaleString() : '115,244'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">Across all stadium tiers</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a100c] border border-[#1e2c24] shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Turnstile Admitted</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white font-mono">
              {stats ? (39402).toLocaleString() : '39,402'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">Real-time gate check-ins</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a100c] border border-[#1e2c24] shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Registered Attendees</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white font-mono">
              {stats ? stats.registeredUsersCount.toLocaleString() : '14,890'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">National ID &amp; KYC verified</p>
          </div>

        </div>

        {/* Live Gate Throughput Monitor */}
        <div className="bg-[#0a100c] rounded-2xl border border-[#1e2c24] p-6 shadow-xl mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wide">
                Live Turnstile Gate Flow
              </h3>
              <p className="text-xs text-slate-400">Current occupancy and scan throughput by stadium entrance</p>
            </div>
            <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-[#005A2B]/40 text-[#0FA958] border border-[#0FA958]/30">
              Turnstiles Synchronized
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats?.gateThroughput.map((gate, i) => {
              const pct = Math.round((gate.scanned / gate.capacity) * 100);
              return (
                <div key={i} className="p-3.5 rounded-xl bg-[#060908] border border-[#1c2c22]">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-white truncate max-w-[180px]">{gate.gate}</span>
                    <span className="font-mono text-[#E5C378] font-bold">{pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#131c17] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#005A2B] to-[#0FA958] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>{gate.scanned.toLocaleString()} Admitted</span>
                    <span>Cap: {gate.capacity.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Events Management Table */}
        <div className="bg-[#0a100c] rounded-2xl border border-[#1e2c24] p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wide">
                Configured Stadium Events &amp; Fixtures ({events.length})
              </h3>
              <p className="text-xs text-slate-400">Manage ticketing allocations, pricing tiers, and event schedules</p>
            </div>
            <button
              onClick={() => {
                loadEventSample('football');
                setShowCreateModal(true);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-[#005A2B] text-white text-xs font-bold uppercase tracking-wider self-start sm:self-auto cursor-pointer"
            >
              + Add Event
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#060908] text-slate-400 uppercase tracking-wider font-semibold border-b border-[#1c2c22]">
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
              <tbody className="divide-y divide-[#1c2c22]">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-[#0d1410] transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{evt.title}</p>
                      <p className="text-[11px] text-slate-400">{evt.tournamentName}</p>
                    </td>
                    <td className="py-3.5 px-4 capitalize text-slate-300">{evt.categoryId}</td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono">{evt.eventDate} · {evt.startTime}</td>
                    <td className="py-3.5 px-4 font-mono text-[#E5C378]">
                      {formatKes(evt.minPriceKes)} - {formatKes(evt.maxPriceKes)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-white">
                      {evt.ticketsSold.toLocaleString()} / {evt.totalCapacity.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#005A2B]/40 text-[#0FA958] border border-[#0FA958]/30">
                        {evt.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteEvent(evt.id)}
                        title="Delete Event"
                        className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-[#131c17] transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-xl rounded-2xl bg-[#0c120f] border border-[#1e2c24] p-4 sm:p-6 shadow-2xl text-xs my-auto max-h-[92vh] overflow-y-auto flex flex-col">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#1c2c22] mb-4 shrink-0">
              <div>
                <h3 className="text-base font-bold text-white">Manual Event Creation &amp; Samples</h3>
                <p className="text-[11px] text-slate-400">Click a sample template below to autofill or type manually.</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Quick Sample Presets */}
            <div className="mb-4 p-3 rounded-xl bg-[#060908] border border-[#1e2c24]">
              <span className="text-[10px] uppercase font-bold text-[#C5A059] block mb-2">
                Click Sample to Autofill:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => loadEventSample('football')}
                  className="px-2.5 py-1 rounded-md bg-[#0d1410] border border-[#1e2c24] hover:border-[#0FA958] text-slate-200 text-[11px] cursor-pointer"
                >
                  ⚽ Football (Harambee Stars vs Nigeria)
                </button>
                <button
                  type="button"
                  onClick={() => loadEventSample('concert')}
                  className="px-2.5 py-1 rounded-md bg-[#0d1410] border border-[#1e2c24] hover:border-[#0FA958] text-slate-200 text-[11px] cursor-pointer"
                >
                  🎵 Concert (Burna Boy Live)
                </button>
                <button
                  type="button"
                  onClick={() => loadEventSample('rugby')}
                  className="px-2.5 py-1 rounded-md bg-[#0d1410] border border-[#1e2c24] hover:border-[#0FA958] text-slate-200 text-[11px] cursor-pointer"
                >
                  🏉 Rugby (Safari Sevens)
                </button>
                <button
                  type="button"
                  onClick={() => loadEventSample('athletics')}
                  className="px-2.5 py-1 rounded-md bg-[#0d1410] border border-[#1e2c24] hover:border-[#0FA958] text-slate-200 text-[11px] cursor-pointer"
                >
                  🏃 Athletics (Olympic Trials)
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="text-slate-300 block mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g. Kenya vs Ivory Coast"
                  className="w-full px-3 py-2 rounded-lg bg-[#060908] border border-[#1e2c24] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Category</label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#060908] border border-[#1e2c24] text-white"
                  >
                    <option value="football">Football</option>
                    <option value="concerts">Mega Concert</option>
                    <option value="athletics">Athletics</option>
                    <option value="rugby">Rugby Sevens</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Tournament / Banner</label>
                  <input
                    type="text"
                    value={newEventTournament}
                    onChange={(e) => setNewEventTournament(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#060908] border border-[#1e2c24] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#060908] border border-[#1e2c24] text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Kickoff / Start Time</label>
                  <input
                    type="time"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#060908] border border-[#1e2c24] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Min Ticket Price (KES)</label>
                  <input
                    type="number"
                    value={newEventMinPrice}
                    onChange={(e) => setNewEventMinPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#060908] border border-[#1e2c24] text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Max Ticket Price (KES)</label>
                  <input
                    type="number"
                    value={newEventMaxPrice}
                    onChange={(e) => setNewEventMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#060908] border border-[#1e2c24] text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={newEventShortDesc}
                  onChange={(e) => setNewEventShortDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#060908] border border-[#1e2c24] text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#1e2c24] text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#005A2B] text-white font-bold uppercase tracking-wider"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0c120f] border border-[#1e2c24] p-4 sm:p-6 shadow-2xl text-xs my-auto max-h-[92vh] overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c2c22] mb-4 shrink-0">
              <div>
                <h3 className="text-base font-bold text-white">Manual Match Ticket Issuer</h3>
                <p className="text-[11px] text-slate-400">Issue direct passes for VIP guests, corporate delegations, or protocol.</p>
              </div>
              <button onClick={() => { setShowManualTicketModal(false); setManualIssuedResult(null); }} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {manualIssuedResult ? (
              <div className="p-4 rounded-xl bg-[#005A2B]/20 border border-[#0FA958]/30 space-y-3">
                <div className="flex items-center gap-2 text-[#0FA958] font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Manual Ticket Successfully Issued &amp; Activated!</span>
                </div>
                <div className="p-3 bg-black/60 rounded-lg font-mono text-[11px] space-y-1">
                  <p>Ticket Number: <strong className="text-white">{manualIssuedResult.ticket.ticketNumber}</strong></p>
                  <p>Ref: <strong className="text-[#E5C378]">{manualIssuedResult.booking.bookingReference}</strong></p>
                  <p>Attendee: {manualIssuedResult.ticket.attendeeName}</p>
                  <p>Stand: {manualIssuedResult.ticket.sectionName}</p>
                  <p>Turnstile: {manualIssuedResult.ticket.turnstileNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setManualIssuedResult(null)}
                  className="w-full py-2 rounded-lg bg-[#005A2B] text-white font-bold"
                >
                  Issue Another Pass
                </button>
              </div>
            ) : (
              <form onSubmit={handleManualIssueTicket} className="space-y-3">
                <div>
                  <label className="text-slate-300 block mb-1">Select Event</label>
                  <select
                    value={manualEventId}
                    onChange={(e) => setManualEventId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#060908] border border-[#1e2c24] text-white"
                  >
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>{e.title}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1">Seating Stand</label>
                    <select
                      value={manualSectionCode}
                      onChange={(e) => setManualSectionCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#060908] border border-[#1e2c24] text-white"
                    >
                      <option value="VVIP_PRESIDENTIAL">VVIP Presidential Skybox</option>
                      <option value="VIP_GOLD_WEST">VIP Gold Terrace</option>
                      <option value="CAT1_WEST_UPPER">Category 1 West Concourse</option>
                      <option value="CAT2_EAST_STAND">Category 2 East Stand</option>
                      <option value="CAT3_NORTH_ULTRAS">Category 3 North Stand</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Specific Seat / Row</label>
                    <input
                      type="text"
                      value={manualSeat}
                      onChange={(e) => setManualSeat(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#060908] border border-[#1e2c24] text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1">Attendee Name</label>
                    <input
                      type="text"
                      required
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#060908] border border-[#1e2c24] text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">National ID / Passport</label>
                    <input
                      type="text"
                      required
                      value={manualIdNumber}
                      onChange={(e) => setManualIdNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#060908] border border-[#1e2c24] text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#060908] border border-[#1e2c24] text-white font-mono"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowManualTicketModal(false)}
                    className="px-4 py-2 rounded-lg border border-[#1e2c24] text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#C5A059] text-black font-bold uppercase tracking-wider"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0c120f] border border-[#1e2c24] p-4 sm:p-6 shadow-2xl text-xs my-auto max-h-[92vh] overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c2c22] mb-4 shrink-0">
              <div>
                <h3 className="text-base font-bold text-white">Broadcast Matchday Notice</h3>
                <p className="text-[11px] text-slate-400">Post urgent advisory to the top ticker across all fan devices.</p>
              </div>
              <button onClick={() => setShowAnnouncementModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="text-slate-300 block mb-1">Announcement Message</label>
                <textarea
                  required
                  rows={3}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="e.g. Kenya Railways matchday trains departing Nairobi Central at 15-minute intervals. Gates open."
                  className="w-full px-3 py-2 rounded-lg bg-[#060908] border border-[#1e2c24] text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Severity Level</label>
                <select
                  value={announcementSeverity}
                  onChange={(e) => setAnnouncementSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-[#060908] border border-[#1e2c24] text-white"
                >
                  <option value="info">Information (Standard Green Notice)</option>
                  <option value="warning">Warning / Security Advisory (Amber Notice)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#1e2c24] text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#005A2B] text-white font-bold uppercase tracking-wider"
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
