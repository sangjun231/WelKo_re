'use client';

import { IoCalendarOutline } from 'react-icons/io5';
import { RiHome3Line } from 'react-icons/ri';
import { AiOutlineMessage } from 'react-icons/ai';
import { BsFillPlusCircleFill, BsPersonCircle } from 'react-icons/bs';
import Link from 'next/link';
import useAuthStore from '@/zustand/bearsStore';
import { useMyPageStore } from '@/zustand/mypageStore';
import { useRouter } from 'next/navigation';

function Navbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setSelectedComponent = useMyPageStore((state) => state.setSelectedComponent);

  const handleReservationsClick = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setSelectedComponent('Reservations');
    router.push(`/${user?.id}/mypage`);
  };

  const handleLikesClick = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setSelectedComponent('likes');
    router.push(`/${user?.id}/mypage`);
  };

  const handleMessagesClick = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push(`/${user?.id}/chatpage`);
  };

  return (
    <nav className="flex border-t border-[#DFDFE0] text-[#7A7A7A]">
      <div className="container mx-auto hidden items-center justify-between p-8 sm:flex">
        <Link href="/">
          <div className="flex flex-col items-center hover:text-[#BA68C8]">
            <RiHome3Line size={24} />
            <span className="text-[10px]">Home</span>
          </div>
        </Link>
        <div
          onClick={handleReservationsClick}
          className="flex cursor-pointer flex-col items-center hover:text-[#BA68C8]"
        >
          <IoCalendarOutline size={24} />
          <span className="text-[10px]">Reservations</span>
        </div>
        <Link href="/postpage">
          <Link href="/postpage">
            <div className="flex flex-col items-center rounded-full shadow-[0px_8px_19px_rgba(0,0,0,0.17)]">
              <BsFillPlusCircleFill size={40} style={{ color: '#BA68C8' }} />
            </div>
          </Link>
        </Link>
        <div onClick={handleMessagesClick} className="flex cursor-pointer flex-col items-center hover:text-[#BA68C8]">
          <AiOutlineMessage size={24} />
          <span className="text-[10px]">Messages</span>
        </div>
        <div onClick={handleLikesClick} className="flex flex-col items-center hover:text-[#BA68C8]">
          <BsPersonCircle size={24} />
          <span className="text-[10px]">Mypage</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
