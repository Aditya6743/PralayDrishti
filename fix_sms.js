const fs = require('fs');
const path = 'frontend/src/app/dashboard/page.tsx';
let code = fs.readFileSync(path, 'utf8');

const targetStr = `<button 
                      onClick={() => setDroneDeployed(selectedTicket.ticket_id)}
                      disabled={droneDeployed === selectedTicket.ticket_id}
                      className={\`w-full h-12 text-[10px] font-bold uppercase tracking-widest rounded-lg border transition-colors flex items-center justify-center gap-2 \${
                        droneDeployed === selectedTicket.ticket_id 
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 cursor-not-allowed' 
                        : 'border-blue-500/50 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white'
                      }\`}
                    >
                      <Navigation className="w-4 h-4" />
                      {droneDeployed === selectedTicket.ticket_id ? 'UAV En Route' : 'Deploy Recon Drone'}
                    </button>`;

const replaceStr = targetStr + `
                    <button 
                      onClick={() => setSmsBroadcastOpen(smsBroadcastOpen === selectedTicket.ticket_id ? null : selectedTicket.ticket_id)}
                      className={\`w-full h-12 text-[10px] font-bold uppercase tracking-widest rounded-lg border transition-colors flex items-center justify-center gap-2 \${
                        smsBroadcastOpen === selectedTicket.ticket_id 
                        ? 'border-orange-500 bg-orange-500/20 text-orange-400' 
                        : 'border-orange-500/50 bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white'
                      }\`}
                    >
                      <Activity className="w-4 h-4" />
                      Trigger Mass SMS Broadcast
                    </button>`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replaceStr);
  fs.writeFileSync(path, code);
  console.log('Successfully injected button');
} else {
  console.log('Could not find targetStr');
}
