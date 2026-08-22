const postgres = require('postgres');
const sql = postgres({
  host: 'aws-0-ap-northeast-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  username: 'postgres.feegfdvcfmzmgvwmziya',
  password: 'Elicit##2026',
  ssl: 'require',
  prepare: false
});

async function run() {
  try {
    await sql`DELETE FROM reports WHERE ticket_id = 'test-ticket'`;
    console.log("Deleted test ticket");
  } catch(e) {
    console.error(e.message);
  } finally {
    process.exit(0);
  }
}
run();
