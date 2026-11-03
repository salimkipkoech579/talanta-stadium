import React from 'react';
import { MapPin, Phone, Mail, Train, Car, Shield, Compass, Clock, Navigation } from 'lucide-react';
import { StadiumMap } from './StadiumMap';

export const ContactLocationSection: React.FC = () => {
  const gates = [
    { code: 'Gate A', label: 'Ceremonial Presidential Plaza', access: 'VVIP Skybox, State Delegations, Media VIP' },
    { code: 'Gate B & C', label: 'West Concourse', access: 'VIP Gold Terrace, Category 1 West Upper' },
    { code: 'Gate D & E', label: 'East Grandstand', access: 'Category 2 General Admission, Concourse East' },
    { code: 'Gate F', label: 'North Stand', access: 'Ultras Fan Club Zone, Chanting Sections' },
    { code: 'Gate G', label: 'South Stand', access: 'Family Section & Commuter Train Direct Concourse' },
  ];

  return (
    <section id="contact" className="py-16 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-wider font-bold text-blue-600 flex items-center justify-center gap-1.5 mb-2">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            Getting Here &amp; Access Protocol
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Stadium Location &amp; Interactive Map
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            Jamhuri Sports Precinct along the Ngong Road corridor in Nairobi, Kenya. Explore gates, turnstiles, parking, and transit connections on the live map below.
          </p>
        </div>

        {/* Live Interactive Google Map */}
        <div className="mb-12">
          <StadiumMap />
        </div>

        {/* 2-Column Split: Transit & Hotlines on Left / Gates Directory on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Transit & Contact Details */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Visual Location Card */}
            <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Talanta Sports City Stadium</h3>
                  <p className="text-xs text-blue-600 font-semibold mt-0.5">Raila Amolo Odinga International Stadium</p>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    Jamhuri Sports Precinct, Off Ngong Road, Nairobi, Kenya. <br />
                    GPS Coordinates: 1°18'24"S · 36°46'12"E
                  </p>
                </div>
              </div>

              {/* Transit Modes */}
              <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-start gap-3 text-xs">
                  <Train className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900">Kenya Railways Commuter Express:</strong>
                    <p className="text-gray-600 text-[11px]">Direct 14-minute non-stop train from Nairobi Central Station to Talanta Stadium Station on matchdays.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <Car className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900">Road &amp; Smart Parking:</strong>
                    <p className="text-gray-600 text-[11px]">Direct off-ramps from Nairobi Expressway &amp; Ngong Road. 4,000 smart automated vehicle parking bays.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stadium Inquiries & Emergency Hotline */}
            <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-4">
                Stadium Inquiries &amp; Matchday Assistance
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="text-gray-500 block text-[10px]">Toll-Free Matchday Line</span>
                    <strong className="text-gray-900">+254 (0) 20 800 2000</strong>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="text-gray-500 block text-[10px]">Ticketing Support</span>
                    <strong className="text-gray-900">tickets@talantastadium.go.ke</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Gate & Turnstile Directory */}
          <div className="lg:col-span-6">
            <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Turnstile Gate Directory
                </span>
                <span className="text-[11px] text-blue-600 font-semibold">
                  72 High-Speed Digital Turnstiles
                </span>
              </div>

              <div className="space-y-3">
                {gates.map((g, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-600 text-white">
                          {g.code}
                        </span>
                        <strong className="text-xs text-gray-900">{g.label}</strong>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-1">{g.access}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono shrink-0">Open -4h Kickoff</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-3 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-gray-700 flex items-start gap-2">
                <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Prohibited Items: Glass bottles, alcohol, laser pointers, oversized backpacks, and unauthorized commercial recording gear.
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
