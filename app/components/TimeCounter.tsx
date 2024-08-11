"use client";

import { useCallback, useEffect, useState } from "react";

const TimeCounter = ({
  lastFreeEnergyTime,
}: {
  lastFreeEnergyTime: number;
}) => {
  const twoHoursInSeconds = 2 * 60 * 60;

  const calculateTimeRemaining = useCallback(() => {
    const now = Date.now();
    const timeElapsed = Math.floor((now - lastFreeEnergyTime) / 1000); // Convert to seconds
    return Math.max(twoHoursInSeconds - timeElapsed, 0); // Ensure it doesn't go negative
  }, [lastFreeEnergyTime, twoHoursInSeconds]);

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining);

  useEffect(() => {
    setTimeRemaining(calculateTimeRemaining);

    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timerInterval);
          // Perform actions when the timer reaches zero
          console.log("Countdown complete!");
          return 0;
        } else {
          return prevTime - 1; // Decrease by 1 second
        }
      });
    }, 1000);

    return () => clearInterval(timerInterval); // Cleanup interval on component unmount
  }, [lastFreeEnergyTime, calculateTimeRemaining]);

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <p className='text-lg font-semibold'>{formatTime(timeRemaining)}</p>
    </div>
  );
};

export default TimeCounter;
