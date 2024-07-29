'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_MYPAGE_PROFILE } from '@/utils/apiConstants';
import ProfileImageUpload from './ProfileImageUpload';
import PasswordChangeForm from './PasswordChangeForm';
import ProfileDetailsForm from './ProfileDetailsForm';
import { Tables } from '@/types/supabase';

const ProfileForm = ({ userId }: { userId: string }) => {
  const [profile, setProfile] = useState<Tables<'users'>>();
  const [nickname, setNickname] = useState('');
  const [region, setRegion] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const newRegion = searchParams.get('region');

  const fetchProfile = async () => {
    const response = await axios.get(API_MYPAGE_PROFILE(userId));
    const profileData = response.data;
    setProfile(profileData);
    setNickname(profileData.name);
    setRegion(newRegion || profileData.region);
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
        region
      });
      alert('Profile updated successfully');
      fetchProfile();
      router.replace(`/${userId}/mypage`);
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
  }, [userId, newRegion]);

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
          <ProfileDetailsForm nickname={nickname} setNickname={setNickname} region={region} userId={userId} />
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
