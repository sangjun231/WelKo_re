import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  const postId = request.nextUrl.searchParams.get('postId');

  console.log('Received params:', params); // 추가 로그
  console.log('Received postId:', postId); // 추가 로그

  if (!postId) {
    console.error('Invalid post ID'); // postId 로그 추가
    return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('payments').select('*').eq('post_id', postId);
    console.log('postId:', postId); // postId 로그 추가
    console.log('Fetched data:', data); // data 로그 추가
    if (error) {
      console.error('Supabase error:', error.message); // error 로그 추가
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Caught error:', error.message); // caught error 로그 추가
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('Unknown error occurred'); // unknown error 로그 추가
      return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
    }
  }
}
