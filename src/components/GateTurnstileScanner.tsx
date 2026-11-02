import React, { useState } from 'react';
import { TicketItem } from '../types';
import { QrCode, ShieldCheck, XCircle, CheckCircle, AlertTriangle, X, RefreshCw, Sparkles, Camera } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#090f0c] border border-[#1e2c24] shadow-2xl overflow-hidden text-slate-200 my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#060908] border-b border-[#1c2c22] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#005A2B]/40 border border-[#0FA958]/30 flex items-center justify-center text-[#0FA958] shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                Gate Steward Turnstile Scanner
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#C5A059] font-medium">Talanta Sports City Automated Access Control</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#131c17] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Gate Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Active Gate Turnstile:
              </label>
              <select
                value={selectedGate}
                onChange={(e) => setSelectedGate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0d1410] border border-[#1e2c24] text-xs text-white focus:outline-none focus:border-[#0FA958]"
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
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Gate Reader Status:
              </label>
              <div className="px-3 py-2 rounded-xl bg-[#005A2B]/20 border border-[#0FA958]/30 flex items-center justify-between text-xs text-[#0FA958] font-bold">
                <span>ONLINE · ZERO LATENCY</span>
                <span className="w-2 h-2 rounded-full bg-[#0FA958] animate-ping" />
              </div>
            </div>
          </div>

          {/* Scanner Simulation Box */}
          <div className="p-6 rounded-2xl bg-[#060908] border-2 border-dashed border-[#1e2c24] text-center relative overflow-hidden">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0d1410] border border-[#1e2c24] flex items-center justify-center text-[#E5C378] mb-3">
              <Camera className="w-8 h-8 animate-pulse text-[#0FA958]" />
            </div>

            <p className="text-xs text-slate-300 font-semibold mb-3">
              Aim Turnstile Camera at Digital Ticket QR or Enter Barcode:
            </p>

            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="text"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                placeholder="e.g. TKT-KEN-84729-01"
                className="flex-1 px-3 py-2.5 rounded-xl bg-[#0d1410] border border-[#1e2c24] text-xs font-mono text-white focus:outline-none focus:border-[#C5A059]"
              />
              <button
                type="button"
                disabled={isVerifying}
                onClick={handleVerify}
                className="px-5 py-2.5 rounded-xl bg-[#005A2B] hover:bg-[#007036] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? 'Scanning...' : 'Verify'}
              </button>
            </div>

            {/* Quick Demo Buttons */}
            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <span>Quick Test:</span>
              <button
                type="button"
                onClick={() => setTicketInput('TKT-KEN-84729-01')}
                className="underline hover:text-[#E5C378] cursor-pointer"
              >
                Sample VIP Ticket
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setTicketInput('TKT-FAKE-99999')}
                className="underline hover:text-red-400 cursor-pointer"
              >
                Fake Ticket
              </button>
            </div>
          </div>

          {/* VERIFICATION RESULT DISPLAY */}
          {scanResult && (
            <div
              className={`p-5 rounded-2xl border text-center transition-all ${
                scanResult.valid
                  ? 'bg-gradient-to-b from-[#0c2e17] to-[#07190d] border-[#0FA958]'
                  : scanResult.status === 'already_scanned'
                  ? 'bg-gradient-to-b from-[#331c0a] to-[#1c0f05] border-amber-500'
                  : 'bg-gradient-to-b from-[#330f0f] to-[#1a0707] border-red-500'
              }`}
            >
              <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2">
                {scanResult.valid ? (
                  <CheckCircle className="w-10 h-10 text-[#0FA958]" />
                ) : scanResult.status === 'already_scanned' ? (
                  <AlertTriangle className="w-10 h-10 text-amber-400" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-500" />
                )}
              </div>

              <h4 className="text-lg font-black text-white uppercase tracking-wide">
                {scanResult.title}
              </h4>
              <p className="text-xs text-slate-200 mt-1 max-w-md mx-auto">
                {scanResult.message}
              </p>

              {scanResult.ticket && (
                <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs text-left bg-black/40 p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Attendee:</span>
                    <strong className="text-white">{scanResult.ticket.attendeeName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">National ID:</span>
                    <strong className="text-white font-mono">{scanResult.ticket.attendeeNationalId}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Stand &amp; Seat:</span>
                    <strong className="text-[#E5C378]">{scanResult.ticket.sectionName} ({scanResult.ticket.seatInfo})</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Turnstile:</span>
                    <strong className="text-[#0FA958]">{scanResult.ticket.turnstileNumber}</strong>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Steward Scan Activity Log */}
          {scanHistory.length > 0 && (
            <div className="p-3 rounded-xl bg-[#0d1410] border border-[#1c2c22]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Recent Gate Activity Log:
              </span>
              <div className="space-y-1.5 text-xs">
                {scanHistory.map((h, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-[#1c2c22] last:border-none">
                    <span className="font-mono text-slate-400">{h.time}</span>
                    <span className="font-mono text-slate-200">{h.code}</span>
                    <span className={`text-[10px] font-bold uppercase ${h.valid ? 'text-[#0FA958]' : 'text-red-400'}`}>
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
