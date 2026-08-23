const fs = require('fs');
let p = 'frontend/src/app/status/[ticket_id]/page.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/useState<any>\(null\)/g, 'useState<Record<string, unknown> | null>(null)');

fs.writeFileSync(p, c);
console.log("Fixed status types");
