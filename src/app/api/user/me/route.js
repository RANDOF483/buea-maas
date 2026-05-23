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

// GET /api/user/me — get current user profile + balance
export async function GET(req) {
  const decoded = getUserFromReq(req);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, name: true, email: true, phoneNumber: true, role: true, balanceFCFA: true, createdAt: true },
  });

  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  // Calculate total consumption from appliances
  const appliances = await prisma.appliance.findMany({ where: { userId: decoded.id } });
  const dailyKWh = appliances.reduce((sum, a) => sum + (a.wattage * a.quantity * a.hoursPerDay) / 1000, 0);
  const monthlyKWh = dailyKWh * 30;
  const monthlyCostFCFA = monthlyKWh * 100; // 100 FCFA/kWh

  return NextResponse.json({ ...user, dailyKWh, monthlyKWh, monthlyCostFCFA });
}
