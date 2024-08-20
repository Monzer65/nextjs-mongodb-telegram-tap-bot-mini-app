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
    <nav className='sticky bottom-0 left-0 right-0 z-50 mt-auto'>
      <ul className='flex text-xs bg-gray-700 text-white'>
        <li className={`${pathname === "/bot/clicker" ? "bg-gray-900" : ""}`}>
          <Link
            className={`grid place-items-center p-2`}
            href='/bot/clicker'
            passHref
          >
            <HomeIcon className='w-6 text-blue-400' />
            Home
          </Link>
        </li>
        <li className='mx-auto'>
          <ul className='flex gap-1'>
            <li
              className={`${
                pathname === "/bot/clicker/friends" ? "bg-gray-900" : ""
              }`}
            >
              <Link
                href='/bot/clicker/friends'
                className={`grid place-items-center p-2`}
                passHref
              >
                <UserGroupIcon className='w-6 text-purple-400' />
                <p className='mt-1'>Friends</p>
              </Link>
            </li>
            <li
              className={`${
                pathname === "/bot/clicker/mine" ? "bg-gray-900" : ""
              }`}
            >
              <Link
                href='/bot/clicker/mine'
                className={`grid place-items-center p-2`}
                passHref
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
            <li
              className={`${
                pathname === "/bot/clicker/earn" ? "bg-gray-900" : ""
              }`}
            >
              <Link
                href='/bot/clicker/earn'
                className={`grid place-items-center p-2`}
                passHref
              >
                <CircleStackIcon className='w-6 text-yellow-400' />
                <p className='mt-1'>Earn</p>
              </Link>
            </li>
          </ul>
        </li>
        <li
          className={`${
            pathname === "/bot/clicker/boost" ? "bg-gray-900" : ""
          }`}
        >
          <Link
            href='/bot/clicker/boost'
            className={`grid place-items-center p-2`}
            passHref
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
