import NavLinks from "@/app/components/NavigationBar";
import { ChevronRightIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

const BoostPage = () => {
  return (
    <div className='bg-gray-800 min-h-screen grid gap-4 place-items-center p-8'>
      <h2 className='text-white text-center mb-8'>
        Your Balance <br /> <span className='font-bold text-4xl'>54000000</span>
      </h2>

      <h1 className='text-white font-bold'>Boosters</h1>
      <div className='flex justify-between items-center bg-gray-300 rounded-md shadow-md min-w-[250px] max-w-[400px] p-2 cursor-pointer'>
        <div className='flex items-center gap-2'>
          <Image
            src='/solar-energy.gif'
            alt='bolt'
            width={50}
            height={50}
            className='rounded-md object-fill'
          />
          <div>
            <p>Free Energy</p>
            <div className='flex items-center text-yellow-600'>
              <LockClosedIcon className=' w-5' />
              <p>
                <span className='font-bold'>2000</span>{" "}
                <span className='text-gray-700 text-sm'>lvl 4</span>
              </p>
            </div>
          </div>
        </div>
        <ChevronRightIcon className='w-8' />
      </div>
      <div className='flex justify-between items-center bg-gray-300 rounded-md shadow-md min-w-[250px] max-w-[400px] min-w- p-2 cursor-pointer'>
        <div className='flex items-center gap-2'>
          <Image
            src='/tap-gesture.gif'
            alt=''
            width={50}
            height={50}
            className='rounded-md object-fill'
          />
          <div>
            <p>Multitap</p>
            <div className='flex items-center text-yellow-600'>
              <LockClosedIcon className=' w-5' />
              <p>
                <span className='font-bold'>2000</span>{" "}
                <span className='text-gray-700 text-sm'>lvl 4</span>
              </p>
            </div>
          </div>
        </div>
        <ChevronRightIcon className='w-8' />
      </div>
      <div className='flex justify-between items-center bg-gray-300 rounded-md shadow-md min-w-[250px] max-w-[400px] min-w- p-2 cursor-pointer'>
        <div className='flex items-center gap-2'>
          <Image
            src='/bolt.gif'
            alt=''
            width={50}
            height={50}
            className='rounded-md'
          />
          <div>
            <p>Recharge Speed</p>
            <div className='flex items-center text-yellow-600'>
              <LockClosedIcon className=' w-5' />
              <p>
                <span className='font-bold'>2000</span>{" "}
                <span className='text-gray-700 text-sm'>lvl 4</span>
              </p>
            </div>
          </div>
        </div>
        <ChevronRightIcon className='w-8' />
      </div>
      <div className='flex justify-between items-center bg-gray-300 rounded-md shadow-md min-w-[250px] max-w-[400px] min-w- p-2 cursor-pointer'>
        <div className='flex items-center gap-2'>
          <Image
            src='/battery.gif'
            alt=''
            width={50}
            height={50}
            className='rounded-md object-contain'
          />
          <div>
            <p>Energy Limit</p>
            <div className='flex items-center text-yellow-600'>
              <LockClosedIcon className=' w-5' />
              <p>
                <span className='font-bold'>2000</span>{" "}
                <span className='text-gray-700 text-sm'>lvl 4</span>
              </p>
            </div>
          </div>
        </div>
        <ChevronRightIcon className='w-8' />
      </div>
      <NavLinks />
    </div>
  );
};

export default BoostPage;
