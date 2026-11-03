import React, { useState } from 'react';
import { TicketItem } from '../types';
import { QrCode, XCircle, CheckCircle, AlertTriangle, X, Camera } from 'lucide-react';

interface GateTurnstileScannerProps {
  onClose: () => void;
  prefillTicket?: TicketItem | null;
}

export const GateTurnstileScanner: React.FC<GateTurnstileScannerProps> = ({
  onClose,
  prefillTicket,
}) => {
  const [ticketInput, setTicketInput] = useState<string>(
    prefillTicket?.ticketNumber || 'TKT-KEN-84729-01'
  );
  const [selectedGate, setSelectedGate] = useState<string>('Gate B - West VIP Concourse');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanHistory, setScanHistory] = useState<any[]>([]);

  const handleVerify = async () => {
    if (!ticketInput.trim()) return;
    setIsVerifying(true);
    setScanResult(null);

    try {
      const res = await fetch('/api/tickets/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketNumber: ticketInput.trim(),
          qrHash: prefillTicket?.qrCodeHash,
          gate: selectedGate,
        }),
      });

      const data = await res.json();
      setScanResult(data);
      setScanHistory(prev => [
        {
          time: new Date().toLocaleTimeString(),
          code: ticketInput.trim(),
          valid: data.valid,
          title: data.title,
          gate: selectedGate,
        },
        ...prev.slice(0, 9)
      ]);
    } catch (err: any) {
      setScanResult({
        valid: false,
        status: 'error',
        title: 'NETWORK ERROR',
        message: 'Could not connect to Talanta Stadium gate server.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="relative w-full max-w-xl rounded-xl bg-white border border-gray-200 shadow-2xl overflow-hidden text-gray-800 my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 tracking-tight">
                Gate Steward Turnstile Scanner
              </h3>
              <p className="text-xs text-gray-500">Talanta Sports City Automated Access Control</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Gate Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Active Gate Turnstile:
              </label>
              <select
                value={selectedGate}
                onChange={(e) => setSelectedGate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                <option>Gate A - Ceremonial Presidential Plaza</option>
                <option>Gate B - West VIP Concourse</option>
                <option>Gate C - West Concourse Upper</option>
                <option>Gate D - East Grandstand</option>
                <option>Gate F - North Stand Ultras</option>
                <option>Gate G - South Stand Family</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Gate Reader Status:
              </label>
              <div className="px-3 py-2 rounded-lg bg-green-50 border border-green-200 flex items-center justify-between text-xs text-green-800 font-medium">
                <span>ONLINE · ZERO LATENCY</span>
                <span className="w-2 h-2 rounded-full bg-green-600" />
              </div>
            </div>
          </div>

          {/* Scanner Simulation Box */}
          <div className="p-6 rounded-xl bg-gray-50 border border-gray-200 text-center relative overflow-hidden">
            <div className="w-14 h-14 mx-auto rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-blue-600 mb-3">
              <Camera className="w-7 h-7" />
            </div>

            <p className="text-xs text-gray-700 font-semibold mb-3">
              Aim Turnstile Camera at Digital Ticket QR or Enter Barcode:
            </p>

            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="text"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                placeholder="e.g. TKT-KEN-84729-01"
                className="flex-1 px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs font-mono text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
              <button
                type="button"
                disabled={isVerifying}
                onClick={handleVerify}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? 'Scanning...' : 'Verify'}
              </button>
            </div>

            {/* Quick Demo Buttons */}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
              <span>Quick Test:</span>
              <button
                type="button"
                onClick={() => setTicketInput('TKT-KEN-84729-01')}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Sample VIP Ticket
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setTicketInput('TKT-FAKE-99999')}
                className="text-red-600 hover:underline cursor-pointer"
              >
                Fake Ticket
              </button>
            </div>
          </div>

          {/* VERIFICATION RESULT DISPLAY */}
          {scanResult && (
            <div
              className={`p-5 rounded-xl border text-center transition-all ${
                scanResult.valid
                  ? 'bg-green-50 border-green-200 text-green-900'
                  : scanResult.status === 'already_scanned'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2">
                {scanResult.valid ? (
                  <CheckCircle className="w-10 h-10 text-green-600" />
                ) : scanResult.status === 'already_scanned' ? (
                  <AlertTriangle className="w-10 h-10 text-amber-600" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600" />
                )}
              </div>

              <h4 className="text-base font-bold uppercase tracking-wide">
                {scanResult.title}
              </h4>
              <p className="text-xs text-gray-700 mt-1 max-w-md mx-auto">
                {scanResult.message}
              </p>

              {scanResult.ticket && (
                <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-2 gap-2 text-xs text-left bg-white p-3 rounded-lg border border-gray-200">
                  <div>
                    <span className="text-xs text-gray-500 block">Attendee:</span>
                    <strong className="text-gray-900">{scanResult.ticket.attendeeName}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">National ID:</span>
                    <strong className="text-gray-900 font-mono">{scanResult.ticket.attendeeNationalId}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Stand &amp; Seat:</span>
                    <strong className="text-blue-600">{scanResult.ticket.sectionName} ({scanResult.ticket.seatInfo})</strong>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Turnstile:</span>
                    <strong className="text-gray-900">{scanResult.ticket.turnstileNumber}</strong>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Steward Scan Activity Log */}
          {scanHistory.length > 0 && (
            <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200">
              <span className="text-xs font-semibold text-gray-700 block mb-2">
                Recent Gate Activity Log:
              </span>
              <div className="space-y-1.5 text-xs">
                {scanHistory.map((h, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-gray-200 last:border-none">
                    <span className="font-mono text-gray-500">{h.time}</span>
                    <span className="font-mono text-gray-800">{h.code}</span>
                    <span className={`text-xs font-semibold uppercase ${h.valid ? 'text-green-700' : 'text-red-600'}`}>
                      {h.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
