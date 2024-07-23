'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client'; 

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetCode, setResetCode] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // URL에서 resetCode를 추출
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');

    if (code) {
      setResetCode(code);
      setShowResetForm(true);
    } else {
      setError('Invalid or missing reset code.');
    }
  }, []);

  useEffect(() => {
    // 인증 상태 변경 감지
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setShowResetForm(true);
      }
    });

    // 컴포넌트 언마운트 시 리스너 정리
    return () => {
      if (authListener && typeof (authListener as any).unsubscribe === 'function') {
        (authListener as any).unsubscribe();
      }
    };
  }, [supabase]);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!resetCode) {
      setError('Reset code is missing.');
      return;
    }

    try {
      // 비밀번호 재설정 요청
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        console.error('Update Error:', updateError.message); // 콘솔에 자세한 오류 메시지 출력
        setError('Failed to update password. Please try again.');
      } else {
        setMessage('Password updated successfully! You can now log in with your new password.');
        setNewPassword('');
        setConfirmPassword('');
        router.push('/'); // 홈 페이지로 리디렉션 또는 원하는 페이지로 이동
      }
    } catch (err) {
      console.error('Unexpected Error:', err); // 콘솔에 자세한 오류 메시지 출력
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : showResetForm ? (
          <>
            <h1 className="text-center text-2xl font-bold">Reset Your Password</h1>
            <form onSubmit={handleResetPassword}>
              <input
                type="password"
                placeholder="New Password"
                className="mb-4 w-full rounded border border-gray-300 p-2"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="mb-4 w-full rounded border border-gray-300 p-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit" className="mt-4 w-full rounded bg-red-500 p-2 text-white hover:bg-red-600">
                Reset Password
              </button>
            </form>
            {message && <p className="mt-4 text-center text-green-500">{message}</p>}
          </>
        ) : (
          <p className="text-center text-lg">Checking your authentication status...</p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
