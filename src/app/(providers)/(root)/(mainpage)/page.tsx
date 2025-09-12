'use client';

import HeadMeta from '@/components/common/Header/HeadMeta';
import CircleImageList from './_components/home/CircleImageList';
import SlideImage from './_components/home/SlideImage';
import { lazy, Suspense } from 'react';
import PopularPostList from './_components/home/PopularPostList';
import Link from 'next/link';

const BestPostsList = lazy(() => import('./_components/home/BestPostsList'));
const PostsList = lazy(() => import('./_components/PostsList'));

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
          <PopularPostList />
          <Suspense fallback={<div>Loading...</div>}>
            <BestPostsList />
            <PostsList />
          </Suspense>
        </div>

        {/* Gemini AI 버튼 - 좌측 하단 고정 */}
        <Link
          href="/ai-image-analysis"
          className="group fixed bottom-6 left-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
          title="AI 이미지 분석"
        >
          <div className="relative">
            {/* AI 아이콘 */}
            <svg
              className="h-8 w-8 text-white transition-transform duration-300 group-hover:rotate-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {/* 작은 점 표시 */}
            <div className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-yellow-400"></div>
          </div>
        </Link>
      </div>
    </>
  );
}
