'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/common/Header/Header';
import PostsList from './_components/PostsList';
import Image from 'next/image';
import CircleImageList from './_components/CircleImageList';
import BestPostsList from './_components/BestPostsList';
import HeadMeta from '@/components/common/Header/HeadMeta';
import Search from '@/components/common/Search/Search';

export default function Home() {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768); // 화면 너비가 768px 이상일 때 데스크탑으로 간주
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 초기 상태 설정

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <HeadMeta />
      <div className="relative">
        <Header />
        <Image
          src={isDesktop ? '/img/main.jpeg' : '/img/img.jpeg'}
          alt="Description of the image"
          width={isDesktop ? 1440 : 800}
          height={isDesktop ? 560 : 216}
          style={{
            display: 'block',
            width: '100%',
            height: isDesktop ? '560px' : '216px' // 데스크탑에서는 560px, 모바일에서는 216px
          }}
          priority
        />
        <div className="bottom-0 left-0 right-0 rounded-t-3xl bg-white p-4" style={{ height: '20%', top: '80%' }}>
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
