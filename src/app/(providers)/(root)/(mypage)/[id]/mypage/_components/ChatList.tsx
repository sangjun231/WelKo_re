'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { API_MYPAGE_CHATS, API_POST_DETAILS } from '@/utils/apiConstants';

type ChatListProps = {
  userId: string;
};

type Chat = {
  post_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
};

type Post = {
  id: string;
  title: string;
  image: string;
};

const ChatList = ({ userId }: ChatListProps) => {
  const router = useRouter();

  const fetchPostDetails = async (postId: string): Promise<Post> => {
    const response = await fetch(API_POST_DETAILS(postId));
    if (!response.ok) throw new Error('Failed to fetch post details');
    return response.json();
  };

  const {
    data: chatData,
    error: chatError,
    isLoading: chatLoading
  } = useQuery<Chat[]>({
    queryKey: ['chatList', userId],
    queryFn: async () => {
      const response = await fetch(API_MYPAGE_CHATS(userId));
      if (!response.ok) throw new Error('Failed to fetch chat list');
      return response.json();
    }
  });

  const postIds = chatData?.map((chat) => chat.post_id) || [];

  const {
    data: postData,
    error: postError,
    isLoading: postLoading
  } = useQuery<Post[]>({
    queryKey: ['postDetails', postIds],
    queryFn: async () => {
      const postDetails = await Promise.all(postIds.map((postId) => fetchPostDetails(postId)));
      return postDetails;
    },
    enabled: postIds.length > 0
  });

  if (chatLoading || postLoading) return <div>Loading...</div>;
  if (chatError || postError) return <div>Error loading data</div>;

  return (
    <div>
      {chatData?.map((chat: Chat, index: number) => {
        const postDetails = postData?.find((post) => post.id === chat.post_id);

        return (
          <div
            key={index}
            onClick={() =>
              router.push(
                `/${userId}/${chat.receiver_id}/chatpage?postId=${chat.post_id}&postTitle=${postDetails?.title}&postImage=${postDetails?.image}`
              )
            }
          >
            {postDetails && (
              <div className="flex">
                <Image
                  className="mr-4"
                  src={postDetails.image ?? '/icons/upload.png'}
                  alt={postDetails.title ?? 'Default title'}
                  width={40}
                  height={40}
                />
                <p>{postDetails.title}</p>
              </div>
            )}
            <p>{chat.content}</p>
            <p>{new Date(chat.created_at).toLocaleString()}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
