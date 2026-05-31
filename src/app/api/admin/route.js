import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'buea-maas-secret-key-2024';

function getUserFromReq(req) {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  const token = auth.replace('Bearer ', '');
  try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
}

export async function GET(req) {
  const decoded = getUserFromReq(req);
  if (!decoded || decoded.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  const [
    { count: totalUsers },
    { data: payments },
    { count: totalFaults },
    { count: pendingFaults },
    { data: recentFaults },
    { data: recentUsers },
  ] = await Promise.all([
    supabaseAdmin.from('User').select('*', { count: 'exact', head: true }).eq('role', 'USER'),
    supabaseAdmin.from('Payment').select('amountFCFA'),
    supabaseAdmin.from('Fault').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('Fault').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
    supabaseAdmin.from('Fault').select('*, user:userId(name, phoneNumber)').order('createdAt', { ascending: false }).limit(10),
    supabaseAdmin.from('User').select('id, name, phoneNumber, balanceFCFA, createdAt').eq('role', 'USER').order('createdAt', { ascending: false }).limit(10),
  ]);

  const totalRevenueFCFA = (payments || []).reduce((sum, p) => sum + (p.amountFCFA || 0), 0);

  return NextResponse.json({
    totalUsers: totalUsers || 0,
    totalRevenueFCFA,
    totalFaults: totalFaults || 0,
    pendingFaults: pendingFaults || 0,
    recentFaults: recentFaults || [],
    recentUsers: recentUsers || [],
  });
}

export async function PATCH(req) {
  const decoded = getUserFromReq(req);
  if (!decoded || decoded.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  const { faultId } = await req.json();
  const { data: fault, error } = await supabaseAdmin
    .from('Fault').update({ status: 'RESOLVED', updatedAt: new Date().toISOString() })
    .eq('id', faultId).select().single();

  if (error) return NextResponse.json({ error: 'Failed to resolve fault.' }, { status: 500 });
  return NextResponse.json(fault);
}
