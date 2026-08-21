
"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { 
  AlertTriangle, ShieldAlert, Activity, CheckCircle2, Navigation, 
  MapPin, Clock, Users, X, Filter, Target 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false });

export default function TTCDashboard() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [filter, setFilter] = useState('ALL');
  const [droneDeployed, setDroneDeployed] = useState<string | null>(null);

  useEffect(() => {
    const fetchTriage = async () => {
      try {
        const res = await fetch(`/api/triage?filter=${filter}`);
        if (res.ok) {
          const data = await res.json();
          setTickets(data);
        }
      } catch (err) {}
    };
    fetchTriage();
    const interval = setInterval(fetchTriage, 3000);
    return () => clearInterval(interval);
  }, [filter]);

  const selectedTicket = tickets.find(t => t.ticket_id === selectedTicketId);

  const overridePriority = async (newPriority: string) => {
    if (!selectedTicketId) return;
    await fetch('/api/triage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticket_id: selectedTicketId, new_priority, operator: 'System Admin', reason: 'Manual Override' })
    });
    // Optimistic update
    setTickets(tickets.map(t => t.ticket_id === selectedTicketId ? { ...t, priority: newPriority } : t));
  };

  // Convert to MapComponent expected format
  const mapIncidents = tickets.map(t => ({
    id: t.ticket_id,
    ticket_id: t.ticket_id,
    title: t.hazard,
    severity: t.priority,
    latitude: t.lat,
    longitude: t.lng,
    people_affected: t.victim_status?.headcount || 0,
    report_count: 1,
    status: t.status
  }));

  const metrics = {
    total: tickets.length,
    critical: tickets.filter(t => t.priority === 'CRITICAL').length,
    high: tickets.filter(t => t.priority === 'HIGH').length,
    victims: tickets.reduce((sum, t) => sum + (t.victim_status?.headcount || 0), 0)
  };

  return (
    <div className="relative w-full h-full bg-black/40 overflow-hidden flex flex-col font-sans rounded-2xl border border-white/10 shadow-2xl">
      
      {/* HEADER */}
      <header className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,1)]" />
          <h1 className="text-white font-bold tracking-widest text-xs uppercase">TTC Triage Command</h1>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end"><span className="text-[9px] text-slate-500 uppercase tracking-widest">Active Incidents</span><span className="text-white font-bold">{metrics.total}</span></div>
          <div className="flex flex-col items-end"><span className="text-[9px] text-slate-500 uppercase tracking-widest">Victims at Risk</span><span className="text-yellow-500 font-bold">{metrics.victims}</span></div>
          <div className="flex flex-col items-end"><span className="text-[9px] text-slate-500 uppercase tracking-widest">Critical (&lt;20m)</span><span className="text-red-500 font-bold drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">{metrics.critical}</span></div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT: Live Incident Queue */}
        <div className="w-[400px] border-r border-white/5 bg-black/80 backdrop-blur-xl flex flex-col z-20 shrink-0">
          <div className="p-4 border-b border-white/5">
            <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
              <Filter className="w-3 h-3" /> Filters
            </h2>
            <div className="flex flex-wrap gap-2">
              {['ALL', 'CRITICAL', 'HIGH', 'FLOOD', 'FIRE'].map(f => (
                <button 
                  key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase rounded-full border ${filter === f ? 'bg-white text-black border-white' : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {tickets.map(t => {
              const isSelected = t.ticket_id === selectedTicketId;
              let color = 'border-emerald-500/30 bg-emerald-500/5 text-emerald-500';
              if (t.priority === 'CRITICAL') color = 'border-red-500/50 bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)]';
              else if (t.priority === 'HIGH') color = 'border-orange-500/30 bg-orange-500/5 text-orange-500';
              
              return (
                <motion.div 
                  key={t.ticket_id} layoutId={t.ticket_id}
                  onClick={() => setSelectedTicketId(t.ticket_id)}
                  className={`glass-panel p-4 rounded-xl border cursor-pointer transition-all duration-300 ${color} ${isSelected ? 'ring-1 ring-current' : 'opacity-80 hover:opacity-100 hover:scale-[1.02]'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black tracking-wider text-white bg-black/50 px-2 py-0.5 rounded">{t.ticket_id}</span>
                      <span className="text-[9px] font-bold tracking-widest uppercase flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {t.ttc_minutes}m SURVIVAL
                      </span>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">{t.hazard} EMERGENCY</h3>
                  
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[9px] font-bold text-slate-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded flex items-center gap-1">
                      <Users className="w-3 h-3" /> {t.victim_status?.headcount || 1}
                    </span>
                    {t.victim_status?.trapped && <span className="text-[9px] font-bold text-red-300 bg-red-500/20 border border-red-500/30 px-2 py-0.5 rounded flex items-center gap-1">⚠️ TRAPPED</span>}
                    {t.victim_status?.water_rising && <span className="text-[9px] font-bold text-blue-300 bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 rounded flex items-center gap-1">⚠️ WATER RISING ({t.victim_status.water_depth})</span>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CENTER: Live Map */}
        <div className="flex-1 relative bg-black h-full">
          <MapComponent 
            incidents={mapIncidents} 
            selectedIncidentId={selectedTicketId} 
            onMarkerClick={setSelectedTicketId} 
          />
        </div>

        {/* RIGHT: Incident Telemetry Drawer */}
        <AnimatePresence>
          {selectedTicket && (
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-[450px] absolute right-0 top-0 bottom-0 border-l border-white/10 bg-black/80 backdrop-blur-2xl z-30 flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <div>
                  <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Telemetry Sync</h2>
                  <div className="text-xl font-black text-white tracking-wider">{selectedTicket.ticket_id}</div>
                </div>
                <button onClick={() => setSelectedTicketId(null)} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-8 custom-scrollbar">
                
                {/* Survival Progress */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <h3 className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">TTC Countdown</h3>
                    <div className="text-xl font-black text-red-500 mono-number">{selectedTicket.ttc_minutes} MIN</div>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: '100%' }} animate={{ width: `${Math.min(100, (selectedTicket.ttc_minutes / 180) * 100)}%` }} 
                      className={`h-full ${selectedTicket.priority === 'CRITICAL' ? 'bg-red-500' : 'bg-orange-500'}`}
                    />
                  </div>
                </div>

                {/* Victim Details */}
                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-3">Victim Condition</h3>
                  <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-3">
                    <div className="flex justify-between"><span className="text-xs text-slate-400">Headcount</span><span className="text-xs font-bold text-white">{selectedTicket.victim_status?.headcount || 1}</span></div>
                    <div className="flex justify-between"><span className="text-xs text-slate-400">Hazard Type</span><span className="text-xs font-bold text-white uppercase">{selectedTicket.hazard}</span></div>
                    <div className="flex justify-between"><span className="text-xs text-slate-400">Phone</span><span className="text-xs font-bold text-white">{selectedTicket.phone || 'Unknown'}</span></div>
                    {selectedTicket.is_duplicate && <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold text-center rounded">DUPLICATE DETECTED</div>}
                  </div>
                </div>

                {/* Deterioration Flags */}
                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-3">Deterioration Factors</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedTicket.victim_status || {}).map(([k, v]) => {
                      if (v && k !== 'headcount') return (
                        <div key={k} className="p-2 border border-red-500/20 bg-red-500/5 rounded text-[10px] font-bold text-red-400 uppercase text-center">
                          {k.replace('_', ' ')}: {String(v)}
                        </div>
                      );
                      return null;
                    })}
                  </div>
                </div>

                
                {/* Autonomous Drone Dispatch */}
                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" /> Tactical Response
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="h-10 text-[9px] font-bold uppercase rounded border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors">
                      Dispatch Ground Team
                    </button>
                    <button 
                      onClick={() => setDroneDeployed(selectedTicket.ticket_id)}
                      disabled={droneDeployed === selectedTicket.ticket_id}
                      className={`h-10 text-[9px] font-bold uppercase rounded border transition-colors ${
                        droneDeployed === selectedTicket.ticket_id 
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 cursor-not-allowed' 
                        : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black'
                      }`}
                    >
                      {droneDeployed === selectedTicket.ticket_id ? 'UAV En Route' : 'Deploy Recon Drone'}
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {droneDeployed === selectedTicket.ticket_id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 p-3 rounded bg-black border border-emerald-500/30 font-mono text-[9px] text-emerald-400 uppercase tracking-widest overflow-hidden"
                      >
                        <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                          > MAVLink Connection Established<br/>
                          > Uploading GPS Coordinates...<br/>
                          > UAV Launched. ETA: 4m 12s<br/>
                          > Streaming Thermal Optics...
                        </motion.div>
                        <div className="mt-2 h-16 w-full border border-emerald-500/20 bg-emerald-900/20 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:10px_10px]" />
                          <div className="w-full h-px bg-emerald-500/50 animate-[scan_2s_linear_infinite]" />
                          <span className="relative z-10 text-emerald-500/50">NO TARGET IN SIGHT</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Manual Override */}
                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-3">Manual Priority Override</h3>
                  <div className="flex gap-2">
                    {['CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map(p => (
                      <button 
                        key={p} onClick={() => overridePriority(p)}
                        className={`flex-1 py-2 text-[9px] font-bold rounded uppercase border ${selectedTicket.priority === p ? 'bg-white text-black border-white' : 'bg-transparent text-slate-400 border-white/10 hover:border-white/30'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
              
              <div className="p-6 border-t border-white/10 bg-black">
                <a href={`/status.html?ticket=${selectedTicket.ticket_id}&token=${selectedTicket.access_token}`} target="_blank" rel="noreferrer">
                  <Button className="w-full h-12 bg-primary hover:bg-red-600 text-white text-xs font-bold tracking-widest uppercase">
                    Open Citizen Channel <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
