'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_MYPAGE_PROFILE } from '@/utils/apiConstants';
import Image from 'next/image';
import { Tables } from '@/types/supabase';

const ProfileView = ({ userId }: { userId: string }) => {
  const [profile, setProfile] = useState<Tables<'users'>>();
  const router = useRouter();

  const fetchProfile = async () => {
    const response = await axios.get(API_MYPAGE_PROFILE(userId));
    const profileData = response.data;
    setProfile(profileData);
  };

  const goToProfilePage = () => {
    router.replace(`/${userId}/profilepage`);
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  return (
    <div className="mt-[20px]">
      {profile ? (
        <div className="flex">
          {profile.avatar && (
            <Image
              src={`${profile.avatar}?${new Date().getTime()}`}
              alt="Profile"
              width={56}
              height={56}
              className="rounded-full"
              style={{ width: '56px', height: '56px' }}
            />
          )}
          <div className="ml-[12px]">
            <div className="flex">
              <p className="text-[18px] font-semibold leading-none">{profile.name}</p>
              {profile.region ? (
                <p className="ml-[8px] text-[12px]">{profile.region}</p>
              ) : (
                <p className="ml-[8px] text-[12px]">Please set the region</p>
              )}
            </div>
            <button onClick={goToProfilePage} className="mt-[8px] flex items-center text-[12px]">
              Edit Profile
              <Image src="/icons/tabler-icon-chevron-right.svg" alt="Edit Profile" width={16} height={16} />
            </button>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ProfileView;
