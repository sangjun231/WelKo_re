'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import usePostStore from '@/zustand/postStore';

export default function Read() {
  const { id } = useParams();
  const postId = Array.isArray(id) ? id[0] : id;
  const [selectedDay, setSelectedDay] = useState<string>('1일차');
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

  return (
    <div className="w-full max-w-[400px]">
      <div className="w-full p-[40px]">
        <div>
          <div className="w-full">
            <Image
              src={post.image}
              alt={post.title}
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
                {Object.entries(post.tag).map(([key, value]) => (
                  <li key={key}>{value}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex space-x-2">
                {Object.keys(post.period).map((day) => (
                  <button
                    key={day}
                    className={`rounded px-4 py-2 ${selectedDay === day ? 'bg-blue-500 text-white' : 'bg-gray-400'}`}
                    onClick={() => setSelectedDay(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                {Object.entries(post.period).map(([day, details]) => (
                  <div key={day} className={`${selectedDay === day ? 'block' : 'hidden'}`}>
                    <ul>
                      {details.events.map((event, eventIndex) => (
                        <li key={eventIndex}>{event}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <p>{new Date(post.created_at).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
