import React, { useState, useMemo } from 'react';
import { RoomItem, NairobiNeighborhood, RoomSpaceCategory } from '../types';
import { NAIROBI_ROOMS } from '../constants/nairobiRooms';
import { formatKes } from '../utils/qrcode';
import {
  Search,
  MapPin,
  Star,
  Maximize2,
  Users,
  Car,
  Check,
  SlidersHorizontal,
  ArrowUpDown,
  ShieldCheck,
  Video,
  Play,
  Sparkles,
  Film
} from 'lucide-react';

interface NairobiRoomsSectionProps {
  onSelectRoom: (room: RoomItem) => void;
  onBookRoom: (room: RoomItem) => void;
  onWatchVideo?: (room: RoomItem) => void;
}

export const NairobiRoomsSection: React.FC<NairobiRoomsSectionProps> = ({
  onSelectRoom,
  onBookRoom,
  onWatchVideo,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'rating' | 'distance' | 'space'>('recommended');
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [videoOnly, setVideoOnly] = useState<boolean>(false);

  const neighborhoods: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'All Nairobi (50)', count: NAIROBI_ROOMS.length },
    { id: 'Karen', label: 'Karen & Langata (Closest)', count: NAIROBI_ROOMS.filter(r => r.neighborhood === 'Karen').length },
    { id: 'Westlands', label: 'Westlands & GTC', count: NAIROBI_ROOMS.filter(r => r.neighborhood === 'Westlands').length },
    { id: 'Kilimani', label: 'Kilimani & Hurlingham', count: NAIROBI_ROOMS.filter(r => r.neighborhood === 'Kilimani').length },
    { id: 'Upper Hill', label: 'Upper Hill Diplomatic', count: NAIROBI_ROOMS.filter(r => r.neighborhood === 'Upper Hill').length },
    { id: 'CBD', label: 'Historic CBD Landmarks', count: NAIROBI_ROOMS.filter(r => r.neighborhood === 'CBD').length },
    { id: 'Gigiri', label: 'Gigiri & Karura', count: NAIROBI_ROOMS.filter(r => r.neighborhood === 'Gigiri').length },
    { id: 'National Park Border', label: 'National Park Verge', count: NAIROBI_ROOMS.filter(r => r.neighborhood === 'National Park Border').length },
  ];

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Space Tiers' },
    { id: 'Presidential & Skybox', label: 'Presidential & Penthouses' },
    { id: 'Executive Classic', label: 'Executive Classic' },
    { id: 'Boutique Heritage', label: 'Boutique Heritage' },
    { id: 'Panoramic Suite', label: 'Panoramic Suites' },
    { id: 'Luxury Lodge', label: 'Safari Lodges' },
  ];

  const filteredRooms = useMemo(() => {
    let list = [...NAIROBI_ROOMS];

    // Neighborhood filter
    if (selectedNeighborhood !== 'all') {
      list = list.filter(r => r.neighborhood === selectedNeighborhood);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter(r => r.spaceCategory === selectedCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(r =>
        r.hotelName.toLowerCase().includes(q) ||
        r.roomName.toLowerCase().includes(q) ||
        r.neighborhood.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q) ||
        r.classicFeatures.some(f => f.toLowerCase().includes(q))
      );
    }

    // Video only filter
    if (videoOnly) {
      list = list.filter(r => !!r.videoUrl);
    }

    // Sort
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.pricePerNightKes - b.pricePerNightKes);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.pricePerNightKes - a.pricePerNightKes);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'distance') {
      list.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sortBy === 'space') {
      list.sort((a, b) => b.floorAreaSqM - a.floorAreaSqM);
    }

    return list;
  }, [selectedNeighborhood, selectedCategory, searchQuery, sortBy, videoOnly]);

  const displayedRooms = filteredRooms.slice(0, visibleCount);

  return (
    <section id="nairobi-rooms" className="py-16 bg-white border-t border-gray-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 flex-wrap text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
              <span>Nairobi Accommodation &amp; Hospitality Directory</span>
              <span aria-hidden="true">·</span>
              <span>50 Verified Classic Spaces</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 lowercase">
                <Video className="w-3 h-3 text-blue-600" />
                <span>HD room videos included</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              50 Best Classic Rooms &amp; Suites in Nairobi
            </h2>
            <p className="text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
              Curated collection of premier hotel rooms, presidential suites, and boutique spaces across Nairobi, each featuring an individual HD video walkthrough, verified dimensions, and direct matchday VIP shuttle to Talanta Stadium.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900">
              <span className="font-bold block text-sm text-blue-700">50 Classic Spaces</span>
              <span className="text-gray-600">With Virtual Video Tours</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 mb-8 space-y-4">
          
          {/* Search and Sort controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by hotel name, neighborhood (Karen, Westlands), or amenity..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <div className="relative w-full">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-700 font-medium focus:outline-none focus:border-blue-600"
                >
                  <option value="recommended">Sort: Recommended</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Guest Rating</option>
                  <option value="distance">Closest to Talanta Stadium</option>
                  <option value="space">Largest Classic Space (m²)</option>
                </select>
              </div>

              <div className="relative w-full">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-700 font-medium focus:outline-none focus:border-blue-600"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Video Tour Quick Filter Toggle */}
              <button
                type="button"
                onClick={() => setVideoOnly(!videoOnly)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  videoOnly
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                title="Filter rooms with HD virtual video walkthroughs"
              >
                <Film className="w-3.5 h-3.5" />
                <span className="hidden md:inline">HD Video Tours</span>
                <span className="md:hidden">Videos</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${videoOnly ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  50
                </span>
              </button>
            </div>
          </div>

          {/* Neighborhood Segmented Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-gray-500 font-medium mr-1 shrink-0">Neighborhood:</span>
            {neighborhoods.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setSelectedNeighborhood(n.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer font-medium ${
                  selectedNeighborhood === n.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>

          {/* Results Counter and Active Filter Notice */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-200">
            <span>
              Showing <strong className="text-gray-900">{filteredRooms.length}</strong> of 50 Classic Spaces in Nairobi
            </span>
            <div className="flex items-center gap-1.5 text-gray-600">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
              <span>Real-time availability · Verified Kenyan rates (KES)</span>
            </div>
          </div>

        </div>

        {/* Room Cards Grid */}
        {displayedRooms.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-sm font-semibold text-gray-700">No rooms match your filter criteria.</p>
            <p className="text-xs text-gray-500 mt-1">Try resetting the search terms or neighborhood filter.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedNeighborhood('all'); setSelectedCategory('all'); }}
              className="mt-3 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-pointer shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedRooms.map((room) => (
              <div
                key={room.id}
                className="rounded-xl bg-white border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                <div>
                  
                  {/* Photo Container */}
                  <div className="relative w-full h-52 bg-gray-100 overflow-hidden">
                    <img
                      src={room.imageUrl}
                      alt={room.roomName}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded text-[11px] font-semibold text-gray-900 border border-gray-200 shadow-xs">
                      {room.spaceCategory}
                    </div>

                    {/* Interactive Video Tour Button Badge on Image */}
                    {room.videoUrl && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onWatchVideo) onWatchVideo(room);
                          else onSelectRoom(room);
                        }}
                        title={`Watch Video Tour of ${room.roomName}`}
                        className="absolute bottom-2.5 left-2.5 bg-gray-900/90 hover:bg-blue-600 text-white backdrop-blur-sm px-2.5 py-1 rounded text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer z-10"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Video Tour ({room.videoDuration || '1:15'})</span>
                      </button>
                    )}

                    <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-900 border border-gray-200 shadow-xs flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{room.rating}</span>
                      <span className="text-gray-500 font-normal text-[10px]">({room.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-3">
                    
                    {/* Hotel Title & Location */}
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{room.neighborhood}, Nairobi</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-gray-600 font-semibold">{room.distanceToTalanta} to Stadium</span>
                      </div>
                      
                      <h3 className="text-base font-bold text-gray-900 tracking-tight mt-1 line-clamp-1">
                        {room.hotelName}
                      </h3>
                      <p className="text-xs font-medium text-blue-700 line-clamp-1">
                        {room.roomName}
                      </p>
                    </div>

                    {/* Classic Space Metrics */}
                    <div className="flex items-center gap-3 text-xs text-gray-600 py-1.5 border-y border-gray-100">
                      <div className="flex items-center gap-1 font-semibold text-gray-900">
                        <Maximize2 className="w-3.5 h-3.5 text-gray-500" />
                        <span>{room.floorAreaSqM} m²</span>
                      </div>
                      <span aria-hidden="true">·</span>
                      <div className="flex items-center gap-1 truncate">
                        <Users className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span className="truncate">{room.bedConfig.split('+')[0]}</span>
                      </div>
                    </div>

                    {/* Features snippet */}
                    <ul className="space-y-1 text-xs text-gray-600">
                      {room.classicFeatures.slice(0, 2).map((feat, i) => (
                        <li key={i} className="flex items-center gap-1.5 line-clamp-1">
                          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>

                  </div>

                </div>

                {/* Card Footer: Price & CTA */}
                <div className="p-4 pt-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">
                      Price per night
                    </span>
                    <span className="text-base font-bold text-blue-600 font-mono">
                      {formatKes(room.pricePerNightKes)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {room.videoUrl && (
                      <button
                        type="button"
                        onClick={() => (onWatchVideo ? onWatchVideo(room) : onSelectRoom(room))}
                        title="Watch Room Video Tour"
                        className="px-2.5 py-2 rounded-lg border border-blue-200 bg-blue-50 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Video className="w-3.5 h-3.5 text-blue-600" />
                        <span className="hidden sm:inline">Tour</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onSelectRoom(room)}
                      className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => onBookRoom(room)}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                    >
                      Book Room
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Load More Button if filteredRooms > visibleCount */}
        {filteredRooms.length > visibleCount && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount(prev => Math.min(prev + 12, filteredRooms.length))}
              className="px-6 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <span>Show More Classic Rooms ({filteredRooms.length - visibleCount} remaining)</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
