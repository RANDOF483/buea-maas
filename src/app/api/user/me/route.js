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
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: user, error } = await supabaseAdmin
    .from('User')
    .select('id, name, email, phoneNumber, neighborhood, role, balanceFCFA, createdAt')
    .eq('id', decoded.id)
    .single();

  if (error || !user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  const { data: appliances } = await supabaseAdmin
    .from('Appliance').select('wattage, quantity, hoursPerDay').eq('userId', decoded.id);

  const dailyKWh = (appliances || []).reduce((sum, a) => sum + (a.wattage * a.quantity * a.hoursPerDay) / 1000, 0);
  const monthlyKWh = dailyKWh * 30;
  const monthlyCostFCFA = monthlyKWh * 100;

  return NextResponse.json({ ...user, dailyKWh, monthlyKWh, monthlyCostFCFA });
}
