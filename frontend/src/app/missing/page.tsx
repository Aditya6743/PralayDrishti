"use client";

import { useState } from "react";
import { UserPlus, ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PublicMissingPage() {
  const [missingDesc, setMissingDesc] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const reportMissing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!missingDesc) return;
    
    // Save to localStorage so the Control Room can read it for the demo
    const existing = JSON.parse(localStorage.getItem('pralay_missing_db') || '[]');
    localStorage.setItem('pralay_missing_db', JSON.stringify([missingDesc, ...existing]));
    
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative">
      <Link href="/" className="absolute top-6 left-6 z-50 magnetic-target group">
        <div className="flex items-center gap-2">
          <ArrowLeft className="text-white w-4 h-4" />
          <span className="text-xs font-bold tracking-widest text-white uppercase">Back to Home</span>
        </div>
      </Link>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background z-0" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl glass-panel rounded-3xl border border-white/10 p-8 overflow-hidden"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <UserPlus className="w-6 h-6 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-widest">Missing Persons Registry</h1>
          <p className="text-xs text-slate-400 mt-2">Submit detailed descriptions. AI will cross-reference with rescued individuals globally.</p>
        </div>

        {!submitted ? (
          <form onSubmit={reportMissing} className="space-y-6">
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 block">Your Contact Number (For SMS Alerts)</label>
              <input 
                type="tel"
                required 
                value={contactPhone} 
                onChange={e=>setContactPhone(e.target.value)} 
                placeholder="+91-XXXX-XXXXXX" 
                className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 mb-6 font-mono" 
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 block">Subject Description (Clothing, Age, Traits)</label>
              <textarea 
                required 
                value={missingDesc} 
                onChange={e=>setMissingDesc(e.target.value)} 
                placeholder="e.g. 70 year old grandmother wearing blue saree, non-verbal..." 
                className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500" 
                rows={5} 
              />
            </div>
            <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              Submit to Global Registry
            </Button>
          </form>
        ) : (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
            <ShieldAlert className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-emerald-400 uppercase tracking-widest mb-2">Subject Registered</h2>
            <p className="text-sm text-slate-300 mb-8">
              The AI matching engine is now monitoring all global rescue logs for this description. You will be notified instantly if a match is found.
            </p>
            <Button onClick={() => { setMissingDesc(""); setSubmitted(false); }} className="bg-white/10 hover:bg-white/20 text-white">
              Submit Another Report
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
