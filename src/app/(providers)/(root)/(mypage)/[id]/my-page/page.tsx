'use client';

import PostList from './_components/PostList';
import ProfileView from './_components/ProfileView';
import ReviewList from './_components/ReviewList';
import { useParams, useRouter } from 'next/navigation';

const MyPage = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <h1>My Page</h1>
      <button onClick={handleBack}>Go Back</button>
      <ProfileView userId={id} />
      <ReviewList userId={id} />
      <PostList />
    </div>
  );
};

export default MyPage;
