'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SelectedCity() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const city = searchParams.get('city') || '선택되지 않음';
  const [months, setMonths] = useState<number[]>([]);

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-based index (0 = January, 11 = December)
    const currentYear = now.getFullYear();

    let startMonth = currentMonth;
    let endMonth = currentMonth + 2; // Current month and the next two months

    if (startMonth > 9) {
      startMonth = 0;
      endMonth = 2;
    }

    const monthButtons = [];
    for (let month = startMonth; month <= endMonth; month++) {
      const monthName = new Intl.DateTimeFormat('ko-KR', { month: 'long' }).format(new Date(currentYear, month));
      monthButtons.push(month + 1); // Add 1 to month to convert to 1-based index
    }

    setMonths(monthButtons);
  }, []);

  const handleMonthClick = (month: number) => {
    // 월 클릭 시의 동작
    alert(`선택된 월: ${month}`);
    // 예를 들어, 선택된 월로 페이지 이동
    // router.push(`/somePage?city=${encodeURIComponent(city)}&month=${month}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">선택된 도시: {city}</h1>
      <h2 className="text-xl mb-4">선택 가능한 월</h2>
      <div className="flex flex-wrap">
        {months.map((month) => (
          <button
            key={month}
            className="px-4 py-2 m-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => handleMonthClick(month)}
          >
            {month}월
          </button>
        ))}
      </div>
      <button
        onClick={handleBack}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md"
      >
        돌아가기
      </button>
    </div>
  );
}
