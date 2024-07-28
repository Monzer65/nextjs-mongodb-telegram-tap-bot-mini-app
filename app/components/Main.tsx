"use client";
import { MouseEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CurrencyYenIcon } from "@heroicons/react/24/outline";

export default function Main() {
  const [coinCount, setCoinCount] = useState(1000);
  const [coinPerTap, setCoinPerTap] = useState(10);
  const [energy, setEnergy] = useState(2532);
  const [maxEnergyToGo, setMaxEnergyToGo] = useState(6500);
  const coinRef = useRef<HTMLDivElement>(null);
  const lastClickTimeRef = useRef<number>(Date.now());

  const getCoordinatesFromEvent = (event: MouseEvent<HTMLDivElement>) => {
    return { x: event.pageX, y: event.pageY };
  };

  const handleCoinClick = (event: MouseEvent<HTMLDivElement>) => {
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
        setEnergy((prevEnergy) => Math.min(prevEnergy + 10, maxEnergyToGo));
      }
    }, 1000); // Check every second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [maxEnergyToGo]);

  return (
    <div className={`flex flex-col items-center max-w-[850px] m-auto`}>
      <div className='flex flex-col gap-8 items-center my-8'>
        <div className='flex items-center justify-center gap-2 text-4xl text-yellow-500 font-bold'>
          <CurrencyYenIcon className='w-8' />
          {coinCount.toLocaleString()}
        </div>
        <div
          ref={coinRef}
          onMouseDown={handleCoinClick}
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
      <div>
        <div className='w-full h-4 bg-gray-200 rounded-full mb-2'>
          <div
            className='h-full bg-yellow-500 rounded-full'
            style={{
              width: `${(energy / maxEnergyToGo) * 100}%`,
            }}
          ></div>
        </div>
        <div className='flex gap-4 px-4 py-2 rounded-md bg-black w-[200px]'>
          <span className='text-white text-2xl font-bold block w-[75px]'>
            {energy}
          </span>
          <span className='text-white text-large opacity-75 w-[75px]'>
            / {maxEnergyToGo}
          </span>
        </div>
      </div>
    </div>
  );
}
