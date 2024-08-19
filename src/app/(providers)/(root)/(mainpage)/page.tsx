'use client';

import PostsList from './_components/PostsList';
import HeadMeta from '@/components/common/Header/HeadMeta';
import CircleImageList from './_components/home/CircleImageList';
import SlideImage from './_components/home/SlideImage';
import { lazy, Suspense } from 'react';

const BestPostsList = lazy(() => import('./_components/home/BestPostsList'));

export default function Home() {
  return (
    <>
      <HeadMeta />
      <div className="relative">
        <div className="md:h-[560px]">
          <SlideImage />
        </div>
        <div
          className="bottom-0 left-0 right-0 rounded-t-3xl bg-white p-4 md:p-0 md:px-[88px]"
          style={{ height: '20%', top: '80%' }}
        >
          <CircleImageList />
          <PostsList />
          <Suspense fallback={<div>Loading...</div>}>
            <BestPostsList />
          </Suspense>
        </div>
      </div>
    </>
  );
}
