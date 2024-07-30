'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { API_MYPAGE_CHATS, API_POST_DETAILS, API_MYPAGE_PROFILE } from '@/utils/apiConstants';
import axios from 'axios';

type ChatListProps = {
  userId: string;
};

type Chat = {
  post_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
};

type Post = {
  id: string;
  title: string;
  image: string;
};

type User = {
  id: string;
  name: string;
  avatar: string;
};

const ChatList = ({ userId }: ChatListProps) => {
  const router = useRouter();

  const fetchPostDetails = async (postId: string): Promise<Post> => {
    const response = await axios.get(API_POST_DETAILS(postId));
    return response.data;
  };

  const fetchUserDetails = async (userId: string): Promise<User> => {
    const response = await axios.get(API_MYPAGE_PROFILE(userId));
    return response.data;
  };

  const {
    data: chatData,
    error: chatError,
    isPending: chatPending
  } = useQuery<Chat[]>({
    queryKey: ['chatList', userId],
    queryFn: async () => {
      const response = await axios.get(API_MYPAGE_CHATS(userId));
      return response.data;
    }
  });

  const postIds = chatData?.map((chat) => chat.post_id) || [];
  const userIds = chatData ? chatData.flatMap((chat) => [chat.sender_id, chat.receiver_id]) : [];

  const {
    data: postData,
    error: postError,
    isPending: postPending
  } = useQuery<Post[]>({
    queryKey: ['postDetails', postIds],
    queryFn: async () => {
      const postDetails = await Promise.all(postIds.map((postId) => fetchPostDetails(postId)));
      return postDetails;
    },
    enabled: postIds.length > 0
  });

  const {
    data: userData,
    error: userError,
    isPending: userPending
  } = useQuery<User[]>({
    queryKey: ['userDetails', userIds],
    queryFn: async () => {
      const userDetails = await Promise.all(userIds.map((id) => fetchUserDetails(id)));
      return userDetails;
    },
    enabled: userIds.length > 0
  });

  if (chatPending || postPending || userPending) return <div>Loading...</div>;
  if (chatError || postError || userError) return <div>Error loading data</div>;

  return (
    <div>
      {chatData?.map((chat: Chat, index: number) => {
        const postDetails = postData?.find((post) => post.id === chat.post_id);
        const receiverId = userId === chat.sender_id ? chat.receiver_id : chat.sender_id;
        const senderDetails = userData?.find((user) => user.id === receiverId);

        return (
          <div
            className="mb-4"
            key={index}
            onClick={() =>
              router.push(
                `/${userId}/${receiverId}/chatpage?postId=${chat.post_id}&postTitle=${postDetails?.title}&postImage=${postDetails?.image}`
              )
            }
          >
            {senderDetails && (
              <div className="flex items-center">
                <Image
                  className="mr-4"
                  src={senderDetails.avatar || '/icons/upload.png'}
                  alt={senderDetails.name || 'Default name'}
                  width={40}
                  height={40}
                />
                <p>{senderDetails.name}</p>
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
