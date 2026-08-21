"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Activity, Users, MapPin } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0f1c] to-[#0a0f1c]"></div>
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-red-900/10 blur-[120px] rounded-full pointer-events-none"></div>

      <header className="relative z-10 container mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-red-500 h-8 w-8" />
          <span className="text-2xl font-bold tracking-widest text-white">PRALAY<span className="text-red-500">DRISHTI</span></span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
          <Link href="#problem" className="hover:text-white transition-colors">The Problem</Link>
          <Link href="#solution" className="hover:text-white transition-colors">The Solution</Link>
        </nav>
      </header>

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Live Triage System Active
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
            See the crisis. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">Understand the signal.</span><br/>
            Prioritize the response.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI-powered disaster intelligence that transforms thousands of chaotic emergency reports into prioritized, actionable incidents.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white h-14 px-8 text-lg w-full sm:w-auto shadow-[0_0_20px_rgba(220,38,38,0.3)] border border-red-500/50">
                Launch Control Room
              </Button>
            </Link>
            <Link href="/report">
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg w-full sm:w-auto border-slate-700 hover:bg-slate-800 text-slate-300">
                Submit Test Report
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full text-left"
        >
          <div className="glass-panel p-6 rounded-xl">
            <Activity className="h-10 w-10 text-red-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">The Problem</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              During a disaster, emergency lines and social media are flooded with noise. Limited attention means critical voices—like trapped individuals—get buried under reports of minor road blockages.
            </p>
          </div>
          
          <div className="glass-panel p-6 rounded-xl">
            <MapPin className="h-10 w-10 text-orange-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">The Solution</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Our AI natively understands unstructured, multilingual text. It extracts severity, clusters related reports geographically, and creates a prioritized dispatch queue instantly.
            </p>
          </div>
          
          <div className="glass-panel p-6 rounded-xl">
            <Users className="h-10 w-10 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Human-in-the-Loop</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              AI shouldn't make blind decisions. Low-confidence cases and ambiguous reports are automatically routed to a human review queue, ensuring maximum safety and reliability.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
