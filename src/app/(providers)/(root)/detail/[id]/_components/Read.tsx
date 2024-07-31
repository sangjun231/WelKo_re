'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import usePostStore from '@/zustand/postStore';

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
      return `${startDate.getFullYear().toString().slice(2)}.${formatMonthDay(startDate)} ~ ${formatMonthDay(endDate)}`;
    } else {
      return `${startDate.getFullYear().toString().slice(2)}.${formatMonthDay(startDate)} ~ ${endDate.getFullYear().toString().slice(2)}.${formatMonthDay(endDate)}`;
    }
  };

  return (
    <div className="w-full max-w-[400px]">
      <div className="w-full p-[40px]">
        <div>
          <div className="w-full">
            <Image
              src={post.image || '/path/to/default-image.jpg'} // 기본 이미지 경로를 제공
              alt={post.title || 'Default title'} // 기본 제목을 제공
              width={300}
              height={300}
              className="mb-[20px] h-[300px] w-[300px]"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{post.title}</h1>
          </div>
          <div className="text-md">
            <p>
              <strong>{post.price}$</strong>
            </p>
            <p>{post.content}</p>
            <div>
              <ul>
                {tags.map((tag, index) => (
                  <li key={index}>{tag}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <p>
                <strong>기간:</strong> {formatDateRange(startDate, endDate)}
              </p>
            </div>
            <p>{new Date(post.created_at).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
