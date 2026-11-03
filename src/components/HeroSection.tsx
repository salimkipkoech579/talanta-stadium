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
    <section className="relative min-h-[88vh] flex flex-col justify-between overflow-hidden bg-gray-900">
      {/* Background Image with Clean Scrim */}
      <div className="absolute inset-0 z-0 transition-opacity duration-700">
        <img
          key={activeBg}
          src={activeBg}
          alt="Talanta Stadium Architectural Preview"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        {/* Soft, natural gradient scrim to ensure clean text contrast without artificial glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-gray-900/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/60 to-transparent" />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 flex-1 flex flex-col justify-center">
        
        {/* Subtitle / Kicker */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-semibold">
            <span>Talanta Sports City</span>
          </div>

          <span className="text-gray-400">·</span>
          <span className="text-xs text-gray-200 font-medium">
            Raila Amolo Odinga International Stadium · Nairobi
          </span>

          {/* Perspective Switcher */}
          <div className="ml-auto hidden sm:flex items-center gap-1 p-1 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md text-[11px]">
            <Eye className="w-3.5 h-3.5 text-gray-300 ml-1.5 mr-0.5" />
            {heroViews.map((v, i) => (
              <button
                key={v.id}
                onClick={() => setCurrentViewIndex(i)}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium ${
                  currentViewIndex === i
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {v.label}
              </button>
            ))}
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-600/80 hover:bg-blue-600 text-white transition-all font-semibold cursor-pointer"
            >
              <Play className="w-2.5 h-2.5 fill-current text-white" />
              <span>Drone Video</span>
            </button>
          </div>
        </div>

        {/* Hero Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Bold Typography & Headline */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] text-balance break-words">
              Experience the Game. <br />
              <span className="text-blue-400">
                Live the Moment.
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-gray-200 max-w-xl font-normal leading-relaxed">
              Kenya’s landmark 60,000-seater national arena. Featuring the iconic Maasai shield diagrid facade, FIFA Category 4 hybrid pitch, automated digital turnstiles, and direct Safaricom M-Pesa ticketing.
            </p>

            {/* CTAs with Blue Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-4 pt-2">
              {featuredEvent && (
                <button
                  onClick={() => onBookEvent(featuredEvent)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm tracking-wide shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 group whitespace-nowrap"
                >
                  <span>Book Opening Tickets</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="w-full sm:w-auto px-5 py-3.5 rounded-lg bg-white hover:bg-gray-100 text-blue-700 font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2.5 shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Watch Stadium Video</span>
              </button>

              <button
                onClick={onExploreSeating}
                className="w-full sm:w-auto px-5 py-3.5 rounded-lg bg-gray-800/90 hover:bg-gray-800 text-white border border-gray-600 font-medium text-sm transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                <span>Seating Plan</span>
              </button>
            </div>

            {/* Audio Toggle Experience */}
            <div className="pt-2 flex items-center gap-2 text-xs text-gray-300">
              <button
                onClick={() => setSoundActive(!soundActive)}
                className="flex items-center gap-1.5 p-1.5 rounded-md bg-gray-800/80 border border-gray-700 hover:text-white cursor-pointer"
              >
                {soundActive ? <Volume2 className="w-3.5 h-3.5 text-blue-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{soundActive ? 'Atmosphere Sound On' : 'Stadium Ambience'}</span>
              </button>
              <span className="text-gray-500">·</span>
              <span className="text-[11px] text-gray-300">Official 2027 Architectural Preview</span>
            </div>
          </div>

          {/* Right Column: Featured Match Spotlight Card (CLEAN WHITE CARD) */}
          {featuredEvent && (
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-white border border-gray-200 p-6 shadow-2xl text-gray-900">
                
                {/* Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-blue-600" />
                    Featured Fixture
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {featuredEvent.tournamentName}
                  </span>
                </div>

                {/* Team Matchup */}
                <div className="py-6 flex items-center justify-between gap-4">
                  <div className="flex-1 text-center">
                    <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-sm text-blue-700 shadow-xs">
                      {featuredEvent.homeTeam?.slice(0, 3).toUpperCase() || 'BAY'}
                    </div>
                    <p className="mt-2 text-xs font-bold text-gray-900 uppercase tracking-tight">{featuredEvent.homeTeam}</p>
                    <span className="text-[10px] text-gray-500">European Champions</span>
                  </div>

                  <div className="flex flex-col items-center px-2">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">VS</span>
                    <span className="text-[11px] text-blue-600 mt-0.5 font-bold">5 JAN 2027</span>
                  </div>

                  <div className="flex-1 text-center">
                    <div className="w-14 h-14 mx-auto rounded-full bg-red-50 border border-red-200 flex items-center justify-center font-bold text-sm text-red-700 shadow-xs">
                      {featuredEvent.awayTeam?.slice(0, 3).toUpperCase() || 'AJX'}
                    </div>
                    <p className="mt-2 text-xs font-bold text-gray-900 uppercase tracking-tight">{featuredEvent.awayTeam}</p>
                    <span className="text-[10px] text-gray-500">Eredivisie Royalty</span>
                  </div>
                </div>

                {/* Match Details */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{featuredEvent.eventDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Kickoff {featuredEvent.startTime} EAT</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                    <span className="truncate">Talanta Sports City Stadium, Nairobi</span>
                  </div>
                </div>

                {/* Live Countdown Grid */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-2">
                    Countdown to Opening Match:
                  </p>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                      <span className="block text-lg font-bold text-gray-900 font-mono tabular-nums">{timeLeft.days}</span>
                      <span className="text-[9px] uppercase text-gray-500 font-medium">Days</span>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                      <span className="block text-lg font-bold text-gray-900 font-mono tabular-nums">{timeLeft.hours}</span>
                      <span className="text-[9px] uppercase text-gray-500 font-medium">Hours</span>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                      <span className="block text-lg font-bold text-gray-900 font-mono tabular-nums">{timeLeft.minutes}</span>
                      <span className="text-[9px] uppercase text-gray-500 font-medium">Mins</span>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                      <span className="block text-lg font-bold text-blue-600 font-mono tabular-nums">{timeLeft.seconds}</span>
                      <span className="text-[9px] uppercase text-gray-500 font-medium">Secs</span>
                    </div>
                  </div>
                </div>

                {/* Price and Blue Action Button */}
                <div className="mt-5 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase text-gray-500 block font-medium">Tickets From</span>
                    <span className="text-base font-bold text-gray-900 font-mono">
                      {formatKes(featuredEvent.minPriceKes)}
                    </span>
                  </div>

                  <button
                    onClick={() => onBookEvent(featuredEvent)}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-sm cursor-pointer text-center"
                  >
                    Select Seats
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4-Item Proof & Architectural Metric Row (CLEAN WHITE SURFACE) */}
      <div className="relative z-10 w-full border-t border-gray-200 bg-white shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-gray-700">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 font-bold text-xs font-mono">
                60K
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-gray-900 uppercase truncate">60,000 Capacity</p>
                <p className="text-[11px] text-gray-500 truncate">All-Covered Diagrid</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-gray-900 uppercase truncate">Maasai Shield</p>
                <p className="text-[11px] text-gray-500 truncate">National Identity Icon</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-gray-900 uppercase truncate">Safaricom Daraja</p>
                <p className="text-[11px] text-gray-500 truncate">Instant M-Pesa STK</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 font-bold text-xs font-mono">
                14m
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-gray-900 uppercase truncate">Commuter Rail</p>
                <p className="text-[11px] text-gray-500 truncate">Express from CBD</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Talanta Stadium Aerial Drone Tour (Raila Odinga International Stadium)
                </span>
              </div>

              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
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
            <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
              <p>Nairobi, Kenya · 60,000 Capacity · Opening January 5, 2027</p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.youtube.com/watch?v=6XZMqvT1wgA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
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
