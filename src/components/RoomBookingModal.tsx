import React, { useState } from 'react';
import { RoomItem, RoomBookingItem, UserProfile } from '../types';
import { formatKes } from '../utils/qrcode';
import { X, Calendar, Users, ShieldCheck, Phone, Check, ArrowRight, Loader2, QrCode, Printer, Download, MapPin } from 'lucide-react';

interface RoomBookingModalProps {
  room: RoomItem;
  currentUser: UserProfile;
  onClose: () => void;
  onBookingConfirmed: (booking: RoomBookingItem) => void;
}

export const RoomBookingModal: React.FC<RoomBookingModalProps> = ({
  room,
  currentUser,
  onClose,
  onBookingConfirmed,
}) => {
  // Step 1: Dates & Guests, Step 2: Guest Info, Step 3: Payment, Step 4: Voucher
  const [step, setStep] = useState<number>(1);

  // Default dates: tomorrow to day after tomorrow
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 2);

  const formatDateInput = (d: Date) => d.toISOString().split('T')[0];

  const [checkInDate, setCheckInDate] = useState<string>(formatDateInput(tomorrow));
  const [checkOutDate, setCheckOutDate] = useState<string>(formatDateInput(dayAfter));
  const [guestCount, setGuestCount] = useState<number>(2);

  // Guest Details
  const [guestName, setGuestName] = useState<string>(currentUser.fullName || 'Victor Kipkoech');
  const [guestPhone, setGuestPhone] = useState<string>(currentUser.phoneNumber || '0712345678');
  const [guestEmail, setGuestEmail] = useState<string>(currentUser.email || 'kipkoechvictor503@gmail.com');
  const [nationalId, setNationalId] = useState<string>(currentUser.nationalId || '34567890');
  const [specialRequests, setSpecialRequests] = useState<string>(
    room.matchdayShuttleIncluded ? 'Requesting Talanta Stadium Matchday Shuttle pick-up' : ''
  );

  // M-Pesa STK push simulation state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stkPromptActive, setStkPromptActive] = useState<boolean>(false);
  const [mpesaPin, setMpesaPin] = useState<string>('');
  const [confirmedBooking, setConfirmedBooking] = useState<RoomBookingItem | null>(null);

  // Nights calculation
  const dIn = new Date(checkInDate);
  const dOut = new Date(checkOutDate);
  const diffTime = dOut.getTime() - dIn.getTime();
  const calculatedNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const subtotalKes = calculatedNights * room.pricePerNightKes;
  const tourismLevyKes = Math.round(subtotalKes * 0.02); // 2% Kenya Tourism Training Levy
  const totalAmountKes = subtotalKes + tourismLevyKes;

  const handleProceedToDetails = () => {
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      alert('Check-out date must be after check-in date.');
      return;
    }
    setStep(2);
  };

  const handleProceedToPayment = () => {
    if (!guestName || !guestPhone || !nationalId) {
      alert('Please fill in guest name, phone number, and national ID/passport number.');
      return;
    }
    setStep(3);
  };

  const handleInitiateMpesa = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStkPromptActive(true);
    }, 800);
  };

  const handleConfirmMpesaPin = async () => {
    if (!mpesaPin || mpesaPin.length < 4) {
      alert('Please enter your 4-digit M-Pesa PIN.');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/room-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: room.id,
          checkInDate,
          checkOutDate,
          guestCount,
          guestName,
          guestPhone,
          guestEmail,
          nationalId,
          specialRequests,
          userId: currentUser.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete hotel booking');
      }

      setIsProcessing(false);
      setStkPromptActive(false);
      setConfirmedBooking(data.booking);
      setStep(4);
      onBookingConfirmed(data.booking);
    } catch (err: any) {
      setIsProcessing(false);
      alert(err.message || 'Payment confirmation failed');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="relative w-full max-w-2xl rounded-xl bg-white border border-gray-200 shadow-2xl overflow-hidden text-gray-800 my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Top Banner */}
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 block">
              Hotel Reservation · {room.neighborhood}, Nairobi
            </span>
            <h3 className="text-base font-bold text-gray-900 mt-0.5">
              {room.hotelName} — {room.roomName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator (Steps 1 to 3) */}
        {step < 4 && (
          <div className="grid grid-cols-3 border-b border-gray-200 text-xs font-medium text-center shrink-0">
            <div className={`py-3 ${step === 1 ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600 font-semibold' : 'text-gray-500 bg-white'}`}>
              1. Dates &amp; Space
            </div>
            <div className={`py-3 ${step === 2 ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600 font-semibold' : 'text-gray-500 bg-white'}`}>
              2. Guest Info
            </div>
            <div className={`py-3 ${step === 3 ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600 font-semibold' : 'text-gray-500 bg-white'}`}>
              3. M-Pesa Checkout
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          
          {/* STEP 1: DATES & GUESTS */}
          {step === 1 && (
            <div className="space-y-6">
              
              {/* Room Card Preview */}
              <div className="flex gap-4 p-3.5 rounded-lg border border-gray-200 bg-gray-50">
                <img
                  src={room.imageUrl}
                  alt={room.roomName}
                  className="w-24 h-20 rounded-md object-cover shrink-0 border border-gray-300"
                />
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">
                    {room.spaceCategory} · {room.floorAreaSqM} m²
                  </span>
                  <h4 className="text-sm font-bold text-gray-900 truncate mt-0.5">{room.roomName}</h4>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{room.address}</span>
                  </p>
                  <p className="text-xs text-gray-600 font-medium mt-1">
                    {room.distanceToTalanta} to Talanta Stadium
                  </p>
                </div>
              </div>

              {/* Date Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                    Check-in Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="date"
                      value={checkInDate}
                      min={formatDateInput(today)}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                    Check-out Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="date"
                      value={checkOutDate}
                      min={checkInDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Guest Count */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Number of Guests
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].filter(n => n <= room.guestCapacity).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuestCount(num)}
                      className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                        guestCount === num
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing Calculation Summary */}
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Room Rate ({calculatedNights} {calculatedNights === 1 ? 'night' : 'nights'} × {formatKes(room.pricePerNightKes)})</span>
                  <span className="font-semibold text-gray-900">{formatKes(subtotalKes)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tourism Training &amp; Infrastructure Levy (2%)</span>
                  <span className="font-semibold text-gray-900">{formatKes(tourismLevyKes)}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold text-gray-900">
                  <span>Total Due (KES):</span>
                  <span className="text-base text-blue-600 font-bold">{formatKes(totalAmountKes)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProceedToDetails}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
                >
                  <span>Guest Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: GUEST DETAILS */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Government Hospitality Verification: A valid national ID or international passport is required at check-in for hotel security registration.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Lead Guest Full Legal Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Victor Kipkoech"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">National ID / Passport Number</label>
                  <input
                    type="text"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="e.g. 34567890"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">M-Pesa Mobile Number (Kenya)</label>
                  <input
                    type="text"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="07XXXXXXXX or 01XXXXXXXX"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Email Address for Booking Confirmation</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="guest@example.com"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Special Requests / Arrival Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Matchday shuttle pickup time, airport transfer, dietary preferences..."
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: M-PESA PAYMENT */}
          {step === 3 && (
            <div className="space-y-6">
              
              {/* Reservation Summary */}
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Property:</span>
                  <span className="font-bold text-gray-900">{room.hotelName} ({room.neighborhood})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Space:</span>
                  <span className="font-semibold text-gray-900">{room.roomName} ({room.floorAreaSqM} m²)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Dates:</span>
                  <span className="font-semibold text-gray-900">{checkInDate} to {checkOutDate} ({calculatedNights} nights)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Guest:</span>
                  <span className="font-semibold text-gray-900">{guestName} ({guestCount} guests)</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-sm">
                  <span className="font-bold text-gray-900">Total Payable:</span>
                  <span className="text-lg font-bold text-blue-600">{formatKes(totalAmountKes)}</span>
                </div>
              </div>

              {/* Safaricom M-Pesa STK Push Box */}
              <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-700 p-1 flex items-center justify-center text-white">
                    <span className="font-black text-xs tracking-tighter">M-PESA</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                      Lipa Na M-Pesa Online
                    </h4>
                    <p className="text-xs text-gray-500">
                      Safaricom Daraja Automated Hotel Escrow · Paybill 400200
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">
                      M-Pesa Mobile Number for Prompt:
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="0712345678"
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white border border-gray-300 text-sm text-gray-900 font-mono focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    Clicking below triggers a prompt on your phone asking you to enter your M-Pesa PIN to complete payment of <strong className="text-gray-900">{formatKes(totalAmountKes)}</strong> for your confirmed stay at {room.hotelName}.
                  </p>
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleInitiateMpesa}
                    className="w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending M-Pesa STK Prompt...</span>
                      </>
                    ) : (
                      <span>Pay {formatKes(totalAmountKes)} via M-Pesa</span>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  &larr; Back to Guest Info
                </button>
              </div>

            </div>
          )}

          {/* STEP 4: CONFIRMED HOTEL VOUCHER PASS */}
          {step === 4 && confirmedBooking && (
            <div className="space-y-6">
              
              <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-900 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Room Stay Confirmed &amp; Payment Verified</h4>
                  <p className="text-xs text-green-700">M-Pesa Receipt: {confirmedBooking.paymentReceipt} · Booking Ref: {confirmedBooking.bookingReference}</p>
                </div>
              </div>

              {/* Printable Voucher Card */}
              <div className="rounded-xl bg-white border border-gray-300 p-5 shadow-sm space-y-4 print:border-none print:shadow-none">
                <div className="flex items-start justify-between pb-3 border-b border-gray-200">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
                      Digital Hotel Stay Voucher
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">{confirmedBooking.hotelName}</h3>
                    <p className="text-xs text-gray-500">{confirmedBooking.neighborhood}, Nairobi · {confirmedBooking.address}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded text-xs font-semibold bg-green-100 text-green-800 uppercase">
                      CONFIRMED
                    </span>
                    <p className="text-xs font-mono text-gray-600 mt-1">Ref: {confirmedBooking.bookingReference}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 text-center text-xs">
                  <div>
                    <span className="text-gray-500 block">Check-in</span>
                    <span className="font-bold text-gray-900">{confirmedBooking.checkInDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Check-out</span>
                    <span className="font-bold text-gray-900">{confirmedBooking.checkOutDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Nights</span>
                    <span className="font-bold text-blue-600">{confirmedBooking.nights} Night(s)</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Guests</span>
                    <span className="font-bold text-gray-900">{confirmedBooking.guestCount} Guest(s)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block">Reserved Room:</span>
                    <strong className="text-gray-900 text-sm">{confirmedBooking.roomName}</strong>
                    <p className="text-gray-600 mt-0.5">{room.spaceCategory} · {room.floorAreaSqM} m²</p>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Lead Guest:</span>
                    <strong className="text-gray-900">{confirmedBooking.guestName}</strong>
                    <p className="text-gray-600 font-mono">ID: {confirmedBooking.nationalId}</p>
                  </div>
                </div>

                {confirmedBooking.specialRequests && (
                  <div className="p-2.5 rounded bg-blue-50/70 border border-blue-100 text-xs text-gray-700">
                    <strong>Guest Note / Transfer:</strong> {confirmedBooking.specialRequests}
                  </div>
                )}

                <div className="pt-3 border-t border-dashed border-gray-300 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-gray-700 block">Hotel Front Desk Token</span>
                    <p className="text-xs text-gray-500">Present this QR code or Booking Reference at front desk.</p>
                  </div>
                  <div className="w-16 h-16 p-1 bg-white border border-gray-300 rounded flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-gray-800" />
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <Printer className="w-4 h-4 text-gray-600" />
                  <span>Print Voucher</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  Done
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* REALISTIC INTERACTIVE SAFARICOM M-PESA STK PUSH HANDSET PROMPT */}
      {stkPromptActive && (
        <div className="fixed inset-0 z-60 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm rounded-2xl bg-white border border-gray-200 p-6 shadow-2xl text-center font-sans">
            
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

            <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-3">
              <Phone className="w-6 h-6 text-green-700" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-green-700">
              SIM Toolkit · Safaricom M-Pesa
            </span>

            <h4 className="text-sm font-bold text-gray-900 mt-1">
              Do you want to pay {formatKes(totalAmountKes)} to {room.hotelName.toUpperCase()}?
            </h4>

            <div className="my-3 p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-700 text-left space-y-1">
              <p>Business No: <strong className="text-gray-900">400200</strong></p>
              <p>Account: <strong className="text-gray-900">HOTEL-RESERVATION</strong></p>
              <p>Amount: <strong className="text-gray-900">{formatKes(totalAmountKes)}</strong></p>
            </div>

            <p className="text-xs text-gray-600 mb-2">
              Enter your M-PESA PIN to authorize reservation:
            </p>

            <div className="flex justify-center mb-4">
              <input
                type="password"
                maxLength={4}
                value={mpesaPin}
                onChange={(e) => setMpesaPin(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="• • • •"
                autoFocus
                className="w-32 text-center text-2xl tracking-[0.4em] py-2 bg-white border-2 border-blue-600 rounded-lg text-gray-900 font-mono focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStkPromptActive(false)}
                className="py-2.5 px-4 rounded-lg border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing || mpesaPin.length < 4}
                onClick={handleConfirmMpesaPin}
                className="py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors disabled:opacity-40"
              >
                {isProcessing ? 'Verifying...' : 'Send PIN'}
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Demo Environment: Enter any 4-digit PIN (e.g. 1234) to confirm receipt.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
