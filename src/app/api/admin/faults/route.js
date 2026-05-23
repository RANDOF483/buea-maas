import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'buea-maas-secret-key-2024';
function getAdmin(req) {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  try { const d = jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET); return d.role === 'ADMIN' ? d : null; } catch { return null; }
}

// GET all faults (admin view)
export async function GET(req) {
  if (!getAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const faults = await prisma.fault.findMany({
    include: { user: { select: { name: true, phoneNumber: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(faults);
}

// PATCH — update fault status
export async function PATCH(req) {
  if (!getAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { faultId, status } = await req.json();
  if (!faultId || !status) return NextResponse.json({ error: 'faultId and status required.' }, { status: 400 });
  if (!['PENDING', 'IN_PROGRESS', 'RESOLVED'].includes(status)) return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
  const fault = await prisma.fault.update({ where: { id: faultId }, data: { status } });
  return NextResponse.json(fault);
}
