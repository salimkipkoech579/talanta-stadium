import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#040605] border-t border-[#1c2c22] text-slate-400 text-xs">
      {/* Top Banner Notice */}
      <div className="border-b border-[#141f18] py-4 bg-[#070b09]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0FA958]" />
            <span className="font-bold text-white uppercase text-[11px] tracking-wider">
              Talanta Sports City (Raila Amolo Odinga International Stadium)
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Primary Currency: <strong className="text-[#E5C378]">KES (Kenyan Shillings)</strong> · Powered by Safaricom Daraja
          </p>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Col */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#005A2B] flex items-center justify-center text-white font-black text-xs">
              TS
            </div>
            <span className="text-base font-black text-white uppercase tracking-tight">
              Talanta Stadium
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            EXPERIENCE THE GAME. LIVE THE MOMENT. Kenya's 60,000-seat digital stadium portal for international football, concerts, and athletics.
          </p>
          <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#0FA958]" />
            <span>Encrypted QR Verification</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            Quick Navigation
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('events')} className="hover:text-white transition-colors cursor-pointer">
                Upcoming Fixtures &amp; Matches
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('seating')} className="hover:text-white transition-colors cursor-pointer">
                Interactive Seating Plan
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('facilities')} className="hover:text-white transition-colors cursor-pointer">
                VVIP Lounges &amp; Facilities
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('news')} className="hover:text-white transition-colors cursor-pointer">
                News &amp; Media Dispatches
              </button>
            </li>
          </ul>
        </div>

        {/* Stadium Facilities */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            Stadium Infrastructure
          </h4>
          <ul className="space-y-2 text-xs">
            <li>VVIP Presidential Skybox Suites</li>
            <li>SISGrass Hybrid Turf Playing Pitch</li>
            <li>World Athletics Class 1 Track</li>
            <li>Nairobi Commuter Rail Terminal</li>
            <li>4,000 Smart Parking Bays</li>
            <li>72 High-Speed Digital Turnstiles</li>
          </ul>
        </div>

        {/* Regulatory & Disclaimer */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            Platform Notice
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            This digital platform is a modern stadium management and event ticketing demonstration system representing Talanta Sports City in Nairobi, Kenya. Sample events and demonstration data are clearly labeled for showcase purposes.
          </p>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#141f18] py-6 bg-[#030504]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>&copy; 2026 Talanta Stadium Kenya. All rights reserved.</p>
          <p className="text-slate-500">
            Designed for Kenya · Built with modern full-stack web standards
          </p>
        </div>
      </div>
    </footer>
  );
};
