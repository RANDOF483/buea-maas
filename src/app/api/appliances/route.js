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

  const { data: appliances, error } = await supabaseAdmin
    .from('Appliance').select('*').eq('userId', decoded.id).order('createdAt', { ascending: false });

  if (error) return NextResponse.json({ error: 'Failed to fetch appliances.' }, { status: 500 });
  return NextResponse.json(appliances || []);
}

export async function POST(req) {
  const decoded = getUserFromReq(req);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, wattage, quantity, hoursPerDay } = await req.json();
  if (!name || !wattage || !hoursPerDay) {
    return NextResponse.json({ error: 'Name, wattage, and hours/day are required.' }, { status: 400 });
  }

  const id = `c${Date.now()}${Math.random().toString(36).slice(2, 9)}`;
  const { data: appliance, error } = await supabaseAdmin.from('Appliance').insert({
    id, name, wattage: parseFloat(wattage), quantity: parseInt(quantity) || 1,
    hoursPerDay: parseFloat(hoursPerDay), userId: decoded.id, createdAt: new Date().toISOString(),
  }).select().single();

  if (error) return NextResponse.json({ error: 'Failed to add appliance.' }, { status: 500 });
  return NextResponse.json(appliance, { status: 201 });
}

export async function DELETE(req) {
  const decoded = getUserFromReq(req);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Appliance ID required.' }, { status: 400 });

  await supabaseAdmin.from('Appliance').delete().eq('id', id).eq('userId', decoded.id);
  return NextResponse.json({ message: 'Appliance deleted.' });
}
