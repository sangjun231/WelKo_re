import { Tables } from '@/types/supabase';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { data, error } = await supabase.from('posts').select('*');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const data = await request.json();
  const { user_id, startDate, endDate }: Partial<Tables<'posts'>> = data;

  if (!user_id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // 날짜 삽입
    const { error: insertError } = await supabase.from('posts').insert({
      user_id,
      startDate,
      endDate
    });

    if (insertError) {
      console.error('Error inserting dates:', insertError.message);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // 삽입된 데이터의 ID 가져오기
    const { data: insertedData, error: selectError } = await supabase
      .from('posts')
      .select('id')
      .eq('user_id', user_id)
      .eq('startDate', startDate)
      .eq('endDate', endDate)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (selectError) {
      console.error('Error fetching inserted ID:', selectError.message);
      return NextResponse.json({ error: selectError.message }, { status: 500 });
    }

    return NextResponse.json(insertedData, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const supabase = createClient();
  const data = await request.json();
  const { id, title, content, image, maxPeople, tag, price, selectedPrices }: Partial<Tables<'posts'>> = data;

  if (!id) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  try {
    const { error: updateError } = await supabase
      .from('posts')
      .update({
        title,
        content,
        image,
        maxPeople,
        tag,
        price,
        selectedPrices
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating post:', updateError.message);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Post updated successfully', operation: 'update' }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}
