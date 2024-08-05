'use client';

import { useEffect, useState } from 'react';
import Search from '../Search/Search';
import Link from 'next/link';
import { handleLogout } from '@/utils/supabase/service';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';

function Header() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      setIsLoggedIn(session !== null);

      if (session) {
        const user = session.user;
        setUserId(user?.id ?? null);
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
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const logout = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    await handleLogout(router);
  };

  if (loading) {
    return null;
  }

  const uuid = uuidv4();

  return (
    <>
      <div className="hidden sm:block">
        <div className="flex justify-between">
          <h1>LOGO</h1>
          {isLoggedIn ? (
            <div className="relative mr-5 flex">
              <Link href={`/postpage/${uuid}`}>
                <button className="flex items-center space-x-2 rounded-md border-l-stone-400">Writing</button>
              </Link>
              <Link href={`/${userId}/mypage`}>
                <button className="flex items-center space-x-2 rounded-md border-l-stone-400">MyPage</button>
              </Link>
              <button onClick={logout} className="flex items-center space-x-2 rounded-md border-l-stone-400">
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button>Sign in or Sign up</button>
            </Link>
          )}
        </div>
        <Search />
      </div>

      <div className="block sm:hidden">
        <div className="flex items-center justify-center">
          <Search />
        </div>
      </div>
    </>
  );
}

export default Header;
