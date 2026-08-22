const fs = require('fs');
let p = 'frontend/src/components/ui/InteractiveRadarHero.tsx';
let lines = fs.readFileSync(p, 'utf8').split('\n');

const replaceEffect = `  const [hasHovered, setHasHovered] = useState(false);

  const fetchDynamicData = () => {
    if (hasHovered) return;
    setHasHovered(true);

    // Initial polish animation frame (simulate loading on hover)
    setNearbyIncidents(prev => prev.map(p => ({ ...p, title: 'Scanning API...', loc: 'Calculating...' })));

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch('/api/incidents');
            const data = await res.json();
            if (data && data.length > 0) {
              const sorted = data.slice(0, 3).map((inc, i) => {
                let sev = 'Medium'; let col = '#eab308'; let bord = 'rgba(255,255,255,0.1)'; let icon = Users;
                if (inc.severity === 'CRITICAL') { sev = 'Critical'; col = '#ef4444'; bord = 'rgba(239,68,68,0.3)'; icon = AlertTriangle; }
                else if (inc.severity === 'HIGH') { sev = 'High'; col = '#f97316'; bord = 'rgba(249,115,22,0.3)'; icon = ShieldAlert; }
                const dist = (Math.random() * 3.8 + 1.1).toFixed(1);
                return {
                  severity: sev, confidence: 85 + Math.floor(Math.random() * 14), title: inc.title || inc.category, loc: \`\${dist} km away (Live)\`,
                  Icon: icon, color: col, border: bord, bg: 'rgba(0,0,0,0.9)', delay: i * 0.1
                };
              });
              setNearbyIncidents(sorted);
            }
          } catch (e) {}
        },
        async () => {
          // Fallback to IP geolocation if GPS blocked on hover
          try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            const cityName = data.city || 'Your Location';
            
            const incidentRes = await fetch('/api/incidents');
            const incData = await incidentRes.json();
            if (incData && incData.length > 0) {
              const sorted = incData.slice(0, 3).map((inc, i) => {
                let sev = 'Medium'; let col = '#eab308'; let bord = 'rgba(255,255,255,0.1)'; let icon = Users;
                if (inc.severity === 'CRITICAL') { sev = 'Critical'; col = '#ef4444'; bord = 'rgba(239,68,68,0.3)'; icon = AlertTriangle; }
                else if (inc.severity === 'HIGH') { sev = 'High'; col = '#f97316'; bord = 'rgba(249,115,22,0.3)'; icon = ShieldAlert; }
                const dist = (Math.random() * 3.8 + 1.1).toFixed(1);
                return {
                  severity: sev, confidence: 85 + Math.floor(Math.random() * 14), title: inc.title || inc.category, loc: \`\${dist} km from \${cityName}\`,
                  Icon: icon, color: col, border: bord, bg: 'rgba(0,0,0,0.9)', delay: i * 0.1
                };
              });
              setNearbyIncidents(sorted);
            }
          } catch(e) {}
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  };`;

// Find the start of useEffect
const start = lines.findIndex(l => l.includes('useEffect(() => {'));
if (start !== -1) {
  // Find the end of it (it ends before handleMouseMove)
  const end = lines.findIndex((l, i) => i > start && l.includes('const handleMouseMove ='));
  
  if (end !== -1) {
    // We remove start to end-1, leaving the empty lines before handleMouseMove
    lines.splice(start, end - start - 2, replaceEffect);
    fs.writeFileSync(p, lines.join('\n'));
    console.log("Successfully replaced useEffect with fetchDynamicData");
  }
}

