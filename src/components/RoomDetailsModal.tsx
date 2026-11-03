import React, { useState } from 'react';
import { RoomItem } from '../types';
import { formatKes } from '../utils/qrcode';
import { X, Check, MapPin, Car, ShieldCheck, Star, Users, Maximize2, Coffee, Sparkles } from 'lucide-react';

interface RoomDetailsModalProps {
  room: RoomItem;
  onClose: () => void;
  onBookNow: (room: RoomItem) => void;
}

export const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({
  room,
  onClose,
  onBookNow,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string>(room.imageUrl);
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'video'>('photos');
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="relative w-full max-w-3xl rounded-xl bg-white border border-gray-200 shadow-2xl overflow-hidden text-gray-800 my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 block">
              {room.neighborhood} · Classic Nairobi Space
            </span>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-0.5">
              {room.roomName} — {room.hotelName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Media Switcher Tabs: Photos vs Video Tour */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('photos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeMediaTab === 'photos'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>High-Res Photos ({room.galleryUrls ? room.galleryUrls.length : 1})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('video')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeMediaTab === 'video'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-blue-700 bg-blue-50/60 hover:bg-blue-100/70 border border-blue-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>Room Video Tour · {room.videoDuration || '1:15 HD'}</span>
                </button>
              </div>

              {activeMediaTab === 'video' && (
                <button
                  type="button"
                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                  className="text-xs text-gray-500 hover:text-gray-900 cursor-pointer underline"
                >
                  {isVideoMuted ? 'Unmute Sound' : 'Mute Sound'}
                </button>
              )}
            </div>

            {/* Video View */}
            {activeMediaTab === 'video' ? (
              <div className="space-y-2">
                <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-gray-200 bg-black flex items-center justify-center">
                  <video
                    src={room.videoUrl || '/videos/nairobi_presidential_suite_tour.mp4'}
                    poster={room.imageUrl}
                    controls
                    autoPlay
                    loop
                    playsInline
                    muted={isVideoMuted}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded text-xs font-semibold border border-white/20">
                    HD Video Walkthrough
                  </div>
                </div>

                {room.videoHighlights && room.videoHighlights.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                    <span className="font-semibold text-gray-800">Featured in Video:</span>
                    {room.videoHighlights.map((hl, i) => (
                      <span key={i} className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-700 text-[11px]">
                        <Check className="w-3 h-3 text-blue-600" />
                        {hl}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Photos View */
              <div className="space-y-3">
                <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                  <img
                    src={selectedPhoto}
                    alt={room.roomName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-xs font-semibold text-gray-900 border border-gray-200 shadow-xs">
                    {room.spaceCategory}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm text-xs flex items-center gap-1.5 font-medium text-gray-900">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    <span className="font-bold">{room.rating}</span>
                    <span className="text-gray-500">({room.reviewsCount} reviews)</span>
                  </div>
                </div>

                {/* Gallery Thumbnails if multiple exist */}
                {room.galleryUrls && room.galleryUrls.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {room.galleryUrls.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedPhoto(url)}
                        className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          selectedPhoto === url ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700">
            <div>
              <span className="text-gray-500 block mb-0.5">Classic Space</span>
              <div className="flex items-center gap-1.5 font-bold text-gray-900">
                <Maximize2 className="w-4 h-4 text-blue-600" />
                <span>{room.floorAreaSqM} m² ({Math.round(room.floorAreaSqM * 10.764)} sq ft)</span>
              </div>
            </div>

            <div>
              <span className="text-gray-500 block mb-0.5">Bedding</span>
              <div className="flex items-center gap-1.5 font-bold text-gray-900 truncate">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="truncate">{room.bedConfig}</span>
              </div>
            </div>

            <div>
              <span className="text-gray-500 block mb-0.5">Max Guests</span>
              <div className="flex items-center gap-1.5 font-bold text-gray-900">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Up to {room.guestCapacity} Adults</span>
              </div>
            </div>

            <div>
              <span className="text-gray-500 block mb-0.5">To Talanta Stadium</span>
              <div className="flex items-center gap-1.5 font-bold text-gray-900">
                <Car className="w-4 h-4 text-blue-600" />
                <span>{room.distanceToTalanta}</span>
              </div>
            </div>
          </div>

          {/* Location & Address Callout */}
          <div className="p-3.5 rounded-lg border border-blue-100 bg-blue-50/60 flex items-start gap-2.5 text-xs text-gray-700">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-gray-900 block">{room.hotelName} — {room.address}</span>
              <span className="text-gray-600">
                Strategic location in {room.neighborhood}, Nairobi. Fast access to Talanta Stadium and Nairobi attractions.
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-1.5">
              About This Classic Space
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {room.shortDescription}
            </p>
          </div>

          {/* Classic Features & Amenities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2.5">
              Classic Suite Features &amp; Inclusions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
              {room.classicFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Matchday Transfer Notice */}
          {room.matchdayShuttleIncluded && (
            <div className="p-3.5 rounded-lg bg-green-50 border border-green-200 text-xs text-green-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
              <span>
                <strong>Complimentary Matchday Express Shuttle:</strong> This property provides hotel-to-gate chauffeured transfers directly to Talanta Stadium for ticket holders.
              </span>
            </div>
          )}

          {/* Terms & Cancellation Policy */}
          <div className="pt-2 text-xs text-gray-500 border-t border-gray-100">
            <p><strong>Cancellation:</strong> {room.cancellationPolicy}. Government Tourism Levy (2%) included in breakdown.</p>
          </div>

        </div>

        {/* Footer Bar with Price & Book CTA */}
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-xs text-gray-500 block">Price per night</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-blue-600">{formatKes(room.pricePerNightKes)}</span>
              <span className="text-xs text-gray-500">/ night</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onBookNow(room)}
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            >
              Book This Room
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
