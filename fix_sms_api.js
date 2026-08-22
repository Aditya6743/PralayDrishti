const fs = require('fs');
let p = 'frontend/src/app/api/sms/route.ts';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(`const { message } = await req.json();`, `const { message, to } = await req.json();`);

const targetNum = `const toNumber = process.env.TARGET_PHONE_NUMBER;`;
const replaceNum = `const toNumber = to || process.env.TARGET_PHONE_NUMBER;`;
c = c.replace(targetNum, replaceNum);

fs.writeFileSync(p, c);
console.log("SMS API updated to support dynamic TO numbers");
