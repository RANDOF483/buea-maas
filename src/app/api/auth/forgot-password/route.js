import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/auth/forgot-password
export async function POST(req) {
  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { phoneNumber }
    });

    if (!user) {
      // Return success anyway to prevent phone number enumeration
      return NextResponse.json({ message: 'Your reset request has been flagged. Please contact the administrator.' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { resetRequested: true }
    });

    return NextResponse.json({
      message: 'Your reset request has been flagged. Please contact the administrator on WhatsApp to receive your temporary password.'
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
