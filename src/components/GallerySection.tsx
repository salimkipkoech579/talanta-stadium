import React, { useState } from 'react';
import { Camera, Maximize2, X, Sparkles, Filter, Play, Video } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const [activeImage, setActiveImage] = useState<any | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<string>('all');

  const galleryItems = [
    {
      id: 'gal_video_01',
      title: 'Talanta Stadium Official Drone Flythrough Video',
      category: 'video',
      src: '/assets/aistudio/images__23__66d33c9b.jpeg',
      isVideo: true,
      youtubeId: '6XZMqvT1wgA',
      caption: 'Full 4K aerial drone flight showcasing the 60,000-seater Talanta Stadium, Maasai shield diagrid exterior, hybrid pitch, and sports city transit link.',
    },
    {
      id: 'gal_01',
      title: 'Talanta Stadium Daytime Aerial & Maasai Shields',
      category: 'aerial',
      src: '/assets/aistudio/images__23__66d33c9b.jpeg',
      caption: 'Spectacular aerial view of the completed 60,000-seat Talanta Stadium with red Maasai shields on the white woven diagrid facade.',
    },
    {
      id: 'gal_02',
      title: 'Night Illumination & Floodlight Showcase',
      category: 'night',
      src: '/assets/aistudio/images__12__cd65bb66.jpeg',
      caption: 'The stadium illuminated against the Nairobi night sky with glowing Maasai emblems and vibrant green pitch floodlighting.',
    },
    {
      id: 'gal_03',
      title: '60,000-Seat Interior Bowl & Hybrid Turf',
      category: 'interior',
      src: '/assets/aistudio/images__13__09ed1a8f.jpeg',
      caption: 'Panoramic view from the grandstand showing pristine natural hybrid turf, multi-tier seating in national colors, and aerodynamic canopy.',
    },
    {
      id: 'gal_04',
      title: 'Maasai Shield Facade & Ground Plaza',
      category: 'facade',
      src: '/assets/aistudio/images__7__974ef065.jpeg',
      caption: 'Close-up architectural view of the giant Maasai warrior shield and crossed spears embedded into the steel diagrid structure.',
    },
    {
      id: 'gal_05',
      title: 'Daylight Diagrid Lattice & Clear Blue Skies',
      category: 'aerial',
      src: '/assets/aistudio/images__18__b0a77f48.jpeg',
      caption: 'Wide-angle landscape showing the sweeping architectural roof line and surrounding Sports City precinct in Nairobi.',
    },
    {
      id: 'gal_06',
      title: 'Night Concourse & Radiating LED Array',
      category: 'night',
      src: '/assets/aistudio/images__14__56735a72.jpeg',
      caption: 'Luminous evening shot of the stadium facade with full LED perimeter boundary lights active.',
    },
    {
      id: 'gal_07',
      title: 'Skyline Interior & Roof Canopy Framework',
      category: 'interior',
      src: '/assets/aistudio/images__11__95b13633.jpeg',
      caption: 'Low-angle view looking through the oval roof opening into the Nairobi sky, highlighting acoustic membrane technology.',
    },
    {
      id: 'gal_08',
      title: 'Official Stadium Scale Model & Athletics Track',
      category: 'masterplan',
      src: '/assets/aistudio/images__2__359d4adf.jpeg',
      caption: 'Comprehensive masterplan model of Talanta Sports City including the main stadium, secondary running track, and fan plazas.',
    },
    {
      id: 'gal_09',
      title: 'Grand Opening Announcement: Bayern vs Ajax',
      category: 'milestones',
      src: '/assets/aistudio/Screenshot_20261101-192730_fc987783.jpg',
      caption: 'Historic announcement: Kenya will open the 60,000-capacity Talanta Stadium with FC Bayern Munich vs AFC Ajax on January 5th, 2027.',
    },
    {
      id: 'gal_10',
      title: 'Multi-Perspective Architectural Quad',
      category: 'facade',
      src: '/assets/aistudio/images__10__2fa6bda6.jpeg',
      caption: 'Quad panel display showcasing the exterior facade, pitchside bowl, executive VIP skybox lounge, and night aerial glow.',
    },
    {
      id: 'gal_11',
      title: 'Presidential & Delegation Site Inspection',
      category: 'milestones',
      src: '/assets/aistudio/images__6__3951917d.jpeg',
      caption: 'Engineers, architectural consultants, and sports ministry officials reviewing technical progress and automated turnstile zones.',
    },
    {
      id: 'gal_12',
      title: 'Lattice Facade Ground Level Perspective',
      category: 'facade',
      src: '/assets/aistudio/images__8__2e0dc3e0.jpeg',
      caption: 'Ground-level view of the pedestrian promenade, landscaping, and the soaring perimeter structural ring.',
    },
  ];

  const filteredItems = galleryItems.filter((item) => {
    if (galleryFilter === 'all') return true;
    return item.category === galleryFilter;
  });

  return (
    <section className="py-16 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-blue-600 flex items-center gap-1.5 mb-2">
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              Official Photographic Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Talanta Stadium Gallery
            </h2>
            <p className="mt-2 text-sm text-gray-600 max-w-xl">
              Authentic previews of Talanta Sports City (Raila Amolo Odinga International Stadium) — capturing the Maasai shield facade, pitch bowl, night illumination, and construction milestones.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-gray-100 border border-gray-200 text-xs">
            <button
              onClick={() => setGalleryFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                galleryFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Photos ({galleryItems.length})
            </button>
            <button
              onClick={() => setGalleryFilter('video')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                galleryFilter === 'video'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Play className="w-3 h-3 fill-current text-white" />
              <span>Video Tours</span>
            </button>
            <button
              onClick={() => setGalleryFilter('aerial')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                galleryFilter === 'aerial'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Aerial Views
            </button>
            <button
              onClick={() => setGalleryFilter('night')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                galleryFilter === 'night'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Night Lights
            </button>
            <button
              onClick={() => setGalleryFilter('interior')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                galleryFilter === 'interior'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pitch &amp; Bowl
            </button>
            <button
              onClick={() => setGalleryFilter('facade')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                galleryFilter === 'facade'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Maasai Shield
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer shadow-xs hover:border-blue-500 hover:shadow-md transition-all duration-300"
            >
              <img
                src={item.src}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300 ease-out"
              />

              {/* Centered play icon for video items */}
              {item.isVideo && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                  {item.category.toUpperCase()}
                </span>
                <p className="text-xs font-bold text-white mt-0.5 line-clamp-1">{item.title}</p>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-200">
                  {item.isVideo ? (
                    <>
                      <Play className="w-3 h-3 text-white fill-current" />
                      <span>Click to play video</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3 h-3 text-blue-300" />
                      <span>Click to view in 4K</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute -top-10 right-0 p-1 text-white hover:text-gray-300 cursor-pointer flex items-center gap-1 text-xs font-medium"
            >
              <span>Close</span>
              <X className="w-5 h-5" />
            </button>
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-2xl">
              {activeImage.isVideo ? (
                <div className="relative aspect-video w-full bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${activeImage.youtubeId}?autoplay=1&rel=0`}
                    title={activeImage.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              ) : (
                <img
                  src={activeImage.src}
                  alt={activeImage.title}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[75vh] object-contain mx-auto bg-black"
                />
              )}
              <div className="p-4 bg-white border-t border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  {activeImage.title}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {activeImage.caption}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
