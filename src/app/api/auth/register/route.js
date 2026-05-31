import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'buea-maas-secret-key-2024';

export async function POST(req) {
  try {
    const { name, email, phoneNumber, password, neighborhood } = await req.json();

    if (!name || !phoneNumber || !password || !neighborhood) {
      return NextResponse.json({ error: 'Name, phone number, neighborhood, and password are required.' }, { status: 400 });
    }

    // Check existing phone
    const { data: existingPhone } = await supabaseAdmin
      .from('User').select('id').eq('phoneNumber', phoneNumber).single();
    if (existingPhone) {
      return NextResponse.json({ error: 'A user with this phone number already exists.' }, { status: 409 });
    }

    // Check existing email
    if (email) {
      const { data: existingEmail } = await supabaseAdmin
        .from('User').select('id').eq('email', email).single();
      if (existingEmail) {
        return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 });
      }
    }

    const hashed = await bcrypt.hash(password, 10);
    const id = `c${Date.now()}${Math.random().toString(36).slice(2, 9)}`;

    const { data: user, error } = await supabaseAdmin.from('User').insert({
      id, name, email: email || null, phoneNumber, password: hashed,
      role: 'USER', neighborhood, balanceFCFA: 0, resetRequested: false,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }).select().single();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({ error: 'Failed to create account.' }, { status: 500 });
    }

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
