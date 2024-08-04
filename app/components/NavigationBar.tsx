"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  CircleStackIcon,
  HomeIcon,
  RocketLaunchIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className='sticky bottom-0 left-0 right-0 '>
      <ul className='flex justify-between text-xs bg-gray-700 text-white'>
        <li className={`${pathname === "/bot" ? "bg-gray-900" : ""}`}>
          <Link
            className={`flex flex-col items-center justify-center gap-1 py-2 px-4 `}
            href='/bot'
          >
            <HomeIcon className='w-6 text-blue-400' />
            Home
          </Link>
        </li>
        <li>
          <ul className='flex gap-1'>
            <li
              className={`${pathname === "/bot/friends" ? "bg-gray-900" : ""}`}
            >
              <Link
                href='/bot/friends'
                // className=''
                className={`flex flex-col items-center justify-center gap-1 py-2 px-4 `}
              >
                <UserGroupIcon className='w-6 text-purple-400' />
                <p className='mt-1'>Friends</p>
              </Link>
            </li>
            <li className={`${pathname === "/bot/mine" ? "bg-gray-900" : ""}`}>
              <Link
                href='/bot/mine'
                className={`flex flex-col items-center justify-center gap-1 py-2 px-4`}
              >
                <Image
                  src='/mine.svg'
                  alt='mine'
                  width={20}
                  height={20}
                  draggable={false}
                  className='w-6 filter-green'
                />
                <p className='mt-1'>Mine</p>
              </Link>
            </li>
            <li className={`${pathname === "/bot/earn" ? "bg-gray-900" : ""}`}>
              <Link
                href='/bot/earn'
                className={`flex flex-col items-center justify-center gap-1 py-2 px-4 `}
              >
                <CircleStackIcon className='w-6 text-yellow-400' />
                <p className='mt-1'>Earn</p>
              </Link>
            </li>
          </ul>
        </li>
        <li className={`${pathname === "/bot/boost" ? "bg-gray-900" : ""}`}>
          <Link
            href='/bot/boost'
            className={`flex flex-col items-center justify-center gap-1 py-2 px-4 `}
          >
            <RocketLaunchIcon className='w-6 text-rose-400' />
            Boost
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavLinks;
