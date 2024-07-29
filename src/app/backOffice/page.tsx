'use client';

import PosterManagement from '@/components/common/Admin/PosterManagement';
import TabNavigation from '@/components/common/Admin/TabNavigation';
import UserManagement from '@/components/common/Admin/UserManagement';
import { useState } from 'react';

const BackOffice = () => {
  const [activeTab, setActiveTab] = useState<'user' | 'poster'>('user');

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <TabNavigation activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === 'user' ? <UserManagement /> : <PosterManagement />}
    </div>
  );
};

export default BackOffice;
