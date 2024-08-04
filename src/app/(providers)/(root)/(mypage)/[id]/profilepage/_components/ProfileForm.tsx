'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import Image from 'next/image';
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

  const handleBack = () => {
    router.replace(`/${userId}/mypage`);
  };

  useEffect(() => {
    fetchProfile();
  }, [userId, newRegion]);

  return (
    <div>
      {profile ? (
        <div>
          <div className="mb-[20px] mt-[56px] flex items-center justify-between">
            <button className="rounded-[24px] bg-grayscale-50" onClick={handleBack}>
              <Image src="/icons/tabler-icon-chevron-left.svg" alt="Go Back" width={32} height={32} />
            </button>
            <p className="text-[18px] font-semibold">Edit Profile</p>
            <button className="text-[14px] font-medium text-action-color" onClick={handleProfileUpdate}>
              Done
            </button>
          </div>
          <div className="flex flex-col gap-[8px]">
            <ProfileImageUpload userId={userId} imageUrl={imageUrl} onImageChange={handleImageChange} />
            <p className="text-center text-[24px] font-bold">{nickname}</p>
            <p className="text-center text-[16px] text-action-color">{email}</p>
          </div>
          <ProfileDetailsForm nickname={nickname} setNickname={setNickname} region={region} userId={userId} />
          <div className="mt-[40px] flex flex-col">
            {showPasswordChange && <PasswordChangeForm userId={userId} email={profile.email} />}
          </div>
          <div className="fixed bottom-[120px] left-0 right-0 flex justify-around">
            <button className="text-[14px]" onClick={() => setShowPasswordChange(!showPasswordChange)}>
              Change Password
            </button>
            <button className="text-[14px] text-red-500" onClick={handleDeleteAccount}>
              Delete Account
            </button>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ProfileForm;
