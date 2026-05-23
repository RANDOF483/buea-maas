import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

async function seedAdmin() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('Seeding master admin account...');

  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      console.log('An admin account already exists with phone:', existingAdmin.phoneNumber);
      return;
    }

    const hashedPassword = await bcrypt.hash('admin1234', 10);

    const admin = await prisma.user.create({
      data: {
        name: 'Master Admin',
        phoneNumber: '+237999999999',
        email: 'admin@bueamaas.com',
        password: hashedPassword,
        role: 'ADMIN',
        balanceFCFA: 0,
      },
    });

    console.log('✅ Admin account successfully created!');
    console.log('--------------------------------------------------');
    console.log('Login Details:');
    console.log(`Phone Number: ${admin.phoneNumber}`);
    console.log('Password:     admin1234');
    console.log('--------------------------------------------------');
    console.log('You can now log in at http://localhost:3000/login');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
