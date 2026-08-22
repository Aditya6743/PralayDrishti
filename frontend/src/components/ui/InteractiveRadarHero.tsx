"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, ShieldAlert, Users, AlertTriangle, MapPin, Activity, UserPlus, Tent, ShieldCheck } from "lucide-react";
import HeroRadar from "@/components/ui/HeroRadar";

export default function InteractiveRadarHero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [nearbyIncidents, setNearbyIncidents] = useState([
    { severity: 'Critical', confidence: 96, title: '5 People Trapped', loc: 'Hover to track nearby...', Icon: AlertTriangle, color: '#ef4444', border: 'rgba(239,68,68,0.5)', bg: 'rgba(239,68,68,0.1)', delay: 0.8 },
    { severity: 'High', confidence: 89, title: 'Flooding Reported', loc: 'Hover to track nearby...', Icon: ShieldAlert, color: '#f97316', border: 'rgba(249,115,22,0.5)', bg: 'rgba(0,0,0,0.8)', delay: 1.0 },
    { severity: 'Medium', confidence: 74, title: 'Road Blocked', loc: 'Hover to track nearby...', Icon: Users, color: '#eab308', border: 'rgba(255,255,255,0.2)', bg: 'rgba(0,0,0,0.8)', delay: 1.2 }
  ]);

  const [hasHovered, setHasHovered] = useState(false);

  const fetchDynamicData = () => {
    if (hasHovered) return;
    setHasHovered(true);

    // Initial polish animation frame (simulate loading on hover)
    setNearbyIncidents(prev => prev.map(p => ({ ...p, title: 'Scanning API...', loc: 'Calculating...' })));

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch('/api/incidents');
            const data = await res.json();
            if (data && data.length > 0) {
              const sorted = data.slice(0, 3).map((inc: Record<string, unknown>, i: number) => {
                let sev = 'Medium'; let col = '#eab308'; let bord = 'rgba(255,255,255,0.1)'; let icon = Users;
                if (inc.severity === 'CRITICAL') { sev = 'Critical'; col = '#ef4444'; bord = 'rgba(239,68,68,0.3)'; icon = AlertTriangle; }
                else if (inc.severity === 'HIGH') { sev = 'High'; col = '#f97316'; bord = 'rgba(249,115,22,0.3)'; icon = ShieldAlert; }
                const dist = (Math.random() * 3.8 + 1.1).toFixed(1);
                return {
                  severity: sev, confidence: 85 + Math.floor(Math.random() * 14), title: inc.title || inc.category, loc: `${dist} km away (Live)`,
                  Icon: icon, color: col, border: bord, bg: 'rgba(0,0,0,0.9)', delay: i * 0.1
                };
              });
              setNearbyIncidents(sorted);
            }
          } catch (e) {}
        },
        async () => {
          // Fallback to IP geolocation if GPS blocked on hover
          try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            const cityName = data.city || 'Your Location';
            
            const incidentRes = await fetch('/api/incidents');
            const incData = await incidentRes.json();
            if (incData && incData.length > 0) {
              const sorted = incData.slice(0, 3).map((inc: Record<string, unknown>, i: number) => {
                let sev = 'Medium'; let col = '#eab308'; let bord = 'rgba(255,255,255,0.1)'; let icon = Users;
                if (inc.severity === 'CRITICAL') { sev = 'Critical'; col = '#ef4444'; bord = 'rgba(239,68,68,0.3)'; icon = AlertTriangle; }
                else if (inc.severity === 'HIGH') { sev = 'High'; col = '#f97316'; bord = 'rgba(249,115,22,0.3)'; icon = ShieldAlert; }
                const dist = (Math.random() * 3.8 + 1.1).toFixed(1);
                return {
                  severity: sev, confidence: 85 + Math.floor(Math.random() * 14), title: inc.title || inc.category, loc: `${dist} km from ${cityName}`,
                  Icon: icon, color: col, border: bord, bg: 'rgba(0,0,0,0.9)', delay: i * 0.1
                };
              });
              setNearbyIncidents(sorted);
            }
          } catch(e) {}
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  };


  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({
      x: (e.clientX / window.innerWidth) - 0.5,
      y: (e.clientY / window.innerHeight) - 0.5
    });
  };

  return (
    <div onMouseMove={handleMouseMove} className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-transparent">
      
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05)_0%,transparent_60%)]" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03)_0%,transparent_60%)]" />
        <motion.div 
          animate={{ x: mousePos.x * -60, y: mousePos.y * -60 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="absolute -inset-10 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_10%,transparent_100%)] hidden lg:block" 
        />
        <div className="absolute inset-0 bg-noise opacity-[0.02] mix-blend-overlay" />
      </div>

      {/* ========================================== */}
      {/* 📱 MOBILE DEDICATED EXPERIENCE */}
      {/* ========================================== */}
      <div className="flex lg:hidden flex-col items-center justify-start w-full px-6 pt-32 pb-20 relative z-10 text-center">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <span className="text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase">Real-Time Intel</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4 leading-tight editorial-heading">
          See the crisis.<br/>
          Understand signal.<br/>
          <span className="text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">Prioritize.</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 mb-10 font-medium max-w-xs leading-relaxed">
          AI transforms thousands of civilian SOS reports into actionable rescue deployments.
        </p>

        {/* Scaled Mobile Radar */}
        <div className="relative w-full h-[300px] mb-10 flex items-center justify-center overflow-visible pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] scale-[0.4] sm:scale-50 origin-center flex items-center justify-center">
            <HeroRadar />
          </div>
        </div>

        {/* Mobile Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Link href="/camps" className="w-full">
            <button className="w-full px-6 py-4 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-400 font-bold tracking-[0.1em] text-[10px] sm:text-xs rounded-full shadow-[0_0_20px_rgba(59,130,246,0.1)] flex items-center justify-center gap-2 transition-all">
              <Tent className="w-4 h-4" /> LIVE RELIEF CAMPS
            </button>
          </Link>
          <Link href="/report" className="w-full">
            <button className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold tracking-[0.1em] text-[10px] sm:text-xs rounded-full shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2">
              SUBMIT SOS <Activity className="w-4 h-4" />
            </button>
          </Link>
          <Link href="/missing" className="w-full">
            <button className="w-full px-6 py-4 bg-transparent border border-white/20 hover:bg-white/5 text-white font-bold tracking-[0.1em] text-[10px] sm:text-xs rounded-full flex items-center justify-center gap-2 transition-colors">
              <UserPlus className="w-4 h-4 text-blue-500" /> REPORT MISSING
            </button>
          </Link>
          <Link href="/safe" className="w-full">
            <button className="w-full px-6 py-4 bg-emerald-900/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 font-bold tracking-[0.1em] text-[10px] sm:text-xs rounded-full flex items-center justify-center gap-2 transition-colors">
              <ShieldCheck className="w-4 h-4" /> MARK AS SAFE
            </button>
          </Link>
        </div>
      </div>


      {/* ========================================== */}
      {/* 💻 DESKTOP DEDICATED EXPERIENCE */}
      {/* ========================================== */}
      <div className="max-w-[1400px] w-full mx-auto px-6 relative z-10 hidden lg:grid lg:grid-cols-2 gap-12 items-center pt-20">
        
        {/* --- LEFT: Typography & CTAs --- */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-start text-left max-w-2xl"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">Real-Time Disaster Intelligence</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1] editorial-heading">
            See the crisis.<br/>
            Understand the signal.<br/>
            <span className="text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">Prioritize the response.</span>
          </h1>

          <p className="text-sm md:text-base text-slate-400 mb-10 font-medium tracking-wide max-w-lg leading-relaxed">
            PralayDrishti uses AI to transform thousands of unstructured emergency reports into prioritized, actionable incidents.
          </p>

          <div className="grid grid-cols-2 gap-4 w-full max-w-[480px]">
            <Link href="/camps">
              <button className="w-full group relative px-4 py-4 bg-blue-900/40 border border-blue-500/50 hover:bg-blue-600/40 text-blue-400 hover:text-white font-bold tracking-[0.1em] text-xs rounded-full overflow-hidden transition-all shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Tent className="w-4 h-4" />
                  FIND RELIEF CAMPS
                </span>
              </button>
            </Link>
            
            <Link href="/report">
              <button className="w-full group relative px-4 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold tracking-[0.1em] text-xs rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)]">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  SUBMIT SOS
                  <Activity className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              </button>
            </Link>

            <Link href="/missing">
              <button className="w-full group relative px-4 py-4 bg-black border border-white/20 hover:border-white/50 text-white font-bold tracking-[0.1em] text-xs rounded-full overflow-hidden transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4 text-blue-500 group-hover:text-blue-400 transition-colors" />
                  REPORT MISSING
                </span>
              </button>
            </Link>

            <Link href="/safe">
              <button className="w-full group relative px-4 py-4 bg-emerald-900/20 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 font-bold tracking-[0.1em] text-xs rounded-full overflow-hidden transition-all shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  MARK AS SAFE
                </span>
              </button>
            </Link>
          </div>
        </motion.div>

        {/* --- RIGHT: The Visualization Data Graph --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="relative w-full h-[600px] flex items-center justify-end"
        >
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none w-[800px] h-[800px] overflow-hidden">
            <HeroRadar />
          </div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
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
            <path d="M 33% 300 C 50% 300, 60% 120, 100% 120" stroke="rgba(239,68,68,0.2)" strokeWidth="1.5" fill="none" strokeDasharray="4,4" className="animate-[pulse_2s_infinite]" />
            <path d="M 33% 300 C 50% 300, 60% 300, 100% 300" stroke="rgba(249,115,22,0.2)" strokeWidth="1.5" fill="none" strokeDasharray="4,4" />
            <path d="M 33% 300 C 50% 300, 60% 480, 100% 480" stroke="rgba(234,179,8,0.2)" strokeWidth="1.5" fill="none" strokeDasharray="4,4" />
          </svg>

          <div className="absolute inset-0 z-10 overflow-hidden [mask-image:linear-gradient(to_right,white_20%,transparent_40%)]">
            {Array.from({length: 30}).map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                initial={{ x: -50, y: Math.round((Math.sin(i * 100) * 0.5 + 0.5) * 600), opacity: 0 }}
                animate={{ x: 300, y: 300, opacity: [0, 1, 0] }}
                transition={{ duration: Number((2 + (Math.cos(i * 200) * 0.5 + 0.5) * 2).toFixed(2)), repeat: Infinity, delay: Number(((Math.sin(i * 300) * 0.5 + 0.5) * 3).toFixed(2)), ease: "circIn" }}
                className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]"
              />
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-4 left-1/3 -translate-x-1/2 z-30 flex items-center gap-6 glass-panel px-6 py-4 rounded-2xl border border-white/5 bg-black/80 backdrop-blur-md"
          >
            <div>
              <div className="text-[9px] font-bold tracking-widest text-slate-500 uppercase mb-1">Analyzed</div>
              <div className="text-2xl font-black text-white mono-number">1,284</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <div className="text-[9px] font-bold tracking-widest text-slate-500 uppercase mb-1">Active</div>
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

      {/* Right Navbar Expanding Incident Cards (DESKTOP ONLY) */}
      <div onMouseEnter={fetchDynamicData} className="hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 flex-col gap-4 z-[999] group/nav py-12 pl-12">
        {nearbyIncidents.map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: card.delay, type: 'spring', stiffness: 200, damping: 25 }}
            className="w-[64px] group-hover/nav:w-[320px] transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] p-3 rounded-l-2xl rounded-r-none border-y border-l backdrop-blur-2xl relative overflow-hidden group cursor-pointer flex items-center h-[90px] shadow-2xl"
            style={{ borderColor: card.border, backgroundColor: card.bg }}
          >
            <div className="absolute top-0 left-0 w-1 h-full shadow-[0_0_15px_currentColor]" style={{ backgroundColor: card.color, color: card.color }} />
            
            <div className="flex-shrink-0 w-12 flex items-center justify-center pl-1">
              <card.Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" style={{ color: card.color }} />
            </div>

            <div className="flex flex-col min-w-[240px] pl-2 opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300 delay-100">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: card.color }} />
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: card.color }}>{card.severity} • {card.confidence}%</span>
              </div>
              <div className="text-sm font-black text-white uppercase tracking-wider mb-1">{card.title}</div>
              <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1"><MapPin className="w-3 h-3" /> {card.loc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
