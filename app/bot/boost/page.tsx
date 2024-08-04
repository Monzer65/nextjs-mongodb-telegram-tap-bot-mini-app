"use client";
import { useState, useEffect, useRef } from "react";
import NavLinks from "@/app/components/NavigationBar";
import { useCounterStore } from "@/providers/counter-store-provider";
import {
  ChevronRightIcon,
  LockClosedIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { IBooster } from "@/app/types/types";

const BoostPage = () => {
  const {
    totalCoins,
    maxEnergyLevel,
    freeEnergyClicks,
    lastFreeEnergyTime,
    incrementFreeEnergyClicks,
    setLastFreeEnergyTime,
    incrementChargingSpeed,
    multitapCost,
    multitapLevel,
    rechargeSpeedCost,
    rechargeSpeedLevel,
    energyLimitCost,
    energyLimitLevel,
    decrementTotalCoins,
    incrementMaxEnergyLevel,
    incrementCoinsPerClick,
    incrementCurrentEnergy,
    setMultitapCost,
    setMultitapLevel,
    setRechargeSpeedCost,
    setRechargeSpeedLevel,
    setEnergyLimitCost,
    setEnergyLimitLevel,
  } = useCounterStore((state) => state);

  const initialBoosters: IBooster[] = [
    {
      id: 1,
      name: "Free Energy",
      image: "/solar-energy.gif",
      cost: 0,
      level: 1,
      disabled: false,
      onClick: () => {
        incrementCurrentEnergy(maxEnergyLevel);
        incrementFreeEnergyClicks();
        setLastFreeEnergyTime();
      },
    },
    {
      id: 2,
      name: "Multitap",
      image: "/tap-gesture.gif",
      cost: multitapCost,
      level: multitapLevel,
      disabled: totalCoins < multitapCost,
      onClick: (cost: number) => {
        decrementTotalCoins(cost);
        incrementCoinsPerClick(1);
      },
    },
    {
      id: 3,
      name: "Recharge Speed",
      image: "/bolt.gif",
      cost: rechargeSpeedCost,
      level: rechargeSpeedLevel,
      disabled: totalCoins < rechargeSpeedCost,
      onClick: (cost: number) => {
        decrementTotalCoins(cost);
        incrementChargingSpeed();
      },
    },
    {
      id: 4,
      name: "Energy Limit",
      image: "/battery.gif",
      cost: energyLimitCost,
      level: energyLimitLevel,
      disabled: totalCoins < energyLimitCost,
      onClick: (cost: number) => {
        decrementTotalCoins(cost);
        incrementMaxEnergyLevel(500);
      },
    },
  ];

  const [boosters, setBoosters] = useState<IBooster[]>(initialBoosters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooster, setSelectedBooster] = useState<IBooster | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(
      "freeEnergyClicks and lastFreeEnergyTime",
      freeEnergyClicks,
      lastFreeEnergyTime
    );
    const now = Date.now();
    setBoosters((prevBoosters) =>
      prevBoosters.map((booster) => {
        if (booster.id === 1) {
          const timeElapsed = now - lastFreeEnergyTime;
          const twoHoursInMs = 2 * 60 * 60 * 1000;
          return {
            ...booster,
            disabled: timeElapsed < twoHoursInMs,
          };
        } else {
          return {
            ...booster,
            disabled: totalCoins < booster.cost,
          };
        }
      })
    );
  }, [totalCoins, freeEnergyClicks, lastFreeEnergyTime]);

  const handleBoosterClick = (booster: IBooster) => {
    setSelectedBooster(booster);
    setIsModalOpen(true);
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsModalOpen(false);
    }
  };

  const upgradeBooster = (id: number) => {
    setBoosters((prevBoosters) =>
      prevBoosters.map((booster) => {
        if (booster.id === id && booster.level < 20) {
          let newCost = 0;
          let newLevel = 1;
          if (id === 1) {
            newCost = freeEnergyClicks + 1;
            newLevel = booster.level + 1;
          } else if (id === 2) {
            newCost = Math.floor(multitapCost + multitapCost * 1.2);
            newLevel = multitapLevel + 1;
            setMultitapLevel(newLevel);
            setMultitapCost(newCost);
          } else if (id === 3) {
            newCost = Math.floor(rechargeSpeedCost + rechargeSpeedCost * 1.2);
            newLevel = rechargeSpeedLevel + 1;
            setRechargeSpeedLevel(newLevel);
            setRechargeSpeedCost(newCost);
          } else if (id === 4) {
            newCost = Math.floor(energyLimitCost + energyLimitCost * 1.2);
            newLevel = energyLimitLevel + 1;
            setEnergyLimitLevel(newLevel);
            setEnergyLimitCost(newCost);
          }
          return {
            ...booster,
            level: newLevel,
            cost: newCost,
            disabled: booster.id === 1 ? true : totalCoins < newCost,
          };
        }
        return booster;
      })
    );
  };

  const handleConfirmUpgrade = () => {
    if (selectedBooster && totalCoins >= selectedBooster.cost) {
      selectedBooster.onClick?.(selectedBooster.cost);
      upgradeBooster(selectedBooster.id);
      setIsModalOpen(false);
    }
  };

  return (
    <div className='bg-gray-800 min-h-screen grid gap-4 place-items-center p-8'>
      <h2 className='text-white text-center mb-8'>
        Your Balance <br />
        <span className='font-bold text-4xl'>{totalCoins}</span>
      </h2>

      <h1 className='text-white font-bold'>Boosters</h1>

      {boosters.map((booster) => (
        <div
          key={booster.id}
          className={`flex justify-between items-center bg-gray-300 rounded-md shadow-md min-w-[250px] max-w-[400px] p-2 cursor-pointer ${
            booster.disabled ? "opacity-50" : ""
          }`}
          onClick={() => !booster.disabled && handleBoosterClick(booster)}
        >
          <div className='flex items-center gap-2'>
            <Image
              src={booster.image}
              alt={booster.name}
              width={50}
              height={50}
              className='rounded-md object-fill'
            />
            <div>
              <p>{booster.name}</p>
              <div className='flex items-center text-yellow-600'>
                <LockClosedIcon className='w-5' />
                <p>
                  <span className='font-bold'>{booster.cost}</span>{" "}
                  <span className='text-gray-700 text-sm'>
                    lvl {booster.level}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <ChevronRightIcon className='w-8' />
        </div>
      ))}

      {isModalOpen && selectedBooster && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'
          onClick={handleCloseModal}
        >
          <div ref={modalRef} className='bg-white rounded-md p-6 relative'>
            <button
              onClick={() => setIsModalOpen(false)}
              className='absolute top-2 right-2'
            >
              <XMarkIcon className='w-6' />
              <span className='sr-only'>Close modal</span>
            </button>
            <div className='grid place-items-center'>
              <Image
                src={selectedBooster.image}
                alt={selectedBooster.name}
                width={50}
                height={50}
                className='rounded-md object-fill'
              />
              <p>You want to upgrade the {selectedBooster.name} booster</p>
              <p>
                Cost to upgrade:{" "}
                <span className='text-yellow-500 font-bold'>
                  {selectedBooster.cost}
                </span>
              </p>
              <button
                onClick={handleConfirmUpgrade}
                className='mt-4 px-4 py-2 bg-blue-500 text-white rounded'
              >
                Upgrade
              </button>
            </div>
          </div>
        </div>
      )}

      <NavLinks />
    </div>
  );
};

export default BoostPage;
