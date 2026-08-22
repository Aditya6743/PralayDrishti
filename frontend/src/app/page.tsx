"use client";

import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldAlert, Menu, X, Target, CheckCircle2, User, Mic, Layers, Activity } from "lucide-react";
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
    <div id="how-it-works" className="w-full min-h-screen py-32 px-4  relative flex flex-col items-center justify-center overflow-hidden">
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
              initial={{ opacity: 0, scale: 0.5 , filter: 'blur(10px)' }}
              whileInView={{ 
                opacity: [0, 0.4, 0], 
                scale: [0.8, 1, 0.8],
                x: Math.round((Math.sin(i * 123) * 0.5) * 400),
                y: Math.round((Math.cos(i * 456) * 0.5) * 400)
              }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              className="absolute left-1/2 top-1/2 -ml-20 -mt-4 text-[10px] text-muted-foreground bg-white/5 border border-white/10 px-3 py-1.5 rounded-full whitespace-nowrap backdrop-blur-sm"
            >
              {text}
            </motion.div>
          ))}
        </div>

        {/* Clarity Centerpiece */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 , filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, scale: 1 , filter: 'blur(0px)' }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
    <div id="intelligence" className="w-full min-h-screen flex flex-col items-center justify-center py-32 px-4  relative">
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
              initial={{ opacity: 0, y: 20 , filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0 , filter: 'blur(0px)' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              viewport={{ once: false }}
              className="glass-panel p-6 rounded-2xl border border-white/10"
            >
              <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">{item.label}</div>
              <div className={`${item.color} font-medium uppercase tracking-wider text-sm`}>{item.value}</div>
            </motion.div>
          ))}
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 , filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, scale: 1 , filter: 'blur(0px)' }}
            transition={{ duration: 0.4, delay: 0.1 }}
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
            initial={{ opacity: 0, y: 20 , filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0 , filter: 'blur(0px)' }}
            transition={{ duration: 0.4, delay: 0.15 }}
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
    <div className="w-full min-h-screen py-32 px-4  text-center relative flex flex-col items-center justify-center bg-transparent">
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
              initial={{ x: Math.round((Math.sin(i * 789) * 0.5) * 600), y: Math.round((Math.cos(i * 321) * 0.5) * 400), opacity: 0, scale: 0 , filter: 'blur(10px)' }}
              whileInView={{ x: 0, y: 0, opacity: [0, 1, 0], scale: [0, 1, 0.5] , filter: ['blur(10px)', 'blur(0px)', 'blur(10px)'] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05, ease: "circIn" }}
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
    <div className="w-full min-h-screen py-32 px-4  text-center relative flex flex-col items-center justify-center">
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
    <div id="impact" className="w-full min-h-screen flex flex-col justify-center py-40 px-4 bg-transparent relative">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
        {[
          { num: "1,284", label: "Reports Analyzed" },
          { num: "24", label: "Incidents Identified" },
          { num: "7", label: "Critical Priority", color: "text-primary" },
          { num: "436", label: "People Affected" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 40 , filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0 , filter: 'blur(0px)' }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
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
      <div className="absolute inset-0 z-0 opacity-20  pointer-events-none [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_100%)]">
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
  const [activeSection, setActiveSection] = useState("top");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Parallax Background Text with Premium Spring
  const { scrollYProgress } = useScroll();
  const smoothY = useSpring(scrollYProgress, { damping: 20, stiffness: 50, mass: 0.5 });
  const xLeft = useTransform(smoothY, [0, 1], ["0%", "-50%"]);
  const xRight = useTransform(smoothY, [0, 1], ["-50%", "0%"]);
  const rotateTarget1 = useTransform(smoothY, [0, 1], [0, 180]);
  const rotateTarget2 = useTransform(smoothY, [0, 1], [360, 0]);
  const yOffset = useTransform(smoothY, [0, 1], ["0%", "200px"]);

  useEffect(() => {
    const sectionIds = ["top", "how-it-works", "intelligence", "impact", "about"];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && sectionIds.includes(entry.target.id)) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: "-40% 0px -40% 0px", threshold: 0 }); 

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const navLinks = [
    { id: "top", label: "HOME" },
    { id: "how-it-works", label: "HOW IT WORKS" },
    { id: "intelligence", label: "INTELLIGENCE" },
    { id: "impact", label: "IMPACT" },
    { id: "about", label: "ABOUT" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-x-hidden bg-transparent selection:bg-primary/30">
      
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
          {navLinks.map((link) => (
            <Link 
              key={link.id} 
              href={"#" + link.id} 
              onClick={() => setActiveSection(link.id)}
              className={"relative text-[10px] font-bold tracking-widest uppercase transition-colors " + (activeSection === link.id ? "text-white" : "text-slate-400 hover:text-white")}
            >
              {link.label}
              {activeSection === link.id && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-red-500"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-bold tracking-widest uppercase text-slate-300">AI ENGINE ACTIVE</span>
          </div>
          <Link href="/report">
            <button className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-emerald-900/40 hover:bg-emerald-500 border border-emerald-500/50 text-white font-bold tracking-[0.1em] text-[10px] rounded-full transition-colors">
              SUBMIT SOS
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-red-900/40 hover:bg-red-500 border border-red-500/50 text-white font-bold tracking-[0.1em] text-[10px] rounded-full transition-colors">
              CONTROL ROOM <ArrowRight className="w-3 h-3" />
            </button>
          </Link>
        </div>
      </header>
      
      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-black/95 backdrop-blur-3xl border-b border-white/10 p-6 flex flex-col gap-6 lg:hidden shadow-2xl"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.id} 
                  href={"#" + link.id} 
                  onClick={() => { setActiveSection(link.id); setIsMobileMenuOpen(false); }}
                  className={"text-xs font-bold tracking-widest uppercase transition-colors " + (activeSection === link.id ? "text-primary" : "text-slate-400")}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="h-px bg-white/10 w-full" />
            <Link href="/report" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-900/40 hover:bg-emerald-500 border border-emerald-500/50 text-white font-bold tracking-[0.1em] text-[10px] rounded-full transition-colors">
                SUBMIT SOS REPORT
              </button>
            </Link>
            <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-900/40 hover:bg-red-500 border border-red-500/50 text-white font-bold tracking-[0.1em] text-[10px] rounded-full transition-colors">
                CONTROL ROOM <ArrowRight className="w-3 h-3" />
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div id="top">
        <InteractiveRadarHero />
      </div>

      <div className="relative z-10 w-full bg-transparent">
      
{/* Massive Scroll-Linked Geometric Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[-1]">
          {/* Giant Outer Ring */}
          <motion.div 
            style={{ rotate: rotateTarget1, y: yOffset }}
            className="absolute top-[10%] left-[-20%] w-[150vw] h-[150vw] md:w-[80vw] md:h-[80vw] opacity-[0.03] border-[2px] border-white rounded-full border-dashed flex items-center justify-center"
          >
            <div className="w-[90%] h-[90%] border border-white/50 rounded-full" />
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20" />
            <div className="absolute left-0 right-0 top-1/2 h-px bg-white/20" />
          </motion.div>
          
          {/* Giant Inner Target */}
          <motion.div 
            style={{ rotate: rotateTarget2, y: yOffset }}
            className="absolute top-[10%] md:top-[30%] -right-[50%] md:right-[-10%] w-[200vw] h-[200vw] md:w-[60vw] md:h-[60vw] opacity-[0.02] md:opacity-[0.04] border-[2px] md:border-[4px] border-red-500 rounded-full flex items-center justify-center pointer-events-none"
          >
            <div className="w-[80%] h-[80%] border-2 border-red-500/50 rounded-full border-dashed" />
            <div className="absolute w-4 h-4 bg-red-500 rounded-full top-[10%]" />
            <div className="absolute w-4 h-4 bg-red-500 rounded-full bottom-[10%]" />
          </motion.div>

          {/* Infinite Vertical Scanner */}
          <motion.div
            animate={{ y: ["-10vh", "110vh"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-x-0 h-[2px] bg-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.4)]"
          />
        </div>

        <SectionTheProblem />
        <SectionAIIntelligence />
        <SectionIncidentClustering />
        <SectionHumanInTheLoop />
        <SectionImpact />
        <SectionFinalCTA />
        
        {/* Footer */}
        <footer className="w-full py-16 px-6 bg-[#020617] relative z-20 border-t border-white/5 overflow-hidden">
          {/* Animated Background Grid */}
          <div className="absolute inset-0 z-0 opacity-20" 
               style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            <motion.div
              animate={{ y: [0, 40] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-full h-full opacity-50"
              style={{ backgroundImage: 'linear-gradient(to bottom, transparent, rgba(239,68,68,0.2) 50%, transparent)' }}
            />
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 relative z-10">
            
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6 group cursor-pointer">
                <motion.div animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }}>
                  <ShieldAlert className="text-red-500 h-5 w-5 group-hover:text-white transition-colors" />
                </motion.div>
                <span className="text-sm font-bold tracking-widest text-white editorial-heading uppercase flex items-center relative">
                  Pralay<span className="text-red-500">Drishti</span>
                  <motion.span 
                    animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute -right-2 top-0 w-1 h-4 bg-red-500"
                  />
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide leading-relaxed max-w-xs group-hover:text-slate-300 transition-colors">
                Advanced AI disaster intelligence turning unstructured noise into prioritized operational clarity.
              </p>
            </div>

            <div className="col-span-1">
              <h4 className="text-[10px] font-bold tracking-widest text-white uppercase mb-6 flex items-center gap-2">
                <span className="w-1 h-1 bg-white rounded-full animate-ping" /> Product
              </h4>
              <ul className="space-y-4">
                {
                [
                  { label: 'Control Room', href: '/dashboard' },
                  { label: 'Citizen Report UI', href: '/report' },
                  { label: 'Ultra-Low Bandwidth', href: '/report.html' }
                ].map((item, i) => (
                  <motion.li key={i} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Link href={item.href} className="group text-xs text-slate-500 hover:text-white transition-colors uppercase tracking-wider font-bold flex items-center gap-2">
                      <span className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">►</span> {item.label}
                    </Link>
                  </motion.li>
                ))
              }
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="text-[10px] font-bold tracking-widest text-white uppercase mb-6 flex items-center gap-2">
                <span className="w-1 h-1 bg-white rounded-full animate-ping" /> Intelligence
              </h4>
              <ul className="space-y-4">
                {
                [
                  { label: 'Dynamic Triage', href: '#how-it-works' },
                  { label: 'NLP Extraction', href: '#intelligence' },
                  { label: 'Incident Clustering', href: '#impact' }
                ].map((item, i) => (
                  <motion.li key={i} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Link href={item.href} className="group text-xs text-slate-500 hover:text-white transition-colors uppercase tracking-wider font-bold flex items-center gap-2">
                      <span className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">►</span> {item.label}
                    </Link>
                  </motion.li>
                ))
              }
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="text-[10px] font-bold tracking-widest text-white uppercase mb-6 flex items-center gap-2">
                <span className="w-1 h-1 bg-white rounded-full animate-ping" /> Legal & Connect
              </h4>
              <ul className="space-y-4">
                <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <a href="https://github.com/PralayDrishti" target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-white transition-colors uppercase tracking-wider font-bold">Open Source (GitHub)</a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Link href="#" className="group text-xs text-slate-500 hover:text-white transition-colors uppercase tracking-wider font-bold">Privacy Policy</Link>
                </motion.li>
              </ul>
            </div>

          </div>
          
          <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-600 flex items-center gap-4">
              <span>PRALAYDRISHTI © 2026.</span>
              <motion.span 
                animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}
                className="hidden md:inline text-red-500/50"
              >
                // FOR EMERGENCY OPERATIONS ONLY
              </motion.span>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 cursor-crosshair"
            >
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
              </div>
              <span className="text-[9px] font-black tracking-widest uppercase text-emerald-500">Uplink Active</span>
            </motion.div>
          </div>
        </footer>
      </div>
    </div>
  );
}
