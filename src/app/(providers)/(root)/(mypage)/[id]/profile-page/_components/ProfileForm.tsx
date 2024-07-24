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

      // 기존 이미지 삭제
      const existingImagePath = profile?.avatar?.split('/').pop();
      if (existingImagePath && existingImagePath !== fileName) {
        await supabase.storage.from('users').remove([`profile_images/${existingImagePath}`]);
      }

      // 새로운 이미지 업로드
      const { error: uploadError } = await supabase.storage.from('users').upload(filePath, file, {
        upsert: true
      });

      if (uploadError) return;

      const { data: publicUrlData } = supabase.storage.from('users').getPublicUrl(filePath);

      if (!publicUrlData) return;

      setImageUrl(publicUrlData.publicUrl);
      await axios.put(API_MYPAGE_PROFILE(userId), { id: userId, avatar: publicUrlData.publicUrl });
      // 프로필 이미지를 다시 가져와서 상태를 업데이트
      setImageUrl(publicUrlData.publicUrl);
    }
  };

  const fetchProfile = async () => {
    const response = await axios.get(API_MYPAGE_PROFILE(userId));
    const profileData = response.data;
    setProfile(profileData);
    setNickname(profileData.name);
    setEmail(profileData.email);
    setImageUrl(profileData.avatar);
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  return (
    <div>
      {profile ? (
        <form onSubmit={handleSubmit}>
          <button type="submit">Update Profile</button>
          <div>
            {imageUrl && (
              <Image
                className="rounded-full"
                src={`${imageUrl}?${new Date().getTime()}`}
                alt="Profile"
                width={70}
                height={70}
              />
            )}
            <p>{email}</p>
            <input type="file" onChange={handleImageChange} />
          </div>
          <p>닉네임</p>
          <input
            className="text-black"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Nickname"
          />
        </form>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ProfileForm;
