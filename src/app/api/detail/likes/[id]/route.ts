import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const supabase = createClient();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = request.headers.get('user-id');
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const { id: post_id } = params;
  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('post_id', post_id)
    .eq('user_id', userId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const liked = !!data;
  return NextResponse.json({ liked }, { status: 200 });
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await request.json();
  const { id: post_id } = params;
  const { data, error } = await supabase.from('likes').insert([{ user_id: userId, post_id: post_id }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await request.json();
  const { id: post_id } = params;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const { error } = await supabase.from('likes').delete().match({ user_id: userId, post_id: post_id });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
