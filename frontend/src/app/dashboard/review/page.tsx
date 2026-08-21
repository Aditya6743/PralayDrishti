"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
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

  const fetchQueue = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/review");
      const data = await res.json();
      if (Array.isArray(data)) {
        setQueue(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReview = async (reportId: string, finalSeverity: string, action: string) => {
    try {
      await fetch(`http://localhost:8000/api/review/${reportId}`, {
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
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Users className="h-8 w-8 text-purple-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Human-in-the-Loop Review Queue</h1>
          <p className="text-slate-400 text-sm">Low confidence reports or ambiguous language require manual verification.</p>
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {queue.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-slate-900 border border-slate-700 p-6 rounded-xl shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-purple-400 bg-purple-500/10 px-3 py-1 rounded text-sm font-semibold border border-purple-500/20">
                  <AlertTriangle className="w-4 h-4" /> REVIEW REQUIRED (Confidence: {Math.round(report.confidence * 100)}%)
                </div>
                <span className="text-xs text-slate-500">{new Date(report.timestamp).toLocaleString()}</span>
              </div>

              <div className="mb-6 p-4 bg-slate-950 rounded-lg border border-slate-800">
                <p className="text-sm text-slate-500 mb-1">Incoming Report:</p>
                <p className="text-lg text-white font-medium italic">"{report.message}"</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-slate-400 mb-2">AI Prediction</p>
                  <div className="p-3 rounded border border-slate-700 bg-slate-800/50">
                    <p className="font-bold text-white mb-1">Severity: {report.severity}</p>
                    <p className="text-sm text-slate-300">Category: {report.category}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-2">AI Reasoning for Flag</p>
                  <p className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded border border-slate-700">
                    {report.ai_reasoning}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 mt-2">
                <p className="text-sm font-medium text-slate-300 mb-3">Operator Decision:</p>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={() => handleReview(report.id, report.severity, "CONFIRMED")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Confirm {report.severity}
                  </Button>
                  
                  {report.severity !== 'CRITICAL' && (
                    <Button 
                      onClick={() => handleReview(report.id, "CRITICAL", "ESCALATED")}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Escalate to CRITICAL
                    </Button>
                  )}
                  
                  {report.severity !== 'LOW' && (
                    <Button 
                      onClick={() => handleReview(report.id, "LOW", "DOWNGRADED")}
                      className="bg-slate-700 hover:bg-slate-600 text-white"
                    >
                      Downgrade to LOW
                    </Button>
                  )}

                  <Button 
                    onClick={() => handleReview(report.id, "FALSE_POSITIVE", "FALSE_POSITIVE")}
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 ml-auto"
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Mark False Positive
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {queue.length === 0 && (
          <div className="text-center text-slate-500 py-20 border-2 border-dashed border-slate-800 rounded-xl">
            <CheckCircle className="w-12 h-12 text-green-500/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-300">Queue Empty</h3>
            <p className="text-sm">No reports currently require human review.</p>
          </div>
        )}
      </div>
    </div>
  );
}
