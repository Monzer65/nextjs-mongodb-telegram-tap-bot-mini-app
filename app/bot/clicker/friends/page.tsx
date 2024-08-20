"use client";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

const FriendsPage = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6'>
      <Link
        href={"/bot/clicker"}
        className='text-black flex items-center place-self-start'
      >
        <ArrowLeftIcon className='w-8' />
        <span>Back to clicker</span>
      </Link>
      <div className='bg-white shadow-lg rounded-lg p-8 text-center max-w-md mx-auto'>
        <div className='mb-6'>
          <Image
            src='https://t3.ftcdn.net/jpg/03/53/83/92/360_F_353839266_8yqhN0548cGxrl4VOxngsiJzDgrDHxjG.jpg'
            alt='Under Construction'
            width={200}
            height={200}
            className='mx-auto mb-4'
          />
        </div>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>
          Under Construction
        </h1>
        <p className='text-gray-600 mb-4'>
          We&apos;re working hard to bring you something amazing. Stay tuned!
        </p>
        <div className='flex items-center justify-center space-x-4'>
          <Link
            href='/bot'
            className='bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300'
          >
            Home
          </Link>
          <Link
            href='/contact'
            className='bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition duration-300'
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
