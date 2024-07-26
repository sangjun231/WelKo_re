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
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      });
    }
  }, [id, fetchPost]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!paymentData) {
    return <div>No payment data found.</div>;
  }

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
      <div>
        <Link href="/" className="border">
          홈 화면 바로가기
        </Link>
        <Link href={`/mypage/`} className="border">
          {/* 추후 경로에 따라 수정 예정*/}
          마이페이지로 이동
        </Link>
      </div>
    </div>
  );
}
