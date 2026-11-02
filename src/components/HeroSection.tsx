import React, { useState, useEffect } from 'react';
import { EventItem } from '../types';
import { formatKes } from '../utils/qrcode';
import { Calendar, Clock, MapPin, ArrowRight, ShieldCheck, Zap, Sparkles, Volume2, VolumeX, Eye, Play, Video, X, Film } from 'lucide-react';

interface HeroSectionProps {
  featuredEvent?: EventItem;
  onBookEvent: (event: EventItem) => void;
  onExploreSeating: () => void;
  onViewEvents: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredEvent,
  onBookEvent,
  onExploreSeating,
  onViewEvents,
}) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  // Hero background view options
  const heroViews = [
    {
      id: 'night',
      label: 'Night Illumination',
      url: '/assets/aistudio/images__12__cd65bb66.jpeg',
      desc: 'Maasai Shield LED illumination & floodlights',
    },
    {
      id: 'day',
      label: 'Daylight Diagrid',
      url: '/assets/aistudio/images__23__66d33c9b.jpeg',
      desc: 'White lattice facade with national emblem',
    },
    {
      id: 'pitch',
      label: '60K Bowl Pitch',
      url: '/assets/aistudio/images__13__09ed1a8f.jpeg',
      desc: 'Tiered red and green stands with hybrid turf',
    },
  ];

  const [currentViewIndex, setCurrentViewIndex] = useState(0);

  // Countdown timer to matchday
  const [timeLeft, setTimeLeft] = useState({
    days: 65,
    hours: 8,
    minutes: 30,
    seconds: 40,
  });

  const [soundActive, setSoundActive] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeBg = heroViews[currentViewIndex].url;

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#060908]">
      {/* Background Image with Cinematic Scrims */}
      <div className="absolute inset-0 z-0 transition-opacity duration-700">
        <img
          key={activeBg}
          src={activeBg}
          alt="Talanta Stadium Architectural Preview"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform scale-105 transition-all duration-1000 ease-out"
        />
        {/* Layered Multi-direction Scrim for Maximum Contrast & Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060908] via-[#060908]/80 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060908] via-[#060908]/65 to-transparent" />
        <div className="absolute inset-0 bg-[#005A2B]/15 mix-blend-color-dodge pointer-events-none" />
      </div>

      {/* Decorative architectural grid lines */}
      <div className="absolute inset-0 pitch-grid opacity-20 pointer-events-none" />

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 flex-1 flex flex-col justify-center">
        
        {/* Subtitle / Kicker with Maasai Shield emblem badge */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#005A2B]/40 border border-[#0FA958]/40 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#0FA958] animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider text-white">
              Talanta Sports City
            </span>
          </div>

          <span className="text-slate-500">·</span>
          <span className="text-xs text-[#E5C378] font-bold tracking-widest uppercase">
            Raila Amolo Odinga International Stadium · Nairobi
          </span>

          {/* Perspective Switcher */}
          <div className="ml-auto hidden sm:flex items-center gap-1 p-1 rounded-lg bg-black/60 border border-[#1e2c24] backdrop-blur-md text-[11px]">
            <Eye className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
            {heroViews.map((v, i) => (
              <button
                key={v.id}
                onClick={() => setCurrentViewIndex(i)}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium ${
                  currentViewIndex === i
                    ? 'bg-[#005A2B] text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {v.label}
              </button>
            ))}
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#005A2B]/40 hover:bg-[#005A2B] text-[#E5C378] hover:text-white border border-[#0FA958]/30 transition-all font-bold cursor-pointer"
            >
              <Play className="w-2.5 h-2.5 fill-current text-[#E5C378]" />
              <span>Drone Video</span>
            </button>
          </div>
        </div>

        {/* Hero Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Bold Typography & Headline */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] text-balance break-words">
              EXPERIENCE THE GAME. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5C378] via-[#C5A059] to-[#0FA958]">
                LIVE THE MOMENT.
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              Kenya’s landmark 60,000-seater national arena. Featuring the iconic Maasai shield diagrid facade, FIFA Category 4 hybrid pitch, automated digital turnstiles, and direct Safaricom M-Pesa ticketing.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-4 pt-2">
              {featuredEvent && (
                <button
                  onClick={() => onBookEvent(featuredEvent)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#005A2B] to-[#0FA958] hover:from-[#006E35] hover:to-[#12BD63] text-white font-bold text-sm tracking-wide shadow-xl shadow-[#005A2B]/30 hover:shadow-[#0FA958]/20 transition-all cursor-pointer flex items-center justify-center gap-2 group whitespace-nowrap"
                >
                  <span>Book Opening Tickets</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#131c17] to-[#0c140f] hover:from-[#1b2820] hover:to-[#141f18] text-[#E5C378] hover:text-white border border-[#C5A059]/40 hover:border-[#E5C378] font-bold text-sm transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2.5 shadow-lg shadow-black/40 group"
              >
                <div className="w-6 h-6 rounded-full bg-[#E5C378] text-black flex items-center justify-center group-hover:scale-110 transition-transform shadow shrink-0">
                  <Play className="w-3 h-3 fill-current ml-0.5 text-black" />
                </div>
                <span>Watch Stadium Video</span>
              </button>

              <button
                onClick={onExploreSeating}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#0d1410]/90 hover:bg-[#131c17] text-slate-200 hover:text-white border border-[#1e2c24] hover:border-[#C5A059]/40 font-semibold text-sm transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                <span>Seating Plan</span>
              </button>

              <button
                onClick={onViewEvents}
                className="w-full sm:w-auto px-3.5 py-3 text-xs text-slate-400 hover:text-[#E5C378] transition-colors cursor-pointer whitespace-nowrap text-center"
              >
                All Fixtures &rarr;
              </button>
            </div>

            {/* Audio Toggle Experience & Authenticity Tag */}
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <button
                onClick={() => setSoundActive(!soundActive)}
                className="flex items-center gap-1.5 p-1.5 rounded-md bg-[#0d1410] border border-[#1e2c24] hover:text-white cursor-pointer"
              >
                {soundActive ? <Volume2 className="w-3.5 h-3.5 text-[#0FA958]" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{soundActive ? 'Atmosphere Sound On' : 'Stadium Ambience'}</span>
              </button>
              <span className="text-slate-500">·</span>
              <span className="text-[11px] text-[#0FA958] font-semibold">Official 2027 Architectural Preview</span>
            </div>
          </div>

          {/* Right Column: Featured Match Spotlight Card */}
          {featuredEvent && (
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-gradient-to-b from-[#131c17] to-[#0a0f0c] border border-[#1e2c24] p-6 shadow-2xl overflow-hidden backdrop-blur-xl">
                
                {/* Decorative glow corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#1c2c22]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#E5C378]" />
                    Featured Fixture
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {featuredEvent.tournamentName}
                  </span>
                </div>

                {/* Team Matchup */}
                <div className="py-6 flex items-center justify-between gap-4">
                  <div className="flex-1 text-center">
                    <div className="w-14 h-14 mx-auto rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center font-black text-sm text-white shadow-lg">
                      {featuredEvent.homeTeam?.slice(0, 3).toUpperCase() || 'BAY'}
                    </div>
                    <p className="mt-2 text-xs font-bold text-white uppercase tracking-tight">{featuredEvent.homeTeam}</p>
                    <span className="text-[10px] text-slate-400">European Giants</span>
                  </div>

                  <div className="flex flex-col items-center px-2">
                    <span className="text-xs font-black text-[#C5A059] uppercase tracking-widest">VS</span>
                    <span className="text-[10px] text-[#0FA958] mt-0.5 font-bold">5 JAN 2027</span>
                  </div>

                  <div className="flex-1 text-center">
                    <div className="w-14 h-14 mx-auto rounded-full bg-red-900/30 border border-white/20 flex items-center justify-center font-black text-sm text-white shadow-lg">
                      {featuredEvent.awayTeam?.slice(0, 3).toUpperCase() || 'AJX'}
                    </div>
                    <p className="mt-2 text-xs font-bold text-white uppercase tracking-tight">{featuredEvent.awayTeam}</p>
                    <span className="text-[10px] text-slate-400">Eredivisie Royalty</span>
                  </div>
                </div>

                {/* Match Details */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#060908]/60 border border-[#1c2c22] text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-[#0FA958]" />
                    <span>{featuredEvent.eventDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-[#0FA958]" />
                    <span>Kickoff {featuredEvent.startTime} EAT</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="truncate">Talanta Sports City Stadium, Nairobi</span>
                  </div>
                </div>

                {/* Live Countdown Grid */}
                <div className="mt-4 pt-3 border-t border-[#1c2c22]">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
                    Countdown to Opening Match:
                  </p>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-[#060908] border border-[#1e2c24]">
                      <span className="block text-lg font-black text-[#E5C378] font-mono tabular-nums">{timeLeft.days}</span>
                      <span className="text-[9px] uppercase text-slate-400">Days</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#060908] border border-[#1e2c24]">
                      <span className="block text-lg font-black text-[#E5C378] font-mono tabular-nums">{timeLeft.hours}</span>
                      <span className="text-[9px] uppercase text-slate-400">Hours</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#060908] border border-[#1e2c24]">
                      <span className="block text-lg font-black text-[#E5C378] font-mono tabular-nums">{timeLeft.minutes}</span>
                      <span className="text-[9px] uppercase text-slate-400">Mins</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#060908] border border-[#1e2c24]">
                      <span className="block text-lg font-black text-[#0FA958] font-mono tabular-nums">{timeLeft.seconds}</span>
                      <span className="text-[9px] uppercase text-slate-400">Secs</span>
                    </div>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="mt-5 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Tickets From</span>
                    <span className="text-base font-black text-white font-mono">
                      {formatKes(featuredEvent.minPriceKes)}
                    </span>
                  </div>

                  <button
                    onClick={() => onBookEvent(featuredEvent)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#C5A059]/20 cursor-pointer text-center"
                  >
                    Select Seats
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4-Item Proof & Architectural Metric Row below hero split */}
      <div className="relative z-10 w-full border-t border-[#1c2c22] bg-[#060908]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 text-slate-300">
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#0d1410] border border-[#1e2c24] flex items-center justify-center text-[#C5A059] shrink-0">
                <span className="text-xs sm:text-sm font-bold font-mono">60K</span>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-bold text-white uppercase truncate">60,000 Capacity</p>
                <p className="text-[9px] sm:text-[11px] text-slate-400 truncate">All-Covered Diagrid</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#0d1410] border border-[#1e2c24] flex items-center justify-center text-[#0FA958] shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-bold text-white uppercase truncate">Maasai Shield</p>
                <p className="text-[9px] sm:text-[11px] text-slate-400 truncate">National Identity Icon</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#0d1410] border border-[#1e2c24] flex items-center justify-center text-[#E5C378] shrink-0">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-bold text-white uppercase truncate">Safaricom Daraja</p>
                <p className="text-[9px] sm:text-[11px] text-slate-400 truncate">Instant M-Pesa STK</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#0d1410] border border-[#1e2c24] flex items-center justify-center text-[#0FA958] shrink-0">
                <span className="text-xs sm:text-sm font-bold font-mono">14m</span>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-bold text-white uppercase truncate">Commuter Rail</p>
                <p className="text-[9px] sm:text-[11px] text-slate-400 truncate">Express from CBD</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-[#0a100c] border border-[#1e2c24] rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1c2c22] bg-[#0d1410]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Talanta Stadium Aerial Drone Tour (Raila Odinga International Stadium)
                </span>
              </div>

              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#131c17] hover:bg-[#1a261f] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video iFrame */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src="https://www.youtube-nocookie.com/embed/6XZMqvT1wgA?autoplay=1&rel=0"
                title="Talanta Stadium Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-[#080d0a] border-t border-[#1c2c22] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <p>Nairobi, Kenya · 60,000 Capacity · Opening January 5, 2027</p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.youtube.com/watch?v=6XZMqvT1wgA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E5C378] hover:underline font-semibold"
                >
                  Watch on YouTube &rarr;
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
