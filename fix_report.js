const fs = require('fs');
let p = 'frontend/src/app/report/page.tsx';
let c = fs.readFileSync(p, 'utf8');

const target = `      if (data.success) {
        setTicket(data);
        setStep(4);
      }`;

const replace = `      if (data.success) {
        setTicket(data);
        setStep(4);
      } else {
        alert("Submission failed: " + (data.error || "Unknown error"));
      }`;

c = c.replace(target, replace);
fs.writeFileSync(p, c);
console.log("Added alert to report page");
