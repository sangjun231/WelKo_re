'use client';

import { createClient } from '@/utils/supabase/client';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// 유저 데이터 타입 정의
interface User {
  id: string;
  email: string;
  [key: string]: any; // 추가적인 필드가 있을 경우를 대비한 인덱스 시그니처
}

const backOffice = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>('');
  const supabase = createClient();

  useEffect(() => {
    const fetchAllUsers = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error fetching user data:', userError);
        setError(userError.message);
        return null;
      }

      if (!user) {
        console.error('No user found');
        setError('사용자가 없습니다.');
        return null;
      }

      const { data: userData, error: userFetchError } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (userFetchError) {
        console.error('Error fetching user data:', userFetchError);
        setError(userFetchError.message);
        return null;
      }

      if (!userData.is_admin) {
        console.error('Access denied: Not an admin');
        setError('접근이 거부되었습니다: 관리자가 아닙니다.');
        return null;
      }

      const { data: allUsersData, error: allUsersError } = await supabase.from('users').select('*');

      if (allUsersError) {
        console.error('Error fetching all users:', allUsersError);
        setError(allUsersError.message);
        return null;
      }

      return allUsersData;
    };

    const getUsers = async () => {
      const allUsers = await fetchAllUsers();
      if (allUsers) {
        setUsers(allUsers);
      }
    };

    getUsers();
  }, []);

  return (
    <div>
      <h1>Back Office</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default backOffice;
