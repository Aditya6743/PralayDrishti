"use client";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { 
  AlertTriangle, ShieldAlert, Activity, CheckCircle2, Navigation, 
  MapPin, Clock, Users, X, Filter, Target, ArrowRight 
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
        const res = await fetch('/api/incidents?t=' + Date.now());
        if (res.status === 500) {
          console.error("Database schema error detected. Auto-migrating...");
          await fetch('/api/demo/migrate');
        }
        if (res.ok) {
          const incidents = await res.json();
          const mappedTickets = incidents.map((inc: any) => ({
            ticket_id: inc.id.toString(),
            hazard: inc.category,
            lat: inc.latitude,
            lng: inc.longitude,
            status: inc.status === 'OPEN' ? 'QUEUED' : inc.status,
            created_at: new Date(inc.updated_at).getTime(),
            ttc_minutes: inc.severity === 'CRITICAL' ? 15 : inc.severity === 'HIGH' ? 45 : 120,
            priority: inc.severity,
            victim_status: { headcount: inc.people_affected, trapped: inc.severity === 'CRITICAL' },
            is_duplicate: false,
            title: inc.title || `${inc.category} EMERGENCY`
          }));
          
          mappedTickets.sort((a: any, b: any) => a.ttc_minutes - b.ttc_minutes);
          setTickets(mappedTickets);
        }
      } catch (e) {
        console.error(e);
      }
    };
    
    fetchTriage();
    const interval = setInterval(fetchTriage, 3000);
    return () => clearInterval(interval);
  }, []);

  const overridePriority = async (newPriority: string) => {
    if (!selectedTicketId) return;
    setTickets(prev => prev.map(t => t.ticket_id === selectedTicketId ? { ...t, priority: newPriority, ttc_minutes: newPriority === 'CRITICAL' ? 15 : 60 } : t));
  };

  const mapIncidents = useMemo(() => {
    return tickets.map(t => ({
      id: t.ticket_id,
      title: t.title,
      severity: t.priority,
      latitude: t.lat,
      longitude: t.lng,
      people_affected: t.victim_status?.headcount || 1,
      report_count: 1,
      status: t.status
    }));
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    if (filter === 'ALL') return tickets;
    if (filter === 'CRITICAL' || filter === 'HIGH') return tickets.filter(t => t.priority === filter);
    return tickets.filter(t => t.hazard === filter);
  }, [tickets, filter]);

  const selectedTicket = tickets.find(t => t.ticket_id === selectedTicketId);

  const metrics = {
    total: tickets.length,
    critical: tickets.filter(t => t.priority === 'CRITICAL').length,
    victims: tickets.reduce((acc, t) => acc + (t.victim_status?.headcount || 1), 0)
  };

  return (
    <div className="relative w-full h-full bg-[#020617] overflow-hidden flex flex-col font-sans rounded-2xl border border-white/10 shadow-2xl">
      {/* HEADER */}
      <header className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-red-500" />
            <h1 className="text-sm font-bold tracking-widest text-white uppercase hidden sm:block">Control Room</h1>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex flex-col items-end"><span className="text-[9px] text-slate-500 uppercase tracking-widest">Active Incidents</span><span className="text-white font-bold">{metrics.total}</span></div>
          <div className="flex flex-col items-end"><span className="text-[9px] text-slate-500 uppercase tracking-widest">Victims at Risk</span><span className="text-yellow-500 font-bold">{metrics.victims}</span></div>
          <div className="flex flex-col items-end"><span className="text-[9px] text-slate-500 uppercase tracking-widest">Critical (&lt;20m)</span><span className="text-red-500 font-bold drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">{metrics.critical}</span></div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* LEFT PANEL: TICKETS QUEUE */}
        <div className="w-full h-[45vh] md:h-full md:w-[400px] lg:w-[450px] border-b md:border-b-0 md:border-r border-white/10 bg-black/80 backdrop-blur-xl flex flex-col z-20 shrink-0 order-2 md:order-1">
          <div className="p-4 border-b border-white/5 shrink-0">
            <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
              <Filter className="w-3 h-3" /> Filters
            </h2>
            <div className="flex flex-wrap gap-2">
              {['ALL', 'CRITICAL', 'HIGH', 'FLOOD', 'FIRE'].map(f => (
                <button 
                  key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase rounded-full border transition-colors ${filter === f ? 'bg-white text-black border-white' : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {filteredTickets.map(t => {
              const isSelected = t.ticket_id === selectedTicketId;
              let color = 'border-emerald-500/30 bg-emerald-500/5 text-emerald-500';
              if (t.priority === 'CRITICAL') color = 'border-red-500/50 bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)]';
              else if (t.priority === 'HIGH') color = 'border-orange-500/30 bg-orange-500/5 text-orange-500';
              
              return (
                <motion.div 
                  key={t.ticket_id} layoutId={t.ticket_id}
                  onClick={() => setSelectedTicketId(t.ticket_id)}
                  className={`glass-panel p-4 rounded-xl border cursor-pointer transition-all duration-300 ${color} ${isSelected ? 'ring-1 ring-current bg-opacity-20' : 'opacity-80 hover:opacity-100'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black tracking-wider text-white bg-black/50 px-2 py-0.5 rounded border border-white/10">{t.ticket_id.substring(0, 8)}</span>
                      <span className="text-[9px] font-bold tracking-widest uppercase flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {t.ttc_minutes}m SURVIVAL
                      </span>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 leading-tight">{t.title}</h3>
                  
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[9px] font-bold text-slate-300 bg-white/5 border border-white/10 px-2 py-1 rounded flex items-center gap-1">
                      <Users className="w-3 h-3" /> {t.victim_status?.headcount || 1} AFFECTED
                    </span>
                    {t.victim_status?.trapped && <span className="text-[9px] font-bold text-red-300 bg-red-500/20 border border-red-500/30 px-2 py-1 rounded flex items-center gap-1">⚠️ TRAPPED</span>}
                  </div>
                </motion.div>
              );
            })}
            {filteredTickets.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                <CheckCircle2 className="w-12 h-12 opacity-20" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-center">No active incidents matching criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* CENTER PANEL: MAP */}
        <div className="flex-1 relative bg-[#020617] h-[55vh] md:h-full order-1 md:order-2 shrink-0 md:shrink">
          <MapComponent 
            incidents={mapIncidents} 
            selectedIncidentId={selectedTicketId} 
            onMarkerClick={setSelectedTicketId} 
          />
        </div>

        {/* RIGHT PANEL / MOBILE OVERLAY: INCIDENT DETAILS */}
        <AnimatePresence>
          {selectedTicket && (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute md:relative inset-0 md:inset-auto w-full md:w-[400px] lg:w-[450px] bg-black/95 md:bg-black/80 backdrop-blur-3xl md:backdrop-blur-xl border-l border-white/10 flex flex-col z-[500] shrink-0 order-3"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02] shrink-0">
                <div>
                  <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Telemetry Sync</h2>
                  <div className="text-xl font-black text-white tracking-wider">{selectedTicket.ticket_id.substring(0, 8)}</div>
                </div>
                <button onClick={() => setSelectedTicketId(null)} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors bg-white/5 border border-white/10">
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
                  <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-3 bg-white/5">
                    <div className="flex justify-between"><span className="text-xs text-slate-400">Headcount</span><span className="text-xs font-bold text-white">{selectedTicket.victim_status?.headcount || 1}</span></div>
                    <div className="flex justify-between"><span className="text-xs text-slate-400">Hazard Type</span><span className="text-xs font-bold text-white uppercase">{selectedTicket.hazard}</span></div>
                    <div className="flex justify-between"><span className="text-xs text-slate-400">Location</span><span className="text-xs font-bold text-white text-right max-w-[60%] truncate">{selectedTicket.title}</span></div>
                  </div>
                </div>

                {/* Autonomous Drone Dispatch */}
                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" /> Tactical Response
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={() => setDroneDeployed(selectedTicket.ticket_id)}
                      disabled={droneDeployed === selectedTicket.ticket_id}
                      className={`w-full h-12 text-[10px] font-bold uppercase tracking-widest rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                        droneDeployed === selectedTicket.ticket_id 
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 cursor-not-allowed' 
                        : 'border-blue-500/50 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white'
                      }`}
                    >
                      <Navigation className="w-4 h-4" />
                      {droneDeployed === selectedTicket.ticket_id ? 'UAV En Route' : 'Deploy Recon Drone'}
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {droneDeployed === selectedTicket.ticket_id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 p-4 rounded-lg bg-black border border-emerald-500/30 font-mono text-[10px] text-emerald-400 uppercase tracking-widest overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                      >
                        <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="space-y-1">
                          <div>&gt; MAVLink Connection Established</div>
                          <div>&gt; Uploading GPS Coordinates...</div>
                          <div className="text-white">&gt; UAV Launched. ETA: 4m 12s</div>
                        </motion.div>
                        <div className="mt-4 h-24 w-full border border-emerald-500/20 bg-emerald-900/20 flex items-center justify-center relative overflow-hidden rounded">
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:10px_10px]" />
                          <div className="w-full h-px bg-emerald-500/50 animate-[scan_2s_linear_infinite]" />
                          <span className="relative z-10 text-emerald-500/50 bg-black/50 px-2 py-1 rounded">NO TARGET IN SIGHT</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Manual Override */}
                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-3">Priority Override</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
                      <button 
                        key={p} onClick={() => overridePriority(p)}
                        className={`py-2.5 text-[9px] font-bold rounded uppercase tracking-widest border transition-colors ${selectedTicket.priority === p ? 'bg-white text-black border-white' : 'bg-black text-slate-400 border-white/10 hover:border-white/30 hover:bg-white/5'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-white/10 bg-black/50 shrink-0">
                <Button className="w-full h-14 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold tracking-[0.2em] uppercase rounded-xl">
                  Open Citizen Channel <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
