'use client';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const themes = ['테마1', '테마2', '테마3', '테마4', '테마5'];
const cities = ['서울', '부산', '속초', '강릉', '전주', '대구', '경주', '여수', '제주'];

export default function TravelPlanner() {
  const [activeStep, setActiveStep] = useState<number | null>(1); // 기본값을 1로 설정
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const today = new Date(); // Current date for minDate

  const handleThemeClick = (theme: string) => {
    setSelectedTheme(theme);
  };

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
  };

  const handleDateSelection = () => {
    const query = new URLSearchParams();

    if (selectedTheme) {
      query.append('theme', selectedTheme);
    }

    if (selectedCity) {
      query.append('city', selectedCity);
    }

    if (startDate) {
      query.append('startDate', startDate.toISOString());
    }

    if (endDate) {
      query.append('endDate', endDate.toISOString());
    }

    alert(`선택된 테마: ${selectedTheme || '없음'}
선택된 도시: ${selectedCity || '없음'}
여행 시작 날짜: ${startDate ? startDate.toISOString() : '없음'}
여행 종료 날짜: ${endDate ? endDate.toISOString() : '없음'}`);

    // Optional: Navigate to results page if desired
    // router.push(`/results?${query.toString()}`);
  };

  const toggleStep = (step: number) => {
    setActiveStep(activeStep === step ? null : step);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">여행 계획 세우기</h1>

      {/* Step 1: 인기 테마 선택 */}
      <div>
        <button
          onClick={() => toggleStep(1)}
          className={`w-full text-left px-4 py-2 font-bold ${activeStep === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-md`}
        >
          1. 인기 테마 선택
        </button>
        {activeStep === 1 && (
          <div className="p-4 bg-gray-100 border rounded-md mt-2">
            <div className="flex flex-wrap mb-4">
              {themes.map((theme) => (
                <div
                  key={theme}
                  className={`cursor-pointer p-2 mb-2 border rounded-full flex-1 min-w-[30%] mx-1 text-center ${
                    theme === selectedTheme ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'
                  }`}
                  onClick={() => handleThemeClick(theme)}
                >
                  {theme}
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => toggleStep(2)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Step 2: 특정 도시 선택 */}
      <div className="mt-4">
        <button
          onClick={() => toggleStep(2)}
          className={`w-full text-left px-4 py-2 font-bold ${activeStep === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-md`}
        >
          2. 특정 도시 선택
        </button>
        {activeStep === 2 && (
          <div className="p-4 bg-gray-100 border rounded-md mt-2">
            <div className="flex flex-wrap mb-4">
              {cities.map((city) => (
                <div
                  key={city}
                  className={`cursor-pointer p-2 mb-2 border rounded-full flex-1 min-w-[30%] mx-1 text-center ${
                    city === selectedCity ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'
                  }`}
                  onClick={() => handleCityClick(city)}
                >
                  {city}
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => toggleStep(1)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
              >
                이전
              </button>
              <button
                onClick={() => toggleStep(3)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Step 3: 여행 기간 선택 */}
      <div className="mt-4">
        <button
          onClick={() => toggleStep(3)}
          className={`w-full text-left px-4 py-2 font-bold ${activeStep === 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-md`}
        >
          3. 여행 기간 선택
        </button>
        {activeStep === 3 && (
          <div className="p-4 bg-gray-100 border rounded-md mt-2">
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <DatePicker
                selected={startDate || undefined}
                onChange={(update) => {
                  const [start, end] = update as [Date | null, Date | null];
                  setStartDate(start);
                  setEndDate(end);
                }}
                startDate={startDate || undefined}
                endDate={endDate || undefined}
                selectsRange
                minDate={today} // Set minimum date to today
                inline
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => toggleStep(2)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
              >
                이전
              </button>
              <button
                onClick={handleDateSelection}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                최종 확인
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
