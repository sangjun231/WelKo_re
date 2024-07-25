'use client';

import { API_MYPAGE_PROFILE } from '@/utils/apiConstants';
import { createClient } from '@/utils/supabase/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const goToMyPage = () => {
    router.push(`/${userId}/mypage`);
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const {
          data: { user },
          error
        } = await supabase.auth.getUser();

        if (error) {
          console.error('Error fetching user:', error);
          return;
        }

        if (user) {
          const userId = user.id;
          const response = await axios.get(API_MYPAGE_PROFILE(userId));
          const profile = response.data;
          if (profile && profile.id) {
            setUserId(profile.id);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserId();
  }, [supabase]);

  return (
    <div>
      <h1>Welcome to Home Page</h1>
      {userId ? <button onClick={goToMyPage}>Go to My Page</button> : <p>Loading...</p>}
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
      <h1>Home Page</h1>
    </div>
  );
}
