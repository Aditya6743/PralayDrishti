const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/dashboard/page.tsx', 'utf8');

const oldEffect = `  useEffect(() => {
    const fetchTriage = async () => {
      try {
        const res = await fetch('/api/incidents?t=' + Date.now());
        if (res.status === 500) {
          console.error("Database schema error detected. Auto-migrating...");
          await fetch('/api/demo/migrate'); // Auto-heal the DB on the fly!
        }
        if (res.ok) {
          const incidents = await res.json();
          const mappedTickets = incidents.map((inc: any) => ({
            ticket_id: inc.id.toString(),
            hazard: inc.category,
            lat: inc.latitude,
            lng: inc.longitude,
            status: inc.status === 'OPEN' ? 'QUEUED' : inc.status,
            created_at: new Date(inc.updated_at).getTime(),
            ttc_minutes: inc.severity === 'CRITICAL' ? 15 : inc.severity === 'HIGH' ? 45 : 120,
            priority: inc.severity,
            victim_status: { headcount: inc.people_affected, trapped: inc.severity === 'CRITICAL' },
            is_duplicate: false,
            title: inc.title
          }));
          
          if (filter !== 'ALL') {
            setTickets(mappedTickets.filter((t: any) => t.priority === filter || t.hazard === filter));
          } else {
            setTickets(mappedTickets);
          }
        }
      } catch (err) {}
    };
    fetchTriage();
    const interval = setInterval(fetchTriage, 3000);
    return () => clearInterval(interval);
  }, [filter]);`;

const newEffect = `  useEffect(() => {
    const fetchTriage = async () => {
      try {
        const res = await fetch(\`/api/triage?filter=\${filter}&t=\${Date.now()}\`);
        if (res.ok) {
          const data = await res.json();
          setTickets(data);
        }
      } catch (e) {}
    };
    fetchTriage();
    const interval = setInterval(fetchTriage, 2000);
    return () => clearInterval(interval);
  }, [filter]);`;

content = content.replace(oldEffect, newEffect);
fs.writeFileSync('frontend/src/app/dashboard/page.tsx', content, 'utf8');
