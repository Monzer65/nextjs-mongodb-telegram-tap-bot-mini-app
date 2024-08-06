"use client";

import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useTelegram } from "../contexts/TelegramProvider";
import LoadingSpinner from "./LoadingSpinner";
import NavLinks from "./NavigationBar";
import LevelProgress from "./LevelProgress";
import EnergyProgress from "./EnergyProgress";
import { CurrencyYenIcon } from "@heroicons/react/24/outline";
import { IClickType } from "../types/types";
import { useBalanceStore } from "@/providers/balance-store-provider";

const BotMain = () => {
  const { user, webApp } = useTelegram();

  const {
    totalCoins,
    coinsPerClick,
    currentEnergy,
    maxEnergyLevel,
    chargingSpeed,
    incrementTotalCoins,
    decrementCurrentEnergy,
    incrementCurrentEnergy,
    incrementMaxEnergyLevel,
    setMultitapCost,
    setMultitapLevel,
    setRechargeSpeedCost,
    setRechargeSpeedLevel,
    setEnergyLimitCost,
    setEnergyLimitLevel,
    setDefaultTotalCoins,
    setDefaultmaxEnergyLevel,
    setDefaultlastFreeEnergyTime,
    setDefaultmultitapCost,
    setDefaultmultitapLevel,
    setDefaultrechargeSpeedCost,
    setDefaultrechargeSpeedLevel,
    setDefaultenergyLimitCost,
    setDefaultenergyLimitLevel,
  } = useBalanceStore((state) => state);

  const getCloudStorageItems = useCallback(
    (keys: string[]) => {
      return new Promise((resolve, reject) => {
        webApp?.CloudStorage.getItems(keys, (err, values) => {
          if (err) {
            reject(err);
          } else {
            resolve(values);
          }
        });
      });
    },
    [webApp?.CloudStorage]
  );

  type BalanceStateStrings = {
    totalCoins: string;
    coinsPerClick: string;
    currentEnergy: string;
    chargingSpeed: string;
    maxEnergyLevel: string;
    freeEnergyClicks: string;
    lastFreeEnergyTime: string;
    multitapCost: string;
    multitapLevel: string;
    rechargeSpeedCost: string;
    rechargeSpeedLevel: string;
    energyLimitCost: string;
    energyLimitLevel: string;
  };

  const getInitialDataFromCloud = useCallback(async () => {
    try {
      const values = (await getCloudStorageItems([
        "totalCoins",
        "maxEnergyLevel",
        "freeEnergyClicks",
        "lastFreeEnergyTime",
        "multitapCost",
        "multitapLevel",
        "rechargeSpeedCost",
        "rechargeSpeedLevel",
        "energyLimitCost",
        "energyLimitLevel",
      ])) as BalanceStateStrings;

      console.log("vals:", values);

      if (values) {
        // Parse and set each value using store functions
        if (values.totalCoins !== undefined) {
          setDefaultTotalCoins(parseInt(values.totalCoins) || 0); // equivalent to incrementTotalCoins
        }
        if (values.maxEnergyLevel !== undefined) {
          setDefaultmaxEnergyLevel(parseInt(values.maxEnergyLevel) || 500);
        }
        // if (values.freeEnergyClicks !== undefined) {
        //   incrementFreeEnergyClicks(values.freeEnergyClicks || 0);
        // }
        // if (values.lastFreeEnergyTime !== undefined) {
        //   setLastFreeEnergyTime(values.lastFreeEnergyTime || Date.now());
        // }
        if (values.multitapCost !== undefined) {
          setDefaultmultitapCost(parseInt(values.multitapCost) || 10);
        }
        if (values.multitapLevel !== undefined) {
          setDefaultmultitapLevel(parseInt(values.multitapLevel) || 1);
        }
        if (values.rechargeSpeedCost !== undefined) {
          setDefaultrechargeSpeedCost(parseInt(values.rechargeSpeedCost) || 20);
        }
        if (values.rechargeSpeedLevel !== undefined) {
          setDefaultrechargeSpeedLevel(
            parseInt(values.rechargeSpeedLevel) || 1
          );
        }
        if (values.energyLimitCost !== undefined) {
          setDefaultenergyLimitCost(parseInt(values.energyLimitCost) || 30);
        }
        if (values.energyLimitLevel !== undefined) {
          setDefaultenergyLimitLevel(parseInt(values.energyLimitLevel) || 1);
        }
      }
    } catch (error) {
      console.error("error loading cloud storage data");
    }
  }, [
    setDefaultTotalCoins,
    setDefaultmaxEnergyLevel,
    setDefaultmultitapCost,
    setDefaultmultitapLevel,
    setDefaultrechargeSpeedCost,
    setDefaultrechargeSpeedLevel,
    setDefaultenergyLimitCost,
    setDefaultenergyLimitLevel,
    getCloudStorageItems,
  ]);

  useEffect(() => {
    getInitialDataFromCloud();
  }, [getInitialDataFromCloud]);

  const [clickList, setClickList] = useState<IClickType[]>([]);

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
    incrementTotalCoins(coinsPerClick);
    decrementCurrentEnergy();
  };

  const handleAnimationEnd = (id: number) => {
    setClickList((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };

  useEffect(() => {
    if (currentEnergy === maxEnergyLevel) return;
    const interval = setInterval(() => {
      incrementCurrentEnergy(chargingSpeed);
    }, 1000);

    return () => clearInterval(interval);
  }, [
    currentEnergy,
    maxEnergyLevel,
    chargingSpeed,
    coinsPerClick,
    incrementCurrentEnergy,
  ]);

  const calculateLevelAndProgress = useCallback(
    (coins: number): { level: number; progress: number } => {
      const levelMinPoints = [
        0, 3162, 10000, 31623, 1000000, 316227, 1000000, 3162277, 10000000,
        100000000,
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

  const renderContent = () => {
    if (!user) {
      return <LoadingSpinner />;
    }

    if (webApp?.platform === "tdesktop-" || webApp?.platform === "weba-") {
      return (
        <div className='bg-slate-700 text-white text-4xl text-center p-4 min-h-screen'>
          Not working on Desktop! <br />
          Please use Telegram Mobile App
        </div>
      );
    }

    const { level, progress } = calculateLevelAndProgress(totalCoins);

    return (
      <div className='bg-gray-800 min-h-screen'>
        {/* fixed */}
        <div className=' text-white p-4'>
          <p className='text-sm'>
            Welcome{" "}
            <span className='font-bold'>{user?.first_name.toUpperCase()}</span>{" "}
          </p>

          <LevelProgress
            currentLevel={level}
            levelNames={levelNames}
            progress={progress}
          />
        </div>

        {/* fixed */}
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
        {clickList.map((click) => (
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
        ))}
      </div>
    );
  };

  return <div>{renderContent()}</div>;
};

export default BotMain;
