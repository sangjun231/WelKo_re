'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMyPageStore } from '@/zustand/mypageStore';
import { handleLogout } from '@/utils/supabase/service';
import PostList from './_components/PostList';
import ProfileView from './_components/ProfileView';
import ReviewList from './_components/ReviewList';
import LikeList from './_components/LikeList';
import ReservationList from './_components/ReservationList';

const MyPage = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const selectedComponent = useMyPageStore((state) => state.selectedComponent);
  const setSelectedComponent = useMyPageStore((state) => state.setSelectedComponent);

  const handleBack = () => {
    router.back();
  };

  const logout = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    await handleLogout(router);
    router.push('/login');
  };

  const buttonClass = (component: string) =>
    `flex-1 text-center ${selectedComponent === component ? 'text-primary-300 border-primary-300' : 'text-grayscale-500'}`;

  return (
    <div className="mx-[20px]">
      <div className="mt-[56px] flex justify-between">
        <button onClick={handleBack}>Go Back</button>
        <p className="text-[18px] font-bold">My Page</p>
        <button className="text-[14px] text-action-color" onClick={logout}>
          Logout
        </button>
      </div>
      <ProfileView userId={id} />
      <div className="my-[20px] flex justify-around">
        <button className={`border-b ${buttonClass('Wishlist')}`} onClick={() => setSelectedComponent('Wishlist')}>
          Wishlist
        </button>
        <button className={`border-b ${buttonClass('Post')}`} onClick={() => setSelectedComponent('Post')}>
          Post
        </button>
        <button
          className={`border-b ${buttonClass('Reservation')}`}
          onClick={() => setSelectedComponent('Reservation')}
        >
          Reservation
        </button>
        <button className={`border-b ${buttonClass('Review')}`} onClick={() => setSelectedComponent('Review')}>
          Review
        </button>
      </div>
      {selectedComponent === 'Wishlist' && <LikeList />}
      {selectedComponent === 'Post' && <PostList />}
      {selectedComponent === 'Reservation' && <ReservationList />}
      {selectedComponent === 'Review' && <ReviewList userId={id} />}
    </div>
  );
};

export default MyPage;
