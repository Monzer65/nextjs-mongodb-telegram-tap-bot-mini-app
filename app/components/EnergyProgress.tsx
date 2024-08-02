import { BoltIcon } from "@heroicons/react/24/outline";

const EnergyProgress = ({
  currentEnergy,
  maxEnergyLevel,
}: {
  currentEnergy: number;
  maxEnergyLevel: number;
}) => {
  return (
    <div className='flex items-center gap-2 mb-16 px-4 pb-4'>
      <div className='flex gap-2 text-white rounded-md'>
        <BoltIcon className='w-5 text-yellow-500' />
        <p className='font-bold'>{Math.floor(currentEnergy)}</p>/
        <p className=' opacity-75'>{maxEnergyLevel}</p>
      </div>
      <div className='flex-1 h-4 bg-gray-200 rounded-full'>
        <div
          className='h-full bg-yellow-500 rounded-full'
          style={{
            width: `${(currentEnergy / maxEnergyLevel) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default EnergyProgress;
