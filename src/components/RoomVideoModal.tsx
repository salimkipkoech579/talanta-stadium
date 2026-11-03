import React, { useRef, useState, useEffect } from 'react';
import { RoomItem } from '../types';
import { formatKes } from '../utils/qrcode';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';

interface RoomVideoModalProps {
  room: RoomItem;
  allRooms: RoomItem[];
  onClose: () => void;
  onBookNow: (room: RoomItem) => void;
  onViewDetails: (room: RoomItem) => void;
  onSwitchRoom: (room: RoomItem) => void;
}

export const RoomVideoModal: React.FC<RoomVideoModalProps> = ({
  room,
  allRooms,
  onClose,
  onBookNow,
  onViewDetails,
  onSwitchRoom,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState<boolean>(false);

  // Find index for next/prev navigation
  const currentIndex = allRooms.findIndex((r) => r.id === room.id);
  const prevRoom = currentIndex > 0 ? allRooms[currentIndex - 1] : allRooms[allRooms.length - 1];
  const nextRoom = currentIndex < allRooms.length - 1 ? allRooms[currentIndex + 1] : allRooms[0];

  useEffect(() => {
    // Reset video state when room changes
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasStartedPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  }, [room.id]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      setHasStartedPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().catch((err) => {
        console.error('Fullscreen request failed:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col text-gray-700">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              HD Video Tour · {room.videoDuration || '1:15 HD'}
            </span>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{room.hotelName} ({room.neighborhood})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Tour Navigation */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <button
                type="button"
                onClick={() => onSwitchRoom(prevRoom)}
                title={`Previous Tour: ${prevRoom.roomName}`}
                className="p-1.5 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-medium text-gray-500 border-x border-gray-200">
                {currentIndex + 1} / {allRooms.length}
              </span>
              <button
                type="button"
                onClick={() => onSwitchRoom(nextRoom)}
                title={`Next Tour: ${nextRoom.roomName}`}
                className="p-1.5 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close Tour"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Canvas Container */}
        <div className="relative bg-black w-full aspect-video sm:max-h-[58vh] overflow-hidden select-none flex items-center justify-center">
          <video
            ref={videoRef}
            src={room.videoUrl || '/videos/nairobi_presidential_suite_tour.mp4'}
            poster={room.imageUrl}
            loop
            playsInline
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay}
            className="w-full h-full object-cover cursor-pointer"
          />

          {/* Central Play/Pause Watermark Overlay when paused */}
          {!isPlaying && (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl hover:bg-blue-600 hover:scale-105 transition-all cursor-pointer"
              aria-label="Play video"
            >
              <Play className="w-8 h-8 fill-white ml-1" />
            </button>
          )}

          {/* Overlay Badge Top Left */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none">
            <span className="bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md font-medium border border-white/10 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              {room.spaceCategory}
            </span>
            <span className="bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md font-medium border border-white/10">
              {room.floorAreaSqM} m² Private Space
            </span>
          </div>

          {/* Custom Player Controls Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 flex flex-col gap-2">
            {/* Scrubber */}
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Bottom Row Controls */}
            <div className="flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span className="text-[11px] opacity-80">{isMuted ? 'Muted' : 'Sound On'}</span>
                </button>

                <span className="text-[11px] opacity-75 font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-[11px] font-semibold text-blue-300">
                  1080p Ultra HD Walkthrough
                </span>
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                  aria-label="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Room Info, Highlights & Booking Footer */}
        <div className="p-5 bg-white border-t border-gray-200 overflow-y-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            
            {/* Left: Room & Tour Specs */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  {room.roomName}
                </h3>
                <span className="text-gray-400">·</span>
                <span className="font-semibold text-gray-800">{room.hotelName}</span>
                <div className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span className="font-bold">{room.rating}</span>
                  <span className="text-gray-500">({room.reviewsCount})</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{room.address}</span>
                <span className="text-gray-300">|</span>
                <span className="text-blue-700 font-medium">{room.distanceToTalanta} to Talanta Stadium</span>
              </p>

              {/* Video Tour Highlights */}
              {room.videoHighlights && room.videoHighlights.length > 0 && (
                <div className="pt-1 flex flex-wrap gap-1.5 items-center">
                  <span className="text-xs font-semibold text-gray-500 mr-1">Tour Highlights:</span>
                  {room.videoHighlights.map((hl, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                    >
                      <CheckCircle2 className="w-3 h-3 text-blue-600" />
                      {hl}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Price & Call to Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100">
              <div>
                <div className="text-xs text-gray-500 text-left lg:text-right">Price per night</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">{formatKes(room.pricePerNightKes)}</span>
                  <span className="text-xs text-gray-500 font-normal">/ night</span>
                </div>
                <div className="text-[11px] text-gray-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                  <span>Includes VIP matchday stadium shuttle</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => onViewDetails(room)}
                  className="px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer shrink-0"
                >
                  Full Specs &amp; Photos
                </button>

                <button
                  type="button"
                  onClick={() => onBookNow(room)}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm shadow-xs transition-colors cursor-pointer text-center"
                >
                  Book This Room
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
