import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// POST /api/auth/forgot-password
export async function POST(req) {
  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 });
    }

    const { data: user } = await supabaseAdmin
      .from('User').select('id').eq('phoneNumber', phoneNumber).single();

    if (!user) {
      // Return success anyway to prevent phone number enumeration
      return NextResponse.json({ message: 'Your reset request has been flagged. Please contact the administrator.' });
    }

    await supabaseAdmin
      .from('User').update({ resetRequested: true }).eq('id', user.id);

    return NextResponse.json({
      message: 'Your reset request has been flagged. Please contact the administrator on WhatsApp to receive your temporary password.'
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
