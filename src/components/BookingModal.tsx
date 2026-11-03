import React, { useState } from 'react';
import { EventItem, SeatingSection, BookingItem, UserProfile } from '../types';
import { formatKes } from '../utils/qrcode';
import { DEFAULT_SECTIONS } from '../constants/seating';
import { X, Check, ArrowRight, ShieldCheck, Phone, AlertCircle, Loader2 } from 'lucide-react';

interface BookingModalProps {
  event: EventItem;
  sections: SeatingSection[];
  initialSection?: SeatingSection;
  currentUser: UserProfile;
  onClose: () => void;
  onBookingConfirmed: (booking: BookingItem) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  event,
  sections,
  initialSection,
  currentUser,
  onClose,
  onBookingConfirmed,
}) => {
  const safeSections = sections && sections.length > 0 ? sections : DEFAULT_SECTIONS;
  const [selectedSectionCode, setSelectedSectionCode] = useState<string>(
    initialSection?.code || 'VIP_GOLD_WEST'
  );
  const [ticketQty, setTicketQty] = useState<number>(1);
  const [step, setStep] = useState<number>(1); // 1: Select Seating, 2: Attendee Info, 3: M-Pesa Payment

  // Form Fields
  const [contactName, setContactName] = useState<string>(currentUser.fullName || '');
  const [contactEmail, setContactEmail] = useState<string>(currentUser.email || '');
  const [contactPhone, setContactPhone] = useState<string>(currentUser.phoneNumber || '0712345678');
  const [nationalId, setNationalId] = useState<string>(currentUser.nationalId || '34567890');
  
  // Additional attendees if quantity > 1
  const [attendees, setAttendees] = useState<{ name: string; nationalId: string }[]>([
    { name: currentUser.fullName || '', nationalId: currentUser.nationalId || '' }
  ]);

  // STK Push state
  const [isInitiatingStk, setIsInitiatingStk] = useState<boolean>(false);
  const [stkPromptActive, setStkPromptActive] = useState<boolean>(false);
  const [mpesaPin, setMpesaPin] = useState<string>('');
  const [checkoutRequestId, setCheckoutRequestId] = useState<string>('');
  const [bookingRef, setBookingRef] = useState<string>('');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const activeSection = safeSections.find(s => s.code === selectedSectionCode) || safeSections[0] || DEFAULT_SECTIONS[0];

  const subtotalKes = (activeSection?.priceKes || 1000) * ticketQty;
  const sportsLevyKes = ticketQty * 50; // KES 50 Sports Development & Infrastructure Levy
  const totalAmountKes = subtotalKes + sportsLevyKes;

  const handleQtyChange = (qty: number) => {
    setTicketQty(qty);
    const newAttendees = [];
    for (let i = 0; i < qty; i++) {
      newAttendees.push(attendees[i] || { name: i === 0 ? contactName : '', nationalId: i === 0 ? nationalId : '' });
    }
    setAttendees(newAttendees);
  };

  const handleAttendeeChange = (index: number, field: 'name' | 'nationalId', value: string) => {
    const updated = [...attendees];
    updated[index] = { ...updated[index], [field]: value };
    setAttendees(updated);
  };

  // Step 2 Proceed
  const handleProceedToPayment = () => {
    if (!contactName || !contactPhone || !nationalId) {
      alert('Please fill in contact name, phone number, and national ID/passport.');
      return;
    }
    setStep(3);
  };

  // Initiate M-Pesa STK Push
  const handleInitiateMpesa = async () => {
    setIsInitiatingStk(true);
    setPaymentError(null);

    try {
      // 1. Create booking in backend
      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          sectionCode: activeSection.code,
          quantity: ticketQty,
          contactName,
          contactEmail,
          contactPhone,
          nationalId,
          attendees,
          userId: currentUser.id,
        }),
      });

      const bookingData = await bookingRes.json();
      if (!bookingRes.ok) {
        throw new Error(bookingData.error || 'Failed to create booking reservation');
      }

      setBookingRef(bookingData.bookingReference);

      // 2. Trigger Safaricom Daraja STK Push
      const stkRes = await fetch('/api/payments/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingReference: bookingData.bookingReference,
          phoneNumber: contactPhone,
          amountKes: totalAmountKes,
        }),
      });

      const stkData = await stkRes.json();
      if (!stkRes.ok) {
        throw new Error(stkData.error || 'Daraja STK push failed');
      }

      setCheckoutRequestId(stkData.CheckoutRequestID);
      setIsInitiatingStk(false);
      // Trigger the interactive M-Pesa Phone STK prompt
      setStkPromptActive(true);

    } catch (err: any) {
      setIsInitiatingStk(false);
      setPaymentError(err.message || 'Payment initiation failed. Please try again.');
    }
  };

  // Confirm Simulated or Real STK Push PIN
  const handleConfirmMpesaPin = async () => {
    if (!mpesaPin || mpesaPin.length < 4) {
      alert('Please enter your 4-digit M-Pesa PIN.');
      return;
    }

    setIsInitiatingStk(true);
    try {
      const callbackRes = await fetch('/api/payments/mpesa/simulate-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkoutRequestId,
          pin: mpesaPin,
          isSuccess: true,
        }),
      });

      const callbackData = await callbackRes.json();
      if (!callbackRes.ok) {
        throw new Error(callbackData.error || 'M-Pesa payment confirmation failed');
      }

      setIsInitiatingStk(false);
      setStkPromptActive(false);

      // Successfully confirmed!
      onBookingConfirmed(callbackData.booking);

    } catch (err: any) {
      setIsInitiatingStk(false);
      setPaymentError(err.message || 'Payment verification failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl rounded-xl bg-white border border-gray-200 shadow-2xl overflow-hidden text-gray-800 my-auto max-h-[92vh] flex flex-col font-sans">
        
        {/* Modal Top Banner */}
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="min-w-0 pr-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 block">
              Official Match Ticket Reservation
            </span>
            <h3 className="text-base font-bold text-gray-900 truncate max-w-md mt-0.5">
              {event.title}
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

        {/* 3-Step Progress Indicators */}
        <div className="grid grid-cols-3 border-b border-gray-200 text-xs font-medium text-center shrink-0">
          <div className={`py-3 ${step === 1 ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600 font-semibold' : 'text-gray-500 bg-white'}`}>
            1. Stand &amp; Quantity
          </div>
          <div className={`py-3 ${step === 2 ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600 font-semibold' : 'text-gray-500 bg-white'}`}>
            2. Attendee Details
          </div>
          <div className={`py-3 ${step === 3 ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600 font-semibold' : 'text-gray-500 bg-white'}`}>
            3. Payment
          </div>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          
          {/* STEP 1: SELECT SEATING & QUANTITY */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-3">
                  Select Seating Category / Hospitality:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {safeSections.map((sec) => {
                    const isSelected = selectedSectionCode === sec.code;
                    return (
                      <button
                        key={sec.code}
                        type="button"
                        onClick={() => setSelectedSectionCode(sec.code)}
                        className={`p-3.5 rounded-lg text-left border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-50/70 border-blue-600 ring-1 ring-blue-600 shadow-sm'
                            : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900">{sec.name}</span>
                          {isSelected && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{sec.standLocation} Stand · {sec.gateEntrance.split(' - ')[0]}</p>
                        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-sm font-bold text-blue-600">
                            {formatKes(sec.priceKes)}
                          </span>
                          <span className="text-xs text-gray-500">{sec.availableSeats} available</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector (1 - 6 tickets limit per person) */}
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-sm font-semibold text-gray-900 block">Number of Tickets</span>
                  <span className="text-xs text-gray-500">Maximum 6 tickets per National ID</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleQtyChange(num)}
                      className={`w-9 h-9 rounded-lg font-semibold text-sm transition-all cursor-pointer ${
                        ticketQty === num
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtotal preview */}
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Tickets ({ticketQty} × {formatKes(activeSection.priceKes)})</span>
                  <span className="font-semibold text-gray-800">{formatKes(subtotalKes)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Sports Development &amp; Security Levy</span>
                  <span className="font-semibold text-gray-800">{formatKes(sportsLevyKes)}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold text-gray-900">
                  <span>Total Amount:</span>
                  <span className="text-base text-blue-600 font-bold">{formatKes(totalAmountKes)}</span>
                </div>
              </div>

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
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
                >
                  <span>Attendee Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ATTENDEE IDENTIFICATION */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Official Matchday Protocol: Tickets are non-transferable and verified against government identification at stadium turnstiles.
                </span>
              </div>

              {/* Primary Contact */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Primary Contact / Lead Attendee
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Victor Kipkoech"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">National ID / Passport No.</label>
                    <input
                      type="text"
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      placeholder="e.g. 34567890"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">M-Pesa Mobile Number</label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="07XXXXXXXX or 01XXXXXXXX"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Email for PDF Ticket Delivery</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="victor@example.com"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Attendees if ticketQty > 1 */}
              {ticketQty > 1 && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Additional Ticket Holders ({ticketQty - 1})
                  </h4>
                  {attendees.slice(1).map((att, idx) => (
                    <div key={idx} className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">Guest {idx + 2} Name</label>
                        <input
                          type="text"
                          value={att.name}
                          onChange={(e) => handleAttendeeChange(idx + 1, 'name', e.target.value)}
                          placeholder="Attendee Name"
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">Guest {idx + 2} National ID</label>
                        <input
                          type="text"
                          value={att.nationalId}
                          onChange={(e) => handleAttendeeChange(idx + 1, 'nationalId', e.target.value)}
                          placeholder="National ID"
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

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

          {/* STEP 3: SAFARICOM DARAJA M-PESA CHECKOUT */}
          {step === 3 && (
            <div className="space-y-6">
              
              {/* Payment Summary Box */}
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Event:</span>
                  <span className="font-semibold text-gray-900">{event.title}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Stand &amp; Gate:</span>
                  <span className="font-semibold text-gray-900">{activeSection.name} ({activeSection.gateEntrance.split(' - ')[0]})</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Tickets Quantity:</span>
                  <span className="font-semibold text-gray-900">{ticketQty} Ticket(s)</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-sm">
                  <span className="font-bold text-gray-900">Amount Due:</span>
                  <span className="text-xl font-bold text-blue-600">{formatKes(totalAmountKes)}</span>
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
                      Safaricom Daraja STK Push
                    </h4>
                    <p className="text-xs text-gray-500">
                      Lipa Na M-Pesa Online · Paybill 400200
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">
                      M-Pesa Phone Number to Receive Prompt:
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="0712345678"
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    A prompt will appear instantly on your phone asking you to enter your M-Pesa PIN to complete payment of <strong className="text-gray-900">{formatKes(totalAmountKes)}</strong> to Talanta Stadium.
                  </p>
                </div>

                {paymentError && (
                  <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{paymentError}</span>
                  </div>
                )}

                <div className="mt-5">
                  <button
                    type="button"
                    disabled={isInitiatingStk}
                    onClick={handleInitiateMpesa}
                    className="w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {isInitiatingStk ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending M-Pesa STK Push...</span>
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
                  &larr; Back to Attendees
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* REALISTIC INTERACTIVE SAFARICOM M-PESA STK PUSH HANDSET MODAL */}
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
              Do you want to pay {formatKes(totalAmountKes)} to TALANTA STADIUM?
            </h4>

            <div className="my-3 p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-700 text-left space-y-1">
              <p>Business No: <strong className="text-gray-900">400200</strong></p>
              <p>Account: <strong className="text-gray-900">{bookingRef}</strong></p>
              <p>Amount: <strong className="text-gray-900">{formatKes(totalAmountKes)}</strong></p>
            </div>

            <p className="text-xs text-gray-600 mb-2">
              Enter your M-PESA PIN to authorize transaction:
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
                disabled={isInitiatingStk || mpesaPin.length < 4}
                onClick={handleConfirmMpesaPin}
                className="py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors disabled:opacity-40"
              >
                {isInitiatingStk ? 'Verifying...' : 'Send PIN'}
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
