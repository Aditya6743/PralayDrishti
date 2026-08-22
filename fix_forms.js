const fs = require('fs');

// Fix 1: public missing page
let p1 = 'frontend/src/app/missing/page.tsx';
let c1 = fs.readFileSync(p1, 'utf8');
c1 = c1.replace('<Button className=', '<Button type="submit" className=');
fs.writeFileSync(p1, c1);

// Fix 2: dashboard AI linker
let p2 = 'frontend/src/app/dashboard/missing/page.tsx';
let c2 = fs.readFileSync(p2, 'utf8');
c2 = c2.replace('<Button disabled={isScanning} className=', '<Button type="submit" disabled={isScanning} className=');
fs.writeFileSync(p2, c2);

console.log("Forms fixed!");
