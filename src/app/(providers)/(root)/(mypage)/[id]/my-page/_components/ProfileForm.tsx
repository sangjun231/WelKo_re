'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_MYPAGE_PROFILE } from '@/utils/apiConstants';

type Profile = {
  id: string;
  nickname: string;
  email: string;
};

const ProfileForm = ({ userId }: { userId: string }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await axios.get(`${API_MYPAGE_PROFILE}?user_id=${userId}`);
      const profileData = response.data;
      setProfile(profileData);
      setNickname(profileData.nickname);
      setEmail(profileData.email);
    };

    fetchProfile();
  }, [userId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (profile) {
      await axios.put(API_MYPAGE_PROFILE, { id: profile.id, nickname, email });
      router.back();
    }
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      {profile ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="nickName"
            className="text-black"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="text-black"
          />
          <button type="submit">Update Profile</button>
        </form>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ProfileForm;
