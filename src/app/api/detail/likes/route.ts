import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; // Supabase 클라이언트 설정

// 좋아요 상태를 확인하는 GET 핸들러
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const postId = url.searchParams.get('postId');
    const userId = url.searchParams.get('userId');

    if (!postId || !userId) {
      return NextResponse.json({ error: 'Post ID와 User ID가 필요합니다.' }, { status: 400 });
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const liked = !!data;  // 좋아요 상태를 반환합니다.
    return NextResponse.json({ liked });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: '데이터를 처리하는 데 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // 요청 본문에서 postId와 userId를 가져옵니다.
    const { postId, userId } = await request.json();

    if (!postId || !userId) {
      return NextResponse.json({ error: 'Post ID와 User ID가 필요합니다.' }, { status: 400 });
    }

    const supabase = createClient();

    // 좋아요가 이미 존재하는지 확인합니다.
    const { data, error: selectError } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .single();

    if (selectError) {
      return NextResponse.json({ error: selectError.message }, { status: 500 });
    }

    if (data) {
      // 이미 좋아요가 존재하면, 좋아요를 제거합니다.
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', userId)
        .eq('post_id', postId);

      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }

      return NextResponse.json({ message: 'Unliked successfully' });
    } else {
      // 좋아요가 존재하지 않으면, 새로운 좋아요를 추가합니다.
      const { error: insertError } = await supabase
        .from('likes')
        .insert([{ user_id: userId, post_id: postId }]);

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      return NextResponse.json({ message: 'Liked successfully' });
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: '데이터를 처리하는 데 실패했습니다.' }, { status: 500 });
  }
}
