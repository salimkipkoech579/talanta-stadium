import React from 'react';
import { AnnouncementItem } from '../types';
import { Info, AlertTriangle, ShieldCheck } from 'lucide-react';

interface MarqueeAlertProps {
  announcements: AnnouncementItem[];
}

export const MarqueeAlert: React.FC<MarqueeAlertProps> = ({ announcements }) => {
  if (!announcements || announcements.length === 0) return null;

  return (
    <div className="bg-blue-50 border-b border-blue-100 py-2.5 px-4 overflow-hidden relative text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-blue-900 uppercase tracking-wider text-[11px] bg-blue-100 px-2 py-0.5 rounded">
            Matchday Notice
          </span>
        </div>

        <div className="flex-1 overflow-x-auto no-scrollbar whitespace-nowrap text-gray-700 font-medium">
          {announcements.map((ann, idx) => (
            <span key={ann.id} className="inline-flex items-center gap-2 mr-8">
              {ann.severity === 'warning' ? (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 inline" />
              ) : (
                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 inline" />
              )}
              <span>{ann.headline}</span>
              {idx < announcements.length - 1 && <span className="text-gray-400 ml-4">·</span>}
            </span>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-[11px] text-gray-500 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Safaricom M-Pesa Verified Ticketing</span>
        </div>
      </div>
    </div>
  );
};
