"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, LayersControl, Circle, LayerGroup } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

const HeatmapLayer = ({ incidents }: { incidents: Incident[] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!map || incidents.length === 0) return;
    
    const points = incidents
      .filter(i => i.latitude && i.longitude && !isNaN(Number(i.latitude)) && !isNaN(Number(i.longitude)))
      .map(i => {
        let intensity = 0.2;
        if (i.severity === 'CRITICAL') intensity = 1.0;
        else if (i.severity === 'HIGH') intensity = 0.7;
        else if (i.severity === 'MEDIUM') intensity = 0.4;
        return [Number(i.latitude), Number(i.longitude), intensity];
      });
      
    // @ts-expect-error leaflet plugin missing types
    const heat = L.heatLayer(points, {
      radius: 80,
      blur: 60,
      maxZoom: 18,
      max: 1.0,
      gradient: {
        0.2: '#059669', // Emerald
        0.5: '#d97706', // Amber
        0.8: '#ea580c', // Orange
        1.0: '#dc2626'  // Red
      }
    });

    // Safely add after map has dimensions to prevent Canvas height 0 error
    const timer = setTimeout(() => {
        map.invalidateSize(); // Always force update first
        if (map.getSize().y > 0 && map.getSize().x > 0) {
            try {
                heat.addTo(map);
            } catch (e) {
                console.warn("Heatmap skipped due to canvas size 0");
            }
        }
    }, 500);
    
    return () => {
      clearTimeout(timer);
      map.removeLayer(heat);
    };
  }, [incidents, map]);
  
  return null;
};




// Auto-resizer to prevent half-grey maps
const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    // Initial flush
    const flush = () => {
      const el = map.getContainer();
      if (el && el.clientWidth > 0 && el.clientHeight > 0) map.invalidateSize();
    };
    setTimeout(flush, 250);
    setTimeout(flush, 1000);

    // Watch for parent flex resizes
    const resizeObserver = new ResizeObserver(() => {
      const el = map.getContainer();
      if (el && el.clientWidth > 0 && el.clientHeight > 0) {
        requestAnimationFrame(() => {
          map.invalidateSize();
        });
      }
    });
    
    const container = map.getContainer();
    if (container) {
      resizeObserver.observe(container);
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [map]);
  return null;
};


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
  id: string; ticket_id?: string; title: string; severity: string; latitude: number; longitude: number;
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
  const hasInitializedBounds = useRef(false);

  useEffect(() => {
    // Initial bounds if there are incidents
    if (incidents.length > 0 && !selectedIncidentId && !hasInitializedBounds.current) {
      const validIncidents = incidents.filter(i => i.latitude && i.longitude && !isNaN(Number(i.latitude)) && !isNaN(Number(i.longitude)));
      if (validIncidents.length === 0) return;
      const bounds = L.latLngBounds(validIncidents.map(i => [Number(i.latitude), Number(i.longitude)]));
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12, animate: true, duration: 1.5 });
        hasInitializedBounds.current = true;
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
      const validIncidents = incidents.filter(i => i.latitude && i.longitude && !isNaN(Number(i.latitude)) && !isNaN(Number(i.longitude)));
      if (validIncidents.length === 0) return;
      const bounds = L.latLngBounds(validIncidents.map(i => [Number(i.latitude), Number(i.longitude)]));
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
      className="absolute inset-0 w-full h-full bg-background"
      zoomControl={false}
    >
            <LayersControl position="bottomleft">
        <LayersControl.BaseLayer name="Cinematic Satellite (Night)">
          <TileLayer
            attribution=''
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            className="filter brightness-[0.35] contrast-[1.2] saturate-[0.2] sepia-[0.3] hue-rotate-[180deg]"
          />
        </LayersControl.BaseLayer>
        
        <LayersControl.BaseLayer name="Raw Satellite (Day)">
          <TileLayer
            attribution=''
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            className="filter brightness-[0.8] contrast-[1.2] saturate-[1.2]"
          />
        </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Real Map (Standard)">
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        
        <LayersControl.BaseLayer checked name="Tactical Street (Dark)">
          <LayerGroup>
            <TileLayer
              attribution='&copy; Esri'
              url="https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            />
            <TileLayer
              attribution=''
              url="https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
            />
          </LayerGroup>
        </LayersControl.BaseLayer>
      </LayersControl>
      
      <MapResizer />
      <HeatmapLayer incidents={incidents} />
      
      {/* Predictive Surge Forecast Zones (AI Expansion) */}
      {incidents.map((incident) => {
        if (incident.severity !== 'CRITICAL' || !incident.latitude || !incident.longitude) return null;
        return (
          <Circle 
            key={`surge-${incident.ticket_id || incident.id}`}
            center={[incident.latitude, incident.longitude]}
            radius={2500}
            pathOptions={{ 
              color: '#ef4444', 
              fillColor: '#ef4444', 
              fillOpacity: 0.05, 
              weight: 1, 
              dashArray: '5, 10',
              className: 'surge-pulse' 
            }}
          />
        );
      })}

      <MapController incidents={incidents} selectedIncidentId={selectedIncidentId} />
      
      {incidents.map((incident) => {
        if (!incident.latitude || !incident.longitude || isNaN(Number(incident.latitude)) || isNaN(Number(incident.longitude))) return null;
        
        const isSelected = (incident.id === selectedIncidentId || incident.ticket_id === selectedIncidentId);
        const opacity = selectedIncidentId && !isSelected ? 0.3 : 1;

        return (
          <Marker 
            key={incident.ticket_id || incident.id} 
            position={[incident.latitude, incident.longitude]}
            icon={createGlowingIcon(incident.severity, isSelected)}
            eventHandlers={{
              click: () => onMarkerClick(incident.ticket_id || incident.id)
            }}
            // @ts-expect-error leaflet plugin missing types
            opacity={opacity}
          />
        );
      })}
    </MapContainer>
  );
}
