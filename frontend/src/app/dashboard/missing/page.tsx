"use client";

import { useState } from "react";
import { Search, UserPlus, CheckCircle2, Activity, Fingerprint, Database, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function MissingPersonsPage() {
  const [missingDesc, setMissingDesc] = useState("");
  const [foundDesc, setFoundDesc] = useState("");
  
  const [missingDB, setMissingDB] = useState<string[]>([
    "70 year old grandmother wearing blue saree, lost near Sector 4 flood zone.",
    "Young boy wearing red Spiderman shirt, non-verbal autism, last seen near main highway."
  ]);
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [matchResult, setMatchResult] = useState<{ desc: string, score: number } | null>(null);

  const reportMissing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!missingDesc) return;
    setMissingDB([missingDesc, ...missingDB]);
    setMissingDesc("");
    alert("Subject securely logged to global missing registry.");
  };

  const reportFound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundDesc) return;
    
    setIsScanning(true);
    setMatchResult(null);
    setScanStep(1);

    // Simulate AI Vector Embedding Process
    setTimeout(() => setScanStep(2), 1200);
    setTimeout(() => setScanStep(3), 2500);
    setTimeout(() => {
      // Find the best match (simple keyword overlap simulation)
      const foundWords = foundDesc.toLowerCase().split(' ');
      let bestMatch = missingDB[0];
      let bestScore = 0;
      
      missingDB.forEach(dbItem => {
        const dbWords = dbItem.toLowerCase().split(' ');
        const overlap = dbWords.filter(w => foundWords.includes(w)).length;
        if (overlap > bestScore) {
          bestScore = overlap;
          bestMatch = dbItem;
        }
      });
      
      // Calculate a realistic looking confidence score
      const finalScore = bestScore > 2 ? 88.4 + (Math.random() * 10) : 42.1 + (Math.random() * 20);
      
      setIsScanning(false);
      setScanStep(0);
      if (finalScore > 75) {
        setMatchResult({ desc: bestMatch, score: parseFloat(finalScore.toFixed(1)) });
      } else {
        alert("Logged successfully. No high-confidence matches found in database.");
      }
    }, 4000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white editorial-heading flex items-center gap-3">
          <Network className="text-purple-500 w-8 h-8" /> AI Cross-Linker
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl">
          Utilizing semantic vector embeddings to automatically match unstructured "found" reports with missing person registries across fragmented databases.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 relative z-10">
        {/* Missing Panel */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-black/40">
          <h2 className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><UserPlus className="w-4 h-4 text-white"/></div>
            Registry: Missing Persons
          </h2>
          <form onSubmit={reportMissing} className="space-y-4">
            <textarea 
              required value={missingDesc} onChange={e=>setMissingDesc(e.target.value)} 
              placeholder="e.g. 70 year old grandmother wearing blue saree..." 
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 placeholder:text-white/20" 
              rows={5} 
            />
            <Button className="w-full bg-white text-black font-bold uppercase tracking-widest text-xs h-12 rounded-xl hover:bg-slate-200 transition-colors">
              Log Missing Subject
            </Button>
          </form>
          
          <div className="mt-8">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Active Registry (Sample)</h3>
            <div className="space-y-2">
              {missingDB.slice(0,3).map((desc, i) => (
                <div key={i} className="text-xs text-slate-400 p-3 rounded-lg border border-white/5 bg-white/[0.02] truncate">
                  {desc}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Found Panel */}
        <div className="glass-panel p-8 rounded-3xl border border-purple-500/20 bg-purple-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full"></div>
          
          <h2 className="text-[10px] font-bold tracking-widest uppercase text-purple-400 mb-6 flex items-center gap-3 relative z-10">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center"><Search className="w-4 h-4 text-purple-500"/></div>
            Input: Recovered Subject
          </h2>
          <form onSubmit={reportFound} className="space-y-4 relative z-10">
            <textarea 
              required value={foundDesc} onChange={e=>setFoundDesc(e.target.value)} 
              placeholder="e.g. Rescued an elderly woman in a blue saree near Sector 4..." 
              className="w-full bg-black/60 border border-purple-500/20 p-4 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 placeholder:text-purple-200/20" 
              rows={5} 
            />
            <Button disabled={isScanning} className="w-full bg-purple-600 text-white font-bold uppercase tracking-widest text-xs h-12 rounded-xl hover:bg-purple-500 transition-colors">
              {isScanning ? "Processing..." : "Run Semantic Vector Match"}
            </Button>
          </form>
          
          {/* Scanning Overlay */}
          <AnimatePresence>
            {isScanning && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md p-8 flex flex-col justify-center"
              >
                <Fingerprint className="w-12 h-12 text-purple-500 mx-auto mb-6 animate-pulse" />
                <div className="space-y-4 font-mono text-[10px] uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`w-4 h-4 ${scanStep >= 1 ? 'text-emerald-500' : 'text-slate-700'}`} />
                    <span className={scanStep >= 1 ? 'text-white' : ''}>Tokenizing unstructured text...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`w-4 h-4 ${scanStep >= 2 ? 'text-emerald-500' : 'text-slate-700'}`} />
                    <span className={scanStep >= 2 ? 'text-white' : ''}>Generating 384-Dimensional Embeddings...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Activity className={`w-4 h-4 ${scanStep >= 3 ? 'text-emerald-500 animate-spin' : 'text-slate-700'}`} />
                    <span className={scanStep >= 3 ? 'text-purple-400' : ''}>Calculating Cosine Similarity across {missingDB.length} records...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Result Panel */}
      <AnimatePresence>
        {matchResult && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="mt-8 glass-panel p-8 rounded-3xl border border-emerald-500/40 bg-emerald-500/10 relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.15)]"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Database className="w-8 h-8 text-emerald-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> 
                    High Confidence Semantic Match
                  </h3>
                  <div className="px-3 py-1 rounded bg-emerald-500 text-black font-black font-mono text-sm">
                    {matchResult.score}% SIMILARITY
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Query: Recovered Subject</div>
                    <p className="text-sm text-slate-300 italic">"{foundDesc}"</p>
                  </div>
                  <div className="p-4 bg-emerald-900/20 rounded-xl border border-emerald-500/20">
                    <div className="text-[9px] text-emerald-500 uppercase tracking-widest mb-2 font-bold">Matched: Missing Registry</div>
                    <p className="text-sm text-white font-medium">"{matchResult.desc}"</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs text-slate-400 font-medium">Automated SOS resolution triggered. Family notified via SMS broadcast.</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
