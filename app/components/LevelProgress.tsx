import React from "react";

interface Props {
  currentLevel: number;
  levelNames: string[];
  progress: number;
}

const LevelProgress: React.FC<Props> = ({
  currentLevel,
  levelNames,
  progress,
}) => {
  const progressPercentage = (currentLevel / levelNames.length) * 100;

  return (
    <div>
      <div className='flex justify-between'>
        <p>Your Level: {levelNames[currentLevel]}</p>
        <p className='text-sm'>
          Next level: {currentLevel + 2}
          <span className='text-[#95908a]'> / {levelNames.length}</span>
        </p>
      </div>
      <div className='bg-gradient-to-r from-red-500 from-10% via-orange-500 via-50% to-green-500 to-90% h-4 rounded-full'>
        <div
          className='float-right bg-gray-300 h-4 rounded-r-full'
          style={{ width: `${100 - progress}%` }}
          aria-label='Level progress'
          aria-valuenow={progress}
        />
      </div>
    </div>
  );
};

export default LevelProgress;
