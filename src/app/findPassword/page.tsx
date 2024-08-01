'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client'; // Supabase 클라이언트 인스턴스 가정
import BackButton from '@/components/common/Button/BackButton';

const FindPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleFindPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3000/resetPassword' // vercel 할떄 바꿔야함
      });

      if (error) {
        setError('Failed to send reset email. Please try again.');
      } else {
        setMessage('Password reset email sent! Please check your inbox.');
        setEmail(''); // Clear email input
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center md:h-screen md:bg-gray-100">
      <div className="h-[800px] w-[360px] max-w-md bg-white px-5 md:w-full md:rounded-lg md:p-6 md:shadow-lg">
        <div className="mt-2 flex h-[44px] items-center pb-[16px] pt-3.5 md:hidden">
          <BackButton />
        </div>
        <h1 className="mt-[41px] text-center text-2xl font-bold">Find Password</h1>
        <span className="mb-8 mt-3 block text-center text-sm text-[#7D848D]">We’ll send you reset email</span>
        <form onSubmit={handleFindPassword}>
          <p className="mb-2 font-medium">Email</p>
          <input
            type="email"
            placeholder="example@google.com"
            className="mb-3 h-12 w-full rounded-xl bg-[#F7F7F9] p-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-[#B95FAB] px-5 py-3 font-semibold text-white hover:bg-[#b344a2]"
          >
            Send Reset Email
          </button>
        </form>
        {message && <p className="mt-4 text-center text-green-500">{message}</p>}
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default FindPassword;
