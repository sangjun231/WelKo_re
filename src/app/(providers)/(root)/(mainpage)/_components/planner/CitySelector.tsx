import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

interface CitySelectorProps {
  selectedCity: string | null;
  handleCityClick: (city: string) => void;
  cities: string[];
  goToPreviousStep: () => void;
  goToNextStep: () => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({ selectedCity, handleCityClick, cities }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [autoCompleteResults, setAutoCompleteResults] = useState<string[]>([]);

  useEffect(() => {
    const fetchAutoCompleteResults = async () => {
      if (searchQuery.trim() === '') {
        setAutoCompleteResults([]);
        return;
      }

      const { data, error } = await supabase.from('schedule').select('area').ilike('area', `%${searchQuery}%`);

      if (error) {
        console.error('Error fetching auto-complete results:', error);
      } else {
        // Ensure unique results
        const uniqueResults = Array.from(new Set(data.map((item) => item.area)));
        setAutoCompleteResults(uniqueResults);
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
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && autoCompleteResults.length > 0) {
      handleAutoCompleteClick(autoCompleteResults[0]);
    }
  };

  // Filter cities based on search query
  const filteredCities = cities.filter((city) => city.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          placeholder="Search Your Destination"
          className="mb-4 w-full rounded-[36px] border bg-gray-100 p-2"
        />
        {autoCompleteResults.length > 0 && (
          <div className="mb-4 rounded-md border bg-white p-2">
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
        <div className="mb-4 flex flex-wrap">
          {filteredCities.map((city) => (
            <div
              key={city}
              className={`mb-2 mr-1 flex min-w-[30%] cursor-pointer justify-center rounded-3xl border px-3 py-2 text-center text-[13px] font-medium ${
                city === selectedCity ? 'bg-[#B95FAB] text-white' : 'bg-gray-100'
              }`}
              onClick={() => handleCityClick(city)}
            >
              {city}
            </div>
          ))}
          {searchQuery && !cities.includes(searchQuery) && (
            <div
              className={`mb-2 mr-1 flex min-w-[30%] cursor-pointer justify-center rounded-3xl border px-3 py-2 text-center text-[13px] font-medium ${
                searchQuery === selectedCity ? 'bg-[#B95FAB] text-white' : 'bg-gray-100'
              }`}
              onClick={() => handleCityClick(searchQuery)}
            >
              {searchQuery}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitySelector;
