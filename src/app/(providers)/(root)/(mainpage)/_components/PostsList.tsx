'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LikeBtn from '/public/icons/tabler-icon-post-heart.svg';
import { createClient } from '@/utils/supabase/client';
import { useLikeStore } from '@/zustand/likeStore';
import usePostStore from '@/zustand/postStore';
import useAuthStore from '@/zustand/bearsStore';

const supabase = createClient();

interface Post {
  id: string;
  title: string;
  content?: string;
  startDate?: string;
  endDate?: string;
  recommendations?: number;
  image?: string;
  price: number;
  tags?: string[];
  created_at: string;
}

const NewPostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) => `$${price}`;
  const formatDate = (date: string) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat('ko', {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric'
    }).format(d);
  };

  const user = useAuthStore((state) => state.user);
  const { fetchPost, post } = usePostStore((state) => ({
    fetchPost: state.fetchPost,
    post: state.post
  }));
  const { liked, fetchLikeStatus, toggleLike } = useLikeStore((state) => ({
    liked: state.liked,
    fetchLikeStatus: state.fetchLikeStatus,
    toggleLike: state.toggleLike
  }));

  const handleLike = () => {
    if (post?.id && user?.id) {
      toggleLike(post.id, user.id);
    }
  };

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(8);

        if (postsError) throw postsError;

        setPosts(postsData || []);
      } catch (err) {
        setError('포스트를 가져오는 중 문제가 발생했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPosts();
  }, []);

  return (
    <div className="mt-[40px] md:mt-[160px]">
      <h2 className="text-xl font-bold md:mb-10 md:text-4xl">New Tour</h2>
      <ul className="mt-5 lg:flex lg:flex-wrap lg:gap-5">
        {posts.map((post, index) => (
          <li key={`${post.id}-${index}`} className="mb-4 flex rounded-md lg:mb-0 lg:w-[calc(50%-10px)] lg:p-0">
            <Link href={`/detail/${post.id}`} className="flex max-w-[460px]">
              {post.image ? (
                <div>
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={120}
                    height={140}
                    className="mr-2 h-[100px] w-[80px] rounded-lg md:mr-4 md:h-[140px] md:w-[120px]"
                  />
                  {/* <button
                    onClick={handleLike}
                    className="absolute right-1 top-2 rounded-full bg-[rgba(255,255,255,0.10)] p-0.5 backdrop-blur-[10px]"
                  >
                    {liked ? (
                      <LikeBtn width={20} height={20} color="#FF7029" fill="#FF7029" />
                    ) : (
                      <LikeBtn width={20} height={20} color="white" />
                    )}
                  </button> */}
                </div>
              ) : (
                <div className="mr-2 flex h-24 w-24 items-center justify-center bg-gray-200">No Image</div>
              )}
              <div className="flex flex-col">
                <div>
                  <h3 className="line-clamp-1 text-sm font-semibold md:line-clamp-2 md:text-[21px] md:leading-7">
                    {post.title}
                  </h3>
                  <p className="mt-1 tracking-[-0.1em] text-gray-500 md:mt-2 md:text-lg">
                    {post.startDate && post.endDate
                      ? `${new Intl.DateTimeFormat('ko', {
                          year: '2-digit',
                          month: 'numeric',
                          day: 'numeric'
                        }).format(new Date(post.startDate))} ~ ${new Intl.DateTimeFormat('ko', {
                          year: '2-digit',
                          month: 'numeric',
                          day: 'numeric'
                        }).format(new Date(post.endDate))}`
                      : 'No dates available'}
                  </p>
                </div>
                <div className="mt-1 flex text-sm md:mt-2 md:text-lg">
                  <div className="font-bold text-[#B95FAB]">{formatPrice(post.price)}</div>
                  <div className="font-medium">/Person</div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewPostList;
