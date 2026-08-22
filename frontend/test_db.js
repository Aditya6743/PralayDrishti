const postgres = require('postgres');
const url = "postgresql://postgres.feegfdvcfmzmgvwmziya:Elicit%23%232026@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres";
const sql = postgres(url, { ssl: 'require' });

async function run() {
  try {
    const res = await sql`SELECT 1`;
    console.log("Success:", res);
  } catch (e) {
    console.error("Error:", e);
  } finally {
    process.exit(0);
  }
}
run();
