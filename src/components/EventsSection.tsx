import React, { useState } from 'react';
import { EventItem } from '../types';
import { formatKes } from '../utils/qrcode';
import { Calendar, Clock, MapPin, Ticket, Trophy, Music, Sparkles } from 'lucide-react';

interface EventsSectionProps {
  events: EventItem[];
  onBookEvent: (event: EventItem) => void;
  pastResults?: any[];
}

export const EventsSection: React.FC<EventsSectionProps> = ({
  events,
  onBookEvent,
  pastResults = [],
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [showResults, setShowResults] = useState<boolean>(false);

  const filteredEvents = events.filter((e) => {
    if (filter === 'all') return true;
    return e.categoryId === filter;
  });

  return (
    <section id="events" className="py-20 bg-[#060908]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C5A059] flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-[#E5C378]" />
                Official Matchday Calendar
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-[10px] font-semibold text-[#0FA958] bg-[#005A2B]/30 px-2 py-0.5 rounded border border-[#0FA958]/30">
                Sample Fixtures (Manual Entry Ready)
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
              Upcoming Events &amp; Fixtures
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-xl">
              AFCON international qualifiers, legendary Mashemeji Derbies, athletics grand prix, and live concerts. Sample fixtures loaded; add or edit your own manually anytime in the Admin console.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-[#0d1410] border border-[#1e2c24] self-start md:self-auto">
            <button
              onClick={() => { setFilter('all'); setShowResults(false); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                filter === 'all' && !showResults
                  ? 'bg-[#C5A059] text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Events ({events.length})
            </button>
            <button
              onClick={() => { setFilter('football'); setShowResults(false); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                filter === 'football' && !showResults
                  ? 'bg-[#005A2B] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Football Fixtures
            </button>
            <button
              onClick={() => { setFilter('concerts'); setShowResults(false); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                filter === 'concerts' && !showResults
                  ? 'bg-[#005A2B] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Concerts &amp; Music
            </button>
            <button
              onClick={() => { setFilter('athletics'); setShowResults(false); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                filter === 'athletics' && !showResults
                  ? 'bg-[#005A2B] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Athletics Track
            </button>
            <button
              onClick={() => setShowResults(!showResults)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                showResults
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Match Results
            </button>
          </div>
        </div>

        {/* Results Archive View */}
        {showResults ? (
          <div className="bg-[#0a100c] rounded-2xl border border-[#1e2c24] p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#C5A059]" />
              <span>Historic Stadium Matches &amp; Official Results</span>
            </h3>
            <div className="space-y-4">
              {pastResults.map((res: any) => (
                <div
                  key={res.id}
                  className="p-4 rounded-xl bg-[#060908] border border-[#1c2c22] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider">{res.tournament}</span>
                    <h4 className="text-base font-bold text-white mt-0.5">{res.match}</h4>
                    <p className="text-xs text-slate-400 mt-1">Date: {res.date} · Attendance: {res.attendance} Spectators</p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <span className="text-2xl font-black font-mono text-white px-4 py-2 rounded-lg bg-[#0d1410] border border-[#1e2c24]">
                      {res.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Event Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="group rounded-2xl bg-gradient-to-b from-[#0d1410] to-[#070b09] border border-[#1e2c24] hover:border-[#C5A059]/40 overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Event Image Banner with Scrim */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                  <img
                    src={event.bannerImageUrl}
                    alt={event.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1410] via-transparent to-black/30" />
                  
                  {/* Category Pill Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/75 text-[#E5C378] border border-[#C5A059]/30 backdrop-blur-md">
                      {event.categoryName}
                    </span>
                  </div>

                  {/* Sold percentage indicator */}
                  <div className="absolute bottom-3 right-3 text-right">
                    <span className="text-[10px] font-bold text-white bg-[#005A2B]/90 px-2 py-0.5 rounded border border-[#0FA958]/30">
                      {Math.round((event.ticketsSold / event.totalCapacity) * 100)}% Occupied
                    </span>
                  </div>
                </div>

                {/* Event Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0FA958]">
                      {event.tournamentName}
                    </span>
                    <h3 className="text-lg font-black text-white mt-1 group-hover:text-[#E5C378] transition-colors leading-snug">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {event.shortDescription}
                    </p>
                  </div>

                  <div className="mt-6 space-y-2.5 pt-4 border-t border-[#1c2c22]">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-[#0FA958] shrink-0" />
                      <span>{event.eventDate}</span>
                      <span className="text-slate-600">·</span>
                      <Clock className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                      <span>Kickoff {event.startTime} (Gates {event.gatesOpenTime})</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-[#0FA958] shrink-0" />
                      <span className="truncate">{event.venueName}</span>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="mt-6 pt-4 border-t border-[#1c2c22] flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">From</span>
                      <span className="text-base font-black text-[#E5C378] font-mono">
                        {formatKes(event.minPriceKes)}
                      </span>
                    </div>

                    <button
                      onClick={() => onBookEvent(event)}
                      className="py-2.5 px-4 rounded-xl bg-[#005A2B] hover:bg-[#007036] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#005A2B]/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Book Tickets</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
