'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import usePostStore from '@/zustand/postStore';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PaymentSuccess() {
  const { id } = useParams();
  const { setPostId, fetchPost, post } = usePostStore((state) => ({
    setPostId: state.setPostId,
    fetchPost: state.fetchPost,
    post: state.post
  }));
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setPending] = useState(true);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await axios.get(`/api/detail/payment/${id}`);
        setPaymentData(response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching payment data:', error);
        return null;
      }
    };

    if (id) {
      fetchPaymentData().then((data) => {
        if (data && data.post_id) {
          fetchPost(data.post_id);
        }
        setPending(false);
      });
    }
  }, [id, fetchPost]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!paymentData) {
    return <div>No payment data found.</div>;
  }

  const handleGoToMyPage = () => {
    const userId = paymentData.user_id;
    window.location.href = `/${userId}/mypage`;
  };

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

  return (
    <div>
      {post && (
        <div className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex">
              <Image src={post.image} alt={post.title} width={96} height={96} className="mr-2 w-24" />
              <div className="">
                <h2 className="text-xl font-bold">{post.title}</h2>
                <p className="text-gray-500">24.8.19~8.22</p> {/* 날짜는 하드코딩 대신 추후 실제 데이터로 대체 */}
                <div className="text-sm font-bold">${post.price.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        <h1>결제 내역</h1>
        <p>결제가 완료되었습니다!</p>
        <p>Total Price: ${paymentData.total_price.toFixed(2)}</p>
      </div>
      <div className="flex flex-col">
        <button className="border">
          <Link href="/">홈 화면 바로가기</Link>
        </button>
        <button onClick={handleGoToMyPage} className="border">
          마이페이지 바로가기
        </button>
        <button onClick={handleCancelRequest} className="border">환불 요청하기</button>
      </div>
    </div>
  );
}
