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
    <div className="my-[32px] flex flex-col gap-[24px]">
      <div>
        <label className="text-[16px] font-medium">Nickname</label>
        <input
          className="mt-[8px] w-full rounded-2xl border bg-grayscale-50 p-[16px] text-[16px] font-medium text-grayscale-900"
          type="text"
          placeholder="Write your nickname"
          defaultValue={''}
          onBlur={(e) => setNickname(e.target.value)}
        />
      </div>
      <div>
        <label className="text-[16px] font-medium">Location</label>
        <button
          className="mt-[8px] flex w-full items-start rounded-2xl border bg-grayscale-50 p-[16px] text-[16px] text-grayscale-900"
          onClick={handleRegionClick}
        >
          {region || 'Set your region'}
        </button>
      </div>
    </div>
  );
};

export default ProfileDetailsForm;
