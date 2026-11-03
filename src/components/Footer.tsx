import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 text-gray-600 text-xs font-sans">
      {/* Top Banner Notice */}
      <div className="border-b border-gray-200 py-4 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="font-bold text-gray-900 uppercase text-xs tracking-wider">
              Talanta Sports City (Raila Amolo Odinga International Stadium)
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Primary Currency: <strong className="text-gray-900">KES (Kenyan Shillings)</strong> · Official Venue Partner
          </p>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Col */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              TS
            </div>
            <span className="text-base font-bold text-gray-900 tracking-tight">
              Talanta Stadium
            </span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Kenya's 60,000-seat digital stadium portal for international football, concerts, athletics, and cultural events.
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Encrypted Turnstile Verification</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
            Quick Navigation
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-blue-600 transition-colors cursor-pointer text-gray-600">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('events')} className="hover:text-blue-600 transition-colors cursor-pointer text-gray-600">
                Upcoming Fixtures &amp; Matches
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('seating')} className="hover:text-blue-600 transition-colors cursor-pointer text-gray-600">
                Interactive Seating Plan
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('facilities')} className="hover:text-blue-600 transition-colors cursor-pointer text-gray-600">
                VVIP Lounges &amp; Facilities
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('news')} className="hover:text-blue-600 transition-colors cursor-pointer text-gray-600">
                News &amp; Media Dispatches
              </button>
            </li>
          </ul>
        </div>

        {/* Stadium Facilities */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
            Stadium Infrastructure
          </h4>
          <ul className="space-y-2 text-xs text-gray-600">
            <li>VVIP Presidential Skybox Suites</li>
            <li>SISGrass Hybrid Turf Playing Pitch</li>
            <li>World Athletics Class 1 Track</li>
            <li>Nairobi Commuter Rail Terminal</li>
            <li>4,000 Smart Parking Bays</li>
            <li>72 High-Speed Digital Turnstiles</li>
          </ul>
        </div>

        {/* Regulatory & Notice */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
            Platform Notice
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Talanta Stadium is Kenya's premier multipurpose sporting venue located along Jamhuri Road, Nairobi. All match tickets are issued with individual digital verification tokens.
          </p>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-200 py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; 2026 Talanta Stadium Kenya. All rights reserved.</p>
          <p>
            Talanta Sports City · Nairobi, Kenya
          </p>
        </div>
      </div>
    </footer>
  );
};
