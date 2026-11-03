import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { MapPin, Navigation, Compass, Layers, Car, Train, ExternalLink, ShieldAlert, CheckCircle2 } from 'lucide-react';

export interface StadiumPin {
  id: string;
  title: string;
  category: 'arena' | 'gate' | 'transit' | 'parking';
  lat: number;
  lng: number;
  description: string;
  gateCode?: string;
  badge: string;
  color: string;
  glowColor: string;
}

const STADIUM_PINS: StadiumPin[] = [
  {
    id: 'pin_arena',
    title: 'Talanta Sports City Main Arena',
    category: 'arena',
    lat: -1.30667,
    lng: 36.77000,
    description: '60,000-capacity national stadium, hybrid pitch, diagrid woven facade with Kenyan shield motif.',
    badge: 'Central Pitch',
    color: '#0FA958',
    glowColor: 'rgba(15, 169, 88, 0.4)',
  },
  {
    id: 'pin_gate_a',
    title: 'Gate A – Ceremonial Presidential Plaza',
    category: 'gate',
    lat: -1.30560,
    lng: 36.76900,
    description: 'Direct red-carpet entrance for VVIP Presidential Skyboxes, diplomatic envoys, and official media delegations.',
    gateCode: 'Gate A',
    badge: 'VVIP & Protocol',
    color: '#C5A059',
    glowColor: 'rgba(197, 160, 89, 0.4)',
  },
  {
    id: 'pin_gate_bc',
    title: 'Gate B & C – West Concourse',
    category: 'gate',
    lat: -1.30640,
    lng: 36.76840,
    description: 'Turnstiles B1–B8 and C1–C8 serving VIP Gold Terrace, hospitality lounges, and Category 1 West Upper seating.',
    gateCode: 'Gate B & C',
    badge: 'VIP & Cat 1',
    color: '#E5C378',
    glowColor: 'rgba(229, 195, 120, 0.4)',
  },
  {
    id: 'pin_gate_de',
    title: 'Gate D & E – East Grandstand',
    category: 'gate',
    lat: -1.30690,
    lng: 36.77160,
    description: 'High-throughput electronic turnstiles for Category 2 East Grandstand with expansive food & beverage concourses.',
    gateCode: 'Gate D & E',
    badge: 'Cat 2 Concourse',
    color: '#005A2B',
    glowColor: 'rgba(0, 90, 43, 0.4)',
  },
  {
    id: 'pin_gate_f',
    title: 'Gate F – North Stand Ultras Zone',
    category: 'gate',
    lat: -1.30480,
    lng: 36.77020,
    description: 'Dedicated entrance for registered fan clubs, safe standing, chanting rails, and marching band instruments.',
    gateCode: 'Gate F',
    badge: 'Fan Clubs & Ultras',
    color: '#34D399',
    glowColor: 'rgba(52, 211, 153, 0.4)',
  },
  {
    id: 'pin_gate_g',
    title: 'Gate G – South Stand & Family Zone',
    category: 'gate',
    lat: -1.30850,
    lng: 36.76980,
    description: 'Family friendly turnstile entrance with stroller bays and direct pedestrian walkway from the Commuter Rail Terminal.',
    gateCode: 'Gate G',
    badge: 'Family & Rail Access',
    color: '#60A5FA',
    glowColor: 'rgba(96, 165, 250, 0.4)',
  },
  {
    id: 'pin_rail_station',
    title: 'Kenya Railways Talanta Express Station',
    category: 'transit',
    lat: -1.30980,
    lng: 36.77060,
    description: 'Matchday commuter rail express link running directly from Nairobi Central Railway Station (14-min transit time).',
    badge: 'Rail Link',
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.4)',
  },
  {
    id: 'pin_parking',
    title: 'Talanta Smart Parking Bay (Lots 1–4)',
    category: 'parking',
    lat: -1.30800,
    lng: 36.76780,
    description: '4,000 automated vehicle bays with license-plate recognition, EV chargers, and direct Ngong Road off-ramp.',
    badge: '4,000 Vehicle Bays',
    color: '#A78BFA',
    glowColor: 'rgba(167, 139, 250, 0.4)',
  },
];

