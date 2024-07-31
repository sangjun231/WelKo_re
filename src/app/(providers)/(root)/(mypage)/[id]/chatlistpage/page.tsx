'use client';

import { useParams, useRouter } from 'next/navigation';

import ChatList from './_components/ChatList';

const MyPage = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <p className="mb-4">ChatListPage</p>
      <button onClick={handleBack}>Go Back</button>
      <div>
        <ChatList userId={id} />
      </div>
    </div>
  );
};

export default MyPage;
