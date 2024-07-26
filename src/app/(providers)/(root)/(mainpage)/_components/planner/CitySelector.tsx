import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // Supabase 클라이언트 임포트

const supabase = createClient();

interface CitySelectorProps {
  selectedCity: string | null;
  handleCityClick: (city: string) => void;
  cities: string[];
  goToPreviousStep: () => void;
  goToNextStep: () => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  selectedCity,
  handleCityClick,
  cities,
  goToPreviousStep,
  goToNextStep,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [autoCompleteResults, setAutoCompleteResults] = useState<string[]>([]);

  useEffect(() => {
    const fetchAutoCompleteResults = async () => {
      if (searchQuery.trim() === '') {
        setAutoCompleteResults([]);
        return;
      }

      const { data, error } = await supabase
        .from('posts')
        .select('title')
        .ilike('title', `%${searchQuery}%`);

      if (error) {
        console.error('Error fetching auto-complete results:', error);
      } else {
        setAutoCompleteResults(data.map((post) => post.title));
      }
    };

    fetchAutoCompleteResults();
  }, [searchQuery]);

  const handleAutoCompleteClick = (result: string) => {
    handleCityClick(result);
    setSearchQuery(result);
    setAutoCompleteResults([]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && autoCompleteResults.length > 0) {
      handleAutoCompleteClick(autoCompleteResults[0]);
    }
  };

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="p-4 bg-gray-100 border rounded-md mt-2">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          placeholder="Search city"
          className="w-full p-2 mb-4 border rounded-md"
        />
        {autoCompleteResults.length > 0 && (
          <div className="bg-white border rounded-md p-2 mb-4">
            {autoCompleteResults.map((result) => (
              <div
                key={result}
                className="cursor-pointer p-2 hover:bg-gray-200"
                onClick={() => handleAutoCompleteClick(result)}
              >
                {result}
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap mb-4">
          {filteredCities.map((city) => (
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
          <button onClick={goToPreviousStep} className="px-4 py-2 bg-gray-500 text-white rounded-md">
            Previous
          </button>
          <button onClick={goToNextStep} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitySelector;
