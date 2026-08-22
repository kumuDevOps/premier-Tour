import React, { useEffect, useRef, useState } from 'react';
import { Tour, ItineraryDay } from '../types';
import { MapPin, Navigation, Compass, Layers, Maximize2 } from 'lucide-react';

interface TourRouteMapProps {
  tour: Tour;
}

export const TourRouteMap: React.FC<TourRouteMapProps> = ({ tour }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: number]: any }>({});
  const polylineRef = useRef<any>(null);

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [totalKm, setTotalKm] = useState<number>(0);
  const [mapReady, setMapReady] = useState(false);

  const itineraryList = Array.isArray(tour?.itinerary) ? tour.itinerary : [];

  // Extract itinerary days with valid coordinates
  const validDays = itineraryList.filter(
    (d): d is ItineraryDay & { coordinates: [number, number] } =>
      Array.isArray(d?.coordinates) && d.coordinates.length === 2 && !isNaN(d.coordinates[0]) && !isNaN(d.coordinates[1])
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Calculate total km
    const sumKm = itineraryList.reduce((acc, curr) => acc + (curr?.distanceKm || 0), 0);
    setTotalKm(sumKm);

    const L = (window as any).L;
    if (!L) {
      // Check if Leaflet loads in a moment
      const timer = setTimeout(() => {
        if ((window as any).L) {
          setMapReady((prev) => !prev);
        }
      }, 500);
      return () => clearTimeout(timer);
    }

    // Fallback coordinates if no coordinates in itinerary
    const initialCoords: [number, number] = validDays.length > 0 ? validDays[0].coordinates : [7.8731, 80.7718]; // Sri Lanka center

    // Initialize map if not yet initialized
    if (!mapInstanceRef.current) {
      try {
        const map = L.map(mapContainerRef.current, {
          center: initialCoords,
          zoom: 8,
          zoomControl: true,
          scrollWheelZoom: false,
        });

        // Sleek OpenStreetMap CartoDB Positron / Voyager or standard OSM tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
      } catch (err) {
        console.warn('Map initialization notice:', err);
      }
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers & polyline
    Object.values(markersRef.current).forEach((m: any) => {
      if (m && typeof m.remove === 'function') {
        m.remove();
      }
    });
    markersRef.current = {};
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (validDays.length === 0) return;

    // Create coordinates array for polyline
    const latLngs: [number, number][] = validDays.map((d) => d.coordinates);

    // Draw route polyline
    try {
      const polyline = L.polyline(latLngs, {
        color: '#4F46E5', // Indigo-600
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      polylineRef.current = polyline;

      // Create custom numbered pin icon generator
      validDays.forEach((dayItem) => {
        const customHtml = `
          <div class="group relative flex items-center justify-center">
            <div class="w-8 h-8 rounded-full bg-emerald-600 text-white border-2 border-white shadow-lg flex items-center justify-center font-bold text-xs transform transition-transform hover:scale-110 hover:bg-slate-900 cursor-pointer">
              ${dayItem.day}
            </div>
            <div class="absolute -bottom-6 bg-slate-900/90 text-white text-[10px] font-medium px-2 py-0.5 rounded shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Day ${dayItem.day}: ${dayItem.title.split(':')[0]}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: customHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker(dayItem.coordinates, { icon: customIcon }).addTo(map);

        const popupContent = `
          <div class="p-1 font-sans">
            <div class="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-0.5">Day ${dayItem.day} Stop</div>
            <h4 class="font-sans font-bold text-[var(--text)] text-sm mb-1">${dayItem.title}</h4>
            <p class="text-xs text-[var(--muted)] leading-relaxed mb-2">${dayItem.description}</p>
            ${dayItem.activity ? `<div class="text-[11px] text-[var(--muted)] bg-slate-100 p-1.5 rounded">🎯 <strong>Activity:</strong> ${dayItem.activity}</div>` : ''}
            ${dayItem.distanceKm ? `<div class="text-[10px] text-emerald-700 font-mono mt-1">🛣️ Distance: ~${dayItem.distanceKm} km</div>` : ''}
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          setSelectedDay(dayItem.day);
        });

        markersRef.current[dayItem.day] = marker;
      });

      // Fit map bounds to encompass all waypoints
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [40, 40] });
    } catch (e) {
      console.warn('Map polyline layer notice:', e);
    }
  }, [tour, mapReady]);

  // Handle clicking a day in the pill list
  const handleSelectDay = (dayNum: number) => {
    setSelectedDay(dayNum);
    const dayItem = validDays.find((d) => d.day === dayNum);
    const marker = markersRef.current[dayNum];
    const map = mapInstanceRef.current;

    if (dayItem && marker && map) {
      map.setView(dayItem.coordinates, 12, { animate: true });
      marker.openPopup();
    }
  };

  const handleResetBounds = () => {
    setSelectedDay(null);
    const map = mapInstanceRef.current;
    const L = (window as any).L;
    if (map && L && validDays.length > 0) {
      const latLngs: [number, number][] = validDays.map((d) => d.coordinates);
      map.fitBounds(L.latLngBounds(latLngs), { padding: [40, 40] });
    }
  };

  if (validDays.length === 0) {
    return null;
  }

  return (
    <div id="interactive-tour-map-card" className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-[var(--background)]/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Compass className="w-4 h-4" />
            </span>
            <h3 className="font-sans font-bold text-[var(--text)] text-lg">
              Interactive GIS Route & Waypoints
            </h3>
          </div>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Explore the exact day-by-day expedition track across Sri Lanka heritage citadels & safari parks.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-2">
          {totalKm > 0 && (
            <div className="px-3 py-1 bg-white rounded-lg border border-slate-200 text-xs font-mono text-slate-700 flex items-center gap-1.5 shadow-2xs">
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              <span>Total Distance: <strong className="text-[var(--text)]">{totalKm} km</strong></span>
            </div>
          )}
          <button
            onClick={handleResetBounds}
            title="Reset Map View"
            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
          >
            <Maximize2 className="w-3 h-3 text-[var(--muted)]" />
            <span className="hidden sm:inline">Fit Route</span>
          </button>
        </div>
      </div>

      {/* Map Display Viewport */}
      <div className="relative">
        <div
          ref={mapContainerRef}
          style={{ height: '420px', width: '100%', zIndex: 10 }}
          className="w-full bg-slate-100"
        />

        {/* Map Legend Overlay */}
        <div className="absolute top-3 right-3 z-20 bg-slate-900/90 backdrop-blur-xs text-white p-2.5 rounded-xl border border-slate-700/80 text-[11px] shadow-lg max-w-[200px] hidden sm:block">
          <div className="flex items-center gap-1.5 text-emerald-300 font-semibold mb-1">
            <Layers className="w-3 h-3" />
            <span>Expedition Waypoints</span>
          </div>
          <div className="text-[10px] text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 border border-white inline-block" />
              <span>Itinerary Stage Stop</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 border-t-2 border-dashed border-emerald-400 inline-block" />
              <span>Chauffeur / Rail Route</span>
            </div>
          </div>
        </div>
      </div>

      {/* Day-by-Day Interactive Filter Strip */}
      <div className="p-3 sm:p-4 bg-[var(--background)] border-t border-slate-200 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider pl-1">
            Select Stage:
          </span>
          {validDays.map((d) => {
            const isSelected = selectedDay === d.day;
            return (
              <button
                key={d.day}
                onClick={() => handleSelectDay(d.day)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20 font-bold scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                <MapPin className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                <span>Day {d.day}: {d.title.split('&')[0].slice(0, 24)}</span>
                {d.distanceKm && (
                  <span className={`text-[10px] font-mono px-1 rounded ${isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-100 text-[var(--muted)]'}`}>
                    {d.distanceKm}km
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
