import { Tables } from '@/types/supabase';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { data, error } = await supabase.from('posts').select('*');
  if (error) {
    console.error('Error fetching reviews:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const data = await request.json();
  const { user_id, title, content, image, maxPeople, tag, price, selectedPrices }: Tables<'posts'> = data;
  const { error } = await supabase.from('posts').insert({
    user_id,
    title,
    content,
    image,
    maxPeople,
    tag,
    price,
    selectedPrices
  });
  if (error) {
    console.error('Error fetching posts:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
