'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Search({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (query.length < 1) {
      alert('검색어를 입력해주세요.');
      return;
    }
    router.push(`/search?keyword=${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative mx-auto w-full max-w-md">
      <form onSubmit={handleSearch}>
        <button type="submit">
          <Image
            src="/icons/search.png"
            alt="Search icon"
            width={20}
            height={20}
            className="absolute right-6 top-1/2 transform"
          />
        </button>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="여행지를 검색해보세요"
          className="ml-2 mr-4 w-full rounded-full border-2 border-black px-5 py-4 text-black focus:border-gray-200 focus:bg-gray-200 focus:outline-none"
        />
      </form>
    </div>
  );
}
