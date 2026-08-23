const fs = require('fs');
let p = 'frontend/.env.local';
let c = fs.readFileSync(p, 'utf8');

const oldUrl = 'postgresql://postgres.feegfdvcfmzmgvwmziya:Elicit%23%232026@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres';
const newUrl = 'postgresql://postgres:Elicit%23%232026@db.feegfdvcfmzmgvwmziya.supabase.co:5432/postgres';

c = c.replace(oldUrl, newUrl);
fs.writeFileSync(p, c);
console.log("Updated to Supabase direct connection string");
