'use client';

import ProfileForm from './_components/ProfileForm';
import { useParams, useRouter } from 'next/navigation';

const ProfilePage = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const handleBack = () => {
    router.replace(`/${id}/mypage`);
  };

  return (
    <div>
      <button onClick={handleBack}>Go Back</button>
      <div className="flex items-center justify-center">
        <div>
          <h1>Edit Profile</h1>
        </div>
      </div>
      <ProfileForm userId={id} />
    </div>
  );
};

export default ProfilePage;
