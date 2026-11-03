import React, { useState } from 'react';
import type { EventItem } from '../types';
import { formatKes } from '../utils/qrcode';
import { ArrowRight, CalendarDays, Clock3, Eye, MapPin, Ticket } from 'lucide-react';

interface HeroSectionProps {
  featuredEvent?: EventItem;
  onBookEvent: (event: EventItem) => void;
  onExploreSeating: () => void;
  onViewEvents: () => void;
}

const heroImages = [
  { label: 'Exterior', src: '/assets/aistudio/images__23__66d33c9b.jpeg' },
  { label: 'Evening', src: '/assets/aistudio/images__12__cd65bb66.jpeg' },
  { label: 'Stadium bowl', src: '/assets/aistudio/images__13__09ed1a8f.jpeg' },
];

const formatEventDate = (value: string) => {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredEvent,
  onBookEvent,
  onExploreSeating,
  onViewEvents,
}) => {
  const [imageIndex, setImageIndex] = useState(0);
  const image = heroImages[imageIndex];

  return (
    <section className="relative isolate flex min-h-[620px] items-center overflow-hidden bg-slate-950 text-white sm:min-h-[680px]">
      <img
        src={image.src}
        alt="Talanta Stadium in Nairobi"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20" />

      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-8 lg:py-24">
        <div className="lg:col-span-7">
          <p className="mb-5 text-sm font-semibold tracking-wide text-blue-200">Talanta Stadium · Nairobi, Kenya</p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            A place for sport, culture and live experiences.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            Find event information, explore the venue and plan your visit to Talanta Stadium.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onViewEvents}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Browse events <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onExploreSeating}
              className="inline-flex items-center justify-center rounded-lg border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explore seating
            </button>
          </div>
          <div className="mt-8 flex flex-wrap gap-2" aria-label="Stadium photographs">
            {heroImages.map((item, index) => (
              <button
                key={item.label}
                type="button"
                aria-pressed={imageIndex === index}
                aria-label={`Show ${item.label} photograph`}
                onClick={() => setImageIndex(index)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  imageIndex === index ? 'border-white bg-white text-slate-950' : 'border-white/40 bg-slate-950/40 text-white hover:bg-white/15'
                }`}
              >
                {index === 0 && <Eye className="h-3.5 w-3.5" aria-hidden="true" />}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {featuredEvent && (
          <aside className="rounded-2xl border border-white/20 bg-white p-6 text-slate-900 shadow-2xl lg:col-span-5" aria-label="Featured event">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">Featured event</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{featuredEvent.categoryName}</span>
            </div>
            <h2 className="mt-5 text-xl font-semibold leading-snug sm:text-2xl">{featuredEvent.title}</h2>
            {featuredEvent.shortDescription && <p className="mt-2 text-sm leading-6 text-slate-600">{featuredEvent.shortDescription}</p>}
            <dl className="mt-5 space-y-3 border-t border-slate-200 pt-5 text-sm">
              <div className="flex items-center gap-3 text-slate-700">
                <CalendarDays className="h-4 w-4 text-blue-700" aria-hidden="true" />
                <dt className="sr-only">Date</dt><dd>{formatEventDate(featuredEvent.eventDate)}</dd>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Clock3 className="h-4 w-4 text-blue-700" aria-hidden="true" />
                <dt className="sr-only">Start time</dt><dd>{featuredEvent.startTime} EAT</dd>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <MapPin className="h-4 w-4 text-blue-700" aria-hidden="true" />
                <dt className="sr-only">Venue</dt><dd>{featuredEvent.venueName}</dd>
              </div>
            </dl>
            <div className="mt-6 flex items-center justify-between gap-4">
              <div><p className="text-xs text-slate-500">Tickets from</p><p className="mt-0.5 font-semibold">{formatKes(featuredEvent.minPriceKes)}</p></div>
              <button
                type="button"
                onClick={() => onBookEvent(featuredEvent)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                <Ticket className="h-4 w-4" aria-hidden="true" /> View tickets
              </button>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
};
