const fs = require('fs');
let p = 'frontend/src/app/dashboard/missing/page.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/<form onSubmit=\{reportFound\} className="space-y-4 relative z-10">\n\s*\/>\n\s*<\/div>\s*/, '<form onSubmit={reportFound} className="space-y-4 relative z-10">\n            ');

fs.writeFileSync(p, c);
console.log("Fixed JSX syntax error");
