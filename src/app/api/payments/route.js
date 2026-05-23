import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'buea-maas-secret-key-2024';
const TARIFF_FCFA_PER_KWH = 100; // XAF tariff

function getUserFromReq(req) {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  const token = auth.replace('Bearer ', '');
  try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
}

// GET /api/payments — fetch payment history
export async function GET(req) {
  const decoded = getUserFromReq(req);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payments = await prisma.payment.findMany({
    where: { userId: decoded.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  return NextResponse.json(payments);
}

// POST /api/payments — simulate Mobile Money top-up
export async function POST(req) {
  const decoded = getUserFromReq(req);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { amountFCFA, method } = await req.json();
  if (!amountFCFA || !method) {
    return NextResponse.json({ error: 'Amount and payment method are required.' }, { status: 400 });
  }
  if (!['MTN', 'ORANGE'].includes(method)) {
    return NextResponse.json({ error: 'Method must be MTN or ORANGE.' }, { status: 400 });
  }

  const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  const [payment] = await prisma.$transaction([
    prisma.payment.create({
      data: { amountFCFA: parseFloat(amountFCFA), method, transactionId, userId: decoded.id },
    }),
    prisma.user.update({
      where: { id: decoded.id },
      data: { balanceFCFA: { increment: parseFloat(amountFCFA) } },
    }),
  ]);

  return NextResponse.json({ message: 'Payment successful!', payment, tariff: TARIFF_FCFA_PER_KWH }, { status: 201 });
}
