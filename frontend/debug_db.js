const fs = require('fs');
const postgres = require('postgres');

const envFile = fs.readFileSync('.env.local', 'utf8');
const dbUrlMatch = envFile.match(/DATABASE_URL="(.*?)"/);
const DATABASE_URL = dbUrlMatch[1];
const parsed = new URL(DATABASE_URL);

console.log("Host:", parsed.hostname);
console.log("Port:", parsed.port);
console.log("User:", decodeURIComponent(parsed.username));

const sql = postgres({
  host: parsed.hostname,
  port: Number(parsed.port),
  database: parsed.pathname.slice(1),
  username: decodeURIComponent(parsed.username),
  password: decodeURIComponent(parsed.password),
  ssl: 'require',
  prepare: false
});

async function test() {
    try {
        const res = await sql`SELECT 1 as connected`;
        console.log("Connection successful:", res);
    } catch (e) {
        console.error("DB Error:", e);
    } finally {
        process.exit(0);
    }
}
test();
