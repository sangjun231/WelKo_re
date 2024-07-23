// app/api/detail/likes/[postId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const supabase = createClient();

export async function GET(request: NextRequest, { params }: { params: { postId: string } }) {
  const userId = request.headers.get('user-id');
  if (!userId) {
    return NextResponse.json({ error: 'User ID missing' }, { status: 400 });
  }

  try {
    const { postId } = params;
    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    const liked = !!data;
    return NextResponse.json({ liked }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Failed to fetch like status' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { postId: string } }) {
  const { userId } = await request.json();

  try {
    const { postId } = params;
    const { data, error } = await supabase
      .from('likes')
      .insert([{ user_id: userId, post_id: postId }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Failed to add like' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { postId: string } }) {
  const { userId } = await request.json();

  try {
    const { postId } = params;
    const { error } = await supabase
      .from('likes')
      .delete()
      .match({ user_id: userId, post_id: postId });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Failed to remove like' }, { status: 500 });
  }
}
