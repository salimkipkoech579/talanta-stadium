import React from 'react';
import type { RoomItem } from '../types';
import { MapPin } from 'lucide-react';

interface NairobiRoomsSectionProps {
  onSelectRoom: (room: RoomItem) => void;
  onBookRoom: (room: RoomItem) => void;
  onWatchVideo?: (room: RoomItem) => void;
}

/** Listings are intentionally absent until verified accommodation inventory is connected. */
export const NairobiRoomsSection: React.FC<NairobiRoomsSectionProps> = () => (
  <section id="nairobi-rooms" className="border-t border-slate-200 bg-white py-16">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold text-blue-700">Plan your stay</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Accommodation near the venue</h2>
        <p className="mt-3 text-base leading-7 text-slate-600">We’ll share nearby stay options here when verified listings are available.</p>
      </div>
      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <MapPin className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
        <h3 className="mt-4 text-lg font-semibold text-slate-900">No accommodation listings yet</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">Listings, rates and availability will appear once they can be confirmed with accommodation providers.</p>
      </div>
    </div>
  </section>
);
