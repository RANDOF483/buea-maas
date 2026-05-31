import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'buea-maas-secret-key-2024';
const TARIFF_FCFA_PER_KWH = 100;

function getUserFromReq(req) {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  const token = auth.replace('Bearer ', '');
  try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
}

export async function GET(req) {
  const decoded = getUserFromReq(req);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: payments, error } = await supabaseAdmin
    .from('Payment').select('*').eq('userId', decoded.id)
    .order('createdAt', { ascending: false }).limit(20);

  if (error) return NextResponse.json({ error: 'Failed to fetch payments.' }, { status: 500 });
  return NextResponse.json(payments || []);
}

export async function POST(req) {
  const decoded = getUserFromReq(req);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { amountFCFA, method, transactionRef } = await req.json();
  if (!amountFCFA || !method) {
    return NextResponse.json({ error: 'Amount and payment method are required.' }, { status: 400 });
  }
  if (!['MTN', 'ORANGE'].includes(method)) {
    return NextResponse.json({ error: 'Method must be MTN or ORANGE.' }, { status: 400 });
  }

  const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const amount = parseFloat(amountFCFA);

  const { data: payment, error: paymentError } = await supabaseAdmin.from('Payment').insert({
    id: `c${Date.now()}${Math.random().toString(36).slice(2, 9)}`,
    amountFCFA: amount, method, transactionId, transactionRef: transactionRef || null, userId: decoded.id,
    status: 'COMPLETED', createdAt: new Date().toISOString(),
  }).select().single();

  if (paymentError) return NextResponse.json({ error: 'Payment failed.' }, { status: 500 });

  // Update user balance
  const { data: user } = await supabaseAdmin.from('User').select('balanceFCFA').eq('id', decoded.id).single();
  await supabaseAdmin.from('User').update({
    balanceFCFA: (user?.balanceFCFA || 0) + amount,
    updatedAt: new Date().toISOString()
  }).eq('id', decoded.id);

  return NextResponse.json({ message: 'Payment successful!', payment, tariff: TARIFF_FCFA_PER_KWH }, { status: 201 });
}
