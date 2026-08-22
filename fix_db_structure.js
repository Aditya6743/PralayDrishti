const fs = require('fs');

// 1. Update Missing Page
let pMiss = 'frontend/src/app/missing/page.tsx';
let cMiss = fs.readFileSync(pMiss, 'utf8');

const targetSave = `const existing = JSON.parse(localStorage.getItem('pralay_missing_db') || '[]');
    localStorage.setItem('pralay_missing_db', JSON.stringify([missingDesc, ...existing]));`;

const replaceSave = `const existing = JSON.parse(localStorage.getItem('pralay_missing_db') || '[]');
    const newEntry = { desc: missingDesc, phone: contactPhone || process.env.NEXT_PUBLIC_DEFAULT_PHONE || "" };
    localStorage.setItem('pralay_missing_db', JSON.stringify([newEntry, ...existing]));`;

cMiss = cMiss.replace(targetSave, replaceSave);
fs.writeFileSync(pMiss, cMiss);

// 2. Update AI Linker
let pDash = 'frontend/src/app/dashboard/missing/page.tsx';
let cDash = fs.readFileSync(pDash, 'utf8');

// Change missingDB from string[] to any[]
cDash = cDash.replace(`useState<string[]>([`, `useState<any[]>([`);

// Change dummy data
const targetDummy = `"70 year old grandmother wearing blue saree, lost near Sector 4 flood zone.",
    "Young boy wearing red Spiderman shirt, non-verbal autism, last seen near main highway."`;
const replaceDummy = `{ desc: "70 year old grandmother wearing blue saree, lost near Sector 4 flood zone.", phone: "+916396558074" },
    { desc: "Young boy wearing red Spiderman shirt, non-verbal autism, last seen near main highway.", phone: "+916396558074" }`;
cDash = cDash.replace(targetDummy, replaceDummy);

// Change how it displays the matched desc
cDash = cDash.replace(`"{matchResult.desc}"`, `"{matchResult.desc.desc}"`);

// Change the SMS dispatch function to use the matched phone number
const targetSMS = `body: JSON.stringify({
          message: "🚨 PralayDrishti Alert: High-confidence AI Match confirmed. Family located. Standby at Relief Camp Alpha (Sector 12) for handover."
        })`;
const replaceSMS = `body: JSON.stringify({
          to: matchResult?.desc?.phone,
          message: "🚨 PralayDrishti Alert: High-confidence AI Match confirmed. Family located. Standby at Relief Camp Alpha (Sector 12) for handover."
        })`;
cDash = cDash.replace(targetSMS, replaceSMS);

fs.writeFileSync(pDash, cDash);
console.log("DB Structure fixed for phone numbers");
