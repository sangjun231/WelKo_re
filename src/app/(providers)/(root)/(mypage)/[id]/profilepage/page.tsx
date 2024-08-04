'use client';

import ProfileForm from './_components/ProfileForm';
import { useParams } from 'next/navigation';

const ProfilePage = () => {
  const { id } = useParams() as { id: string };

  return (
    <div className="mx-[20px]">
      <ProfileForm userId={id} />
    </div>
  );
};

export default ProfilePage;
