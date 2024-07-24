'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_MYPAGE_PROFILE } from '@/utils/apiConstants';
import Image from 'next/image';

type Profile = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

const ProfileView = ({ userId }: { userId: string }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = async () => {
    const response = await axios.get(API_MYPAGE_PROFILE(userId));
    const profileData = response.data;
    setProfile(profileData);
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  return (
    <div>
      {profile ? (
        <div className="flex">
          {profile.avatar && (
            <Image
              src={`${profile.avatar}?${new Date().getTime()}`}
              alt="Profile"
              width={70}
              height={70}
              className="rounded-full"
            />
          )}
          <div className="ml-4">
            <div className="flex items-center">
              <p className="text-[20px] font-bold">{profile.name}</p>
              <p className="ml-2 text-[13px]">Please set the region</p>
            </div>
            <Link href={`/${userId}/profile-page`}>
              <button className="mt-2">Edit Profile</button>
            </Link>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ProfileView;
