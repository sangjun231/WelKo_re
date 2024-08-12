'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import usePostStore from '@/zustand/postStore';
import Likes from './Likes';
import { formatDateRange } from '@/utils/detail/functions';
import IconLocation from '/public/icons/detail_icons/icon_location.svg';
import IconPeoples from '/public/icons/detail_icons/icon_peoples.svg';

export default function DetailImg() {
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

  const tags: string[] = Array.isArray(post.tags) ? post.tags.map((tag) => String(tag)) : [];

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
          <h1 className="text-xl font-semibold text-grayscale-900">{post.title}</h1>
          <p className="text-xl font-normal text-grayscale-500"> {formatDateRange(post.startDate, post.endDate)}</p>
          <div className="flex text-lg">
            <span className="font-semibold text-primary-300">${post.price}</span>
            <span className="font-medium text-grayscale-600">/Person</span>
          </div>
          <div className="flex text-sm font-semibold text-grayscale-900">
            <IconLocation alt="Location" width={24} height={24} />
            <h4 className="ml-1 mr-8">Gyeongju</h4>
            <IconPeoples alt="Max Peoples" width={24} height={24} />
            <h4 className="ml-1">Max {post.maxPeople}</h4>
          </div>
        </div>
        <hr className="mb-6 mt-8 h-[1px] w-full bg-grayscale-100" />
        <div className="text-md text-grayscale-700">
          <p>{post.content}</p>
        </div>
        <hr className="mb-6 mt-8 h-[1px] w-full bg-grayscale-100" />
      </div>
    </div>
  );
}
