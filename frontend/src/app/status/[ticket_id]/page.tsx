"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, AlertTriangle, ShieldAlert, Activity, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function StatusPage() {
  const { ticket_id } = useParams();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/status/${ticket_id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
      
    // Polling for updates
    const interval = setInterval(() => {
      fetch(`/api/status/${ticket_id}`)
        .then(r => r.ok ? r.json() : null)
        .then(d => setData(d));
    }, 5000);
    return () => clearInterval(interval);
  }, [ticket_id]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono">LOADING TICKET...</div>;
  if (!data || data.detail) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500 font-mono">TICKET NOT FOUND</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans relative">
      <div className="max-w-2xl mx-auto relative z-10">
        
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-white mb-10 magnetic-target transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Safety
        </Link>
        
        <div className="glass-panel p-8 rounded-3xl border border-white/10 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-1">EMERGENCY TICKET</h1>
              <div className="text-4xl font-black text-white mono-number tracking-widest">{data.ticket_id}</div>
            </div>
            <div className={`px-3 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase border ${
              data.severity === 'CRITICAL' ? 'text-red-500 border-red-500/30 bg-red-500/10' : 
              data.severity === 'HIGH' ? 'text-orange-500 border-orange-500/30 bg-orange-500/10' : 
              'text-yellow-500 border-yellow-500/30 bg-yellow-500/10'
            }`}>
              {data.severity || 'EVALUATING'}
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative pl-6 border-l border-white/20 pb-6">
              <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[6.5px] top-0 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Report Received</h3>
              <p className="text-xs text-muted-foreground mt-1">Safely logged in the command center.</p>
            </div>
            <div className={`relative pl-6 border-l border-white/20 pb-6 ${data.processing_status === 'PROCESSED' ? '' : 'opacity-50'}`}>
              <div className={`absolute w-3 h-3 rounded-full -left-[6.5px] top-0 ${data.processing_status === 'PROCESSED' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-white/20'}`}></div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Analysis Complete</h3>
              <p className="text-xs text-muted-foreground mt-1">Severity and urgency calculated.</p>
            </div>
            <div className={`relative pl-6 pb-6 ${data.incident_status !== 'VERIFYING' && data.incident_status !== 'NEW' ? '' : 'opacity-50'}`}>
              <div className={`absolute w-3 h-3 rounded-full -left-[6.5px] top-0 ${data.incident_status !== 'VERIFYING' && data.incident_status !== 'NEW' ? 'bg-primary shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse' : 'bg-white/20'}`}></div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Rescue Dispatched</h3>
              <p className="text-xs text-muted-foreground mt-1">Status: {data.incident_status}</p>
            </div>
          </div>
        </div>

        {data.survival_guidance && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-8 rounded-3xl border border-primary/30 bg-primary/5">
            <h2 className="text-[10px] font-bold tracking-widest text-primary uppercase flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4" /> AI Survival Guidance
            </h2>
            <div className="text-white text-sm font-medium leading-relaxed space-y-2 whitespace-pre-line">
              {data.survival_guidance}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
