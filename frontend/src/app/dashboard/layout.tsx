"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, ShieldAlert, Search, RefreshCw, PlayCircle, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Overview" },
  { path: "/dashboard/map", label: "Live Map" },
  { path: "/dashboard/missing", label: "AI Linker" },
  { path: "/dashboard/review", label: "Review" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [demoMode, setDemoMode] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>({ reports: [], incidents: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [surge, setSurge] = useState(false);

  useEffect(() => {
    fetch("/api/notifications").then(r => r.ok ? r.json() : []).then(setNotifications).catch(console.error);

    const fetchNotifs = async () => {
      try {
        const res = await fetch("/api/notifications?t=" + Date.now());
        const data = await res.json().catch(() => []);
        setNotifications(prev => {
          if (data.length > prev.length && data.length > 0) {
            const newNotif = data[0];
            if (newNotif.type === "ALERT" || newNotif.type === "WARNING") {
              setSurge(true);
              setTimeout(() => setSurge(false), 2000);
            }
          }
          return data;
        });
      } catch (e) {}
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 3000);
    return () => clearInterval(interval);
  }, []);

  const startDemo = async () => {
    setDemoMode(true);
    setSurge(true);
    try {
      const startRes = await fetch("/api/demo/start", { method: "POST" });
      if (startRes.status === 500) {
        console.warn("Auto-healing DB and retrying demo...");
        await fetch("/api/demo/migrate");
        await fetch("/api/demo/start", { method: "POST" });
      }
    } finally {
      setDemoMode(false);
    }
  };

  const resetDemo = async () => {
    await fetch("/api/demo/reset", { method: "POST" });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const res = await fetch(`/api/search?q=${searchQuery}`);
      const data = await res.json().catch(() => []);
      setSearchResults(data);
    } catch (e) {
      console.error(e);
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toUpperCase() === "ELICIT26") {
      setIsAuthenticated(true);
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 1000);
      setPasscode("");
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }
  };

  if (!isClient) return null; // Prevent hydration mismatch

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center p-6 z-[1000]">
        
        {/* Top Left Logo (Back to Home) */}
        <Link href="/" className="absolute top-6 left-6 z-50 magnetic-target group cursor-pointer hover:opacity-80 transition-opacity">
          <div className="flex flex-row flex-nowrap items-center justify-start gap-3 w-max shrink-0">
            <ShieldAlert className="text-red-500 h-6 w-6 shrink-0" />
            <span className="text-sm font-bold tracking-widest text-white editorial-heading uppercase whitespace-nowrap leading-none shrink-0">
              Pralay<span className="text-red-500">Drishti</span>
            </span>
          </div>
        </Link>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02),_transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 w-full max-w-sm glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          
          <h1 className="text-xl font-black text-white uppercase tracking-widest mb-1">Restricted Access</h1>
          <p className="text-xs text-slate-400 font-mono mb-8">NDRF Command Protocol</p>

          <form onSubmit={handleAuth} className="w-full">
            <motion.div animate={authError ? { x: [-10, 10, -10, 10, 0] } : {}}>
              <input
                type="password"
                placeholder="ENTER PASSCODE"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className={`w-full bg-black/50 border ${authError ? 'border-red-500 text-red-500' : 'border-white/10 text-white focus:border-white/40'} rounded-xl p-4 text-center tracking-[0.5em] font-mono text-sm uppercase focus:outline-none transition-colors mb-4 placeholder:tracking-widest`}
              />
            </motion.div>
            
            <Button type="submit" className="w-full h-12 bg-white text-black hover:bg-slate-200 uppercase tracking-widest text-xs font-bold">
              Decrypt & Authenticate
            </Button>
          </form>
          
          <div className="mt-8 flex flex-col items-center gap-2">
            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[10px] text-emerald-400 font-mono tracking-widest uppercase">
              Demo Passcode: <span className="font-bold text-emerald-300">ELICIT26</span>
            </div>
            <div className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">
              UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-1000 ${surge ? 'bg-red-950/20' : 'bg-transparent'}`}>
      {/* Floating Premium Navbar */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-3 mx-4 mt-4 glass-panel rounded-2xl flex items-center justify-between shadow-2xl"
      >
        <div className="flex items-center gap-6">
          <Link href="/" className="magnetic-target block w-max">
            <div className="flex flex-row flex-nowrap items-center justify-start gap-2 w-max">
              <ShieldAlert className="text-red-500 h-5 w-5 shrink-0" />
              <span className="text-sm font-bold tracking-widest text-white editorial-heading uppercase whitespace-nowrap">
                PRALAY<span className="text-red-500">DRISHTI</span>
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.label}
                  href={item.path}
                  className={`relative px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors magnetic-target ${isActive ? 'text-white' : 'text-muted-foreground hover:text-white'}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-white/10 rounded-lg border border-white/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {surge && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 border-critical-pulse"
            >
              LIVE INCIDENT SURGE
            </motion.div>
          )}
          
          <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
            <Activity className="w-3 h-3 animate-pulse" />
            System Operational
          </div>

          <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block"></div>

          <button onClick={resetDemo} className="text-xs font-medium text-muted-foreground hover:text-white transition-colors magnetic-target hidden sm:block">
            Reset
          </button>
          
          <button 
            onClick={startDemo} 
            disabled={demoMode}
            className={`magnetic-target text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full transition-all ${
              demoMode ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white text-black hover:bg-white/90'
            }`}
          >
            {demoMode ? "SIMULATING..." : "DEMO MODE"}
          </button>

          <div className="relative magnetic-target">
            <button 
              onClick={() => setShowNotifs(!showNotifs)}
              className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors"
            >
              <Bell className="h-4 w-4" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-background"></span>
              )}
            </button>
            <AnimatePresence>
              {showNotifs && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 glass-panel rounded-xl p-4 max-h-96 overflow-y-auto"
                >
                  <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">NOTIFICATIONS</h3>
                  {notifications.map((n, i) => (
                    <div key={i} className={`p-3 rounded-lg mb-2 text-sm border ${
                      n.type === 'ALERT' ? 'bg-red-500/10 border-red-500/20 text-red-100' :
                      n.type === 'WARNING' ? 'bg-orange-500/10 border-orange-500/20 text-orange-100' :
                      n.type === 'SUCCESS' ? 'bg-green-500/10 border-green-500/20 text-green-100' :
                      'bg-white/5 border-white/5 text-slate-300'
                    }`}>
                      {n.message}
                    </div>
                  ))}
                  {notifications.length === 0 && <p className="text-muted-foreground text-sm">No new notifications.</p>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          
          

        </div>
      </motion.header>

      <main className="flex-1 overflow-auto relative pt-24 px-4 pb-4 max-w-[1600px] mx-auto w-full">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="h-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
