import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'buea-maas-secret-key-2024';
function getAdmin(req) {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  try { const d = jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET); return d.role === 'ADMIN' ? d : null; } catch { return null; }
}

export async function GET(req) {
  if (!getAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { data: users, error } = await supabaseAdmin
    .from('User').select('id, name, email, phoneNumber, balanceFCFA, createdAt')
    .eq('role', 'USER').order('createdAt', { ascending: false });

  if (error) return NextResponse.json({ error: 'Failed to fetch users.' }, { status: 500 });
  return NextResponse.json(users || []);
}

export async function PATCH(req) {
  if (!getAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { userId, balanceFCFA } = await req.json();
  if (!userId || balanceFCFA === undefined) return NextResponse.json({ error: 'userId and balanceFCFA required.' }, { status: 400 });

  const { data: user, error } = await supabaseAdmin
    .from('User').update({ balanceFCFA: parseFloat(balanceFCFA), updatedAt: new Date().toISOString() })
    .eq('id', userId).select('id, name, balanceFCFA').single();

  if (error) return NextResponse.json({ error: 'Failed to update balance.' }, { status: 500 });
  return NextResponse.json(user);
}
