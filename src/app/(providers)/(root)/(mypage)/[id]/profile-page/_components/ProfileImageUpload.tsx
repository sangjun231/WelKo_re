'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

type ProfileImageUploadProps = {
  userId: string;
  imageUrl: string;
  onImageChange: (newImageUrl: string) => void;
};

const ProfileImageUpload = ({ userId, imageUrl, onImageChange }: ProfileImageUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const supabase = createClient();

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `profile_images/${fileName}`;

      const existingImagePath = imageUrl?.split('/').pop();
      if (existingImagePath && existingImagePath !== fileName) {
        await supabase.storage.from('users').remove([`profile_images/${existingImagePath}`]);
      }

      const { error: uploadError } = await supabase.storage.from('users').upload(filePath, file, {
        upsert: true
      });

      if (uploadError) return;

      const { data: publicUrlData } = supabase.storage.from('users').getPublicUrl(filePath);
      if (!publicUrlData) return;

      onImageChange(publicUrlData.publicUrl);
    }
  };

  return (
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
      <div className="mt-2">
        <div className="mt-1 flex items-center">
          <label className="cursor-pointer rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
            <span>Select File</span>
            <input type="file" className="hidden" onChange={handleImageChange} />
          </label>
          {selectedFile && <span className="ml-2">{selectedFile}</span>}
        </div>
      </div>
    </div>
  );
};

export default ProfileImageUpload;
