import React from 'react';

interface TabNavigationProps {
  activeTab: 'user' | 'poster';
  onChange: (tab: 'user' | 'poster') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onChange }) => {
  return (
    <div className="mb-6 flex space-x-4">
      <button
        onClick={() => onChange('user')}
        className={`rounded px-4 py-2 ${activeTab === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
      >
        유저 관리
      </button>
      <button
        onClick={() => onChange('poster')}
        className={`rounded px-4 py-2 ${activeTab === 'poster' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
      >
        포스터 관리
      </button>
    </div>
  );
};

export default TabNavigation;
