import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'buea-maas-secret-key-2024';

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let decoded;
    try { decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET); }
    catch { return NextResponse.json({ error: 'Invalid token' }, { status: 401 }); }

    if (decoded.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });

    const tempPassword = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const { data: user, error } = await supabaseAdmin
      .from('User').update({ password: hashedPassword, resetRequested: false, updatedAt: new Date().toISOString() })
      .eq('id', userId).select('phoneNumber').single();

    if (error) return NextResponse.json({ error: 'Failed to reset password.' }, { status: 500 });

    return NextResponse.json({ message: 'Password reset successfully', tempPassword, userPhone: user.phoneNumber });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
