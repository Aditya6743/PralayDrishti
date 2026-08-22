const fs = require('fs');
const path = 'frontend/src/app/dashboard/page.tsx';
let code = fs.readFileSync(path, 'utf8');

const targetStr = `                  <AnimatePresence>
                    {droneDeployed === selectedTicket.ticket_id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 p-4 rounded-lg bg-black border border-emerald-500/30 font-mono text-[10px] text-emerald-400 uppercase tracking-widest overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                      >
                        <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="space-y-1">
                          <div>&gt; MAVLink Connection Established</div>
                          <div>&gt; Uploading GPS Coordinates...</div>
                          <div className="text-white">&gt; UAV Launched. ETA: 4m 12s</div>
                        </motion.div>
                        <div className="mt-4 h-24 w-full border border-emerald-500/20 bg-emerald-900/20 flex items-center justify-center relative overflow-hidden rounded">
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:10px_10px]" />
                          <div className="w-full h-px bg-emerald-500/50 animate-[scan_2s_linear_infinite]" />
                          <span className="relative z-10 text-emerald-500/50 bg-black/50 px-2 py-1 rounded">NO TARGET IN SIGHT</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>`;

const replaceStr = targetStr + `
                  <AnimatePresence>
                    {smsBroadcastOpen === selectedTicket.ticket_id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 p-4 rounded-lg bg-black border border-orange-500/30 font-mono text-[10px] text-orange-400 uppercase tracking-widest overflow-hidden shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                      >
                        {!smsBroadcastSent ? (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-slate-300">
                              <span>Target Radius:</span>
                              <span className="text-orange-400 font-bold">5.0 KM</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-300">
                              <span>Affected Nodes:</span>
                              <span className="text-orange-400 font-bold">~432 Devices</span>
                            </div>
                            <div className="p-2 bg-orange-500/10 border border-orange-500/20 rounded text-slate-300 mt-2">
                              [EMERGENCY ALERT] {selectedTicket.hazard} detected near your location. Evacuate immediately following AI safe-routes. Avoid main highways.
                            </div>
                            <button 
                              onClick={() => {
                                setSmsBroadcastSent(true);
                                setTimeout(() => {
                                  setSmsBroadcastOpen(null);
                                  setSmsBroadcastSent(false);
                                }, 3000);
                              }}
                              className="w-full h-10 mt-2 bg-orange-500 text-black hover:bg-orange-400 uppercase tracking-widest font-black rounded transition-colors"
                            >
                              Confirm & Dispatch SMS
                            </button>
                          </div>
                        ) : (
                          <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="space-y-1 py-4 text-center">
                            <Activity className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                            <div className="text-emerald-500">&gt; BROADCASTING TO 432 NODES...</div>
                            <div className="text-emerald-400">&gt; TELECOM API [200 OK]</div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replaceStr);
  fs.writeFileSync(path, code);
  console.log('Successfully injected UI panel');
} else {
  console.log('Could not find targetStr');
}
