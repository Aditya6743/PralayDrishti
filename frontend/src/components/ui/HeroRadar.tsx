"use client";

import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { useState } from "react";

const SIGNALS = [
  { id: "s1", r: 0.3, theta: 45, type: "critical" },
  { id: "s2", r: 0.6, theta: 70, type: "high" },
  { id: "s3", r: 0.4, theta: 130, type: "critical" },
  { id: "s4", r: 0.2, theta: 160, type: "normal" },
  { id: "s5", r: 0.7, theta: 210, type: "normal" },
  { id: "s6", r: 0.5, theta: 240, type: "critical" },
  { id: "s7", r: 0.8, theta: 260, type: "high" },
  { id: "s8", r: 0.4, theta: 300, type: "normal" },
  { id: "s9", r: 0.65, theta: 330, type: "critical" },
  { id: "s10", r: 0.9, theta: 350, type: "normal" },
  { id: "s11", r: 0.85, theta: 90, type: "high" },
  { id: "s12", r: 0.75, theta: 180, type: "normal" },
  { id: "s13", r: 0.55, theta: 270, type: "normal" },
  { id: "s14", r: 0.95, theta: 360, type: "critical" },
  // Adding random ambient dots
  ...Array.from({length: 40}).map((_, i) => ({
    id: `ambient-${i}`,
    r: (Math.sin(i * 123.456) * 0.5 + 0.5) * 0.9 + 0.1,
    theta: (Math.cos(i * 789.123) * 0.5 + 0.5) * 360,
    type: Math.sin(i * 456.789) > 0.6 ? "high" : "normal"
  }))
];

const polarToCartesian = (rPercent: number, thetaDeg: number) => {
  const rad = (thetaDeg - 90) * (Math.PI / 180);
  return {
    x: 50 + rPercent * 50 * Math.cos(rad),
    y: 50 + rPercent * 50 * Math.sin(rad)
  };
};

export default function HeroRadar() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Generate 36 outer numbers (every 10 degrees)
  const outerNumbers = Array.from({ length: 36 }).map((_, i) => {
    const angle = i * 10;
    const label = angle.toString().padStart(3, '0');
    return { angle, label };
  });

  // Generate 12 spokes (every 30 degrees)
  const spokes = Array.from({ length: 12 }).map((_, i) => i * 30);

  // Generate concentric rings
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className="relative w-full h-full max-w-[900px] max-h-[900px] aspect-square flex items-center justify-center pointer-events-auto">
      
      {/* Container to handle the rotation constraint */}
      <div className="absolute inset-4 rounded-full border border-white/[0.05] bg-black/20 backdrop-blur-sm shadow-[0_0_100px_rgba(239,68,68,0.05)]">
        
        {/* The Outer Numbers */}
        <div className="absolute inset-0">
          {outerNumbers.map(({ angle, label }) => (
            <div 
              key={angle}
              className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-4 flex flex-col justify-between items-center py-2 text-[8px] font-mono text-slate-600/30"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <span style={{ transform: `rotate(${-angle}deg)` }}>{label}</span>
              <span style={{ transform: `rotate(${-angle}deg)` }}>{(angle + 180) % 360 === 0 ? "180" : ((angle + 180) % 360).toString().padStart(3, '0')}</span>
            </div>
          ))}
        </div>

        {/* The Concentric Rings */}
        {rings.map((r, i) => (
          <div 
            key={`ring-${i}`}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]"
            style={{ width: `${r * 100}%`, height: `${r * 100}%` }}
          />
        ))}

        {/* The Spokes (Radial Lines) */}
        {spokes.map((angle) => (
          <div 
            key={`spoke-${angle}`}
            className="absolute top-1/2 left-0 w-full h-[1px] bg-white/[0.02]"
            style={{ transform: `translateY(-50%) rotate(${angle}deg)` }}
          />
        ))}

        {/* The Sweeping Red Radar Beam */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(239, 68, 68, 0.15) 360deg)"
          }}
        >
          {/* Leading edge line */}
          <div className="absolute top-0 left-1/2 w-[1px] h-1/2 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
        </motion.div>

        {/* Data Nodes */}
        <div className="absolute inset-0">
          {SIGNALS.map(s => {
            const pos = polarToCartesian(s.r, s.theta);
            const isHovered = hoveredNode === s.id;
            
            let dotColor = "bg-white/40";
            let shadow = "";
            let pulse = false;
            
            if (s.type === "critical") {
              dotColor = "bg-red-500";
              shadow = "shadow-[0_0_20px_rgba(239,68,68,0.8)]";
              pulse = true;
            } else if (s.type === "high") {
              dotColor = "bg-orange-500";
              shadow = "shadow-[0_0_15px_rgba(249,115,22,0.6)]";
            } else if (s.type === "normal" && s.r > 0.5) {
              dotColor = "bg-white/80";
            }

            return (
              <div 
                key={s.id} 
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                style={{ left: `${pos.x.toFixed(2)}%`, top: `${pos.y.toFixed(2)}%` }}
                onMouseEnter={() => setHoveredNode(s.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* The Node */}
                <div className={`w-1.5 h-1.5 rounded-full ${dotColor} ${shadow} transition-all duration-300 cursor-crosshair group-hover:scale-150`} />
                
                {/* Pulsing ring for critical */}
                {pulse && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-red-500/30 animate-[ping_3s_ease-out_infinite] opacity-50" />
                )}

                {/* Hover Ripple Effect */}
                {isHovered && (
                  <>
                    <motion.div 
                      initial={{ scale: 0, opacity: 0.5 }}
                      animate={{ scale: 3, opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/40 pointer-events-none"
                    />
                    <motion.div 
                      initial={{ scale: 0, opacity: 0.5 }}
                      animate={{ scale: 5, opacity: 0 }}
                      transition={{ duration: 1, delay: 0.2, repeat: Infinity }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 pointer-events-none"
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Center Logo Node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <div className="relative flex items-center justify-center w-24 h-24">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-red-500/30 border-dashed" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-2 rounded-full border border-red-500/10" />
            <div className="absolute inset-4 rounded-full bg-black border border-red-500/20 flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.4)] backdrop-blur-xl">
              <ShieldAlert className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <div className="absolute top-[110%] left-1/2 -translate-x-1/2 text-center w-max z-10 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/5 pointer-events-auto">
            <div className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">
              Pralay<span className="text-red-500">Drishti</span>
            </div>
            <div className="text-[8px] font-semibold tracking-[0.1em] text-slate-500 uppercase mt-0.5">AI Engine</div>
          </div>
        </div>

      </div>
    </div>
  );
}
