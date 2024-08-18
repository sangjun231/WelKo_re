import { Tables } from '@/types/supabase';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id: userId } = params;
  const supabase = createClient();

  if (!userId) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*, users (id), posts (id, title , image, price, startDate, endDate)')
      .eq('user_id', userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
    }
  }
}

export async function PUT(request: NextRequest) {
  const supabase = createClient();
  const data = await request.json();
  const { name, id, title, content, image, maxPeople, tags, price, selectedPrices }: Partial<Tables<'posts'>> = data;

  if (!id) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  try {
    const { error: updateError } = await supabase
      .from('posts')
      .update({
        name,
        title,
        content,
        image,
        maxPeople,
        tags,
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

export async function DELETE(request: NextRequest) {
  const supabase = createClient();
  const data = await request.json();
  const { post_id } = data;

  try {
    const { error: postError } = await supabase.from('posts').delete().eq('id', post_id);

    if (postError) {
      throw postError;
    }
    return NextResponse.json({ message: 'deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting data', error });
  }
}
