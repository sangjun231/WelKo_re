import Link from 'next/link';
import Image from 'next/image';
import Search from '@/components/common/Search/Search';

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

interface ResultsListProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

export default function ResultsList({ posts, loading, error }: ResultsListProps) {
  return (
    <div className="p-4">
      <Search />
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!loading && posts.length === 0 && <div>No posts found</div>}
      <ul className="mt-5">
        {posts.map((post) => (
          <li key={post.id} className="mb-4 flex rounded-md p-2">
            <Link href={`/detail/${post.id}`} className="flex w-full">
              {post.image ? (
                <Image src={post.image} alt={post.title} width={96} height={96} className="mr-2 w-24" />
              ) : (
                <div className="mr-2 flex h-24 w-24 items-center justify-center bg-gray-200">No Image</div>
              )}
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="line-clamp-1 text-sm font-semibold">{post.title}</h3>
                  <p className="text-gray-500">
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
                <div className="mt-2 flex text-sm">
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
}
