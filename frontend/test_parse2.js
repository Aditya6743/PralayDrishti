const u = new URL("postgresql://postgres.feegfdvcfmzmgvwmziya:Elicit%23%232026@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres");
console.log(u.password, decodeURIComponent(u.password));
