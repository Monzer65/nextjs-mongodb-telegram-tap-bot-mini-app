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
import Spinner from "./Spinner";
import EnergyProgress from "./EnergyProgress";
import Image from "next/image";
import netImage from "@/public/net-769px.jpg";
import InitialLoading from "./InitialLoading";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Balance() {
  const { user } = useTelegram();
  const queryClient = useQueryClient();
  const [batchedIncrements, setBatchedIncrements] = useState(0);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { data, isLoading, isError, setData } = useUserState(7);

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
    <div className='p-4'>
      {!user ? (
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
          <Link href={"/bot"} className='px-4 pt-2'>
            <span className='sr-only'>Back to Bot Home Page</span>
            <ArrowLeftIcon className='w-6' />
          </Link>
          <InitialLoading />
        </div>
      ) : (
        <>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              {isError ? (
                <div>
                  <Link href={"/bot"} className='px-4 pt-2'>
                    <span className='sr-only'>Back to Bot Home Page</span>
                    <ArrowLeftIcon className='w-6' />
                  </Link>
                  Error occured; try refresh the page later
                </div>
              ) : (
                <>
                  <Link href={"/bot"} className='mb-2 flex items-center'>
                    <ArrowLeftIcon className='w-6' />
                    <span className='text-xs'>Back to Bot Home Page</span>
                  </Link>
                  <header className='shadow-lg shadow-yellow-300 rounded-md p-1'>
                    <p>welcome username</p>
                    <div className='mt-4 w-full'>
                      <div className='flex justify-between text-[8px]'>
                        <span className='whitespace-nowrap'>
                          Current Level: {currentLevelName}
                        </span>
                        <span className='whitespace-nowrap'>
                          Next: {nextLevelName}
                        </span>
                      </div>

                      <div className='relative max-w-full bg-gray-200 h-2 rounded-full'>
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
                    </div>
                  </header>

                  <div className='grid place-items-center w-full  mt-8'>
                    {/* <pre>{JSON.stringify(data, null, 3)}</pre> */}
                    <div>
                      <p>
                        Your Balance:{" "}
                        <span className='text-yellow-500 font-bold text-2xl'>
                          <strong>{data ? data.coins : ""}</strong>
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={handleCoinClick}
                      className='w-full max-w-[400px] rounded-full'
                    >
                      <span className='sr-only'>tap button</span>
                      <Image
                        src='/ball.svg'
                        alt='ball svg'
                        width={150}
                        height={150}
                        className='w-full sm:w-auto m-auto rounded-full object-fill'
                      />
                    </button>
                    <EnergyProgress
                      currentEnergy={data ? data.current_energy : 100}
                      maxEnergy={data ? data.max_energy : 500}
                    />
                    {isSaving && (
                      <div className='flex items-center gap-4 text-xs bg-gray-100 p-1 rounded-md fixed top-20 left-2 text-gray-800'>
                        <Spinner size={5} /> Saving ...
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
    </div>
  );
}
