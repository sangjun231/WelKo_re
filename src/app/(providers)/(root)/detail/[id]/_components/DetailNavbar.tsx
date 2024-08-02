'use client';

import React, { useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuthStore from '@/zustand/bearsStore';
import usePostStore from '@/zustand/postStore';
import usePaymentStore, { requestPayment } from '@/zustand/paymentStore';
import { formatDateRange } from '@/utils/detail/functions';
import axios from 'axios';

const DetailNavbar = () => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const { post } = usePostStore((state) => ({
    post: state.post
  }));
  const { totalAmount } = usePaymentStore((state) => ({
    totalAmount: state.totalAmount
  }));

  const handlePaymentSuccess = useCallback(
    async (response: any) => {
      if (response.txId && response.paymentId) {
        const paymentData = {
          id: response.txId, // 고유 트랜잭션 ID
          user_id: user?.id, // 로그인한 사용자 ID
          user_email: user?.email,
          post_id: post?.id, // 결제한 게시물 ID
          pay_state: response.paymentId, // 결제 서비스 제공자에서 생성한 고유 결제 ID
          total_price: totalAmount // 총 결제 금액
        };
        try {
          // // 실제로 데이터 저장 요청에 실패시키기 위해 존재하지 않는 URL로 요청을 보냄
          // await axios.post('/api/non-existent-url', paymentData);

          // 결제 내역을 서버에 저장
          await axios.post('/api/detail/payment', paymentData);
          // 결제 완료 페이지로 이동
          router.push(`/detail/payment/${response.txId}`);
        } catch (error) {
          // 결제 실패 처리
          try {
            await axios.post(`/api/detail/autocancel`, {
              paymentId: response.paymentId,
              reason: 'Data save failed',
              requester: 'CUSTOMER'
            });
            alert('결제 데이터 저장에 실패하여 자동으로 환불 처리되었습니다.');
          } catch (cancelError) {
            alert('결제 데이터 저장에 실패했으며, 환불 처리에도 실패했습니다. 관리자에게 문의하세요.');
          }
          router.back();
        }
      } else {
        console.error('Invalid payment response:', response);
        router.back();
      }
    },
    [router, user?.id, user?.email, post?.id, totalAmount]
  );

  // 결제 실패 시 호출되는 함수
  const handlePaymentFailure = useCallback(
    async (error: any) => {
      console.error('Payment failed:', error);
      router.push(`/detail/${post?.id}`);
    },
    [router, post?.id]
  );

  // 결제 요청을 실행하는 함수
  const handlePaymentClick = () => {
    if (post && user) {
      requestPayment(post, user, totalAmount, handlePaymentSuccess, handlePaymentFailure);
    }
  };

  const handleReserveClick = () => {
    if (!user) {
      alert('로그인이 필요한 서비스입니다!!');
      router.push('/login');
    } else {
      router.push(`/detail/reservation/${post?.id}`);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 z-10 w-full bg-white">
      {pathname.includes('reservation') ? (
        <div className="shadow-custom-navbar border-t-1 border-grayscale-100 mx-auto max-w-[360px] py-4">
          <div className="mx-auto flex max-w-[320px] items-center">
            <div className="flex flex-1 flex-col justify-center">
              <div className="flex items-center text-lg">
                <span className="text-grayscale-900 font-semibold">${totalAmount.toFixed(2)}</span>
                <span className="text-grayscale-600 font-medium">/Total</span>
              </div>
              <div className="flex justify-start">
                <p className="text-grayscale-900 text-xs font-medium">
                  {formatDateRange(post?.startDate ?? null, post?.endDate ?? null)}
                </p>
              </div>
            </div>
            <button
              onClick={handlePaymentClick}
              className="bg-primary-300 w-40 flex-1 rounded-xl py-2 text-base font-semibold text-white"
            >
              Confirm and Pay
            </button>
          </div>
        </div>
      ) : (
        <div className="shadow-custom-navbar border-t-1 border-grayscale-100 mx-auto max-w-[360px] py-4">
          <div className="mx-auto flex max-w-[320px] items-center justify-between">
            <div className="flex flex-col justify-center">
              <div className="flex items-center text-lg">
                <span className="text-primary-300 font-semibold">${post?.price}</span>
                <span className="text-grayscale-600 font-medium">/Person</span>
              </div>
              <div className="flex justify-start">
                <p className="text-grayscale-900 text-xs font-medium">
                  {formatDateRange(post?.startDate ?? null, post?.endDate ?? null)}
                </p>
              </div>
            </div>
            <button
              onClick={handleReserveClick}
              className="bg-primary-300 w-40 rounded-xl px-4 py-2 text-base font-semibold text-white"
            >
              Reserve
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailNavbar;
