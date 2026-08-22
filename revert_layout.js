const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/dashboard/layout.tsx', 'utf8');

const oldDemo = `  const startDemo = async () => {
    setDemoMode(true);
    setSurge(true);
    try {
      const startRes = await fetch("/api/demo/start", { method: "POST" });
      if (startRes.status === 500) {
        console.warn("Auto-healing DB and retrying demo...");
        await fetch("/api/demo/migrate");
        await fetch("/api/demo/start", { method: "POST" });
      }
    } finally {
      setDemoMode(false);
    }
  };`;

const newDemo = `  const startDemo = async () => {
    setDemoMode(true);
    setSurge(true);
    try {
      await fetch("/api/demo/start", { method: "POST" });
    } finally {
      setDemoMode(false);
      setTimeout(() => setSurge(false), 2000);
    }
  };`;

content = content.replace(oldDemo, newDemo);
fs.writeFileSync('frontend/src/app/dashboard/layout.tsx', content, 'utf8');
