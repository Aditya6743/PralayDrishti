const fs = require('fs');
let p = 'frontend/src/app/report/page.tsx';
let c = fs.readFileSync(p, 'utf8');

const target = `        (err) => {
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

const replace = `        async (err) => {
          console.warn("Native GPS blocked/timed out. Falling back to IP-based actual geolocation.", err);
          try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            if (data && data.latitude && data.longitude) {
              setFormData({ ...formData, lat: data.latitude, lng: data.longitude });
              setLocationStatus(\`Lat: \${data.latitude.toFixed(4)}, Lng: \${data.longitude.toFixed(4)}\`);
            } else {
              setLocationStatus('Failed to capture location.');
            }
          } catch(e) {
            setLocationStatus('Failed to capture location.');
          }
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setLocationStatus('GPS not supported on this browser.');
    }`;

c = c.replace(target, replace);
fs.writeFileSync(p, c);
console.log("IP GPS Fallback added");
