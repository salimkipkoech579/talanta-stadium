import React, { useMemo, useState } from 'react';
import type { EventItem } from '../types';
import { formatKes } from '../utils/qrcode';
import { CalendarDays, Clock3, MapPin, Ticket } from 'lucide-react';

interface EventsSectionProps {
  events: EventItem[];
  onBookEvent: (event: EventItem) => void;
  pastResults?: any[];
}

const formatEventDate = (value: string) => {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('en-KE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};

export const EventsSection: React.FC<EventsSectionProps> = ({ events, onBookEvent }) => {
  const [filter, setFilter] = useState('all');
  const categories = useMemo(() => {
    const unique = new Map<string, string>();
    events.forEach((event) => unique.set(event.categoryId, event.categoryName));
    return [...unique.entries()];
  }, [events]);
  const filteredEvents = filter === 'all' ? events : events.filter((event) => event.categoryId === filter);

  return (
    <section id="events" className="border-t border-slate-200 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold text-blue-700">Plan your visit</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Events at Talanta Stadium</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">Browse the event schedule and check the details provided by each organiser.</p>
        </div>

        {categories.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-2" aria-label="Filter events by category">
            {[['all', 'All events'] as [string, string], ...categories].map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={filter === id}
                onClick={() => setFilter(id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                  filter === id ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {filteredEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
            <CalendarDays className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No events to display</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">There are no events listed at the moment. Please check back for schedule updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <article key={event.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                  {event.bannerImageUrl ? (
                    <img src={event.bannerImageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                  ) : <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200" aria-hidden="true" />}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">{event.categoryName}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{event.status}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold leading-snug text-slate-950">{event.title}</h3>
                  {event.shortDescription && <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{event.shortDescription}</p>}
                  <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                    <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />{formatEventDate(event.eventDate)}</p>
                    <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />{event.startTime} EAT</p>
                    <p className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />{event.venueName}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div><p className="text-xs text-slate-500">Tickets from</p><p className="font-semibold text-slate-950">{formatKes(event.minPriceKes)}</p></div>
                    <button
                      type="button"
                      onClick={() => onBookEvent(event)}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    >
                      <Ticket className="h-4 w-4" aria-hidden="true" /> Tickets
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
