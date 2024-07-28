import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { id: userId } = params;

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('sender_id, receiver_id, content, created_at')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const chatList: any[] = [];
    const chatSet = new Set();

    data.forEach((message) => {
      const chatId = message.sender_id === userId ? message.receiver_id : message.sender_id;

      if (!chatSet.has(chatId)) {
        chatSet.add(chatId);
        chatList.push(message);
      }
    });

    return NextResponse.json(chatList, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
