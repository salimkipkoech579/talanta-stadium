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
    <section id="facilities" className="py-16 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-wider font-bold text-blue-600 flex items-center justify-center gap-1.5 mb-2">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            World-Class Infrastructure
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Stadium Facilities &amp; VIP Experience
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            Engineered to FIFA, CAF, and World Athletics premier specifications. Combining sustainable green architecture with elite hospitality.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {facilities.map((fac, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-white border border-gray-200 hover:border-blue-400 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                <img
                  src={fac.image}
                  alt={fac.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 ease-out"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded text-[10px] font-semibold uppercase tracking-wider bg-white/95 text-gray-800 border border-gray-200 shadow-xs">
                  {fac.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {fac.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {fac.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {fac.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-1.5 text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
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
        <div className="mt-12 rounded-2xl bg-white border border-gray-200 p-8 shadow-xs">
          <h3 className="text-base font-bold text-gray-900 mb-6 uppercase tracking-wider text-center">
            Key Stadium Architectural Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-3xl font-bold text-gray-900 font-mono block">60,000</span>
              <span className="text-xs font-semibold text-gray-900 uppercase mt-1 block">Full Seating Capacity</span>
              <span className="text-[11px] text-gray-500">100% covered from rain and sun</span>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-3xl font-bold text-blue-600 font-mono block">72</span>
              <span className="text-xs font-semibold text-gray-900 uppercase mt-1 block">Automated Turnstiles</span>
              <span className="text-[11px] text-gray-500">Processes 1,200 fans/min</span>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-3xl font-bold text-gray-900 font-mono block">3.2 MW</span>
              <span className="text-xs font-semibold text-gray-900 uppercase mt-1 block">Solar Canopy Power</span>
              <span className="text-[11px] text-gray-500">Self-sustaining green grid</span>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-3xl font-bold text-blue-600 font-mono block">2,500 Lux</span>
              <span className="text-xs font-semibold text-gray-900 uppercase mt-1 block">4K LED Floodlights</span>
              <span className="text-[11px] text-gray-500">Broadcast flicker-free ready</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
