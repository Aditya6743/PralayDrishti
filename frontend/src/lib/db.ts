import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL!;

// Parse the URL manually to ensure special characters like # in passwords don't break connection strings
const parsed = new URL(DATABASE_URL);

export const sql = postgres({
  host: parsed.hostname,
  port: Number(parsed.port),
  database: parsed.pathname.slice(1),
  username: decodeURIComponent(parsed.username),
  password: decodeURIComponent(parsed.password),
  ssl: 'require',
  prepare: false // Required for Supabase Transaction Poolers (port 6543)
});
