import React, { useState } from 'react';
import { Play, Sparkles, Video, Share2, ExternalLink, Shield, Compass, Layers, CheckCircle2 } from 'lucide-react';

export const StadiumVideoTour: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const videoId = '6XZMqvT1wgA';
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  const videoHighlights = [
    {
      timestamp: '0:00',
      title: 'Architectural Diagrid & Maasai Shield',
      desc: 'The iconic steel woven diagrid lattice canopy featuring Kenya’s traditional Maasai warrior shield motif in vivid red, black, and white.',
    },
    {
      timestamp: '0:45',
      title: '60,000-Seat Bowl Sightlines',
      desc: 'Steep multi-tier grandstand geometry designed to bring 60,000 spectators intimately close to the pitch with zero obstructed views.',
    },
    {
      timestamp: '1:20',
      title: 'FIFA Category 4 Hybrid Turf',
      desc: 'State-of-the-art hybrid reinforced natural grass pitch with vacuum sub-air drainage and Olympic-standard synthetic running track.',
    },
    {
      timestamp: '2:00',
      title: 'Talanta Sports City Precinct',
      desc: 'Secondary competition tracks, direct commuter rail transit concourse, dual helipads, and rapid automated smart turnstiles.',
    },
  ];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(youtubeUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <section id="video-tour" className="py-20 bg-[#060908] border-t border-[#1c2c22] relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#005A2B]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#005A2B]/30 border border-[#0FA958]/30 mb-3">
            <Video className="w-3.5 h-3.5 text-[#E5C378]" />
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-white">
              Official Video Showcase
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">
            Witness Talanta Stadium In Motion
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Take a cinematic aerial drone flythrough of the Raila Amolo Odinga International Stadium at Talanta Sports City, Nairobi.
          </p>
        </div>

        {/* Video Player Showcase Box */}
        <div className="rounded-3xl bg-[#0a100c] border border-[#1e2c24] p-4 sm:p-6 shadow-2xl shadow-black/80">
          
          {/* Top Video Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-[#1c2c22] text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="font-bold text-white uppercase tracking-wider text-sm">
                Talanta Stadium Drone Tour &amp; Architectural Flythrough
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[#131c17] text-[#C5A059] border border-[#1e2c24]">
                4K Ultra HD
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131c17] hover:bg-[#1a261f] text-slate-300 hover:text-white border border-[#1e2c24] transition-colors cursor-pointer"
                title="Copy video link"
              >
                <Share2 className="w-3.5 h-3.5 text-[#E5C378]" />
                <span>{copiedLink ? 'Link Copied!' : 'Share Video'}</span>
              </button>

              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#005A2B]/40 hover:bg-[#005A2B] text-white border border-[#0FA958]/30 transition-colors"
              >
                <span>YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#E5C378]" />
              </a>
            </div>
          </div>

          {/* Video Container (16:9 Aspect Ratio) */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[#1c2c22] shadow-2xl">
            {isPlaying ? (
              <iframe
                src={embedUrl}
                title="Talanta Stadium Video Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
                <img
                  src="/assets/aistudio/images__23__66d33c9b.jpeg"
                  alt="Talanta Stadium Video Thumbnail"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Cinema Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30 group-hover:via-black/30 transition-colors" />

                {/* Big Center Glowing Play Button */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#005A2B] to-[#0FA958] p-1 shadow-2xl shadow-[#0FA958]/40 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-[#060908]/90 flex items-center justify-center border border-[#C5A059]/40 group-hover:bg-[#060908]/70">
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 text-[#E5C378] fill-current ml-1" />
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="text-white font-bold text-base sm:text-lg tracking-wide uppercase drop-shadow">
                      Click to Play Stadium Video Tour
                    </p>
                    <p className="text-xs text-[#E5C378] font-mono mt-1">
                      Raila Amolo Odinga International Stadium · Nairobi
                    </p>
                  </div>
                </div>

                {/* Video Info Watermark */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300 pointer-events-none">
                  <span className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 font-mono">
                    Talanta Sports City 60,000 Seater
                  </span>
                  <span className="bg-[#005A2B]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#0FA958]/30 font-bold text-white">
                    Official Drone Tour
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Video Highlights Grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {videoHighlights.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#0e1611] border border-[#1c2c22] hover:border-[#0FA958]/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-[#E5C378] bg-[#C5A059]/10 px-2 py-0.5 rounded border border-[#C5A059]/20">
                    {item.timestamp}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#0FA958]" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-tight mb-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Stadium Stats Strip */}
          <div className="mt-6 pt-6 border-t border-[#1c2c22] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-2 sm:p-0">
              <p className="text-xl sm:text-2xl font-black text-white font-mono">60,000</p>
              <p className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider">All-Seater Capacity</p>
            </div>
            <div className="p-2 sm:p-0">
              <p className="text-xl sm:text-2xl font-black text-white font-mono">FIFA Cat 4</p>
              <p className="text-[10px] uppercase font-bold text-[#0FA958] tracking-wider">Hybrid SISGrass Turf</p>
            </div>
            <div className="p-2 sm:p-0">
              <p className="text-xl sm:text-2xl font-black text-white font-mono">5 JAN 2027</p>
              <p className="text-[10px] uppercase font-bold text-[#E5C378] tracking-wider">Inaugural Opening</p>
            </div>
            <div className="p-2 sm:p-0">
              <p className="text-xl sm:text-2xl font-black text-white font-mono">AFCON 2027</p>
              <p className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Pamoja Anchor Venue</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
