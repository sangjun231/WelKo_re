'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import TagSelector from '../_components/planner/TagSelector';
import CitySelector from '../_components/planner/CitySelector';
import PeriodSelector from '../_components/planner/PeriodSelector';

const tags = ['Activities', 'Famous', 'With Nature', 'Tourist Attraction', 'Shopping', 'Peaceful', 'Mukbang', 'Cultural and Arts', 'K-Drama Location'];
const cities = ['Seoul', 'Busan', 'Sokcho', 'Gangneung', 'Jeonju', 'Daegu', 'Gyeongju', 'Yeosu', 'Jeju'];

export default function TravelPlanner() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<number | null>(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleTagClick = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
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

    if (selectedTags.length > 0) {
      query.append('tags', JSON.stringify(selectedTags));
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

    // Use router.push to navigate to the results page with the query parameters
    router.push(`/results?${query.toString()}`);
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
          title="What kind of experiences do you seek?"
          shortTitle="Tags"
          selection={selectedTags.join(', ') || 'Anything'}
        >
          <TagSelector
            selectedTags={selectedTags}
            handleTagClick={handleTagClick}
            tags={tags}
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
          Show Results
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
