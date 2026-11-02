import React, { useState } from 'react';
import { BookingItem, UserProfile, TicketItem } from '../types';
import { formatKes } from '../utils/qrcode';
import { Ticket, CreditCard, User, Calendar, Clock, AlertTriangle, CheckCircle, Download, ArrowRight, ShieldCheck, QrCode } from 'lucide-react';

interface UserDashboardProps {
  currentUser: UserProfile;
  bookings: BookingItem[];
  onViewTicketPass: (booking: BookingItem) => void;
  onCancelBooking: (bookingId: string) => Promise<void>;
  onExploreEvents: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  bookings,
  onViewTicketPass,
  onCancelBooking,
  onExploreEvents,
}) => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'payments' | 'profile'>('tickets');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking? A refund request will be initiated to your M-Pesa phone number.')) {
      return;
    }
    setCancellingId(bookingId);
    try {
      await onCancelBooking(bookingId);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="py-12 bg-[#060908] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Welcome Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1611] via-[#09110c] to-[#0d1611] border border-[#1e2c24] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#005A2B]/40 border border-[#0FA958]/30 flex items-center justify-center text-xl font-black text-[#E5C378]">
              {currentUser.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{currentUser.fullName}</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#005A2B] text-white">
                  Verified Fan
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                M-Pesa: {currentUser.phoneNumber} · National ID: {currentUser.nationalId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExploreEvents}
              className="py-2.5 px-4 rounded-xl bg-[#005A2B] hover:bg-[#007036] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Explore Fixtures</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 border-b border-[#1c2c22] mb-8 pb-3 text-xs sm:text-sm font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'tickets'
                ? 'bg-[#131c17] text-[#E5C378] border border-[#C5A059]/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ticket className="w-4 h-4 shrink-0" />
            <span>My Match Tickets ({bookings.reduce((sum, b) => sum + b.tickets.length, 0)})</span>
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'payments'
                ? 'bg-[#131c17] text-[#E5C378] border border-[#C5A059]/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            <span>M-Pesa Receipts</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'profile'
                ? 'bg-[#131c17] text-[#E5C378] border border-[#C5A059]/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span>Profile &amp; ID Verification</span>
          </button>
        </div>

        {/* TAB 1: TICKETS */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            {bookings.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#090f0c] border border-[#1e2c24]">
                <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Match Tickets Yet</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  You haven't reserved tickets for any upcoming events at Talanta Stadium.
                </p>
                <button
                  onClick={onExploreEvents}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-[#005A2B] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Browse Fixtures
                </button>
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl bg-[#0a100c] border border-[#1e2c24] overflow-hidden shadow-xl"
                >
                  {/* Booking Header */}
                  <div className="p-5 bg-[#0e1612] border-b border-[#1c2c22] flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block">
                        Booking Ref: {booking.bookingReference}
                      </span>
                      <h3 className="text-base font-extrabold text-white mt-0.5">
                        {booking.eventTitle}
                      </h3>
                      <p className="text-xs text-slate-400">Date: {booking.eventDate}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                          booking.status === 'confirmed'
                            ? 'bg-[#005A2B] text-white'
                            : booking.status === 'cancelled'
                            ? 'bg-red-950/60 text-red-400 border border-red-500/30'
                            : 'bg-amber-950/60 text-amber-400'
                        }`}
                      >
                        {booking.status}
                      </span>

                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => onViewTicketPass(booking)}
                          className="py-2 px-3.5 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>View Pass &amp; QR</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Individual Tickets inside Booking */}
                  <div className="p-5 divide-y divide-[#1c2c22]">
                    {booking.tickets.map((t) => (
                      <div key={t.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{t.attendeeName}</span>
                            <span className="text-[11px] text-slate-400 font-mono">ID: {t.attendeeNationalId}</span>
                          </div>
                          <p className="text-xs text-[#E5C378] font-semibold mt-1">
                            {t.sectionName} · {t.standLocation}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {t.seatInfo} · Gate: {t.gateEntrance.split(' - ')[0]} ({t.turnstileNumber})
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-bold text-white font-mono">{formatKes(t.priceKes)}</span>
                          <span className={`block text-[10px] font-bold uppercase ${t.status === 'scanned' ? 'text-amber-400' : 'text-[#0FA958]'}`}>
                            {t.status === 'scanned' ? 'SCANNED AT GATE' : 'READY FOR ENTRY'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Booking Footer & Actions */}
                  <div className="p-4 bg-[#070b09] border-t border-[#1c2c22] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                    <div>
                      {booking.paymentDetails && (
                        <span>M-Pesa Receipt: <strong className="text-[#0FA958] font-mono">{booking.paymentDetails.receiptNumber}</strong> · </span>
                      )}
                      <span>Total Paid: <strong className="text-white font-mono">{formatKes(booking.totalAmountKes)}</strong></span>
                    </div>

                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="text-red-400 hover:text-red-300 text-xs font-semibold underline cursor-pointer disabled:opacity-50"
                      >
                        {cancellingId === booking.id ? 'Processing Cancellation...' : 'Cancel Booking & Refund'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="bg-[#0a100c] rounded-2xl border border-[#1e2c24] p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4">Safaricom Daraja Lipa Na M-Pesa History</h3>
            <div className="space-y-3">
              {bookings.filter(b => b.paymentDetails).map((b) => (
                <div key={b.id} className="p-4 rounded-xl bg-[#060908] border border-[#1c2c22] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="font-mono font-bold text-[#0FA958] text-sm">{b.paymentDetails?.receiptNumber}</span>
                    <p className="text-white font-semibold mt-0.5">{b.eventTitle}</p>
                    <p className="text-slate-400 text-[11px]">Phone: {b.paymentDetails?.phoneNumber} · Ref: {b.bookingReference}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-white font-mono">{formatKes(b.totalAmountKes)}</span>
                    <span className="block text-[10px] text-[#0FA958] font-bold uppercase">PAYMENT CONFIRMED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-[#0a100c] rounded-2xl border border-[#1e2c24] p-6 shadow-xl max-w-xl">
            <h3 className="text-base font-bold text-white mb-4">Fan Account &amp; Identity</h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  readOnly
                  value={currentUser.fullName}
                  className="w-full px-3 py-2 rounded-lg bg-[#060908] border border-[#1e2c24] text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Registered M-Pesa Phone</label>
                <input
                  type="text"
                  readOnly
                  value={currentUser.phoneNumber}
                  className="w-full px-3 py-2 rounded-lg bg-[#060908] border border-[#1e2c24] text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">National ID / Passport Number</label>
                <input
                  type="text"
                  readOnly
                  value={currentUser.nationalId}
                  className="w-full px-3 py-2 rounded-lg bg-[#060908] border border-[#1e2c24] text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  readOnly
                  value={currentUser.email}
                  className="w-full px-3 py-2 rounded-lg bg-[#060908] border border-[#1e2c24] text-white"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
