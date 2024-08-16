import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import InfiniteScroll from '@/components/common/InfiniteScroll/InfiniteScroll';

const supabase = createClient();
const POSTS_PER_PAGE = 5;
const MAX_POSTS = 10; // 최대 포스트 개수

interface Post {
  startDate: string;
  endDate: string;
  id: string;
  title: string;
  content: string;
  created_at: string;
  recommendations: number;
  image: string;
  price: number;
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('ko', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit'
  })
    .format(new Date(date))
    .replace(/\//g, '.');
};

const PostsList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('latest');
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const scrollLeft = useRef<number>(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const orderBy = sortOrder === 'latest' ? 'created_at' : 'recommendations';
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order(orderBy, { ascending: false })
          .range((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE - 1);

        if (error) {
          throw error;
        }

        const newPosts = data || [];
        const totalPosts = posts.length + newPosts.length;

        if (totalPosts >= MAX_POSTS) {
          setPosts((prevPosts) => [...prevPosts, ...newPosts.slice(0, MAX_POSTS - prevPosts.length)]);
          setHasMore(false); // 더 이상 포스트를 로드하지 않음
        } else {
          setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        }
      } catch (error) {
        setError('데이터를 가져오는 중 오류가 발생했습니다.');
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [sortOrder, page]);

  const loadMorePosts = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (scrollContainerRef.current) {
        isDragging.current = true;
        startX.current = e.touches[0].clientX - scrollContainerRef.current.getBoundingClientRect().left;
        scrollLeft.current = scrollContainerRef.current.scrollLeft;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging.current && scrollContainerRef.current) {
        e.preventDefault(); // prevent default to avoid scrolling while dragging
        const x = e.touches[0].clientX - scrollContainerRef.current.getBoundingClientRect().left;
        const walk = (x - startX.current) * 2; // Scroll speed factor
        scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
      }
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd);

      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, []);

  return (
    <div className="relative">
      <h2 className="mb-5 text-xl font-bold">New Tour</h2>
      <div className="overflow-hidden">
        {/* 모바일에서 InfiniteScroll을 사용하여 무한 스크롤 구현 */}
        <div className="block md:hidden">
          <InfiniteScroll loading={loading} hasMore={hasMore} onLoadMore={loadMorePosts}>
            <div className="relative overflow-hidden" ref={scrollContainerRef}>
              <div className="flex space-x-1">
                {posts.map((post, index) => (
                  <div key={`${post.id}-${index}`} className="w-64 flex-none rounded-md">
                    <Link href={`/detail/${post.id}`} className="flex h-full flex-col">
                      {post.image ? (
                        <div
                          className="relative mb-2 flex-none overflow-hidden rounded-2xl"
                          style={{ width: '236px', height: '236px' }}
                        >
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-2xl"
                          />
                        </div>
                      ) : (
                        <div className="mb-2 flex h-[236px] w-[236px] items-center justify-center rounded-2xl bg-gray-200">
                          이미지 없음
                        </div>
                      )}
                      <div className="flex flex-grow flex-col">
                        <h3 className="mb-1 line-clamp-1 text-base font-semibold">{post.title}</h3>
                        <p className="tracking-[-0.1em] text-gray-500">
                          {post.startDate && post.endDate
                            ? `${formatDate(post.startDate)} ~ ${formatDate(post.endDate)}`
                            : 'No dates available'}
                        </p>
                        <div className="mt-1 flex text-sm">
                          <div className="mt-auto line-clamp-1 font-bold text-[#B95FAB]">{formatPrice(post.price)}</div>
                          <div className="font-medium">/Person</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </InfiniteScroll>
        </div>
        {/* 데스크탑에서 포스터 8개만 표시 */}
        <div className="hidden md:grid md:grid-cols-4">
          {posts.slice(0, 8).map((post, index) => (
            <div key={`${post.id}-${index}`} className="w-[286px]">
              <Link href={`/detail/${post.id}`} className="flex h-full flex-col">
                {post.image ? (
                  <div
                    className="relative mb-2 overflow-hidden rounded-2xl"
                    style={{ width: '286px', height: '286px' }}
                  >
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-2xl"
                    />
                  </div>
                ) : (
                  <div className="mb-2 flex h-[236px] items-center justify-center rounded-2xl bg-gray-200">
                    이미지 없음
                  </div>
                )}
                <div className="flex flex-grow flex-col">
                  <h3 className="mb-1 line-clamp-1 text-base font-semibold">{post.title}</h3>
                  <p className="tracking-[-0.1em] text-gray-500">
                    {post.startDate && post.endDate
                      ? `${formatDate(post.startDate)} ~ ${formatDate(post.endDate)}`
                      : 'No dates available'}
                  </p>
                  <div className="mt-1 flex text-sm">
                    <div className="mt-auto line-clamp-1 font-bold text-[#B95FAB]">{formatPrice(post.price)}</div>
                    <div className="font-medium">/Person</div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostsList;
