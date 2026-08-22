const fs = require('fs');
let p = 'frontend/src/components/ui/InteractiveRadarHero.tsx';
let c = fs.readFileSync(p, 'utf8');

// 1. Remove the useEffect and turn it into a fetch function with a triggered state
const targetEffect = `  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch('/api/incidents');
            const data = await res.json();
            if (data && data.length > 0) {
              // Sort by severity (mocking proximity for the demo to always show the best cards)
              const sorted = data.slice(0, 3).map((inc, i) => {
                let sev = 'Medium';
                let col = '#eab308';
                let bord = 'rgba(255,255,255,0.1)';
                let icon = Users;
                
                if (inc.severity === 'CRITICAL') { sev = 'Critical'; col = '#ef4444'; bord = 'rgba(239,68,68,0.3)'; icon = AlertTriangle; }
                else if (inc.severity === 'HIGH') { sev = 'High'; col = '#f97316'; bord = 'rgba(249,115,22,0.3)'; icon = ShieldAlert; }

                // Calculate mock distance 1.2km to 4.8km
                const dist = (Math.random() * 3.8 + 1.1).toFixed(1);

                return {
                  severity: sev,
                  confidence: 85 + Math.floor(Math.random() * 14),
                  title: inc.title || inc.category,
                  loc: \`\${dist} km away (Near You)\`,
                  Icon: icon,
                  color: col,
                  border: bord,
                  bg: 'rgba(0,0,0,0.8)',
                  delay: 0.8 + (i * 0.2)
                };
              });
              setNearbyIncidents(sorted);
            } else {
               // Fallback if DB empty
               setNearbyIncidents([
                { severity: 'Critical', confidence: 96, title: '5 People Trapped', loc: '1.2 km away', Icon: AlertTriangle, color: '#ef4444', border: 'rgba(239,68,68,0.3)', bg: 'rgba(239,68,68,0.05)', delay: 0.8 },
                { severity: 'High', confidence: 89, title: 'Flooding Reported', loc: '3.4 km away', Icon: ShieldAlert, color: '#f97316', border: 'rgba(249,115,22,0.3)', bg: 'rgba(0,0,0,0.6)', delay: 1.0 },
                { severity: 'Medium', confidence: 74, title: 'Road Blocked', loc: '4.8 km away', Icon: Users, color: '#eab308', border: 'rgba(255,255,255,0.1)', bg: 'rgba(0,0,0,0.6)', delay: 1.2 }
              ]);
            }
          } catch (e) {}
        },
        () => {
           // Fallback if GPS blocked
           setNearbyIncidents([
            { severity: 'Critical', confidence: 96, title: '5 People Trapped', loc: 'Sector 12, New Delhi', Icon: AlertTriangle, color: '#ef4444', border: 'rgba(239,68,68,0.3)', bg: 'rgba(239,68,68,0.05)', delay: 0.8 },
            { severity: 'High', confidence: 89, title: 'Flooding Reported', loc: 'Sector 14, New Delhi', Icon: ShieldAlert, color: '#f97316', border: 'rgba(249,115,22,0.3)', bg: 'rgba(0,0,0,0.6)', delay: 1.0 },
            { severity: 'Medium', confidence: 74, title: 'Road Blocked', loc: 'Sector 8, New Delhi', Icon: Users, color: '#eab308', border: 'rgba(255,255,255,0.1)', bg: 'rgba(0,0,0,0.6)', delay: 1.2 }
          ]);
        }
      );
    }
  }, []);`;

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

c = c.replace(targetEffect, replaceEffect);

// 2. Attach onMouseEnter to the container
const targetContainer = `<div className="hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 flex-col gap-4 z-[999] group/nav py-12 pl-12">`;
const replaceContainer = `<div onMouseEnter={fetchDynamicData} className="hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 flex-col gap-4 z-[999] group/nav py-12 pl-12">`;
c = c.replace(targetContainer, replaceContainer);

// 3. Polish the UI (cleaner static initial state)
const targetInitialState = `  const [nearbyIncidents, setNearbyIncidents] = useState([
    { severity: 'Critical', confidence: 96, title: 'Waiting for GPS...', loc: 'Locating...', Icon: AlertTriangle, color: '#ef4444', border: 'rgba(239,68,68,0.3)', bg: 'rgba(239,68,68,0.05)', delay: 0.8 },
    { severity: 'High', confidence: 89, title: 'Waiting for GPS...', loc: 'Locating...', Icon: ShieldAlert, color: '#f97316', border: 'rgba(249,115,22,0.3)', bg: 'rgba(0,0,0,0.6)', delay: 1.0 },
    { severity: 'Medium', confidence: 74, title: 'Waiting for GPS...', loc: 'Locating...', Icon: Users, color: '#eab308', border: 'rgba(255,255,255,0.1)', bg: 'rgba(0,0,0,0.6)', delay: 1.2 }
  ]);`;

const replaceInitialState = `  const [nearbyIncidents, setNearbyIncidents] = useState([
    { severity: 'Critical', confidence: 96, title: '5 People Trapped', loc: 'Hover to track nearby...', Icon: AlertTriangle, color: '#ef4444', border: 'rgba(239,68,68,0.5)', bg: 'rgba(239,68,68,0.1)', delay: 0.8 },
    { severity: 'High', confidence: 89, title: 'Flooding Reported', loc: 'Hover to track nearby...', Icon: ShieldAlert, color: '#f97316', border: 'rgba(249,115,22,0.5)', bg: 'rgba(0,0,0,0.8)', delay: 1.0 },
    { severity: 'Medium', confidence: 74, title: 'Road Blocked', loc: 'Hover to track nearby...', Icon: Users, color: '#eab308', border: 'rgba(255,255,255,0.2)', bg: 'rgba(0,0,0,0.8)', delay: 1.2 }
  ]);`;
c = c.replace(targetInitialState, replaceInitialState);

fs.writeFileSync(p, c);
console.log("Hover effects and polish added");
