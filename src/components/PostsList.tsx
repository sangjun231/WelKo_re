'use client';
import { useEffect, useState } from 'react';
import { createClient } from '../utils/supabase/client'; // Supabase 클라이언트 임포트

const supabase = createClient();

const PostsList = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*');

      if (error) {
        setError('데이터를 가져오는 중 오류가 발생했습니다.');
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">게시물 목록</h2>
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
