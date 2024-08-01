'use client';

import { useParams, useRouter } from 'next/navigation';
import PostList from './_components/PostList';
import ProfileView from './_components/ProfileView';
import ReviewList from './_components/ReviewList';
import LikeList from './_components/LikeList';
import ReservationList from './_components/ReservationList';
import { useMyPageStore } from '@/zustand/mypageStore';

const MyPage = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const selectedComponent = useMyPageStore((state) => state.selectedComponent);
  const setSelectedComponent = useMyPageStore((state) => state.setSelectedComponent);

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <h1 className="mb-4">My Page</h1>
      <button onClick={handleBack}>Go Back!</button>
      <ProfileView userId={id} />
      <div className="mb-2 mt-4 flex justify-around">
        <button onClick={() => setSelectedComponent('likes')}>likes</button>
        <button onClick={() => setSelectedComponent('posts')}>Posts</button>
        <button onClick={() => setSelectedComponent('Reservations')}>Reservations</button>
        <button onClick={() => setSelectedComponent('reviews')}>Reviews</button>
      </div>
      {selectedComponent === 'likes' && <LikeList />}
      {selectedComponent === 'posts' && <PostList />}
      {selectedComponent === 'Reservations' && <ReservationList />}
      {selectedComponent === 'reviews' && <ReviewList userId={id} />}
    </div>
  );
};

export default MyPage;
