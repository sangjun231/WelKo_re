'use client';
import { useEffect, useState } from 'react';
import { createClient } from '../utils/supabase/client'; // Supabase 클라이언트 임포트

const supabase = createClient();

const PostsList = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('latest'); // 기본값은 최신순

  useEffect(() => {
    const fetchPosts = async () => {
      const orderBy = sortOrder === 'latest' ? 'created_at' : 'recommendations';
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order(orderBy, { ascending: false }); // 내림차순 정렬

      if (error) {
        setError('데이터를 가져오는 중 오류가 발생했습니다.');
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [sortOrder]); // sortOrder가 변경될 때마다 데이터 다시 가져오기

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleSortChange = (order: string) => {
    setSortOrder(order);
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
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="mb-4 border p-2 rounded-md">
            <h3 className="font-bold">{post.title}</h3>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsList;
