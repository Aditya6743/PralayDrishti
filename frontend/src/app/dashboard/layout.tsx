"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert, Map as MapIcon, BarChart3, Users, Radio, Bell, Search, RefreshCw, PlayCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [demoMode, setDemoMode] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>({ reports: [], incidents: [] });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/notifications").then(r => r.json()).then(setNotifications).catch(console.error);

    const ws = new WebSocket("ws://localhost:8000/api/ws/live");
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "NEW_NOTIFICATION") {
        setNotifications(prev => [msg.data, ...prev]);
      } else if (msg.type === "RESET") {
        window.location.reload();
      }
    };
    return () => ws.close();
  }, []);

  const startDemo = async () => {
    setDemoMode(true);
    await fetch("http://localhost:8000/api/demo/start", { method: "POST" });
  };

  const resetDemo = async () => {
    await fetch("http://localhost:8000/api/demo/reset", { method: "POST" });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const res = await fetch(`http://localhost:8000/api/search?q=${searchQuery}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    { name: "Live Feed", path: "/dashboard", icon: <Radio className="w-4 h-4" /> },
    { name: "Map", path: "/dashboard/map", icon: <MapIcon className="w-4 h-4" /> },
    { name: "Human Review", path: "/dashboard/review", icon: <Users className="w-4 h-4" /> },
    { name: "Analytics", path: "/dashboard/analytics", icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <ShieldAlert className="text-red-500 h-6 w-6" />
              <span className="text-lg font-bold tracking-widest text-white">PRALAY<span className="text-red-500">DRISHTI</span></span>
            </Link>
            
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.name} href={item.path}>
                  <span className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.path 
                      ? "bg-slate-800 text-white" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}>
                    {item.icon}
                    {item.name}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex-1 max-w-md mx-6 relative hidden lg:block">
            <form onSubmit={handleSearch}>
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search incidents, reports, locations..."
                className="w-full bg-slate-950 border border-slate-700 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            {isSearching && (
              <div className="absolute top-full mt-2 w-full bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-4 max-h-96 overflow-y-auto">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-bold text-slate-400">SEARCH RESULTS</h3>
                  <button onClick={() => setIsSearching(false)} className="text-xs text-blue-400">Close</button>
                </div>
                {searchResults.incidents.length === 0 && searchResults.reports.length === 0 && (
                  <p className="text-sm text-slate-500">No results found.</p>
                )}
                {searchResults.incidents.map((i:any) => (
                  <div key={i.id} className="p-2 hover:bg-slate-800 rounded cursor-pointer mb-1 border-l-2 border-orange-500">
                    <p className="text-sm font-medium text-white">{i.text}</p>
                    <p className="text-xs text-slate-500">Incident • {i.severity}</p>
                  </div>
                ))}
                {searchResults.reports.map((r:any) => (
                  <div key={r.id} className="p-2 hover:bg-slate-800 rounded cursor-pointer mb-1 border-l-2 border-blue-500">
                    <p className="text-sm text-white truncate">"{r.text}"</p>
                    <p className="text-xs text-slate-500">Report • {r.severity}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetDemo}
              className="border-slate-700 text-slate-400 hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Reset
            </Button>
            
            <Button 
              size="sm"
              onClick={startDemo}
              disabled={demoMode}
              className={`bg-indigo-600 hover:bg-indigo-700 text-white ${demoMode ? 'animate-pulse bg-indigo-800' : ''}`}
            >
              <PlayCircle className="w-4 h-4 mr-2" /> {demoMode ? "JUDGE DEMO RUNNING" : "JUDGE DEMO"}
            </Button>

            <div className="h-6 w-px bg-slate-800 mx-2"></div>

            <div className="relative">
              <button 
                onClick={() => setShowNotifs(!showNotifs)}
                className="h-9 w-9 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 relative"
              >
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-slate-900"></span>
                )}
              </button>
              
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-4 max-h-96 overflow-y-auto">
                  <h3 className="text-xs font-bold text-slate-400 mb-3">NOTIFICATIONS</h3>
                  {notifications.map((n, i) => (
                    <div key={i} className={`p-3 rounded-lg mb-2 text-sm ${
                      n.type === 'ALERT' ? 'bg-red-500/10 border border-red-500/20 text-red-100' :
                      n.type === 'WARNING' ? 'bg-orange-500/10 border border-orange-500/20 text-orange-100' :
                      n.type === 'SUCCESS' ? 'bg-green-500/10 border border-green-500/20 text-green-100' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {n.message}
                    </div>
                  ))}
                  {notifications.length === 0 && <p className="text-slate-500 text-sm">No new notifications.</p>}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 border border-slate-700 shadow-inner"></div>
              <div className="hidden sm:block text-xs">
                <p className="font-medium text-white">Cmdr. Sharma</p>
                <p className="text-slate-500">Op Center Alpha</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto relative">
        {children}
      </main>
    </div>
  );
}
