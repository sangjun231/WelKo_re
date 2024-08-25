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

  // const uncheckedMessages = data.filter((message) => message.receiver_id === receiverId && !message.is_checked);
  // if (uncheckedMessages.length > 0) {
  //   const uncheckedMessageIds = uncheckedMessages.map((message) => message.id);
  //   await supabase.from('messages').update({ is_checked: true }).in('id', uncheckedMessageIds);
  // }

  // Realtime 구독 설정
  supabase
    .channel('public:messages')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
      if (
        payload.new.post_id === postId &&
        (payload.new.sender_id === senderId || payload.new.receiver_id === receiverId)
      ) {
        // 새로운 메시지를 처리하는 로직을 추가
        data.push(payload.new); // 실시간으로 수신된 메시지를 기존 데이터에 추가
      }
    })
    .subscribe();

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
