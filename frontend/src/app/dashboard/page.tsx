"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Clock, MapPin, Users, Activity, Target, MessageSquare, AlertOctagon, CheckCircle2, Languages, X, Radio, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line } from "recharts";

type Report = {
  id: string; message: string; severity: string; confidence: number; category: string;
  location_text?: string; people_affected: number; requires_human_review: boolean;
  timestamp: string; ai_reasoning?: string; incident_id?: string;
  detected_language: string; anomaly_flag: boolean;
};

type TimelineEvent = {
  id: string; timestamp: string; description: string; event_type: string;
};

type Incident = {
  id: string; title: string; severity: string; people_affected: number; status: string;
  timeline?: TimelineEvent[];
};

export default function DashboardPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [stats, setStats] = useState({
    activeIncidents: 0, critical: 0, high: 0, reportsProcessed: 0, awaitingReview: 0, peopleAffected: 0, resolved: 0
  });
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showEndScreen, setShowEndScreen] = useState(false);

  useEffect(() => {
    fetch("/api/reports")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setReports(data);
      })
      .catch(console.error);
      
    fetch("/api/incidents")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setIncidents(data);
          setStats(prev => ({ ...prev, activeIncidents: data.length }));
        }
      }).catch(console.error);
    
    const fetchStats = () => {
      fetch("/api/analytics").then(r => r.json()).then(data => {
        setStats(prev => ({
          ...prev, reportsProcessed: data.reports_processed, critical: data.critical, high: data.high, 
          awaitingReview: data.awaiting_review, peopleAffected: data.people_affected, resolved: data.incidents_resolved
        }));
      });
    };
    fetchStats();

    const wsUrl = (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host + '/api/ws/live';
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "NEW_REPORT") {
        setReports(prev => [msg.data, ...prev]);
        fetchStats();
      } else if (msg.type === "INCIDENT_UPDATE") {
        setIncidents(prev => {
          const exists = prev.find(i => i.id === msg.data.id);
          if (exists) return prev.map(i => i.id === msg.data.id ? {...i, ...msg.data} : i);
          return [msg.data, ...prev];
        });
        fetchStats();
      } else if (msg.type === "NEW_NOTIFICATION" && msg.data.message === "JUDGE DEMO COMPLETED.") {
        setShowEndScreen(true);
      }
    };
    return () => ws.close();
  }, []);

  const openIncidentDrawer = async (incident: Incident) => {
    const res = await fetch(`/api/incidents/${incident.id}`);
    const fullData = await res.json();
    setSelectedIncident(fullData);
  };

  const updateIncidentStatus = async (id: string, status: string) => {
    await fetch(`/api/incidents/${id}/status?status=${status}`, { method: 'PUT' });
    if (selectedIncident && selectedIncident.id === id) {
      const res = await fetch(`/api/incidents/${id}`);
      setSelectedIncident(await res.json());
    }
  };

  const getSeverityColor = (sev: string) => {
    switch(sev) {
      case "CRITICAL": return "text-primary bg-primary/10 border-primary/30";
      case "HIGH": return "text-orange-500 bg-orange-500/10 border-orange-500/30";
      case "MEDIUM": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";
      default: return "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";
    }
  };

  const priorityMap: Record<string, number> = { "CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1 };
  const sortedIncidents = Array.isArray(incidents) ? [...incidents].sort((a, b) => {
    const pA = priorityMap[a?.severity] || 0;
    const pB = priorityMap[b?.severity] || 0;
    return pB - pA;
  }) : [];

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Intelligence Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <IntelligenceCard title="ACTIVE INCIDENTS" value={stats.activeIncidents} color="#3b82f6" />
        <IntelligenceCard title="CRITICAL" value={stats.critical} color="#ef4444" isAlert />
        <IntelligenceCard title="HIGH" value={stats.high} color="#f97316" />
        <IntelligenceCard title="REPORTS" value={stats.reportsProcessed} color="#ffffff" />
        <IntelligenceCard title="AWAITING REVIEW" value={stats.awaitingReview} color="#a855f7" />
        <IntelligenceCard title="PEOPLE AFFECTED" value={stats.peopleAffected} color="#ffffff" />
        <IntelligenceCard title="RESOLVED" value={stats.resolved} color="#10b981" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[72vh]">
        {/* Live Feed - Left */}
        <div className="lg:col-span-8 flex flex-col h-full glass-panel rounded-2xl overflow-hidden shadow-2xl relative">
          <div className="p-5 border-b border-white/5 bg-black/20 flex items-center justify-between z-10 backdrop-blur-md">
            <h2 className="text-sm font-bold tracking-widest flex items-center gap-2 editorial-heading">
              <Radio className="text-primary w-4 h-4 animate-pulse" /> LIVE DISASTER FEED
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            <AnimatePresence>
              {reports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`relative p-5 rounded-xl border bg-black/40 backdrop-blur-sm transition-colors magnetic-target w-full ${
                    report.severity === 'CRITICAL' 
                      ? 'border-primary/50 shadow-[inset_4px_0_0_0_rgba(239,68,68,1)] bg-primary/5 border-critical-pulse' 
                      : report.severity === 'HIGH' 
                      ? 'border-orange-500/30 shadow-[inset_4px_0_0_0_rgba(249,115,22,1)]' 
                      : 'border-white/10 shadow-[inset_4px_0_0_0_rgba(255,255,255,0.2)]'
                  }`}
                >
                  {report.anomaly_flag && (
                    <div className="absolute top-0 right-0 bg-primary/20 text-primary text-[10px] font-bold tracking-widest px-3 py-1 rounded-bl-xl border-b border-l border-primary/30 flex items-center gap-1 uppercase">
                      <AlertOctagon className="w-3 h-3" /> Possible False Report
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-0.5 rounded-sm text-[10px] font-bold tracking-widest uppercase border ${getSeverityColor(report.severity)}`}>
                        {report.severity}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{report.category}</span>
                      {report.detected_language !== "English" && (
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-sm border border-blue-500/20">
                          <Languages className="w-3 h-3" /> {report.detected_language}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground mono-number">{new Date(report.timestamp).toLocaleTimeString()}</span>
                  </div>
                  
                  <p className="text-white text-lg font-medium mb-4 leading-relaxed">"{report.message}"</p>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5"/> {report.location_text || "Unknown Coords"}</div>
                    <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5"/> <span className="mono-number">{report.people_affected}</span> affected</div>
                    <div className="flex items-center gap-1.5"><Target className="h-3.5 w-3.5"/> Confidence: <span className="mono-number text-white">{Math.round(report.confidence * 100)}%</span></div>
                  </div>

                  {report.ai_reasoning && (
                    <div className="bg-black/40 rounded-lg p-3 border border-white/5 text-sm flex gap-3 items-start">
                      <Info className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">AI Reasoning</div>
                        <div className="text-muted-foreground leading-relaxed text-xs">{report.ai_reasoning}</div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Priority Queue - Right */}
        <div className="lg:col-span-4 flex flex-col h-full glass-panel rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-white/5 bg-black/20 flex items-center justify-between z-10">
            <h2 className="text-sm font-bold tracking-widest flex items-center gap-2 editorial-heading">
              <AlertTriangle className="text-primary w-4 h-4" /> RESPONSE PRIORITY
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            <AnimatePresence>
              {sortedIncidents.map((incident, i) => (
                <motion.div
                  key={incident.id}
                  layout
                  onClick={() => openIncidentDrawer(incident)}
                  className="bg-black/30 border border-white/5 p-4 rounded-xl flex gap-4 items-center cursor-pointer glass-panel-hover magnetic-target w-full group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                  
                  <div className="text-2xl font-black text-white/10 w-6 mono-number group-hover:text-white/20 transition-colors">
                    {(i + 1).toString().padStart(2, '0')}
                  </div>
                  <div className="flex-1 relative z-10">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-sm text-white font-bold truncate pr-2 tracking-wide">{incident.title}</h4>
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${incident.severity === 'CRITICAL' ? 'bg-primary shadow-[0_0_10px_rgba(239,68,68,0.8)] border border-white/20' : incident.severity === 'HIGH' ? 'bg-orange-500' : 'bg-yellow-500'}`}></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-muted-foreground"><span className="mono-number text-white">{incident.people_affected}</span> AFFECTED</span>
                      <span className={`${
                        incident.status === 'NEW' ? 'text-primary' :
                        incident.status === 'ACKNOWLEDGED' ? 'text-yellow-400' :
                        incident.status === 'RESPONDING' ? 'text-blue-400' : 'text-emerald-400'
                      }`}>{incident.status}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Cinematic Incident Drawer Overlay */}
      <AnimatePresence>
        {selectedIncident && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-md"
              onClick={() => setSelectedIncident(null)}
            />
            <motion.div 
              initial={{ x: "100%", opacity: 0.5 }} 
              animate={{ x: 0, opacity: 1 }} 
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-background/95 border-l border-white/10 z-[70] flex flex-col shadow-2xl backdrop-blur-xl"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-start bg-black/20">
                <div>
                  <Badge className={`mb-4 px-3 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase border ${getSeverityColor(selectedIncident.severity)}`}>
                    {selectedIncident.severity} INCIDENT
                  </Badge>
                  <h2 className="text-3xl font-bold text-white mb-2 leading-tight editorial-heading">{selectedIncident.title}</h2>
                  <p className="text-xs text-muted-foreground font-mono">ID: {selectedIncident.id}</p>
                </div>
                <button onClick={() => setSelectedIncident(null)} className="text-muted-foreground hover:text-white bg-white/5 rounded-full p-2 transition-colors magnetic-target">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar relative">
                {/* AI Reasoning Section (Redesigned) */}
                <div className="glass-panel p-5 rounded-xl border border-white/10 bg-black/40">
                  <h3 className="text-[10px] font-bold text-muted-foreground mb-4 tracking-widest uppercase flex items-center gap-2">
                    <Target className="w-3 h-3 text-secondary" /> AI Assessment
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-end justify-between">
                      <div className="text-sm font-medium text-white">Confidence Score</div>
                      <div className="text-2xl font-bold mono-number text-secondary">96%</div>
                    </div>
                    {/* Confidence Bar */}
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: "96%" }} transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-secondary"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground mb-4 tracking-widest uppercase">Response Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button onClick={() => updateIncidentStatus(selectedIncident.id, 'ACKNOWLEDGED')} disabled={selectedIncident.status !== 'NEW'} variant="outline" className="h-12 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 magnetic-target text-xs tracking-wider uppercase font-bold">Acknowledge</Button>
                    <Button onClick={() => updateIncidentStatus(selectedIncident.id, 'RESPONDING')} disabled={selectedIncident.status === 'RESPONDING' || selectedIncident.status === 'RESOLVED'} className="h-12 bg-blue-600 hover:bg-blue-700 text-white magnetic-target text-xs tracking-wider uppercase font-bold">Dispatch Unit</Button>
                    <Button onClick={() => updateIncidentStatus(selectedIncident.id, 'RESOLVED')} disabled={selectedIncident.status === 'RESOLVED'} className="h-12 col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white magnetic-target text-xs tracking-wider uppercase font-bold">Mark Resolved</Button>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground mb-6 tracking-widest uppercase">Incident Timeline</h3>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:h-full before:w-px before:bg-white/10">
                    {selectedIncident.timeline?.map((event, i) => (
                      <div key={i} className="relative flex items-start group">
                        <div className="absolute left-0 mt-1.5 w-4 h-4 rounded-full border-4 border-background bg-secondary shadow-lg z-10"></div>
                        <div className="ml-8 w-full bg-black/20 border border-white/5 p-4 rounded-xl group-hover:bg-white/5 transition-colors">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-white text-xs uppercase tracking-wider">{event.event_type}</span>
                            <time className="text-[10px] text-muted-foreground font-mono">{new Date(event.timestamp).toLocaleTimeString()}</time>
                          </div>
                          <div className="text-muted-foreground text-sm leading-relaxed">{event.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cinematic End Screen Overlay */}
      <AnimatePresence>
        {showEndScreen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
            className="fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center text-center p-6 overflow-hidden"
          >
            {/* Ambient Background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

            <motion.div initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 1, type: 'spring' }} className="relative z-10">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white font-bold tracking-widest text-[10px] mb-12 uppercase">
                <Target className="w-4 h-4 text-primary" /> SYSTEM SUMMARY
              </div>
              
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/20 mb-2 tracking-tighter editorial-heading">
                FROM CHAOS
              </h1>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-secondary via-primary to-orange-500 mb-16 tracking-tighter editorial-heading">
                TO CLARITY
              </h1>
              
              <div className="flex flex-wrap justify-center items-center gap-10 mb-20">
                <div className="text-center">
                  <div className="text-6xl font-bold text-white mb-3 mono-number">{stats.reportsProcessed}</div>
                  <div className="text-muted-foreground font-bold tracking-widest text-[10px] uppercase">Reports Processed</div>
                </div>
                <div className="text-center text-white/20 font-light text-6xl hidden sm:block">→</div>
                <div className="text-center">
                  <div className="text-6xl font-bold text-white mb-3 mono-number">{stats.activeIncidents}</div>
                  <div className="text-muted-foreground font-bold tracking-widest text-[10px] uppercase">Incidents Formed</div>
                </div>
                <div className="text-center text-white/20 font-light text-6xl hidden sm:block">→</div>
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-3 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)] mono-number">{stats.critical}</div>
                  <div className="text-primary font-bold tracking-widest text-[10px] uppercase">Critical Prioritized</div>
                </div>
              </div>
              
              <Button onClick={() => setShowEndScreen(false)} variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black px-10 h-14 rounded-full text-xs font-bold tracking-widest uppercase transition-all magnetic-target">
                Return to Command Center
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Intelligence Stat Card Component with Microinteractions
function IntelligenceCard({ title, value, color, isAlert = false }: { title: string, value: number, color: string, isAlert?: boolean }) {
  // Generate fake sparkline data on client to prevent hydration mismatch
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    setData(Array.from({ length: 15 }).map(() => ({ val: Math.random() * 100 })));
  }, []);

  return (
    <div className={`glass-panel p-4 rounded-xl border relative overflow-hidden group transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl magnetic-target ${isAlert ? 'border-primary/30 bg-primary/5 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)]' : 'border-white/5 hover:border-white/20'}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10">
        <h3 className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-2">{title}</h3>
        <div className="text-3xl font-bold text-white mono-number mb-2">{value}</div>
        
        <div className="h-8 w-full opacity-50 group-hover:opacity-100 transition-opacity">
          {data.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line type="monotone" dataKey="val" stroke={color} strokeWidth={2} dot={false} isAnimationActive={true} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
