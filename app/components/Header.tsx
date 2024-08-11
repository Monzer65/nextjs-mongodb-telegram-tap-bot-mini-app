"use client";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { coinsAtom } from "./Coin";

const LEVELS = [
  { name: "Novice Navigator", minPoint: 0 },
  { name: "Apprentice Achiever", minPoint: 3162 },
  { name: "Skill Seeker", minPoint: 10000 },
  { name: "Craftsmen Champion", minPoint: 31623 },
  { name: "Expert Explorer", minPoint: 1000000 },
  { name: "Master of Mastery", minPoint: 316227 },
  { name: "Grandmaster", minPoint: 1000000 },
  { name: "Legendary Pro", minPoint: 3162277 },
  { name: "Epic Tycoon", minPoint: 10000000 },
  { name: "Infinity Mogul", minPoint: 100000000 },
];

const Header = ({ username }: { username: string }) => {
  const [currentLevel, setCurrentLevel] = useState(LEVELS[0]);
  const [totalCoins] = useAtom(coinsAtom);
  const calculateCurrentLevel = (coins: number) => {
    return LEVELS.reduce((acc, level, index) => {
      if (coins >= level.minPoint) {
        return index;
      }
      return acc;
    }, 0);
  };

  useEffect(() => {
    const currentLevelIndex = calculateCurrentLevel(totalCoins);
    setCurrentLevel(LEVELS[currentLevelIndex]);
  }, [totalCoins, setCurrentLevel]);

  const currentLevelIndex = LEVELS.indexOf(currentLevel);
  const nextLevel = LEVELS[currentLevelIndex + 1] || LEVELS[currentLevelIndex];
  const progress =
    ((totalCoins - currentLevel.minPoint) /
      (nextLevel.minPoint - currentLevel.minPoint)) *
    100;

  return (
    <div className='p-4 bg-gray-900 rounded-lg shadow-lg text-white'>
      <div className='mb-4'>
        <p className='text-lg font-semibold'>
          Welcome, <span className='font-bold'>{username.toUpperCase()}</span>
        </p>
        <p className='text-sm text-gray-400'>You are currently at:</p>
        <p className='text-xl font-bold'>{currentLevel.name}</p>
      </div>

      <div className='flex items-center justify-between mb-2 gap-2'>
        <p className='text-sm'>
          Next level:{" "}
          <span className='font-bold'>
            {currentLevelIndex === LEVELS.length - 1
              ? `${LEVELS.length}/${LEVELS.length}`
              : `${currentLevelIndex + 2}/${LEVELS.length}`}
          </span>
        </p>
        <p className='text-sm text-gray-400'>
          Progress: {Math.round(progress)}%
        </p>
      </div>

      <div className='w-full bg-gray-800 h-4 rounded-full overflow-hidden'>
        <div
          className='bg-gradient-to-r from-green-400 to-green-700 h-4'
          style={{ width: `${progress}%` }}
          aria-label='Level progress'
          aria-valuenow={progress}
        />
      </div>
    </div>
  );
};

export default Header;
