const postgres = require('postgres');
const sql = postgres("postgresql://postgres.feegfdvcfmzmgvwmziya:CodeBlooded%40123@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres", { ssl: 'require' });

async function check() {
  const reports = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'reports';`;
  const incidents = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'incidents';`;
  console.log("REPORTS TABLE:");
  console.log(reports.map(r => r.column_name).join(", "));
  console.log("INCIDENTS TABLE:");
  console.log(incidents.map(r => r.column_name).join(", "));
  process.exit(0);
}
check();
