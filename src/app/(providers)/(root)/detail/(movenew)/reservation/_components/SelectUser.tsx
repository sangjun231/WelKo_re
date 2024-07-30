'use client';

import React, { useEffect, useState, useCallback } from 'react';
import useAuthStore from '@/zustand/bearsStore';
import usePostStore from '@/zustand/postStore';
import axios from 'axios';
import * as PortOne from '@portone/browser-sdk/v2';
import { useRouter } from 'next/navigation';

const SelectUser = () => {
  const user = useAuthStore((state) => state.user);
  const post = usePostStore((state) => state.post);
  const router = useRouter();
  const [numPersons, setNumPersons] = useState(1);
  const [totalAmount, setTotalAmount] = useState(post ? post.price : 0);

  useEffect(() => {
    if (post) {
      setTotalAmount(post.price * numPersons);
    }
  }, [numPersons, post]);

  const handlePaymentSuccess = useCallback(
    async (response: any) => {
      if (response.txId && response.paymentId) {
        const paymentData = {
          id: response.txId, // 고유 트랜잭션 ID
          user_id: user?.id, // 로그인한 사용자 ID
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
    [router, user?.id, post?.id, totalAmount]
  );

  // 결제 실패 시 호출되는 함수
  const handlePaymentFailure = useCallback(
    async (error: any) => {
      console.error('Payment failed:', error);
      router.push(`/reservation/${post?.id}`);
    },
    [router, post?.id]
  );

  // 결제 요청을 실행하는 함수
  const requestPayment = useCallback(async () => {
    if (!post) return;

    const totalAmountInCents = totalAmount * 100;
    try {
      const response = await PortOne.requestPayment({
        storeId: process.env.NEXT_PUBLIC_POSTONE_STORE_ID || '',
        channelKey: process.env.NEXT_PUBLIC_POSTONE_KG_CHANNEL_KEY || '',
        paymentId: `payment${crypto.randomUUID().split('-')[0]}`, // 고객사 주문 고유 번호
        orderName: post.title, // 주문명
        totalAmount: totalAmountInCents, // 결제 금액 (센트 단위)
        currency: 'CURRENCY_USD', // 결제 통화
        payMethod: 'CARD', // 결제수단 구분코드
        customer: {
          fullName: user?.name || 'Unknown', // 구매자 전체 이름
          phoneNumber: user?.phone || '010-0000-0000', // 구매자 연락처
          email: user?.email || 'test@portone.io' // 구매자 이메일
        },
        bypass: {
          inicis_v2: {
            logo_url: 'https://portone.io/assets/portone.87061e94.avif', // 결제창에 삽입할 메인 로고 URL
            logo_2nd: 'https://admin.portone.io/assets/img/auth/lock.png', // 결제창에 삽입할 서브 로고 URL
            parentemail: 'parentemail', // 보호자 이메일 주소
            Ini_SSGPAY_MDN: '01012341234', // SSGPAY 결제 요청 시 PUSH 전송 휴대폰 번호
            acceptmethod: ['SKIN(#BA68C8)', 'below1000'], // 결제창 색상 및 1000원 미만 결제 허용 옵션
            P_CARD_OPTION: 'selcode=14',
            P_MNAME: '포트원', // 결제 페이지에 표시될 가맹점 이름
            P_RESERVED: ['below1000=Y', 'noeasypay=Y'] // 1000원 미만 결제 허용 옵션 및 간편 결제 미노출 옵션
          }
        },
        locale: 'EN_US'
      });

      if (response?.code != null) {
        await handlePaymentFailure(response);
      } else {
        await handlePaymentSuccess(response);
      }
    } catch (error) {
      console.error('Payment request error:', error);
      alert('결제 요청 중 오류가 발생했습니다.');
      router.back();
    }
  }, [post, user, totalAmount, router, handlePaymentFailure, handlePaymentSuccess]);

  if (!post) return <div>Loading...</div>;

  // 예약 인원 입력 필드 변경 시 호출되는 함수
  const handleNumPersonsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setNumPersons(value > 0 ? value : 1); // 최소 예약 인원은 1명
  };

  return (
    <div>
      <div>
        <h3 className="font-bold">예약 인원</h3>
        <input
          type="number"
          className="my-6 w-16 border-b-2 p-1"
          min="1"
          value={numPersons}
          onChange={handleNumPersonsChange}
        />
        명<h5>투어 인원을 초과한 경우 예약이 취소될 수 있습니다. 판매자에게 먼저 문의 후 결제 바랍니다.</h5>
      </div>
      <div>
        <h3 className="font-bold">예약자 정보</h3>
        <div className="border">{user ? user.email : '로그인 정보가 없습니다.'}</div>
      </div>
      <div>
        <h3 className="font-bold">예약 약관</h3>
        <h5>
          투어 인원을 초과한 경우 예약이 취소될 수 있습니다. 판매자에게 먼저 문의 후 결제 바랍니다. 투어 인원을 초과한
          경우 예약이 취소될 수 있습니다. 판매자에게 먼저 문의 후 결제 바랍니다. 투어 인원을 초과한 경우 예약이 취소될
          수 있습니다. 판매자에게 먼저 문의 후 결제 바랍니다.
        </h5>
      </div>
      <div>
        <h3 className="font-bold">전체 금액</h3>
        <p className="font-bold">${totalAmount.toFixed(2)}</p>
      </div>
      <div>
        <button className="border" onClick={requestPayment}>
          결제하기
        </button>
      </div>
    </div>
  );
};

export default SelectUser;
