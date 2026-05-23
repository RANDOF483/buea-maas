import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
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

  const [totalUsers, totalPayments, totalFaults, pendingFaults, allFaults] = await prisma.$transaction([
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.payment.aggregate({ _sum: { amountFCFA: true } }),
    prisma.fault.count(),
    prisma.fault.count({ where: { status: 'PENDING' } }),
    prisma.fault.findMany({ include: { user: { select: { name: true, phoneNumber: true } } }, orderBy: { createdAt: 'desc' }, take: 10 }),
  ]);

  const users = await prisma.user.findMany({
    where: { role: 'USER' },
    select: { id: true, name: true, phoneNumber: true, balanceFCFA: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return NextResponse.json({
    totalUsers,
    totalRevenueFCFA: totalPayments._sum.amountFCFA || 0,
    totalFaults,
    pendingFaults,
    recentFaults: allFaults,
    recentUsers: users,
  });
}

// PATCH /api/admin — resolve a fault
export async function PATCH(req) {
  const decoded = getUserFromReq(req);
  if (!decoded || decoded.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  const { faultId } = await req.json();
  const fault = await prisma.fault.update({
    where: { id: faultId },
    data: { status: 'RESOLVED' },
  });
  return NextResponse.json(fault);
}
