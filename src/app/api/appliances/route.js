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

// GET /api/appliances — fetch user's appliances
export async function GET(req) {
  const decoded = getUserFromReq(req);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const appliances = await prisma.appliance.findMany({ where: { userId: decoded.id } });
  return NextResponse.json(appliances);
}

// POST /api/appliances — add appliance
export async function POST(req) {
  const decoded = getUserFromReq(req);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, wattage, quantity, hoursPerDay } = await req.json();
  if (!name || !wattage || !hoursPerDay) {
    return NextResponse.json({ error: 'Name, wattage, and hours/day are required.' }, { status: 400 });
  }

  const appliance = await prisma.appliance.create({
    data: { name, wattage: parseFloat(wattage), quantity: parseInt(quantity) || 1, hoursPerDay: parseFloat(hoursPerDay), userId: decoded.id },
  });
  return NextResponse.json(appliance, { status: 201 });
}

// DELETE /api/appliances?id=xxx
export async function DELETE(req) {
  const decoded = getUserFromReq(req);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Appliance ID required.' }, { status: 400 });

  await prisma.appliance.deleteMany({ where: { id, userId: decoded.id } });
  return NextResponse.json({ message: 'Appliance deleted.' });
}
