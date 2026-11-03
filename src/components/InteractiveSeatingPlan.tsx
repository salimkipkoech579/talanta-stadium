import React, { useState } from 'react';
import type { SeatingSection, EventItem } from '../types';
import { formatKes } from '../utils/qrcode';
import { CheckCircle2, MapPin, Users } from 'lucide-react';

interface InteractiveSeatingPlanProps {
  sections: SeatingSection[];
  onSelectSection: (section: SeatingSection) => void;
  selectedEvent?: EventItem;
}

export const InteractiveSeatingPlan: React.FC<InteractiveSeatingPlanProps> = ({
  sections,
  onSelectSection,
  selectedEvent,
}) => {
  const [activeCode, setActiveCode] = useState<string>('');
  const activeSection = sections.find((section) => section.code === activeCode) || sections[0];

  return (
    <section className="border-t border-slate-200 bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-sm font-semibold text-blue-700">Plan your visit</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Seating and sections</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            {selectedEvent ? `Available sections for ${selectedEvent.title}.` : 'Explore venue sections and ticket information.'}
          </p>
        </div>

        {sections.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <Users className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Seating information unavailable</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              Seating sections and ticket prices have not been published. Please check back when official inventory is available.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="grid gap-3 sm:grid-cols-2">
              {sections.map((section) => (
                <button
                  key={section.code}
                  type="button"
                  onClick={() => setActiveCode(section.code)}
                  aria-pressed={(activeSection?.code || '') === section.code}
                  className={`rounded-xl border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${(activeSection?.code || '') === section.code ? 'border-blue-700 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-400'}`}
                >
                  <span className="block font-semibold text-slate-950">{section.name}</span>
                  <span className="mt-1 block text-sm text-slate-600">{section.standLocation} · {section.tierLevel}</span>
                  <span className="mt-3 block text-sm font-semibold text-blue-800">{formatKes(section.priceKes)}</span>
                  <span className="mt-1 block text-xs text-slate-500">Availability subject to confirmation</span>
                </button>
              ))}
            </div>

            {activeSection && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">{activeSection.tierLevel}</span>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">{activeSection.name}</h3>
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-600"><MapPin className="h-4 w-4" aria-hidden="true" />{activeSection.gateEntrance}</p>
                <p className="mt-4 text-2xl font-semibold text-slate-950">{formatKes(activeSection.priceKes)} <span className="text-sm font-normal text-slate-500">per ticket</span></p>
                {activeSection.amenities.length > 0 && (
                  <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                    {activeSection.amenities.map((amenity) => <li key={amenity} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />{amenity}</li>)}
                  </ul>
                )}
                <button
                  type="button"
                  onClick={() => onSelectSection(activeSection)}
                  className="mt-6 w-full rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  Continue with this section
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
