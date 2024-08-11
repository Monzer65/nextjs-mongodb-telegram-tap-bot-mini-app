"use client";

import {
  coinsAtom,
  currentEnergyAtom,
  incrementByAtom,
  incrementByCostAtom,
  incrementSpeedAtom,
  incrementSpeedCostAtom,
  maxEnergyAtom,
  maxEnergyCostAtom,
  maxEnergyLevelAtom,
} from "@/app/components/Coin";
import Spinner from "@/app/components/Spinner";
import TimeCounter from "@/app/components/TimeCounter";
import { useTelegram } from "@/app/contexts/TelegramProvider";
import {
  incrementCoins,
  incrementCoinsPerTap,
  incrementMaxEnergyLimit,
  incrementRechargeSpeed,
} from "@/app/lib/actions";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { atom, useAtom } from "jotai";
import Image from "next/image";
import { useState, useCallback, useMemo, useEffect } from "react";

export const boostersAtom = atom([
  {
    name: "Free Energy",
    image: "/solar-energy.gif",
    maxLevels: 6,
    currentLevel: 1,
    cost: 0,
    disabled: false,
    isSaving: false,
  },
  {
    name: "Coins per Tap",
    image: "/tap-gesture.gif",
    maxLevels: 20,
    currentLevel: 1,
    cost: 500,
    disabled: false,
    isSaving: false,
  },
  {
    name: "Max Energy Limit",
    image: "/battery.gif",
    maxLevels: 20,
    currentLevel: 1,
    cost: 500,
    disabled: false,
    isSaving: false,
  },
  {
    name: "Recharge Speed",
    image: "/bolt.gif",
    maxLevels: 15,
    currentLevel: 1,
    cost: 3000,
    disabled: false,
    isSaving: false,
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
  const [maxEnergy, setMaxEnergy] = useAtom(maxEnergyAtom);
  const [maxEnergyLevel, setMaxEnergyLevel] = useAtom(maxEnergyLevelAtom);
  const [maxEnergyCost, setMaxEnergyCost] = useAtom(maxEnergyCostAtom);
  const [currentEnergy, setCurrentEnergy] = useAtom(currentEnergyAtom);
  const [incrementBy, setIncrementBy] = useAtom(incrementByAtom);
  const [incrementByCost, setIncrementByCost] = useAtom(incrementByCostAtom);
  const [incrementSpeed, setIncrementSpeed] = useAtom(incrementSpeedAtom);
  const [incrementSpeedCost, setIncrementSpeedCost] = useAtom(
    incrementSpeedCostAtom
  );
  const [boosters, setBoosters] = useAtom(boostersAtom);
  const [lastFreeEnergyTime, setLastFreeEnergyTime] = useState<number>(0);
  const [freeEnergyUses, setFreeEnergyUses] = useState<number>(0);
  const { user } = useTelegram();

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
    async (index: number) => {
      const booster = boosters[index];
      const cost = boosterCosts[index];

      if (isBoosterDisabled(booster, totalCount)) {
        return;
      }

      const updatedBoosters = [...boosters];
      updatedBoosters[index] = {
        ...booster,
        currentLevel: booster.currentLevel + 1,
        cost: booster.name === "Free Energy" ? 0 : booster.cost * 2,
        isSaving: true, // Set isSaving to true before the async operation
      };

      setBoosters(updatedBoosters);

      try {
        if (booster.name !== "Free Energy") {
          const newCount = totalCount - cost;
          setTotalCount(newCount);
          await incrementCoins(user?.id || 1, -cost);
        }

        switch (booster.name) {
          case "Free Energy":
            setLastFreeEnergyTime(Date.now());
            setFreeEnergyUses((uses) => uses + 1);
            setCurrentEnergy(maxEnergy);
            break;
          case "Coins per Tap":
            const newIncrementBy = incrementBy + 1;
            const newIncrementByCost = incrementByCost * 2;
            setIncrementBy(newIncrementBy);
            setIncrementByCost(newIncrementByCost);
            await incrementCoinsPerTap(
              user?.id || 1,
              newIncrementBy,
              newIncrementByCost
            );
            break;
          case "Max Energy Limit":
            const newMaxEnergy = maxEnergy + 500;
            const newMaxEnergyLevel = maxEnergyLevel + 1;
            const newMaxEnergyCost = maxEnergyCost * 2;
            setMaxEnergy(newMaxEnergy);
            setMaxEnergyLevel(newMaxEnergyLevel);
            setMaxEnergyCost(newMaxEnergyCost);
            await incrementMaxEnergyLimit(
              user?.id || 1,
              newMaxEnergy,
              newMaxEnergyLevel,
              newMaxEnergyCost
            );
            break;
          case "Recharge Speed":
            const newIncrementSpeed = incrementSpeed + 1;
            const newIncrementSpeedCost = incrementSpeedCost * 2;
            setIncrementSpeed(newIncrementSpeed);
            setIncrementSpeedCost(newIncrementSpeedCost);
            await incrementRechargeSpeed(
              user?.id || 1,
              newIncrementSpeed,
              newIncrementSpeedCost
            );
            break;
          default:
            break;
        }
      } finally {
        // Ensure isSaving is set to false after the async operation completes
        setBoosters((prevBoosters) => {
          const updatedBoosters = [...prevBoosters];
          updatedBoosters[index].isSaving = false;
          return updatedBoosters;
        });
      }
    },
    [
      user?.id,
      boosters,
      boosterCosts,
      totalCount,
      maxEnergy,
      maxEnergyLevel,
      maxEnergyCost,
      incrementBy,
      incrementByCost,
      incrementSpeed,
      incrementSpeedCost,
      setBoosters,
      setTotalCount,
      setMaxEnergy,
      setMaxEnergyLevel,
      setMaxEnergyCost,
      setCurrentEnergy,
      setIncrementBy,
      setIncrementByCost,
      setIncrementSpeed,
      setIncrementSpeedCost,
      isBoosterDisabled,
    ]
  );

  useEffect(() => {
    // Set the initial level of "Coins per Tap" booster based on incrementBy
    const updatedBoosters = boosters.map((booster) => {
      if (booster.name === "Coins per Tap") {
        return {
          ...booster,
          currentLevel: incrementBy || 1,
          cost: incrementByCost || 500,
        };
      } else if (booster.name === "Recharge Speed") {
        return {
          ...booster,
          currentLevel: incrementSpeed || 1,
          cost: incrementSpeedCost || 500,
        };
      } else if (booster.name === "Max Energy Limit") {
        return {
          ...booster,
          currentLevel: maxEnergyLevel || 1,
          cost: maxEnergyCost || 500,
        };
      }
      return booster;
    });

    setBoosters(updatedBoosters);
  }, [
    maxEnergyLevel,
    maxEnergyCost,
    incrementBy,
    incrementByCost,
    incrementSpeed,
    incrementSpeedCost,
    setBoosters,
  ]);

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
            {booster.isSaving && (
              <div className='flex gap-1 text-xs bg-gray-100 p-1 rounded-md fixed top-2 left-2'>
                <Spinner size={5} />
                Saving ...
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoostPage;
