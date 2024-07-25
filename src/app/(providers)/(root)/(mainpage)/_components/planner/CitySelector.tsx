import React from 'react';

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
  return (
    <div className="mt-4">
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
          <button onClick={goToPreviousStep} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">
            이전
          </button>
          <button onClick={goToNextStep} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitySelector;
