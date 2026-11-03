import React, { useState } from 'react';
import { BookingItem, UserProfile, RoomBookingItem } from '../types';
import { formatKes } from '../utils/qrcode';
import { Ticket, CreditCard, User, ArrowRight, QrCode, Building, BedDouble, Calendar, MapPin } from 'lucide-react';

interface UserDashboardProps {
  currentUser: UserProfile;
  bookings: BookingItem[];
  roomBookings?: RoomBookingItem[];
  onViewTicketPass: (booking: BookingItem) => void;
  onCancelBooking: (bookingId: string) => Promise<void>;
  onCancelRoomBooking?: (bookingId: string) => Promise<void>;
  onExploreEvents: () => void;
  onExploreRooms?: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  bookings,
  roomBookings = [],
  onViewTicketPass,
  onCancelBooking,
  onCancelRoomBooking,
  onExploreEvents,
  onExploreRooms,
}) => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'rooms' | 'payments' | 'profile'>('tickets');
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

  const handleCancelRoom = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this Nairobi hotel reservation?')) {
      return;
    }
    if (onCancelRoomBooking) {
      setCancellingId(bookingId);
      try {
        await onCancelRoomBooking(bookingId);
      } finally {
        setCancellingId(null);
      }
    }
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Welcome Banner */}
        <div className="p-6 rounded-xl bg-white border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-xl font-bold text-blue-700">
              {currentUser.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{currentUser.fullName}</h1>
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Verified Fan &amp; Guest
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                M-Pesa: {currentUser.phoneNumber} · National ID: {currentUser.nationalId}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onExploreEvents}
              className="py-2.5 px-4 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-colors shadow-sm cursor-pointer flex items-center gap-2"
            >
              <span>Explore Fixtures</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {onExploreRooms && (
              <button
                onClick={onExploreRooms}
                className="py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer flex items-center gap-2"
              >
                <BedDouble className="w-3.5 h-3.5" />
                <span>Book Nairobi Rooms (50)</span>
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 mb-8 pb-3 text-xs sm:text-sm font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'tickets'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Ticket className="w-4 h-4 shrink-0" />
            <span>Match Tickets ({bookings.reduce((sum, b) => sum + b.tickets.length, 0)})</span>
          </button>

          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'rooms'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Building className="w-4 h-4 shrink-0" />
            <span>Hotel Stays &amp; Vouchers ({roomBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'payments'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            <span>M-Pesa Receipts</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
              <div className="p-12 text-center rounded-xl bg-white border border-gray-200 shadow-sm">
                <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-900">No Match Tickets Yet</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  You haven't reserved tickets for any upcoming events at Talanta Stadium.
                </p>
                <button
                  onClick={onExploreEvents}
                  className="mt-4 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-sm transition-colors"
                >
                  Browse Fixtures
                </button>
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm"
                >
                  {/* Booking Header */}
                  <div className="p-5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 block">
                        Booking Ref: {booking.bookingReference}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 mt-0.5">
                        {booking.eventTitle}
                      </h3>
                      <p className="text-xs text-gray-500">Date: {booking.eventDate}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {booking.status}
                      </span>

                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => onViewTicketPass(booking)}
                          className="py-2 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs tracking-wider transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>View Pass &amp; QR</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Individual Tickets inside Booking */}
                  <div className="p-5 divide-y divide-gray-100">
                    {booking.tickets.map((t) => (
                      <div key={t.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">{t.attendeeName}</span>
                            <span className="text-xs text-gray-500 font-mono">ID: {t.attendeeNationalId}</span>
                          </div>
                          <p className="text-xs text-blue-600 font-medium mt-1">
                            {t.sectionName} · {t.standLocation}
                          </p>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">
                            {t.seatInfo} · Gate: {t.gateEntrance.split(' - ')[0]} ({t.turnstileNumber})
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-bold text-gray-900 font-mono">{formatKes(t.priceKes)}</span>
                          <span className={`block text-xs font-semibold uppercase ${t.status === 'scanned' ? 'text-amber-600' : 'text-green-700'}`}>
                            {t.status === 'scanned' ? 'SCANNED AT GATE' : 'READY FOR ENTRY'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Booking Footer & Actions */}
                  <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600">
                    <div>
                      {booking.paymentDetails && (
                        <span>M-Pesa Receipt: <strong className="text-green-700 font-mono">{booking.paymentDetails.receiptNumber}</strong> · </span>
                      )}
                      <span>Total Paid: <strong className="text-gray-900 font-mono">{formatKes(booking.totalAmountKes)}</strong></span>
                    </div>

                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="text-red-600 hover:text-red-700 text-xs font-medium underline cursor-pointer disabled:opacity-50"
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

        {/* TAB 2: HOTEL ROOM STAYS & VOUCHERS */}
        {activeTab === 'rooms' && (
          <div className="space-y-6">
            {roomBookings.length === 0 ? (
              <div className="p-12 text-center rounded-xl bg-white border border-gray-200 shadow-sm">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-900">No Hotel Reservations Yet</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Browse our curated directory of 50 classic rooms in Nairobi, from luxury Karen villas to skyline penthouses in Westlands.
                </p>
                {onExploreRooms && (
                  <button
                    onClick={onExploreRooms}
                    className="mt-4 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-sm transition-colors"
                  >
                    Explore Nairobi Rooms (50)
                  </button>
                )}
              </div>
            ) : (
              roomBookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm"
                >
                  <div className="p-5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 block">
                        Voucher Ref: {b.bookingReference} · {b.neighborhood}, Nairobi
                      </span>
                      <h3 className="text-base font-bold text-gray-900 mt-0.5">
                        {b.hotelName} — {b.roomName}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>Check-in: <strong>{b.checkInDate}</strong> · Check-out: <strong>{b.checkOutDate}</strong> ({b.nights} nights)</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider ${
                          b.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Lead Guest: {b.guestName}</p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {b.nationalId} · Phone: {b.guestPhone}</p>
                      {b.specialRequests && (
                        <p className="text-xs text-blue-700 bg-blue-50/60 p-2 rounded mt-2 border border-blue-100">
                          {b.specialRequests}
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-bold text-gray-900 font-mono">{formatKes(b.totalAmountKes)}</span>
                      <p className="text-xs text-green-700 font-mono mt-0.5">Receipt: {b.paymentReceipt}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>{b.neighborhood}, Nairobi</span>
                    </span>

                    {b.status === 'confirmed' && onCancelRoomBooking && (
                      <button
                        onClick={() => handleCancelRoom(b.id)}
                        disabled={cancellingId === b.id}
                        className="text-red-600 hover:text-red-700 text-xs font-medium underline cursor-pointer disabled:opacity-50"
                      >
                        {cancellingId === b.id ? 'Processing...' : 'Cancel Reservation'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">Safaricom Daraja Lipa Na M-Pesa History</h3>
            <div className="space-y-3">
              {bookings.filter(b => b.paymentDetails).map((b) => (
                <div key={b.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="font-mono font-bold text-green-700 text-sm">{b.paymentDetails?.receiptNumber}</span>
                    <p className="text-gray-900 font-semibold mt-0.5">{b.eventTitle}</p>
                    <p className="text-gray-500 text-xs">Phone: {b.paymentDetails?.phoneNumber} · Ref: {b.bookingReference}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-gray-900 font-mono">{formatKes(b.totalAmountKes)}</span>
                    <span className="block text-xs text-green-700 font-semibold uppercase">PAYMENT CONFIRMED</span>
                  </div>
                </div>
              ))}
              {roomBookings.map((rb) => (
                <div key={rb.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="font-mono font-bold text-green-700 text-sm">{rb.paymentReceipt}</span>
                    <p className="text-gray-900 font-semibold mt-0.5">Hotel: {rb.hotelName} ({rb.roomName})</p>
                    <p className="text-gray-500 text-xs">Phone: {rb.guestPhone} · Ref: {rb.bookingReference}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-gray-900 font-mono">{formatKes(rb.totalAmountKes)}</span>
                    <span className="block text-xs text-green-700 font-semibold uppercase">PAYMENT CONFIRMED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm max-w-xl">
            <h3 className="text-base font-bold text-gray-900 mb-4">Fan &amp; Guest Account Identity</h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-gray-700 font-medium block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  readOnly
                  value={currentUser.fullName}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900"
                />
              </div>
              <div>
                <label className="text-gray-700 font-medium block mb-1">Registered M-Pesa Phone</label>
                <input
                  type="text"
                  readOnly
                  value={currentUser.phoneNumber}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 font-mono"
                />
              </div>
              <div>
                <label className="text-gray-700 font-medium block mb-1">National ID / Passport Number</label>
                <input
                  type="text"
                  readOnly
                  value={currentUser.nationalId}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 font-mono"
                />
              </div>
              <div>
                <label className="text-gray-700 font-medium block mb-1">Email Address</label>
                <input
                  type="email"
                  readOnly
                  value={currentUser.email}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
