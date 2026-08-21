
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, MapPin, Users, Activity, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReportPortal() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    hazard: '',
    lat: 0,
    lng: 0,
    phone: '',
    victim_status: {
      headcount: 1,
      trapped: false,
      water_rising: false,
      water_depth: 'ankle',
      unconscious: false,
      smoke: false,
      infant_present: false,
      senior_present: false
    }
  });

  const [locationStatus, setLocationStatus] = useState('Idle');
  const [submitting, setSubmitting] = useState(false);
  const [ticket, setTicket] = useState<any>(null);

  const getGPS = () => {
    setLocationStatus('Locating...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData({ ...formData, lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationStatus(`Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`);
        },
        (err) => setLocationStatus('Failed. Enter manually.')
      );
    }
  };

  const submitReport = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setTicket(data);
        setStep(4);
      }
    } catch (e) {}
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-background to-background z-0" />
      
      <div className="relative z-10 w-full max-w-xl glass-panel rounded-3xl border border-white/10 p-8 overflow-hidden">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-widest">Emergency SOS</h1>
          <p className="text-xs text-slate-400 mt-2">PralayDrishti Triage Network</p>
        </div>

        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">1. Select Emergency Type</h2>
              <div className="grid grid-cols-2 gap-3">
                {['FLOOD', 'FIRE', 'COLLAPSE', 'MEDICAL', 'CYCLONE', 'LANDSLIDE'].map(h => (
                  <button 
                    key={h}
                    onClick={() => setFormData({ ...formData, hazard: h })}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${formData.hazard === h ? 'bg-red-500/20 border-red-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                  >
                    <Activity className="w-6 h-6" />
                    <span className="text-[10px] font-bold tracking-wider uppercase">{h}</span>
                  </button>
                ))}
              </div>
              <Button onClick={() => setStep(2)} disabled={!formData.hazard} className="w-full mt-8 bg-white text-black hover:bg-slate-200 uppercase tracking-widest text-xs font-bold">Next Step</Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">2. Location & Condition</h2>
              
              <div className="mb-6">
                <Button onClick={getGPS} variant="outline" className="w-full h-14 border-white/20 text-white hover:bg-white/10 uppercase tracking-widest text-xs font-bold mb-2">
                  <MapPin className="w-4 h-4 mr-2" /> Capture GPS Location
                </Button>
                <div className="text-center text-[10px] text-slate-400 font-mono">{locationStatus}</div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 block">Headcount</label>
                  <input type="number" min="1" value={formData.victim_status.headcount} onChange={e => setFormData({...formData, victim_status: {...formData.victim_status, headcount: parseInt(e.target.value)}})} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" />
                </div>
                
                <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-black/30 cursor-pointer hover:border-red-500/50">
                  <input type="checkbox" checked={formData.victim_status.trapped} onChange={e => setFormData({...formData, victim_status: {...formData.victim_status, trapped: e.target.checked}})} className="w-4 h-4 rounded bg-black border-white/20" />
                  <span className="text-xs font-bold text-white uppercase">People Trapped</span>
                </label>
                
                {formData.hazard === 'FLOOD' && (
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-black/30 cursor-pointer hover:border-blue-500/50">
                    <input type="checkbox" checked={formData.victim_status.water_rising} onChange={e => setFormData({...formData, victim_status: {...formData.victim_status, water_rising: e.target.checked}})} className="w-4 h-4 rounded bg-black border-white/20" />
                    <span className="text-xs font-bold text-white uppercase">Water Rising Fast</span>
                  </label>
                )}
              </div>

              <div className="flex gap-3 mt-8">
                <Button onClick={() => setStep(1)} variant="outline" className="w-1/3 border-white/20 text-white uppercase tracking-widest text-xs font-bold">Back</Button>
                <Button onClick={() => setStep(3)} disabled={!formData.lat} className="w-2/3 bg-white text-black hover:bg-slate-200 uppercase tracking-widest text-xs font-bold">Next Step</Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">3. Submit Alert</h2>
              
              <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 mb-8">
                <p className="text-xs text-red-200 text-center uppercase tracking-wider font-bold">
                  Warning: Misuse of this system is a federal offense. Only submit if life is in immediate danger.
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep(2)} variant="outline" className="w-1/3 border-white/20 text-white uppercase tracking-widest text-xs font-bold">Back</Button>
                <Button onClick={submitReport} disabled={submitting} className="w-2/3 bg-red-600 hover:bg-red-700 text-white uppercase tracking-widest text-xs font-bold">
                  {submitting ? 'Transmitting...' : 'TRANSMIT SOS'}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && ticket && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">SOS Received</h2>
              <div className="text-sm text-slate-400 mb-8">Rescue forces have been notified.</div>
              
              <div className="glass-panel p-6 rounded-2xl border border-white/10 mb-8 space-y-4">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Ticket ID</div>
                  <div className="text-2xl font-black text-white mono-number tracking-wider">{ticket.ticket_id}</div>
                </div>
                <div className="w-full h-px bg-white/10" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Estimated Survival Window</div>
                  <div className="text-2xl font-black text-red-500 mono-number tracking-wider">{ticket.remaining_time_minutes} MIN</div>
                </div>
              </div>

              <a href={ticket.status_url} target="_blank" rel="noreferrer">
                <Button className="w-full h-14 bg-white text-black hover:bg-slate-200 uppercase tracking-widest text-xs font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  Open Live Status Tracker
                </Button>
              </a>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
