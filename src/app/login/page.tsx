'use client';
import { handleLogin, handleSignUp } from '@/utils/supabase/service';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const onLogin = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleLogin(email, password, router, setError);
  };

  const onSignUp = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleSignUp(email, password, nickname, router, setError);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h1 className="text-center text-2xl font-bold">{isSignUp ? 'Create Account' : 'Sign In'}</h1>
        <div className="social-container my-4 flex justify-center">
          <a href="#" className="mx-1 rounded-full border border-gray-300 p-2">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="mx-1 rounded-full border border-gray-300 p-2">
            <i className="fab fa-google-plus-g"></i>
          </a>
          <a href="#" className="mx-1 rounded-full border border-gray-300 p-2">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
        <span className="mb-4 block text-center text-sm text-gray-500">or use your email for registration</span>
        {isSignUp && (
          <input
            type="text"
            placeholder="Nickname"
            className="mb-2 w-full rounded border border-gray-300 p-2"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          className="mb-2 w-full rounded border border-gray-300 p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-2 w-full rounded border border-gray-300 p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={isSignUp ? onSignUp : onLogin}
          className="mt-4 w-full rounded bg-red-500 p-2 text-white hover:bg-red-600"
        >
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
        <p className="mt-4 text-center">
          {isSignUp ? 'Already have an account?' : 'Don’t have an account?'}{' '}
          <button onClick={toggleForm} className="text-red-500 underline">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
