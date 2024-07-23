"use client";
import Link from "next/link";

const HeaderNav = ({
  session,
}: {
  session: { username: string; roles: string[] };
}) => {
  return (
    <nav className='bg-gray-800 text-white py-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <div className='flex items-center'>
          <Link href='/' className='text-lg font-bold'>
            My App
          </Link>
          <ul className='ml-8 flex space-x-4'>
            <li>
              <Link href='/about' className='hover:text-gray-300'>
                About
              </Link>
            </li>
            <li>
              <Link href='/products' className='hover:text-gray-300'>
                Products
              </Link>
            </li>
            <li>
              <Link href='/contact' className='hover:text-gray-300'>
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className='flex items-center'>
          {session ? (
            <div className='flex items-center space-x-4'>
              <span className='text-gray-300'>
                Welcome, {session.username}!
              </span>
              <Link href='/logout' className='hover:text-gray-300'>
                Logout
              </Link>
            </div>
          ) : (
            <div className='flex items-center space-x-4'>
              <Link href='/login' className='hover:text-gray-300'>
                Login
              </Link>
              <Link href='/signup' className='hover:text-gray-300'>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default HeaderNav;
