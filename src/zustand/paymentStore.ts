import { create } from 'zustand';
import * as PortOne from '@portone/browser-sdk/v2';
import axios from 'axios';

interface PaymentState {
  totalAmount: number;
  setTotalAmount: (amount: number) => void;
}

const usePaymentStore = create<PaymentState>((set) => ({
  totalAmount: 0,
  setTotalAmount: (amount) => set({ totalAmount: amount })
}));

export const requestPayment = async (
  post: any,
  user: any,
  totalAmount: number,
  handlePaymentSuccess: (response: any) => Promise<void>,
  handlePaymentFailure: (error: any) => Promise<void>
) => {
  const totalAmountInCents = totalAmount * 1000;

  // 사용자가 모바일인지 확인
  const isMobile = window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent);

  try {
    const response = await PortOne.requestPayment({
      storeId: process.env.NEXT_PUBLIC_POSTONE_STORE_ID || '',
      channelKey: process.env.NEXT_PUBLIC_POSTONE_KG_CHANNEL_KEY || '',
      paymentId: `payment${crypto.randomUUID().split('-')[0]}`,
      orderName: post.title,
      totalAmount: totalAmountInCents,
      currency: 'CURRENCY_KRW',
      payMethod: 'CARD',
      customer: {
        fullName: user?.name || 'Unknown',
        phoneNumber: user?.phone || '010-0000-0000',
        email: user?.email || 'test@portone.io'
      },
      bypass: isMobile
        ? {
            inicis_v2: {
              logo_url: 'https://portone.io/assets/portone.87061e94.avif',
              logo_2nd: 'https://admin.portone.io/assets/img/auth/lock.png',
              P_CARD_OPTION: 'selcode=14',
              P_MNAME: '포트원',
              P_RESERVED: ['below1000=Y', 'noeasypay=Y', 'global_visa3d=Y']
            }
          }
        : {
            inicis_v2: {
              logo_url: 'https://portone.io/assets/portone.87061e94.avif',
              logo_2nd: 'https://admin.portone.io/assets/img/auth/lock.png',
              parentemail: 'parentemail',
              Ini_SSGPAY_MDN: '01012341234',
              acceptmethod: ['SKIN(#BA68C8)', 'below1000', 'noeasypay'],
              P_CARD_OPTION: 'selcode=14',
              P_MNAME: '포트원',
              P_RESERVED: ['below1000=Y', 'noeasypay=Y']
            }
          },
      locale: 'EN_US',
      redirectUrl: '' // 이 부분은 빈 문자열로 초기화
    });

    if (response?.code != null) {
      await handlePaymentFailure(response);
    } else {
      // 현재 도메인을 가져와서 redirectUrl 설정
      const currentOrigin = window.location.origin;
      const finalRedirectUrl = `${currentOrigin}/detail/payment?txId=${response?.txId}`;

      // 모바일 결제의 경우, 서버에 데이터를 저장하는 로직을 추가
      if (isMobile) {
        try {
          // 결제 완료 후 데이터를 서버에 저장
          const paymentData = {
            id: response?.txId,
            user_id: user.id,
            post_id: post.id,
            pay_state: response?.paymentId,
            total_price: totalAmount
          };

          await axios.post('/api/detail/payment', paymentData);
        } catch (error) {
          console.error('Error saving payment data on mobile:', error);
          alert('결제 데이터 저장에 실패했습니다.');
          return;
        }
      }

      await handlePaymentSuccess({ ...response, redirectUrl: finalRedirectUrl });
    }
  } catch (error) {
    console.error('Payment request error:', error);
    alert('결제 요청 중 오류가 발생했습니다.');
  }
};

export default usePaymentStore;
