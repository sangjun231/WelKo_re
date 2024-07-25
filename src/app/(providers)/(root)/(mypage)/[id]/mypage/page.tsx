'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Chat from '@/components/Chat';
import PostList from './_components/PostList';
import ProfileView from './_components/ProfileView';
import ReviewList from './_components/ReviewList';
import LikeList from './_components/LikeList';

const MyPage = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const handleBack = () => {
    router.back();
  };

  const senderId = id;
  const receiverId = 'b83f8bba-9072-44a2-9dd8-122cbc06fff8';

  return (
    <div>
      <h1 className="mb-4">My Page</h1>
      <Chat senderId={senderId} receiverId={receiverId} />
      <button onClick={handleBack}>Go Back</button>
      <ProfileView userId={id} />
      <div className="mb-2 mt-4 flex justify-around">
        <button onClick={() => setSelectedComponent('likes')}>likes</button>
        <button onClick={() => setSelectedComponent('posts')}>Posts</button>
        <button onClick={() => setSelectedComponent('reviews')}>Reviews</button>
      </div>
      {selectedComponent === 'likes' && <LikeList />}
      {selectedComponent === 'posts' && <PostList />}
      {selectedComponent === 'reviews' && <ReviewList userId={id} />}
    </div>
  );
};

export default MyPage;
