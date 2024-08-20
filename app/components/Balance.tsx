"use client";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserState } from "../states/userData";
import { useTelegram } from "../contexts/TelegramProvider";
import { incrementCoins } from "../lib/actions";
import {
  calculateProgress,
  determineCurrentLevel,
  LEVELS,
} from "../lib/determineLevel";
import LoadingSpinner from "./LoadingSpinner";
import Spinner from "./Spinner";
import EnergyProgress from "./EnergyProgress";
import Image from "next/image";
import netImage from "@/public/net-769px.jpg";

export default function Balance() {
  const { user } = useTelegram();
  const queryClient = useQueryClient();
  const [batchedIncrements, setBatchedIncrements] = useState(0);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { data, isLoading, isError, setData, resetData } = useUserState(7);

  const increment = useMutation({
    mutationFn: async ({ userId, coins }: { userId: number; coins: number }) =>
      await incrementCoins(userId, coins),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
  });

  useEffect(() => {
    if (batchedIncrements > 0) {
      setIsSaving(true);
      debounceTimeout.current = setTimeout(() => {
        increment.mutate({ userId: 7, coins: batchedIncrements });

        setBatchedIncrements(0);
        setIsSaving(false);
      }, 3000);
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [batchedIncrements, increment, user?.id]);

  const [taps, setTaps] = useState<
    {
      id: number;
      x: number;
      y: number;
    }[]
  >([]);

  if (data && "error" in data) {
    return <div>Error: {data.error}</div>;
  }

  const handleCoinClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { currentTarget: coinBtn, clientX, clientY, pageX, pageY } = e;
    const { left, top, width, height } = coinBtn.getBoundingClientRect();
    const clickX = clientX - left - width / 2;
    const clickY = clientY - top - height / 2;

    coinBtn.style.transform = `perspective(1000px) rotateX(${
      -clickY / 10
    }deg) rotateY(${clickX / 10}deg)`;
    setTimeout(() => (coinBtn.style.transform = ""), 100);

    if (data && data.current_energy - data.increment_amount < 0) {
      return;
    }

    setTaps([...taps, { id: Date.now(), x: pageX, y: pageY }]);

    if (data) {
      const newCoins = data.coins + data.increment_amount;
      const newLevel = determineCurrentLevel(newCoins);
      const newCurrentEnergy = data.current_energy - data.increment_amount;
      setBatchedIncrements((prev) => prev + data.increment_amount);
      setData({
        ...data,
        coins: newCoins,
        current_energy: newCurrentEnergy,
        level: LEVELS[newLevel].name,
      });
    }
  };

  const currentLevelIndex = determineCurrentLevel(data ? data.coins : 0);
  const currentLevelName = LEVELS[currentLevelIndex].name;
  const nextLevelName = LEVELS[currentLevelIndex + 1]
    ? LEVELS[currentLevelIndex + 1].name
    : "Max Level";

  return (
    <>
      {user ? (
        <div
          style={{
            backgroundImage: `url(${netImage.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "100%",
          }}
          className='absolute inset-0 z-[999999] grid place-items-center min-h-screen text-gray-800'
        >
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              {isError ? (
                <div>Error occured; try refresh the page later</div>
              ) : (
                <>
                  <div>User Data</div>
                  <div>
                    <pre>{JSON.stringify(data, null, 3)}</pre>

                    <div className='flex items-center justify-between mt-4'>
                      <span className='text-sm text-gray-200 whitespace-nowrap'>
                        {currentLevelName}
                      </span>

                      <div className='relative w-full mx-2 bg-gray-200 h-4 rounded-full'>
                        <div className='bg-gradient-to-r from-red-500 via-orange-500 to-green-500 h-full rounded-full' />
                        <div
                          className='absolute top-0 right-0 bg-gray-300 h-full rounded-full transition-all duration-500 ease-in-out'
                          style={{
                            width: `${
                              100 - calculateProgress(data ? data.coins : 0)
                            }%`,
                          }}
                        />
                      </div>

                      <span className='text-sm text-gray-200 whitespace-nowrap'>
                        {nextLevelName}
                      </span>
                    </div>

                    <button onClick={handleCoinClick} className='border'>
                      <span className='sr-only'>tap button</span>
                      <Image
                        src='/ball.svg'
                        alt='ball svg'
                        width={150}
                        height={150}
                      />
                    </button>
                    <EnergyProgress
                      currentEnergy={data ? data.current_energy : 100}
                      maxEnergy={data ? data.max_energy : 500}
                    />
                    {isSaving && (
                      <div className='flex gap-1 text-xs bg-gray-100 p-1 rounded-md fixed top-2 left-2 text-gray-800'>
                        <Spinner size={5} />
                        Saving ...
                      </div>
                    )}
                    {taps.map((tap) => (
                      <div
                        key={tap.id}
                        className='absolute text-5xl font-bold text-yellow-500 pointer-events-none z-10 animate-float-up'
                        style={{
                          top: `${tap.y - 42}px`,
                          left: `${tap.x - 28}px`,
                        }}
                        onAnimationEnd={() =>
                          setTaps((prev) => prev.filter((p) => p.id !== tap.id))
                        }
                      >
                        {data ? data.increment_amount : 1}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
