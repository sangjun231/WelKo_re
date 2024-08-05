'use client';

import Link from 'next/link';
import Image from 'next/image';
import usePostStore from '@/zustand/postStore';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDate, formatDateRange } from '@/utils/detail/functions';
import { useParams } from 'next/navigation';

export default function PaymentHistory() {
  const { id } = useParams(); // URL 경로에서 id 파라미터를 가져옴
  const { setPostId, fetchPost, post } = usePostStore((state) => ({
    setPostId: state.setPostId,
    fetchPost: state.fetchPost,
    post: state.post
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
        const payment = response.data;
        setPaymentData(payment);

        if (payment && payment.post_id) {
          await fetchPost(payment.post_id);
        }
      } catch (error) {
        console.error('Error fetching payment data:', error);
      } finally {
        setPending(false);
      }
    };

    fetchPaymentData();
  }, [id, fetchPost]);

  const handleCancelRequest = async () => {
    try {
      const response = await axios.post(`/api/detail/payment/${id}`, {
        reason: 'User requested cancel',
        requester: 'CUSTOMER'
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error requesting cancel:', error);
      alert('Cancel request failed.');
    }
  };

  if (pending) {
    return <div>Loading...</div>;
  }

  if (!paymentData) {
    return <div>No payment data found.</div>;
  }

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

  const postPrice = post?.price ?? 0; // post.price가 undefined일 경우 0을 사용
  const numberOfPeople = postPrice > 0 ? paymentData.total_price / postPrice : 'N/A';

  return (
    <div className="flex flex-col">
      {post && (
        <div className="p-4">
          <div className="items-center space-x-4">
            <div className="flex">
              <Image src={post.image} alt={post.title} width={96} height={96} className="mr-2 w-24" />
              <div className="">
                <h2 className="text-xl font-bold">{post.title}</h2>
                <p className="text-grayscale-500 text-xl font-normal">
                  {formatDateRange(post.startDate, post.endDate)}
                </p>
                <div className="text-sm">${post.price.toFixed(2)}</div>
              </div>
              <div className="flex flex-col">
                <h2 className="text-sm">결제 번호: {paymentData.id}</h2>
                <h2 className="text-sm">결제한 유저 이름: {paymentData.users.name}</h2>
                <h2 className="text-sm">결제한 유저 이메일: {paymentData.users.email}</h2>
                <h2 className="text-sm">결제한 시간: {formatDate(paymentData.created_at)}</h2>
                <h2 className="text-sm">투어 인원수: {numberOfPeople}</h2>
                <p>총 금액: ${paymentData.total_price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col">
        <button className="border" onClick={handleCancelRequest}>
          환불하기
        </button>
        <button onClick={handleGoToMyPage} className="border">
          마이페이지 바로가기
        </button>
      </div>
    </div>
  );
}
