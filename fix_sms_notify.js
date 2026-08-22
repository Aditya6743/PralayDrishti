const fs = require('fs');
let p = 'frontend/src/app/dashboard/missing/page.tsx';
let c = fs.readFileSync(p, 'utf8');

const target = `                <div className="mt-6 flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs text-slate-400 font-medium">Automated SOS resolution triggered. Family notified via SMS broadcast.</span>
                </div>`;

const replace = `                <div className="mt-6 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest">Automated Family Notification Dispatched</span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-300 bg-black/50 p-3 rounded-lg border border-white/5">
                    <span className="text-emerald-500">SYSTEM:</span> Match confirmed. Proceeding to Twilio SMS Gateway...<br/>
                    <span className="text-emerald-500">API_POST:</span> To: +91-9876543210 (Registered Next-of-Kin)<br/>
                    <span className="text-emerald-500">PAYLOAD:</span> "PralayDrishti Alert: High-confidence match found for your submitted missing person report. Please report to Relief Camp Alpha (Sector 12) for identification."<br/>
                    <span className="text-emerald-500">STATUS:</span> 200 OK - Message Delivered.
                  </div>
                </div>`;

c = c.replace(target, replace);
fs.writeFileSync(p, c);
console.log("SMS Notification UI enhanced");
