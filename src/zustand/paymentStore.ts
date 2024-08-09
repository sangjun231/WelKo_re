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
      storeId: process.env.NEXT_PUBLIC_POSTONE_STORE_ID || '', // 포트원에서 발급받은 스토어 ID
      channelKey: process.env.NEXT_PUBLIC_POSTONE_KG_CHANNEL_KEY || '', // 포트원에서 발급받은 채널 키
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
              logo_url: 'https://portone.io/assets/portone.87061e94.avif', // 결제창에 삽입할 메인 로고 URL
              logo_2nd: 'https://admin.portone.io/assets/img/auth/lock.png', // 결제창에 삽입할 서브 로고 URL
              parentemail: 'parentemail', // 보호자 이메일 주소
              Ini_SSGPAY_MDN: '01012341234', // SSGPAY 결제 요청 시 PUSH 전송 휴대폰 번호
              acceptmethod: ['SKIN(#BA68C8)', 'below1000', 'noeasypay'], // 결제창 색상 및 1000원 미만 결제 허용 옵션
              P_CARD_OPTION: 'selcode=14', // 카드 옵션
              P_MNAME: '포트원', // 결제 페이지에 표시될 가맹점 이름
              P_RESERVED: ['below1000=Y', 'noeasypay=Y'] // 1000원 미만 결제 허용 옵션 및 간편 결제 미노출 옵션
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
      const finalRedirectUrl = `${currentOrigin}/detail/payment/${response?.txId}`;

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

      // 최종적으로 리디렉션 URL을 포함한 성공 처리를 호출
      await handlePaymentSuccess({ ...response, redirectUrl: finalRedirectUrl });

      // 필요에 따라 사용자를 해당 URL로 리디렉션
      window.location.href = finalRedirectUrl;
    }
  } catch (error) {
    console.error('Payment request error:', error);
    alert('결제 요청 중 오류가 발생했습니다.');
  }
};

export default usePaymentStore;
