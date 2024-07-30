'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import Chat from '@/components/Chat';

const ChatPage = () => {
  const { id: senderId, receiverid: receiverId } = useParams() as { id: string; receiverid: string };
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const handleBack = () => {
    router.back();
  };

  const checkAccess = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) throw new Error(error.message);

    if (data.user.id !== senderId && data.user.id !== receiverId) {
      alert('접근 권한이 없습니다.');
      router.push('/');
    }
  };

  const postId = searchParams.get('postId');
  const postTitle = searchParams.get('postTitle');
  const postImage = searchParams.get('postImage');

  useEffect(() => {
    checkAccess();
  }, [senderId, receiverId, router, supabase]);

  return (
    <div>
      <div className="mb-4 flex justify-around">
        <button onClick={handleBack}>Go Back</button>
        <p className="font-bold">message</p>
      </div>
      <div className="flex">
        <Image
          className="mb-[20px] mr-2"
          src={postImage ?? '/icons/upload.png'}
          alt={postTitle ?? 'Default title'}
          width={40}
          height={40}
        />
        <p className="text-[14px] font-bold">Title: {postTitle}</p>
      </div>
      <Chat postId={postId || ''} senderId={senderId} receiverId={receiverId} />
    </div>
  );
};

export default ChatPage;
