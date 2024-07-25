'use client';

import ProfileForm from './_components/ProfileForm';
import { useParams, useRouter } from 'next/navigation';

const ProfilePage = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <div className="flex items-start justify-between">
        <button onClick={handleBack}>Go Back</button>
        <h1>Edit Profile</h1>
        <ProfileForm userId={id} />
      </div>
    </div>
  );
};

export default ProfilePage;
