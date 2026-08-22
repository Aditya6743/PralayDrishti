"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ShieldAlert, CheckCircle2, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MarkSafePage() {
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    
    setIsLocating(true);
    // Simulate GPS ping before marking safe
    setTimeout(() => {
      setIsLocating(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-[120px]"></div>
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

      <div className="w-full max-w-xl relative z-10">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                  <ShieldCheck className="w-8 h-8 text-emerald-500" />
                </div>
                <h1 className="text-3xl font-black text-white uppercase tracking-widest mb-2">Mark As Safe</h1>
                <p className="text-xs text-slate-400 uppercase tracking-widest leading-relaxed">
                  Remove yourself from active rescue grids to free up NDRF bandwidth.
                </p>
              </div>

              <div className="glass-panel p-8 rounded-3xl border border-emerald-500/20 bg-white/[0.02]">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2 block">Mobile Number (For Verification)</label>
                    <input 
                      type="tel"
                      required 
                      value={phone} 
                      onChange={e=>setPhone(e.target.value)} 
                      placeholder="+91-XXXX-XXXXXX" 
                      className="w-full bg-black/60 border border-emerald-500/20 p-4 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50 placeholder:text-emerald-200/20 font-mono" 
                    />
                  </div>
                  
                  <Button type="submit" disabled={isLocating} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-widest text-xs h-14 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    {isLocating ? (
                      <span className="flex items-center gap-2"><MapPin className="w-4 h-4 animate-bounce" /> Verifying Grid Coordinates...</span>
                    ) : "Verify & Mark Safe"}
                  </Button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-8 relative">
                <div className="absolute inset-0 rounded-full border border-emerald-500/50 animate-ping opacity-50"></div>
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-black text-emerald-400 uppercase tracking-widest mb-4">Grid Updated</h2>
              
              <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-black/50 text-left space-y-4 mb-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Status</span>
                  <span className="text-xs font-mono text-emerald-400">MARKED SAFE</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Search Grid</span>
                  <span className="text-xs font-mono text-slate-300">EXCLUDED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">AI Priority</span>
                  <span className="text-xs font-mono text-slate-300">RESOLVED</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto mb-8">
                Your coordinates have been removed from the active search registry. Rescue bandwidth has been successfully reallocated to active SOS signals.
              </p>
              
              <Link href="/">
                <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 uppercase tracking-widest text-[10px] font-bold h-12 px-8">
                  Return to Dashboard
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
