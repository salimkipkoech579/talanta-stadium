import React from 'react';
import { ShieldCheck, Compass, Sparkles, Train, Wifi, Car, Tv, Users, Award } from 'lucide-react';

export const FacilitiesSection: React.FC = () => {
  const facilities = [
    {
      title: 'VVIP Presidential Skybox Suites',
      category: 'Luxury Hospitality',
      description: 'Exclusive enclosed skyboxes with pitchside panoramic glass balconies, five-star Kenyan cuisine catering, and private VIP boardroom facilities.',
      image: '/assets/aistudio/images__10__2fa6bda6.jpeg',
      specs: ['Private Concierge', 'Balcony Seating', 'Direct Elevator', 'Fine Dining Buffet'],
    },
    {
      title: 'FIFA Category 4 Hybrid Turf Pitch',
      category: 'Playing Surface',
      description: 'State-of-the-art reinforced natural turf with automated vacuum sub-air drainage, green & red tiered grandstands, and precision temperature stabilization.',
      image: '/assets/aistudio/images__13__09ed1a8f.jpeg',
      specs: ['SISGrass Hybrid System', 'Sub-Air Suction Drainage', 'Automated Sprinklers', '4K Broadcast Lighting'],
    },
    {
      title: 'Maasai Shield Diagrid Lattice Canopy',
      category: 'Architectural Icon',
      description: 'The monumental Kenyan Maasai warrior shield and crossed spears embedded into the woven steel diagrid facade, delivering natural ventilation and shade.',
      image: '/assets/aistudio/images__7__974ef065.jpeg',
      specs: ['Kenyan National Emblem', 'Woven Steel Diagrid', 'Solar Power Ready', 'Acoustic Membrane'],
    },
    {
      title: 'Sports City Masterplan & Rail Terminal',
      category: 'Transport & Masterplan',
      description: 'Integrated sports precinct with secondary athletics track, train terminal connecting to Nairobi CBD in 14 minutes, and 4,000 smart parking bays.',
      image: '/assets/aistudio/images__2__359d4adf.jpeg',
      specs: ['14-min CBD Express', '4,000 Smart Parking Bays', 'Secondary Running Track', 'Dual Helipads'],
    },
  ];

  return (
    <section id="facilities" className="py-20 bg-[#060908] border-t border-[#1c2c22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C5A059] flex items-center justify-center gap-1.5 mb-2">
            <Award className="w-3.5 h-3.5 text-[#E5C378]" />
            World-Class Infrastructure
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
            Stadium Facilities &amp; VIP Experience
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Engineered to FIFA, CAF, and World Athletics premier specifications. Combining sustainable green architecture with elite hospitality.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {facilities.map((fac, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#0a100c] border border-[#1e2c24] hover:border-[#C5A059]/40 overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                <img
                  src={fac.image}
                  alt={fac.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a100c] via-transparent to-black/30" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/80 text-[#E5C378] border border-[#C5A059]/40">
                  {fac.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#E5C378] transition-colors">
                    {fac.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {fac.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1c2c22]">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {fac.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-1.5 text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0FA958]" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Specification Bento Highlights */}
        <div className="mt-16 rounded-2xl bg-[#090f0c] border border-[#1e2c24] p-8 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-center">
            Key Stadium Architectural Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-[#060908] border border-[#1c2c22]">
              <span className="text-3xl font-black text-[#E5C378] font-mono block">60,000</span>
              <span className="text-xs font-bold text-white uppercase mt-1 block">Full Seating Capacity</span>
              <span className="text-[11px] text-slate-400">100% covered from rain and sun</span>
            </div>
            <div className="p-4 rounded-xl bg-[#060908] border border-[#1c2c22]">
              <span className="text-3xl font-black text-[#0FA958] font-mono block">72</span>
              <span className="text-xs font-bold text-white uppercase mt-1 block">Automated Turnstiles</span>
              <span className="text-[11px] text-slate-400">Processes 1,200 fans/min</span>
            </div>
            <div className="p-4 rounded-xl bg-[#060908] border border-[#1c2c22]">
              <span className="text-3xl font-black text-[#E5C378] font-mono block">3.2 MW</span>
              <span className="text-xs font-bold text-white uppercase mt-1 block">Solar Canopy Power</span>
              <span className="text-[11px] text-slate-400">Self-sustaining green grid</span>
            </div>
            <div className="p-4 rounded-xl bg-[#060908] border border-[#1c2c22]">
              <span className="text-3xl font-black text-[#0FA958] font-mono block">2,500 Lux</span>
              <span className="text-xs font-bold text-white uppercase mt-1 block">4K LED Floodlights</span>
              <span className="text-[11px] text-slate-400">Broadcast flicker-free ready</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
