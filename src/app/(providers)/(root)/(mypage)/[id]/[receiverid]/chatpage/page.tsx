'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Chat from '@/components/Chat';

const ChatPage = () => {
  const { id: senderId, receiverid } = useParams() as { id: string; receiverid: string };
  const router = useRouter();
  const supabase = createClient();

  const handleBack = () => {
    router.back();
  };

  const checkAccess = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) throw new Error(error.message);

    if (data.user.id !== senderId && data.user.id !== receiverid) {
      alert('접근 권한이 없습니다.');
      router.push('/');
    }
  };

  useEffect(() => {
    checkAccess();
  }, [senderId, receiverid, router, supabase]);

  return (
    <div>
      <div className="mb-4 flex justify-around">
        <button onClick={handleBack}>Go Back</button>
        <p className="font-bold">message</p>
      </div>
      <Chat senderId={senderId} receiverId={receiverid} />
    </div>
  );
};

export default ChatPage;
