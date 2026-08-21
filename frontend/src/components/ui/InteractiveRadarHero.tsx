"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, ShieldAlert, Users, AlertTriangle, MapPin, Activity } from "lucide-react";
import Radar from "@/components/ui/Radar";
import Magnetic from "@/components/ui/Magnetic";

export default function InteractiveRadarHero() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-transparent">
      
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle topographic / radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05)_0%,transparent_60%)]" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_20%,transparent_100%)]" />
        <div className="absolute inset-0 bg-noise opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="max-w-[1400px] w-full mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center pt-20">
        
        {/* --- LEFT: Typography & CTAs --- */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-start text-left max-w-2xl"
        >
          {/* Top Label */}
          <div className="mb-6 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
              Real-Time Disaster Intelligence
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1] editorial-heading">
            See the crisis.<br/>
            Understand the signal.<br/>
            <span className="text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">Prioritize the response.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-slate-400 mb-10 font-medium tracking-wide max-w-lg leading-relaxed">
            PralayDrishti uses AI to transform thousands of unstructured emergency reports into prioritized, actionable incidents.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <button className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold tracking-[0.1em] text-xs rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_rgba(239,68,68,0.3)] hover:shadow-[0_0_60px_rgba(239,68,68,0.5)]">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  ENTER CONTROL ROOM
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              </button>
            </Link>
            
            <button className="group relative w-full sm:w-auto px-8 py-4 bg-transparent border border-white/10 hover:border-white/30 hover:bg-white/5 text-white font-bold tracking-[0.1em] text-xs rounded-full transition-all">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                WATCH INTELLIGENCE
              </span>
            </button>
          </div>

          {/* Bottom Tags */}
          <div className="mt-16 flex flex-wrap items-center gap-6 text-[9px] font-bold tracking-[0.15em] text-slate-500 uppercase">
            <span className="flex items-center gap-1.5"><Activity className="w-3 h-3" /> AI TRIAGE</span>
            <span className="flex items-center gap-1.5"><Activity className="w-3 h-3" /> REAL-TIME</span>
            <span className="flex items-center gap-1.5"><Activity className="w-3 h-3" /> HUMAN-IN-THE-LOOP</span>
          </div>
        </motion.div>


        {/* --- RIGHT: The Visualization Data Graph --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center lg:justify-end"
        >
          
          {/* Central AI Node with Interactive WebGL Radar Behind It */}
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            
            {/* The Interactive Radar Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] mix-blend-screen pointer-events-auto [mask-image:radial-gradient(circle_at_center,white_30%,transparent_60%)] -z-10">
              <Radar
                speed={1.0}
                scale={0.7}
                ringCount={8}
                spokeCount={12}
                color="#ff3333" 
                backgroundColor="transparent"
                falloff={2.0}
                brightness={2.5}
                enableMouseInteraction={true}
                mouseInfluence={1.0}
              />
            </div>

            <div className="relative flex items-center justify-center w-28 h-28 z-10">
              {/* Spinning rings */}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-white/10 border-dashed" />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-2 rounded-full border border-white/5" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-b from-slate-900 to-black border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.3)]">
                <ShieldAlert className="w-8 h-8 text-white opacity-80" />
              </div>
            </div>
            <div className="mt-4 text-center z-10 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5">
              <div className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">
                Pralay<span className="text-red-500">Drishti</span>
              </div>
              <div className="text-[9px] font-semibold tracking-[0.1em] text-slate-500 uppercase mt-1">AI Engine</div>
            </div>
          </div>

          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden sm:block">
            {/* Lines from left to center (Incoming reports) */}
            {Array.from({length: 12}).map((_, i) => {
              const startY = 100 + i * 35;
              return (
                <path 
                  key={`in-${i}`}
                  d={`M 0 ${startY} C 100 ${startY}, 150 300, 33% 300`} 
                  stroke="rgba(255,255,255,0.05)" 
                  strokeWidth="1" 
                  fill="none" 
                />
              )
            })}
            
            {/* Lines from center to right cards (Extracted Incidents) */}
            <path d="M 33% 300 C 50% 300, 60% 120, 100% 120" stroke="rgba(239,68,68,0.2)" strokeWidth="1.5" fill="none" strokeDasharray="4,4" className="animate-[pulse_2s_infinite]" />
            <path d="M 33% 300 C 50% 300, 60% 300, 100% 300" stroke="rgba(249,115,22,0.2)" strokeWidth="1.5" fill="none" strokeDasharray="4,4" />
            <path d="M 33% 300 C 50% 300, 60% 480, 100% 480" stroke="rgba(234,179,8,0.2)" strokeWidth="1.5" fill="none" strokeDasharray="4,4" />
          </svg>

          {/* Incoming Particles (Left side) */}
          <div className="absolute inset-0 z-10 overflow-hidden hidden sm:block [mask-image:linear-gradient(to_right,white_20%,transparent_40%)]">
            {Array.from({length: 30}).map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                initial={{ x: -50, y: Math.random() * 600, opacity: 0 }}
                animate={{ 
                  x: 300,
                  y: 300,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "circIn"
                }}
                className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]"
              />
            ))}
          </div>

          {/* Right Side Glass Cards (The Structured Output) */}
          <div className="absolute right-0 top-0 bottom-0 w-[280px] md:w-[320px] flex flex-col justify-center gap-6 z-30">
            
            {/* Critical Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="glass-panel p-4 rounded-xl border border-red-500/30 bg-red-500/5 backdrop-blur-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]" />
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[9px] font-bold tracking-widest text-red-500 uppercase">Critical • 96%</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white uppercase tracking-wider mb-0.5">5 People Trapped</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> Sector 12, New Delhi</div>
                </div>
              </div>
            </motion.div>

            {/* High Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="glass-panel p-4 rounded-xl border border-orange-500/20 bg-black/60 backdrop-blur-xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold tracking-widest text-orange-500 uppercase">High • 89%</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <ShieldAlert className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white uppercase tracking-wider mb-0.5">Flooding Reported</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> Sector 14, New Delhi</div>
                </div>
              </div>
            </motion.div>

            {/* Medium Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="glass-panel p-4 rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold tracking-widest text-yellow-500 uppercase">Medium • 74%</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <Users className="w-4 h-4 text-slate-300" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white uppercase tracking-wider mb-0.5">Road Blocked</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> Sector 8, New Delhi</div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Stats Bar (Bottom center) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-4 left-1/3 -translate-x-1/2 z-30 flex items-center gap-6 glass-panel px-6 py-4 rounded-2xl border border-white/5 bg-black/80 backdrop-blur-md"
          >
            <div>
              <div className="text-[9px] font-bold tracking-widest text-slate-500 uppercase mb-1">Reports Analyzed</div>
              <div className="text-2xl font-black text-white mono-number">1,284</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <div className="text-[9px] font-bold tracking-widest text-slate-500 uppercase mb-1">Active Incidents</div>
              <div className="text-2xl font-black text-orange-400 mono-number">24</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <div className="text-[9px] font-bold tracking-widest text-slate-500 uppercase mb-1">Critical</div>
              <div className="text-2xl font-black text-red-500 mono-number">7</div>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </div>
  );
}
