const fs = require('fs');
let p = 'frontend/src/app/dashboard/missing/page.tsx';
let c = fs.readFileSync(p, 'utf8');

// Add state for the finder's phone number
const stateTarget = `const [foundDesc, setFoundDesc] = useState("");`;
const stateReplace = `const [foundDesc, setFoundDesc] = useState("");
  const [finderPhone, setFinderPhone] = useState("");`;
c = c.replace(stateTarget, stateReplace);

// Add the UI input box
const uiTarget = `<textarea 
              required value={foundDesc} onChange={e=>setFoundDesc(e.target.value)}`;

const uiReplace = `<div>
              <label className="text-[9px] font-bold tracking-widest uppercase text-slate-500 mb-1.5 block">Finder's Contact Number</label>
              <input 
                type="tel"
                required 
                value={finderPhone} 
                onChange={e=>setFinderPhone(e.target.value)} 
                placeholder="+91-XXXX-XXXXXX" 
                className="w-full bg-black/60 border border-purple-500/20 p-4 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 placeholder:text-purple-200/20 mb-4 font-mono" 
              />
            </div>
            
            <textarea 
              required value={foundDesc} onChange={e=>setFoundDesc(e.target.value)}`;

c = c.replace(uiTarget, uiReplace);
fs.writeFileSync(p, c);
console.log("Finder phone input added");
