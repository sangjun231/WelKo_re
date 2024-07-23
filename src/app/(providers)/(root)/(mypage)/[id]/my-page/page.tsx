'use client';

import PostList from './_components/PostList';
import ProfileForm from './_components/ProfileForm';
import ReviewList from './_components/ReviewList';
import { useParams } from 'next/navigation';

const MyPage = () => {
  const { id } = useParams() as { id: string };

  return (
    <div>
      <h1>My Page</h1>
      <ProfileForm userId={id} />
      <ReviewList userId={id} />
      <PostList />
    </div>
  );
};

export default MyPage;
