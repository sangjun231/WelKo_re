'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import usePostStore from '@/zustand/postStore';
import Likes from './Likes';
import { GoPeople } from 'react-icons/go';
import { IoLocationOutline } from 'react-icons/io5';

export default function Read() {
  const { id } = useParams();
  const postId = Array.isArray(id) ? id[0] : id;
  const { setPostId, post, fetchPost } = usePostStore((state) => ({
    setPostId: state.setPostId,
    post: state.post,
    fetchPost: state.fetchPost
  }));

  useEffect(() => {
    if (postId) {
      setPostId(postId);
      fetchPost(postId);
    }
  }, [postId, setPostId, fetchPost]);

  if (!post) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  const tags: string[] = Array.isArray(post.tag) ? post.tag.map((tag) => String(tag)) : [];
  const startDate: Date | null = post.startDate ? new Date(post.startDate) : null;
  const endDate: Date | null = post.endDate ? new Date(post.endDate) : null;

  const formatDateRange = (startDate: Date | null, endDate: Date | null) => {
    if (!startDate || !endDate) return 'N/A';
    const formatMonthDay = (date: Date) => `${date.getMonth() + 1}.${date.getDate()}`;

    if (startDate.getFullYear() === endDate.getFullYear()) {
      return `${startDate.getFullYear().toString().slice(2)}.${formatMonthDay(startDate)} - ${formatMonthDay(endDate)}`;
    } else {
      return `${startDate.getFullYear().toString().slice(2)}.${formatMonthDay(startDate)} - ${endDate.getFullYear().toString().slice(2)}.${formatMonthDay(endDate)}`;
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative h-[300px] w-full">
        <Image
          src={post.image}
          alt={post.title}
          layout="fill" // 이미지가 부모 컨테이너에 맞춰지도록 설정
          objectFit="cover" // 이미지를 커버 모드로 설정
          className="mb-[20px] h-[300px] w-[360px]"
        />
        <Likes />
      </div>
      <div className="max-w-[320px] gap-8">
        <div className="mt-6 flex flex-col items-start gap-6">
          <ul className="flex max-w-[320px] flex-wrap items-start gap-2">
            {tags.map((tag, index) => (
              <li key={index} className="select-button gap-1 text-[13px]">
                {tag}
              </li>
            ))}
          </ul>
          <h1 className="text-grayscale-900 text-xl font-semibold">{post.title}</h1>
          <p className="text-grayscale-500 text-xl font-normal">{formatDateRange(startDate, endDate)}</p>
          <div className="flex text-lg">
            <span className="text-primary-300 font-semibold">${post.price}</span>
            <span className="text-grayscale-600 font-medium">/Person</span>
          </div>
          <div className="text-grayscale-900 flex text-sm font-semibold">
            <IoLocationOutline size={20} />
            <h4 className="ml-1 mr-8">Gyeongju</h4>
            <GoPeople size={20} />
            <h4 className="ml-1">Max {post.maxPeople}</h4>
          </div>
        </div>
        <hr className="bg-grayscale-100 my-8 h-[1px] w-full" />
        <div className="text-md text-grayscale-700">
          <h3>{post.content}</h3>
        </div>
        <hr className="bg-grayscale-100 my-8 h-[1px] w-full" />
      </div>
    </div>
  );
}
