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
      <h1>My Profile</h1>
      {profile ? (
        <div>
          {profile.avatar && (
            <Image
              src={`${profile.avatar}?${new Date().getTime()}`}
              alt="Profile"
              width={70}
              height={70}
              className="rounded-full"
            />
          )}
          <p>Nickname: {profile.name}</p>
          <p>Email: {profile.email}</p>
          <Link href={`/${userId}/profile-page`}>
            <button>Edit Profile</button>
          </Link>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ProfileView;
