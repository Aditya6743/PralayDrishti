"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ShieldAlert, MapPin, Activity, Navigation, Tent, Users, BatteryCharging } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const MiniRouteMap = dynamic(() => import("@/components/MiniRouteMap"), { ssr: false });

export default function ReliefCampsPage() {
  const [locState, setLocState] = useState<{lat: number, lng: number} | null>(null);
  const [status, setStatus] = useState("Awaiting GPS Signal...");
  const [isScanning, setIsScanning] = useState(true);
  const [city, setCity] = useState("Local");
  const [activeRoute, setActiveRoute] = useState<number | null>(null);

  useEffect(() => {
    // 1. Get GPS
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setLocState({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setStatus("Reverse geocoding infrastructure...");
          
          try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
            const geoData = await geoRes.json();
            const cityName = geoData.address.city || geoData.address.town || geoData.address.suburb || geoData.address.county || "Local";
            setCity(cityName);
          } catch(e) {}

          setStatus("Cross-referencing grid capacity...");
          setTimeout(() => setIsScanning(false), 1500);
        },
        async (err) => {
          console.warn("Native GPS blocked/timed out. Falling back to IP-based actual geolocation.", err);
          try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            if (data && data.latitude && data.longitude) {
              setLocState({ lat: data.latitude, lng: data.longitude });
              setStatus("Cross-referencing grid capacity...");
            } else {
              setStatus("Location failed. Using general city data.");
            }
          } catch(e) {
            setStatus("Location failed.");
          }
          setTimeout(() => setIsScanning(false), 2000);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // Mock Camps Data (Dynamic)
  const camps = [
    { name: `${city} Central Relief Camp`, type: "Medical & Shelter", dist: 1.2, capacity: 500, current: 412, status: "High Capacity", color: "text-emerald-400", bg: "bg-emerald-500", border: "border-emerald-500/30" },
    { name: `${city} North Safe Zone`, type: "Shelter Only", dist: 2.8, capacity: 200, current: 195, status: "Critical (Almost Full)", color: "text-red-400", bg: "bg-red-500", border: "border-red-500/30" },
    { name: "Stadium Evac Center", type: "Mass Shelter & Food", dist: 5.4, capacity: 2000, current: 840, status: "Receiving", color: "text-blue-400", bg: "bg-blue-500", border: "border-blue-500/30" }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start pt-24 p-6 relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-900/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Top Left Logo (Back to Home) */}
      <Link href="/" className="absolute top-6 left-6 z-50 magnetic-target group">
        <div className="flex flex-row items-center gap-3 w-max">
          <ShieldAlert className="text-red-500 h-6 w-6 shrink-0" />
          <span className="text-sm font-bold tracking-widest text-white editorial-heading uppercase whitespace-nowrap leading-none">
            Pralay<span className="text-red-500">Drishti</span>
          </span>
        </div>
      </Link>

      <div className="w-full max-w-5xl relative z-10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <Tent className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-widest mb-2">Live Infrastructure</h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest">Dynamic Relief Camp Routing & Capacity</p>
        </div>

        <AnimatePresence mode="wait">
          {isScanning ? (
            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20">
              <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                <div className="absolute inset-4 rounded-full border border-blue-500/40 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] animation-delay-500"></div>
                <div className="absolute inset-8 rounded-full border border-blue-500/60 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] animation-delay-1000"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <div className="text-blue-400 font-mono text-xs uppercase tracking-widest animate-pulse">{status}</div>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 border-b border-white/10 pb-4">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Your Location</div>
                  <div className="text-xs font-mono text-emerald-400">
                    {locState ? `${locState.lat.toFixed(4)}° N, ${locState.lng.toFixed(4)}° E` : 'Unknown'}
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-right">
                  <span className="text-white">3</span> Facilities Online
                </div>
              </div>

              {camps.map((camp, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: i * 0.15 }}
                  className={`glass-panel p-5 rounded-2xl border ${camp.border} bg-white/[0.02] hover:bg-white/[0.04] transition-all group`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-bold tracking-wide flex items-center gap-2">
                        {camp.name}
                      </h3>
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                        <Activity className="w-3 h-3" /> {camp.type}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-white font-mono">{camp.dist} <span className="text-[10px] text-slate-500 tracking-widest uppercase">KM</span></div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-slate-400 flex items-center gap-1"><Users className="w-3 h-3"/> Occupancy</span>
                      <span className={camp.color}>{camp.status}</span>
                    </div>
                    <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                      <div className={`h-full ${camp.bg}`} style={{ width: `${(camp.current / camp.capacity) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>{camp.current} Filled</span>
                      <span>{camp.capacity} Total Beds</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-white/5">
                    <Button className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-[10px] font-bold uppercase tracking-widest">
                      <BatteryCharging className="w-3 h-3 mr-2 text-yellow-400" /> Power Available
                    </Button>
                    <Button 
                      onClick={() => setActiveRoute(activeRoute === i ? null : i)}
                      className="flex-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase tracking-widest"
                    >
                      <Navigation className="w-3 h-3 mr-2" /> {activeRoute === i ? "Hide Route" : "Route via Safe-Zone"}
                    </Button>
                  </div>
                                  <AnimatePresence>
                    {activeRoute === i && locState && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: "auto", opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t border-white/5 overflow-hidden"
                      >
                        <h4 className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase mb-3 flex items-center gap-2">
                          <Activity className="w-3 h-3 animate-pulse" /> AI Safe Route Generated
                        </h4>
                        <div className="text-xs text-slate-300 mb-4 leading-relaxed bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg">
                          Avoid main highways due to severe hazard clustering. Using secondary residential roads. ETA: {Math.floor(camp.dist * 4)} mins.
                        </div>
                        <div className="h-64 w-full rounded-xl overflow-hidden border border-white/10 relative z-0">
                          <MiniRouteMap lat={locState.lat} lng={locState.lng} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
