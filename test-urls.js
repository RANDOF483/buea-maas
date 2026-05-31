const { PrismaClient } = require('@prisma/client');

async function test(url) {
  const prisma = new PrismaClient({ datasources: { db: { url } } });
  console.log('Testing:', url.split('@')[1]);
  try {
    const start = Date.now();
    await prisma.user.findFirst();
    console.log('Success in', Date.now() - start, 'ms');
  } catch(e) {
    console.error('Failed:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  await test('postgresql://postgres.qbmapknmkxrrwfoshtcv:BueaMaas12345@aws-0-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true');
  await test('postgresql://postgres.qbmapknmkxrrwfoshtcv:BueaMaas12345@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true');
  await test('postgresql://postgres.qbmapknmkxrrwfoshtcv:BueaMaas12345@aws-0-eu-west-2.pooler.supabase.com:5432/postgres');
  await test('postgresql://postgres.qbmapknmkxrrwfoshtcv:BueaMaas12345@aws-1-eu-west-2.pooler.supabase.com:5432/postgres');
}
main();
