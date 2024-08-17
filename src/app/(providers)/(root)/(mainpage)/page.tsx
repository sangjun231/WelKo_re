'use client';

import PostsList from './_components/PostsList';
import HeadMeta from '@/components/common/Header/HeadMeta';
import Search from '@/components/common/Search/Search';
import CircleImageList from './_components/home/CircleImageList';
import BestPostsList from './_components/home/BestPostsList';
import SlideImage from './_components/home/SlideImage';

export default function Home() {
  return (
    <>
      <HeadMeta />
      <div className="relative">
        <SlideImage />
        <div
          className="bottom-0 left-0 right-0 rounded-t-3xl bg-white p-4 md:p-0 md:px-[88px]"
          style={{ height: '20%', top: '80%' }}
        >
          <div className="block sm:hidden">
            <Search />
          </div>
          <CircleImageList />
          <PostsList />
          <BestPostsList />
        </div>
      </div>
    </>
  );
}
