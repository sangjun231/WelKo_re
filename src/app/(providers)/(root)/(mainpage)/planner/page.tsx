'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ThemeSelector from '../_components/planner/ThemeSelector';
import CitySelector from '../_components/planner/CitySelector';
import PeriodSelector from '../_components/planner/PeriodSelector';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

const themes = ['Activities', 'Famous', 'With Nature', 'Tourist Attraction', 'Shopping', 'Peaceful', 'Mukbang', 'Cultural and Arts', 'K-Drama Location'];
const cities = ['Seoul', 'Busan', 'Sokcho', 'Gangneung', 'Jeonju', 'Daegu', 'Gyeongju', 'Yeosu', 'Jeju'];

export default function TravelPlanner() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<number | null>(1);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [posts, setPosts] = useState<any[]>([]);

  const handleThemeClick = (theme: string) => {
    setSelectedThemes((prevThemes) =>
      prevThemes.includes(theme) ? prevThemes.filter((t) => t !== theme) : [...prevThemes, theme]
    );
  };

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
  };

  const formatDateToISOString = (date: Date | null): string | null => {
    return date ? new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString() : null;
  };

  const formatDateToShortString = (date: Date | null): string => {
    return date ? `${date.getFullYear().toString().slice(-2)}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}` : 'Anything';
  };

  const fetchPosts = async () => {
    if (!selectedCity) return;

    let query = supabase.from('posts').select('*');

    if (selectedCity) {
      query = query.ilike('title', `%${selectedCity}%`);
    }

    if (selectedThemes.length > 0) {
      query = query.in('theme', selectedThemes);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data || []);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCity, selectedThemes]);

  const handleDateSelection = () => {
    const query = new URLSearchParams();

    if (selectedThemes.length > 0) {
      query.append('theme', selectedThemes.join(','));
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

    fetchPosts();
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
          selection={selectedCity}
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
      </div>

      {posts.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Related Posts</h2>
          <ul>
            {posts.map((post, index) => (
              <li key={`${post.id}-${index}`} className="mb-4 border p-2 rounded-md">
                <h3 className="font-bold">{post.title}</h3>
                <p>{post.content}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
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
