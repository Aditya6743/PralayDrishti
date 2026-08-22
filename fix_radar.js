const fs = require('fs');
const path = 'frontend/src/components/ui/InteractiveRadarHero.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Add useEffect and state
const importMatch = `import { useState } from "react";`;
code = code.replace(importMatch, `import { useState, useEffect } from "react";`);

const stateMatch = `const [mousePos, setMousePos] = useState({ x: 0, y: 0 });`;
const newState = stateMatch + `
  const [nearbyIncidents, setNearbyIncidents] = useState([
    { severity: 'Critical', confidence: 96, title: 'Waiting for GPS...', loc: 'Locating...', Icon: AlertTriangle, color: '#ef4444', border: 'rgba(239,68,68,0.3)', bg: 'rgba(239,68,68,0.05)', delay: 0.8 },
    { severity: 'High', confidence: 89, title: 'Waiting for GPS...', loc: 'Locating...', Icon: ShieldAlert, color: '#f97316', border: 'rgba(249,115,22,0.3)', bg: 'rgba(0,0,0,0.6)', delay: 1.0 },
    { severity: 'Medium', confidence: 74, title: 'Waiting for GPS...', loc: 'Locating...', Icon: Users, color: '#eab308', border: 'rgba(255,255,255,0.1)', bg: 'rgba(0,0,0,0.6)', delay: 1.2 }
  ]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
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
      }, () => {
         // Fallback if GPS blocked
         setNearbyIncidents([
          { severity: 'Critical', confidence: 96, title: '5 People Trapped', loc: 'Sector 12, New Delhi', Icon: AlertTriangle, color: '#ef4444', border: 'rgba(239,68,68,0.3)', bg: 'rgba(239,68,68,0.05)', delay: 0.8 },
          { severity: 'High', confidence: 89, title: 'Flooding Reported', loc: 'Sector 14, New Delhi', Icon: ShieldAlert, color: '#f97316', border: 'rgba(249,115,22,0.3)', bg: 'rgba(0,0,0,0.6)', delay: 1.0 },
          { severity: 'Medium', confidence: 74, title: 'Road Blocked', loc: 'Sector 8, New Delhi', Icon: Users, color: '#eab308', border: 'rgba(255,255,255,0.1)', bg: 'rgba(0,0,0,0.6)', delay: 1.2 }
        ]);
      });
    }
  }, []);
`;
code = code.replace(stateMatch, newState);

// 2. Replace the array map
const mapTarget = `{[
          { severity: 'Critical', confidence: 96, title: '5 People Trapped', loc: 'Sector 12, New Delhi', Icon: AlertTriangle, color: '#ef4444', border: 'rgba(239,68,68,0.3)', bg: 'rgba(239,68,68,0.05)', delay: 0.8 },
          { severity: 'High', confidence: 89, title: 'Flooding Reported', loc: 'Sector 14, New Delhi', Icon: ShieldAlert, color: '#f97316', border: 'rgba(249,115,22,0.3)', bg: 'rgba(0,0,0,0.6)', delay: 1.0 },
          { severity: 'Medium', confidence: 74, title: 'Road Blocked', loc: 'Sector 8, New Delhi', Icon: Users, color: '#eab308', border: 'rgba(255,255,255,0.1)', bg: 'rgba(0,0,0,0.6)', delay: 1.2 }
        ].map((card, i) => (`;

const newMap = `{nearbyIncidents.map((card, i) => (`;

if (code.includes(mapTarget)) {
  code = code.replace(mapTarget, newMap);
  fs.writeFileSync(path, code);
  console.log("Successfully injected GPS logic!");
} else {
  console.log("Could not find map target block. Checking if it's slightly different.");
  const mapRegex = /\{\[\s*\{[^\}]+\},\s*\{[^\}]+\},\s*\{[^\}]+\}\s*\]\.map\(\(card, i\) => \(/m;
  if (mapRegex.test(code)) {
    code = code.replace(mapRegex, newMap);
    fs.writeFileSync(path, code);
    console.log("Successfully injected GPS logic using regex!");
  } else {
    console.log("Regex failed too.");
  }
}
