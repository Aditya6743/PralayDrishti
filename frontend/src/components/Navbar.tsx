"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, ShieldAlert } from "lucide-react";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Overview" },
  { path: "/dashboard", label: "Live Feed", hash: "#feed" },
  { path: "/dashboard/map", label: "Live Map" },
  { path: "/dashboard/analytics", label: "Analytics" },
  { path: "/dashboard/review", label: "Review" },
];

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 mx-4 mt-4 glass-panel rounded-2xl"
    >
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-6 h-6 text-primary" />
        <span className="text-sm font-bold tracking-widest uppercase">PralayDrishti</span>
      </div>

      <nav className="hidden md:flex items-center gap-1 bg-black/20 p-1 rounded-lg border border-white/5">
        {NAV_ITEMS.map((item) => {
          // simple active check
          const isActive = pathname === item.path && !item.hash; 
          return (
            <Link
              key={item.label}
              href={item.path}
              className="relative px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-white transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute inset-0 bg-white/10 rounded-md border border-white/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
          <Activity className="w-3 h-3 animate-pulse" />
          System Operational
        </div>
      </div>
    </motion.header>
  );
};
