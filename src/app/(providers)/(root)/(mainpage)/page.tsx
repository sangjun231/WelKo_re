'use client';

import Header from '@/components/common/Header/Header';
import Image from 'next/image';
import BestPostsList from './_components/BestPostsList';
import CircleImageList from './_components/CircleImageList';
import PostsList from './_components/PostsList';

export default function Home() {
  return (
    <div className="relative">
      <Image
        src="/img/img.jpeg"
        alt="Description of the image"
        width={800}
        height={600}
        style={{ display: 'initial', verticalAlign: 'baseline' }}
        priority
      />
      <div className="bottom-0 left-0 right-0 rounded-t-3xl bg-white p-4" style={{ height: '20%', top: '80%' }}>
        <Header />
        <CircleImageList />
        <PostsList />
        <BestPostsList />
      </div>
    </div>
  );
}
