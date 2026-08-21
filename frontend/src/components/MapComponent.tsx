"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Badge } from "./ui/badge";

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom colored icons for severity
const createIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const icons = {
  CRITICAL: createIcon('red'),
  HIGH: createIcon('orange'),
  MEDIUM: createIcon('yellow'),
  LOW: createIcon('green'),
};

type Incident = {
  id: string;
  title: string;
  severity: string;
  latitude: number;
  longitude: number;
  people_affected: number;
  report_count: number;
};

export default function MapComponent() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/incidents")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setIncidents(data); })
      .catch(console.error);
      
    // Polling for demo simplicity since WS is mainly on Dashboard page
    const interval = setInterval(() => {
      fetch("http://localhost:8000/api/incidents")
        .then(r => r.json())
        .then(data => { if (Array.isArray(data)) setIncidents(data); })
        .catch(console.error);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer 
      center={[19.0760, 72.8777]} // Mumbai coordinates for demo scenario
      zoom={11} 
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // Dark theme map
      />
      
      {incidents.map((incident) => {
        if (!incident.latitude || !incident.longitude) return null;
        
        return (
          <Marker 
            key={incident.id} 
            position={[incident.latitude, incident.longitude]}
            icon={icons[incident.severity as keyof typeof icons] || icons.MEDIUM}
          >
            <Popup className="custom-popup">
              <div className="p-1">
                <h3 className="font-bold text-base mb-1">{incident.title}</h3>
                <Badge variant="outline" className={`mb-2 ${
                  incident.severity === 'CRITICAL' ? 'text-red-500 border-red-500' :
                  incident.severity === 'HIGH' ? 'text-orange-500 border-orange-500' : 'text-yellow-500 border-yellow-500'
                }`}>
                  {incident.severity}
                </Badge>
                <div className="text-sm">
                  <p><strong>Reports clustered:</strong> {incident.report_count}</p>
                  <p><strong>People affected:</strong> {incident.people_affected}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
