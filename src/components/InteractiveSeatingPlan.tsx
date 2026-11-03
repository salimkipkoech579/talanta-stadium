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
    <section className="py-16 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-wider font-bold text-blue-600 flex items-center justify-center gap-1.5 mb-2">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            Arena Geometry &amp; Hospitality
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Interactive Stadium Seating Plan
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            Select any stadium tier to inspect sightlines, hospitality amenities, turnstile gates, and live pricing in Kenyan Shillings.
          </p>
        </div>

        {/* Main Grid: SVG Map on Left / Active Stand Panel on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Interactive Vector Stadium Plan (Cols 7) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 p-6 shadow-sm relative overflow-hidden">
            
            {/* Stadium Orientation Badges */}
            <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
              <span>North Stand (Ultras Zone)</span>
              <span className="text-blue-600 font-bold">Talanta Sports City 60,000 Capacity</span>
              <span>South Stand (Transit Gate)</span>
            </div>

            {/* SVG Interactive Arena Map */}
            <div className="relative w-full aspect-[4/3] max-h-[460px] flex items-center justify-center">
              <svg
                viewBox="0 0 600 450"
                className="w-full h-full select-none"
              >
                {/* Outer Stadium Ellipse */}
                <ellipse cx="300" cy="225" rx="285" ry="205" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="4" />
                <ellipse cx="300" cy="225" rx="270" ry="190" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />

                {/* 1. WEST STAND (Cat 1 West Upper) */}
                <path
                  d="M 120 70 A 240 180 0 0 0 120 380 L 175 340 A 180 130 0 0 1 175 110 Z"
                  fill={activeCode === 'CAT1_WEST_UPPER' ? '#2563EB' : '#93C5FD'}
                  stroke="#1D4ED8"
                  strokeWidth={activeCode === 'CAT1_WEST_UPPER' ? '3' : '1'}
                  className="cursor-pointer transition-colors duration-200 hover:fill-blue-500"
                  onClick={() => setActiveCode('CAT1_WEST_UPPER')}
                />
                
                {/* West VIP Gold Lower */}
                <path
                  d="M 175 110 A 180 130 0 0 0 175 340 L 210 310 A 130 90 0 0 1 210 140 Z"
                  fill={activeCode === 'VIP_GOLD_WEST' ? '#D97706' : '#FCD34D'}
                  stroke="#B45309"
                  strokeWidth={activeCode === 'VIP_GOLD_WEST' ? '3' : '1'}
                  className="cursor-pointer transition-colors duration-200 hover:fill-amber-500"
                  onClick={() => setActiveCode('VIP_GOLD_WEST')}
                />

                {/* West VVIP Skybox Suites */}
                <path
                  d="M 150 170 A 160 110 0 0 0 150 280 L 175 270 A 140 90 0 0 1 175 180 Z"
                  fill={activeCode === 'VVIP_PRESIDENTIAL' ? '#F59E0B' : '#FDE68A'}
                  stroke="#D97706"
                  strokeWidth={activeCode === 'VVIP_PRESIDENTIAL' ? '3' : '1.5'}
                  className="cursor-pointer transition-colors duration-200 hover:fill-amber-400"
                  onClick={() => setActiveCode('VVIP_PRESIDENTIAL')}
                />

                {/* 2. EAST STAND (Category 2 Grandstand) */}
                <path
                  d="M 480 70 A 240 180 0 0 1 480 380 L 390 310 A 130 90 0 0 0 390 140 Z"
                  fill={activeCode === 'CAT2_EAST_STAND' ? '#059669' : '#A7F3D0'}
                  stroke="#047857"
                  strokeWidth={activeCode === 'CAT2_EAST_STAND' ? '3' : '1'}
                  className="cursor-pointer transition-colors duration-200 hover:fill-emerald-500"
                  onClick={() => setActiveCode('CAT2_EAST_STAND')}
                />

                {/* 3. NORTH STAND (Category 3 Ultras) */}
                <path
                  d="M 140 60 A 240 180 0 0 1 460 60 L 375 130 A 130 90 0 0 0 225 130 Z"
                  fill={activeCode === 'CAT3_NORTH_ULTRAS' ? '#4B5563' : '#CBD5E1'}
                  stroke="#374151"
                  strokeWidth={activeCode === 'CAT3_NORTH_ULTRAS' ? '3' : '1'}
                  className="cursor-pointer transition-colors duration-200 hover:fill-gray-500"
                  onClick={() => setActiveCode('CAT3_NORTH_ULTRAS')}
                />

                {/* 4. SOUTH STAND (Category 3 Family) */}
                <path
                  d="M 140 390 A 240 180 0 0 0 460 390 L 375 320 A 130 90 0 0 1 225 320 Z"
                  fill={activeCode === 'CAT3_SOUTH_STAND' ? '#4B5563' : '#E2E8F0'}
                  stroke="#475569"
                  strokeWidth={activeCode === 'CAT3_SOUTH_STAND' ? '3' : '1'}
                  className="cursor-pointer transition-colors duration-200 hover:fill-gray-400"
                  onClick={() => setActiveCode('CAT3_SOUTH_STAND')}
                />

                {/* ATHLETICS SYNTHETIC RUNNING TRACK (Red Tartan) */}
                <ellipse cx="300" cy="225" rx="145" ry="98" fill="#B91C1C" stroke="#991B1B" strokeWidth="2" />
                <ellipse cx="300" cy="225" rx="138" ry="92" fill="#DC2626" stroke="#B91C1C" strokeWidth="1" strokeDasharray="3 3" />

                {/* HYBRID FOOTBALL PITCH (Lush Green) */}
                <rect x="195" y="155" width="210" height="140" rx="4" fill="#15803D" stroke="#ffffff" strokeWidth="1.5" />
                
                {/* Pitch Markings */}
                <line x1="300" y1="155" x2="300" y2="295" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="300" cy="225" r="26" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="300" cy="225" r="2" fill="#ffffff" />
                
                {/* Penalty boxes */}
                <rect x="195" y="185" width="35" height="80" fill="none" stroke="#ffffff" strokeWidth="1.2" />
                <rect x="195" y="205" width="12" height="40" fill="none" stroke="#ffffff" strokeWidth="1.2" />
                
                <rect x="370" y="185" width="35" height="80" fill="none" stroke="#ffffff" strokeWidth="1.2" />
                <rect x="393" y="205" width="12" height="40" fill="none" stroke="#ffffff" strokeWidth="1.2" />

                {/* Labels on Pitch & Stands */}
                <text x="300" y="228" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">TALANTA HYBRID TURF</text>
                <text x="75" y="230" textAnchor="middle" fill="#1E293B" fontSize="10" fontWeight="bold">WEST (VIP)</text>
                <text x="525" y="230" textAnchor="middle" fill="#1E293B" fontSize="10" fontWeight="bold">EAST STAND</text>
                <text x="300" y="45" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="bold">NORTH STAND</text>
                <text x="300" y="415" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="bold">SOUTH STAND</text>
              </svg>
            </div>

            {/* Interactive Legend */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
              <span className="text-gray-500 font-medium">Click stand to inspect:</span>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveCode('VVIP_PRESIDENTIAL')}
                  className="flex items-center gap-1.5 hover:text-gray-900 cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                  <span>VVIP Skybox</span>
                </button>
                <button
                  onClick={() => setActiveCode('VIP_GOLD_WEST')}
                  className="flex items-center gap-1.5 hover:text-gray-900 cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
                  <span>VIP Gold</span>
                </button>
                <button
                  onClick={() => setActiveCode('CAT1_WEST_UPPER')}
                  className="flex items-center gap-1.5 hover:text-gray-900 cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
                  <span>Cat 1 West</span>
                </button>
                <button
                  onClick={() => setActiveCode('CAT2_EAST_STAND')}
                  className="flex items-center gap-1.5 hover:text-gray-900 cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
                  <span>Cat 2 East</span>
                </button>
                <button
                  onClick={() => setActiveCode('CAT3_NORTH_ULTRAS')}
                  className="flex items-center gap-1.5 hover:text-gray-900 cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-sm bg-gray-600" />
                  <span>Cat 3 Ultras</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Stand Details Panel (Cols 5) */}
          <div className="lg:col-span-5">
            <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm text-gray-900">
              
              {/* Stand Badge & Tier */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  {activeSection.tierLevel}
                </span>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>{activeSection.availableSeats.toLocaleString()} seats left</span>
                </div>
              </div>

              {/* Title & Price */}
              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {activeSection.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Location: {activeSection.standLocation} Stand · Concourse Tier
                </p>

                <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">
                      Ticket Price (Per Person)
                    </span>
                    <span className="text-2xl font-bold text-gray-900 font-mono">
                      {formatKes(activeSection.priceKes)}
                    </span>
                  </div>
                  <div className="text-right text-[11px] text-gray-500">
                    <p>+ KES 50 Sports Levy</p>
                    <p className="text-blue-600 font-medium">Safaricom M-Pesa Ready</p>
                  </div>
                </div>
              </div>

              {/* Gate & Turnstile Directions */}
              <div className="mt-4 p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1">
                <span className="font-bold text-gray-700 uppercase tracking-wide block text-[10px]">
                  Turnstile Entrance:
                </span>
                <p className="text-blue-700 font-semibold">{activeSection.gateEntrance}</p>
                <p className="text-gray-500 text-[11px]">Direct automated turnstiles with QR barcode verification.</p>
              </div>

              {/* Hospitality & Section Amenities */}
              <div className="mt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">
                  Hospitality &amp; Matchday Inclusions:
                </span>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  {activeSection.amenities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Blue Action Button */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => onSelectSection(activeSection)}
                  className="w-full py-3.5 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm tracking-wide transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Select {activeSection.name.split(' ')[0]} &amp; Book</span>
                </button>
                <p className="text-center text-[11px] text-gray-400 mt-2">
                  Instant ticket issuance via Safaricom M-Pesa
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
