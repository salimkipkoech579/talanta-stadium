import React from 'react';
import { MapPin, Phone, Mail, Train, Car, Shield, Compass, Clock } from 'lucide-react';

export const ContactLocationSection: React.FC = () => {
  const gates = [
    { code: 'Gate A', label: 'Ceremonial Presidential Plaza', access: 'VVIP Skybox, State Delegations, Media VIP' },
    { code: 'Gate B & C', label: 'West Concourse', access: 'VIP Gold Terrace, Category 1 West Upper' },
    { code: 'Gate D & E', label: 'East Grandstand', access: 'Category 2 General Admission, Concourse East' },
    { code: 'Gate F', label: 'North Stand', access: 'Ultras Fan Club Zone, Chanting Sections' },
    { code: 'Gate G', label: 'South Stand', access: 'Family Section & Commuter Train Direct Concourse' },
  ];

  return (
    <section id="contact" className="py-20 bg-[#060908] border-t border-[#1c2c22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C5A059] flex items-center justify-center gap-1.5 mb-2">
            <Compass className="w-3.5 h-3.5 text-[#E5C378]" />
            Getting Here &amp; Access Protocol
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
            Location, Gates &amp; Transport
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Conveniently situated at Jamhuri Park sports precinct along the Ngong Road corridor in Nairobi, with express rail, highway, and parking connectivity.
          </p>
        </div>

        {/* 2-Column Split: Map & Transit info on Left / Gates Directory on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Transit & Contact Details */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Visual Location Card */}
            <div className="p-6 rounded-2xl bg-[#0a100c] border border-[#1e2c24] shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#005A2B]/40 border border-[#0FA958]/30 flex items-center justify-center text-[#0FA958] shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Talanta Sports City Stadium</h3>
                  <p className="text-xs text-[#E5C378] font-medium mt-0.5">Raila Amolo Odinga International Stadium</p>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Jamhuri Sports Precinct, Off Ngong Road, Nairobi, Kenya. <br />
                    GPS Coordinates: 1°18'24"S · 36°46'12"E
                  </p>
                </div>
              </div>

              {/* Transit Modes */}
              <div className="mt-6 pt-4 border-t border-[#1c2c22] space-y-3">
                <div className="flex items-start gap-3 text-xs">
                  <Train className="w-4 h-4 text-[#0FA958] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Kenya Railways Commuter Express:</strong>
                    <p className="text-slate-400 text-[11px]">Direct 14-minute non-stop train from Nairobi Central Station to Talanta Stadium Station on matchdays.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <Car className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Road &amp; Smart Parking:</strong>
                    <p className="text-slate-400 text-[11px]">Direct off-ramps from Nairobi Expressway &amp; Ngong Road. 4,000 smart automated vehicle parking bays.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stadium Inquiries & Emergency Hotline */}
            <div className="p-6 rounded-2xl bg-[#0a100c] border border-[#1e2c24] shadow-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
                Stadium Inquiries &amp; Matchday Assistance
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#0FA958]" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Toll-Free Matchday Line</span>
                    <strong className="text-white">+254 (0) 20 800 2000</strong>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#C5A059]" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Ticketing Support</span>
                    <strong className="text-white">tickets@talantastadium.go.ke</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Gate & Turnstile Directory */}
          <div className="lg:col-span-6">
            <div className="p-6 rounded-2xl bg-[#0a100c] border border-[#1e2c24] shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#1c2c22] mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Turnstile Gate Directory
                </span>
                <span className="text-[11px] text-[#0FA958] font-semibold">
                  72 High-Speed Digital Turnstiles
                </span>
              </div>

              <div className="space-y-3">
                {gates.map((g, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#060908] border border-[#1c2c22] flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#005A2B] text-white">
                          {g.code}
                        </span>
                        <strong className="text-xs text-white">{g.label}</strong>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{g.access}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">Open -4h Kickoff</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-3 rounded-xl bg-[#005A2B]/15 border border-[#0FA958]/20 text-[11px] text-slate-300 flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#0FA958] shrink-0 mt-0.5" />
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
