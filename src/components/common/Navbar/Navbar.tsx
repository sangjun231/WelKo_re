'use client';

import { FaRegHeart } from 'react-icons/fa';
import { RiHome3Line } from 'react-icons/ri';
import { AiOutlineMessage } from 'react-icons/ai';
import { BsFillPlusCircleFill, BsPersonCircle } from 'react-icons/bs';
import Link from 'next/link';
import useAuthStore from '@/zustand/bearsStore';

function Navbar() {
  const user = useAuthStore((state) => state.user);
  return (
    <nav className="flex border-t border-[#DFDFE0] text-[#7A7A7A]">
      <div className="container mx-auto hidden items-center justify-between p-8 sm:flex">
        <Link href="/">
          <div className="flex flex-col items-center hover:text-[#BA68C8]">
            <RiHome3Line size={24} />
            <span className="text-[10px]">Home</span>
          </div>
        </Link>
        <Link href={`/${user?.id}/mypage`}>
          <div className="flex flex-col items-center hover:text-[#BA68C8]">
            <FaRegHeart size={24} />
            <span className="text-[10px]">Wishlist</span>
          </div>
        </Link>
        <Link href="/postpage">
          <div className="flex flex-col items-center">
            <BsFillPlusCircleFill size={40} style={{ color: '#BA68C8' }} className="" />
          </div>
        </Link>
        <Link href={`/${user?.id}/chatpage`}>
          <div className="flex flex-col items-center hover:text-[#BA68C8]">
            <AiOutlineMessage size={24} />
            <span className="text-[10px]">Messages</span>
          </div>
        </Link>
        <Link href={`/${user?.id}/mypage`}>
          <div className="flex flex-col items-center hover:text-[#BA68C8]">
            <BsPersonCircle size={24} />
            <span className="text-[10px]">Mypage</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
