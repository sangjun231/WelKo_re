'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { API_MYPAGE_PROFILE, API_POST_DETAILS } from '@/utils/apiConstants';
import { WebProps } from '@/types/webstate';

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

export const Guide = ({ isWeb }: WebProps) => {
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

  const { data: post } = useQuery<Post>({
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
    <div className="web:;gap-10 flex flex-col gap-6">
      <div className="web:gap-6 flex flex-col gap-2">
        <h2 className="web:text-4xl text-lg font-semibold text-grayscale-900">Contact your guide</h2>
        <p className="web:text-lg web:mb-10 text-sm text-grayscale-500">
          For more information such as the number of people and schedule change, it is recommended to send a message to
          the guide to discuss and check.
        </p>
      </div>
      <div className="web:flex-row flex flex-col">
        <div className="web:flex-1 flex flex-col gap-4">
          {user && (
            <div className="flex flex-row items-center gap-2">
              <Image
                src={user.avatar}
                alt={`${user.name}의 아바타`}
                width={isWeb ? 80 : 56}
                height={isWeb ? 80 : 56}
                className="web:h-80 web:w-80 mr-2 h-14 w-14 rounded-full object-cover"
              />
              <div className="flex flex-col gap-1">
                <h4 className="web:text-2xl text-lg font-semibold">{user.name}</h4>
                <h5 className="web:text-xl text-sm font-normal">Seoul, Korea</h5>
              </div>
            </div>
          )}

          <button
            className="web:py-4 web:px-6 web:text-lg rounded-2xl border border-grayscale-800 px-5 py-3 text-base font-semibold text-grayscale-700"
            onClick={handleChat}
          >
            Message Host
          </button>
        </div>
        <Image
          src="/img/GuideWeb.png"
          alt={`${user.name}의 아바타`}
          width={isWeb ? 80 : 56}
          height={isWeb ? 80 : 56}
          className="web:h-80 web:w-80 web:block hidden flex-1 rounded-2xl"
        />
      </div>
      <hr className="web:my-20 mb-6 mt-3 h-[1px] w-full bg-grayscale-100" />
    </div>
  );
};
