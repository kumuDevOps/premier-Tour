import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, ArrowRight, RotateCcw, Plus, Minus, Compass, AlertCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import L from 'leaflet';

export interface DestinationInfo {
  id: string;
  name: string;
  coordinates: [number, number]; // [lat, lng]
  descKey: string;
  exploreItems: string[];
}

export const DESTINATIONS: DestinationInfo[] = [
  {
    id: 'Colombo',
    name: 'Colombo',
    coordinates: [6.9271, 79.8612],
    descKey: 'dest_colombo_desc',
    exploreItems: ['Galle Face Green', 'Colombo Fort', 'Pettah Bazaars', 'Museums', 'Luxury Dining']
  },
  {
    id: 'Kandy',
    name: 'Kandy',
    coordinates: [7.2906, 80.6337],
    descKey: 'dest_kandy_desc',
    exploreItems: ['Temple of the Tooth', 'Kandy Lake', 'Peradeniya Gardens', 'Cultural Arts']
  },
  {
    id: 'Sigiriya',
    name: 'Sigiriya',
    coordinates: [7.9570, 80.7603],
    descKey: 'dest_sigiriya_desc',
    exploreItems: ['Lion Rock Citadel', 'Water Gardens', 'Ancient Frescoes', 'Pidurangala Sunset']
  },
  {
    id: 'Ella',
    name: 'Ella',
    coordinates: [6.8667, 81.0466],
    descKey: 'dest_ella_desc',
    exploreItems: ['Nine Arch Bridge', "Little Adam's Peak", 'Ella Rock Hike', 'Scenic Tea Train']
  },
  {
    id: 'Nuwara Eliya',
    name: 'Nuwara Eliya',
    coordinates: [6.9497, 80.7891],
    descKey: 'dest_nuwara_eliya_desc',
    exploreItems: ['Tea Estates & Factories', 'Gregory Lake', 'Post Office Heritage', 'Cascading Waterfalls']
  },
  {
    id: 'Yala',
    name: 'Yala',
    coordinates: [6.3725, 81.5185],
    descKey: 'dest_yala_desc',
    exploreItems: ['Leopard Game Drives', 'Asian Elephant Herds', 'Safari Glamping', 'Rock Temples']
  },
  {
    id: 'Galle',
    name: 'Galle',
    coordinates: [6.0329, 80.2168],
    descKey: 'dest_galle_desc',
    exploreItems: ['UNESCO Galle Fort', 'Dutch Ramparts', 'Boutique Shopping', 'Lighthouse Sunsets']
  },
  {
    id: 'Mirissa',
    name: 'Mirissa',
    coordinates: [5.9483, 80.4716],
    descKey: 'dest_mirissa_desc',
    exploreItems: ['Blue Whale Safaris', 'Coconut Tree Hill', 'Secret Beach', 'Oceanfront Dining']
  },
  {
    id: 'Bentota',
    name: 'Bentota',
    coordinates: [6.4211, 80.0050],
    descKey: 'dest_bentota_desc',
    exploreItems: ['Water-Sports & Jet Skiing', 'Bentota River Safari', 'Turtle Sanctuary', 'Bawa Estate']
  }
];

interface SriLankaInteractiveMapProps {
  selectedDestination: string | null;
  onSelectDestination: (destName: string | null) => void;
}

