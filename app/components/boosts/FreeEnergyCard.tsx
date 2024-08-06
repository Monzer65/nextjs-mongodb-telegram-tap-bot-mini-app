"use client";
import {
  ChevronRightIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Modal from "../Modal";

const FreeEnergyCard = () => {
  const [disabled, setDisabled] = useState(false);
  const handleBoosterClick = () => {};

  const initialTime = 60 * 60;
  const [timeRemaining, setTimeRemaining] = useState(initialTime);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timerInterval);
          // Perform actions when the timer reaches zero
          console.log("Countdown complete!");
          return 0;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []); // The empty dependency array ensures the effect runs only once on mount

  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const body = {
    image: "/solar-energy.gif",
    name: "Free Energy",
    cost: 10,
  };

  return (
    <div
      className={`flex justify-between items-center bg-gray-300 rounded-md shadow-md min-w-[250px] max-w-[400px] p-2 cursor-pointer ${
        disabled ? "opacity-50" : ""
      }`}
      onClick={() => {
        !disabled && handleBoosterClick();
        handleOpenModal();
      }}
    >
      <div className='flex items-center gap-2'>
        <Image
          src='/solar-energy.gif'
          alt='solar power gif'
          width={50}
          height={50}
          className='rounded-md object-fill'
        />
        <div>
          <p>Free Energy</p>
          <div className='flex items-center text-yellow-600 gap-1'>
            {disabled ? (
              <LockClosedIcon className='w-5' />
            ) : (
              <LockOpenIcon className='w-5' />
            )}
            <p className='text-gray-700'>
              {disabled ? (
                <span className=' text-sm'>{`${hours}h ${minutes}m ${seconds}s`}</span>
              ) : (
                <span className='font-bold'>Good to go!</span>
              )}
            </p>
          </div>
        </div>
      </div>
      <ChevronRightIcon className='w-8' />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirm}
          header='Modal Title'
          body={body}
        />
      )}
    </div>
  );
};

export default FreeEnergyCard;
