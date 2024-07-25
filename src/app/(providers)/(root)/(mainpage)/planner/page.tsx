'use client';

import { useState } from 'react';
import ThemeSelector from '../_components/planner/ThemeSelector';
import CitySelector from '../_components/planner/CitySelector';
import PeriodSelector from '../_components/planner/PeriodSelector';

const themes = ['테마1', '테마2', '테마3', '테마4', '테마5'];
const cities = ['서울', '부산', '속초', '강릉', '전주', '대구', '경주', '여수', '제주'];

export default function TravelPlanner() {
  const [activeStep, setActiveStep] = useState<number | null>(1);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleThemeClick = (theme: string) => {
    setSelectedTheme(theme);
  };

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
  };

  const formatDateToISOString = (date: Date | null): string | null => {
    return date ? new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString() : null;
  };

  const handleDateSelection = () => {
    const query = new URLSearchParams();

    if (selectedTheme) {
      query.append('theme', selectedTheme);
    }

    if (selectedCity) {
      query.append('city', selectedCity);
    }

    const formattedStartDate = formatDateToISOString(startDate);
    const formattedEndDate = formatDateToISOString(endDate);

    if (formattedStartDate) {
      query.append('startDate', formattedStartDate);
    }

    if (formattedEndDate) {
      query.append('endDate', formattedEndDate);
    }

    alert(`선택된 테마: ${selectedTheme || '없음'}
선택된 도시: ${selectedCity || '없음'}
여행 시작 날짜: ${formattedStartDate || '없음'}
여행 종료 날짜: ${formattedEndDate || '없음'}`);

    // Optional: Navigate to results page if desired
    // router.push(`/results?${query.toString()}`);
  };

  const toggleStep = (step: number) => {
    setActiveStep(activeStep === step ? null : step);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">여행 계획 세우기</h1>

      <div className="mt-4">
        <AccordionStep
          step={1}
          activeStep={activeStep}
          toggleStep={toggleStep}
          title="1. 인기 테마 선택"
        >
          <ThemeSelector
            selectedTheme={selectedTheme}
            handleThemeClick={handleThemeClick}
            themes={themes}
            goToNextStep={() => toggleStep(2)}
          />
        </AccordionStep>

        <AccordionStep
          step={2}
          activeStep={activeStep}
          toggleStep={toggleStep}
          title="2. 특정 도시 선택"
        >
          <CitySelector
            selectedCity={selectedCity}
            handleCityClick={handleCityClick}
            cities={cities}
            goToPreviousStep={() => toggleStep(1)}
            goToNextStep={() => toggleStep(3)}
          />
        </AccordionStep>

        <AccordionStep
          step={3}
          activeStep={activeStep}
          toggleStep={toggleStep}
          title="3. 여행 기간 선택"
        >
          <PeriodSelector
            next={handleDateSelection}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        </AccordionStep>
      </div>
    </div>
  );
}

interface AccordionStepProps {
  step: number;
  activeStep: number | null;
  toggleStep: (step: number) => void;
  title: string;
  children: React.ReactNode;
}

const AccordionStep: React.FC<AccordionStepProps> = ({
  step,
  activeStep,
  toggleStep,
  title,
  children,
}) => (
  <div className="mt-4">
    <button
      onClick={() => toggleStep(step)}
      className={`w-full text-left px-4 py-2 font-bold ${activeStep === step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-md`}
    >
      {title}
    </button>
    {activeStep === step && (
      <div className="p-4 bg-gray-100 border rounded-md mt-2">
        {children}
      </div>
    )}
  </div>
);
