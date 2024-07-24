"use client";
import { MouseEvent, TouchEvent, useEffect, useRef, useState } from "react";

import { EllipsisVerticalIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

export default function Home() {
  const [coinCount, setCoinCount] = useState(1000);
  const [coinPerTap, setCoinPerTap] = useState(10);
  const [energy, setEnergy] = useState(2532);
  const coinRef = useRef<HTMLDivElement>(null);
  const lastClickTimeRef = useRef<number>(Date.now());

  const getCoordinatesFromEvent = (
    event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ) => {
    if ("touches" in event) {
      // Touch event
      const touch = event.touches[0];
      return { x: touch.pageX, y: touch.pageY };
    } else {
      // Mouse event
      return { x: event.pageX, y: event.pageY };
    }
  };

  const handleCoinClick = (
    event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ) => {
    if (energy - coinPerTap < 0) {
      return;
    }
    setCoinCount(coinCount + coinPerTap);
    setEnergy(energy - coinPerTap < 0 ? 0 : energy - coinPerTap);
    const { x, y } = getCoordinatesFromEvent(event);

    if (coinRef.current) {
      const offset = coinRef.current.getBoundingClientRect();
      const top = offset.top + window.scrollY;
      const left = offset.left + window.scrollX;
      coinRef.current.style.transform = `scale(.99)`;
      const numberElement = document.createElement("div");
      numberElement.innerText = coinPerTap.toString();
      numberElement.style.position = "absolute";
      numberElement.style.left = `${x - left}px`;
      numberElement.style.top = `${y - top}px`;
      numberElement.classList.add("coin_number_per_tap");
      numberElement.style.fontSize = "16px";
      numberElement.style.zIndex = "9999";

      // Add a CSS transition for the animation
      numberElement.style.transition = "top 1s linear"; // Adjust the duration and easing as needed

      // Set the final position after a delay
      setTimeout(() => {
        numberElement.style.top = `${y - top - 150}px`; // Adjust the distance to move upward
      }, 0);

      // Remove the element after the animation completes
      setTimeout(() => {
        numberElement.remove();
      }, 1000);

      coinRef.current.appendChild(numberElement);
    }

    // Update the last click time
    lastClickTimeRef.current = Date.now();
  };

  const handleCoinMouseUp = () => {
    if (coinRef.current) {
      coinRef.current.style.transform = `scale(1)`;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      if (currentTime - lastClickTimeRef.current >= 1000) {
        setEnergy((prevEnergy) => Math.min(prevEnergy + 10, 6500));
      }
    }, 1000); // Check every second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return (
    <div className={`flex flex-col items-center max-w-[850px] m-auto`}>
      <header
        className={`w-full flex justify-between items-center px-4 py-2 bg-gray-200 shadow-md`}
      >
        <button className='text-gray-600 hover:text-gray-800'>
          <XMarkIcon className='w-5' />
        </button>
        <h1 className='text-xl font-bold'>CoinStone</h1>
        <button className='text-gray-600 hover:text-gray-800'>
          <EllipsisVerticalIcon className='w-5' />
        </button>
      </header>
      <div className='flex flex-col gap-8 items-center my-8'>
        <span className='text-4xl text-yellow-600 font-bold ml-2'>
          {coinCount.toLocaleString()}
        </span>
        <div
          ref={coinRef}
          onMouseDown={handleCoinClick}
          onTouchStart={handleCoinClick}
          onMouseUp={handleCoinMouseUp}
          onTouchEnd={handleCoinMouseUp}
          className='relative max-w-[60vw] rounded-full'
        >
          <Image
            src='/coin.jpg'
            alt='image'
            width={350}
            height={350}
            className='rounded-full w-full focus:scale-[99%] select-none'
            draggable={false}
          />
        </div>
      </div>
      <div className='flex gap-4 px-4 py-2 rounded-md bg-black w-[200px]'>
        <span className='text-white text-2xl font-bold block w-[75px]'>
          {energy}
        </span>
        <span className='text-white text-large opacity-75 w-[75px]'>
          / 6500
        </span>
      </div>
    </div>
  );
}
