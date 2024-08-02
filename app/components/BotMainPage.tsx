"use client";

import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  BoltIcon,
  CircleStackIcon,
  CurrencyDollarIcon,
  CurrencyYenIcon,
  DevicePhoneMobileIcon,
  GlobeAmericasIcon,
  HomeIcon,
  RocketLaunchIcon,
  TvIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useTelegram } from "../contexts/TelegramProvider";
import LoadingSpinner from "./LoadingSpinner";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLinks } from "./NavigationBar";

export default function BotMain() {
  const { user, webApp } = useTelegram();
  console.log("user:", user);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>(
    []
  );

  const [coinCount, setCoinCount] = useState(0);
  const [energy, setEnergy] = useState(1);
  const [coinPerTap, setCoinPerTap] = useState(1);
  const [maxEnergy, setMaxEnergy] = useState(500);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const coinRef = useRef<HTMLImageElement>(null);

  const levelNames = [
    "Novice Navigator", // From 0 to 4999 coins
    "Apprentice Achiever", // From 5000 coins to 24,999 coins
    "Skill Seeker", // From 25,000 coins to 99,999 coins
    "Craftsmen Champion", // From 100,000 coins to 999,999 coins
    "Expert Explorer", // From 1,000,000 coins to 2,000,000 coins
    "Master of Mastery", // From 2,000,000 coins to 10,000,000 coins
    "Grandmaster", // From 10,000,000 coins to 50,000,000 coins
    "Legendary Pro", // From 50,000,000 coins to 100,000,000 coins
    "Epic Tycoon", // From 100,000,000 coins to 1,000,000,000 coins
    "Infinity Mogul", // From 1,000,000,000 coins to ∞
  ];

  const levelMinPoints = [
    0, 5000, 25000, 100000, 1000000, 2000000, 10000000, 50000000, 100000000,
    1000000000,
  ];

  const handleCoinClick = (e: MouseEvent<HTMLDivElement>) => {
    if (energy - coinPerTap < 0) {
      return;
    }

    const mainImage = e.currentTarget;
    const rect = mainImage.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mainImage.style.transform = `perspective(1000px) 
    rotateX(${-y / 10}deg) 
    rotateY(${x / 10}deg`;
    setTimeout(() => {
      mainImage.style.transform = "";
    }, 100);

    setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);
    setCoinCount((prev) => prev + coinPerTap);
    setEnergy((prev) => Math.max(prev - coinPerTap, 0));
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };

  const updateEnergy = useCallback(
    (elapsedTime: number) => {
      setEnergy((prev) => {
        const energyGain = Math.floor((elapsedTime / 1000) * coinPerTap);
        const newEnergy = Math.min(prev + energyGain, maxEnergy);

        // if (webApp?.CloudStorage) {
        //   webApp.CloudStorage.setItem("energy", newEnergy, (error) => {
        //     if (error) {
        //       console.error("Error storing value:", error);
        //     }
        //   });
        // }

        return newEnergy;
      });
    },
    [coinPerTap, maxEnergy]
  );

  // useEffect(() => {
  //   if (webApp?.CloudStorage) {
  //     webApp.CloudStorage.getItems(["coinCount", "energy"], (error, values) => {
  //       if (!error) {
  //         const coinCountValue = Number(values.coinCount) || 1000;
  //         const energyValue = Number(values.energy) || 1;
  //         setCoinCount(coinCountValue);
  //         setEnergy(energyValue);
  //         setLastUpdate(Date.now());
  //       } else {
  //         console.error("Error fetching items:", error);
  //       }
  //     });
  //   } else {
  //     console.error("webApp or webApp.CloudStorage is undefined");
  //   }
  // }, [webApp]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prev) => {
        const newEnergy = Math.min(prev + coinPerTap, maxEnergy);
        // if (webApp?.CloudStorage) {
        //   webApp.CloudStorage.setItem("energy", newEnergy, (error) => {
        //     if (error) {
        //       console.error("Error storing value:", error);
        //     }
        //   });
        // }
        return newEnergy;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [coinPerTap, maxEnergy, webApp?.CloudStorage]);

  const renderContent = () => {
    // if (!user) {
    //   return <LoadingSpinner />;
    // }

    if (webApp?.platform === "tdesktop-" || webApp?.platform === "weba-") {
      return (
        <div className='bg-slate-700 text-white text-4xl text-center p-4 h-screen'>
          Not working on Desktop! <br />
          Please use Telegram Mobile App
        </div>
      );
    }
    return (
      <div className='max-w-[850px] m-auto bg-gray-800'>
        <div className=' text-white font-bold p-4'>
          <div className='text-center'>
            <p className='text-sm'>Welcome {user?.first_name}</p>
            <p>You are a Legend</p>
          </div>

          <div className=''>
            <div className='flex justify-between'>
              <p>Your Level: 3</p>
              <p className='text-sm'>
                Next level: 4
                <span className='text-[#95908a]'>/ {levelNames.length}</span>
              </p>
            </div>
            <div className='bg-gradient-to-r from-red-500 from-10% via-orange-500 via-30% via-yellow-500 via-60% to-green-500 to-90% h-4 rounded-full'>
              <div
                className='float-right bg-gray-300 h-4 rounded-r-full'
                style={{ width: `30%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className=''>
          <div className='flex items-center justify-center gap-2 text-4xl text-yellow-500 font-bold'>
            <CurrencyYenIcon className='w-8' />
            {coinCount}
          </div>

          <Image
            ref={coinRef}
            onClick={handleCoinClick}
            src='/coin.png'
            alt='image'
            width={350}
            height={350}
            className='m-auto rounded-full focus:scale-[99%] select-none'
            draggable={false}
          />
        </div>

        {/* fixed */}
        <div className='flex items-center gap-2 mb-16 px-4 pb-4'>
          <div className='flex gap-2 text-white rounded-md'>
            <BoltIcon className='w-5 text-yellow-500' />
            <p className='font-bold'>{Math.floor(energy)}</p>/
            <p className=' opacity-75'>{maxEnergy}</p>
          </div>
          <div className='flex-1 h-4 bg-gray-200 rounded-full'>
            <div
              className='h-full bg-yellow-500 rounded-full'
              style={{
                width: `${(energy / maxEnergy) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* fixed */}
        <NavLinks />

        {/* fixed */}
        {clicks.map((click) => {
          const randomX = Math.floor(Math.random() * 21) - 10;
          return (
            <div
              key={click.id}
              className='absolute text-5xl font-bold opacity-0 text-yellow-500 pointer-events-none z-10'
              style={{
                top: `${click.y - 42}px`,
                left: `${click.x - 28}px`,
                animation: `float 1s ease-out`,
              }}
              onAnimationEnd={() => handleAnimationEnd(click.id)}
            >
              {coinPerTap}
            </div>
          );
        })}
      </div>
    );
  };

  return <div>{renderContent()}</div>;
}
