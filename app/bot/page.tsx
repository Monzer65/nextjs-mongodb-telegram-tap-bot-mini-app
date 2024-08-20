"use client";

import Link from "next/link";
// import Ball from "../components/Ball";
// import Coin from "../components/Coin";
// import LoadingSpinner from "../components/LoadingSpinner";
// import NavLinks from "../components/NavigationBar";
// import { useTelegram } from "../contexts/TelegramProvider";
// import netImage from "../../public/net-769px.jpg";
// import { useEffect, useState } from "react";
// import { useAtom } from "jotai";
// import {
//   userIdAtom,
//   coinsAtom,
//   incrementByAtom,
//   incrementByCostAtom,
//   incrementSpeedAtom,
//   incrementSpeedCostAtom,
//   maxEnergyAtom,
//   maxEnergyCostAtom,
//   maxEnergyLevelAtom,
// } from "../lib/atoms";

const BotHome = () => {
  // const [, setUserId] = useAtom(userIdAtom);
  // const [, setCoins] = useAtom(coinsAtom);
  // const [, setIncrementBy] = useAtom(incrementByAtom);
  // const [, setIncrementByCost] = useAtom(incrementByCostAtom);
  // const [, setIncrementSpeed] = useAtom(incrementSpeedAtom);
  // const [, setIncrementSpeedCost] = useAtom(incrementSpeedCostAtom);
  // const [, setMaxEnergy] = useAtom(maxEnergyAtom);
  // const [, setMaxEnergyCost] = useAtom(maxEnergyCostAtom);
  // const [, setMaxEnergyLevel] = useAtom(maxEnergyLevelAtom);
  // const { user } = useTelegram();
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchInitialCoins = async () => {
  //     try {
  //       const userId = user?.id || 1;
  //       const response = await fetch("/api/bot/userData", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ userId }),
  //       });

  //       const data = await response.json();

  //       // Update the global state with the fetched data
  //       setUserId(data.userId);
  //       setCoins(data.coins);
  //       setIncrementBy(data.incrementBy);
  //       setIncrementByCost(data.incrementByCost);
  //       setIncrementSpeed(data.incrementSpeed);
  //       setIncrementSpeedCost(data.incrementSpeedCost);
  //       setMaxEnergy(data.maxEnergy);
  //       setMaxEnergyCost(data.maxEnergyCost);
  //       setMaxEnergyLevel(data.maxEnergyLevel);
  //     } catch (error) {
  //       console.error("Failed to fetch initial coins", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchInitialCoins();
  // }, [
  //   user?.id,
  //   setCoins,
  //   setIncrementBy,
  //   setIncrementByCost,
  //   setIncrementSpeed,
  //   setIncrementSpeedCost,
  //   setMaxEnergy,
  //   setMaxEnergyCost,
  //   setMaxEnergyLevel,
  //   setUserId,
  // ]);

  // const { data, setData } = useUserState();
  // function incrementCoins() {
  //   return setData({
  //     coins:
  //       data.data === undefined || data.data === null
  //         ? 123
  //         : data.data.coins + data.data.incrementBy,
  //   });
  // }
  return (
    <>
      <div>Bot Home Page</div>
      <div className='p-2 bg-blue-700 text-white rounded-md'>
        <Link href={"/bot/clicker"}>Clicker</Link>
      </div>
      {/* <div>{data?.data?.coins}</div>
      <button onClick={incrementCoins}>Click</button>
      <Link href={"/bot/earn"}>Earn</Link> */}
      {/* {user || loading ? (
        <div
          style={{
            backgroundImage: `url(${netImage.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "100%",
          }}
          className='grid place-items-center min-h-screen'
        >
          <LoadingSpinner />
        </div>
      ) : (
        <div className='bg-gray-800 grid min-h-screen'>
          <Ball />
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio
            provident quia enim veniam doloribus! Maiores, repellendus aliquam
            quos alias quibusdam eligendi debitis, soluta vitae beatae ratione
            reprehenderit modi. Beatae, quaerat!
          </p>
          <NavLinks />
        </div>
      )} */}
    </>
  );
};

export default BotHome;
