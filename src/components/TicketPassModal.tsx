import React, { useEffect, useState } from 'react';
import { BookingItem, TicketItem } from '../types';
import { generateQrCodeDataUrl } from '../utils/qrcode';
import { X, Download, Printer, ShieldCheck, QrCode } from 'lucide-react';

interface TicketPassModalProps {
  booking: BookingItem;
  onClose: () => void;
  onTestScan?: (ticket: TicketItem) => void;
}

export const TicketPassModal: React.FC<TicketPassModalProps> = ({
  booking,
  onClose,
  onTestScan,
}) => {
  const [selectedTicketIndex, setSelectedTicketIndex] = useState(0);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const currentTicket = booking.tickets[selectedTicketIndex] || booking.tickets[0];

  useEffect(() => {
    if (currentTicket) {
      generateQrCodeDataUrl(currentTicket.qrCodeHash).then((url) => {
        setQrDataUrl(url);
      });
    }
  }, [currentTicket]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl rounded-xl bg-white border border-gray-200 shadow-2xl overflow-hidden text-gray-800 my-auto max-h-[92vh] flex flex-col font-sans">
        
        {/* Modal Top Control Bar */}
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Confirmed Digital Matchday Pass
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print Pass"
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ticket Selector if multiple tickets in booking */}
        {booking.tickets.length > 1 && (
          <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-gray-500 shrink-0 font-medium">Select Ticket:</span>
            {booking.tickets.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setSelectedTicketIndex(idx)}
                className={`px-3 py-1 rounded-md font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  selectedTicketIndex === idx
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                Ticket #{idx + 1} ({t.attendeeName.split(' ')[0]})
              </button>
            ))}
          </div>
        )}

        {/* PRINTABLE MATCHDAY TICKET BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          <div className="relative rounded-xl bg-white border border-gray-300 p-5 sm:p-6 shadow-sm overflow-hidden print:border-none print:shadow-none">
            
            {/* Blue decorative top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />

            {/* Ticket Header Lockup */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-blue-600 block">
                  Official Match Pass
                </span>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight mt-0.5">
                  Talanta Stadium
                </h3>
                <p className="text-xs text-gray-500">Talanta Sports City · Nairobi, Kenya</p>
              </div>

              <div className="text-right shrink-0">
                <span className="px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-green-100 text-green-800">
                  {currentTicket.status === 'valid' ? 'ACTIVE / VALID' : currentTicket.status.toUpperCase()}
                </span>
                <p className="text-xs text-gray-500 font-mono mt-1">Ref: {booking.bookingReference}</p>
              </div>
            </div>

            {/* Event Name */}
            <div className="py-3.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Event</span>
              <h4 className="text-lg font-bold text-gray-900 leading-tight mt-0.5">
                {currentTicket.eventTitle}
              </h4>
            </div>

            {/* Matchday Schedule Grid */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-gray-50 border border-gray-200 text-center">
              <div>
                <span className="text-xs uppercase font-medium text-gray-500 block">Date</span>
                <span className="text-xs font-bold text-gray-900">{currentTicket.eventDate}</span>
              </div>
              <div className="border-x border-gray-200">
                <span className="text-xs uppercase font-medium text-gray-500 block">Kickoff</span>
                <span className="text-xs font-bold text-blue-600 font-mono">{currentTicket.eventTime}</span>
              </div>
              <div>
                <span className="text-xs uppercase font-medium text-gray-500 block">Gates Open</span>
                <span className="text-xs font-bold text-gray-900 font-mono">{currentTicket.gatesOpenTime}</span>
              </div>
            </div>

            {/* Seating & Gate Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-xs uppercase font-medium text-gray-500 block">Seating Area</span>
                <p className="text-sm font-bold text-blue-600 mt-0.5">{currentTicket.sectionName}</p>
                <p className="text-xs text-gray-600 font-mono mt-0.5">{currentTicket.seatInfo}</p>
              </div>

              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-xs uppercase font-medium text-gray-500 block">Turnstile &amp; Gate</span>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{currentTicket.gateEntrance.split(' - ')[0]}</p>
                <p className="text-xs text-gray-600 font-bold font-mono mt-0.5">{currentTicket.turnstileNumber}</p>
              </div>
            </div>

            {/* Attendee ID & M-Pesa Receipt */}
            <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs px-1 text-gray-600">
              <span>Holder: <strong className="text-gray-900">{currentTicket.attendeeName}</strong></span>
              <span>ID: <strong className="text-gray-900 font-mono">{currentTicket.attendeeNationalId}</strong></span>
              {booking.paymentDetails && (
                <span>M-Pesa: <strong className="text-green-700 font-mono">{booking.paymentDetails.receiptNumber}</strong></span>
              )}
            </div>

            {/* Cryptographic QR Code and Turnstile Verification */}
            <div className="mt-5 pt-4 border-t border-dashed border-gray-300 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center justify-center sm:justify-start gap-1">
                  <QrCode className="w-4 h-4 text-blue-600" />
                  Turnstile Scan Token
                </span>
                <p className="text-xs text-gray-600 max-w-xs leading-relaxed">
                  Scan this QR code directly at the automated turnstile reader or present to the steward. One entry per barcode.
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  Ticket #: {currentTicket.ticketNumber}
                </p>
              </div>

              {/* QR Image Box */}
              <div className="w-28 h-28 p-1.5 bg-white border border-gray-300 rounded-lg shadow-sm flex items-center justify-center shrink-0">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Ticket QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 animate-pulse rounded" />
                )}
              </div>
            </div>

          </div>

          {/* Action Row */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handlePrint}
              className="py-2.5 px-4 rounded-lg bg-white border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-gray-600" />
              <span>Download / Save Pass</span>
            </button>

            {onTestScan && (
              <button
                onClick={() => onTestScan(currentTicket)}
                className="py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-white" />
                <span>Test Gate Steward Scanner</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
