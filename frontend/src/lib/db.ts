import postgres from 'postgres';

const DATABASE_URL = "postgresql://postgres.feegfdvcfmzmgvwmziya:CodeBlooded%40123@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres";
export const sql = postgres(DATABASE_URL, { ssl: 'require' });
