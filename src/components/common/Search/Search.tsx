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

  const handleInputClick = () => {
    router.push('/planner');
  };

  return (
    <div className="relative mx-auto w-full max-w-md">
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
        onClick={handleInputClick}
        placeholder="Search your tour in KOREA"
        className="ml-2 mr-4 w-full rounded-full border-2 border-black px-5 py-4 text-black focus:border-gray-200 focus:bg-gray-200 focus:outline-none"
      />
    </div>
  );
}
