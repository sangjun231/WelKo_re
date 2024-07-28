'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { API_MYPAGE_CHATS } from '@/utils/apiConstants';

type ChatListProps = {
  userId: string;
};

const ChatList = ({ userId }: ChatListProps) => {
  const router = useRouter();

  const { data, error, isLoading } = useQuery({
    queryKey: ['chatList', userId],
    queryFn: async () => {
      const response = await fetch(API_MYPAGE_CHATS(userId));

      if (!response.ok) throw new Error('Failed to fetch chat list');

      return response.json();
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading chats</div>;

  return (
    <div>
      {data?.map((chat: any, index: number) => (
        <div
          key={index}
          onClick={() =>
            router.push(
              `/${userId}/${chat.receiver_id}/chatpage?postTitle=${chat.postTitle}&postImage=${chat.postImage}`
            )
          }
        >
          <p>{chat.content}</p>
          <p>{new Date(chat.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
