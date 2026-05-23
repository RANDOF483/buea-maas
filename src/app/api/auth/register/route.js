import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'buea-maas-secret-key-2024';

// POST /api/auth/register
export async function POST(req) {
  try {
    const { name, email, phoneNumber, password, role } = await req.json();

    if (!name || !phoneNumber || !password) {
      return NextResponse.json({ error: 'Name, phone number, and password are required.' }, { status: 400 });
    }

    const existingPhone = await prisma.user.findUnique({ where: { phoneNumber } });
    if (existingPhone) {
      return NextResponse.json({ error: 'A user with this phone number already exists.' }, { status: 409 });
    }

    if (email) {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) {
        return NextResponse.json({ error: 'A user with this email address already exists.' }, { status: 409 });
      }
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, phoneNumber, password: hashed, role: 'USER' },
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return NextResponse.json({
      message: 'Registration successful!',
      token,
      user: { id: user.id, name: user.name, email: user.email, phoneNumber: user.phoneNumber, role: user.role, balanceFCFA: user.balanceFCFA },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
