import React from 'react';

interface ThemeSelectorProps {
  selectedThemes: string[];
  handleThemeClick: (theme: string) => void;
  themes: string[];
  goToNextStep: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ selectedThemes, handleThemeClick, themes, goToNextStep }) => {
  return (
    <div>
      <div className="p-4 bg-gray-100 border rounded-md mt-2">
        <div className="flex flex-wrap mb-4">
          {themes.map((theme) => (
            <div
              key={theme}
              className={`cursor-pointer p-2 mb-2 border rounded-full flex-1 min-w-[30%] mx-1 text-center ${
                selectedThemes.includes(theme) ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'
              }`}
              onClick={() => handleThemeClick(theme)}
            >
              {theme}
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <button onClick={goToNextStep} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
