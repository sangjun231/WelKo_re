'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import TagSelector from '../_components/planner/TagSelector';
import CitySelector from '../_components/planner/CitySelector';
import PeriodSelector from '../_components/planner/PeriodSelector';

const tags = [
  'Activities',
  'Nature',
  'Famous',
  'Tourist Attraction',
  'Shopping',
  'Peaceful',
  'Mukbang',
  'Cultural/Arts',
  'K-Drama Location'
];
const cities = ['Seoul', 'Busan', 'Sokcho', 'Gangneung', 'Jeonju', 'Daegu', 'Gyeongju', 'Yeosu', 'Jeju'];

export default function TravelPlanner() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<number | null>(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null); //Date | null

  const handleTagClick = (tag: string) => {
    setSelectedTags((prevTags) => (prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]));
  };

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
  };

  const formatDateToShortString = (date: Date | null): string => {
    return date
      ? `${date.getFullYear().toString().slice(-2)}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`
      : 'Anything';
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

  const goToNextStep = () => {
    if (activeStep !== null) {
      setActiveStep(activeStep + 1);
    }
  };

  return (
    <div className="p-4 pb-16">
      {' '}
      {/* Padding bottom added to ensure space for the fixed button */}
      <button onClick={() => router.back()}>X</button>
      <div className="mt-4">
        <AccordionStep
          step={1}
          activeStep={activeStep}
          toggleStep={toggleStep}
          title="What is your travel style?"
          shortTitle="Travel style"
          selection={selectedTags.join(', ') || 'Anything'}
        >
          <TagSelector
            selectedTags={selectedTags}
            handleTagClick={handleTagClick}
            tags={tags}
            goToNextStep={goToNextStep}
          />
        </AccordionStep>

        <AccordionStep
          step={2}
          activeStep={activeStep}
          toggleStep={toggleStep}
          title="Where to?"
          shortTitle="Where"
          selection={selectedCity || 'Anywhere'}
        >
          <CitySelector
            selectedCity={selectedCity}
            handleCityClick={handleCityClick}
            cities={cities}
            goToPreviousStep={() => toggleStep(1)}
            goToNextStep={goToNextStep}
          />
        </AccordionStep>

        <AccordionStep
          step={3}
          activeStep={activeStep}
          toggleStep={toggleStep}
          title="When’s your tour?"
          shortTitle="When"
          selection={
            startDate && endDate
              ? `${formatDateToShortString(startDate)}~${formatDateToShortString(endDate)}`
              : 'Any Week'
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
      </div>
      {/* Fixed button at the bottom */}
      {/* <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
        {activeStep === 3 ? (
          <button
            onClick={handleDateSelection}
            className="w-full px-4 py-2 bg-black text-white rounded-md"
          >
            Search
          </button>
        ) : (
          <button
            onClick={goToNextStep}
            className="w-full px-4 py-2 bg-black text-white rounded-md"
          >
            Next
          </button>
        )}
      </div> */}
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
  children
}) => {
  return (
    <div className="mt-4">
      {activeStep !== step && (
        <button
          onClick={() => toggleStep(step)}
          className={`w-full px-4 py-2 text-left font-semibold ${activeStep === step ? 'bg-blue-500 text-white' : 'rounded-2xl text-gray-700 shadow-[0_0_10px_#d3d3d3]'} flex items-center justify-between rounded-md`}
        >
          <span>{shortTitle}</span>
          <span>{selection || 'Anything'}</span>
        </button>
      )}
      {activeStep === step && (
        <div className="mt-2 rounded-2xl p-4 shadow-[0_0_10px_#d3d3d3]">
          <div className="mb-[10px] text-[21px] font-bold text-gray-700">{title}</div>
          {children}
        </div>
      )}
    </div>
  );
};
