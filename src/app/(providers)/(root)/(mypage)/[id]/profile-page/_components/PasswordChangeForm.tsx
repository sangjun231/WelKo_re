'use client';

import axios from 'axios';
import { useState } from 'react';
import { API_MYPAGE_PROFILE_PASSWORD } from '@/utils/apiConstants';

type PasswordChangeFormProps = {
  userId: string;
  email: string;
};

const PasswordChangeForm = ({ userId, email }: PasswordChangeFormProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await axios.put(
        API_MYPAGE_PROFILE_PASSWORD(userId),
        { currentPassword, newPassword },
        {
          headers: {
            'x-email': email
          }
        }
      );
      alert('Password changed successfully');
    } catch (error) {
      alert('Error changing password');
    }
  };

  return (
    <form onSubmit={handlePasswordChange}>
      <h2>Change Password</h2>
      <div>
        <input
          className="text-black"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current Password"
        />
      </div>
      <div>
        <input
          className="text-black"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
        />
      </div>
      <button type="submit">Change Password</button>
    </form>
  );
};

export default PasswordChangeForm;
