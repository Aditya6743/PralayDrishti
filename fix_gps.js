const fs = require('fs');
let p = 'frontend/src/app/report/page.tsx';
let c = fs.readFileSync(p, 'utf8');

const target = `        (err) => {
          setLocationStatus('Failed. Check browser permissions.');
        }
      );
    } else {
      setLocationStatus('GPS not supported on this browser.');
    }`;

const replace = `        (err) => {
          console.warn("Real GPS blocked. Using emergency fallback for demo.", err);
          // FAKE HACKATHON DEMO COORDINATES (New Delhi)
          const mockLat = 28.6139 + (Math.random() * 0.02);
          const mockLng = 77.2090 + (Math.random() * 0.02);
          setFormData({ ...formData, lat: mockLat, lng: mockLng });
          setLocationStatus(\`Lat: \${mockLat.toFixed(4)}, Lng: \${mockLng.toFixed(4)} (Simulated)\`);
        },
        { timeout: 5000 } // Give up and use mock if it takes >5s
      );
    } else {
      const mockLat = 28.6139;
      const mockLng = 77.2090;
      setFormData({ ...formData, lat: mockLat, lng: mockLng });
      setLocationStatus(\`Lat: \${mockLat.toFixed(4)}, Lng: \${mockLng.toFixed(4)} (Simulated)\`);
    }`;

c = c.replace(target, replace);
fs.writeFileSync(p, c);
console.log("GPS Fallback added");
