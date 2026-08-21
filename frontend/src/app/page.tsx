"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldAlert, Target, CheckCircle2, User, Mic, Layers, Activity } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Radar from "@/components/ui/Radar";
import Magnetic from "@/components/ui/Magnetic";
import InteractiveRadarHero from "@/components/ui/InteractiveRadarHero";

// SECTION 2: THE PROBLEM
const SectionTheProblem = () => {
  const reports = [
    "5 people trapped...", "Road blocked...", "Paani ghar mein aa gaya...",
    "Need medical help...", "Bridge damaged...", "Family stranded...",
    "Power lines down...", "Water level rising fast...", "Cannot exit building..."
  ];

  return (
    <div id="how-it-works" className="w-full min-h-screen py-32 px-4 border-t border-white/5 relative flex flex-col items-center justify-center overflow-hidden">
      <div className="text-center mb-24 relative z-10">
        <h2 className="text-3xl md:text-6xl font-light text-white editorial-heading tracking-wide max-w-4xl leading-tight">
          In a disaster, information isn’t scarce. <br/>
          <span className="text-primary font-bold">Attention is.</span>
        </h2>
      </div>

      <div className="w-full max-w-6xl mx-auto h-[400px] relative flex items-center justify-center">
        {/* Chaos */}
        <div className="absolute inset-0">
          {reports.map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ 
                opacity: [0, 0.4, 0], 
                scale: [0.8, 1, 0.8],
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400
              }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
              className="absolute left-1/2 top-1/2 -ml-20 -mt-4 text-[10px] text-muted-foreground bg-white/5 border border-white/10 px-3 py-1.5 rounded-full whitespace-nowrap backdrop-blur-sm"
            >
              {text}
            </motion.div>
          ))}
        </div>

        {/* Clarity Centerpiece */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
          viewport={{ once: false }}
          className="relative z-10 glass-panel p-8 md:p-12 rounded-[2rem] border border-primary/30 shadow-[0_0_50px_rgba(239,68,68,0.15)] flex flex-col items-center text-center bg-black/80 backdrop-blur-xl"
        >
          <h3 className="text-sm font-bold tracking-widest text-primary uppercase mb-6">PralayDrishti finds the signal inside the noise.</h3>
          <div className="flex gap-6 md:gap-12">
            <div>
              <div className="text-5xl font-black text-white mono-number">23</div>
              <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mt-2">Incidents</div>
            </div>
            <div>
              <div className="text-5xl font-black text-primary mono-number">7</div>
              <div className="text-[10px] font-bold tracking-widest text-primary uppercase mt-2">Critical</div>
            </div>
            <div>
              <div className="text-5xl font-black text-orange-400 mono-number">18</div>
              <div className="text-[10px] font-bold tracking-widest text-orange-400 uppercase mt-2">High</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// SECTION 3: AI INTELLIGENCE
const SectionAIIntelligence = () => {
  return (
    <div id="intelligence" className="w-full min-h-screen flex flex-col items-center justify-center py-32 px-4 border-t border-white/5 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.03),_transparent_70%)] pointer-events-none" />
      
      <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-center z-10">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-white editorial-heading tracking-tight mb-6">Real-time intelligence extraction.</h2>
          <p className="text-muted-foreground text-lg mb-10 editorial-heading">Natural language processing instantly pulls exact context from terrified, unstructured civilian reports.</p>
          
          <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <div className="flex items-center gap-3 mb-4">
              <Mic className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-500">Live Transcript</span>
            </div>
            <p className="text-2xl text-white italic font-medium leading-relaxed group-hover:text-white/80 transition-colors">
              "Hum second floor pe phas gaye hain. Paani stairs tak aa gaya hai. 5 log hain."
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Language", value: "Hinglish", color: "text-white" },
            { label: "Situation", value: "Trapped Persons", color: "text-white" },
            { label: "People", value: "05", color: "text-white" },
            { label: "Threat", value: "Rising Water", color: "text-white" },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: false }}
              className="glass-panel p-6 rounded-2xl border border-white/10"
            >
              <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">{item.label}</div>
              <div className={`${item.color} font-medium uppercase tracking-wider text-sm`}>{item.value}</div>
            </motion.div>
          ))}
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: false }}
            className="glass-panel p-6 rounded-2xl border border-primary/30 bg-primary/5 col-span-2 flex justify-between items-center"
          >
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-primary mb-2">Severity</div>
              <div className="text-primary font-bold uppercase tracking-wider text-2xl">CRITICAL</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Confidence</div>
              <div className="text-white font-bold mono-number text-2xl">96%</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: false }}
            className="col-span-2 mt-4"
          >
            <div className="w-full py-4 rounded-full bg-primary/10 border border-primary/20 text-center text-xs font-bold tracking-widest uppercase text-primary flex items-center justify-center gap-2">
              <Target className="w-4 h-4" /> IMMEDIATE RESPONSE RECOMMENDED
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// SECTION 4: INCIDENT CLUSTERING
const SectionIncidentClustering = () => {
  return (
    <div className="w-full min-h-screen py-32 px-4 border-t border-white/5 text-center relative flex flex-col items-center justify-center bg-black/50">
      <h2 className="text-4xl md:text-5xl font-bold text-white editorial-heading tracking-tight mb-4">18 voices. 1 clear incident.</h2>
      <p className="text-muted-foreground text-lg mb-20 max-w-2xl editorial-heading mx-auto">
        Cross-referencing spatial, temporal, and semantic data to merge duplicate panic into a single operational target.
      </p>

      <div className="relative w-full max-w-4xl h-[400px] flex items-center justify-center">
        {/* Animated incoming reports merging into center */}
        <div className="absolute inset-0">
          {Array.from({length: 18}).map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: (Math.random() - 0.5) * 600, y: (Math.random() - 0.5) * 400, opacity: 0, scale: 0 }}
              whileInView={{ x: 0, y: 0, opacity: [0, 1, 0], scale: [0, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.15, ease: "circIn" }}
              viewport={{ once: false }}
              className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full bg-white/30 blur-[1px]"
            />
          ))}
        </div>

        {/* Center Target */}
        <div className="relative z-10 glass-panel border border-primary/40 bg-black/90 p-8 rounded-3xl shadow-[0_0_60px_rgba(239,68,68,0.2)]">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <Layers className="w-5 h-5 text-primary" />
            <span className="text-xl font-bold text-white tracking-widest uppercase">INCIDENT #PD-017</span>
          </div>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-black text-white mono-number">18</div>
              <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mt-2">Reports</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white mono-number">43</div>
              <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mt-2">Affected</div>
            </div>
            <div>
              <div className="text-3xl font-black text-primary mono-number">6</div>
              <div className="text-[10px] font-bold tracking-widest text-primary uppercase mt-2">Critical</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// SECTION 5: HUMAN IN THE LOOP
