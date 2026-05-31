const { Pool } = require('pg');

async function test(url) {
  const pool = new Pool({ connectionString: url, connectionTimeoutMillis: 5000 });
  console.log('Testing:', url.split('@')[1]);
  try {
    const start = Date.now();
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('Success in', Date.now() - start, 'ms');
  } catch(e) {
    console.error('Failed:', e.message);
  } finally {
    await pool.end();
  }
}

async function main() {
  await test('postgresql://postgres.qbmapknmkxrrwfoshtcv:BueaMaas12345@aws-0-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true');
  await test('postgresql://postgres.qbmapknmkxrrwfoshtcv:BueaMaas12345@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true');
  await test('postgresql://postgres.qbmapknmkxrrwfoshtcv:BueaMaas12345@aws-0-eu-west-2.pooler.supabase.com:5432/postgres');
  await test('postgresql://postgres.qbmapknmkxrrwfoshtcv:BueaMaas12345@aws-1-eu-west-2.pooler.supabase.com:5432/postgres');
  await test('postgresql://postgres:BueaMaas12345@db.qbmapknmkxrrwfoshtcv.supabase.co:5432/postgres');
}
main();
