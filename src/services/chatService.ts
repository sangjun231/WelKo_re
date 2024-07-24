import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const fetchMessages = async (senderId: string, receiverId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(
      `and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`
    )
    .order('created_at', { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
};

export const sendMessage = async (senderId: string, receiverId: string, content: string) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ sender_id: senderId, receiver_id: receiverId, content }]);

  if (error) {
    console.error(error);
    return null;
  }

  return data;
};
