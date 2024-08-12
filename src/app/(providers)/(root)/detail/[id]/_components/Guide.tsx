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
      postId: post.id,
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
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-grayscale-900">Contact your guide</h2>
      <p className="text-sm font-normal text-grayscale-500">
        For more information such as the number of people and schedule change, it is recommended to send a message to
        the guide to discuss and check.
      </p>
      <div className="flex gap-4">
        {user && (
          <>
            <Image
              src={user.avatar}
              alt={`${user.name}의 아바타`}
              width={56}
              height={56}
              className="mr-2 h-14 w-14 rounded-full object-cover"
            />
            <div className="gap-3">
              <h4 className="text-lg font-semibold">{user.name}</h4>
              <h5 className="text-sm font-normal">Seoul, Korea</h5>
            </div>
          </>
        )}
      </div>
      <button
        className="rounded-2xl border border-grayscale-800 px-5 py-3 text-base font-semibold"
        onClick={handleChat}
      >
        Message Host
      </button>
      <hr className="mb-6 mt-8 h-[1px] w-full bg-grayscale-100" />
    </div>
  );
};
