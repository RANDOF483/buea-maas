import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

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

  const { data: faults, error } = await supabaseAdmin
    .from('Fault').select('*').eq('userId', decoded.id)
    .order('createdAt', { ascending: false });

  if (error) return NextResponse.json({ error: 'Failed to fetch faults.' }, { status: 500 });
  return NextResponse.json(faults || []);
}

export async function POST(req) {
  const decoded = getUserFromReq(req);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { description, imageBase64 } = await req.json();
  if (!description) return NextResponse.json({ error: 'Description is required.' }, { status: 400 });

  let imageUrl = null;
  if (imageBase64) {
    try {
      const matches = imageBase64.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(path.join(uploadDir, fileName), buffer);
        imageUrl = `/uploads/${fileName}`;
      }
    } catch (e) { console.error('Image upload failed:', e); }
  }

  const { data: fault, error } = await supabaseAdmin.from('Fault').insert({
    id: `c${Date.now()}${Math.random().toString(36).slice(2, 9)}`,
    description, imageUrl, userId: decoded.id,
    status: 'PENDING', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  }).select().single();

  if (error) return NextResponse.json({ error: 'Failed to submit fault.' }, { status: 500 });
  return NextResponse.json(fault, { status: 201 });
}
