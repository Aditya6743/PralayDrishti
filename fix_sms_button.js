const fs = require('fs');
let p = 'frontend/src/app/dashboard/missing/page.tsx';
let c = fs.readFileSync(p, 'utf8');

const targetFunction = `  const reportFound = (e: React.FormEvent) => {`;
const replaceFunction = `  const [isSendingSMS, setIsSendingSMS] = useState(false);

  const dispatchRealSMS = async () => {
    setIsSendingSMS(true);
    try {
      await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: "🚨 PralayDrishti Alert: High-confidence AI Match confirmed. Family located. Standby at Relief Camp Alpha (Sector 12) for handover."
        })
      });
      setFinderNotified(true);
    } catch (e) {
      alert("SMS failed to send");
    }
    setIsSendingSMS(false);
  };

  const reportFound = (e: React.FormEvent) => {`;

c = c.replace(targetFunction, replaceFunction);

const targetBtn = `<button 
                    onClick={() => setFinderNotified(true)}
                    disabled={finderNotified}`;

const replaceBtn = `<button 
                    onClick={dispatchRealSMS}
                    disabled={finderNotified || isSendingSMS}`;

c = c.replace(targetBtn, replaceBtn);
fs.writeFileSync(p, c);
console.log("Hooked up real SMS");
