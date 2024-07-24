'use client';

import axios from 'axios';
import { useState } from 'react';
import { API_MYPAGE_PROFILE } from '@/utils/apiConstants';

type ProfileDetailsFormProps = {
  userId: string;
  profile: { id: string; name: string; email: string; avatar: string };
  onProfileUpdate: () => void;
};

const ProfileDetailsForm = ({ userId, profile, onProfileUpdate }: ProfileDetailsFormProps) => {
  const [nickname, setNickname] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await axios.put(API_MYPAGE_PROFILE(userId), { id: profile.id, name: nickname, email, avatar: profile.avatar });
      onProfileUpdate();
    } catch (error) {
      alert('Error updating profile');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Update Profile</button>
      <div>
        <p>{email}</p>
      </div>
      <p>Nickname</p>
      <input
        className="text-black"
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Nickname"
      />
    </form>
  );
};

export default ProfileDetailsForm;
