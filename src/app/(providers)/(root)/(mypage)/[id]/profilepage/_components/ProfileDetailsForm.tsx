'use client';

import { useRouter } from 'next/navigation';

type ProfileDetailsFormProps = {
  nickname: string;
  setNickname: (nickname: string) => void;
  region: string;
  userId: string;
};

const ProfileDetailsForm = ({ nickname, setNickname, region, userId }: ProfileDetailsFormProps) => {
  const router = useRouter();

  const handleRegionClick = () => {
    router.replace(`/${userId}/profilepage/regionpage`);
  };

  return (
    <div className="mt-4">
      <div>
        <label className="block">nickname</label>
        <input
          className="w-full rounded border px-3 py-2 text-black"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <label className="block">my region</label>
        <button className="w-full rounded border bg-gray-200 px-3 py-2 text-black" onClick={handleRegionClick}>
          {region || 'Set your region'}
        </button>
      </div>
    </div>
  );
};

export default ProfileDetailsForm;
