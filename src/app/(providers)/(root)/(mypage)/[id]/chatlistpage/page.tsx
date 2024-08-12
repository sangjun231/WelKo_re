'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import ChatList from './_components/ChatList';

const MyPage = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="mx-[20px] mt-[56px]">
      <div className="relative mb-[36px] flex items-center justify-between">
        <button
          className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-grayscale-50"
          onClick={handleBack}
        >
          <Image
            src="/icons/tabler-icon-chevron-left.svg"
            alt="Go Back"
            width={24}
            height={24}
            style={{ width: '24px', height: '24px' }}
          />
        </button>
        <p className="absolute left-1/2 -translate-x-1/2 transform text-[18px] font-semibold">Message</p>
        <div className="w-8"></div>
      </div>
      <ChatList userId={id} />
    </div>
  );
};

export default MyPage;
