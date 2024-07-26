'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import InfiniteScroll from '@/components/common/InfiniteScroll/InfiniteScroll';

const supabase = createClient();

const POSTS_PER_PAGE = 3;

const PostsList = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('latest'); // 기본값은 최신순
  const [page, setPage] = useState<number>(1); // 현재 페이지 번호
  const [hasMore, setHasMore] = useState<boolean>(true); // 더 많은 데이터가 있는지 확인

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const orderBy = sortOrder === 'latest' ? 'created_at' : 'recommendations';
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order(orderBy, { ascending: false }) // 내림차순 정렬
        .range((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE - 1); // 페이지 범위 설정

      if (error) {
        setError('데이터를 가져오는 중 오류가 발생했습니다.');
        console.error('Error fetching posts:', error);
      } else {
        setPosts(prevPosts => [...prevPosts, ...(data || [])]);
        setHasMore(data && data.length === POSTS_PER_PAGE);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [sortOrder, page]); // sortOrder나 page가 변경될 때마다 데이터 다시 가져오기

  const handleSortChange = (order: string) => {
    setSortOrder(order);
    setPage(1);
    setPosts([]);
  };

  const loadMorePosts = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">게시물 목록</h2>
      <div className="flex justify-end mb-4">
        <button
          className={`px-4 py-2 mx-2 ${sortOrder === 'latest' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleSortChange('latest')}
        >
          최신순
        </button>
        <button
          className={`px-4 py-2 mx-2 ${sortOrder === 'recommended' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleSortChange('recommended')}
        >
          추천순
        </button>
      </div>
      <InfiniteScroll loading={loading} hasMore={hasMore} onLoadMore={loadMorePosts}>
        <ul>
          {posts.map((post, index) => (
            <li key={`${post.id}-${index}`} className="mb-4 border p-2 rounded-md">
              <h3 className="font-bold">{post.title}</h3>
              <p>{post.content}</p>
            </li>
          ))}
        </ul>
      </InfiniteScroll>
      {loading && <div>로딩 중...</div>}
      {error && <div>{error}</div>}
      {!loading && !hasMore && <div>더 이상 데이터가 없습니다.</div>}
    </div>
  );
};

export default PostsList;
