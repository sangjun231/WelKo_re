'use client';

import React, { useEffect, useState } from 'react';
import useAuthStore from '@/zustand/bearsStore';
import * as PortOne from '@portone/browser-sdk/v2';
import usePostStore from '@/zustand/postStore';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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
  buyer: {
    email: string;
  };
}

const SelectUser = () => {
  const { user } = useAuthStore();
  const post = usePostStore((state) => state.post);
  const [result, setResult] = useState<any>(null);
  const [numPersons, setNumPersons] = useState(1);
  const [totalAmount, setTotalAmount] = useState(post ? post.price : 0);
  const router = useRouter();

  useEffect(() => {
    if (post) {
      setTotalAmount(post.price * numPersons);
    }
  }, [numPersons, post]);

  useEffect(() => {
    if (post) {
      const requestData: RequestData = {
        uiType: 'PAYPAL_SPB',
        storeId: process.env.NEXT_PUBLIC_POSTONE_STORE_ID || '',
        channelKey: process.env.NEXT_PUBLIC_POSTONE_CHANNEL_KEY || '',
        paymentId: `payment-${crypto.randomUUID()}`,
        orderName: post.title,
        totalAmount: totalAmount,
        currency: 'CURRENCY_USD',
        payMethod: 'paypal',
        windowType: { type: 'UI' },
        buyer: {
          email: user ? user.email : 'test@example.com'
        }
      };

      PortOne.loadPaymentUI(requestData, {
        onPaymentSuccess: async (response) => {
          setResult(response);
          console.log('Payment Success:', response);

          // 결제 정보 저장
          try {
            const saveResponse = await axios.post('/api/savePayment', {
              user_id: user?.id,
              post_id: post.id,
              transaction_id: response.txId,
              payment_id: response.paymentId,
              total_amount: totalAmount
            });
            console.log('Payment saved:', saveResponse.data);

            // 결제 내역 페이지로 리디렉션
            router.push(`/payment-success/${response.paymentId}`);
          } catch (error) {
            console.error('Error saving payment:', error);
          }
        },
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
