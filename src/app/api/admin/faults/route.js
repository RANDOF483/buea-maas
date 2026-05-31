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

  const { data: faults, error } = await supabaseAdmin
    .from('Fault').select('*, user:userId(name, phoneNumber)')
    .order('createdAt', { ascending: false });

  if (error) return NextResponse.json({ error: 'Failed to fetch faults.' }, { status: 500 });
  return NextResponse.json(faults || []);
}

export async function PATCH(req) {
  if (!getAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { faultId, status } = await req.json();
  if (!faultId || !status) return NextResponse.json({ error: 'faultId and status required.' }, { status: 400 });
  if (!['PENDING', 'IN_PROGRESS', 'RESOLVED'].includes(status)) return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });

  const { data: fault, error } = await supabaseAdmin
    .from('Fault').update({ status, updatedAt: new Date().toISOString() })
    .eq('id', faultId).select().single();

  if (error) return NextResponse.json({ error: 'Failed to update fault.' }, { status: 500 });
  return NextResponse.json(fault);
}
