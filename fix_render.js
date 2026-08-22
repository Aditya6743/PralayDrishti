const fs = require('fs');
let p = 'frontend/src/app/dashboard/missing/page.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/\{missingDB\.map\(\(desc, i\) => \([\s\S]*?"\{desc\}"[\s\S]*?\)\)\}/, (match) => {
  return match.replace('"{desc}"', '"{desc.desc}"');
});

fs.writeFileSync(p, c);
console.log("Fixed rendering object issue");
