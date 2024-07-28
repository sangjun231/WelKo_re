import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import axios, { AxiosError } from 'axios';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { id } = params;

  const { data, error } = await supabase.from('payments').select('*').eq('id', id).single();

  if (error) {
    console.error('Error fetching payment data:', error);
    return NextResponse.json({ error: 'Error fetching payment data' }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { id } = params;
  const { reason, requester } = await request.json();

  // 결제 정보를 가져옵니다.
  const { data: paymentData, error: paymentError } = await supabase.from('payments').select('*').eq('id', id).single();

  if (paymentError) {
    console.error('Error fetching payment data:', paymentError);
    return NextResponse.json({ error: 'Error fetching payment data' }, { status: 500 });
  }

  try {
    // PortOne 결제 취소 요청 API 호출
    const cancelResponse = await axios.post(
      `https://api.portone.io/payments/${paymentData.pay_state}/cancel`,
      {
        storeId: process.env.NEXT_PUBLIC_POSTONE_STORE_ID || '',
        reason: reason,
        requester: requester || 'CUSTOMER'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `PortOne ${process.env.NEXT_PUBLIC_PORTONE_SECRET_KEY}`
        }
      }
    );

    const responseData = cancelResponse.data;

    if (responseData.status === 'FAILED') {
      // 환불 실패 시 처리
      return NextResponse.json({ message: 'Refund failed', error: responseData.reason }, { status: 400 });
    } else {
      // 환불 성공 시 처리 (예: 데이터베이스 업데이트)
      const { error: cancelError } = await supabase.from('payments').update({ pay_state: 'cancel' }).eq('id', id);

      if (cancelError) {
        console.error('Error saving cancel data:', cancelError);
        return NextResponse.json({ error: 'Error saving cancel data' }, { status: 500 });
      }

      return NextResponse.json({ message: 'Cancel successful', data: responseData }, { status: 200 });
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Refund request failed:', axiosError);
    return NextResponse.json({ message: 'Cancel request failed', error: axiosError.message }, { status: 500 });
  }
}
