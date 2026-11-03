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
    <section id="events" className="py-16 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-wider font-bold text-blue-600 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-blue-600" />
                Official Matchday Calendar
              </span>
              <span className="text-gray-400">·</span>
              <span className="text-[11px] font-medium text-gray-500">
                Talanta Sports City
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Upcoming Events &amp; Fixtures
            </h2>
            <p className="mt-2 text-sm text-gray-600 max-w-xl">
              AFCON international qualifiers, legendary Mashemeji Derbies, athletics grand prix, and live concerts. Book tickets instantly with Safaricom M-Pesa.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-gray-100 border border-gray-200 self-start md:self-auto text-xs">
            <button
              onClick={() => { setFilter('all'); setShowResults(false); }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filter === 'all' && !showResults
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Events ({events.length})
            </button>
            <button
              onClick={() => { setFilter('football'); setShowResults(false); }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filter === 'football' && !showResults
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Football Fixtures
            </button>
            <button
              onClick={() => { setFilter('concerts'); setShowResults(false); }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filter === 'concerts' && !showResults
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Concerts &amp; Music
            </button>
            <button
              onClick={() => { setFilter('athletics'); setShowResults(false); }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filter === 'athletics' && !showResults
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Athletics Track
            </button>
            <button
              onClick={() => setShowResults(!showResults)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                showResults
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Match Results
            </button>
          </div>
        </div>

        {/* Results Archive View */}
        {showResults ? (
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-blue-600" />
              <span>Historic Stadium Matches &amp; Official Results</span>
            </h3>
            <div className="space-y-3">
              {pastResults.map((res: any) => (
                <div
                  key={res.id}
                  className="p-4 rounded-xl bg-white border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div>
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">{res.tournament}</span>
                    <h4 className="text-base font-bold text-gray-900 mt-0.5">{res.match}</h4>
                    <p className="text-xs text-gray-500 mt-1">Date: {res.date} · Attendance: {res.attendance} Spectators</p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <span className="text-2xl font-bold font-mono text-gray-900 px-4 py-2 rounded-lg bg-gray-50 border border-gray-300">
                      {res.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Event Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="group rounded-xl bg-white border border-gray-200 hover:border-blue-400 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Event Image Banner */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                  <img
                    src={event.bannerImageUrl}
                    alt={event.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 ease-out"
                  />
                  
                  {/* Category Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-white/95 text-gray-800 shadow-xs border border-gray-200">
                      {event.categoryName}
                    </span>
                  </div>

                  {/* Sold percentage indicator */}
                  <div className="absolute bottom-3 right-3 text-right">
                    <span className="text-[10px] font-semibold text-white bg-blue-600 px-2 py-0.5 rounded shadow-xs">
                      {Math.round((event.ticketsSold / event.totalCapacity) * 100)}% Booked
                    </span>
                  </div>
                </div>

                {/* Event Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                      {event.tournamentName}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mt-1 group-hover:text-blue-600 transition-colors leading-snug">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {event.shortDescription}
                    </p>
                  </div>

                  <div className="mt-5 space-y-2 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{event.eventDate}</span>
                      <span className="text-gray-300">·</span>
                      <Clock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span>Kickoff {event.startTime} (Gates {event.gatesOpenTime})</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{event.venueName}</span>
                    </div>
                  </div>

                  {/* Pricing and Action Button (BLUE) */}
                  <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-medium text-gray-500 block">From</span>
                      <span className="text-base font-bold text-gray-900 font-mono">
                        {formatKes(event.minPriceKes)}
                      </span>
                    </div>

                    <button
                      onClick={() => onBookEvent(event)}
                      className="py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold tracking-wide transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
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
