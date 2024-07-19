import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = createClient();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    console.log('Received ID:', id); // 디버깅 로그

    if (!id) {
      return NextResponse.json({ error: 'ID 값이 필요합니다.' }, { status: 400 });
    }

    const supabase = createClient();
    console.log('Supabase client created'); // 디버깅 로그

    const { data, error } = await supabase.from('posts').select('*').eq('id', id);

    console.log('Supabase query executed', { data, error }); // 디버깅 로그

    if (error) {
      console.error('Supabase error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'No posts found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: '데이터를 가져오는 데 실패했습니다.' }, { status: 500 });
  }
}
