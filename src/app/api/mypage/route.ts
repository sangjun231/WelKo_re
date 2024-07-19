import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { data, error } = await supabase.from('reviews').select('*');

  if (error) {
    console.error('Error fetching reviews:', error.message); // 에러 로그 추가
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
