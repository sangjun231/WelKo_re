import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { id } = params;

  const { data, error } = await supabase.from('payments').select('*').eq('id', id).single();

  if (error) {
    console.error('Error fetching payment data:', error);
    return NextResponse.json({ error: 'Error fetching payment data' }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
