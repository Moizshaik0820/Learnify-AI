import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, username } = body;

    if (!userId || !username || typeof username !== 'string') {
      return NextResponse.json(
        { success: false, error: 'User ID and username are required.' },
        { status: 400 }
      );
    }

    const trimmed = username.trim();
    if (trimmed.length < 2 || trimmed.length > 30) {
      return NextResponse.json(
        { success: false, error: 'Username must be between 2 and 30 characters.' },
        { status: 400 }
      );
    }

    // Disallow email format as username
    if (trimmed.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Usernames cannot contain email addresses.' },
        { status: 400 }
      );
    }

    // Update ONLY username field
    const { data, error } = await supabase
      .from('profiles')
      .update({
        username: trimmed,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select('id, username')
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      username: trimmed,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update username' },
      { status: 500 }
    );
  }
}
