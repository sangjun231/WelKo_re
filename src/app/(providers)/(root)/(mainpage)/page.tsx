'use client';

import Header from '@/components/common/Header/Header';
import PostsList from './_components/PostsList';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative">
      <Image src="/img/img.jpg" alt="Description of the image" width={800} height={600} layout="responsive" style={{ display: 'initial', verticalAlign: 'baseline' }}/>
      <div
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white p-4"
        style={{ height: '20%', top: '80%' }}
      >
        <Header />
        <PostsList />
      </div>
    </div>
  );
}
