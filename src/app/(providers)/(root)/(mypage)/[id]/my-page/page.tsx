'use client';

import { useState } from 'react';
import PostList from './_components/PostList';
import ProfileView from './_components/ProfileView';
import ReviewList from './_components/ReviewList';
import { useParams, useRouter } from 'next/navigation';
import Chat from '@/components/Chat';

const MyPage = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const handleBack = () => {
    router.back();
  };

  const senderId = id;
  const receiverId = '105c1498-4dd0-421c-ad1b-d698f2217c67';

  return (
    <div>
      <h1 className="mb-4">My Page</h1>
      <Chat senderId={senderId} receiverId={receiverId} />
      <button onClick={handleBack}>Go Back</button>
      <ProfileView userId={id} />
      <div className="mb-2 mt-4 flex justify-around">
        <button onClick={() => setSelectedComponent('reviews')}>Reviews</button>
        <button onClick={() => setSelectedComponent('posts')}>Posts</button>
      </div>
      {selectedComponent === 'reviews' && <ReviewList userId={id} />}
      {selectedComponent === 'posts' && <PostList />}
    </div>
  );
};

export default MyPage;
