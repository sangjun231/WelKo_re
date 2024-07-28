'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { API_MYPAGE_PROFILE, API_POST_DETAILS } from '@/utils/apiConstants';

interface User {
  name: string;
  avatar: string;
  id: string;
  region: string;
}

type Post = {
  id: string;
  title: string;
  image: string;
};

export const Guide = () => {
  const { id: postId } = useParams() as { id: string };
  const supabase = createClient();
  const router = useRouter();
  const [customerUser, setCustomerUser] = useState<User | null>(null);

  // 작성자 데이터를 가져오는 함수
  const fetchUser = async (): Promise<User> => {
    const response = await axios.get(`/api/detail/guide/${postId}`);
    return response.data.user; // response.data에서 user 객체를 반환
  };

  const {
    data: user,
    isPending,
    error
  } = useQuery<User>({
    queryKey: ['user', postId],
    queryFn: fetchUser,
    enabled: !!postId
  });

  const fetchPostDetails = async (): Promise<Post> => {
    const response = await axios.get(API_POST_DETAILS(postId));
    return response.data;
  };

  const {
    data: post,
    isPending: isPostPending,
    error: postError
  } = useQuery<Post>({
    queryKey: ['post', postId],
    queryFn: fetchPostDetails,
    enabled: !!postId
  });

  const fetchCustomerUser = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) throw new Error(error.message);

    if (data.user) {
      const userId = data.user.id;
      const response = await axios.get(API_MYPAGE_PROFILE(userId));
      const profileData = response.data;

      const customerUserData: User = {
        id: profileData.id,
        name: profileData.name,
        avatar: profileData.avatar,
        region: profileData.region
      };

      setCustomerUser(customerUserData);
    }
  };

  const handleChat = () => {
    if (!customerUser || !user || !post) {
      throw new Error('Customer user, guide user, or post details are missing.');
    }

    const senderId = customerUser.id;
    const receiverId = user.id;

    const query = new URLSearchParams({
      postTitle: post.title,
      postImage: post.image
    }).toString();

    router.push(`/${senderId}/${receiverId}/chatpage?${query}`);
  };

  useEffect(() => {
    fetchCustomerUser();
  }, [supabase]);

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>Error fetching user data</div>;

  return (
    <div>
      <h3>투어 가이드</h3>
      <div>
        {user && (
          <>
            <Image
              src={user.avatar}
              alt={`${user.name}의 아바타`}
              width={96}
              height={96}
              className="mr-2 h-24 w-24 rounded-full object-cover"
            />
            <p>{user.region}</p>
            <h4>{user.name}</h4>
            <h5>투어 지역은 보류</h5>
            <button className="mb-6 border" onClick={handleChat}>
              메시지 보내기
            </button>
          </>
        )}
      </div>
    </div>
  );
};
