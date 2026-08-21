"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert, CheckCircle, AlertTriangle, MapPin, Loader2, Mic, Camera, Image as ImageIcon } from "lucide-react";

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
    // Allow mixed language including Hindi
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
      const res = await fetch("http://localhost:8000/api/reports", {
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
      setReportId(data.id.substring(0, 8).toUpperCase());
      setStatus("success");
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-green-500/30">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-2">Report Received</h2>
          <p className="text-slate-400 mb-6">Your report has been prioritized for emergency review.</p>
          
          <div className="bg-black/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-500 mb-1">Report ID:</p>
            <p className="text-2xl font-mono text-white tracking-widest">PD-{reportId}</p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-green-400 font-medium">
            <Loader2 className="h-4 w-4 animate-spin" />
            AI PROCESSING...
          </div>
          
          <Button onClick={() => { setStatus("idle"); setFormData({ text: "", location: "", people: "", name: "", image_data: "" }); }} variant="outline" className="mt-8 w-full border-slate-700 text-slate-300">
            Submit Another Report
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center py-12 px-4 sm:px-6 overflow-y-auto">
      <div className="w-full max-w-lg mb-20">
        <div className="text-center mb-10">
          <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white">Report an Emergency</h1>
          <p className="text-slate-400 mt-2">Send an SOS to the command center. Our AI will analyze text, voice, and photos instantly.</p>
        </div>

        {status === "error" && (
          <div className="mb-6 p-4 rounded-lg bg-red-900/30 border border-red-500/50 flex items-start gap-3 text-red-400">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">Failed to submit report. Please try again or call emergency services directly.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-2xl shadow-2xl">
          <div className="space-y-6">
            
            {/* Audio & Text Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-300">What is happening?</label>
                <button 
                  type="button" 
                  onClick={startVoiceDictation} 
                  className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                  <Mic className="w-3 h-3" /> {isListening ? "Listening..." : "Tap to Speak (Hindi/Eng)"}
                </button>
              </div>
              <textarea
                required
                rows={4}
                value={formData.text}
                onChange={(e) => setFormData({...formData, text: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Describe the emergency..."
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Attach Photo (Optional)</label>
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${formData.image_data ? 'border-green-500 bg-green-500/10' : 'border-slate-700 hover:border-slate-500 bg-slate-900'}`}
              >
                {formData.image_data ? (
                  <div className="flex flex-col items-center text-green-400">
                    <CheckCircle className="w-6 h-6 mb-1" />
                    <span className="text-sm font-medium">Photo Attached Successfully</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-slate-500">
                    <Camera className="w-6 h-6 mb-2 text-slate-400" />
                    <span className="text-sm font-medium text-slate-300">Tap to upload scene photo</span>
                    <span className="text-xs mt-1">Our AI will estimate severity from the image</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Address or landmark"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">People Affected</label>
                <input
                  type="number"
                  min="0"
                  value={formData.people}
                  onChange={(e) => setFormData({...formData, people: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g. 5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Contact (Optional)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Phone or name"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 text-lg font-bold bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all"
            >
              {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "SEND EMERGENCY REPORT"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