const SectionHumanInTheLoop = () => {
  return (
    <div className="w-full min-h-screen py-32 px-4 border-t border-white/5 text-center relative flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.05),_transparent_50%)]"></div>
      
      <h2 className="text-4xl md:text-5xl font-bold text-white editorial-heading tracking-tight mb-4 relative z-10">AI moves fast.</h2>
      <h2 className="text-4xl md:text-5xl font-bold text-purple-400 editorial-heading tracking-tight mb-20 relative z-10">Humans stay in control.</h2>

      <div className="flex flex-col items-center gap-6 relative z-10">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 max-w-md w-full text-left relative overflow-hidden bg-black/60">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">AI Ambiguity Detected</span>
            <span className="text-xs font-bold text-purple-400 mono-number">54% CONFIDENCE</span>
          </div>
          <p className="text-white italic text-lg mb-4 font-medium">"Old building ke paas paani bahut hai, shayad log phase hain."</p>
        </div>

        <div className="h-12 w-px bg-gradient-to-b from-white/20 to-purple-500/50"></div>

        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-bold tracking-widest uppercase text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          <User className="w-4 h-4" /> REVIEW REQUIRED
        </div>

        <div className="h-12 w-px bg-gradient-to-b from-purple-500/50 to-primary/50"></div>

        <div className="glass-panel p-2 rounded-2xl border border-white/10 max-w-md w-full bg-black/60 flex items-center justify-between gap-2 overflow-hidden">
          <button className="flex-1 py-4 text-[10px] font-bold tracking-widest uppercase text-muted-foreground hover:bg-white/5 hover:text-white transition-colors rounded-xl">Reclassify</button>
          <button className="flex-1 py-4 text-[10px] font-bold tracking-widest uppercase bg-primary hover:bg-primary/90 text-white rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-colors">Confirm</button>
          <button className="flex-1 py-4 text-[10px] font-bold tracking-widest uppercase text-muted-foreground hover:bg-white/5 hover:text-white transition-colors rounded-xl">Escalate</button>
        </div>
      </div>
    </div>
  );
};

