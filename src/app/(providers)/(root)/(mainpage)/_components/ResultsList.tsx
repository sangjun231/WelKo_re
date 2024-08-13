'use client';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Search from '@/components/common/Search/Search';
import Link from 'next/link';

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

const formatDate = (date: Date | null): string => {
  if (!date) return '';
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}.${month}.${day}`;
};

export default function ResultsList({ posts, loading, error }: ResultsListProps) {
  const searchParams = useSearchParams();
  const tags = searchParams.get('tags') ? JSON.parse(searchParams.get('tags') as string) : [];
  const city = searchParams.get('city') || '';
  const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate') as string) : null;
  const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate') as string) : null;

  const formatTags = () => {
    if (tags.length === 0) return 'Any Tag';
    return tags.length > 1 ? `${tags[0]} + ${tags.length - 1}` : tags[0];
  };

  const selection = [
    formatTags(),
    `${city || 'Any City'} ・ ${startDate && endDate ? `${formatDate(startDate)} ~ ${formatDate(endDate)}` : 'Any Date'}`
  ].join('\n');

  return (
    <div className="p-4">
      <Search initialQuery={selection} style={{ paddingTop: '8px', lineHeight: '20px', fontWeight: 500 }} />
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!loading && posts.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-2 text-center">
          <Image src="/icons/tabler-icon-list-search.svg" alt="search list image" width={44} height={44} />
          <div className="text-sm font-semibold">No posts found</div>
          <div className="w-[213px] text-xs font-normal">Try to search by changing the date and region</div>
        </div>
      )}

      <ul className="mt-5">
        {posts.map((post, index) => (
          <li key={`${post.id}-${index}`} className="flex rounded-md p-2">
            <Link href={`/detail/${post.id}`} className="flex w-full">
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.title}
                  width={96}
                  height={96}
                  className="mr-2 h-[100px] w-[80px] rounded-lg"
                />
              ) : (
                <div className="mr-2 flex h-24 w-24 items-center justify-center bg-gray-200">No Image</div>
              )}
              <div className="flex flex-col">
                <div>
                  <h3 className="line-clamp-1 text-sm font-semibold">{post.title}</h3>
                  <p className="mt-1 text-gray-500">
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
                <div className="mt-1 flex text-sm">
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
