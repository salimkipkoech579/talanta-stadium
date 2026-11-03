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
    <section id="video-tour" className="py-16 bg-white border-t border-gray-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 mb-3">
            <Video className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs uppercase tracking-wider font-bold text-blue-700">
              Official Video Showcase
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            Witness Talanta Stadium In Motion
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            Take a cinematic aerial drone flythrough of the Raila Amolo Odinga International Stadium at Talanta Sports City, Nairobi.
          </p>
        </div>

        {/* Video Player Showcase Box */}
        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 sm:p-6 shadow-xs">
          
          {/* Top Video Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-gray-200 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <span className="font-bold text-gray-900 uppercase tracking-wider text-sm">
                Talanta Stadium Drone Tour &amp; Architectural Flythrough
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-blue-700 border border-blue-200">
                4K Ultra HD
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 transition-colors cursor-pointer text-xs font-medium shadow-xs"
                title="Copy video link"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-600" />
                <span>{copiedLink ? 'Link Copied!' : 'Share Video'}</span>
              </button>

              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors text-xs font-semibold shadow-xs"
              >
                <span>YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 text-white" />
              </a>
            </div>
          </div>

          {/* Video Container (16:9 Aspect Ratio) */}
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-md border border-gray-200">
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
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                />
                
                {/* Cinema Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

                {/* Big Center Blue Play Button */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="text-white font-bold text-base sm:text-lg tracking-wide uppercase drop-shadow">
                      Click to Play Stadium Video Tour
                    </p>
                    <p className="text-xs text-blue-200 mt-1 font-medium">
                      Raila Amolo Odinga International Stadium · Nairobi
                    </p>
                  </div>
                </div>

                {/* Video Info Watermark */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-gray-200 pointer-events-none">
                  <span className="bg-black/75 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20 font-mono text-[11px]">
                    Talanta Sports City 60,000 Seater
                  </span>
                  <span className="bg-blue-600 px-3 py-1.5 rounded-lg text-white font-bold text-[11px]">
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
                className="p-4 rounded-xl bg-white border border-gray-200 hover:border-blue-400 transition-colors shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {item.timestamp}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-tight mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Stadium Stats Strip */}
          <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-lg bg-white border border-gray-200">
              <p className="text-xl sm:text-2xl font-bold text-gray-900 font-mono">60,000</p>
              <p className="text-[11px] uppercase font-semibold text-gray-500 mt-0.5">All-Seater Capacity</p>
            </div>
            <div className="p-3 rounded-lg bg-white border border-gray-200">
              <p className="text-xl sm:text-2xl font-bold text-blue-600 font-mono">FIFA Cat 4</p>
              <p className="text-[11px] uppercase font-semibold text-gray-500 mt-0.5">Hybrid SISGrass Turf</p>
            </div>
            <div className="p-3 rounded-lg bg-white border border-gray-200">
              <p className="text-xl sm:text-2xl font-bold text-gray-900 font-mono">5 JAN 2027</p>
              <p className="text-[11px] uppercase font-semibold text-gray-500 mt-0.5">Inaugural Opening</p>
            </div>
            <div className="p-3 rounded-lg bg-white border border-gray-200">
              <p className="text-xl sm:text-2xl font-bold text-blue-600 font-mono">AFCON 2027</p>
              <p className="text-[11px] uppercase font-semibold text-gray-500 mt-0.5">Pamoja Anchor Venue</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
