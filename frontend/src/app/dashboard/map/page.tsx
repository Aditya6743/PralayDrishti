"use client";

import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => <div className="h-[80vh] w-full flex items-center justify-center text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">Initializing Geospatial Map...</div>
});

export default function MapPage() {
  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white">Geospatial Intelligence</h2>
        <p className="text-slate-400 text-sm">Real-time incident clustering & heatmap visualization.</p>
      </div>
      <div className="flex-1 rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative z-0">
        <MapWithNoSSR />
      </div>
    </div>
  );
}
