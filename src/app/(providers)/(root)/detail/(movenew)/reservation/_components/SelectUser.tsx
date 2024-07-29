'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/zustand/bearsStore';
import usePostStore from '@/zustand/postStore';
import * as PortOne from '@portone/browser-sdk/v2';

interface RequestData {
  uiType: 'PAYPAL_SPB';
  storeId: string;
  channelKey: string;
  paymentId: string;
  orderName: string;
  totalAmount: number;
  currency: 'CURRENCY_USD';
  payMethod: 'paypal';
  windowType: { type: 'UI' };
}

const SelectUser = () => {
  const user = useAuthStore((state) => state.user);
  const post = usePostStore((state) => state.post);
  const router = useRouter();
  const [result, _] = useState<any>(null);
  const [numPersons, setNumPersons] = useState(1);
  const [totalAmount, setTotalAmount] = useState(post ? post.price : 0);

  useEffect(() => {
    if (post) {
      setTotalAmount(post.price * numPersons);
    }
  }, [numPersons, post]);

  useEffect(() => {
    if (post) {
      const handlePaymentSuccess = async (response: any) => {
        try {
          const paymentData = {
            id: response.txId, // 고유 트랜잭션 ID
            user_id: user?.id, // 로그인한 사용자 ID
            post_id: post.id, // 결제한 게시물 ID
            pay_state: response.paymentId, // 결제 서비스 제공자에서 생성한 고유 결제 ID
            total_price: totalAmount // 총 결제 금액
          };

          console.log('Payment data to save:', paymentData); // 저장할 데이터 로그 출력

          const saveResponse = await axios.post('/api/detail/payment', paymentData);
          console.log('Payment saved:', saveResponse.data);

          router.push(`/payment/success/${response.paymentId}`);
        } catch (error) {
          console.error('Error saving payment data:', error); // 클라이언트 에러 로그 출력
        }
      };

      const requestData: RequestData = {
        uiType: 'PAYPAL_SPB',
        storeId: process.env.NEXT_PUBLIC_POSTONE_STORE_ID || '',
        channelKey: process.env.NEXT_PUBLIC_POSTONE_CHANNEL_KEY || '',
        paymentId: `payment-${crypto.randomUUID()}`,
        orderName: post.title,
        totalAmount: totalAmount * 100, // 금액을 센트 단위로 변환
        currency: 'CURRENCY_USD',
        payMethod: 'paypal',
        windowType: { type: 'UI' }
      };

      PortOne.loadPaymentUI(requestData, {
        onPaymentSuccess: handlePaymentSuccess,
        onPaymentFail: (error) => {
          console.error('Payment Failed:', error);
        }
      });
    }
  }, [post, totalAmount, user, router]);

  if (!post) return <div>Loading...</div>;

  const handleNumPersonsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setNumPersons(value > 0 ? value : 1); // 최소값을 1로 설정
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
        명<h5>투어 인원을 초과한 경우 예약이 취소될 수 있습니다. 판매자에게 먼저 문의 후 결제 바랍니다. </h5>
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
      <div className="portone-ui-container" style={{ minHeight: '100px' }}>
        {/* 이곳에 페이팔 버튼이 렌더링됩니다. */}
      </div>
      {result && <div>결제 결과: {JSON.stringify(result)}</div>}
    </div>
  );
};

export default SelectUser;
