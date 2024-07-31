'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ThemeSelector from '../_components/planner/ThemeSelector';
import CitySelector from '../_components/planner/CitySelector';
import PeriodSelector from '../_components/planner/PeriodSelector';

const themes = ['Activities', 'Famous', 'With Nature', 'Tourist Attraction', 'Shopping', 'Peaceful', 'Mukbang', 'Cultural and Arts', 'K-Drama Location'];
const cities = ['Seoul', 'Busan', 'Sokcho', 'Gangneung', 'Jeonju', 'Daegu', 'Gyeongju', 'Yeosu', 'Jeju'];

export default function TravelPlanner() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<number | null>(1);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleThemeClick = (theme: string) => {
    setSelectedThemes((prevThemes) =>
      prevThemes.includes(theme) ? prevThemes.filter((t) => t !== theme) : [...prevThemes, theme]
    );
  };

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
  };

  const formatDateToShortString = (date: Date | null): string => {
    return date ? `${date.getFullYear().toString().slice(-2)}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}` : 'Anything';
  };

  const handleDateSelection = () => {
    const query = new URLSearchParams();

    if (selectedThemes.length > 0) {
      query.append('theme', selectedThemes.join(','));
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

    router.push(`/selectedposts?${query.toString()}`);
  };

  const toggleStep = (step: number) => {
    setActiveStep(activeStep === step ? null : step);
  };

  return (
    <div className="p-4">
      <button onClick={() => router.back()}>
        X
      </button>

      <div className="mt-4">
        <AccordionStep
          step={1}
          activeStep={activeStep}
          toggleStep={toggleStep}
          title="What tour do you like?"
          shortTitle="What"
          selection={selectedThemes.join(', ') || 'Anything'}
        >
          <ThemeSelector
            selectedThemes={selectedThemes}
            handleThemeClick={handleThemeClick}
            themes={themes}
            goToNextStep={() => toggleStep(2)}
          />
        </AccordionStep>

        <AccordionStep
          step={2}
          activeStep={activeStep}
          toggleStep={toggleStep}
          title="Where to?"
          shortTitle="Where"
          selection={selectedCity || 'Anything'}
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
          title="When is your trip?"
          shortTitle="When"
          selection={
            startDate && endDate
              ? `${formatDateToShortString(startDate)}~${formatDateToShortString(endDate)}`
              : 'Anything'
          }
        >
          <PeriodSelector
            next={handleDateSelection}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        </AccordionStep>

        {/* 결과보기 버튼 추가 */}
        <button
          onClick={handleDateSelection}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          결과보기
        </button>
      </div>
    </div>
  );
}

interface AccordionStepProps {
  step: number;
  activeStep: number | null;
  toggleStep: (step: number) => void;
  title: string;
  shortTitle: string;
  selection: string | null;
  children: React.ReactNode;
}

const AccordionStep: React.FC<AccordionStepProps> = ({
  step,
  activeStep,
  toggleStep,
  title,
  shortTitle,
  selection,
  children,
}) => {
  return (
    <div className="mt-4">
      {activeStep !== step && (
        <button
          onClick={() => toggleStep(step)}
          className={`w-full text-left px-4 py-2 font-bold ${activeStep === step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-md flex justify-between items-center`}
        >
          <span>{shortTitle}</span>
          <span>{selection || 'Anything'}</span>
        </button>
      )}
      {activeStep === step && (
        <div className="p-4 bg-gray-100 border rounded-md mt-2">
          <div className="font-bold text-gray-700">{title}</div>
          {children}
        </div>
      )}
    </div>
  );
};
