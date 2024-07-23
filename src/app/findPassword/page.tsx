'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client'; // Supabase 클라이언트 인스턴스 가정

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
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h1 className="text-center text-2xl font-bold">Find Password</h1>
        <form onSubmit={handleFindPassword}>
          <input
            type="email"
            placeholder="Email"
            className="mb-4 w-full rounded border border-gray-300 p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="mt-4 w-full rounded bg-red-500 p-2 text-white hover:bg-red-600">
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
