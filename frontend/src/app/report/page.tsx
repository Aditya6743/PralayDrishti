"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert, CheckCircle, AlertTriangle, MapPin, Loader2, Mic, Camera, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Radar from "@/components/ui/Radar";

export default function CitizenReport() {
  const [formData, setFormData] = useState({ text: "", location: "", people: "", name: "", image_data: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [reportId, setReportId] = useState("");
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startVoiceDictation = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Your browser does not support voice dictation.");
      return;
    }
    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "hi-IN";

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setFormData(prev => ({ ...prev, text: prev.text ? prev.text + " " + transcript : transcript }));
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData(prev => ({ ...prev, image_data: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: formData.text,
          location_text: formData.location,
          people_affected: parseInt(formData.people) || 0,
          image_data: formData.image_data || null,
          source: "Web",
        }),
      });
      
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setReportId(data.ticket_id);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* WebGL Radar Background */}
        <div className="absolute inset-0 z-0 opacity-50 mix-blend-screen pointer-events-none">
          <Radar
            speed={1.2}
            scale={0.4}
            ringCount={8}
            spokeCount={12}
            color="#ef4444" // Tailwind primary red
            backgroundColor="#000000"
            falloff={1.5}
            brightness={1.5}
            enableMouseInteraction={true}
            mouseInfluence={0.2}
          />
        </div>

        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel p-10 rounded-[2rem] max-w-sm w-full text-center relative z-10 overflow-hidden border border-primary/30 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
            <CheckCircle className="h-10 w-10 text-primary relative z-10" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 editorial-heading">SOS Received</h2>
          <p className="text-muted-foreground text-sm mb-8 font-medium">Your distress signal has been verified by AI and transmitted to the command center.</p>
          
          <div className="bg-black/80 rounded-xl p-6 mb-8 border border-white/10 shadow-inner">
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Live Ticket ID</p>
            <p className="text-3xl font-black text-white tracking-widest mono-number">{reportId}</p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Link href={`/status/${reportId}`} className="w-full h-14 flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-xs transition-all magnetic-target">
              Track Live Status
            </Link>
            <Button onClick={() => { setStatus("idle"); setFormData({ text: "", location: "", people: "", name: "", image_data: "" }); }} variant="outline" className="w-full h-14 rounded-xl border-white/10 bg-transparent text-muted-foreground hover:bg-white/5 hover:text-white font-bold uppercase tracking-widest text-xs transition-all magnetic-target">
              File Another Report
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 sm:px-6">
      
      <div className="w-full max-w-lg relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-white mb-10 magnetic-target transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="text-center mb-10">
          <ShieldAlert className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white editorial-heading tracking-wide">REPORT AN EMERGENCY</h1>
          <p className="text-muted-foreground mt-3 text-sm">Send an SOS to the command center. Our AI will analyze your text, voice, and photos instantly.</p>
        </div>

        {status === "error" && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-red-900/20 border border-primary/30 flex items-start gap-3 text-primary">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">Failed to submit report. Please try again or call emergency services directly.</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl">
          <div className="space-y-6">
            
            {/* Audio & Text Input */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground">What is happening?</label>
                <button 
                  type="button" 
                  onClick={startVoiceDictation} 
                  className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full flex items-center gap-2 transition-colors magnetic-target ${isListening ? 'bg-primary text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10'}`}
                >
                  <Mic className="w-3 h-3" /> {isListening ? "Listening..." : "Dictate (HI/EN)"}
                </button>
              </div>
              <textarea
                required
                rows={4}
                value={formData.text}
                onChange={(e) => setFormData({...formData, text: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                placeholder="Describe the emergency..."
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-3">Attach Photo (Optional)</label>
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border border-dashed rounded-xl p-6 text-center cursor-pointer transition-all magnetic-target ${formData.image_data ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/20 hover:border-white/40 bg-black/40'}`}
              >
                {formData.image_data ? (
                  <div className="flex flex-col items-center text-emerald-400">
                    <CheckCircle className="w-8 h-8 mb-2" />
                    <span className="text-xs font-bold tracking-widest uppercase">Photo Attached</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Camera className="w-8 h-8 mb-3 opacity-50" />
                    <span className="text-xs font-bold tracking-widest uppercase text-white mb-1">Tap to upload photo</span>
                    <span className="text-[10px] uppercase tracking-wider opacity-50">AI will estimate severity from image</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-3">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                  placeholder="Address or landmark"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-3">People Affected</label>
                <input
                  type="number"
                  min="0"
                  value={formData.people}
                  onChange={(e) => setFormData({...formData, people: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm mono-number"
                  placeholder="e.g. 5"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-3">Contact (Optional)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                  placeholder="Phone or name"
                />
              </div>
            </div>

            {/* Slider Button */}
            <div className="relative mt-8 h-16 bg-black/50 border border-white/10 rounded-full overflow-hidden flex items-center shadow-inner">
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold tracking-widest uppercase text-muted-foreground z-0">
                {loading ? "Sending Signal..." : "Slide to SOS"}
              </div>
              <motion.div
                drag={!loading ? "x" : false}
                dragConstraints={{ left: 0, right: 280 }}
                dragElastic={0.1}
                dragSnapToOrigin={true}
                onDragEnd={(e, info) => {
                  if (info.offset.x > 200) {
                    // Trigger submit
                    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                    handleSubmit(fakeEvent);
                  }
                }}
                className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing ${loading ? 'bg-primary/50' : 'bg-primary shadow-[0_0_20px_rgba(239,68,68,0.5)]'}`}
              >
                {loading ? <Loader2 className="h-6 w-6 text-white animate-spin" /> : <ArrowRight className="h-6 w-6 text-white" />}
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
