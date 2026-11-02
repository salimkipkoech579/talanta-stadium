import React from 'react';
import { AnnouncementItem } from '../types';
import { Info, AlertTriangle, ShieldCheck } from 'lucide-react';

interface MarqueeAlertProps {
  announcements: AnnouncementItem[];
}

export const MarqueeAlert: React.FC<MarqueeAlertProps> = ({ announcements }) => {
  if (!announcements || announcements.length === 0) return null;

  return (
    <div className="bg-[#0a120d] border-b border-[#1c2c22] py-2 px-4 overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0FA958]"></span>
          </span>
          <span className="font-bold text-[#E5C378] uppercase tracking-wider text-[11px]">
            Matchday Notice:
          </span>
        </div>

        <div className="flex-1 overflow-x-auto no-scrollbar whitespace-nowrap text-slate-300 font-medium">
          {announcements.map((ann, idx) => (
            <span key={ann.id} className="inline-flex items-center gap-2 mr-8">
              {ann.severity === 'warning' ? (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 inline" />
              ) : (
                <Info className="w-3.5 h-3.5 text-[#0FA958] shrink-0 inline" />
              )}
              <span>{ann.headline}</span>
              {idx < announcements.length - 1 && <span className="text-slate-600 ml-4">·</span>}
            </span>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-400 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0FA958]" />
          <span>Safaricom M-Pesa Verified</span>
        </div>
      </div>
    </div>
  );
};
