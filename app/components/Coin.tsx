"use client";

import { atom, useAtom } from "jotai";
import { useEffect, useState, useRef, useCallback } from "react";
import Header from "../components/Header";
import Spinner from "./Spinner";
import { incrementCoins } from "../lib/actions";
import { useTelegram } from "../contexts/TelegramProvider";
import { CurrencyYenIcon } from "@heroicons/react/24/outline";
import Pie from "./Pie";

export const coinsAtom = atom(0);
const CURRENT_ENERGY = 100;
const MAX_ENERGY = 10032;
const INCREMENT_BY = 7;
const DEBOUNCE_DELAY = 3000;
const Levels = [
  { name: "Novice Navigator", minPoint: 0 },
  { name: "Apprentice Achiever", minPoint: 3162 },
  { name: "Skill Seeker", minPoint: 10000 },
  { name: "Craftsmen Champion", minPoint: 31623 },
  { name: "Expert Explorer", minPoint: 1000000 },
  { name: "Master of Mastery", minPoint: 316227 },
  { name: "Grandmaster", minPoint: 1000000 },
  { name: "Legendary Pro", minPoint: 3162277 },
  { name: "Epic Tycoon", minPoint: 10000000 },
  { name: "Infinity Mogul", minPoint: 100000000 },
];

const Coin = () => {
  const { user } = useTelegram();
  const [totalCount, setTotalCount] = useAtom(coinsAtom);
  const [batchedIncrements, setBatchedIncrements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [progress, setProgress] = useState({
    percentage: 100,
    colour: "hsl(120, 60%, 45%)",
  });

  useEffect(() => {
    if (totalCount !== null) {
      setIsLoading(false);
    }
  }, [totalCount]);

  const fetchInitialCoins = useCallback(async () => {
    try {
      const userId = user?.id || 1;
      const response = await fetch("/api/bot/coins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (response.ok) {
        setTotalCount(data.coins);
        setProgress({
          percentage: data.progress ? data.progress : 100,
          colour: data.colour ? data.colour : "hsl(120, 60%, 45%)",
        });
      } else {
        console.error("Failed to fetch initial coins", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch initial coins", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, setTotalCount]);

  useEffect(() => {
    fetchInitialCoins();
  }, [fetchInitialCoins]);

  const incrementTotalCount = useCallback(() => {
    setTotalCount((prev) => prev + INCREMENT_BY);
    setBatchedIncrements((prev) => prev + INCREMENT_BY);
  }, [setTotalCount]);

  useEffect(() => {
    if (batchedIncrements > 0) {
      setIsSaving(true);
      debounceTimeout.current = setTimeout(async () => {
        try {
          const response = await incrementCoins(
            user?.id || 1,
            batchedIncrements
          );
          if (response.error) {
            console.error(response.error);
          } else {
            setBatchedIncrements(0);
          }
        } catch (error) {
          console.error("Failed to increment coins", error);
        } finally {
          setIsSaving(false);
        }
      }, DEBOUNCE_DELAY);
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [batchedIncrements, user?.id]);

  const [taps, setTaps] = useState<
    {
      id: number;
      x: number;
      y: number;
    }[]
  >([]);

  const handleCoinClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const maxProgress = 367;
    const { currentTarget: coinBtn, clientX, clientY, pageX, pageY } = e;
    const { left, top, width, height } = coinBtn.getBoundingClientRect();
    const clickX = clientX - left - width / 2;
    const clickY = clientY - top - height / 2;

    coinBtn.style.transform = `perspective(1000px) rotateX(${
      -clickY / 10
    }deg) rotateY(${clickX / 10}deg)`;
    setTimeout(() => (coinBtn.style.transform = ""), 100);

    setTaps([...taps, { id: Date.now(), x: pageX, y: pageY }]);
    incrementTotalCount();
    generateProgressValues();
  };

  const generateProgressValues = () => {
    setProgress((prevProgress) => {
      const newPercentage = Math.max(0, prevProgress.percentage - INCREMENT_BY);
      return {
        percentage: newPercentage,
        colour: `hsl(51, 100%, 50%)`,
        // ${Math.random() * 360}, ${Math.random() * 50 + 50}%, ${
        //   Math.random() * 30 + 20
        // }
      };
    });
  };

  if (isLoading) {
    return (
      <div className='animate-pulse min-h-[calc(100vh_-_4.25rem)] bg-gray-800 flex flex-col items-center justify-center'>
        <p className='text-white text-xl'>Loading...</p>
      </div>
    );
  }

  return (
    <div className='bg-gray-800 min-h-[calc(100vh_-_4.25rem)] flex flex-col items-center justify-center'>
      <Header username={user?.first_name || "no name"} />
      <p className='flex text-yellow-400 text-4xl'>
        <CurrencyYenIcon className='w-8' />
        {totalCount}
      </p>
      <button onClick={handleCoinClick} className='rounded-full m-auto'>
        <span className='sr-only'>Add Coins</span>
        <Pie percentage={progress.percentage} colour={progress.colour} />
      </button>
      {isSaving && (
        <div className='flex gap-1 text-xs bg-gray-100 p-1 rounded-md fixed top-2 left-2'>
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
          {INCREMENT_BY}
        </div>
      ))}
    </div>
  );
};

export default Coin;
