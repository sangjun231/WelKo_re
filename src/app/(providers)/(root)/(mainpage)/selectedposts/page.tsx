'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import Link from 'next/link';

const supabase = createClient();

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  recommendations: number;
  image: string;
  price: number;
}

const PostsList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    const selectedCity = searchParams.get('city');
    const selectedThemes = searchParams.get('theme')?.split(',') || [];
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false }); // 최신순으로 정렬

    if (selectedCity) {
      query = query.ilike('title', `%${selectedCity}%`);
    }

    if (selectedThemes.length > 0) {
      query = query.in('theme', selectedThemes);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query;

    if (error) {
      setError('데이터를 가져오는 중 오류가 발생했습니다.');
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [searchParams]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="p-4">
      <button onClick={() => router.back()} className="mb-4">
        ← 
      </button>

      <h2 className="text-xl font-bold mb-4">Related Posts</h2>
      {loading && <div>로딩 중...</div>}
      {error && <div>{error}</div>}
      {!loading && posts.length === 0 && <div>관련된 게시물이 없습니다.</div>}
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="mb-4 border p-2 rounded-md flex">
            <Link href={`/detail/${post.id}`} className="flex w-full">
              {post.image ? (
                <Image src={post.image} alt={post.title} width={96} height={96} className="mr-2 w-24" />
              ) : (
                <div className="mr-2 w-24 h-24 bg-gray-200 flex items-center justify-center">
                  이미지 없음
                </div>
              )}
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xl">{post.title}</h3>
                  <p className="text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                  <p className="text-gray-700">{post.content}</p>
                </div>
                <div className="text-sm font-bold mt-2">{formatPrice(post.price)}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function SelectedPosts() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <PostsList />
    </Suspense>
  );
}
