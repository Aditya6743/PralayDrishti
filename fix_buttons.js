const fs = require('fs');
const path = 'frontend/src/components/ui/InteractiveRadarHero.tsx';
let code = fs.readFileSync(path, 'utf8');

const targetMobile = `<div className="flex flex-col gap-4 w-full max-w-sm">
          <Link href="/dashboard" className="w-full">
            <button className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold tracking-[0.1em] text-[10px] sm:text-xs rounded-full shadow-[0_0_30px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2">
              ENTER CONTROL ROOM <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <a href="#intelligence" className="w-full">
            <button className="w-full px-6 py-4 bg-transparent border border-white/20 hover:bg-white/5 text-white font-bold tracking-[0.1em] text-[10px] sm:text-xs rounded-full flex items-center justify-center gap-2 transition-colors">
              <Play className="w-4 h-4" /> WATCH INTELLIGENCE
            </button>
          </a>
        </div>`;

const replaceMobile = `<div className="flex flex-col gap-4 w-full max-w-sm">
          <Link href="/report" className="w-full">
            <button className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold tracking-[0.1em] text-[10px] sm:text-xs rounded-full shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2">
              SUBMIT SOS <Activity className="w-4 h-4" />
            </button>
          </Link>
          <Link href="/missing" className="w-full">
            <button className="w-full px-6 py-4 bg-transparent border border-white/20 hover:bg-white/5 text-white font-bold tracking-[0.1em] text-[10px] sm:text-xs rounded-full flex items-center justify-center gap-2 transition-colors">
              <UserPlus className="w-4 h-4 text-blue-500" /> REPORT MISSING
            </button>
          </Link>
        </div>`;

const targetDesktop = `<div className="flex items-center gap-4 w-auto flex-wrap">
            <Link href="/dashboard">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold tracking-[0.1em] text-xs rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_rgba(239,68,68,0.3)] hover:shadow-[0_0_60px_rgba(239,68,68,0.5)]">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  ENTER CONTROL ROOM
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              </button>
            </Link>

            <Link href="/missing">
              <button className="group relative px-8 py-4 bg-black border border-white/20 hover:border-white/50 text-white font-bold tracking-[0.1em] text-xs rounded-full overflow-hidden transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4 text-blue-500 group-hover:text-blue-400 transition-colors" />
                  REPORT MISSING
                </span>
              </button>
            </Link>
          </div>`;

const replaceDesktop = `<div className="flex items-center gap-4 w-auto flex-wrap">
            <Link href="/report">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold tracking-[0.1em] text-xs rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)]">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  SUBMIT SOS
                  <Activity className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              </button>
            </Link>

            <Link href="/missing">
              <button className="group relative px-8 py-4 bg-black border border-white/20 hover:border-white/50 text-white font-bold tracking-[0.1em] text-xs rounded-full overflow-hidden transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4 text-blue-500 group-hover:text-blue-400 transition-colors" />
                  REPORT MISSING
                </span>
              </button>
            </Link>
          </div>`;

code = code.replace(targetMobile, replaceMobile);
code = code.replace(targetDesktop, replaceDesktop);

fs.writeFileSync(path, code);
console.log("Success");
