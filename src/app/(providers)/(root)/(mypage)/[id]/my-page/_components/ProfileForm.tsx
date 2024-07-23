'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { API_MYPAGE_PROFILE } from '@/utils/apiConstants';
import Image from 'next/image';

type Profile = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

const ProfileForm = ({ userId }: { userId: string }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (profile) {
      await axios.put(API_MYPAGE_PROFILE(userId), { id: profile.id, name: nickname, email, avatar: imageUrl });
      router.back();
    }
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `profile_images/${fileName}`;

      // 기존 파일 삭제
      const existingImagePath = profile?.avatar?.split('/').pop();
      if (existingImagePath && existingImagePath !== fileName) {
        await supabase.storage.from('users').remove([`profile_images/${existingImagePath}`]);
      }

      // 새로운 파일 업로드
      const { error: uploadError } = await supabase.storage.from('users').upload(filePath, file, {
        upsert: true
      });

      if (uploadError) {
        console.error('Failed to upload image:', uploadError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage.from('users').getPublicUrl(filePath);
      if (publicUrlData) {
        setImageUrl(publicUrlData.publicUrl);

        await axios.put(API_MYPAGE_PROFILE(userId), { id: userId, avatar: publicUrlData.publicUrl });

        // 프로필 데이터를 다시 가져와서 상태를 업데이트
        const response = await axios.get(API_MYPAGE_PROFILE(userId));
        const profileData = response.data;
        setProfile(profileData);
        setNickname(profileData.name);
        setEmail(profileData.email);
        setImageUrl(publicUrlData.publicUrl);
      } else {
        console.error('Failed to get public URL');
      }
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await axios.get(API_MYPAGE_PROFILE(userId));
      const profileData = response.data;
      setProfile(profileData);
      setNickname(profileData.name);
      setEmail(profileData.email);
      setImageUrl(profileData.avatar);
    };

    fetchProfile();
  }, [userId]);

  return (
    <div>
      <h1>Edit Profile</h1>
      {profile ? (
        <form onSubmit={handleSubmit}>
          <div>
            {imageUrl && (
              <Image
                src={`${imageUrl}?${new Date().getTime()}`}
                alt="Profile"
                width={70}
                height={70}
                className="rounded-full"
              />
            )}
            <input type="file" onChange={handleImageChange} />
          </div>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Nickname"
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
