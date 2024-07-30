'use client';

import { IoCalendarOutline } from 'react-icons/io5';
import { RiHome3Line } from 'react-icons/ri';
import { AiOutlineMessage } from 'react-icons/ai';
import { BsFillPlusCircleFill, BsPersonCircle } from 'react-icons/bs';
import Link from 'next/link';
import useAuthStore from '@/zustand/bearsStore';
import { useMyPageStore } from '@/zustand/mypageStore';
import { usePathname, useRouter } from 'next/navigation';

function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const setSelectedComponent = useMyPageStore((state) => state.setSelectedComponent);

  const handleReservationsClick = () => {
    if (!user) {
      alert('로그인이 필요한 서비스입니다!!');
      router.push('/login');
      return;
    }
    setSelectedComponent('Reservations');
    router.push(`/${user?.id}/mypage`);
  };

  const handleLikesClick = () => {
    if (!user) {
      alert('로그인이 필요한 서비스입니다!!');
      router.push('/login');
      return;
    }
    setSelectedComponent('likes');
    router.push(`/${user?.id}/mypage`);
  };

  const handleMessagesClick = () => {
    if (!user) {
      alert('로그인이 필요한 서비스입니다!!');
      router.push('/login');
      return;
    }
    router.push(`/${user?.id}/chatpage`);
  };

  // 특정 경로에서 Navbar를 숨기기
  const excludedRoutes = ['/login','/postpage'];
  if (excludedRoutes.includes(pathname) || pathname.startsWith('/detail')) {
    return null;
  }

  return (
    <nav className="flex border-t border-[#DFDFE0] text-[#7A7A7A]">
      <div className="container mx-auto flex items-center justify-between p-8">
        <Link href="/">
          <div className="flex flex-col items-center space-y-2 hover:text-[#BA68C8]">
            <RiHome3Line size={24} />
            <span className="text-[10px]">Home</span>
          </div>
        </Link>
        <div
          onClick={handleReservationsClick}
          className="flex cursor-pointer flex-col items-center space-y-2 hover:text-[#BA68C8]"
        >
          <IoCalendarOutline size={24} />
          <span className="text-[10px]">Reservations</span>
        </div>
        <Link href="/postpage">
          <div className="flex flex-col items-center rounded-full shadow-[0px_8px_19px_rgba(0,0,0,0.17)]">
            <BsFillPlusCircleFill size={50} style={{ color: '#BA68C8' }} />
          </div>
        </Link>
        <div
          onClick={handleMessagesClick}
          className="flex cursor-pointer flex-col items-center space-y-2 hover:text-[#BA68C8]"
        >
          <AiOutlineMessage size={24} />
          <span className="text-[10px]">Messages</span>
        </div>
        <div
          onClick={handleLikesClick}
          className="flex cursor-pointer flex-col items-center space-y-2 hover:text-[#BA68C8]"
        >
          <BsPersonCircle size={24} />
          <span className="text-[10px]">Mypage</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