// SECTION 6: IMPACT
const SectionImpact = () => {
  return (
    <div id="impact" className="w-full py-40 px-4 border-t border-white/5 bg-black relative">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
        {[
          { num: "1,284", label: "Reports Analyzed" },
          { num: "24", label: "Incidents Identified" },
          { num: "7", label: "Critical Priority", color: "text-primary" },
          { num: "436", label: "People Affected" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <div className={`text-5xl md:text-7xl font-black mb-4 tracking-tighter mono-number ${stat.color || 'text-white'}`}>{stat.num}</div>
            <div className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// SECTION 7: FINAL CTA
const SectionFinalCTA = () => {
  return (
    <div id="about" className="w-full min-h-screen flex flex-col items-center justify-center py-32 px-4 relative overflow-hidden">
      
      {/* Background Radar */}
      <div className="absolute inset-0 z-0 opacity-20 mix-blend-screen pointer-events-none [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_100%)]">
        <Radar
          speed={0.2}
          scale={1.2}
          ringCount={4}
          spokeCount={12}
          color="#ffffff"
          backgroundColor="#000000"
          falloff={2.0}
          brightness={0.4}
          enableMouseInteraction={false}
        />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
        <h2 className="text-5xl md:text-7xl font-bold text-white editorial-heading tracking-tight mb-8 leading-[1.1]">
          When every second matters, <br/>
          <span className="text-primary italic">clarity becomes critical.</span>
        </h2>
        <p className="text-lg md:text-2xl text-muted-foreground mb-16 font-light editorial-heading">
          Turn information overload into actionable emergency intelligence.
        </p>

        <Magnetic strength={0.2}>
          <Link href="/dashboard">
            <button className="group relative px-10 py-5 bg-white hover:bg-neutral-200 text-black font-bold tracking-widest uppercase text-xs rounded-full overflow-hidden transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)]">
              <span className="relative z-10 flex items-center gap-2">
                ENTER THE CONTROL ROOM
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>
        </Magnetic>
      </div>
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-x-hidden bg-background selection:bg-primary/30">
      
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-5 flex items-center justify-between backdrop-blur-md border-b border-white/5 bg-background/50 pointer-events-auto">
        <div className="flex flex-col items-start gap-0.5 magnetic-target">
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-red-500 h-5 w-5" />
            <span className="text-sm font-bold tracking-widest text-white editorial-heading uppercase">
              Pralay<span className="text-red-500">Drishti</span>
            </span>
          </div>
          <span className="text-[8px] font-bold tracking-[0.2em] text-slate-500 uppercase ml-7">Disaster Intelligence System</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-8">
          <Link href="#top" className="text-[10px] font-bold tracking-widest uppercase text-white transition-colors relative after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-0.5 after:bg-red-500">HOME</Link>
          <Link href="#how-it-works" className="text-[10px] font-bold tracking-widest uppercase text-slate-400 hover:text-white transition-colors">HOW IT WORKS</Link>
          <Link href="#intelligence" className="text-[10px] font-bold tracking-widest uppercase text-slate-400 hover:text-white transition-colors">INTELLIGENCE</Link>
          <Link href="#impact" className="text-[10px] font-bold tracking-widest uppercase text-slate-400 hover:text-white transition-colors">IMPACT</Link>
          <Link href="#about" className="text-[10px] font-bold tracking-widest uppercase text-slate-400 hover:text-white transition-colors">ABOUT</Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-bold tracking-widest uppercase text-slate-300">AI ENGINE ACTIVE</span>
          </div>
          <Link href="/dashboard">
            <button className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-red-900/40 hover:bg-red-500 border border-red-500/50 text-white font-bold tracking-[0.1em] text-[10px] rounded-full transition-colors">
              ENTER CONTROL ROOM <ArrowRight className="w-3 h-3" />
            </button>
          </Link>
        </div>
      </header>

      <InteractiveRadarHero />

      <div className="relative z-10 w-full bg-background">
        <SectionTheProblem />
        <SectionAIIntelligence />
        <SectionIncidentClustering />
        <SectionHumanInTheLoop />
        <SectionImpact />
        <SectionFinalCTA />
        
        {/* Footer */}
        <footer className="w-full py-16 px-6 border-t border-white/5 bg-[#020617] relative z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <ShieldAlert className="text-red-500 h-5 w-5" />
                <span className="text-sm font-bold tracking-widest text-white editorial-heading uppercase">
                  Pralay<span className="text-red-500">Drishti</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-wide leading-relaxed max-w-xs">
                Advanced AI disaster intelligence turning unstructured noise into prioritized operational clarity.
              </p>
            </div>

            <div className="col-span-1">
              <h4 className="text-[10px] font-bold tracking-widest text-white uppercase mb-6">Product</h4>
              <ul className="space-y-4">
                <li><Link href="/dashboard" className="text-xs text-slate-500 hover:text-white transition-colors">Control Room</Link></li>
                <li><Link href="/report" className="text-xs text-slate-500 hover:text-white transition-colors">Citizen Report UI</Link></li>
                <li><Link href="/lite" className="text-xs text-slate-500 hover:text-white transition-colors">Low-Bandwidth Mode</Link></li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="text-[10px] font-bold tracking-widest text-white uppercase mb-6">Intelligence</h4>
              <ul className="space-y-4">
                <li><Link href="#how-it-works" className="text-xs text-slate-500 hover:text-white transition-colors">Dynamic Triage</Link></li>
                <li><Link href="#intelligence" className="text-xs text-slate-500 hover:text-white transition-colors">NLP Extraction</Link></li>
                <li><Link href="#impact" className="text-xs text-slate-500 hover:text-white transition-colors">Incident Clustering</Link></li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="text-[10px] font-bold tracking-widest text-white uppercase mb-6">Legal & Connect</h4>
              <ul className="space-y-4">
                <li><a href="https://github.com/PralayDrishti" target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-white transition-colors">Open Source (GitHub)</a></li>
                <li><Link href="#" className="text-xs text-slate-500 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-xs text-slate-500 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

          </div>
          
          <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-600">
              PRALAYDRISHTI © 2026. FOR EMERGENCY OPERATIONS ONLY.
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-bold tracking-widest uppercase text-slate-500">SYSTEMS OPERATIONAL</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
