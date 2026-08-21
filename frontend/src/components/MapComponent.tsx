"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";

// Create custom glowing DivIcons
const createGlowingIcon = (severity: string, isSelected: boolean) => {
  let color = "bg-emerald-500";
  let pulse = "";
  
  if (severity === "CRITICAL") {
    color = "bg-primary";
    pulse = "animate-[criticalPulse_2s_infinite]";
  } else if (severity === "HIGH") {
    color = "bg-orange-500";
    pulse = "animate-pulse";
  } else if (severity === "MEDIUM") {
    color = "bg-yellow-500";
  }

  const selectedRing = isSelected ? `<div class="absolute inset-[-8px] rounded-full border border-white/40 animate-[spin_4s_linear_infinite]"></div>` : '';

  const html = `
    <div class="relative flex items-center justify-center w-8 h-8 transition-transform duration-500 ${isSelected ? 'scale-125' : 'scale-100'}">
      ${severity === "CRITICAL" ? `<div class="absolute inset-0 rounded-full ${color} opacity-40 ${pulse}"></div>` : ''}
      <div class="w-3.5 h-3.5 rounded-full ${color} shadow-[0_0_15px_currentColor] border border-white/50 z-10"></div>
      ${selectedRing}
    </div>
  `;

  return new L.DivIcon({
    html,
    className: "custom-leaflet-marker bg-transparent border-0",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

type Incident = {
  id: string; title: string; severity: string; latitude: number; longitude: number;
  people_affected: number; report_count: number; status: string;
};

// Component to handle programmatic map movements
const MapController = ({ 
  incidents, 
  selectedIncidentId 
}: { 
  incidents: Incident[], 
  selectedIncidentId: string | null 
}) => {
  const map = useMap();
  const prevSelectedId = useRef<string | null>(null);

  useEffect(() => {
    // Initial bounds if there are incidents
    if (incidents.length > 0 && !selectedIncidentId && prevSelectedId.current === null) {
      const bounds = L.latLngBounds(incidents.map(i => [i.latitude, i.longitude]));
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12, animate: true, duration: 1.5 });
      }
    }
  }, [incidents, map, selectedIncidentId]);

  useEffect(() => {
    if (selectedIncidentId && selectedIncidentId !== prevSelectedId.current) {
      const incident = incidents.find(i => i.id === selectedIncidentId);
      if (incident && incident.latitude && incident.longitude) {
        // Fly to the incident, offset slightly to the left so the right drawer doesn't cover it
        map.flyTo([incident.latitude, incident.longitude], 14, {
          duration: 1.5,
          easeLinearity: 0.25
        });
      }
    } else if (!selectedIncidentId && prevSelectedId.current) {
      // Return to bounds
      const bounds = L.latLngBounds(incidents.map(i => [i.latitude, i.longitude]));
      if (bounds.isValid()) {
        map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 12, duration: 1.5 });
      }
    }
    prevSelectedId.current = selectedIncidentId;
  }, [selectedIncidentId, incidents, map]);

  return null;
};

export default function MapComponent({ 
  incidents, 
  selectedIncidentId, 
  onMarkerClick 
}: { 
  incidents: Incident[], 
  selectedIncidentId: string | null,
  onMarkerClick: (id: string) => void
}) {
  return (
    <MapContainer 
      center={[19.0760, 72.8777]} 
      zoom={11} 
      className="w-full h-full bg-background"
      zoomControl={false}
    >
      <TileLayer
        attribution=''
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        className="opacity-90 filter brightness-75 contrast-125 grayscale hue-rotate-180 invert-0"
      />
      
      <MapController incidents={incidents} selectedIncidentId={selectedIncidentId} />
      
      {incidents.map((incident) => {
        if (!incident.latitude || !incident.longitude) return null;
        
        const isSelected = incident.id === selectedIncidentId;
        const opacity = selectedIncidentId && !isSelected ? 0.3 : 1;

        return (
          <Marker 
            key={incident.id} 
            position={[incident.latitude, incident.longitude]}
            icon={createGlowingIcon(incident.severity, isSelected)}
            eventHandlers={{
              click: () => onMarkerClick(incident.id)
            }}
            // @ts-ignore
            opacity={opacity}
          />
        );
      })}
    </MapContainer>
  );
}
