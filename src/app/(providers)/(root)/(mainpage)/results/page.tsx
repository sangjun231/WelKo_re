'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { addDays } from 'date-fns';

const supabase = createClient();

interface Post {
  id: string;
  title: string;
  content: string;
  startDate: string; // 시작 날짜
  endDate: string; // 종료 날짜
  recommendations: number;
  image: string;
  price: number;
  tags: string[];
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const selectedCity = searchParams.get('city');
  const selectedTags = searchParams.get('tags') ? JSON.parse(searchParams.get('tags') || '[]') : [];
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const fetchPosts = async () => {
    setLoading(true); // Ensure loading state is set at the beginning

    let query = supabase.from('posts').select('*').order('created_at', { ascending: false });

    if (selectedCity) {
      console.log('Selected City:', selectedCity);

      // schedule 테이블에서 선택된 도시와 일치하는 post_id 가져오기
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('schedule')
        .select('post_id')
        .ilike('area', `%${selectedCity}%`); // Use wildcard for matching

      if (scheduleError) {
        setError('Error fetching schedules');
        console.error('Error fetching schedules:', scheduleError);
        setLoading(false);
        return;
      }

      console.log('Schedule Data:', scheduleData);

      if (!scheduleData || scheduleData.length === 0) {
        console.log(`No schedules found for city: ${selectedCity}`);
        setPosts([]); // No posts if no schedules found
        setLoading(false);
        return;
      }

      const postIds = scheduleData.map((schedule) => schedule.post_id);
      console.log('Post IDs:', postIds);

      if (postIds.length > 0) {
        query = query.in('id', postIds);
      } else {
        console.log('No post IDs found, skipping query.in');
      }
    }

    if (startDate) {
      // 시작 날짜를 하루 늦추기
      const adjustedStartDate = addDays(new Date(startDate), 1).toISOString();
      query = query.gte('startDate', adjustedStartDate);
    }

    if (endDate) {
      // 종료 날짜를 하루 늦추기
      const adjustedEndDate = addDays(new Date(endDate), 1).toISOString();
      query = query.lte('endDate', adjustedEndDate);
    }

    const { data, error: postsError } = await query;

    if (postsError) {
      setError('Error fetching posts');
      console.error('Error fetching posts:', postsError);
    } else {
      const filteredPosts = data.filter((post: Post) => {
        let tagsArray = [];

        if (Array.isArray(post.tags)) {
          tagsArray = post.tags;
        } else if (typeof post.tags === 'string') {
          try {
            tagsArray = JSON.parse(post.tags);
          } catch (e) {
            console.error('Failed to parse tags:', e);
          }
        }

        return Array.isArray(tagsArray) && selectedTags.every((tag: any) => tagsArray.includes(tag));
      });

      setPosts(filteredPosts || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [searchParams]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Related Posts</h2>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!loading && posts.length === 0 && <div>No posts found</div>}
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="mb-4 flex rounded-md border p-2">
            <Link href={`/detail/${post.id}`} className="flex w-full">
              {post.image ? (
                <Image src={post.image} alt={post.title} width={96} height={96} className="mr-2 w-24" />
              ) : (
                <div className="mr-2 flex h-24 w-24 items-center justify-center bg-gray-200">No Image</div>
              )}
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="line-clamp-1 text-xl font-bold">{post.title}</h3>
                  <p className="text-gray-500">
                    {post.startDate && post.endDate
                      ? `${new Date(post.startDate).toLocaleDateString()} ~ ${new Date(post.endDate).toLocaleDateString()}`
                      : 'No dates available'}
                  </p>
                </div>
                <div className="mt-2 text-sm font-bold">{formatPrice(post.price)}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
