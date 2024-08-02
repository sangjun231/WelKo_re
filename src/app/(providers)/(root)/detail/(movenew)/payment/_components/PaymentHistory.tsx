'use client';

import Link from 'next/link';
import Image from 'next/image';
import usePostStore from '@/zustand/postStore';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDateRange } from '@/utils/detail/functions';
import { useParams } from 'next/navigation';

export default function PaymentHistory() {
  const { id } = useParams(); // URL 경로에서 id 파라미터를 가져옴
  const { setPostId, fetchPost, post, userName } = usePostStore((state) => ({
    setPostId: state.setPostId,
    fetchPost: state.fetchPost,
    post: state.post,
    userName: state.userName
  }));
  const [paymentData, setPaymentData] = useState<any>(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    const fetchPaymentData = async () => {
      if (!id) {
        setPending(false);
        return;
      }

      try {
        const response = await axios.get(`/api/detail/payment/${id}`);
        setPaymentData(response.data);

        if (response.data && response.data.post_id) {
          await fetchPost(response.data.post_id);
        }
      } catch (error) {
        console.error('Error fetching payment data:', error);
      } finally {
        setPending(false);
      }
    };

    fetchPaymentData();
  }, [id, fetchPost]);

  if (pending) {
    return <div>Loading...</div>;
  }

  if (!paymentData) {
    return <div>No payment data found.</div>;
  }

  const handleGoToMyPage = () => {
    const userId = paymentData.user_id;
    window.location.href = `/${userId}/mypage`;
  };

  return (
    <div>
      {post && (
        <div className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex">
              <Image src={post.image} alt={post.title} width={96} height={96} className="mr-2 w-24" />
              <div className="">
                <h2 className="text-xl font-bold">{post.title}</h2>
                <p className="text-grayscale-500 text-xl font-normal">
                  {formatDateRange(post.startDate, post.endDate)}
                </p>
                <div className="text-sm font-bold">${post.price.toFixed(2)}</div>
                작성자 이름: <h2 className="text-sm font-bold">{userName}</h2>
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        <h1>결제 내역</h1>
        <p>Total Price: ${paymentData.total_price.toFixed(2)}</p>
      </div>
      <div className="flex flex-col">
        <button className="border">
          <Link href="/">홈 화면 바로가기</Link>
        </button>
        <button onClick={handleGoToMyPage} className="border">
          마이페이지 바로가기
        </button>
      </div>
    </div>
  );
}
