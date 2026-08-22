"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Activity, X, Target, Filter, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const MapWithNoSSR = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center text-muted-foreground bg-black/20">INITIALIZING INTELLIGENCE MAP...</div>
});

type Incident = {
  id: string; title: string; severity: string; latitude: number; longitude: number;
  people_affected: number; report_count: number; status: string; ttc_minutes: number;
};

export default function MapPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncidents = () => {
      fetch("/api/incidents")
        .then(r => r.ok ? r.json() : [])
        .then(data => { if (Array.isArray(data)) setIncidents(data); })
        .catch(console.error);
    };
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredIncidents = filter === "ALL" ? incidents : incidents.filter(i => i.severity === filter);
  
  const priorityMap: Record<string, number> = { "CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1 };
  const sortedQueue = [...filteredIncidents].sort((a, b) => (priorityMap[b.severity] || 0) - (priorityMap[a.severity] || 0));
  const activeIncidentCount = incidents.length;

  return (
    <div className="h-[calc(100vh-6rem)] w-full flex relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black">
      
      {/* BACKGROUND MAP */}
      <div className="absolute inset-0 z-0">
        <MapWithNoSSR 
          incidents={filteredIncidents} 
          selectedIncidentId={selectedIncidentId}
          onMarkerClick={setSelectedIncidentId} 
        />
      </div>

      {/* TOP LEFT: LIVE SITUATIONAL AWARENESS */}
      <div className="absolute top-6 left-6 z-10 glass-panel p-4 rounded-2xl border border-white/10 pointer-events-none">
        <h2 className="text-[10px] font-bold tracking-widest text-white uppercase editorial-heading mb-2">LIVE SITUATIONAL AWARENESS</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
            LIVE
          </div>
          <div className="h-3 w-px bg-white/20"></div>
          <div className="text-xs font-bold text-white mono-number tracking-widest">{activeIncidentCount} ACTIVE INCIDENTS</div>
        </div>
      </div>

      {/* LEFT: FLOATING FILTERS */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
        <div className="glass-panel p-2 rounded-2xl border border-white/10 flex flex-col gap-2">
          <div className="p-2 flex justify-center text-muted-foreground"><Filter className="w-4 h-4" /></div>
          {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map(level => (
            <button 
              key={level}
              onClick={() => setFilter(level)}
              className={`w-12 h-12 flex items-center justify-center rounded-xl text-[10px] font-bold tracking-widest transition-all magnetic-target ${filter === level ? (level === 'CRITICAL' ? 'bg-primary text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]' : level === 'HIGH' ? 'bg-orange-500 text-white' : level === 'ALL' ? 'bg-white text-black' : 'bg-yellow-500 text-black') : 'bg-black/50 text-muted-foreground hover:bg-white/10'}`}
            >
              {level.substring(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* BOTTOM LEFT: LEGEND */}
      <div className="absolute bottom-6 left-6 z-10 glass-panel px-4 py-3 rounded-2xl border border-white/10 flex items-center gap-4 text-[10px] font-bold tracking-widest uppercase text-muted-foreground pointer-events-none">
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div> Critical</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div> High</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Medium</div>
      </div>

      {/* RIGHT: PRIORITY QUEUE / INCIDENT DRAWER */}
      <div className="absolute inset-x-4 bottom-4 top-auto md:top-6 md:bottom-6 md:right-6 md:left-auto md:w-80 lg:w-96 z-[500] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence mode="wait">
          {!selectedIncidentId ? (
            <motion.div 
              key="queue"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="hidden md:flex flex-1 glass-panel border border-white/10 rounded-3xl flex-col overflow-hidden pointer-events-auto"
            >
              <div className="p-5 border-b border-white/5 bg-black/40">
                <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-primary" /> Response Priority
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {sortedQueue.map((incident, i) => (
                  <div 
                    key={incident.id} 
                    onClick={() => setSelectedIncidentId(incident.id)}
                    className="bg-black/40 border border-white/5 p-4 rounded-2xl cursor-pointer hover:bg-white/5 hover:border-white/20 transition-all group relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="text-xl font-black text-white/10 mono-number group-hover:text-white/20 transition-colors">
                          {(i + 1).toString().padStart(2, '0')}
                        </div>
                        {incident.ttc_minutes <= 30 && (
                          <div className="px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 text-[10px] font-bold tracking-widest uppercase animate-pulse">
                            TTC: {incident.ttc_minutes}m
                          </div>
                        )}
                      </div>
                      <div className={`w-2.5 h-2.5 rounded-full ${incident.severity === 'CRITICAL' ? 'bg-primary shadow-[0_0_10px_rgba(239,68,68,0.8)]' : incident.severity === 'HIGH' ? 'bg-orange-500' : 'bg-yellow-500'}`}></div>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2 tracking-wide">{incident.title}</h4>
                    <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                      <span><span className="mono-number text-white">{incident.people_affected}</span> AFFECTED</span>
                      <span><span className="mono-number text-white">{incident.report_count}</span> REPORTS</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="drawer"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="h-[50vh] md:h-auto md:flex-1 glass-panel border border-white/10 rounded-3xl flex flex-col overflow-hidden pointer-events-auto shadow-2xl"
            >
              {(() => {
                const incident = incidents.find(i => i.id === selectedIncidentId);
                if (!incident) return null;
                return (
                  <>
                    <div className="p-6 border-b border-white/5 bg-black/60 relative">
                      <button 
                        onClick={() => setSelectedIncidentId(null)} 
                        className="absolute top-6 right-6 text-muted-foreground hover:text-white bg-white/5 p-1.5 rounded-full transition-colors magnetic-target"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className={`inline-flex px-2 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase border mb-4 ${
                        incident.severity === 'CRITICAL' ? 'text-primary bg-primary/10 border-primary/30' : 
                        incident.severity === 'HIGH' ? 'text-orange-500 bg-orange-500/10 border-orange-500/30' : 
                        'text-yellow-500 bg-yellow-500/10 border-yellow-500/30'
                      }`}>
                        {incident.severity}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1 editorial-heading">{incident.title}</h3>
                      <p className="text-[10px] text-muted-foreground font-mono">ID: {incident.id}</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/30 border border-white/5 rounded-xl p-4 text-center">
                          <div className="text-3xl font-black text-white mono-number mb-1">{incident.people_affected}</div>
                          <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Affected</div>
                        </div>
                        <div className="bg-black/30 border border-white/5 rounded-xl p-4 text-center">
                          <div className="text-3xl font-black text-white mono-number mb-1">{incident.report_count}</div>
                          <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Reports</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-3 flex items-center gap-2">
                          <Target className="w-3 h-3 text-secondary" /> Urgency Signals
                        </h4>
                        <div className="space-y-2">
                          {["Trapped persons", "Multiple reports clustered", "Location highly populated"].map((sig, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {sig}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 space-y-3">
                        {incident.status === 'NEW' && (
                          <Button 
                            onClick={async () => {
                              try {
                                const res = await fetch(`/api/shelters/match?lat=${incident.latitude}&lon=${incident.longitude}&people=${incident.people_affected}`);
                                const match = await res.json().catch(() => ({}));
                                if (match.shelter_id) {
                                  alert(`✅ Matched with ${match.name} (${match.distance_km}km away). Seats remaining: ${match.available_capacity}`);
                                  await fetch(`/api/incidents/${incident.id}/status?status=RESPONDING`, { method: "PUT" });
                                  setSelectedIncidentId(null);
                                }
                              } catch (e) {
                                alert("No suitable shelter found within capacity limits.");
                              }
                            }}
                            className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold tracking-widest uppercase text-xs rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.3)] magnetic-target transition-all"
                          >
                            Match Shelter & Dispatch
                          </Button>
                        )}
                        {incident.status !== 'NEW' && (
                          <div className="w-full h-14 border border-white/20 bg-white/5 flex items-center justify-center text-muted-foreground font-bold tracking-widest uppercase text-xs rounded-xl">
                            Dispatched
                          </div>
                        )}
                      </div>

                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
