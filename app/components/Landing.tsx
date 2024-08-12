import Image from "next/image";
import Link from "next/link";

const LandingPage: React.FC = () => {
  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      {/* Header */}
      <header className='bg-gray-800 text-white py-4 shadow-md'>
        <div className='container mx-auto flex justify-between items-center px-4'>
          <h1 className='text-3xl font-bold'>Scoreboard</h1>
          <div className='flex space-x-4'>
            <Link href='https://x.com' passHref>
              <Image
                src='/twitter.svg'
                alt='X Logo'
                width={54}
                height={54}
                className='hover:opacity-75 transition-opacity'
              />
            </Link>
            <Link href='https://telegram.org' passHref>
              <Image
                src='/telegram.svg'
                alt='Telegram Logo'
                width={54}
                height={54}
                className='hover:opacity-75 transition-opacity'
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className='flex-grow container mx-auto px-4 py-16 text-center'>
        <h1 className='text-4xl font-bold text-gray-800 mb-8'>
          Classic Kicks, Crypto Clicks!
        </h1>
        <p className='text-lg text-gray-700 leading-relaxed tracking-wide mb-12 bg-gray-100 p-4 rounded-lg shadow-sm max-w-screen-md mx-auto'>
          Relive your favorite sports moments while earning real rewards! Tap to
          score big in our addictive mini-games and watch your earnings
          multiply. Join the fun and start your crypto journey today!
        </p>

        <Link
          href={"/bot"}
          className='bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition'
        >
          Start Earning Now!
        </Link>

        <div className='my-12'>
          <Image
            src='/scoreboard.png'
            alt='Game Image'
            width={800}
            height={450}
            className='rounded-md shadow-lg mx-auto'
          />
        </div>
        <Link
          href={"/bot"}
          className='bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition'
        >
          Start Earning Now!
        </Link>
      </div>

      {/* Footer */}
      <footer className='bg-gray-800 text-gray-300 py-6'>
        <div className='container mx-auto text-center'>
          <p className='mb-4'>
            Use our Telegram mini-app now and start earning coins!
          </p>
          <p>&copy; 2024 Goal Rush Company. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
