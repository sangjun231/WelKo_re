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
  const {
    id,
    user_id,
    title,
    content,
    image,
    maxPeople,
    tag,
    price,
    selectedPrices,
    startDate,
    endDate
  }: Partial<Tables<'posts'>> = data;

  if (!user_id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }
  try {
    // 트랜잭션 시작
    const { data: transaction, error: transactionError } = await supabase.rpc('start_transaction');
    if (transactionError) {
      throw new Error('Transaction start failed');
    }

    // 날짜 등록
    const { error: dateError } = await supabase.from('posts').insert({ user_id, startDate, endDate });
    if (dateError) {
      throw new Error(`Date insertion failed: ${dateError.message}`);
    }

    // 기존 게시물 확인
    const { data: existingPost, error: fetchError } = await supabase.from('posts').select().eq('id', id).single();
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw new Error(`Fetching existing post failed: ${fetchError.message}`);
    }

    // 게시물 업데이트
    let result;
    if (existingPost) {
      const { error: updateError } = await supabase
        .from('posts')
        .update({ title, content, image, maxPeople, tag, price, selectedPrices })
        .eq('id', id);
      if (updateError) {
        throw new Error(`Post update failed: ${updateError.message}`);
      }
      result = { message: 'Post updated successfully', operation: 'update' };
    } else {
      const { error: insertError } = await supabase
        .from('posts')
        .insert({ user_id, title, content, image, maxPeople, tag, price, selectedPrices, startDate, endDate });
      if (insertError) {
        throw new Error(`Post insertion failed: ${insertError.message}`);
      }
      result = { message: 'Post inserted successfully', operation: 'insert' };
    }

    // 트랜잭션 커밋
    const { error: commitError } = await supabase.rpc('commit_transaction');
    if (commitError) {
      throw new Error('Transaction commit failed');
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    // 트랜잭션 롤백
    await supabase.rpc('rollback_transaction');
    console.error('Unexpected error:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
