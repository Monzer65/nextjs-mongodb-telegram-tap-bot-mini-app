import { BoltIcon } from "@heroicons/react/24/outline";

const EnergyProgress = ({
  currentEnergy,
  maxEnergy,
}: {
  currentEnergy: number;
  maxEnergy: number;
}) => {
  return (
    <div className='flex items-center gap-2'>
      <div className='flex gap-2 text-white rounded-md'>
        <BoltIcon className='w-5 text-yellow-500' />
        <p className='font-bold'>{Math.floor(currentEnergy)}</p>/
        <p className=' opacity-75'>{maxEnergy}</p>
      </div>
      <div className='flex-1 h-4 bg-gray-200 rounded-full'>
        <div
          className='h-full bg-yellow-500 rounded-full'
          style={{
            width: `${(currentEnergy / maxEnergy) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default EnergyProgress;
