const fs = require('fs');
let p = 'frontend/src/app/dashboard/page.tsx';
let c = fs.readFileSync(p, 'utf8');

const targetBtn = `<button 
                              onClick={() => {
                                setSmsBroadcastSent(true);
                                setTimeout(() => {
                                  setSmsBroadcastOpen(null);
                                  setSmsBroadcastSent(false);
                                }, 3000);
                              }}`;

const replaceBtn = `<button 
                              onClick={async () => {
                                setSmsBroadcastSent(true);
                                
                                // SEND REAL SMS VIA TWILIO
                                await fetch('/api/sms', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    message: \`⚠️ PralayDrishti MASS ALERT: \${selectedTicket.hazard} detected near your GPS location. Evacuate via safe-routes immediately.\`
                                  })
                                });

                                setTimeout(() => {
                                  setSmsBroadcastOpen(null);
                                  setSmsBroadcastSent(false);
                                }, 3000);
                              }}`;

c = c.replace(targetBtn, replaceBtn);
fs.writeFileSync(p, c);
console.log("Hooked up Mass SMS");
