'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const cities = [
  '강원도 강릉시',
  '서울특별시 강남구',
  '부산광역시 해운대구',
  '경기도 수원시',
  '대구광역시 달서구',
  '제주도',
  '강원도 양양시'
];

export default function CitySearch() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const router = useRouter();

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
  };

  const handleConfirmSelection = () => {
    if (selectedCity) {
      router.push(`/selectedCity?city=${encodeURIComponent(selectedCity)}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">인기관광지역을 추천합니다</h1>
      <div>
        {cities.map((city) => (
          <div
            key={city}
            className={`cursor-pointer p-2 mb-2 border rounded-md ${
              city === selectedCity ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'
            }`}
            onClick={() => handleCityClick(city)}
          >
            {city}
          </div>
        ))}
      </div>
      <button
        onClick={handleConfirmSelection}
        disabled={!selectedCity}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
      >
        선택 완료
      </button>
    </div>
  );
}
