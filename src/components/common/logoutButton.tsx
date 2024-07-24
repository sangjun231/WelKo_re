'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; // App Router에서 useRouter 대신 useNavigation 사용

import { handleLogout } from '@/utils/supabase/service';

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const onLogoutClick = async () => {
    await handleLogout(router);
  };

  return <button onClick={onLogoutClick}>Logout</button>;
};

export default LogoutButton;
