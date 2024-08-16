'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

const images = [
  { src: '/img/main-busan.jpg', alt: 'Busan' },
  { src: '/img/main-seoul.jpg', alt: 'Seoul' },
  { src: '/img/main-jeju.jpg', alt: 'Jeju' },
  { src: '/img/main-yeosu.jpg', alt: 'Yeosu' },
  { src: '/img/main.jpeg', alt: 'Main Image' } // 기존 이미지 추가
];

const SlideImage: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [uuid, setUuid] = useState<string>('');

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768); // 화면 너비가 768px 이상일 때 데스크탑으로 간주
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 초기 상태 설정

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000); // 5초마다 이미지 전환

      return () => clearInterval(interval);
    }
  }, [isDesktop]);

  useEffect(() => {
    setUuid(uuidv4()); // 클라이언트 사이드에서 uuid 생성
  }, []);

  return (
    <div className="relative">
      {/* 데스크탑에서는 슬라이드 이미지 표시 */}
      {isDesktop ? (
        <div style={{ width: '100%', height: '560px', overflow: 'hidden' }}>
          <Image
            src={images[currentImageIndex].src}
            alt={images[currentImageIndex].alt}
            width={1440} // 실제 이미지의 너비
            height={560} // 고정된 높이
            style={{
              display: 'block',
              width: '100%', // 너비를 100%로 설정
              height: '100%', // 높이를 100%로 설정
              objectFit: 'cover' // 비율을 유지하면서 컨테이너를 완전히 채움
            }}
            priority
          />
        </div>
      ) : (
        // 모바일에서는 단일 이미지 표시
        <Image
          src="/img/img.jpeg"
          alt="Mobile Image"
          width={800}
          height={216}
          style={{
            display: 'block',
            width: '100%',
            height: 'auto'
          }}
          priority
        />
      )}

      {/* 텍스트 추가 (모바일 화면에서는 숨기기) */}
      <div
        className={`absolute left-0 top-0 ml-[88px] flex flex-col justify-center text-white ${isDesktop ? '' : 'hidden'}`}
        style={{
          height: '560px',
          width: '40%'
        }}
      >
        <h1
          className="mb-[32px] whitespace-pre text-lg font-bold sm:text-2xl md:text-4xl"
          style={{
            lineHeight: '1.35'
          }}
        >
          Enjoy the wonders of Korea{'\n'}with our Knowledgeable{'\n'}guide
        </h1>
        <div className="mb-[32px] whitespace-pre">
          Welco offers a rich travel experience through the kind guidance
          <br />
          of a local guide living in Korea
        </div>
        <Link href={`/postpage/${uuid}`}>
          <button className="flex items-center rounded-2xl bg-[#B95FAB] px-6 py-4 text-lg font-semibold">
            Make Your Tour
            <Image
              src="/icons/tabler-icon-whtiepencil.svg"
              alt="Pencil Icon"
              width={24}
              height={24}
              className="ml-1" // 아이콘과 텍스트 사이 간격
            />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SlideImage;
