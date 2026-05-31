const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const user = await prisma.user.findFirst();
    console.log('Successfully connected');
  } catch(e) {
    console.error('Connection failed:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
