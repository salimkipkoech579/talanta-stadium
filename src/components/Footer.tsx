import React from 'react';
import { MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

const footerLinks = [
  { id: 'events', label: 'Events' },
  { id: 'seating', label: 'Seating plan' },
  { id: 'rooms', label: 'Nearby stays' },
  { id: 'facilities', label: 'Venue facilities' },
  { id: 'news', label: 'News and updates' },
  { id: 'contact', label: 'Location' },
];

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 text-gray-600">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left"
            aria-label="Talanta Stadium home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-sm font-bold text-white">
              TS
            </span>
            <span>
              <span className="block text-base font-semibold tracking-tight text-gray-950">Talanta Stadium</span>
              <span className="block text-sm text-gray-500">Nairobi, Kenya</span>
            </span>
          </button>
          <p className="max-w-sm text-sm leading-6">
            Your guide to events, tickets and visitor information at Talanta Stadium.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="mb-4 text-sm font-semibold text-gray-950">Explore</h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {footerLinks.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(link.id)}
                  className="transition-colors hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-gray-950">Visit</h2>
          <p className="flex items-start gap-2 text-sm leading-6">
            <MapPin className="mt-1 h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />
            <span>Nairobi, Kenya</span>
          </p>
          <p className="mt-4 text-xs leading-5 text-gray-500">
            Event schedules, ticket availability and venue information may change. Please confirm details with the event organiser before travelling.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Talanta Stadium. All rights reserved.</p>
          <p>Nairobi, Kenya</p>
        </div>
      </div>
    </footer>
  );
};
