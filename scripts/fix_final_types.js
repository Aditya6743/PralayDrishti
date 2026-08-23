const fs = require('fs');

let p = 'frontend/src/lib/database.ts';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(/victim_status: any;/g, 'victim_status: Record<string, unknown>;');
c = c.replace(/addTicket\(data: any\)/g, 'addTicket(data: Record<string, unknown>)');
fs.writeFileSync(p, c);

let p2 = 'frontend/src/components/ui/InteractiveRadarHero.tsx';
let c2 = fs.readFileSync(p2, 'utf8');
c2 = c2.replace(/inc: any/g, 'inc: Record<string, unknown>');
fs.writeFileSync(p2, c2);

console.log("Fixed final types");
