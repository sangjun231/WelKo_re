import React from 'react';

interface TagSelectorProps {
  selectedTags: string[];
  handleTagClick: (tag: string) => void;
  tags: string[];
  goToNextStep: () => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, handleTagClick, tags, goToNextStep }) => {
  return (
    <div>
      <div className="p-4 bg-gray-100 border rounded-md mt-2">
        <div className="flex flex-wrap mb-4">
          {tags.map((tag) => (
            <div
              key={tag}
              className={`cursor-pointer p-2 mb-2 border rounded-full flex-1 min-w-[30%] mx-1 text-center ${
                selectedTags.includes(tag) ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'
              }`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
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

export default TagSelector;
