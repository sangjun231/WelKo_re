'use client';

import Header from '@/components/common/Header/Header';
import { API_MYPAGE_PROFILE } from '@/utils/apiConstants';
import { createClient } from '@/utils/supabase/client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PostsList from './_components/PostsList';

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
      <PostsList />
    </div>
  );
}
