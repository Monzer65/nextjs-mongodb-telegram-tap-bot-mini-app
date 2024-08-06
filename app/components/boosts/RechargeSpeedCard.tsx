"use client";
import {
  ChevronRightIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRef, useState } from "react";
const RechargeSpeedCard = () => {
  const [disabled, setDisabled] = useState(false);
  const handleBoosterClick = () => {};
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    console.log("Confirm clicked");
    handleCloseModal();
  };
  return (
    <div
      className={`flex justify-between items-center bg-gray-300 rounded-md shadow-md min-w-[250px] max-w-[400px] p-2 cursor-pointer ${
        disabled ? "opacity-50" : ""
      }`}
      onClick={() => !disabled && handleBoosterClick()}
    >
      <div className='flex items-center gap-2'>
        <Image
          src='/bolt.gif'
          alt='bolt gif'
          width={50}
          height={50}
          className='rounded-md object-fill'
        />
        <div>
          <p>Name</p>
          <div className='flex items-center text-yellow-600'>
            {disabled ? (
              <LockClosedIcon className='w-5' />
            ) : (
              <LockOpenIcon className='w-5' />
            )}
            <p>
              <span className='font-bold'>cost</span>{" "}
              <span className='text-gray-700 text-sm'>lvl 1</span>
            </p>
          </div>
        </div>
      </div>
      <ChevronRightIcon className='w-8' />
    </div>
  );
};

export default RechargeSpeedCard;
