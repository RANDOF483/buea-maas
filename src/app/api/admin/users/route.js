import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'buea-maas-secret-key-2024';
function getAdmin(req) {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  try { const d = jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET); return d.role === 'ADMIN' ? d : null; } catch { return null; }
}

// GET all users
export async function GET(req) {
  if (!getAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const users = await prisma.user.findMany({
    where: { role: 'USER' },
    select: { id: true, name: true, email: true, phoneNumber: true, balanceFCFA: true, createdAt: true, _count: { select: { appliances: true, payments: true, faults: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(users);
}

// PATCH — update user balance
export async function PATCH(req) {
  if (!getAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { userId, balanceFCFA } = await req.json();
  if (!userId || balanceFCFA === undefined) return NextResponse.json({ error: 'userId and balanceFCFA required.' }, { status: 400 });
  const user = await prisma.user.update({ where: { id: userId }, data: { balanceFCFA: parseFloat(balanceFCFA) }, select: { id: true, name: true, balanceFCFA: true } });
  return NextResponse.json(user);
}
