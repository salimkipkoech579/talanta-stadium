import React, { useState } from 'react';
import { SeatingSection, EventItem } from '../types';
import { formatKes } from '../utils/qrcode';
import { DEFAULT_SECTIONS } from '../constants/seating';
import { CheckCircle2, Shield, Eye, Users, Compass, Sparkles } from 'lucide-react';

interface InteractiveSeatingPlanProps {
  sections: SeatingSection[];
  onSelectSection: (section: SeatingSection) => void;
  selectedEvent?: EventItem;
}

export const InteractiveSeatingPlan: React.FC<InteractiveSeatingPlanProps> = ({
  sections,
  onSelectSection,
  selectedEvent,
}) => {
  const [activeCode, setActiveCode] = useState<string>('VIP_GOLD_WEST');

  const safeSections = sections && sections.length > 0 ? sections : DEFAULT_SECTIONS;
  const activeSection = safeSections.find(s => s.code === activeCode) || safeSections[0] || DEFAULT_SECTIONS[0];

  return (
    <section className="py-20 bg-[#060908] border-t border-[#1c2c22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C5A059] flex items-center justify-center gap-1.5 mb-2">
            <Compass className="w-3.5 h-3.5 text-[#E5C378]" />
            Arena Geometry &amp; Hospitality
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
            Interactive Stadium Seating Plan
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Select any stadium tier to inspect sightlines, hospitality amenities, turnstile gates, and live pricing in Kenyan Shillings.
          </p>
        </div>

        {/* Main Grid: SVG Map on Left / Active Stand Panel on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Interactive Vector Stadium Plan (Cols 7) */}
          <div className="lg:col-span-7 bg-[#0a100c] rounded-2xl border border-[#1e2c24] p-6 shadow-2xl relative overflow-hidden">
            
            {/* Stadium Orientation Badges */}
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 pb-2 border-b border-[#1c2c22]">
              <span>North Stand (Ultras Zone)</span>
              <span className="text-[#C5A059]">Talanta Sports City 60,000 Capacity</span>
              <span>South Stand (Transit Gate)</span>
            </div>

            {/* SVG Interactive Arena Map */}
            <div className="relative w-full aspect-[4/3] max-h-[460px] flex items-center justify-center">
              <svg
                viewBox="0 0 600 450"
                className="w-full h-full drop-shadow-2xl select-none"
              >
                {/* Outer Stadium Ellipse / Architectural Shell */}
                <ellipse cx="300" cy="225" rx="285" ry="205" fill="#0d1410" stroke="#1c2c22" strokeWidth="4" />
                <ellipse cx="300" cy="225" rx="270" ry="190" fill="#090e0b" stroke="#25382c" strokeWidth="2" strokeDasharray="4 4" />

                {/* 1. WEST STAND (VVIP & VIP) - Left Curved Sector */}
                <path
                  d="M 120 70 A 240 180 0 0 0 120 380 L 175 340 A 180 130 0 0 1 175 110 Z"
                  fill={activeCode === 'CAT1_WEST_UPPER' ? '#0FA958' : '#143120'}
                  stroke="#0FA958"
                  strokeWidth={activeCode === 'CAT1_WEST_UPPER' ? '3' : '1'}
                  className="cursor-pointer transition-colors duration-200 hover:fill-[#0FA958]/80"
                  onClick={() => setActiveCode('CAT1_WEST_UPPER')}
                />
                
                {/* West VIP Gold Lower */}
                <path
                  d="M 175 110 A 180 130 0 0 0 175 340 L 210 310 A 130 90 0 0 1 210 140 Z"
                  fill={activeCode === 'VIP_GOLD_WEST' ? '#E5C378' : '#614d23'}
                  stroke="#C5A059"
                  strokeWidth={activeCode === 'VIP_GOLD_WEST' ? '3' : '1'}
                  className="cursor-pointer transition-colors duration-200 hover:fill-[#E5C378]"
                  onClick={() => setActiveCode('VIP_GOLD_WEST')}
                />

                {/* West VVIP Skybox Suites */}
                <path
                  d="M 150 170 A 160 110 0 0 0 150 280 L 175 270 A 140 90 0 0 1 175 180 Z"
                  fill={activeCode === 'VVIP_PRESIDENTIAL' ? '#FFD700' : '#8A6D2B'}
                  stroke="#FFE44D"
                  strokeWidth={activeCode === 'VVIP_PRESIDENTIAL' ? '3' : '1.5'}
                  className="cursor-pointer transition-colors duration-200 hover:fill-[#FFE44D]"
                  onClick={() => setActiveCode('VVIP_PRESIDENTIAL')}
                />

                {/* 2. EAST STAND (Category 2 Grandstand) - Right Curved Sector */}
                <path
                  d="M 480 70 A 240 180 0 0 1 480 380 L 390 310 A 130 90 0 0 0 390 140 Z"
                  fill={activeCode === 'CAT2_EAST_STAND' ? '#0FA958' : '#0a2e19'}
                  stroke="#005A2B"
                  strokeWidth={activeCode === 'CAT2_EAST_STAND' ? '3' : '1'}
                  className="cursor-pointer transition-colors duration-200 hover:fill-[#005A2B]/80"
                  onClick={() => setActiveCode('CAT2_EAST_STAND')}
                />

                {/* 3. NORTH STAND (Category 3 Ultras) - Top Sector */}
                <path
                  d="M 140 60 A 240 180 0 0 1 460 60 L 375 130 A 130 90 0 0 0 225 130 Z"
                  fill={activeCode === 'CAT3_NORTH_ULTRAS' ? '#3B5945' : '#17241c'}
                  stroke="#2B4234"
                  strokeWidth={activeCode === 'CAT3_NORTH_ULTRAS' ? '3' : '1'}
                  className="cursor-pointer transition-colors duration-200 hover:fill-[#3B5945]"
                  onClick={() => setActiveCode('CAT3_NORTH_ULTRAS')}
                />

                {/* 4. SOUTH STAND (Category 3 Family) - Bottom Sector */}
                <path
                  d="M 140 390 A 240 180 0 0 0 460 390 L 375 320 A 130 90 0 0 1 225 320 Z"
                  fill={activeCode === 'CAT3_SOUTH_STAND' ? '#3B5945' : '#141c17'}
                  stroke="#1C2B22"
                  strokeWidth={activeCode === 'CAT3_SOUTH_STAND' ? '3' : '1'}
                  className="cursor-pointer transition-colors duration-200 hover:fill-[#3B5945]"
                  onClick={() => setActiveCode('CAT3_SOUTH_STAND')}
                />

                {/* ATHLETICS SYNTHETIC RUNNING TRACK (Red Tartan) */}
                <ellipse cx="300" cy="225" rx="145" ry="98" fill="#5A1F1F" stroke="#873232" strokeWidth="2" />
                <ellipse cx="300" cy="225" rx="138" ry="92" fill="#6A2525" stroke="#9A3838" strokeWidth="1" strokeDasharray="3 3" />

                {/* HYBRID FOOTBALL PITCH (Lush Green) */}
                <rect x="195" y="155" width="210" height="140" rx="4" fill="#0F783B" stroke="#ffffff" strokeWidth="1.5" />
                
                {/* Pitch Markings: Center circle, half line, boxes */}
                <line x1="300" y1="155" x2="300" y2="295" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="300" cy="225" r="26" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="300" cy="225" r="2" fill="#ffffff" />
                
                {/* Penalty boxes */}
                <rect x="195" y="185" width="35" height="80" fill="none" stroke="#ffffff" strokeWidth="1.2" />
                <rect x="195" y="205" width="12" height="40" fill="none" stroke="#ffffff" strokeWidth="1.2" />
                
                <rect x="370" y="185" width="35" height="80" fill="none" stroke="#ffffff" strokeWidth="1.2" />
                <rect x="393" y="205" width="12" height="40" fill="none" stroke="#ffffff" strokeWidth="1.2" />

                {/* Labels on Pitch & Stands */}
                <text x="300" y="228" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" opacity="0.8">TALANTA HYBRID TURF</text>
                <text x="75" y="230" textAnchor="middle" fill="#E5C378" fontSize="10" fontWeight="bold">WEST (VIP)</text>
                <text x="525" y="230" textAnchor="middle" fill="#0FA958" fontSize="10" fontWeight="bold">EAST STAND</text>
                <text x="300" y="45" textAnchor="middle" fill="#9CA3AF" fontSize="10" fontWeight="bold">NORTH STAND</text>
                <text x="300" y="415" textAnchor="middle" fill="#9CA3AF" fontSize="10" fontWeight="bold">SOUTH STAND</text>
              </svg>
            </div>

            {/* Quick Interactive Legend */}
            <div className="mt-4 pt-3 border-t border-[#1c2c22] flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
              <span className="text-slate-400">Click section to view details:</span>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveCode('VVIP_PRESIDENTIAL')}
                  className="flex items-center gap-1.5 hover:text-white cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#C5A059]" />
                  <span>VVIP Skybox</span>
                </button>
                <button
                  onClick={() => setActiveCode('VIP_GOLD_WEST')}
                  className="flex items-center gap-1.5 hover:text-white cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#E5C378]" />
                  <span>VIP Gold</span>
                </button>
                <button
                  onClick={() => setActiveCode('CAT1_WEST_UPPER')}
                  className="flex items-center gap-1.5 hover:text-white cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#0FA958]" />
                  <span>Cat 1 West</span>
                </button>
                <button
                  onClick={() => setActiveCode('CAT2_EAST_STAND')}
                  className="flex items-center gap-1.5 hover:text-white cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#005A2B]" />
                  <span>Cat 2 East</span>
                </button>
                <button
                  onClick={() => setActiveCode('CAT3_NORTH_ULTRAS')}
                  className="flex items-center gap-1.5 hover:text-white cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#2B4234]" />
                  <span>Cat 3 Ultras</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Stand Details Panel (Cols 5) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-gradient-to-b from-[#131c17] to-[#0a0f0c] border border-[#1e2c24] p-6 shadow-2xl relative">
              
              {/* Stand Badge & Tier */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1c2c22]">
                <span
                  className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md"
                  style={{
                    backgroundColor: `${activeSection.colorHex}25`,
                    color: activeSection.colorHex,
                    border: `1px solid ${activeSection.colorHex}50`,
                  }}
                >
                  {activeSection.tierLevel}
                </span>

                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Users className="w-3.5 h-3.5 text-[#0FA958]" />
                  <span>{activeSection.availableSeats.toLocaleString()} seats left</span>
                </div>
              </div>

              {/* Title & Price */}
              <div className="mt-4">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  {activeSection.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Location: {activeSection.standLocation} Stand · Concourse Tier
                </p>

                <div className="mt-4 p-3 rounded-xl bg-[#060908] border border-[#1e2c24] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                      Ticket Price (Per Person)
                    </span>
                    <span className="text-2xl font-black text-[#E5C378] font-mono">
                      {formatKes(activeSection.priceKes)}
                    </span>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    <p>+ KES 50 Sports Levy</p>
                    <p className="text-[#0FA958] font-medium">M-Pesa STK Push Ready</p>
                  </div>
                </div>
              </div>

              {/* Gate & Turnstile Directions */}
              <div className="mt-4 p-3 rounded-xl bg-[#0d1410] border border-[#1c2c22] text-xs space-y-1">
                <span className="font-bold text-slate-300 uppercase tracking-wide block text-[10px]">
                  Turnstile Entrance:
                </span>
                <p className="text-[#E5C378] font-semibold">{activeSection.gateEntrance}</p>
                <p className="text-slate-400 text-[11px]">Direct automated turnstiles with biometric and QR barcode verification.</p>
              </div>

              {/* Hospitality & Section Amenities */}
              <div className="mt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                  Hospitality &amp; Matchday Inclusions:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeSection.amenities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0FA958] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-[#1c2c22]">
                <button
                  onClick={() => onSelectSection(activeSection)}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#005A2B] to-[#0FA958] hover:from-[#006e35] hover:to-[#12bd63] text-white font-bold text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#005A2B]/30 cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-4 h-4 text-[#E5C378]" />
                  <span>Select {activeSection.name.split(' ')[0]} &amp; Book</span>
                </button>
                <p className="text-center text-[11px] text-slate-500 mt-2">
                  Instant ticket issuance to Safaricom Daraja registered phone number
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
