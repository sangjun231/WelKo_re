'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface HeaderSearchProps {
  style?: React.CSSProperties;
  className?: string;
}

export default function HeaderSearch({ style = {}, className }: HeaderSearchProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleInputClick = () => {
    router.push('/planner');
  };

  return (
    <div className={`relative mx-auto w-full max-w-md ${className}`} style={style}>
      <button type="button" onClick={handleInputClick} className="absolute right-4 top-1/2 -translate-y-1/2 transform">
        <Image src="/icons/search.png" alt="Search icon" width={20} height={20} />
      </button>
      <input
        value={query}
        onClick={handleInputClick}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search your tour in KOREA"
        className="h-[48px] w-full resize-none overflow-hidden rounded-full bg-[#F7F7F9] px-4 py-2 text-sm text-gray-800 focus:border-gray-400 focus:bg-gray-100"
      />
    </div>
  );
}