export const StadiumMap: React.FC = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDRMO5tdb9ScN4VuMGI7AfmFMxqTHiZUrY';
  
  const [selectedPin, setSelectedPin] = useState<StadiumPin | null>(STADIUM_PINS[0]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'arena' | 'gate' | 'transit' | 'parking'>('all');
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('hybrid');

  const filteredPins = STADIUM_PINS.filter((pin) => {
    if (activeFilter === 'all') return true;
    return pin.category === activeFilter;
  });

  const stadiumCenter = { lat: -1.30667, lng: 36.77000 };

  const openGoogleMapsDirections = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm transition-all">
      {/* Interactive Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-gray-200 bg-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-wide flex items-center gap-2">
              Talanta Sports City Map
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Live Geolocation
              </span>
            </h3>
            <p className="text-[11px] text-gray-500">
              Jamhuri Park Sports Precinct, Ngong Road · Nairobi, Kenya (-1.3067, 36.7700)
            </p>
          </div>
        </div>

        {/* View Mode & Directions */}
        <div className="flex items-center gap-2">
          {/* Map Style Selector */}
          <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs">
            <button
              onClick={() => setMapType('hybrid')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                mapType === 'hybrid'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapType('roadmap')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                mapType === 'roadmap'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Streets
            </button>
          </div>

          <button
            onClick={() => openGoogleMapsDirections(stadiumCenter.lat, stadiumCenter.lng)}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Navigate in</span> Google Maps
            <ExternalLink className="w-3 h-3 opacity-80" />
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
        <span className="text-[11px] text-gray-500 font-medium shrink-0 flex items-center gap-1 mr-1">
          <Layers className="w-3 h-3 text-blue-600" />
          Filter:
        </span>
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1 rounded-md font-semibold shrink-0 transition-colors cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          All Locations ({STADIUM_PINS.length})
        </button>
        <button
          onClick={() => setActiveFilter('gate')}
          className={`px-3 py-1 rounded-md font-semibold shrink-0 transition-colors cursor-pointer ${
            activeFilter === 'gate'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Gates &amp; Turnstiles (5)
        </button>
        <button
          onClick={() => setActiveFilter('transit')}
          className={`px-3 py-1 rounded-md font-semibold shrink-0 transition-colors cursor-pointer ${
            activeFilter === 'transit'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Rail &amp; Transit
        </button>
        <button
          onClick={() => setActiveFilter('parking')}
          className={`px-3 py-1 rounded-md font-semibold shrink-0 transition-colors cursor-pointer ${
            activeFilter === 'parking'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Vehicle Parking
        </button>
      </div>

      {/* Google Maps Container */}
      <div className="relative w-full h-[460px] sm:h-[540px] bg-[#0d1410]">
        <APIProvider apiKey={apiKey} solutionChannel="GMP_aistudio_build">
          <Map
            mapId="DEMO_MAP_ID"
            defaultCenter={stadiumCenter}
            defaultZoom={16}
            mapTypeId={mapType}
            gestureHandling="cooperative"
            disableDefaultUI={false}
            zoomControl={true}
            streetViewControl={true}
            mapTypeControl={false}
            fullscreenControl={true}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          >
            {filteredPins.map((pin) => (
              <AdvancedMarker
                key={pin.id}
                position={{ lat: pin.lat, lng: pin.lng }}
                title={pin.title}
                onClick={() => setSelectedPin(pin)}
              >
                <div className="relative cursor-pointer group transition-transform duration-200 hover:scale-115">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold transition-all"
                    style={{
                      backgroundColor: pin.color,
                      boxShadow: `0 0 16px ${pin.glowColor}`,
                    }}
                  >
                    {pin.category === 'arena' && <Compass className="w-4 h-4 text-white" />}
                    {pin.category === 'gate' && (pin.gateCode?.replace('Gate ', '') || 'G')}
                    {pin.category === 'transit' && <Train className="w-4 h-4 text-white" />}
                    {pin.category === 'parking' && <Car className="w-4 h-4 text-white" />}
                  </div>

                  {/* Pulsing beacon for main arena */}
                  {pin.category === 'arena' && (
                    <span className="absolute -inset-1 rounded-full animate-ping opacity-60 bg-[#0FA958]" />
                  )}
                </div>
              </AdvancedMarker>
            ))}

            {selectedPin && (
              <InfoWindow
                position={{ lat: selectedPin.lat, lng: selectedPin.lng }}
                onCloseClick={() => setSelectedPin(null)}
                headerContent={
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: selectedPin.color }}
                    />
                    <span className="font-bold text-xs text-gray-900 uppercase tracking-wide">
                      {selectedPin.badge}
                    </span>
                  </div>
                }
              >
                <div className="p-1 max-w-[260px] text-gray-900">
                  <h4 className="font-bold text-sm text-gray-900 leading-snug">
                    {selectedPin.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {selectedPin.description}
                  </p>
                  <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-gray-500 font-mono">
                      {selectedPin.lat.toFixed(4)}, {selectedPin.lng.toFixed(4)}
                    </span>
                    <button
                      onClick={() => openGoogleMapsDirections(selectedPin.lat, selectedPin.lng)}
                      className="px-2.5 py-1 rounded bg-[#005A2B] text-white text-[11px] font-bold hover:bg-[#0FA958] flex items-center gap-1 transition-all"
                    >
                      <Navigation className="w-3 h-3" />
                      Directions
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>

        {/* Floating Quick Legend / Location Summary */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md p-3.5 rounded-xl bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl pointer-events-auto text-gray-900">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Selected Destination
                </span>
              </div>
              <h5 className="text-sm font-bold text-blue-700 mt-0.5">
                {selectedPin ? selectedPin.title : 'Talanta Sports City'}
              </h5>
              <p className="text-[11px] text-gray-600 mt-1 line-clamp-2">
                {selectedPin ? selectedPin.description : 'Click any marker to view entry gates, turnstiles, and transit links.'}
              </p>
            </div>
            {selectedPin && (
              <button
                onClick={() => openGoogleMapsDirections(selectedPin.lat, selectedPin.lng)}
                className="shrink-0 p-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs cursor-pointer"
                title="Get Directions"
              >
                <Navigation className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Transit Quick Links Bar */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-gray-200 shadow-xs">
          <Train className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <span className="text-[10px] text-gray-500 block font-medium">Commuter Rail</span>
            <strong className="text-gray-900 text-xs">14 min from CBD</strong>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-gray-200 shadow-xs">
          <Car className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <span className="text-[10px] text-gray-500 block font-medium">Expressway Off-ramp</span>
            <strong className="text-gray-900 text-xs">Ngong Rd Jamhuri Gate</strong>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-gray-200 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="text-[10px] text-gray-500 block font-medium">Turnstiles Status</span>
            <strong className="text-gray-900 text-xs">72 Automated Gates Open</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
