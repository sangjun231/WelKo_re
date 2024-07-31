'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import useAuthStore from '@/zustand/bearsStore';
import { formatDateRange } from '@/utils/detail/formatDateRange';
import usePostStore from '@/zustand/postStore';

const DetailNavbar = () => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const { post } = usePostStore((state) => ({
    post: state.post
  }));

  const handleButtonClick = () => {
    if (!user) {
      alert('로그인이 필요한 서비스입니다!!');
      router.push('/login');
    } else {
      router.push(`/detail/reservation/${post?.id}`);
    }
  };
  return (
    <div className="fixed bottom-0 left-0 z-10 w-full bg-white">
      <hr className="bg-grayscale-100 mx-auto h-[1px] w-full max-w-[360px]" />
      <div className="mx-auto flex max-w-[320px] items-center justify-between py-4">
        <div className="flex flex-col justify-center">
          <div className="flex items-center text-lg">
            <span className="text-primary-300 font-semibold">${post?.price}</span>
            <span className="text-grayscale-600 font-medium">/Person</span>
          </div>
          <div className="flex justify-start">
            <p className="text-grayscale-900 text-xs font-medium">
              {formatDateRange(post?.startDate ?? null, post?.endDate ?? null)}
            </p>
          </div>
        </div>
        <button onClick={handleButtonClick} className="bg-primary-300 w-40 rounded-xl px-4 py-2 text-white">
          Reserve
        </button>
      </div>
    </div>
  );
};

export default DetailNavbar;
