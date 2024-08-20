"use client";
import TimeCounter from "@/app/components/TimeCounter";
import { useUserState } from "@/app/states/userData";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { incrementCoinsPerTap, UpdateEnergy } from "../lib/actions";
import { TUserData } from "../types/types";

const Boosters = () => {
  const { data, setData } = useUserState(7);
  const [isDisabledFreeEnergy, setIsDisabledFreeEnergy] = useState(false);
  const [lastFreeEnergyTime, setLastFreeEnergyTime] = useState<Date | null>(
    null
  );
  const [isDisabledIncrementAmount, setIsDisabledIncrementAmount] =
    useState(false);

  const queryClient = useQueryClient();

  const updateCurrentEnergy = useMutation({
    mutationFn: async ({
      userId,
      energy,
    }: {
      userId: number;
      energy: number;
    }) => await UpdateEnergy(userId, energy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
  });

  const updateIncrementAmount = useMutation({
    mutationFn: async ({ userId }: { userId: number }) =>
      await incrementCoinsPerTap(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
  });

  useEffect(() => {
    if (data && !("error" in data)) {
      setLastFreeEnergyTime(new Date(data.last_time_free_energy_used));
      const incrementCost = data.increment_cost || 0;
      setIsDisabledIncrementAmount(data.coins < incrementCost);
    }
  }, [data]);
  useEffect(() => {
    const currentTime = new Date();
    const twoHoursInMilliseconds = 2 * 60 * 60 * 1000;
    const canUseFreeEnergy =
      !lastFreeEnergyTime ||
      currentTime.getTime() - lastFreeEnergyTime.getTime() >=
        twoHoursInMilliseconds;
    setIsDisabledFreeEnergy(!canUseFreeEnergy);
  }, [lastFreeEnergyTime]);

  if (data && "error" in data) {
    return <div>Error: {data.error}</div>;
  }

  const handleFreeEnergyClick = () => {
    if (data && !isDisabledFreeEnergy) {
      setData({
        ...data,
        current_energy: data.max_energy,
      });
      setLastFreeEnergyTime(new Date());
      updateCurrentEnergy.mutate({ userId: 7, energy: data.max_energy });
    }
  };

  const handleIncrementAmountClick = () => {
    if (data && !isDisabledIncrementAmount) {
      const currentLevel = data.increment_level + 1;
      const minCost = 0;
      const maxCost = 20000000;
      const totalLevels = 20;

      // Calculate cost using exponential growth
      const incrementCost = Math.round(
        minCost *
          Math.pow(maxCost / minCost, (currentLevel - 1) / (totalLevels - 1))
      );
      setData({
        ...data,
        coins: data.coins - data.increment_cost,
        increment_amount: data.increment_amount + 1,
        increment_level: data.increment_level + 1,
        increment_cost: incrementCost,
      });

      updateIncrementAmount.mutate({ userId: 7 });
    }
  };

  return (
    <div className='text-gray-800'>
      <pre className='text-white'>{JSON.stringify(data, null, 3)}</pre>

      <div
        className={`flex justify-between bg-white rounded-lg shadow-md overflow-hidden p-4 ${
          isDisabledFreeEnergy
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
        onClick={handleFreeEnergyClick}
      >
        <div className='flex gap-1 items-center justify-center'>
          <Image
            src='/solar-energy.gif'
            alt='solar energy'
            width={50}
            height={50}
            className='mx-auto mb-4'
          />
          <div className='text-center'>
            <h3 className='text-xl font-bold mb-2'>Free Energy</h3>
            <div className='flex'>
              <p className='text-sm'>Next free energy in:</p>
              <TimeCounter
                lastFreeEnergyTime={
                  lastFreeEnergyTime ? lastFreeEnergyTime.getTime() : 0
                }
              />
            </div>
          </div>
        </div>

        <ChevronRightIcon className='w-6' />
      </div>

      <div
        className={`flex justify-between bg-white rounded-lg shadow-md overflow-hidden p-4 ${
          isDisabledIncrementAmount
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
        onClick={handleIncrementAmountClick}
      >
        <div className='flex gap-1 items-center justify-center'>
          <Image
            src='/tap-gesture.gif'
            alt='tap gesture'
            width={50}
            height={50}
            className='mx-auto mb-4'
          />
          <div className='text-center'>
            <h3 className='text-xl font-bold mb-2'>Increment Amount</h3>
            <div>
              <p className='text-sm mb-2'>Level: {data?.increment_level}/20</p>
              <p className='text-sm mb-2'>Cost: {data?.increment_cost} coins</p>
            </div>
          </div>
        </div>

        <ChevronRightIcon className='w-6' />
      </div>
    </div>
  );
};

export default Boosters;
