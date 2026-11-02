import React, { useEffect, useState } from 'react';
import { BookingItem, TicketItem } from '../types';
import { generateQrCodeDataUrl, formatKes } from '../utils/qrcode';
import { X, Download, Printer, ShieldCheck, CheckCircle2, QrCode, Sparkles } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#090f0c] border border-[#1e2c24] shadow-2xl overflow-hidden text-slate-200 my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Top Control Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-[#060908] border-b border-[#1c2c22] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0FA958]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Confirmed Digital Matchday Pass
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print Pass"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#131c17] transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#131c17] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ticket Selector if multiple tickets in booking */}
        {booking.tickets.length > 1 && (
          <div className="px-6 py-2 bg-[#0c1410] border-b border-[#1c2c22] flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 shrink-0">Select Ticket:</span>
            {booking.tickets.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setSelectedTicketIndex(idx)}
                className={`px-3 py-1 rounded-md font-semibold whitespace-nowrap cursor-pointer ${
                  selectedTicketIndex === idx
                    ? 'bg-[#C5A059] text-black'
                    : 'bg-[#131c17] text-slate-300 hover:text-white'
                }`}
              >
                Ticket #{idx + 1} ({t.attendeeName.split(' ')[0]})
              </button>
            ))}
          </div>
        )}

        {/* PRINTABLE MATCHDAY TICKET BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="relative rounded-2xl bg-gradient-to-b from-[#121c16] via-[#0d1611] to-[#070c09] border border-[#253b2d] p-4 sm:p-6 shadow-2xl overflow-hidden print:bg-white print:text-black">
            
            {/* Gold foil decorative top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#005A2B] via-[#C5A059] to-[#0FA958]" />

            {/* Ticket Header Lockup */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#1c2c22]">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-[#C5A059] block">
                  Official Match Pass
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                  Talanta Stadium
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Talanta Sports City · Nairobi, Kenya</p>
              </div>

              <div className="text-right shrink-0">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#005A2B] text-white">
                  {currentTicket.status === 'valid' ? 'ACTIVE / VALID' : currentTicket.status.toUpperCase()}
                </span>
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono mt-1">Ref: {booking.bookingReference}</p>
              </div>
            </div>

            {/* Event Name */}
            <div className="py-3 sm:py-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0FA958]">Event</span>
              <h4 className="text-base sm:text-lg font-black text-white leading-tight mt-0.5">
                {currentTicket.eventTitle}
              </h4>
            </div>

            {/* Matchday Schedule Grid */}
            <div className="grid grid-cols-3 gap-2 p-2.5 sm:p-3 rounded-xl bg-[#060908] border border-[#1e2c24] text-center">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Date</span>
                <span className="text-[11px] sm:text-xs font-bold text-white">{currentTicket.eventDate}</span>
              </div>
              <div className="border-x border-[#1c2c22]">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Kickoff</span>
                <span className="text-[11px] sm:text-xs font-bold text-[#E5C378] font-mono">{currentTicket.eventTime}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Gates Open</span>
                <span className="text-[11px] sm:text-xs font-bold text-white font-mono">{currentTicket.gatesOpenTime}</span>
              </div>
            </div>

            {/* Seating & Gate Info - Key Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-3 sm:mt-4 text-xs">
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#0d1410] border border-[#1c2c22]">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block">Seating Area</span>
                <p className="text-xs sm:text-sm font-black text-[#E5C378] mt-0.5">{currentTicket.sectionName}</p>
                <p className="text-[10px] sm:text-[11px] text-slate-300 font-mono mt-0.5">{currentTicket.seatInfo}</p>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl bg-[#0d1410] border border-[#1c2c22]">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block">Turnstile &amp; Gate</span>
                <p className="text-xs sm:text-sm font-black text-white mt-0.5">{currentTicket.gateEntrance.split(' - ')[0]}</p>
                <p className="text-[10px] sm:text-[11px] text-[#0FA958] font-bold font-mono mt-0.5">{currentTicket.turnstileNumber}</p>
              </div>
            </div>

            {/* Attendee ID & M-Pesa Receipt */}
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] sm:text-xs px-1 text-slate-400">
              <span>Holder: <strong className="text-white">{currentTicket.attendeeName}</strong></span>
              <span>ID: <strong className="text-white font-mono">{currentTicket.attendeeNationalId}</strong></span>
              {booking.paymentDetails && (
                <span>M-Pesa: <strong className="text-[#0FA958] font-mono">{booking.paymentDetails.receiptNumber}</strong></span>
              )}
            </div>

            {/* Cryptographic QR Code and Turnstile Verification */}
            <div className="mt-5 pt-4 border-t-2 border-dashed border-[#1c2c22] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-[#E5C378]" />
                  Automated Turnstile Scan Token
                </span>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  Scan this QR code directly at the gate reader or present to the steward. One entry per barcode.
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  Ticket #: {currentTicket.ticketNumber}
                </p>
              </div>

              {/* QR Image Box */}
              <div className="w-28 h-28 p-1.5 bg-white rounded-xl shadow-lg flex items-center justify-center shrink-0">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Ticket QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 animate-pulse rounded" />
                )}
              </div>
            </div>

          </div>

          {/* Action Row */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handlePrint}
              className="py-2.5 px-4 rounded-xl bg-[#0d1410] hover:bg-[#131c17] border border-[#1e2c24] text-xs font-semibold text-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#C5A059]" />
              <span>Download / Save Pass</span>
            </button>

            {onTestScan && (
              <button
                onClick={() => onTestScan(currentTicket)}
                className="py-2.5 px-4 rounded-xl bg-[#005A2B] hover:bg-[#007036] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-[#E5C378]" />
                <span>Test Gate Steward Scanner</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
