'use client';

import Image from 'next/image';
import usePostStore from '@/zustand/postStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { formatDate, formatDateRange } from '@/utils/detail/functions';
import { useParams } from 'next/navigation';
import LikeBtn from '/public/icons/tabler-icon-post-heart.svg';
import ExitBtn from '/public/icons/tabler-icon-x.svg';
import { useLikeStore } from '@/zustand/likeStore';
import useAuthStore from '@/zustand/bearsStore';
import { useMyPageStore } from '@/zustand/mypageStore';
import { useWebStore } from '@/zustand/webStateStore';
import BackButton from '@/components/common/Button/BackButton';

export default function PaymentHistory() {
  const { id } = useParams(); // URL 경로에서 id 파라미터를 가져옴
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setSelectedComponent = useMyPageStore((state) => state.setSelectedComponent);
  const { fetchPost, post } = usePostStore((state) => ({
    fetchPost: state.fetchPost,
    post: state.post
  }));
  const [paymentData, setPaymentData] = useState<any>(null);
  const [pending, setPending] = useState(true);
  const { liked, fetchLikeStatus, toggleLike } = useLikeStore((state) => ({
    liked: state.liked,
    fetchLikeStatus: state.fetchLikeStatus,
    toggleLike: state.toggleLike
  }));
  const { isWeb, setIsWeb } = useWebStore();

  useEffect(() => {
    const handleResize = () => {
      setIsWeb(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [setIsWeb]);

  useEffect(() => {
    if (post?.id && user?.id) {
      fetchLikeStatus(post.id, user.id);
    }
  }, [post?.id, user?.id, fetchLikeStatus]);

  const handleLike = () => {
    if (post?.id && user?.id) {
      toggleLike(post.id, user.id);
    }
  };

  const handleExitClick = () => {
    setSelectedComponent('Reservation');
    router.push(`/${user?.id}/mypage`);
  };

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

  if (pending) {
    return <div>Loading...</div>;
  }

  if (!paymentData) {
    return <div>No payment data found.</div>;
  }

  const postPrice = post?.price ?? 0;
  const numberOfPeople = postPrice > 0 ? paymentData.total_price / postPrice : 'N/A';

  return (
    <div className="web:gap-20 mt-2 flex w-full flex-col">
      <div className="web:flex web:gap-5">
        <button className="icon-button my-2" onClick={handleExitClick}>
          {isWeb ? (
            <BackButton /> // 웹 버전일 경우 BackButton 사용
          ) : (
            <ExitBtn width={24} height={24} /> // 모바일 버전일 경우 ExitBtn 사용
          )}
        </button>
        <h1 className="web:text-3xl my-5 text-xl font-semibold">Reservation confirmed</h1>
      </div>
      {post && (
        <div>
          <div className="flex items-start space-x-4">
            {/* 이미지와 제목 */}
            <div className="web:h-[120px] web:w-[120px] relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
              <Image src={post.image} alt={post.title} fill style={{ objectFit: 'cover' }} className="rounded-lg" />
              <button
                onClick={handleLike}
                className="absolute right-1 top-2 rounded-full bg-[rgba(255,255,255,0.10)] p-0.5 backdrop-blur-[10px]"
              >
                {liked ? (
                  <LikeBtn width={20} height={20} color="#FF7029" fill="#FF7029" />
                ) : (
                  <LikeBtn width={20} height={20} color="white" />
                )}
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="web:text-xl line-clamp-1 text-sm font-semibold">{post.title}</h4>
              <p className="web:text-lg text-sm text-gray-500">{formatDateRange(post.startDate, post.endDate)}</p>
              <div className="web:text-lg text-sm font-medium">
                <span className="text-primary-300">${post.price}</span>
                <span className="text-grayscale-700">/Person</span>
              </div>
            </div>
          </div>
          <hr className="web:my-10 my-5 h-[1px] w-full bg-grayscale-100" />
          {/* 예약 정보 */}

          <div className="flex flex-col gap-1">
            <h3 className="web:text-3xl text-lg font-semibold">Reservation</h3>
            <div className="mt-2 flex flex-col gap-2">
              <span className="web:text-lg text-xs text-grayscale-500">Number</span>
              <span className="web:text-lg text-sm text-grayscale-900">{paymentData.id}</span>
            </div>
            <div className="mt-2 flex flex-col gap-2">
              <span className="web:text-lg text-xs text-grayscale-500">Nickname</span>
              <span className="web:text-lg text-sm text-grayscale-900">{paymentData.users.name}</span>
            </div>
            <div className="mt-2 flex flex-col gap-2">
              <span className="web:text-lg text-xs text-grayscale-500">Email</span>
              <span className="web:text-lg text-sm text-grayscale-900">{paymentData.users.email}</span>
            </div>
            <div className="mt-2 flex flex-col gap-2">
              <span className="web:text-lg text-xs text-grayscale-500">Tourist</span>
              <span className="web:text-lg text-sm text-grayscale-900">{numberOfPeople}</span>
            </div>
          </div>

          <hr className="web:my-10 my-5 h-[1px] w-full bg-grayscale-100" />

          {/* 결제 정보 */}
          <div className="flex flex-col gap-1">
            <h3 className="web:text-3xl text-lg font-semibold">Payment</h3>
            <div className="mt-2 flex flex-col gap-2 text-sm">
              <span className="web:text-lg text-xs text-grayscale-500">Date</span>
              <span className="text-sm text-grayscale-900">{formatDate(paymentData.created_at)}</span>
            </div>
            <div className="mt-2 flex flex-col gap-2">
              <span className="web:text-lg text-xs text-grayscale-500">Amount</span>
              <span className="web:text-lg text-sm text-grayscale-900">${paymentData.total_price.toFixed(2)}</span>
            </div>
            <div className="mt-2 flex flex-col gap-2">
              <span className="web:text-lg text-xs text-grayscale-500">Method</span>
              <span className="web:text-lg text-sm text-grayscale-900">Card</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
