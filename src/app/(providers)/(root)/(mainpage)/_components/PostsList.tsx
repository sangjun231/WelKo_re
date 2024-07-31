'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import InfiniteScroll from '@/components/common/InfiniteScroll/InfiniteScroll';
import Image from 'next/image';
import Link from 'next/link';

const supabase = createClient();

const POSTS_PER_PAGE = 5;

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('latest');
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const orderBy = sortOrder === 'latest' ? 'created_at' : 'recommendations';
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order(orderBy, { ascending: false })
        .range((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE - 1);

      if (error) {
        setError('데이터를 가져오는 중 오류가 발생했습니다.');
        console.error('Error fetching posts:', error);
      } else {
        if (page === 1) {
          setPosts(data || []);
        } else {
          setPosts(prevPosts => [...prevPosts, ...(data || [])]);
        }
        setHasMore(data && data.length === POSTS_PER_PAGE);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [sortOrder, page]);

  const loadMorePosts = () => {
    setPage(prevPage => prevPage + 1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">게시물 목록</h2>
      <InfiniteScroll loading={loading} hasMore={hasMore} onLoadMore={loadMorePosts}>
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
      </InfiniteScroll>
      {loading && <div>로딩 중...</div>}
      {error && <div>리스트를 불러오지 못했습니다</div>}
    </div>
  );
};

export default PostsList;
