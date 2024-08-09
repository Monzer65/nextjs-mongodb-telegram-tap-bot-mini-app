"use client";

import { useState, useEffect, useRef } from "react";
import NavLinks from "@/app/components/NavigationBar";
import { useBalanceStore } from "@/providers/balance-store-provider";
import {
  ChevronRightIcon,
  CurrencyDollarIcon,
  LockClosedIcon,
  LockOpenIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { IBooster } from "@/app/types/types";
import { useTelegram } from "@/app/contexts/TelegramProvider";
import { BalanceActions, BalanceState } from "@/stores/balance";
import { useAtom } from "jotai";
import { coinsAtom } from "@/app/components/Coin";

const BoostPage = () => {
  const [balance] = useAtom(coinsAtom);
  // const {
  //   totalCoins,
  //   maxEnergyLevel,
  //   freeEnergyClicks,
  //   lastFreeEnergyTime,
  //   multitapCost,
  //   multitapLevel,
  //   rechargeSpeedCost,
  //   rechargeSpeedLevel,
  //   energyLimitCost,
  //   energyLimitLevel,
  //   decrementTotalCoins,
  //   incrementFreeEnergyClicks,
  //   setLastFreeEnergyTime,
  //   incrementChargingSpeed,
  //   incrementMaxEnergyLevel,
  //   incrementCoinsPerClick,
  //   incrementCurrentEnergy,
  //   setMultitapCost,
  //   setMultitapLevel,
  //   setRechargeSpeedCost,
  //   setRechargeSpeedLevel,
  //   setEnergyLimitCost,
  //   setEnergyLimitLevel,
  // } = useBalanceStore((state) => state);

  // const { user, webApp } = useTelegram();

  // const initialBoosters: IBooster[] = [
  //   {
  //     id: 1,
  //     name: "Free Energy",
  //     image: "/solar-energy.gif",
  //     cost: 0,
  //     level: freeEnergyClicks,
  //     disabled: false,
  //     onClick: async () => {
  //       showLoadingMessage("Using Free Energy booster...");
  //       try {
  //         incrementCurrentEnergy(maxEnergyLevel);
  //         incrementFreeEnergyClicks();
  //         setLastFreeEnergyTime();
  //         await updateCloudStorage("freeEnergyClicks", freeEnergyClicks + 1);
  //         await updateCloudStorage("lastFreeEnergyTime", Date.now());
  //         showSuccessMessage("Free Energy booster used successfully!");
  //       } catch (error) {
  //         showErrorMessage("Failed to use Free Energy booster.");
  //       }
  //     },
  //   },
  //   {
  //     id: 2,
  //     name: "Multitap",
  //     image: "/tap-gesture.gif",
  //     cost: multitapCost,
  //     level: multitapLevel,
  //     disabled: totalCoins < multitapCost,
  //     onClick: async (cost: number) => {
  //       showLoadingMessage("Upgrading Multitap booster...");
  //       try {
  //         decrementTotalCoins(cost);
  //         incrementCoinsPerClick(1);
  //         await updateCloudStorage("totalCoins", totalCoins - cost);
  //         await updateCloudStorage("multitapLevel", multitapLevel + 1);
  //         await updateCloudStorage(
  //           "multitapCost",
  //           Math.floor(multitapCost + multitapCost * 1.2)
  //         );
  //         showSuccessMessage("Multitap booster upgraded successfully!");
  //       } catch (error) {
  //         showErrorMessage("Failed to upgrade Multitap booster.");
  //       }
  //     },
  //   },
  //   {
  //     id: 3,
  //     name: "Recharge Speed",
  //     image: "/bolt.gif",
  //     cost: rechargeSpeedCost,
  //     level: rechargeSpeedLevel,
  //     disabled: totalCoins < rechargeSpeedCost,
  //     onClick: (cost: number) => {
  //       showLoadingMessage("Upgrading Recharge Speed booster...");
  //       decrementTotalCoins(cost);
  //       incrementChargingSpeed();
  //       showSuccessMessage("Recharge Speed booster upgraded successfully!");
  //     },
  //   },
  //   {
  //     id: 4,
  //     name: "Energy Limit",
  //     image: "/battery.gif",
  //     cost: energyLimitCost,
  //     level: energyLimitLevel,
  //     disabled: totalCoins < energyLimitCost,
  //     onClick: (cost: number) => {
  //       showLoadingMessage("Upgrading Energy Limit booster...");
  //       decrementTotalCoins(cost);
  //       incrementMaxEnergyLevel(500);
  //       showSuccessMessage("Energy Limit booster upgraded successfully!");
  //     },
  //   },
  // ];

  // const updateCloudStorage = (key: string, value: any) => {
  //   return new Promise((resolve, reject) => {
  //     webApp?.CloudStorage.setItem(key, value.toString(), (err, success) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(success);
  //       }
  //     });
  //   });
  // };

  // const [boosters, setBoosters] = useState<IBooster[]>(initialBoosters);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedBooster, setSelectedBooster] = useState<IBooster | null>(null);
  // const modalRef = useRef<HTMLDivElement>(null);
  // const [message, setMessage] = useState<{
  //   id: number;
  //   text: string;
  //   type: string;
  // } | null>(null);

  // const showMessage = (text: string, type: string) => {
  //   const id = Date.now();
  //   setMessage({ id, text, type });
  //   setTimeout(() => {
  //     setMessage(null);
  //   }, 5000);
  // };

  // const showLoadingMessage = (text: string) => showMessage(text, "loading");
  // const showSuccessMessage = (text: string) => showMessage(text, "success");
  // const showErrorMessage = (text: string) => showMessage(text, "error");

  // useEffect(() => {
  //   const now = Date.now();
  //   setBoosters((prevBoosters) =>
  //     prevBoosters.map((booster) => {
  //       if (booster.id === 1) {
  //         const timeElapsed = now - lastFreeEnergyTime;
  //         const twoHoursInMs = 2 * 60 * 60 * 1000;
  //         return {
  //           ...booster,
  //           disabled: timeElapsed < twoHoursInMs,
  //         };
  //       } else {
  //         return {
  //           ...booster,
  //           disabled: totalCoins < booster.cost,
  //         };
  //       }
  //     })
  //   );
  // }, [totalCoins, freeEnergyClicks, lastFreeEnergyTime]);

  // const handleBoosterClick = (booster: IBooster) => {
  //   setSelectedBooster(booster);
  //   setIsModalOpen(true);
  // };

  // const handleCloseModal = (e: React.MouseEvent) => {
  //   if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
  //     setIsModalOpen(false);
  //   }
  // };

  // const upgradeBooster = (id: number) => {
  //   setBoosters((prevBoosters) =>
  //     prevBoosters.map((booster) => {
  //       if (booster.id === id && booster.level < 20) {
  //         let newCost = 0;
  //         let newLevel = 1;
  //         if (id === 1) {
  //           newCost = freeEnergyClicks + 1;
  //           newLevel = booster.level + 1;
  //         } else if (id === 2) {
  //           newCost = Math.floor(multitapCost + multitapCost * 1.2);
  //           newLevel = multitapLevel + 1;
  //           setMultitapLevel(newLevel);
  //           setMultitapCost(newCost);
  //         } else if (id === 3) {
  //           newCost = Math.floor(rechargeSpeedCost + rechargeSpeedCost * 1.2);
  //           newLevel = rechargeSpeedLevel + 1;
  //           setRechargeSpeedLevel(newLevel);
  //           setRechargeSpeedCost(newCost);
  //         } else if (id === 4) {
  //           newCost = Math.floor(energyLimitCost + energyLimitCost * 1.2);
  //           newLevel = energyLimitLevel + 1;
  //           setEnergyLimitLevel(newLevel);
  //           setEnergyLimitCost(newCost);
  //         }
  //         return {
  //           ...booster,
  //           level: newLevel,
  //           cost: newCost,
  //           disabled: booster.id === 1 ? true : totalCoins < newCost,
  //         };
  //       }
  //       return booster;
  //     })
  //   );
  // };

  // const handleConfirmUpgrade = () => {
  //   if (selectedBooster && totalCoins >= selectedBooster.cost) {
  //     selectedBooster.onClick?.(selectedBooster.cost);
  //     upgradeBooster(selectedBooster.id);
  //     setIsModalOpen(false);
  //   }
  // };

  // const now = Date.now();
  // const twoHoursInSeconds = 2 * 60 * 60;

  // const [timeRemaining, setTimeRemaining] = useState(() => {
  //   const timeElapsed = Math.floor((now - lastFreeEnergyTime) / 1000); // Convert to seconds
  //   return Math.max(twoHoursInSeconds - timeElapsed, 0); // Ensure it doesn't go negative
  // });

  // useEffect(() => {
  //   const timerInterval = setInterval(() => {
  //     setTimeRemaining((prevTime) => {
  //       if (prevTime <= 0) {
  //         clearInterval(timerInterval);
  //         // Perform actions when the timer reaches zero
  //         console.log("Countdown complete!");
  //         return 0;
  //       } else {
  //         return prevTime - 1; // Decrease by 1 second
  //       }
  //     });
  //   }, 1000);

  //   return () => clearInterval(timerInterval); // Cleanup interval on component unmount
  // }, []);

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className='bg-gray-100 min-h-screen'>
      {/* <div className='flex flex-col items-center justify-center space-y-4 py-4'>
        <h1 className='text-2xl font-bold'>Boosters</h1>
        <div className='flex flex-col space-y-4'>
          {boosters.map((booster) => (
            <div
              key={booster.id}
              className={`relative p-4 border rounded-lg shadow-md cursor-pointer bg-white ${
                booster.disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => !booster.disabled && handleBoosterClick(booster)}
            >
              <Image
                src={booster.image}
                alt={booster.name}
                width={64}
                height={64}
                className='mx-auto mb-2'
              />
              <h2 className='text-center text-lg font-semibold'>
                {booster.name}
              </h2>
              <p className='text-center text-sm'>Cost: {booster.cost}</p>
              <p className='text-center text-sm'>Level: {booster.level}</p>
              {booster.id === 1 && booster.disabled && (
                <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-75'>
                  <div className='text-center'>
                    <p className='text-sm'>Next free energy in:</p>
                    <p className='text-lg font-semibold'>
                      {formatTime(timeRemaining)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {isModalOpen && (
          <div
            className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'
            onClick={handleCloseModal}
          >
            <div
              ref={modalRef}
              className='bg-white p-6 rounded-lg shadow-lg max-w-md w-full'
            >
              <h2 className='text-xl font-bold mb-4'>Upgrade Booster</h2>
              {selectedBooster && (
                <div>
                  <p className='mb-2'>
                    Are you sure you want to upgrade the{" "}
                    <strong>{selectedBooster.name}</strong> booster to level{" "}
                    <strong>{selectedBooster.level + 1}</strong> for{" "}
                    <strong>{selectedBooster.cost}</strong> coins?
                  </p>
                  <div className='flex justify-end space-x-4'>
                    <button
                      className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md'
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className='px-4 py-2 bg-blue-500 text-white rounded-md'
                      onClick={handleConfirmUpgrade}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div className='fixed top-2 left-0 p-4'>
          {message && (
            <div
              key={message.id}
              className={`p-2 text-white rounded text-xs ${
                message.type === "loading"
                  ? "bg-blue-500 flex items-center"
                  : message.type === "success"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              {message.type === "loading" && (
                <svg
                  className='w-5 h-5 mr-3 text-white animate-spin'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
              )}
              {message.text}
            </div>
          )}
        </div>
      </div> */}
      <p className='text-lg font-semibold'>{balance}</p>
      <p className='text-lg font-semibold'>{formatTime(2 * 60 * 60)}</p>
      <NavLinks />
    </div>
  );
};

export default BoostPage;
