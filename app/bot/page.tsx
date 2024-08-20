"use client";

import Link from "next/link";

const BotHome = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4'>
      <h1 className='text-4xl font-bold mb-8 text-center'>
        Welcome to ScoreBoard Bot
      </h1>
      <p className='text-lg mb-8 max-w-lg text-center'>
        Dive into our interactive bot experience! Click below to start playing
        and earning rewards.
      </p>
      <div className='p-4 bg-white text-blue-700 rounded-lg shadow-lg transform transition-transform hover:scale-105'>
        <Link href='/bot/clicker' className='text-2xl font-semibold'>
          Go to Clicker
        </Link>
      </div>
      <div className='mt-8 p-4 bg-yellow-400 text-gray-900 rounded-lg shadow-lg'>
        <h2 className='text-2xl font-bold mb-2'>
          Exciting Features Coming Soon!
        </h2>
        <p className='text-lg'>
          Beyond the Clicker game, get ready for live sports news, media
          highlights, match schedules, player stats, and much more. Stay tuned
          as we bring you the ultimate sports hub!
        </p>
      </div>

      <footer className='sticky bottom-4 text-sm text-gray-200 bg-slate-800 p-2 mt-2'>
        {/* <p>&copy; 2024 GoalRush. All rights reserved.</p> */}
        <p>Powered by GoalRush&reg;&copy;</p>
      </footer>
    </div>
  );
};

export default BotHome;
