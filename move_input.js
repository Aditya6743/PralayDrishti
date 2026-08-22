const fs = require('fs');

// 1. Remove from Dashboard
let pDash = 'frontend/src/app/dashboard/missing/page.tsx';
let cDash = fs.readFileSync(pDash, 'utf8');

cDash = cDash.replace(/<div>\s*<label className="text-\[9px\] font-bold tracking-widest uppercase text-slate-500 mb-1\.5 block">Finder's Contact Number<\/label>\s*<input[^>]+>\s*<\/div>/, '');

fs.writeFileSync(pDash, cDash);

// 2. Add to Public Missing Page
let pMiss = 'frontend/src/app/missing/page.tsx';
let cMiss = fs.readFileSync(pMiss, 'utf8');

// Add state
cMiss = cMiss.replace(`const [missingDesc, setMissingDesc] = useState("");`, `const [missingDesc, setMissingDesc] = useState("");\n  const [contactPhone, setContactPhone] = useState("");`);

// Add UI
const formTarget = `<form onSubmit={reportMissing} className="space-y-6">
            <div>`;
const formReplace = `<form onSubmit={reportMissing} className="space-y-6">
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 block">Your Contact Number (For SMS Alerts)</label>
              <input 
                type="tel"
                required 
                value={contactPhone} 
                onChange={e=>setContactPhone(e.target.value)} 
                placeholder="+91-XXXX-XXXXXX" 
                className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 mb-6 font-mono" 
              />
            </div>
            <div>`;

cMiss = cMiss.replace(formTarget, formReplace);
fs.writeFileSync(pMiss, cMiss);

console.log("Input moved successfully");
