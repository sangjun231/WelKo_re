import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_MYPAGE_CHATS, API_POST_DETAILS, API_MYPAGE_PROFILE } from '@/utils/apiConstants';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetchMessages } from '@/services/chatService';

type ChatListProps = {
  userId: string;
};

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  post_id: string;
  is_checked: boolean;
};

type Chat = {
  post_id: string;
  sender_id: string;
  receiver_id: string;
  messages: Message[];
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
  const queryClient = useQueryClient();
  const [newMessages, setNewMessages] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const fetchPostDetails = async (postId: string): Promise<Post> => {
    const response = await axios.get(API_POST_DETAILS(postId));
    return response.data;
  };

  const fetchUserDetails = async (userId: string): Promise<User> => {
    const response = await axios.get(API_MYPAGE_PROFILE(userId));
    return response.data;
  };

  const {
    data: chatData = [],
    error: chatError,
    isPending: chatPending
  } = useQuery<Message[]>({
    queryKey: ['chatList', userId],
    queryFn: async () => {
      const response = await axios.get(API_MYPAGE_CHATS(userId));
      return response.data;
    },
    refetchInterval: false
  });

  const postIds = chatData?.map((chat) => chat.post_id) || [];
  const userIds = chatData ? chatData.flatMap((chat) => [chat.sender_id, chat.receiver_id]) : [];

  const {
    data: postData = [],
    error: postError,
    isPending: postPending
  } = useQuery<Post[]>({
    queryKey: ['postDetails', postIds],
    queryFn: async () => {
      const postDetails = await Promise.all(postIds.map((postId) => fetchPostDetails(postId)));
      return postDetails;
    }
  });

  const {
    data: userData = [],
    error: userError,
    isPending: userPending
  } = useQuery<User[]>({
    queryKey: ['userDetails', userIds],
    queryFn: async () => {
      const userDetails = await Promise.all(userIds.map((id) => fetchUserDetails(id)));
      return userDetails;
    }
  });

  const groupedChats = chatData?.reduce((acc: { [key: string]: Chat }, message) => {
    const chatId = `${message.post_id}-${[message.sender_id, message.receiver_id].sort().join('-')}`;
    if (!acc[chatId]) {
      acc[chatId] = {
        post_id: message.post_id,
        sender_id: message.sender_id,
        receiver_id: message.receiver_id,
        messages: []
      };
    }
    acc[chatId].messages.push(message);
    return acc;
  }, {});

  const handleChatClick = async (chat: Chat) => {
    const receiverId = userId === chat.sender_id ? chat.receiver_id : chat.sender_id;
    const postDetails = postData?.find((post) => post.id === chat.post_id);
    const chatId = `${chat.post_id}-${[chat.sender_id, chat.receiver_id].sort().join('-')}`;

    setNewMessages((prev) => ({
      ...prev,
      [chatId]: true
    }));

    await fetchMessages(chat.receiver_id, chat.sender_id, chat.post_id);

    router.push(
      `/${userId}/${receiverId}/chatpage?postId=${chat.post_id}&postTitle=${postDetails?.title}&postImage=${postDetails?.image}`
    );
  };

  const formatDate = (created_at: string) => {
    const messageDate = new Date(created_at);
    const today = new Date();

    const isToday =
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear();

    if (isToday) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } else {
      return `${messageDate.getMonth() + 1}.${messageDate.getDate()}`;
    }
  };

  useEffect(() => {
    if (chatData.length > 0 && !intervalId) {
      const id = setInterval(() => {
        queryClient.invalidateQueries({
          queryKey: ['chatList', userId]
        });
      }, 1000);
      setIntervalId(id);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [chatData, queryClient, userId, intervalId]);

  if (chatPending || postPending || userPending)
    return <div className="flex min-h-[calc(100vh-400px)] items-center justify-center">Loading...</div>;

  if (chatError || postError || userError)
    return <div className="flex min-h-[calc(100vh-400px)] items-center justify-center">Error loading data</div>;

  if (!chatData || chatData.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-400px)] items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-[8px]">
          <Image src="/icons/Group-348.svg" alt="no chat" width={44} height={44} />
          <p className="text-[14px] font-semibold text-grayscale-900">You don&apos;t have any messages</p>
          <p className="text-[12px] text-grayscale-600">When you receive a new message,</p>
          <p className="text-[12px] text-grayscale-600">it will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {groupedChats &&
        Object.values(groupedChats).map((chat, index) => {
          const postDetails = postData?.find((post) => post.id === chat.post_id);
          const receiverId = userId === chat.sender_id ? chat.receiver_id : chat.sender_id;
          const senderDetails = userData?.find((user) => user.id === receiverId);

          const firstMessage = chat.messages[0];
          const chatId = `${chat.post_id}-${[chat.sender_id, chat.receiver_id].sort().join('-')}`;
          const isNewMessage = !newMessages[chatId] && firstMessage.sender_id !== userId && !firstMessage.is_checked;

          return (
            <div className="mb-[32px]" key={index} onClick={() => handleChatClick(chat)}>
              {postDetails && senderDetails && (
                <div className="flex">
                  <Image
                    className="rounded-[8px]"
                    src={postDetails.image || '/icons/upload.png'}
                    alt={postDetails.title || 'Default name'}
                    width={64}
                    height={64}
                    style={{ width: '64px', height: '64px' }}
                  />
                  <div className="ml-[8px] flex w-full flex-col gap-[5px]">
                    <div className="flex items-center justify-between">
                      <p className="line-clamp-1 text-[13px] font-medium text-primary-900">{postDetails.title}</p>
                      <p className="ml-[8px] flex-shrink-0 text-[10px] text-grayscale-500">
                        {formatDate(firstMessage?.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[12px] text-grayscale-900">{firstMessage?.content}</p>
                      {isNewMessage && <span className="h-[8px] w-[8px] rounded-full bg-action-color"></span>}
                    </div>
                    <div className="flex">
                      <Image
                        className="items-center rounded-full"
                        src={senderDetails.avatar || '/icons/upload.png'}
                        alt={senderDetails.name || 'Default name'}
                        width={16}
                        height={16}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <p className="ml-[4px] text-[10px] text-grayscale-500">{senderDetails.name}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default ChatList;
