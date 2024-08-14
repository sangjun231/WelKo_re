'use client';

import Header from '@/components/common/Header/Header';
import PostsList from './_components/PostsList';
import Image from 'next/image';
import CircleImageList from './_components/CircleImageList';
import BestPostsList from './_components/BestPostsList';
import Head from 'next/head';

export default function Home() {
  return (
    <>
     <Head>
        <meta name="theme-color" content="#000000" /> {/* Android 상태 표시줄 색상 */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" /> {/* iOS 상태 표시줄 스타일 */}
      </Head>
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
    </>
  );
}
