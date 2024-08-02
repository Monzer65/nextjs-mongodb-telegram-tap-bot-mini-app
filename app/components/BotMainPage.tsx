"use client";

import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTelegram } from "../contexts/TelegramProvider";
import LoadingSpinner from "./LoadingSpinner";
import NavLinks from "./NavigationBar";
import LevelProgress from "./LevelProgress";
import EnergyProgress from "./EnergyProgress";
import { CurrencyYenIcon } from "@heroicons/react/24/outline";
import { IClickType } from "../types/types";

const BotMain = () => {
  const { user, webApp } = useTelegram();

  const [clickList, setClickList] = useState<IClickType[]>([]);
  const [totalCoins, setTotalCoins] = useState(0);
  const [coinsPerClick, setCoinsPerClick] = useState(1);
  const [currentEnergy, setCurrentEnergy] = useState(1);
  const [maxEnergyLevel, setMaxEnergyLevel] = useState(500);
  const [playerLeague, setPlayerLeague] = useState("Novice Navigator");

  const levelNames = useMemo(
    () => [
      "Novice Navigator",
      "Apprentice Achiever",
      "Skill Seeker",
      "Craftsmen Champion",
      "Expert Explorer",
      "Master of Mastery",
      "Grandmaster",
      "Legendary Pro",
      "Epic Tycoon",
      "Infinity Mogul",
    ],
    []
  );

  const handleCoinClick = (e: MouseEvent<HTMLDivElement>) => {
    if (currentEnergy - coinsPerClick < 0) {
      return;
    }

    const mainImage = e.currentTarget;
    const rect = mainImage.getBoundingClientRect();
    const clickX = e.clientX - rect.left - rect.width / 2;
    const clickY = e.clientY - rect.top - rect.height / 2;

    mainImage.style.transform = `perspective(1000px)
     rotateX(${-clickY / 10}deg)
     rotateY(${clickX / 10}deg`;
    setTimeout(() => {
      mainImage.style.transform = "";
    }, 100);

    setClickList([...clickList, { id: Date.now(), x: e.pageX, y: e.pageY }]);
    setTotalCoins((prev) => prev + coinsPerClick);
    setCurrentEnergy((prev) => Math.max(prev - coinsPerClick, 0));
  };

  const handleAnimationEnd = (id: number) => {
    setClickList((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEnergy((prev) => {
        const newEnergy = Math.min(prev + coinsPerClick, maxEnergyLevel);
        return newEnergy;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [coinsPerClick, maxEnergyLevel]);

  const calculateLevelAndProgress = useCallback(
    (coins: number): { level: number; progress: number } => {
      const levelMinPoints = [
        0, 50, 150, 300, 600, 1200, 2400, 4800, 9600, 19200,
      ];
      let currentLevel = 0;
      for (let i = 0; i < levelMinPoints.length; i++) {
        if (coins >= levelMinPoints[i]) {
          currentLevel = i;
        } else {
          break;
        }
      }

      const levelStart = levelMinPoints[currentLevel];
      const levelEnd = levelMinPoints[currentLevel + 1] || Infinity; // Handle last level
      const levelProgress =
        ((coins - levelStart) / (levelEnd - levelStart)) * 100;

      return { level: currentLevel, progress: levelProgress };
    },
    []
  );

  useEffect(() => {
    const { level } = calculateLevelAndProgress(totalCoins);
    setPlayerLeague(levelNames[level]);
  }, [totalCoins, levelNames, calculateLevelAndProgress]);

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

    const { level, progress } = calculateLevelAndProgress(totalCoins);

    return (
      <div className='max-w-[850px] m-auto bg-gray-800'>
        <div className=' text-white font-bold p-4'>
          <div className=''>
            <p className='text-sm'>Welcome {user?.first_name}</p>
          </div>

          <LevelProgress
            currentLevel={level}
            levelNames={levelNames}
            progress={progress}
          />
        </div>

        <div className=''>
          <div className='flex items-center justify-center gap-2 text-4xl text-yellow-500 font-bold'>
            <CurrencyYenIcon className='w-8' />
            {totalCoins}
          </div>

          <Image
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
        <EnergyProgress
          currentEnergy={currentEnergy}
          maxEnergyLevel={maxEnergyLevel}
        />
        {/* fixed */}
        <NavLinks />

        {/* fixed */}
        {clickList.map((click) => {
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
              {coinsPerClick}
            </div>
          );
        })}
      </div>
    );
  };

  return <div>{renderContent()}</div>;
};

export default BotMain;
