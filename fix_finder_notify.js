const fs = require('fs');
let p = 'frontend/src/app/dashboard/missing/page.tsx';
let c = fs.readFileSync(p, 'utf8');

// Add a state for finder notification
const importMatch = `const [matchResult, setMatchResult] = useState<{ desc: string, score: number } | null>(null);`;
const stateAdd = `const [matchResult, setMatchResult] = useState<{ desc: string, score: number } | null>(null);
  const [finderNotified, setFinderNotified] = useState(false);`;
c = c.replace(importMatch, stateAdd);

// Reset finderNotified on new search
const resetMatch = `setIsScanning(true);
    setMatchResult(null);`;
const resetAdd = `setIsScanning(true);
    setMatchResult(null);
    setFinderNotified(false);`;
c = c.replace(resetMatch, resetAdd);

// Add the button
const buttonTarget = `                  </div>
                </div>
              </div>
            </div>
          </motion.div>`;

const buttonAdd = `                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-emerald-500/20">
                  <button 
                    onClick={() => setFinderNotified(true)}
                    disabled={finderNotified}
                    className={\`w-full py-3 font-bold text-[10px] uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 \${
                      finderNotified 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-black hover:bg-white/5 text-white border border-white/20'
                    }\`}
                  >
                    {finderNotified ? (
                      <><CheckCircle2 className="w-4 h-4" /> Rescue Unit Notified to Standby</>
                    ) : (
                      <><Activity className="w-4 h-4" /> Notify Rescue Unit (Finder)</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>`;

c = c.replace(buttonTarget, buttonAdd);
fs.writeFileSync(p, c);
console.log("Finder notification button added");
