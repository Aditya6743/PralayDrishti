"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function LiteReport() {
  const [msg, setMsg] = useState("");
  const [loc, setLoc] = useState("");
  const [ppl, setPpl] = useState("1");
  const [status, setStatus] = useState("idle");
  const [ticket, setTicket] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    const payload = JSON.stringify({ m: msg, l: loc, p: parseInt(ppl) });
    const b64 = btoa(payload);
    
    try {
      const res = await fetch(`/api/ingest?d=${b64}`);
      const data = await res.json().catch(() => ({}));
      setTicket(data.ticket);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") return (
    <div className="min-h-screen bg-black text-white p-4 font-mono">
      <h2 className="text-xl font-bold text-green-500 mb-4">SOS Sent</h2>
      <p className="mb-4">Your ticket ID:</p>
      <div className="text-3xl font-bold bg-white/10 p-2 rounded">{ticket}</div>
      <p className="mt-8 text-sm text-gray-400">Save this ID to check status later.</p>
      <a href={`/status/${ticket}`} className="block mt-4 text-blue-400 underline">Check Live Status</a>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-4 font-mono">
      <h1 className="text-xl font-bold text-red-500 mb-4">Emergency Lite Report</h1>
      <p className="text-xs text-gray-400 mb-6">Low bandwidth mode (2G compatible).</p>
      
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">What happened?</label>
          <textarea required value={msg} onChange={e=>setMsg(e.target.value)} className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white" rows={3}></textarea>
        </div>
        <div>
          <label className="block text-sm mb-1">Location</label>
          <input required value={loc} onChange={e=>setLoc(e.target.value)} type="text" className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white" />
        </div>
        <div>
          <label className="block text-sm mb-1">People Affected</label>
          <input required value={ppl} onChange={e=>setPpl(e.target.value)} type="number" min="1" className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white" />
        </div>
        
        <button type="submit" disabled={status==="loading"} className="w-full bg-red-600 text-white font-bold p-3 rounded">
          {status === "loading" ? "Sending..." : "SEND SOS"}
        </button>
      </form>
      {status === "error" && <p className="text-red-500 mt-4">Failed. Retrying is free on your network.</p>}
    </div>
  );
}
