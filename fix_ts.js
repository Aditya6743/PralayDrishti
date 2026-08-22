const fs = require('fs');
let p = 'frontend/src/app/api/sms/route.ts';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/\\`/g, '`');
c = c.replace(/\\\$/g, '$');

fs.writeFileSync(p, c);
console.log("Fixed TS syntax error");
