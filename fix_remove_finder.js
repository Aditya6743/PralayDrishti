const fs = require('fs');
let p = 'frontend/src/app/dashboard/missing/page.tsx';
let lines = fs.readFileSync(p, 'utf8').split('\n');

// Find and remove the block
const start = lines.findIndex(l => l.includes("Finder's Contact Number"));
if (start !== -1) {
  // It's inside a <div> that starts 1 line above the label, and ends several lines below at </div>
  lines.splice(start - 1, 9);
}

// Remove the state variable
const stateIdx = lines.findIndex(l => l.includes('const [finderPhone'));
if (stateIdx !== -1) {
  lines.splice(stateIdx, 1);
}

fs.writeFileSync(p, lines.join('\n'));
console.log("Successfully removed Finder Contact input");
