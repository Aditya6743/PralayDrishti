"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, AlertTriangle, CheckCircle, XCircle, Target, Activity, ShieldAlert, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Report = {
  id: string;
  message: string;
  severity: string;
  confidence: number;
  category: string;
  ai_reasoning: string;
  timestamp: string;
};

export default function ReviewPage() {
  const [queue, setQueue] = useState<Report[]>([]);

  useEffect(() => {
    fetchQueue();
  }, []);

  async function fetchQueue() {
    try {
      const res = await fetch("/api/review");
      const data = await res.json().catch(() => null);
      if (Array.isArray(data)) {
        setQueue(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReview = async (reportId: string, finalSeverity: string, action: string) => {
    try {
      await fetch(`/api/review/${reportId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          final_prediction: finalSeverity,
          reviewer_action: action,
          reviewer_notes: "Reviewed from Dashboard"
        })
      });
      // Remove from UI
      setQueue(q => q.filter(r => r.id !== reportId));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide editorial-heading flex items-center gap-3">
            <Users className="h-6 w-6 text-purple-400" /> DECISION LABORATORY
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Human-in-the-loop verification for uncertain intelligence signals.</p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-lg text-purple-400 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
          <Activity className="w-4 h-4 animate-pulse" /> {queue.length} Pending
        </div>
      </div>

      <div className="space-y-8">
        <AnimatePresence mode="popLayout">
          {queue.map((report) => (
            <motion.div
              key={report.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="glass-panel border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden group magnetic-target w-full"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-500 to-indigo-500"></div>
              
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3 text-purple-400 text-[10px] font-bold tracking-widest uppercase">
                  <ShieldAlert className="w-4 h-4" /> HUMAN REVIEW RECOMMENDED
                </div>
                <span className="text-xs text-muted-foreground mono-number">{new Date(report.timestamp).toLocaleString()}</span>
              </div>

              <div className="grid md:grid-cols-2 gap-10 mb-8">
                {/* Left Column: Report & Confidence */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mb-3">Intercepted Signal</h3>
                    <p className="text-2xl text-white font-medium leading-relaxed italic border-l-2 border-white/20 pl-4 py-1">&quot;{report.message}&quot;</p>
                  </div>

                  {/* Confidence Spectrum */}
                  <div className="bg-black/30 p-5 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">AI Confidence Spectrum</h3>
                      <span className="text-2xl font-bold mono-number text-white">{Math.round(report.confidence * 100)}%</span>
                    </div>
                    
                    <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                      {/* Gradient background mapping LOW (red) to HIGH (green) - but here it's uncertainty so LOW is bad */}
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 opacity-30"></div>
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${report.confidence * 100}%` }} 
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute top-0 left-0 h-full bg-white shadow-[0_0_10px_white]"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                      <span>LOW</span>
                      <span>HIGH</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: AI Interpretation */}
                <div className="bg-black/40 p-6 rounded-xl border border-white/5 space-y-6">
                  <div>
                    <h3 className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mb-2">AI Interpretation</h3>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-sm text-xs font-bold tracking-widest uppercase border ${
                        report.severity === 'CRITICAL' ? 'text-primary bg-primary/10 border-primary/30' : 
                        report.severity === 'HIGH' ? 'text-orange-500 bg-orange-500/10 border-orange-500/30' : 
                        'text-yellow-500 bg-yellow-500/10 border-yellow-500/30'
                      }`}>
                        {report.severity} SEVERITY
                      </span>
                      <span className="text-sm font-medium text-white">{report.category}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mb-2">AI Reasoning</h3>
                    <div className="text-sm text-slate-300 leading-relaxed">
                      {report.ai_reasoning}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="border-t border-white/10 pt-6 flex items-center justify-between">
                <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Operator Decision Required</div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={() => handleReview(report.id, "FALSE_POSITIVE", "FALSE_POSITIVE")}
                    variant="outline"
                    className="border-white/10 text-muted-foreground hover:bg-white/5 hover:text-white h-12 px-6 rounded-lg text-xs tracking-wider uppercase font-bold magnetic-target"
                  >
                    <XCircle className="w-4 h-4 mr-2" /> False Positive
                  </Button>
                  
                  {report.severity !== 'CRITICAL' && (
                    <Button 
                      onClick={() => handleReview(report.id, "CRITICAL", "ESCALATED")}
                      className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 h-12 px-6 rounded-lg text-xs tracking-wider uppercase font-bold magnetic-target"
                    >
                      <ArrowRight className="w-4 h-4 mr-2 -rotate-45" /> Escalate to Critical
                    </Button>
                  )}
                  
                  <Button 
                    onClick={() => handleReview(report.id, report.severity, "CONFIRMED")}
                    className="bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)] h-12 px-8 rounded-lg text-xs tracking-wider uppercase font-bold magnetic-target"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Confirm {report.severity}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {queue.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-32 border border-white/5 bg-black/20 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent"></div>
            <CheckCircle className="w-16 h-16 text-emerald-500/50 mx-auto mb-6 relative z-10" />
            <h3 className="text-2xl font-bold text-white mb-2 editorial-heading relative z-10">Queue Empty</h3>
            <p className="text-muted-foreground tracking-wide relative z-10">All uncertain signals have been resolved.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
