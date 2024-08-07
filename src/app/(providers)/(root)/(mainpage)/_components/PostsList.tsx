import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import InfiniteScroll from '@/components/common/InfiniteScroll/InfiniteScroll';


const supabase = createClient();

const POSTS_PER_PAGE = 5;

interface Post {
  startDate: any;
  endDate: any;
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
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const itemRef = useRef<HTMLDivElement>(null); // Ref to measure item width

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

        if (page === 1) {
          setPosts(data || []);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...(data || [])]);
        }
        setHasMore(data && data.length === POSTS_PER_PAGE);
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
    setPage((prevPage) => prevPage + 1);
  };

  const handleNext = () => {
    if (currentIndex < posts.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else if (hasMore) {
      loadMorePosts();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    } else {
      // Go to the first item in the list
      setCurrentIndex(0);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const itemWidth = itemRef.current?.offsetWidth || 0;
  const shouldShowPrevButton = posts.length > 0 && currentIndex !== 0;

  return (
    <div className="p-4 relative">
      <h2 className="text-xl font-bold mb-4">게시물 목록</h2>
      <InfiniteScroll loading={loading} hasMore={hasMore} onLoadMore={loadMorePosts}>
      <div className="relative overflow-hidden">
        {shouldShowPrevButton && (
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full z-10"
          >
            &lt;
          </button>
        )}
        <div className="flex items-center overflow-hidden">
          <div
            className="flex space-x-4 transition-transform duration-300"
            style={{ transform: `translateX(-${currentIndex * itemWidth}px)` }}
          >
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex-none w-64 border p-2 rounded-md"
                ref={itemRef}
              >
                <Link href={`/detail/${post.id}`} className="flex flex-col h-full">
                  {post.image ? (
                    <div className="flex-none mb-2">
                      <Image 
                        src={post.image} 
                        alt={post.title} 
                        width={236} 
                        height={236} 
                        style={{ width: '236px', height: '236px', objectFit: 'cover' }} 
                      />
                    </div>
                  ) : (
                    <div className="w-[236px] h-[236px] bg-gray-200 flex items-center justify-center mb-2">
                      이미지 없음
                    </div>
                  )}
                  <div className="flex flex-col flex-grow">
                    <h3 className="font-bold text-xl mb-2 line-clamp-1">{post.title}</h3>
                    <p className="text-gray-500">
                      {post.startDate && post.endDate
                        ? `${new Date(post.startDate).toLocaleDateString()} ~ ${new Date(post.endDate).toLocaleDateString()}`
                        : 'No dates available'}
                    </p>
                    <p className="text-gray-700 mb-2 line-clamp-1">{post.content}</p>
                    <div className="text-sm font-bold mt-auto line-clamp-1">{formatPrice(post.price)}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={currentIndex >= posts.length - 1 && !hasMore}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full z-10"
          >
            &gt;
          </button>
        </div>
      </div>
      </InfiniteScroll>
      {loading && <div>로딩 중...</div>}
      {error && <div>리스트를 불러오지 못했습니다</div>}
    </div>
  );
};
export default PostsList;
