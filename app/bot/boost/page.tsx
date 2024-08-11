"use client";

import {
  coinsAtom,
  currentEnergyAtom,
  incrementByAtom,
  incrementSpeedAtom,
  maxEnergyAtom,
} from "@/app/components/Coin";
import NavLinks from "@/app/components/NavigationBar";
import TimeCounter from "@/app/components/TimeCounter";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { atom, useAtom } from "jotai";
import Image from "next/image";
import { useState, useCallback, useMemo } from "react";

export const boostersAtom = atom([
  {
    name: "Free Energy",
    image: "/solar-energy.gif",
    maxLevels: 6,
    currentLevel: 1,
    cost: 0,
    disabled: false,
  },
  {
    name: "Coins per Tap",
    image: "/tap-gesture.gif",
    maxLevels: 20,
    currentLevel: 1,
    cost: 500,
    disabled: false,
  },
  {
    name: "Max Energy Limit",
    image: "/battery.gif",
    maxLevels: 20,
    currentLevel: 1,
    cost: 500,
    disabled: false,
  },
  {
    name: "Recharge Speed",
    image: "/bolt.gif",
    maxLevels: 15,
    currentLevel: 1,
    cost: 3000,
    disabled: false,
  },
]);

// Derived atoms for easier state management
export const currentBoosterLevelsAtom = atom((get) =>
  get(boostersAtom).map((booster) => booster.currentLevel)
);
export const currentBoosterCostsAtom = atom((get) =>
  get(boostersAtom).map((booster) => booster.cost)
);

const BoostPage = () => {
  const [totalCount, setTotalCount] = useAtom(coinsAtom);
  const [incrementBy, setIncrementBy] = useAtom(incrementByAtom);
  const [incrementSpeed, setIncrementSpeed] = useAtom(incrementSpeedAtom);
  const [maxEnergy, setMaxEnergy] = useAtom(maxEnergyAtom);
  const [currentEnergy, setCurrentEnergy] = useAtom(currentEnergyAtom);
  const [boosters, setBoosters] = useAtom(boostersAtom);
  const [lastFreeEnergyTime, setLastFreeEnergyTime] = useState<number>(0);
  const [freeEnergyUses, setFreeEnergyUses] = useState<number>(0);

  // Memoized calculations for level and cost
  const boosterLevels = useMemo(
    () => boosters.map((booster) => booster.currentLevel),
    [boosters]
  );

  const boosterCosts = useMemo(
    () => boosters.map((booster) => booster.cost),
    [boosters]
  );

  const isBoosterDisabled = useCallback(
    (booster: any, totalCount: number) => {
      if (booster.name === "Free Energy") {
        const now = Date.now();
        const timeSinceLastUse = now - lastFreeEnergyTime;
        const hoursSinceLastUse = timeSinceLastUse / (1000 * 60 * 60);
        return freeEnergyUses >= booster.maxLevels || hoursSinceLastUse < 2;
      }
      return (
        booster.cost > totalCount || booster.currentLevel >= booster.maxLevels
      );
    },
    [lastFreeEnergyTime, freeEnergyUses]
  );

  const handleBoosterClick = useCallback(
    (index: number) => {
      const booster = boosters[index];
      const cost = boosterCosts[index];

      if (isBoosterDisabled(booster, totalCount)) {
        return;
      }

      if (booster.name !== "Free Energy") {
        setTotalCount((prevCount) => prevCount - cost);
      }

      const updatedBoosters = [...boosters];
      updatedBoosters[index] = {
        ...booster,
        currentLevel: booster.currentLevel + 1,
        cost: booster.name === "Free Energy" ? 0 : booster.cost * 2,
      };

      if (booster.name === "Free Energy") {
        updatedBoosters[index].disabled = true;
        setLastFreeEnergyTime(Date.now());
        setFreeEnergyUses((uses) => uses + 1);
      }

      setBoosters(updatedBoosters);

      switch (booster.name) {
        case "Free Energy":
          setCurrentEnergy(maxEnergy);
          break;
        case "Coins per Tap":
          setIncrementBy((current) => current + 1);
          break;
        case "Max Energy Limit":
          setMaxEnergy((current) => current + 500);
          break;
        case "Recharge Speed":
          setIncrementSpeed((current) => current + 2);
          break;
        default:
          break;
      }
    },
    [
      boosters,
      totalCount,
      setTotalCount,
      setBoosters,
      setCurrentEnergy,
      maxEnergy,
      setIncrementBy,
      setMaxEnergy,
      setIncrementSpeed,
      boosterCosts,
      isBoosterDisabled,
    ]
  );

  return (
    <div className='container mx-auto px-4 py-8 max-w-md'>
      <h1 className='text-3xl font-bold text-center mb-4'>Boosters</h1>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-medium'>Your Balance:</h2>
        <strong className='text-xl font-bold'>{totalCount}</strong>
      </div>
      <div>
        <p>Current energy: {currentEnergy}</p>
        <p>Max energy: {maxEnergy}</p>
        <p>Coins per tap: {incrementBy}</p>
        <p>Recharge speed: {incrementSpeed}</p>
      </div>
      <div className='grid grid-cols-1 gap-4'>
        {boosters.map((booster, index) => (
          <div
            key={index}
            className={`flex justify-between bg-white rounded-lg shadow-md overflow-hidden p-4 cursor-pointer ${
              isBoosterDisabled(booster, totalCount)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() => handleBoosterClick(index)}
            aria-disabled={isBoosterDisabled(booster, totalCount)}
          >
            <div className='flex gap-1 items-center justify-center'>
              <Image
                src={booster.image}
                alt={booster.name}
                width={50}
                height={50}
                className='mx-auto mb-4'
              />
              <h3 className='text-xl font-bold mb-2'>{booster.name}</h3>

              {booster.name === "Free Energy" ? (
                <div className='text-center'>
                  <p className='text-sm'>Next free energy in:</p>
                  <TimeCounter lastFreeEnergyTime={lastFreeEnergyTime} />
                </div>
              ) : (
                <div>
                  <p className='text-sm mb-2'>
                    Level: {boosterLevels[index]}/{booster.maxLevels}
                  </p>
                  <p className='text-sm mb-2'>
                    Cost: {boosterCosts[index]} coins
                  </p>
                </div>
              )}
            </div>
            <button
              className={`bg-blue-500 hover:bg-blue-700 text-white ${
                isBoosterDisabled(booster, totalCount)
                  ? "disabled:opacity-50 disabled:cursor-not-allowed"
                  : ""
              }`}
              aria-label={`Upgrade ${booster.name}`}
            >
              <ChevronRightIcon className='w-6' />
            </button>
          </div>
        ))}
      </div>

      <NavLinks />
    </div>
  );
};

export default BoostPage;
