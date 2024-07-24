'use client';

import { useState } from 'react';
import PostList from './_components/PostList';
import ProfileView from './_components/ProfileView';
import ReviewList from './_components/ReviewList';
import { useParams, useRouter } from 'next/navigation';

const MyPage = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <h1>My Page</h1>
      <button onClick={handleBack}>Go Back</button>
      <ProfileView userId={id} />

      <div className="flex justify-around">
        <button onClick={() => setSelectedComponent('reviews')}>Reviews</button>
        <button onClick={() => setSelectedComponent('posts')}>Posts</button>
      </div>

      {selectedComponent === 'reviews' && <ReviewList userId={id} />}
      {selectedComponent === 'posts' && <PostList />}
    </div>
  );
};

export default MyPage;
