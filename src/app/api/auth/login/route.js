import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'buea-maas-secret-key-2024';

export async function POST(req) {
  try {
    const { phoneNumber, password } = await req.json();

    if (!phoneNumber || !password) {
      return NextResponse.json({ error: 'Phone number and password are required.' }, { status: 400 });
    }

    const { data: user, error } = await supabaseAdmin
      .from('User').select('*').eq('phoneNumber', phoneNumber).single();

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return NextResponse.json({
      message: 'Login successful!',
      token,
      user: { id: user.id, name: user.name, email: user.email, phoneNumber: user.phoneNumber, role: user.role, balanceFCFA: user.balanceFCFA },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
