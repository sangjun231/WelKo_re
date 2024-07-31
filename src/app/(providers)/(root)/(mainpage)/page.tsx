'use client';

import { API_MYPAGE_PROFILE } from '@/utils/apiConstants';
import { createClient } from '@/utils/supabase/client';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PostsList from './_components/PostsList';
import Header from '@/components/common/Header/Header';

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
      <Header />
      <h1>Welcome to Home Page</h1>
      {userId ? <Link href={`/${userId}/mypage`}>Go to My Page</Link> : <p>Loading...</p>}
      <PostsList />
    </div>
  );
}
