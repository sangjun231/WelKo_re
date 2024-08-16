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
  { src: '/img/main.jpeg', alt: 'Main Image' }
];

const SlideImage: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [uuid, setUuid] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768); // 화면 너비가 768px 이상일 때 데스크탑으로 간주
    };

    window.addEventListener('resize', handleResize);
    handleResize();

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
    setUuid(uuidv4());
  }, []);

  return (
    <div className="relative">
      {/* 로딩 상태를 기반으로 콘텐츠 숨기기 */}
      {isLoading && <div className="absolute inset-0 bg-transparent" />}

      {isDesktop ? (
        <div style={{ width: '100%', height: '560px', overflow: 'hidden' }}>
          <Image
            src={images[currentImageIndex].src}
            alt={images[currentImageIndex].alt}
            width={1440}
            height={560}
            style={{
              display: isLoading ? 'none' : 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            priority
            onLoadingComplete={() => setIsLoading(false)}
          />
        </div>
      ) : (
        <Image
          src="/img/img.jpeg"
          alt="Mobile Image"
          width={800}
          height={216}
          style={{
            display: isLoading ? 'none' : 'block',
            width: '100%',
            height: 'auto'
          }}
          priority
          onLoadingComplete={() => setIsLoading(false)}
        />
      )}

      {!isLoading && (
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
                className="ml-1"
              />
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SlideImage;
