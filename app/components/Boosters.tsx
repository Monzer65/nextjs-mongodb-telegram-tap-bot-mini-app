"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import TimeCounter from "@/app/components/TimeCounter";
import { useUserState } from "@/app/states/userData";
import {
  incrementCoinsPerTap,
  incrementMaxEnergy,
  UpdateEnergy,
} from "../lib/actions";
import { playfairDisplayForHeadings } from "../lib/fonts";

const Boosters = () => {
  const { data, isLoading, isError, setData } = useUserState(7);

  const [isLoadingFreeEnergy, setIsLoadingFreeEnergy] = useState(false);
  const [isLoadingIncrementAmount, setIsLoadingIncrementAmount] =
    useState(false);
  const [isLoadingMaxEnergy, setIsLoadingMaxEnergy] = useState(false);

  const [isDisabledFreeEnergy, setIsDisabledFreeEnergy] = useState(false);
  const [isDisabledIncrementAmount, setIsDisabledIncrementAmount] =
    useState(false);
  const [isDisabledMaxEnergy, setIsDisabledMaxEnergy] = useState(false);

  const [lastFreeEnergyTime, setLastFreeEnergyTime] = useState<Date | null>(
    null
  );

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
    onSettled: () => setIsLoadingFreeEnergy(false),
  });

  const updateIncrementAmount = useMutation({
    mutationFn: async ({ userId }: { userId: number }) =>
      await incrementCoinsPerTap(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
    onSettled: () => setIsLoadingIncrementAmount(false),
  });

  const updateMaxEnergy = useMutation({
    mutationFn: async ({ userId }: { userId: number }) =>
      await incrementMaxEnergy(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
    onSettled: () => setIsLoadingMaxEnergy(false),
  });

  useEffect(() => {
    if (data && !("error" in data)) {
      setLastFreeEnergyTime(new Date(data.last_time_free_energy_used));

      setIsDisabledIncrementAmount(
        data.coins < data.increment_cost || data.increment_level >= 20
      );
      setIsDisabledMaxEnergy(
        data.coins < data.max_energy_cost || data.max_energy_level >= 20
      );
    }
  }, [data]);

  useEffect(() => {
    if (lastFreeEnergyTime) {
      const twoHoursInMilliseconds = 2 * 60 * 60 * 1000;
      const canUseFreeEnergy =
        new Date().getTime() - lastFreeEnergyTime.getTime() >=
        twoHoursInMilliseconds;
      setIsDisabledFreeEnergy(!canUseFreeEnergy);
    }
  }, [lastFreeEnergyTime]);

  if (isError) {
    return <div>Error: Fetching Data; Try again later</div>;
  }

  if (data && "error" in data) {
    return <div>Error: {data.error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const handleFreeEnergyClick = () => {
    if (data && !isDisabledFreeEnergy) {
      setIsLoadingFreeEnergy(true);
      const updatedEnergy = data.max_energy;

      setData({
        ...data,
        current_energy: updatedEnergy,
      });
      setLastFreeEnergyTime(new Date());

      updateCurrentEnergy.mutate({ userId: 7, energy: updatedEnergy });
    }
  };

  const handleIncrementAmountClick = () => {
    if (data && !isDisabledIncrementAmount) {
      setIsLoadingIncrementAmount(true);
      const currentLevel = data.increment_level + 1;
      const minCost = 5000;
      const maxCost = 20000000;
      const totalLevels = 20;

      if (data.coins >= data.increment_cost && currentLevel <= totalLevels) {
        const incrementCost = Math.round(
          minCost *
            Math.pow(maxCost / minCost, (currentLevel - 1) / (totalLevels - 1))
        );

        setData({
          ...data,
          coins: data.coins - data.increment_cost,
          increment_amount: data.increment_amount + 1,
          increment_level: currentLevel,
          increment_cost: incrementCost,
        });

        updateIncrementAmount.mutate({ userId: 7 });
      }
    }
  };

  const handleMaxEnergyClick = () => {
    if (data && !isDisabledMaxEnergy) {
      setIsLoadingMaxEnergy(true);
      const currentLevel = data.max_energy_level + 1;
      const minCost = 5000;
      const maxCost = 20000000;
      const totalLevels = 20;

      if (data.coins >= data.max_energy_cost && currentLevel <= totalLevels) {
        const incrementCost = Math.round(
          minCost *
            Math.pow(maxCost / minCost, (currentLevel - 1) / (totalLevels - 1))
        );

        setData({
          ...data,
          coins: data.coins - data.max_energy_cost,
          max_energy: data.max_energy + 500,
          max_energy_level: currentLevel,
          max_energy_cost: incrementCost,
        });

        updateMaxEnergy.mutate({ userId: 7 });
      }
    }
  };

  return (
    <div className='text-gray-800 grid place-items-center p-4'>
      {/* <pre className='text-white'>{JSON.stringify(data, null, 3)}</pre> */}
      <div className='text-white'>
        <h1
          className={`text-3xl font-bold text-center mb-4 ${playfairDisplayForHeadings.className}`}
        >
          Boosters
        </h1>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-medium'>Your Balance:</h2>
          <strong className='text-xl font-bold'>
            {data ? data.coins : ""}
          </strong>
        </div>
      </div>
      <BoosterCard
        title='Fill Up Energy'
        imageSrc='/solar-energy.gif'
        isDisabled={isDisabledFreeEnergy}
        isLoading={isLoadingFreeEnergy}
        onClick={handleFreeEnergyClick}
      >
        <p className='text-sm'>Next fill in:</p>
        <TimeCounter lastFreeEnergyTime={lastFreeEnergyTime?.getTime() || 0} />
      </BoosterCard>

      <BoosterCard
        title='Increment Amount'
        imageSrc='/tap-gesture.gif'
        isDisabled={isDisabledIncrementAmount}
        isLoading={isLoadingIncrementAmount}
        onClick={handleIncrementAmountClick}
      >
        <p className='text-sm mb-2'>Level: {data?.increment_level}/20</p>
        <p className='text-sm mb-2'>Cost: {data?.increment_cost} coins</p>
      </BoosterCard>

      <BoosterCard
        title='Energy Limit'
        imageSrc='/battery.gif'
        isDisabled={isDisabledMaxEnergy}
        isLoading={isLoadingMaxEnergy}
        onClick={handleMaxEnergyClick}
      >
        <p className='text-sm mb-2'>Level: {data?.max_energy_level}/20</p>
        <p className='text-sm mb-2'>Cost: {data?.max_energy_cost} coins</p>
      </BoosterCard>
    </div>
  );
};

const BoosterCard = ({
  title,
  imageSrc,
  isDisabled,
  isLoading,
  onClick,
  children,
}: {
  title: string;
  imageSrc: string;
  isDisabled: boolean;
  isLoading: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <div
    className={`w-full flex justify-between bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-lg overflow-hidden p-4 ${
      isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
    } ${isLoading ? "animate-pulse" : ""}`}
    onClick={onClick}
    style={{
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "12px",
    }}
  >
    <div className='flex gap-2 items-center justify-center'>
      <Image
        src={imageSrc}
        alt={title}
        width={60}
        height={60}
        className='rounded-full border border-gray-200'
      />
      <div className='text-left'>
        <h3
          className={`text-lg font-bold mb-1 ${playfairDisplayForHeadings.className}`}
        >
          {title}
        </h3>
        {children}
      </div>
    </div>
    <ChevronRightIcon className='w-8 h-8 text-gray-500' />
  </div>
);

export default Boosters;
