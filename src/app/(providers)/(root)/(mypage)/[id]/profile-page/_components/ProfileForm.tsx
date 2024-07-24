'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_MYPAGE_PROFILE } from '@/utils/apiConstants';
import ProfileImageUpload from './ProfileImageUpload';
import PasswordChangeForm from './PasswordChangeForm';
import ProfileDetailsForm from './ProfileDetailsForm';

type Profile = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

const ProfileForm = ({ userId }: { userId: string }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();

  const fetchProfile = async () => {
    const response = await axios.get(API_MYPAGE_PROFILE(userId));
    const profileData = response.data;
    setProfile(profileData);
  };

  const handleImageChange = (newImageUrl: string) => {
    if (profile) {
      setProfile({ ...profile, avatar: newImageUrl });
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmDelete) {
      try {
        await axios.delete(API_MYPAGE_PROFILE(userId));
        alert('Account deleted successfully');
        router.push('/login');
      } catch (error) {
        alert('Error deleting account');
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  return (
    <div>
      {profile ? (
        <>
          <ProfileDetailsForm userId={userId} profile={profile} onProfileUpdate={fetchProfile} />
          <ProfileImageUpload userId={userId} imageUrl={profile.avatar} onImageChange={handleImageChange} />
          <PasswordChangeForm userId={userId} email={profile.email} />
          <button onClick={handleDeleteAccount}>Delete Account</button>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ProfileForm;
