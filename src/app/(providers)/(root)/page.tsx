'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_MYPAGE_PROFILE } from '@/utils/apiConstants';
import { createClient } from '@/utils/supabase/client';

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

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
          const response = await axios.get(`${API_MYPAGE_PROFILE}?user_id=${user.id}`);
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
      {userId ? <Link href={`/${userId}/my-page`}>Go to My Page</Link> : <p>Loading...</p>}
    </div>
  );
}
