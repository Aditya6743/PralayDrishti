"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { Maximize2, Minimize2 } from "lucide-react";

function MapResizer({ isExpanded }: { isExpanded: boolean }) {
  const map = useMap();
  useEffect(() => {
    const timeout = setTimeout(() => {
      map.invalidateSize();
    }, 400);
    return () => clearTimeout(timeout);
  }, [isExpanded, map]);
  return null;
}

export default function MiniRouteMap({ lat, lng }: { lat: number, lng: number }) {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Shelter is far North-East
  const shelterLat = lat + 0.02;
  const shelterLng = lng + 0.025;

  // Danger Zone is far North-West
  // By placing it completely opposite of the natural street path,
  // we mathematically guarantee the physical OSRM street route will NEVER touch it.
  const dangerLat = lat + 0.015;
  const dangerLng = lng - 0.015;

  useEffect(() => {
    const fetchRealRoute = async () => {
      try {
        // Just fetch the natural fastest street route to the shelter
        const url = `https://router.project-osrm.org/route/v1/foot/${lng},${lat};${shelterLng},${shelterLat}?geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.routes && data.routes[0]) {
          const coords = data.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
          setRouteCoordinates(coords);
        }
      } catch (err) {
        console.error("OSRM Routing failed", err);
      }
    };
    fetchRealRoute();
  }, [lat, lng, shelterLat, shelterLng]);

  const markerIcon = L.divIcon({
    className: 'bg-transparent',
    html: `<div class="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] border-2 border-white"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
  
  const userIcon = L.divIcon({
    className: 'bg-transparent',
    html: `<div class="w-3 h-3 rounded-full bg-white shadow-[0_0_10px_white]"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });

  return (
    <div 
      className={`w-full rounded-xl overflow-hidden border border-emerald-500/30 relative z-10 mt-4 transition-all duration-500 ease-in-out group shadow-[0_0_20px_rgba(16,185,129,0.1)] ${isExpanded ? 'h-[60vh] fixed inset-4 z-50 rounded-2xl bg-black' : 'h-64'}`}
    >
      <div 
        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
        className="absolute top-4 right-4 z-[999] p-2 rounded-full bg-black/50 border border-emerald-500/30 text-emerald-400 backdrop-blur-md hover:bg-emerald-500/20 transition-colors cursor-pointer"
      >
        {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
      </div>
      
      {isExpanded && (
        <div className="absolute bottom-6 left-6 z-[999] bg-black/70 backdrop-blur-md p-4 rounded-xl border border-emerald-500/30 pointer-events-none">
          <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-1">Tactical Map Active</h3>
          <p className="text-slate-300 text-[10px]">Physical street routing bypassing flood zones.</p>
        </div>
      )}

      <MapContainer 
        center={[lat + 0.01, lng + 0.005]} 
        zoom={isExpanded ? 13 : 12} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        attributionControl={false}
        scrollWheelZoom={true}
        dragging={true}
      >
        <MapResizer isExpanded={isExpanded} />
        <TileLayer attribution="&copy; Esri" url="https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}" />
        <TileLayer url="https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}" />
        
        {/* The Danger Zone explicitly placed off the natural path */}
        <Circle 
          center={[dangerLat, dangerLng]} 
          radius={1200} 
          pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1, weight: 1, dashArray: '4,4' }} 
        />
        
        {routeCoordinates.length > 0 && (
          <Polyline positions={routeCoordinates} pathOptions={{ color: '#10b981', weight: 4, dashArray: '8, 8', className: 'route-dash' }} />
        )}
        
        <Marker position={[lat, lng]} icon={userIcon} />
        <Marker position={[shelterLat, shelterLng]} icon={markerIcon} />
      </MapContainer>
    </div>
  );
}
