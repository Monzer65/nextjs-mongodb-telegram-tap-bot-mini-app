// "use client";
// import { useAtom } from "jotai";
// import Image from "next/image";
// import { coinsAtom, incrementByAtom } from "../lib/atoms";
// const Ball = () => {
//   const [balance, setBalance] = useAtom(coinsAtom);
//   const [perTap] = useAtom(incrementByAtom);

//   function handleBallTap() {
//     return setBalance((prev) => prev + perTap);
//   }
//   return (
//     <button onClick={handleBallTap} className='m-auto border text-white'>
//       <p>per tap: {perTap}</p>
//       <p>balance: {balance}</p>
//       <Image src='/ball.svg' alt='ball svg' width={150} height={150} />
//     </button>
//   );
// };

// export default Ball;
