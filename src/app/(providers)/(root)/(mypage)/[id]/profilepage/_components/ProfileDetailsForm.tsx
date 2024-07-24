'use client';

type ProfileDetailsFormProps = {
  nickname: string;
  setNickname: (nickname: string) => void;
  location: string;
  setLocation: (location: string) => void;
};

const ProfileDetailsForm = ({ nickname, setNickname, location, setLocation }: ProfileDetailsFormProps) => {
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
        <input
          className="w-full rounded border px-3 py-2 text-black"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ProfileDetailsForm;
