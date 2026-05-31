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

export async function POST(req) {
  const decoded = getUserFromReq(req);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { appliances } = await req.json();
    if (!appliances || !Array.isArray(appliances)) {
      return NextResponse.json({ error: 'Appliances array is required.' }, { status: 400 });
    }

    const rows = appliances.map(app => ({
      id: `c${Date.now()}${Math.random().toString(36).slice(2, 9)}`,
      name: app.name,
      wattage: parseFloat(app.wattage),
      quantity: parseInt(app.quantity) || 1,
      hoursPerDay: parseFloat(app.hoursPerDay),
      userId: decoded.id,
      createdAt: new Date().toISOString(),
    }));

    const { error } = await supabaseAdmin.from('Appliance').insert(rows);
    if (error) {
      console.error('Bulk insert error:', error);
      return NextResponse.json({ error: 'Failed to register appliances.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Appliances registered successfully', count: rows.length }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to register appliances' }, { status: 500 });
  }
}
