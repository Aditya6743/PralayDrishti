"use client";

import { useState } from "react";
import { Search, UserPlus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MissingPersonsPage() {
  const [missingDesc, setMissingDesc] = useState("");
  const [foundDesc, setFoundDesc] = useState("");
  const [matchResult, setMatchResult] = useState<any>(null);

  const reportMissing = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/missing", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Unknown", description: missingDesc, contact_phone: "999999999" })
    });
    alert("Missing person logged.");
    setMissingDesc("");
  };

  const reportFound = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/found", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: foundDesc, location: "Camp A" })
    });
    const data = await res.json();
    if (data.status === "match_found") setMatchResult(data);
    else alert("Logged, no match yet.");
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white editorial-heading">AI Cross-Linker</h1>
        <p className="text-muted-foreground text-sm mt-1">Automatically match missing persons with found logs using vector embeddings.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-panel p-6 rounded-3xl border border-white/10">
          <h2 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-4 flex items-center gap-2"><UserPlus className="w-4 h-4"/> Report Missing</h2>
          <form onSubmit={reportMissing} className="space-y-4">
            <textarea required value={missingDesc} onChange={e=>setMissingDesc(e.target.value)} placeholder="e.g. 70 year old grandmother wearing blue saree..." className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white text-sm focus:outline-none focus:border-primary" rows={4} />
            <Button className="w-full bg-white text-black font-bold uppercase tracking-widest text-xs h-12 rounded-xl">Log Missing Person</Button>
          </form>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/10">
          <h2 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-4 flex items-center gap-2"><Search className="w-4 h-4"/> Log Rescued/Found</h2>
          <form onSubmit={reportFound} className="space-y-4">
            <textarea required value={foundDesc} onChange={e=>setFoundDesc(e.target.value)} placeholder="e.g. Found elderly woman in blue saree near sector 12..." className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white text-sm focus:outline-none focus:border-primary" rows={4} />
            <Button className="w-full bg-primary text-white font-bold uppercase tracking-widest text-xs h-12 rounded-xl hover:bg-primary/90">Run Vector Match</Button>
          </form>
        </div>
      </div>

      {matchResult && (
        <div className="mt-8 glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-emerald-500 font-bold uppercase tracking-widest text-xs">High Confidence Match Found</h3>
            <p className="text-white text-lg font-medium mt-1">Similarity Score: {matchResult.confidence}%</p>
            <p className="text-muted-foreground text-sm">Automated SMS sent to family.</p>
          </div>
        </div>
      )}
    </div>
  );
}
