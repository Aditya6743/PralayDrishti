"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Clock, MapPin, Users, Activity, Target, MessageSquare, AlertOctagon, CheckCircle2, Languages, X, Radio } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Types
// ... [Omitted for brevity in thought, I will just include them] ...
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
    fetch("http://localhost:8000/api/reports")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setReports(data);
      })
      .catch(console.error);
      
    fetch("http://localhost:8000/api/incidents")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setIncidents(data);
          setStats(prev => ({ ...prev, activeIncidents: data.length }));
        }
      }).catch(console.error);
    
    const fetchStats = () => {
      fetch("http://localhost:8000/api/analytics").then(r => r.json()).then(data => {
        setStats(prev => ({
          ...prev, reportsProcessed: data.reports_processed, critical: data.critical, high: data.high, 
          awaitingReview: data.awaiting_review, peopleAffected: data.people_affected, resolved: data.incidents_resolved
        }));
      });
    };
    fetchStats();

    const ws = new WebSocket("ws://localhost:8000/api/ws/live");
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
    const res = await fetch(`http://localhost:8000/api/incidents/${incident.id}`);
    const fullData = await res.json();
    setSelectedIncident(fullData);
  };

  const updateIncidentStatus = async (id: string, status: string) => {
    await fetch(`http://localhost:8000/api/incidents/${id}/status?status=${status}`, { method: 'PUT' });
    if (selectedIncident && selectedIncident.id === id) {
      const res = await fetch(`http://localhost:8000/api/incidents/${id}`);
      setSelectedIncident(await res.json());
    }
  };

  const getSeverityColor = (sev: string) => {
    switch(sev) {
      case "CRITICAL": return "text-red-500 bg-red-500/10 border-red-500/30";
      case "HIGH": return "text-orange-500 bg-orange-500/10 border-orange-500/30";
      case "MEDIUM": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";
      default: return "text-green-500 bg-green-500/10 border-green-500/30";
    }
  };

  const priorityMap: Record<string, number> = { "CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1 };
  const sortedIncidents = Array.isArray(incidents) ? [...incidents].sort((a, b) => {
    const pA = priorityMap[a?.severity] || 0;
    const pB = priorityMap[b?.severity] || 0;
    return pB - pA;
  }) : [];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <StatCard title="Active Incidents" value={stats.activeIncidents} icon={<Activity />} />
        <StatCard title="Critical" value={stats.critical} className="text-red-500 border-red-500/30" />
        <StatCard title="High" value={stats.high} className="text-orange-500 border-orange-500/30" />
        <StatCard title="Reports Processed" value={stats.reportsProcessed} />
        <StatCard title="Awaiting Review" value={stats.awaitingReview} className="text-purple-400 border-purple-500/30" />
        <StatCard title="People Affected" value={stats.peopleAffected} icon={<Users />} />
        <StatCard title="Resolved" value={stats.resolved} className="text-green-500 border-green-500/30" icon={<CheckCircle2 />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Feed */}
        <div className="lg:col-span-2 flex flex-col h-[70vh]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Radio className="text-blue-500 animate-pulse" /> Live Disaster Feed
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            <AnimatePresence>
              {reports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`glass-panel p-4 rounded-xl border-l-4 ${report.severity === 'CRITICAL' ? 'border-l-red-500' : report.severity === 'HIGH' ? 'border-l-orange-500' : 'border-l-slate-700'} relative`}
                >
                  {report.anomaly_flag && (
                    <div className="absolute top-0 right-0 bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-bl-lg flex items-center gap-1 border-b border-l border-red-500/30">
                      <AlertOctagon className="w-3 h-3" /> POSSIBLE FALSE REPORT
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-2 mt-2">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getSeverityColor(report.severity)}`}>
                        {report.severity}
                      </span>
                      <span className="text-sm font-medium text-slate-300">{report.category}</span>
                      {report.detected_language !== "English" && (
                        <span className="flex items-center gap-1 text-xs text-blue-400 bg-blue-500/10 px-2 rounded border border-blue-500/20">
                          <Languages className="w-3 h-3" /> {report.detected_language}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">{new Date(report.timestamp).toLocaleTimeString()}</span>
                  </div>
                  
                  <p className="text-white text-lg font-medium mb-3 leading-snug">"{report.message}"</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-400 mb-3">
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3"/> {report.location_text || "Unknown"}</div>
                    <div className="flex items-center gap-1"><Users className="h-3 w-3"/> {report.people_affected} affected</div>
                    <div className="flex items-center gap-1"><Target className="h-3 w-3"/> Confidence: {Math.round(report.confidence * 100)}%</div>
                  </div>

                  {report.ai_reasoning && (
                    <div className="bg-slate-900/80 rounded-md p-3 border border-slate-800 text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="w-4 h-4 text-indigo-400" />
                        <strong className="text-indigo-400">AI Reasoning:</strong>
                      </div>
                      <span className="text-slate-300 leading-relaxed">{report.ai_reasoning}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Priority Queue */}
        <div className="lg:col-span-1 flex flex-col h-[70vh]">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <AlertTriangle className="text-red-500" /> Response Priority Queue
          </h2>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            <AnimatePresence>
              {sortedIncidents.map((incident, i) => (
                <motion.div
                  key={incident.id}
                  layout
                  onClick={() => openIncidentDrawer(incident)}
                  className="bg-slate-900 border border-slate-800 p-4 rounded-lg shadow-md flex gap-4 items-center cursor-pointer hover:border-slate-600 transition-colors"
                >
                  <div className="text-2xl font-black text-slate-700 w-6">{i + 1}.</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-bold truncate pr-2">{incident.title}</h4>
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${incident.severity === 'CRITICAL' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : incident.severity === 'HIGH' ? 'bg-orange-500' : 'bg-yellow-500'}`}></div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{incident.people_affected} affected</span>
                      <span className={`font-semibold ${
                        incident.status === 'NEW' ? 'text-red-400' :
                        incident.status === 'ACKNOWLEDGED' ? 'text-yellow-400' :
                        incident.status === 'RESPONDING' ? 'text-blue-400' : 'text-green-400'
                      }`}>{incident.status}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Incident Drawer Overlay */}
      <AnimatePresence>
        {selectedIncident && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
              onClick={() => setSelectedIncident(null)}
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-950 border-l border-slate-800 z-50 flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-900/50">
                <div>
                  <Badge className={`mb-3 ${getSeverityColor(selectedIncident.severity)}`}>{selectedIncident.severity}</Badge>
                  <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{selectedIncident.title}</h2>
                  <p className="text-sm text-slate-400">Incident ID: {selectedIncident.id.split('-')[0].toUpperCase()}</p>
                </div>
                <button onClick={() => setSelectedIncident(null)} className="text-slate-500 hover:text-white bg-slate-800 rounded-full p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Actions */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 mb-3 tracking-widest">RESPONSE ACTIONS</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={() => updateIncidentStatus(selectedIncident.id, 'ACKNOWLEDGED')} disabled={selectedIncident.status !== 'NEW'} variant="outline" className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10">Acknowledge</Button>
                    <Button onClick={() => updateIncidentStatus(selectedIncident.id, 'RESPONDING')} disabled={selectedIncident.status === 'RESPONDING' || selectedIncident.status === 'RESOLVED'} className="bg-blue-600 hover:bg-blue-700 text-white">Dispatch Team</Button>
                    <Button onClick={() => updateIncidentStatus(selectedIncident.id, 'RESOLVED')} disabled={selectedIncident.status === 'RESOLVED'} className="col-span-2 bg-green-600 hover:bg-green-700 text-white">Mark Resolved</Button>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 mb-4 tracking-widest">INCIDENT TIMELINE</h3>
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                    {selectedIncident.timeline?.map((event, i) => (
                      <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-slate-900 bg-slate-700 text-slate-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                        <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-slate-900 border border-slate-800 p-3 rounded shadow">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-slate-300 text-sm">{event.event_type}</span>
                            <time className="text-xs text-slate-500">{new Date(event.timestamp).toLocaleTimeString()}</time>
                          </div>
                          <div className="text-slate-400 text-sm">{event.description}</div>
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

      {/* End Screen Overlay */}
      <AnimatePresence>
        {showEndScreen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950 z-[100] flex flex-col items-center justify-center text-center p-6"
          >
            <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ delay: 0.5, type: 'spring' }}>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold tracking-widest text-sm mb-8 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                <Target className="w-5 h-5" /> SYSTEM SUMMARY
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 mb-4 tracking-tighter">
                FROM CHAOS
              </h1>
              <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 mb-12 tracking-tighter">
                TO CLARITY
              </h1>
              
              <div className="flex flex-wrap justify-center gap-8 mb-16">
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">{stats.reportsProcessed}</div>
                  <div className="text-slate-500 font-semibold tracking-wider text-sm uppercase">Reports Processed</div>
                </div>
                <div className="text-center text-slate-700 font-light text-5xl">→</div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">{stats.activeIncidents}</div>
                  <div className="text-slate-500 font-semibold tracking-wider text-sm uppercase">Incidents Formed</div>
                </div>
                <div className="text-center text-slate-700 font-light text-5xl">→</div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-red-500 mb-2 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">{stats.critical}</div>
                  <div className="text-red-400/80 font-semibold tracking-wider text-sm uppercase">Critical Cases Prioritized</div>
                </div>
              </div>
              
              <Button onClick={() => setShowEndScreen(false)} variant="outline" className="border-slate-700 text-slate-400 hover:text-white px-8">
                Return to Dashboard
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ title, value, icon, className = "" }: { title: string, value: number, icon?: React.ReactNode, className?: string }) {
  return (
    <Card className={`bg-slate-900/50 border-slate-800 backdrop-blur-sm ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-slate-400">{title}</CardTitle>
        {icon && <div className="text-slate-500 h-4 w-4">{icon}</div>}
      </CardHeader>
      <CardContent>
        <motion.div key={value} initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-2xl font-bold text-white">
          {value}
        </motion.div>
      </CardContent>
    </Card>
  );
}
