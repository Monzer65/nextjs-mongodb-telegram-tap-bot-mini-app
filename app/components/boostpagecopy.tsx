"use client";

import {
  boostersAtom,
  coinsAtom,
  currentEnergyAtom,
  incrementByAtom,
  incrementByCostAtom,
  incrementSpeedAtom,
  incrementSpeedCostAtom,
  maxEnergyAtom,
  maxEnergyCostAtom,
  maxEnergyLevelAtom,
} from "@/app/lib/atoms";

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
import { useAtom } from "jotai";
import Image from "next/image";
import { useState, useCallback, useMemo, useEffect } from "react";

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
  const [lastFreeEnergyTime, setLastFreeEnergyTime] = useState(0);
  const [freeEnergyUses, setFreeEnergyUses] = useState(0);
  const { user } = useTelegram();

  // Memoized values for booster levels and costs
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
        const timeSinceLastUse = Date.now() - lastFreeEnergyTime;
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
      if (isBoosterDisabled(booster, totalCount)) return;

      const cost = boosterCosts[index];
      const updatedBoosters = boosters.map((item, i) =>
        i === index
          ? {
              ...item,
              currentLevel: item.currentLevel + 1,
              cost: item.name === "Free Energy" ? 0 : item.cost * 2,
              isSaving: true,
            }
          : item
      );

      setBoosters(updatedBoosters);

      try {
        if (booster.name !== "Free Energy") {
          setTotalCount((prevCount) => prevCount - cost);
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
            setIncrementBy(newIncrementBy);
            setIncrementByCost(incrementByCost * 2);
            await incrementCoinsPerTap(
              user?.id || 1,
              newIncrementBy,
              incrementByCost * 2
            );
            break;
          case "Max Energy Limit":
            const newMaxEnergy = maxEnergy + 500;
            setMaxEnergy(newMaxEnergy);
            setMaxEnergyLevel((prevLevel) => prevLevel + 1);
            setMaxEnergyCost(maxEnergyCost * 2);
            await incrementMaxEnergyLimit(
              user?.id || 1,
              newMaxEnergy,
              maxEnergyLevel + 1,
              maxEnergyCost * 2
            );
            break;
          case "Recharge Speed":
            const newIncrementSpeed = incrementSpeed + 1;
            setIncrementSpeed(newIncrementSpeed);
            setIncrementSpeedCost(incrementSpeedCost * 2);
            await incrementRechargeSpeed(
              user?.id || 1,
              newIncrementSpeed,
              incrementSpeedCost * 2
            );
            break;
          default:
            break;
        }
      } finally {
        setBoosters((prevBoosters) =>
          prevBoosters.map((item, i) =>
            i === index ? { ...item, isSaving: false } : item
          )
        );
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
    const updatedBoosters = boosters.map((booster) => {
      switch (booster.name) {
        case "Coins per Tap":
          return {
            ...booster,
            currentLevel: incrementBy || 1,
            cost: incrementByCost || 500,
          };
        case "Recharge Speed":
          return {
            ...booster,
            currentLevel: incrementSpeed || 1,
            cost: incrementSpeedCost || 500,
          };
        case "Max Energy Limit":
          return {
            ...booster,
            currentLevel: maxEnergyLevel || 1,
            cost: maxEnergyCost || 500,
          };
        default:
          return booster;
      }
    });

    setBoosters(updatedBoosters);
  }, [
    maxEnergyLevel,
    maxEnergyCost,
    incrementBy,
    incrementByCost,
    incrementSpeed,
    incrementSpeedCost,
    boosters,
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
