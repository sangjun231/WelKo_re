'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const cities = [
  '강원도 춘천시',
  '강원도 원주시',
  '경기도 구리시',
  '서울특별시 강남구',
  '부산광역시 해운대구',
  '대구광역시 달서구',
];

export default function Search({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 0) {
      const filteredSuggestions = cities.filter((city) =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
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
          onChange={handleInputChange}
          placeholder="여행지를 검색해보세요"
          className="ml-2 mr-4 w-full rounded-full border-2 border-black px-5 py-4 text-black focus:border-gray-200 focus:bg-gray-200 focus:outline-none"
        />
      </form>
      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-14 bg-white border border-gray-200 rounded-md shadow-md z-10">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
