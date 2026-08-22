const postgres = require('postgres');
const sql = postgres("postgresql://postgres.feegfdvcfmzmgvwmziya:CodeBlooded%40123@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres", { ssl: 'require' });

async function check() {
  const columns = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'reports' OR table_name = 'incidents';
  `;
  console.log("SCHEMA:", columns);
  process.exit(0);
}
check();
