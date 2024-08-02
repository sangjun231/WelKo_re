'use client';

import { API_MYPAGE_PROFILE } from '@/utils/apiConstants';
import { createClient } from '@/utils/supabase/client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PostsList from './_components/PostsList';
import Image from 'next/image';  // Import the Image component
import Search from '@/components/common/Search/Search';

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
    <div className='relative'>
      <Image
        src="/img/img.jpg"
        alt="Description of the image" 
        width={800}  
        height={600} 
        layout="responsive" 
      />
      <div 
        className='absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-4'
        style={{ height: '20%', top: '80%' }}
      >
        <Search />
        <PostsList />
      </div>
    </div>
  );
}