export const SriLankaInteractiveMap: React.FC<SriLankaInteractiveMapProps> = ({
  selectedDestination,
  onSelectDestination
}) => {
  const { t } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Initial center for Sri Lanka
  const INITIAL_CENTER: [number, number] = [7.8731, 80.7718];
  const INITIAL_ZOOM = 7.5;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      try {
        const map = L.map(mapContainerRef.current, {
          center: INITIAL_CENTER,
          zoom: INITIAL_ZOOM,
          zoomControl: false, // We render custom minimal controls
          scrollWheelZoom: true,
          touchZoom: true,
          doubleClickZoom: true,
        });

        // CartoDB Dark Matter tile layer matches the dark green luxury aesthetic
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
        setMapLoaded(true);
      } catch (err) {
        console.error('Failed to initialize Leaflet map:', err);
        setMapError(true);
      }
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach((marker) => (marker as L.Marker).remove());
    markersRef.current = {};

    // Create markers for each destination
    DESTINATIONS.forEach((dest) => {
      const isSelected = selectedDestination === dest.name;
      const translatedDesc = t(dest.descKey) || `${dest.name} destination in Sri Lanka.`;

      // Custom divIcon with glowing emerald style
      const customHtml = `
        <div class="custom-marker-wrapper group relative flex items-center justify-center cursor-pointer">
          <div class="relative flex items-center justify-center">
            <span class="absolute ${isSelected ? 'w-10 h-10 bg-emerald-400/60 shadow-[0_0_25px_rgba(52,211,153,1)]' : 'w-7 h-7 bg-emerald-400/30'} rounded-full animate-ping"></span>
            <div class="${isSelected ? 'w-8 h-8 bg-emerald-400 border-2 border-white shadow-[0_0_20px_rgba(52,211,153,1)] scale-110' : 'w-6 h-6 bg-[#0F9D72] border-2 border-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.7)]'} rounded-full text-slate-950 font-extrabold flex items-center justify-center transition-all duration-300">
              <div class="${isSelected ? 'w-3 h-3 bg-slate-950' : 'w-2 h-2 bg-white'} rounded-full"></div>
            </div>
          </div>
          <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-950/90 text-white border ${isSelected ? 'border-emerald-400 text-emerald-300 font-black scale-105' : 'border-emerald-500/40 text-emerald-200 font-bold'} text-[11px] px-2.5 py-0.5 rounded-full shadow-lg whitespace-nowrap transition-all duration-200 pointer-events-none">
            ${dest.name}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker-icon',
        html: customHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker(dest.coordinates, { icon: customIcon }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div class="p-3 max-w-[250px] font-sans text-slate-900">
          <div class="flex items-center gap-1.5 text-emerald-600 text-[10px] font-extrabold uppercase tracking-wider mb-1">
            <span>📍 Sri Lanka Destination</span>
          </div>
          <h4 class="text-base font-extrabold text-slate-950 mb-1 leading-tight">${dest.name}</h4>
          <p class="text-xs text-slate-600 leading-snug mb-2.5">${translatedDesc}</p>
          <div class="space-y-1 mb-3 bg-emerald-50/80 p-2 rounded-lg border border-emerald-100">
            <div class="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">Explore</div>
            <div class="text-[11px] text-slate-700 font-medium">
              ${dest.exploreItems.slice(0, 3).join(' • ')}
            </div>
          </div>
          <button id="popup-btn-${dest.id.replace(/\s+/g, '-')}" class="w-full py-1.5 px-3 bg-[#0F9D72] hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer text-center shadow-xs">
            Filter ${dest.name} Stories
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'emerald-custom-popup',
        closeButton: true,
        maxWidth: 270,
      });

      marker.on('click', () => {
        onSelectDestination(dest.name);
        map.flyTo(dest.coordinates, 10.5, { animate: true, duration: 1 });
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${dest.id.replace(/\s+/g, '-')}`);
        if (btn) {
          btn.onclick = () => {
            onSelectDestination(dest.name);
            document.getElementById('journal')?.scrollIntoView({ behavior: 'smooth' });
          };
        }
      });

      markersRef.current[dest.name] = marker;
    });

    // Invalidate size to prevent grey tiles on render
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      // Keep map instance alive or cleanup if unmounting
    };
  }, [t]);

  // Handle selectedDestination change from outside (buttons)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedDestination) {
      const dest = DESTINATIONS.find((d) => d.name.toLowerCase() === selectedDestination.toLowerCase());
      if (dest) {
        map.flyTo(dest.coordinates, 11, { animate: true, duration: 1.2 });
        const marker = markersRef.current[dest.name];
        if (marker) {
          marker.openPopup();
        }
      }
    } else {
      map.flyTo(INITIAL_CENTER, INITIAL_ZOOM, { animate: true, duration: 1.2 });
      map.closePopup();
    }
  }, [selectedDestination]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetMap = () => {
    onSelectDestination(null);
    mapInstanceRef.current?.flyTo(INITIAL_CENTER, INITIAL_ZOOM, { animate: true, duration: 1.2 });
    mapInstanceRef.current?.closePopup();
  };

  const activeDestInfo = DESTINATIONS.find((d) => d.name.toLowerCase() === (selectedDestination || '').toLowerCase());

  return (
    <section className="bg-gradient-to-br from-emerald-950 via-[#0D281F] to-emerald-900 rounded-[28px] sm:rounded-[32px] overflow-hidden relative shadow-2xl border border-emerald-500/20 my-8">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,50 Q25,25 50,50 T100,50 L100,100 L0,100 Z" fill="rgba(255,255,255,0.08)" />
          <path d="M0,70 Q25,45 50,70 T100,70 L100,100 L0,100 Z" fill="rgba(255,255,255,0.08)" />
        </svg>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative z-10">
        
        {/* LEFT COLUMN: DESTINATION LIST & CONTROLS */}
        <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-widest uppercase shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                {t('map_badge') || 'Interactive Travel Map'}
              </span>

              {selectedDestination && (
                <button
                  onClick={handleResetMap}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/80 hover:bg-emerald-800 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('map_reset_view') || 'Reset Map'}</span>
                </button>
              )}
            </div>

            <h2 className="text-3xl sm:text-4xl font-sans font-bold text-white mb-3 leading-tight">
              {t('map_title') || 'Explore Sri Lanka'}
            </h2>

            <p className="text-emerald-100/80 mb-6 text-xs sm:text-sm leading-relaxed">
              {t('map_subtitle') || 'Discover destinations, experiences, and hidden places worth adding to your journey. Click a region to explore relevant stories.'}
            </p>

            {/* Selected Destination Feature Highlight */}
            {activeDestInfo ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-2xl bg-emerald-900/70 border border-emerald-400/40 shadow-inner"
              >
                <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-xs uppercase tracking-wider mb-1">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Selected Destination: {activeDestInfo.name}</span>
                </div>
                <p className="text-emerald-100 text-xs leading-relaxed mb-3">
                  {t(activeDestInfo.descKey) || `${activeDestInfo.name} in Sri Lanka.`}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {activeDestInfo.exploreItems.map((item, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/30 text-emerald-200 text-[10px] font-semibold">
                      • {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ) : null}

            {/* Destination Buttons Grid */}
            <div className="flex flex-wrap gap-2 mb-8">
              {DESTINATIONS.map((dest) => {
                const isActive = selectedDestination === dest.name;
                return (
                  <button
                    key={dest.id}
                    onClick={() => {
                      if (isActive) {
                        handleResetMap();
                      } else {
                        onSelectDestination(dest.name);
                      }
                    }}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-xs border ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 text-slate-950 border-white shadow-[0_0_18px_rgba(52,211,153,0.7)] font-black scale-105'
                        : 'bg-emerald-950/60 hover:bg-emerald-800/80 text-emerald-100/90 border-emerald-500/30 hover:border-emerald-400/60 hover:text-white'
                    }`}
                  >
                    <MapPin className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950 font-extrabold' : 'text-emerald-400'}`} />
                    <span>{dest.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-500/20 flex items-center justify-between">
            <Link
              to="/tours"
              className="inline-flex items-center gap-2 text-white hover:text-emerald-300 font-bold text-xs sm:text-sm transition-colors cursor-pointer group"
            >
              <span>{t('map_view_curated_tours') || 'View all curated tour itineraries'}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE MAP VIEWPORT */}
        <div className="lg:col-span-7 relative min-h-[340px] sm:min-h-[420px] lg:min-h-[460px] bg-slate-950/80 flex flex-col justify-center overflow-hidden border-t lg:border-t-0 lg:border-l border-emerald-500/20">
          
          {/* Fallback Error State */}
          {mapError ? (
            <div className="p-8 text-center flex flex-col items-center justify-center text-emerald-200">
              <AlertCircle className="w-10 h-10 text-emerald-400 mb-3" />
              <p className="font-bold text-sm text-white mb-1">
                {t('map_unavailable') || 'Map temporarily unavailable'}
              </p>
              <p className="text-xs text-emerald-300/70 max-w-xs">
                You can still select destinations using the buttons on the left to filter journal stories.
              </p>
            </div>
          ) : (
            <div className="relative w-full h-full min-h-[340px] sm:min-h-[420px] lg:min-h-[460px]">
              
              {/* Leaflet Map Container */}
              <div
                ref={mapContainerRef}
                style={{ height: '100%', width: '100%', minHeight: '340px', zIndex: 1 }}
                className="w-full h-full bg-slate-950"
              />

              {/* Custom Map Controls Overlay */}
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <button
                  onClick={handleZoomIn}
                  title="Zoom In"
                  className="w-8 h-8 bg-slate-900/90 hover:bg-emerald-600 text-white rounded-lg border border-emerald-500/30 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  className="w-8 h-8 bg-slate-900/90 hover:bg-emerald-600 text-white rounded-lg border border-emerald-500/30 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetMap}
                  title="Reset Sri Lanka View"
                  className="w-8 h-8 bg-slate-900/90 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg border border-emerald-500/30 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Badge Legend */}
              <div className="absolute bottom-4 left-4 z-10 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/30 text-[11px] text-emerald-200 font-medium flex items-center gap-2 shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Sri Lanka Expedition Destinations</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
