const postgres = require('postgres');
const sql = postgres("postgresql://postgres.feegfdvcfmzmgvwmziya:CodeBlooded%40123@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres", { ssl: 'require' });
async function test() {
  try {
    const res = await sql`SELECT NOW()`;
    console.log("SUCCESS:", res);
  } catch (e) {
    console.error("FAIL:", e);
  }
  process.exit();
}
test();
