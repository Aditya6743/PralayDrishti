import postgres from 'postgres';

// Hardcoding the exact IPv4 Session Pooler URL to bypass Next.js .env caching issues
const DATABASE_URL = "postgresql://postgres.feegfdvcfmzmgvwmziya:Elicit%23%232026@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres";

const parsed = new URL(DATABASE_URL);

export const sql = postgres({
  host: parsed.hostname,
  port: Number(parsed.port),
  database: parsed.pathname.slice(1),
  username: decodeURIComponent(parsed.username),
  password: decodeURIComponent(parsed.password),
  ssl: 'require',
  prepare: false
});
