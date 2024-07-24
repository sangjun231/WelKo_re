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
  location: string;
};

const ProfileForm = ({ userId }: { userId: string }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [nickname, setNickname] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const router = useRouter();

  const fetchProfile = async () => {
    const response = await axios.get(API_MYPAGE_PROFILE(userId));
    const profileData = response.data;
    setProfile(profileData);
    setNickname(profileData.name);
    setLocation(profileData.location);
    setEmail(profileData.email);
    setImageUrl(profileData.avatar);
  };

  const handleProfileUpdate = async () => {
    if (profile) {
      await axios.put(API_MYPAGE_PROFILE(userId), {
        id: profile.id,
        name: nickname,
        email,
        avatar: imageUrl,
        location
      });
      alert('Profile updated successfully');
      fetchProfile();
    }
  };

  const handleImageChange = (newImageUrl: string) => {
    setImageUrl(newImageUrl);
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
          <div className="mb-4 flex items-center justify-end">
            <button onClick={handleProfileUpdate} className="rounded bg-black px-4 py-2 text-white">
              save
            </button>
          </div>
          <ProfileImageUpload userId={userId} imageUrl={imageUrl} onImageChange={handleImageChange} />
          <p className="text-center text-gray-500">{email}</p>
          <ProfileDetailsForm
            nickname={nickname}
            setNickname={setNickname}
            location={location}
            setLocation={setLocation}
          />
          {showPasswordChange && <PasswordChangeForm userId={userId} email={profile.email} />}
          <div className="flex justify-around">
            <button onClick={() => setShowPasswordChange(!showPasswordChange)} className="mt-4">
              change password
            </button>
            <button onClick={handleDeleteAccount} className="mt-4 text-red-500">
              delete account
            </button>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ProfileForm;
