import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const fetchMessages = async (senderId: string, receiverId: string, postId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select(
      `
      *,
      sender:users!messages_sender_id_fkey ( id, name, avatar ),
      receiver:users!messages_receiver_id_fkey ( id, name, avatar )
    `
    )
    .eq('post_id', postId)
    .or(
      `and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`
    )
    .order('created_at', { ascending: true });

  if (error) {
    return [];
  }

  const uncheckedMessages = data.filter((message) => message.receiver_id === receiverId && !message.is_checked);
  if (uncheckedMessages.length > 0) {
    const uncheckedMessageIds = uncheckedMessages.map((message) => message.id);
    await supabase.from('messages').update({ is_checked: true }).in('id', uncheckedMessageIds);
  }

  return data;
};

export const sendMessage = async (senderId: string, receiverId: string, content: string, postId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ sender_id: senderId, receiver_id: receiverId, content, post_id: postId, is_checked: false }]);

  if (error) {
    return null;
  }

  return data;
};
