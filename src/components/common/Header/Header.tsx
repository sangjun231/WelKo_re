'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import useAuthStore from '@/zustand/bearsStore';
import HeaderSearch from '../Search/HeaderSearch';
import Image from 'next/image';

function Header() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // 아바타 URL 상태 추가
  const { logout } = useAuthStore();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      setIsLoggedIn(session !== null);

      if (session) {
        const user = session.user;
        setUserId(user?.id ?? null);

        // 유저의 avatar URL 가져오기
        if (user) {
          const { data, error } = await supabase.from('users').select('avatar').eq('id', user.id).single();

          if (data && data.avatar) {
            setAvatarUrl(data.avatar); // 아바타 URL 설정
          }
        }
      }
      setLoading(false);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(session !== null);
      if (session) {
        setUserId(session.user?.id ?? null);
      } else {
        setUserId(null);
        setAvatarUrl(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const onLogout = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await logout(router);
  };

  if (loading) {
    return null;
  }

  const uuid = uuidv4();

  return (
    <>
      <div className="hidden py-5 sm:block">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="ml-[88px] text-2xl font-bold text-[#B95FAB]">Welko</h1>
            <div className="ml-6" style={{ width: '372px' }}>
              <HeaderSearch />
            </div>
          </div>
          <div className="mr-[88px] flex items-center gap-8">
            {isLoggedIn ? (
              <>
                <Link href={`/postpage/${uuid}`}>
                  <button className="text-base font-medium text-[#B95FAB]">Make Your Tour</button>
                </Link>
                <Link href={`/${userId}/mypage`}>
                  <button className="text-base font-medium">MyPage</button>
                </Link>
                <button onClick={onLogout} className="text-base font-medium">
                  Log Out
                </button>
                <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-300">
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt="User Avatar" fill objectFit="cover" />
                  ) : (
                    <span className="text-xs text-white">?</span>
                  )}
                </div>
              </>
            ) : (
              <Link href="/login">
                <button className="text-base font-medium">Log In</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
